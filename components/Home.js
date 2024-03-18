import styled, { css } from 'styled-components';
import { useEffect, useContext, useState, useRef } from 'react';
import $ from 'jquery';
import MenuContainer from './Menu';
import Footer from './Footer';
import Header from './Header';
import OfficialLink from './home/OfficialLink';
import { absoluteCenter, flexCol } from './css/common';
import PortfolioContext from '@/context/context';
import Image from 'next/image';

const MainContent = styled.div(
  flexCol,
  css`
    width: 100%;
    flex-grow: 1;
    position: relative;
  `
);

const BackImg = styled.img`
  height: 100%;
  width: 100%;
  position: absolute;
  opacity: 0.5;

  object-fit: cover;
  filter: blur(6px);
`;

const FrontDiv = styled.div(
  absoluteCenter,
  flexCol,
  css`
    width: 100%;
    height: 100%;
    position: absolute;
  `
);

const FrontImg = styled.img`
  object-fit: scale-down;
  width: 100%;
  height: 0;
  flex-grow: 1;
`;

const Home = () => {
  const [ratio, setRatio] = useState('01');
  const { prefix } = useContext(PortfolioContext);

  const delay = 100;
  let timer = useRef(null);

  let bgImgUrl = `${prefix}/images/background-${ratio}.jpg`;

  useEffect(() => {
    getRatio();

    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer.current = setTimeout(() => {
        getRatio();
      }, delay);
    });
  }, []);

  const getRatio = () => {
    const root = $('#__next')[0];
    if (root.clientWidth / root.clientHeight >= 0.98) {
      setRatio('03');
    } else if (root.clientWidth / root.clientHeight >= 0.73) {
      setRatio('02');
    } else {
      setRatio('01');
    }
  };

  return (
    <>
      <Header></Header>
      <MenuContainer></MenuContainer>
      <MainContent>
        <BackImg alt="" src={bgImgUrl}></BackImg>
        <FrontDiv>
          <FrontImg alt="" src={bgImgUrl}></FrontImg>
          <OfficialLink></OfficialLink>
        </FrontDiv>
      </MainContent>
      <Footer></Footer>
    </>
  );
};

export default Home;
