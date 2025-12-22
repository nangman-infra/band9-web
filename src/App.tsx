/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const appStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;

const titleStyle = css`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

const subtitleStyle = css`
  font-size: 1.25rem;
  opacity: 0.9;
  text-align: center;
`;

function App() {
  return (
    <div css={appStyle}>
      <h1 css={titleStyle}>Band9 Web</h1>
      <p css={subtitleStyle}>프로젝트가 성공적으로 초기화되었습니다! 🎉</p>
    </div>
  );
}

export default App;


