out 폴더에 '.nojekyll' 파일 꼭 추가하기 > 안그러면 js, css 등 파일 못 읽어들여서 404 에러 뜸

config폴더 > config.js 파일 생성 후 아래의 코드 추가하기
export const prefix = process.env.NODE_ENV === 'production' ? 'https://love4lovesake.com' : '.';

context폴더 > context.js 파일 생성 후 아래의 코드 추가하기
import React from 'react';

const PortfolioContext = React.createContext();

export const PortfolioProvider = PortfolioContext.Provider;
export const PortfolioConsumer = PortfolioContext.Consumer;

export default PortfolioContext;

> 추가 후 contextAPI 마냥 호출하기 (\_app.js 참고)

next.config.mjs 파일 내용 그대로 참고하기
