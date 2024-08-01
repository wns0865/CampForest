import React, { useEffect, useState } from 'react';
import FireGif from '@assets/images/fire.gif';
import { ReactComponent as LeftArrowIcon } from '@assets/icons/arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '@assets/icons/arrow-right.svg';
import MoreOptionsMenu from '@components/Public/MoreOptionsMenu';
import ProductCard from '@components/Product/ProductCard';
import { productDetail } from '@services/productService';
import { useParams } from 'react-router-dom';
import { priceComma } from '@utils/priceComma';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type ProductDetailType = {
  category: string;
  deposit: number | null;
  hit: number;
  imageUrls: string[];
  interestHit: number;
  location: string;
  productContent: string;
  productId: number;
  productName: string;
  productPrice: number;
  productType: string;
  userId: string;
  nickname: string;
  userImage: string;
};

function Detail() {
  const isUserPost = false; // 예시로 사용자 게시물 여부를 나타내는 값
  const productId = Number(useParams().productId);
  const [product, setProduct] = useState<ProductDetailType>({
    category: '',
    deposit: 0,
    hit: 0,
    imageUrls: [],
    interestHit: 0,
    location: '',
    productContent: '',
    productId: 0,
    productName: '',
    productPrice: 0,
    productType: '',
    userId: '',
    nickname: '',
    userImage: ''
  });
  const fetchProduct = async () => {
    try {
      const result = await productDetail(productId);
      console.log(result);
      setProduct(result);
    } catch (error) {
      console.error('판매 상세 페이지 불러오기 실패: ', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className={`flex justify-center mb-[5rem]`}>
      <div className={`w-full lg:w-[60rem] xl:w-[66rem] max-lg:p-6 lg:pt-6`}>
        {/* 상단 */}
        <div 
          className={`
            flex lg:flex-row flex-col relative w-full mb-[2rem] 
            bg-light-white
            dark:bg-dark-white
            overflow-hidden
          `}
        >
          {/* 이미지 */}
          <Swiper
            className={`
              flex-shrink-0 w-full lg:w-2/5
              aspect-1 rounded-lg overflow-hidden
            `}
            modules={[Navigation, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            navigation={{ nextEl: '.my-next-button', prevEl: '.my-prev-button' }}
            pagination={{ clickable: true }}
            onSwiper={(swiper: any) => console.log(swiper)}
          >
            {product.imageUrls.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imageUrl}
                  alt="ProductImg"
                  className={`
                    w-full h-full 
                    border-light-border
                    dark:border-dark-border
                    object-contain rounded-lg border
                  `}
                />
              </SwiperSlide>
            ))}
            <button 
              className={`
                my-next-button 
                absolute top-1/2 right-[0.5rem] z-10 p-[0.5rem] 
                transform -translate-y-1/2 rounded-full
              `}
            >
              <RightArrowIcon />
            </button>
            <button 
              className={`
                my-prev-button
                absolute top-1/2 left-[0.5rem] z-10 p-[0.5rem]
                transform -translate-y-1/2 rounded-full
              `}
            >
              <LeftArrowIcon />
            </button>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                .swiper-pagination-bullet {
                  background-color: #888 !important;
                  opacity: 0.5 !important;
                }
                .swiper-pagination-bullet-active {
                  background-color: #555 !important;
                  opacity: 1 !important;
                }
              `,
              }}
            />
          </Swiper>
          {/* 내용 */}
          <div className={`w-full lg:w-3/5 md:ps-[1.5rem]`}>
            <div 
              className={`
                flex justify-between mt-[1rem] mb-[0.5rem]
                text-sm
              `}
            >
              <div className={`flex`}>
                <div className={`me-[1.5rem]`}>
                  캠핑 장비 {'>'} {product.category}
                </div>
                <div 
                  className={`
                    text-light-signature
                    dark:text-dark-signature
                    font-semibold
                  `}
                >
                  {product.productType === 'SALE' ? '판매' : '대여'}
                </div>
              </div>
              <MoreOptionsMenu
                isUserPost={isUserPost}
                deleteId={0}
                deleteFunction={() => {
                  console.log('test');
                }}
                copyURL=""
              />
            </div>
            <div className={`text-2xl font-medium`}>
              {product.productName}
            </div>
            <div 
              className={`
                relative mt-[1.5rem]
                border-light-border
                dark:border-dark-border 
                text-sm border-b
              `}
            >
              <div 
                className={`
                  w-full min-h-[7rem]
                  break-all
                `}
              >
                {product.productContent
              }</div>
              <div className={`flex my-[1.5rem]`}>
                <div>
                  조회
                </div>
                <div className={`ms-[0.25rem] me-[0.5rem]`}>
                  {product.hit}
                </div>
                <div>
                  관심
                </div>
                <div className={`ms-[0.25rem] me-[0.5rem]`}>
                  {product.interestHit}
                </div>
              </div>
            </div>
            <div className={`flex justify-between pt-[1.5rem]`}>
              <div>
                <div className={`font-medium`}>
                  픽업 | 반납 장소
                </div>
                <div 
                  className={`
                    p-[0.5rem]
                    text-sm
                  `}
                >
                  <div>
                    {product.location}
                  </div>
                </div>
              </div>
              {/* 가격 */}
              <div className={`mt-[1rem]`}>
                <div 
                  className={`
                    flex justify-between mb-[0.5rem]
                    text-lg md:text-xl
                  `}
                >
                  <div 
                    className={`
                      me-[1.25rem] 
                      font-semibold
                    `}
                  >
                    가격
                  </div>
                  <div className={`font-bold`}>
                    {priceComma(product.productPrice)} 원
                    <span className={`${product.productType === 'SALE' ? 'hidden' : ''}`}>
                      /일
                    </span>
                  </div>
                </div>
                <div
                  className={`
                    ${product.productType === 'SALE' ? 'hidden' : ''}
                    flex justify-between 
                    text-base md:text-lg
                  `}
                >
                  <div 
                    className={`
                      me-[1.25rem]
                      font-semibold
                    `}
                  >
                    보증금
                  </div>
                  <div className={`font-bold`}>
                    {product.deposit} 원
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 판매자 정보 및 거래버튼 */}
        <div 
          className={`
            flex flex-col lg:flex-row justify-between mt-[2.5rem] mb-[3.5rem] px-[1rem] py-[1.5rem]
            rounded-sm 
          `}
        >
          {/* 판매자 정보 */}
          <div className={`flex flex-col w-full lg:w-[calc(100%-24.5rem)] max-lg:mb-8`}>
            <div className={`w-full mb-[0.75rem]`}>
              <span className={`font-medium`}>
                {product.nickname} 
              </span>
              의 제품
            </div>
            <div className={`flex w-full`}>
              <div 
                className={`
                  shrink-0 size-[3rem] me-[1rem]
                  bg-light-black
                  dark:bg-dark-black
                  rounded-full
                `}
              >
                <img 
                  src={product.userImage} 
                  alt={''} 
                />
              </div>
              <div className={`flex flex-col w-full`}>
                <div className={`flex mb-[0.5rem]`}>
                  <div 
                    className={`
                      me-[0.75rem]
                      font-medium 
                    `}
                  >
                    거래 불꽃 온도
                  </div>
                  <div 
                    className={`
                      text-light-warning
                      dark:text-dark-warning
                      font-medium
                    `}
                  >
                    573°C
                  </div>
                </div>
                <div 
                  className={`
                    w-full lg:w-4/5 h-4  
                    rounded-full
                  `}
                >
                  <div 
                    className={`
                      relative w-1/2 h-full
                      bg-gradient-to-r from-light-warning to-light-signature
                      dark:from-dark-warning dkar:to-dark-signature
                      rounded-full
                    `}
                  >
                    <img
                      src={FireGif}
                      alt="불꽃"
                      className={`absolute -right-[4rem] -top-[3.5rem] size-[8rem]`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 거래버튼 */}
          <div className={`flex items-center md:justify-center`}>
            <button 
              className={`
                flex flex-all-center w-1/2 md:max-w-[20rem] lg:w-[12rem] h-[2.5rem] me-[0.5rem] py-[0.5rem]
                bg-light-white border-light-signature text-light-signature
                dark:bg-dark-white dark:border-dark-signature dark:text-dark-signature
                rounded-md border font-medium
              `}
            >
              찜하기
            </button>
            <button 
              className={`
                flex flex-all-center w-1/2 md:max-w-[20rem] lg:w-[12rem] h-[2.5rem] py-[0.5rem] 
                bg-light-signature text-light-white
                dark:bg-dark-signature dark:text-dark-white
                rounded-md 
              `}
            >
              채팅하기
            </button>
          </div>
        </div>
        {/* 판매자의 추가거래 상품 받아오기 */}
        <div>
          <div 
            className={`
              mb-[0.75rem] 
              text-lg
            `}
          >
            <span className={`font-medium`}>
              사용자1
            </span>
            의 다른 거래 상품 구경하기
          </div>
          <div className={`w-full flex flex-wrap`} />
          {/* <Swiper
            spaceBetween={2}
            slidesPerView={1}
            freeMode={true}
          >
            <SwiperSlide>
              <ProductCard />
            </SwiperSlide>
          </Swiper> */}
        </div>
      </div>
    </div>
  );
}

export default Detail;