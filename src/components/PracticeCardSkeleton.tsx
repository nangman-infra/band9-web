/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const skeletonBase = css`
  background: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const cardSkeletonStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const titleSkeletonStyle = css`
  ${skeletonBase}
  height: 32px;
  width: 50%;
  margin-bottom: 2rem;
`;

const labelSkeletonStyle = css`
  ${skeletonBase}
  height: 20px;
  width: 100px;
  margin-bottom: 0.5rem;
`;

const inputSkeletonStyle = css`
  ${skeletonBase}
  height: 56px;
  width: 100%;
  margin-bottom: 1rem;
`;

const exampleSkeletonStyle = css`
  ${skeletonBase}
  height: 20px;
  width: 80%;
  margin-top: 1rem;
`;

const buttonSkeletonStyle = css`
  ${skeletonBase}
  height: 48px;
  width: 100%;
  margin-top: 1.5rem;
`;

const progressSkeletonStyle = css`
  ${skeletonBase}
  height: 16px;
  width: 60px;
  margin: 1rem auto 0;
`;

export function PracticeCardSkeleton() {
  return (
    <div css={cardSkeletonStyle}>
      <div css={titleSkeletonStyle} />
      <div css={labelSkeletonStyle} />
      <div css={inputSkeletonStyle} />
      <div css={exampleSkeletonStyle} />
      <div css={buttonSkeletonStyle} />
      <div css={progressSkeletonStyle} />
    </div>
  );
}







