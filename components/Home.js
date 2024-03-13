import styled, { css } from 'styled-components';
import { useEffect, useMemo, useState, useRef } from 'react';
import $ from 'jquery';
import MenuContainer from './Menu';
import Footer from './Footer';
import Header from './Header';
import OfficialLink from './home/OfficialLink';
import { absoluteCenter, flexCol } from './css/common';

const MainContent = styled.div(
  flexCol,
  css`
    width: 100%;
    flex-grow: 1;
    position: relative;
  `
);

const BackImg = styled.img(
  css`
    height: 100%;
    width: 100%;
    position: absolute;
    opacity: 0.5;

    object-fit: cover;
    filter: blur(6px);
  `
);

const FrontDiv = styled.div(
  absoluteCenter,
  flexCol,
  css`
    width: 100%;
    height: 100%;
    position: absolute;
  `
);

const FrontImg = styled.img(
  css`
    object-fit: scale-down;
    width: 100%;
    height: 0;
    flex-grow: 1;
  `
);

const Home = () => {
  const [ratio, setRatio] = useState('01');

  const delay = 100;
  let timer = useRef(null);

  let bgImgUrl = `/images/background-${ratio}.jpg`;

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
