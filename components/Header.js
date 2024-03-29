import styled, { css } from 'styled-components';
import { flexRow, font } from './css/common';

const HeaderBody = styled.div(
  flexRow,
  css`
    width: 100%;
    height: 150px;
    background: white;

    font-family: var(--dancing-script-font);
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
      <p>Love For Love&apos;s Sake</p>
    </HeaderBody>
  );
};

export default Header;
