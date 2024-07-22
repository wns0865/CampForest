import React, { useState } from 'react'

import KakaoIcon from '@assets/icons/kakao.png'
import NaverIcon from '@assets/icons/naver.png'
import { Link } from 'react-router-dom'

type LoginForm = {
  userEmail: string,
  userPassword: string
}

function Login() {
  const [values, setValues] = useState<LoginForm>({
    userEmail: "",
    userPassword: ""
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    })
    console.log(values)
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='bg-white p-6 w-full md:max-w-3xl lg:w-[40rem] lg:p-0'>
        <h3 className='text-center pb-[0.75rem] text-[2rem] mb-10'>로그인</h3>

        {/* 로그인 폼 */}
        <form>
          {/* 이메일 */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-left mb-2">이메일</label>
            <input 
              type="email" 
              id="email" 
              name="userEmail"
              className="w-full px-4 py-2 border-b focus:outline-none rounded-md" 
              placeholder="이메일을 입력하세요."
              onChange={handleChange}
              required 
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-2">
            <label htmlFor="password" className="block text-gray-700 text-left rounded-md mb-2">비밀번호</label>
            <input 
              type="password" 
              id="password"
              name="userPassword"
              className="w-full px-4 py-2 border-b focus:outline-none rounded-md" 
              placeholder="비밀번호를 입력하세요." 
              onChange={handleChange}
              required 
            />
          </div>

          {/* 비밀번호 잊으셨나요? */}
          <div className="flex justify-between items-center mb-6">
            <a href="/" className="text-gray-400 text-sm text-right w-full font-medium">비밀번호를 잊으셨나요?</a>
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-[#000000c0] duration-200">Login</button>
        </form>

        {/* 회원가입 하세요 */}
        <div className="text-center mt-12">
          <p className="text-gray-700">아직 회원이 아니신가요? 
            <Link to='/user/regist'>
              <span className="text-red-500 font-medium cursor-pointer">회원가입하세요!</span>
            </Link>
          </p>
        </div>

        {/* 소셜 로그인 */}
        <div className="flex justify-center space-x-4 mt-6">
          <button className="flex flex-all-center items-center bg-[#FEE500] text-black py-2 px-4 rounded-lg w-2/4">
            <img src={KakaoIcon} alt="카카오톡 로그인" className="size-4 mr-4"/>
            <p>카카오로 로그인</p>
          </button>
          <button className="flex flex-all-center items-center bg-[#03C75A] text-white py-2 px-4 rounded-lg w-2/4">
            <img src={NaverIcon} alt="네이버 로그인" className="size-4 mr-4"/>
            <p>네이버로 로그인</p>
          </button>
        </div>

      </div>
      
    </div>
  )
}

export default Login