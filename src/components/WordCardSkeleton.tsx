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
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const titleSkeletonStyle = css`
  ${skeletonBase}
  height: 28px;
  width: 60%;
  margin-bottom: 0.5rem;
`;

const badgeSkeletonStyle = css`
  ${skeletonBase}
  height: 24px;
  width: 80px;
  margin-bottom: 0.5rem;
  border-radius: 12px;
`;

const meaningSkeletonStyle = css`
  ${skeletonBase}
  height: 24px;
  width: 90%;
  margin-bottom: 0.75rem;
`;

const detailSkeletonStyle = css`
  ${skeletonBase}
  height: 16px;
  width: 70%;
  margin-top: 0.5rem;
`;

const exampleSkeletonStyle = css`
  ${skeletonBase}
  height: 16px;
  width: 100%;
  margin-top: 0.75rem;
`;

export function WordCardSkeleton() {
  return (
    <div css={cardSkeletonStyle}>
      <div css={titleSkeletonStyle} />
      <div css={badgeSkeletonStyle} />
      <div css={meaningSkeletonStyle} />
      <div css={detailSkeletonStyle} />
      <div css={exampleSkeletonStyle} />
    </div>
  );
}







