import { css } from 'styled-components';

export const font = css`
  @font-face {
    font-family: 'DancingScript-Bold';
    src: url('./fonts/DancingScript-Bold.ttf') format('truetype');
  }
`;

export const flexRow = css`
  display: flex;
  flex-direction: row;
`;

export const flexCol = css`
  display: flex;
  flex-direction: column;
`;

export const absoluteCenter = css`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const inputStyle = css`
  border: 1px solid gray;
  border-radius: 50px;
`;
