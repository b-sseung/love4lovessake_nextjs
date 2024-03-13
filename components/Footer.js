import styled, { css } from 'styled-components';

const FooterBody = styled.div(
  css`
    width: 100%;
    height: 100px;
    background: #00000033;
  `
);

const Footer = () => {
  return <FooterBody></FooterBody>;
};

export default Footer;
