import React, { useEffect, useState } from 'react'
import { ReactComponent as LeftArrow } from '@assets/icons/arrow-left.svg'
import ChatUserList from '@components/Chat/ChatUserList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { selectCommnunity, selectTransaction } from '@store/chatSlice';

type Props = {
  isExtendMenuOpen: boolean;
  toggleExtendMenu: (param:string) => void;
}

const NavbarLeftExtendChat = (props: Props) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userStore.userId);
  const isLogin = useSelector((state: RootState) => state.userStore.isLoggedIn);
  const selectedCategory = useSelector((state: RootState) => state.chatStore.selectedCategory);
  const chatState = useSelector((state: RootState) => state.chatStore);

  useEffect(() => {
    if (props.isExtendMenuOpen) {
      // 모달이 열릴 때 히스토리에 가상의 상태를 추가
      window.history.pushState(null, '', window.location.pathname);

      // popstate 이벤트 리스너 추가
      const handlePopState = () => {
        props.toggleExtendMenu('chat');
      };

      window.addEventListener('popstate', handlePopState);

      // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [props.isExtendMenuOpen, props.toggleExtendMenu]);

  return (
    <div
      className={`
        ${props.isExtendMenuOpen ? 
          (
            chatState.isChatOpen ? 
            'max-md:-translate-x-[100%] max-lg:-translate-x-[100%] translate-x-[5rem]' : 
            'max-md:translate-x-0 translate-x-[5rem]'
          ) : 
          '-translate-x-full'
        }
        fixed z-[35] max-md:w-full w-[20rem] max-md:h-[calc(100%-3.2rem)] h-[100%]
        bg-light-white border-light-border-1
        dark:bg-dark-white dark:border-dark-border-1
        border-r transition-all duration-300 ease-in-out
      `}
    >
      {/* 상단 */}
      <div className=
        {`
          flex items-center h-[3rem] md:h-[5rem] ps-[1rem]
          bg-light-white
          dark:bg-dark-white
        `}
      >
        <LeftArrow 
          onClick={() => props.toggleExtendMenu('chat')}
          className={`
            w-[1.25rem] h-[1.25rem] me-[0.75rem] 
            fill-light-border-icon
            dark:fill-dark-border-icon
            cursor-pointer
          `}
        />
        <p className={`text-2xl font-medium`}>채팅</p>
      </div>

      {/* 채팅방 카테고리 */}
      <div 
        className={`
          flex relative w-full h-[2.5rem]
          bg-light-white
          dark:bg-dark-white
        `}
      >
        <div
          className={`
            flex flex-all-center w-1/2 h-full
            text-light-text border-light-border-2
            dark:text-dark-text dark:border-dark-border-2
            border-b cursor-pointer font-medium
          `}
          onClick={() => dispatch(selectCommnunity())}
        >
          일반
        </div>
        <div
          className={`
            flex flex-all-center w-1/2 h-full
            text-light-text border-light-border-2
            dark:text-dark-text dark:border-dark-border-2
            border-b cursor-pointer font-medium
          `}
          onClick={() => dispatch(selectTransaction())}
        >
          거래
        </div>
        {/* 밑줄 효과 */}
        <div
          className={`
            ${selectedCategory === '일반' ? 'left-0' : selectedCategory === '거래' ? 'left-1/2' : ''}
            absolute bottom-0 h-[0.1rem] w-1/2
            bg-light-signature
            dark:bg-dark-signature
            transition-all duration-300 ease-in-out
          `}
        />
      </div>

      {/* 채팅 유저 목록 */}
      <ChatUserList
        isLogin={isLogin} 
        userId={userId} 
      />
    </div>
  )
}

export default NavbarLeftExtendChat;