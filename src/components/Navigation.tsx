/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
// Google OAuth 관련 코드는 주석 처리 (나중에 활성화 가능)
// import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';

const navStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.border};
  padding: 1rem 2rem;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const navContentStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const logoStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  cursor: pointer;
  transition: color 0.2s;
  font-family: ${theme.fonts.primary};

  &:hover {
    color: ${theme.colors.primaryLight};
  }
`;

// Google OAuth 로그아웃 버튼 스타일은 주석 처리 (나중에 활성화 가능)
// const logoutButtonStyle = css`
//   background: none;
//   border: 1px solid ${theme.colors.border};
//   border-radius: 6px;
//   padding: 0.5rem 1rem;
//   cursor: pointer;
//   font-size: 0.9rem;
//   color: #666;
//   transition: all 0.2s;
//   font-family: ${theme.fonts.primary};
//
//   &:hover {
//     background: #f5f5f5;
//     border-color: #999;
//     color: #333;
//   }
// `;

function Navigation() {
  const navigate = useNavigate();
  // Google OAuth 관련 코드는 주석 처리 (나중에 활성화 가능)
  // const location = useLocation();
  // const { logout, isAuthenticated } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  // Google OAuth 로그아웃 핸들러는 주석 처리 (나중에 활성화 가능)
  // const handleLogout = async () => {
  //   await logout();
  // };

  // Google OAuth 관련 조건부 렌더링은 주석 처리 (나중에 활성화 가능)
  // 로그인 페이지에서는 네비게이션 숨김
  // if (location.pathname === '/login') {
  //   return null;
  // }
  //
  // 인증되지 않은 경우 네비게이션 숨김
  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <nav css={navStyle}>
      <div css={navContentStyle}>
        <button
          css={logoStyle}
          onClick={handleLogoClick}
          type="button"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          Band9
        </button>
        {/* Google OAuth 로그아웃 버튼은 주석 처리 (나중에 활성화 가능) */}
        {/* <button css={logoutButtonStyle} onClick={handleLogout} type="button">
          로그아웃
        </button> */}
      </div>
    </nav>
  );
}

export default Navigation;

