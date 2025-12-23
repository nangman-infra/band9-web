/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-attachment: fixed;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }
`;

function GlobalStyles() {
  return <Global styles={globalStyles} />;
}

export default GlobalStyles;

