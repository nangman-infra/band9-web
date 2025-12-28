/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
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

function Navigation() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

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
      </div>
    </nav>
  );
}

export default Navigation;

