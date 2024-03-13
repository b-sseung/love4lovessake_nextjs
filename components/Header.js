import styled, { css } from 'styled-components';
import { flexRow, font } from './css/common';

const HeaderBody = styled.div(
  flexRow,
  font,
  css`
    width: 100%;
    height: 150px;
    background: white;

    font-family: 'continuous';
    font-size: 50px;
    font-weight: bold;

    align-items: center;
    justify-content: center;

    @media screen and (max-width: 768px) {
      font-size: 30px;
    }

    p {
      margin: 0;
    }
  `
);

const Header = () => {
  return (
    <HeaderBody>
      <p>Love for Love&apos;s Sake</p>
    </HeaderBody>
  );
};

export default Header;
