package com.campforest.backend.chatting.controller;

import java.util.List;

import com.campforest.backend.chatting.dto.CommunityChatRoomListDto;
import com.campforest.backend.chatting.entity.CommunityChatMessage;

import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.service.CommunityChatService;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;
import com.campforest.backend.notification.model.NotificationType;
import com.campforest.backend.notification.service.NotificationService;
import com.campforest.backend.user.model.Users;
import com.campforest.backend.user.repository.jpa.UserRepository;
import com.campforest.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/communitychat")
@RequiredArgsConstructor
public class CommunityChatController {
    private final CommunityChatService communityChatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final NotificationService notificationService;

    @PostMapping("/room")
    public ApiResponse<?> createChatRoom(
        Authentication authentication,
        @RequestBody Long user2) {
        try {
        if (authentication == null) {
            return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
        }
            Users user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new Exception("유저 정보 조회 실패"));
            Long nowId = user.getUserId();
            CommunityChatDto room = communityChatService.createOrGetChatRoom(nowId, user2);

            Users receiver = userService.findByUserId(user2)
                    .orElseThrow(() -> new IllegalArgumentException("사용자 조회 실패"));

            notificationService.createChatNotification(receiver, user, NotificationType.CHAT, "님과 채팅이 시작되었습니다.",
                room.getRoomId());

        return ApiResponse.createSuccess(room,"채팅방 로드 성공하였습니다");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.CHAT_ROOM_CREATION_FAILED);
        }
    }
    @MessageMapping("/{roomId}/send")
    @SendTo("/sub/community/{roomId}")
    public CommunityChatMessage sendMessage(
        @DestinationVariable Long roomId,
        @Payload CommunityChatMessage message) {

        return communityChatService.saveMessage(roomId, message);
    }

    @MessageMapping("/room/{roomId}/markAsRead")
    public void markMessagesAsReadWebSocket(
        @DestinationVariable Long roomId,
        @Payload Long userId) {
        try {
            communityChatService.markMessagesAsRead(roomId, userId);

            CommunityChatMessage message = new CommunityChatMessage();
            message.setType("READ");
            message.setSenderId(userId);

            messagingTemplate.convertAndSend("/sub/community/" + roomId, message                                          );
        } catch (Exception e) {
            CommunityChatMessage errorMessage = new CommunityChatMessage();
            errorMessage.setType("ERROR");
            errorMessage.setContent("메시지 읽음 처리 실패");

            messagingTemplate.convertAndSend("/sub/community/" + roomId, errorMessage);
        }
    }

    @GetMapping("/room/{roomId}/messages")
    public  ApiResponse<?> getChatHistory(@PathVariable Long roomId, Authentication authentication) throws Exception {
        Users user = userService.findByEmail(authentication.getName())
            .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

        Long userId = user.getUserId();

        try {
        List<CommunityChatMessage> messages = communityChatService.getChatHistory(roomId, userId);
        return  ApiResponse.createSuccess(messages, "채팅 메시지 조회 성공");
        }catch (Exception e) {
            return ApiResponse.createError(ErrorCode.CHAT_HISTORY_NOT_FOUND);
        }
    }

    //필요없을듯?
    @GetMapping("/room/{roomId}/unreadCount")
    public ApiResponse<?> getUnreadMessageCount(@PathVariable Long roomId, @RequestParam Long userId) {
       try {
        Long unreadCount = communityChatService.getUnreadMessageCount(roomId, userId);
        return ApiResponse.createSuccess(unreadCount, "읽지 않은 메시지 수를 가져오기 성공.");
       } catch (Exception e) {
        return ApiResponse.createError(ErrorCode.CHAT_UNREAD_COUNT_FAILED);
       }
    }

    //user가 속한 채팅방 목록 가져옴.
    // 각 채팅방 별 최근 메시지와, 안읽은 메세지 수 가져옴
    @GetMapping("/rooms")
    public ApiResponse<?> getChatRoomsForUser(Authentication authentication) {
        try {
            if (authentication == null) {
                return ApiResponse.createError(ErrorCode.INVALID_AUTHORIZED);
            }
            Users user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            Long nowId = user.getUserId();


        List<CommunityChatRoomListDto> rooms = communityChatService.getChatRoomsForUser(nowId);
        return ApiResponse.createSuccess(rooms,"채팅방 목록 가져오기 성공");
        }catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.createError(ErrorCode.CHAT_ROOM_LIST_FAILED);
        }
    }

    @PostMapping("/room/{roomId}/exit")
    public ApiResponse<?> exitChatRoom(@PathVariable Long roomId, Authentication authentication) {
        try {
            Users user = userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new Exception("유저 정보 조회 실패"));

            Long userId = user.getUserId();

            communityChatService.exitChatRoom(roomId, userId);

            return ApiResponse.createSuccess(null, "채팅방 나가기 성공");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.CHAT_ROOM_EXIT_FAILED);
        }
    }
}