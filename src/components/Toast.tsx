/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/styles/theme';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'error' | 'info';
}

const toastContainerStyle = css`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
`;

const getToastStyle = (type: 'success' | 'error' | 'info') => css`
  background: ${
    type === 'error'
      ? theme.colors.danger
      : type === 'success'
        ? theme.colors.success
        : theme.colors.primary
  };
  color: ${theme.colors.white};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.95rem;
  font-weight: 500;
  min-width: 200px;
  text-align: center;
  pointer-events: auto;
`;

const toastVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
};

const Toast = memo(function Toast({ message, isVisible, type = 'success' }: ToastProps) {
  // message가 없거나 isVisible이 false면 표시하지 않음
  if (!message || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <div css={toastContainerStyle} key="toast">
        <motion.div
          css={getToastStyle(type)}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {message}
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

export default Toast;

