import styled, { css } from 'styled-components';

const FooterBody = styled.div(
  css`
    width: 100%;
    height: 100px;
    background: #00000033;

    line-height: 100px;
    text-align: center;
  `
);

const Footer = () => {
  return <FooterBody>@doparmin_max</FooterBody>;
};

export default Footer;
