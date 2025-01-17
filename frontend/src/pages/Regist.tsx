import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Email from '@components/User/RegistEmail';
import Information from '@components/User/UserInformation';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { registRequired } from '@store/registSlice';

import { registByEmail, getOAuthInformation } from '@services/authService';
import PageNotFound from './PageNotFound';

type RegistRequired = {
  userName: string,
  phoneNumber: string,
  userEmail: string,
  userPassword: string
}

type RegistOptional = {
  profileImage: string | null,
  nickname: string,
  userBirthdate: string | null | undefined,
  userGender: string,
  introduction: string,
  interests: string[] | null
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const Regist: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentLocation = useLocation();

  const registFormData = useSelector((state: RootState) => state.registStore);

  const [isBtnActive, setIsBtnActive] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [provider, setProvider] = useState({provider : 'local', providerId: null})

  const handleNextClick = async () => {
    if (currentLocation.pathname === '/user/regist') {
      navigate('./information')
    } else if (currentLocation.pathname === '/user/regist/information') {
      if (token === null) {
        const response = await registByEmail(registFormData)
        console.log(response)
      } else {
        const response = await registByEmail(registFormData, provider)
        console.log(response)
      }
      navigate('/')
    };
  };

  useEffect(() => {
    const token = query.get('token')
    setToken(token)
  }, [currentLocation.pathname])

  useEffect(() => {
    const getOAuth = async () => {
      try {
        if (token !== null) {
          const response = await getOAuthInformation(token)
          dispatch(
            registRequired({
              userName: response.data.data.name,
              phoneNumber: '',
              userEmail: response.data.data.email,
              userPassword: ''
            })
          )
          setProvider(
            {
              provider: response.data.data.provider,
              providerId: response.data.data.providerId
            }
          )
        }
      } catch (error) {
        console.log(error)
      }
    }

    getOAuth()
  }, [token])

  useEffect(() => {
    if (currentLocation.pathname === '/user/regist') {
      setIsBtnActive(isRequiredFilled(registFormData.required))
    } else if (currentLocation.pathname === '/user/regist/information') {
      setIsBtnActive(isOptionalFilled(registFormData.optional))
    };
  }, [registFormData, currentLocation]);

  const isRequiredFilled = (required: RegistRequired): boolean => {
    return Object.values(required).every(value => value !== '');
  };

  const isOptionalFilled = (optional: RegistOptional): boolean => {
    const { profileImage, introduction, interests, ...rest } = optional;

    const isInterestsValid = interests !== null && interests.length === 6;

    const areOtherFieldsValid = Object.entries(rest).every(([key, value]) => {
      if (key === 'userBirthdate') {
        return value !== undefined && value !== '' && value !== null;
      }
      return typeof value === 'string' && value.trim() !== '';
    });
  
    return isInterestsValid && areOtherFieldsValid;
  };

  return (
    <div
      className={`
        flex justify-center items-center min-h-screen
        bg-light-white
        dark:bg-dark-white
      `}
    >
      <div
        className={`w-[100%] md:max-w-[42rem] h-fit max-md:p-[1.5rem]`}>
        <div 
          className={`
            mb-[2rem] pb-[0.75rem]
            border-light-border-3
            dark:border-dark-border-3
            border-b-2 text-[1.5rem] md:text-[2rem] text-center
          `}
        >
          회원가입
        </div>
        <Routes>
          <Route path='/' element={<Email />} />
          <Route path='/information' element={<Information />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>


        <div className={`text-center`}>
          <button 
            onClick={handleNextClick}
            className={`
              ${isBtnActive ? 
                'border-light-black hover:bg-light-black hover:text-light-text-white dark:border-dark-black dark:hover:bg-dark-black dark:hover:text-dark-text-white' :
                'border-light-gray bg-light-gray dark:border-dark-gray dark:bg-dark-gray'
              }
              w-full md:w-[20rem] h-[2.5rem] mt-[2rem]
              border-2 rounded transition-all duration-300 font-bold
            `}
            disabled={!isBtnActive}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default Regist;