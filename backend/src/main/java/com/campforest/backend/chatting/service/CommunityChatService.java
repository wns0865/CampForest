package com.campforest.backend.chatting.service;


import com.campforest.backend.chatting.dto.CommunityChatDto;
import com.campforest.backend.chatting.dto.CommunityChatRoomListDto;
import com.campforest.backend.chatting.entity.CommunityChatMessage;

import java.util.List;

public interface CommunityChatService {

    public CommunityChatDto createOrGetChatRoom(Long user1Id, Long user2Id);

    CommunityChatMessage saveMessage(Long roomId, CommunityChatMessage message);

    List<CommunityChatMessage> getChatHistory(Long roomId, Long userId);

    Long getUnreadMessageCount(Long roomId, Long userId);

    void markMessagesAsRead(Long roomId, Long userId);

    public List<CommunityChatRoomListDto> getChatRoomsForUser(Long userId);

    void exitChatRoom(Long roomId, Long userId);
}
