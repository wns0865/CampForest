import React from 'react'
import { ReactComponent as HeartOutline } from '@assets/icons/heart-outline.svg'
import { ReactComponent as BookmarkEmpty } from '@assets/icons/bookmark-empty.svg'
import { ReactComponent as MoreDot} from '@assets/icons/more-dots.svg'

const Board = () => {
  return (
    <div className='min-w-[22rem] my-[2rem] shadow-md rounded-md px-[1.5rem] py-[1rem] md:py-[0.5rem]'>
      <div className='flex items-center h-[3.5rem] mb-[2rem]  md:mb-[1rem]'>
        <div className='bg-red-100 rounded-full size-[4rem] md:size-[3rem] shadow-md bg-white overflow-hidden'></div>
        <div className='ms-[1rem]'>
          <div className='text-2xl md:text-lg'>하치와레미콘</div>
          <div className='text-lg md:text-sm'>캠핑 후기 {'>'} 경기</div>
        </div>
        <div className='ms-auto mb-auto'>
         <MoreDot className='size-10 md:size-8'/>
        </div>
      </div>
      <div className='-mx-[1.5rem] md:mx-0'>
        <div className='text-center inline-block bg-blue-300 w-full h-[22rem]'>Picture</div>
        <div className='mx-[1.5rem] md:mx-0 py-[1rem] px-[0.5rem]'>
          <div className='text-xl md:text-lg'>이번주 가평계곡 앞 펜션 다녀왔슴둥</div>
          <div className='my-[0.5rem] md:text-xs'>_분 전</div>
        </div>
      </div>
      <div className='flex text-center mb-[1rem]'>
        <div>
          <HeartOutline className='inline md:size-[1.25rem]'/>
          <span className='mx-[0.5rem] md:text-sm'>3</span>
        </div>
        <div>
          <HeartOutline className='inline md:size-[1.25rem]'/>
          <span className='mx-[0.5rem] md:text-sm'>3</span>
        </div>
        <div>
          <BookmarkEmpty className='inline md:size-[1.5rem]'/>
        </div>
      </div>
    </div>
  )
}

export default Board;