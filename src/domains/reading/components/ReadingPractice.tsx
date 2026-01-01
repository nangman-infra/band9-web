/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { readingService, type ReadingPassage } from '@/services/readingService';
import { ApiError } from '@/utils/api';
import { PracticeCardSkeleton } from '@/components/PracticeCardSkeleton';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
  padding: 2rem;
  padding-top: 6rem; /* 네비게이션 높이만큼 여백 추가 */
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const titleStyle = css`
  font-size: 2rem;
  font-weight: 700;
`;

const backButtonStyle = css`
  background: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const contentStyle = css`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
`;

const twoColumnLayoutStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const passageColumnStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
`;

const questionsColumnStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 200px);
  overflow-y: auto;
`;

const passageTitleStyle = css`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #004C97;
`;

const passageContentStyle = css`
  font-size: 1rem;
  line-height: 2;
  color: #333;
  white-space: pre-wrap;
`;

const questionsTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #004C97;
`;

const questionCardStyle = css`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const questionTextStyle = css`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const optionLabelStyle = css`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const radioStyle = css`
  margin-right: 0.75rem;
  cursor: pointer;
`;

const optionTextStyle = css`
  font-size: 1rem;
  color: #333;
`;

const correctAnswerStyle = css`
  color: #28a745;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const wrongAnswerStyle = css`
  color: #dc3545;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const textInputStyle = css`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #004C97;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const submitButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  width: 100%;
  margin-top: 1.5rem;
  transition: background 0.2s;

  &:hover {
    background: #0066CC;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const scoreCardStyle = css`
  background: #E6F2FF;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  text-align: center;
`;

const scoreTextStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
`;

const emptyStateStyle = css`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  color: #666;
  font-size: 1.125rem;
`;

const dateDisplayStyle = css`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const ANIMATION_DURATION_MS = 300;

function ReadingPractice() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  // "admin"이 날짜로 들어온 경우 어드민 페이지로 리다이렉트
  useEffect(() => {
    if (date === 'admin') {
      navigate('/reading/admin', { replace: true });
    }
  }, [date, navigate]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const loadPassage = useCallback(async () => {
    if (!date) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await readingService.getPassageByDate(date);
      setPassage(data);
      setUserAnswers({});
      setShowResults(false);
    } catch (err) {
      console.error('Failed to load passage:', err);
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError('해당 날짜의 지문이 없습니다.');
        } else {
          setError(`지문을 불러오는데 실패했습니다: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`지문을 불러오는데 실패했습니다: ${err.message}`);
      } else {
        setError('지문을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    if (date) {
      loadPassage();
    }
  }, [date, loadPassage]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!passage) return 0;
    let correct = 0;
    passage.questions.forEach((question) => {
      const userAnswer = userAnswers[question.id]?.trim().toLowerCase();
      const correctAnswer = question.correctAnswer?.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleBackClick = () => {
    navigate('/reading');
  };

  if (isLoading) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Reading Practice</h1>
            {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
          </div>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <PracticeCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Reading Practice</h1>
            {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
          </div>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <div css={emptyStateStyle}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!passage) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Reading Practice</h1>
            {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
          </div>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <div css={emptyStateStyle}>
            해당 날짜의 지문이 없습니다.
          </div>
        </div>
      </div>
    );
  }

  const sortedQuestions = [...passage.questions].sort((a, b) => a.order - b.order);

  return (
    <motion.div
      css={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div css={headerStyle}>
        <div>
          <h1 css={titleStyle}>Reading Practice</h1>
          {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
        </div>
        <button css={backButtonStyle} onClick={handleBackClick} type="button">
          ← Calendar
        </button>
      </div>
      <div css={contentStyle}>
        <div css={twoColumnLayoutStyle}>
          {/* 왼쪽: 지문 */}
          <div css={passageColumnStyle}>
            <h2 css={passageTitleStyle}>{passage.title}</h2>
            <div css={passageContentStyle}>{passage.content}</div>
          </div>

          {/* 오른쪽: 문제 */}
          <div css={questionsColumnStyle}>
            <h3 css={questionsTitleStyle}>Questions</h3>
            {sortedQuestions.map((question) => (
              <div key={question.id} css={questionCardStyle}>
                <div css={questionTextStyle}>
                  Q{question.order}. {question.questionText}
                </div>

                {/* Multiple Choice */}
                {question.questionType === 'multiple_choice' && question.options && (
                  <div>
                    {[...question.options]
                      .sort((a, b) => a.order - b.order)
                      .map((option) => (
                        <label key={option.id} css={optionLabelStyle}>
                          <input
                            css={radioStyle}
                            type="radio"
                            name={question.id}
                            value={option.label}
                            checked={userAnswers[question.id] === option.label}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            disabled={showResults}
                          />
                          <span css={optionTextStyle}>
                            {option.label}. {option.optionText}
                          </span>
                          {showResults && option.label === question.correctAnswer && (
                            <span css={correctAnswerStyle}>✓ 정답</span>
                          )}
                          {showResults &&
                            userAnswers[question.id] === option.label &&
                            option.label !== question.correctAnswer && (
                              <span css={wrongAnswerStyle}>✗ 오답</span>
                            )}
                        </label>
                      ))}
                  </div>
                )}

                {/* True/False/Not Given */}
                {question.questionType === 'true_false_not_given' && (
                  <div>
                    {['true', 'false', 'not_given'].map((value) => (
                      <label key={value} css={optionLabelStyle}>
                        <input
                          css={radioStyle}
                          type="radio"
                          name={question.id}
                          value={value}
                          checked={userAnswers[question.id] === value}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          disabled={showResults}
                        />
                        <span css={optionTextStyle}>
                          {value === 'true' && 'True'}
                          {value === 'false' && 'False'}
                          {value === 'not_given' && 'Not Given'}
                        </span>
                        {showResults && value === question.correctAnswer && (
                          <span css={correctAnswerStyle}>✓ 정답</span>
                        )}
                        {showResults &&
                          userAnswers[question.id] === value &&
                          value !== question.correctAnswer && (
                            <span css={wrongAnswerStyle}>✗ 오답</span>
                          )}
                      </label>
                    ))}
                  </div>
                )}

                {/* Sentence Completion */}
                {question.questionType === 'sentence_completion' && (
                  <input
                    css={textInputStyle}
                    type="text"
                    value={userAnswers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    disabled={showResults}
                    placeholder="답을 입력하세요"
                  />
                )}

                {/* Sentence Completion 정답 표시 */}
                {showResults &&
                  question.questionType === 'sentence_completion' &&
                  userAnswers[question.id]?.trim().toLowerCase() ===
                    question.correctAnswer?.trim().toLowerCase() && (
                    <div css={correctAnswerStyle} style={{ marginTop: '0.5rem' }}>
                      ✓ 정답
                    </div>
                  )}
                {showResults &&
                  question.questionType === 'sentence_completion' &&
                  userAnswers[question.id]?.trim().toLowerCase() !==
                    question.correctAnswer?.trim().toLowerCase() && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div css={wrongAnswerStyle}>✗ 오답</div>
                      <div css={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                        정답: {question.correctAnswer}
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {!showResults && (
              <button
                css={submitButtonStyle}
                onClick={handleSubmit}
                type="button"
                disabled={Object.keys(userAnswers).length === 0}
              >
                제출하기
              </button>
            )}

            {showResults && (
              <div css={scoreCardStyle}>
                <div css={scoreTextStyle}>
                  점수: {calculateScore()} / {passage.questions.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ReadingPractice;

