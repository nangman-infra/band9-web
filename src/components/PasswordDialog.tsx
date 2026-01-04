/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PASSWORD = 'slow1234!@';

interface PasswordDialogProps {
  isOpen: boolean;
  onSuccess: () => void;
}

const dialogOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const dialogStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const dialogTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 1rem;
`;

const dialogMessageStyle = css`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const inputStyle = css`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #004C97;
  }
`;

const errorMessageStyle = css`
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  min-height: 1.25rem;
`;

const buttonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: #0066CC;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

function PasswordDialog({ isOpen, onSuccess }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (password === PASSWORD) {
      setError('');
      onSuccess();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          css={dialogOverlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            css={dialogStyle}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div css={dialogTitleStyle}>🔒 비밀번호 입력</div>
            <div css={dialogMessageStyle}>
              이 서비스는 개발 서버입니다.
              <br />
              비밀번호를 입력해주세요.
            </div>
            <input
              css={inputStyle}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="비밀번호를 입력하세요"
              autoFocus
            />
            {error && (
              <motion.div
                css={errorMessageStyle}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            <button
              css={buttonStyle}
              onClick={handleSubmit}
              type="button"
              disabled={!password}
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PasswordDialog;







