import { css } from 'styled-components';

export const font = css`
  @font-face {
    font-family: 'continuous';
    src: url('./fonts/continuous.ttf') format('truetype');
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
