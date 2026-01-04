/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReadingPassage, CreateReadingPassageDto, CreateQuestionDto, CreateOptionDto } from '@/services/readingService';

const formOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const formContainerStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const formHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const formTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;
`;

const closeButtonStyle = css`
  background: #dc3545;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
  }
`;

const formGroupStyle = css`
  margin-bottom: 1.5rem;
`;

const labelStyle = css`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const inputStyle = css`
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
`;

const textareaStyle = css`
  ${inputStyle}
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
`;

const questionsSectionStyle = css`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
`;

const questionCardStyle = css`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 2px solid #e0e0e0;
`;

const questionHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const questionTitleStyle = css`
  font-size: 1.125rem;
  font-weight: 600;
  color: #004C97;
`;

const deleteQuestionButtonStyle = css`
  background: #dc3545;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
  }
`;

const selectStyle = css`
  ${inputStyle}
`;

const optionItemStyle = css`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border: 1px solid #e0e0e0;
`;

const optionHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const optionLabelInputStyle = css`
  width: 60px;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`;

const deleteOptionButtonStyle = css`
  background: #6c757d;
  border: none;
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #5a6268;
  }
`;

const addButtonStyle = css`
  background: #28a745;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;
  margin-top: 0.5rem;

  &:hover {
    background: #218838;
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

const correctAnswerSelectStyle = css`
  ${inputStyle}
  margin-top: 0.5rem;
`;

interface ReadingPassageFormProps {
  passage?: ReadingPassage | null;
  onSubmit: (dto: CreateReadingPassageDto) => void;
  onCancel: () => void;
}

function ReadingPassageForm({ passage, onSubmit, onCancel }: ReadingPassageFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [questions, setQuestions] = useState<CreateQuestionDto[]>([]);

  useEffect(() => {
    if (passage) {
      setTitle(passage.title);
      setContent(passage.content);
      setDate(passage.date);
      setQuestions(
        passage.questions.map((q) => ({
          questionType: q.questionType,
          questionText: q.questionText,
          order: q.order,
          correctAnswer: q.correctAnswer,
          options: q.options?.map((opt) => ({
            label: opt.label,
            optionText: opt.optionText,
            order: opt.order,
          })),
        }))
      );
    } else {
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
      setQuestions([]);
    }
  }, [passage]);

  const handleAddQuestion = () => {
    const newOrder = questions.length > 0 ? Math.max(...questions.map((q) => q.order)) + 1 : 1;
    setQuestions([
      ...questions,
      {
        questionType: 'multiple_choice',
        questionText: '',
        order: newOrder,
        correctAnswer: null,
        options: [],
      },
    ]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof CreateQuestionDto, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    
    // 문제 유형이 변경되면 옵션 초기화
    if (field === 'questionType') {
      if (value !== 'multiple_choice') {
        updated[index].options = undefined;
      } else {
        updated[index].options = [];
      }
      updated[index].correctAnswer = null;
    }
    
    setQuestions(updated);
  };

  const handleAddOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    if (question.questionType !== 'multiple_choice') return;

    const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const usedLabels = question.options?.map((opt) => opt.label) || [];
    const nextLabel = labels.find((label) => !usedLabels.includes(label)) || 'A';
    const newOrder = question.options && question.options.length > 0
      ? Math.max(...question.options.map((opt) => opt.order)) + 1
      : 1;

    const updated = [...questions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      options: [
        ...(updated[questionIndex].options || []),
        {
          label: nextLabel,
          optionText: '',
          order: newOrder,
        },
      ],
    };
    setQuestions(updated);
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options?.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updated);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    field: keyof CreateOptionDto,
    value: string | number
  ) => {
    const updated = [...questions];
    if (!updated[questionIndex].options) return;
    
    updated[questionIndex].options = updated[questionIndex].options.map((opt, i) =>
      i === optionIndex ? { ...opt, [field]: value } : opt
    );
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !date.trim()) {
      alert('제목, 내용, 날짜를 모두 입력해주세요.');
      return;
    }

    if (questions.length === 0) {
      alert('최소 1개 이상의 문제를 추가해주세요.');
      return;
    }

    // 문제 유효성 검사
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        alert(`${i + 1}번 문제의 문제 텍스트를 입력해주세요.`);
        return;
      }

      if (q.questionType === 'multiple_choice') {
        if (!q.options || q.options.length < 2) {
          alert(`${i + 1}번 문제는 최소 2개 이상의 선택지를 추가해주세요.`);
          return;
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].optionText.trim()) {
            alert(`${i + 1}번 문제의 ${q.options[j].label} 선택지 내용을 입력해주세요.`);
            return;
          }
        }
        if (!q.correctAnswer) {
          alert(`${i + 1}번 문제의 정답을 선택해주세요.`);
          return;
        }
      } else if (!q.correctAnswer) {
        alert(`${i + 1}번 문제의 정답을 입력해주세요.`);
        return;
      }
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      date: date.trim(),
      questions: questions.map((q) => ({
        ...q,
        options: q.questionType === 'multiple_choice' ? q.options : undefined,
      })),
    });
  };

  return (
    <motion.div
      css={formOverlayStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        css={formContainerStyle}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div css={formHeaderStyle}>
          <h2 css={formTitleStyle}>
            {passage ? '지문 수정' : '새 지문 추가'}
          </h2>
          <button css={closeButtonStyle} onClick={onCancel} type="button">
            닫기
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="title">
              제목 *
            </label>
            <input
              id="title"
              css={inputStyle}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="지문 제목을 입력하세요"
              required
            />
          </div>

          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="content">
              내용 *
            </label>
            <textarea
              id="content"
              css={textareaStyle}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="지문 내용을 입력하세요"
              required
            />
          </div>

          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="date">
              날짜 (YYYY-MM-DD) *
            </label>
            <input
              id="date"
              css={inputStyle}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div css={questionsSectionStyle}>
            <div css={formHeaderStyle}>
              <h3 css={formTitleStyle}>문제</h3>
              <button
                css={addButtonStyle}
                onClick={handleAddQuestion}
                type="button"
              >
                + 문제 추가
              </button>
            </div>

            <AnimatePresence>
              {questions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  css={questionCardStyle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div css={questionHeaderStyle}>
                    <div css={questionTitleStyle}>문제 {question.order}</div>
                    <button
                      css={deleteQuestionButtonStyle}
                      onClick={() => handleDeleteQuestion(qIndex)}
                      type="button"
                    >
                      삭제
                    </button>
                  </div>

                  <div css={formGroupStyle}>
                    <label css={labelStyle}>문제 유형 *</label>
                    <select
                      css={selectStyle}
                      value={question.questionType}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          'questionType',
                          e.target.value as CreateQuestionDto['questionType']
                        )
                      }
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false_not_given">True/False/Not Given</option>
                      <option value="sentence_completion">Sentence Completion</option>
                    </select>
                  </div>

                  <div css={formGroupStyle}>
                    <label css={labelStyle}>문제 텍스트 *</label>
                    <textarea
                      css={textareaStyle}
                      style={{ minHeight: '80px' }}
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'questionText', e.target.value)
                      }
                      placeholder="문제를 입력하세요"
                      required
                    />
                  </div>

                  {question.questionType === 'multiple_choice' && (
                    <>
                      <div css={formGroupStyle}>
                        <label css={labelStyle}>선택지</label>
                        {question.options?.map((option, optIndex) => (
                          <div key={optIndex} css={optionItemStyle}>
                            <div css={optionHeaderStyle}>
                              <input
                                css={optionLabelInputStyle}
                                type="text"
                                value={option.label}
                                onChange={(e) =>
                                  handleOptionChange(
                                    qIndex,
                                    optIndex,
                                    'label',
                                    e.target.value.toUpperCase()
                                  )
                                }
                                maxLength={1}
                                placeholder="A"
                              />
                              <button
                                css={deleteOptionButtonStyle}
                                onClick={() => handleDeleteOption(qIndex, optIndex)}
                                type="button"
                              >
                                삭제
                              </button>
                            </div>
                            <input
                              css={inputStyle}
                              type="text"
                              value={option.optionText}
                              onChange={(e) =>
                                handleOptionChange(
                                  qIndex,
                                  optIndex,
                                  'optionText',
                                  e.target.value
                                )
                              }
                              placeholder="선택지 내용을 입력하세요"
                            />
                          </div>
                        ))}
                        <button
                          css={addButtonStyle}
                          onClick={() => handleAddOption(qIndex)}
                          type="button"
                        >
                          + 선택지 추가
                        </button>
                      </div>

                      <div css={formGroupStyle}>
                        <label css={labelStyle}>정답 *</label>
                        <select
                          css={correctAnswerSelectStyle}
                          value={question.correctAnswer || ''}
                          onChange={(e) =>
                            handleQuestionChange(qIndex, 'correctAnswer', e.target.value || null)
                          }
                          required
                        >
                          <option value="">정답 선택</option>
                          {question.options?.map((opt) => (
                            <option key={opt.label} value={opt.label}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {question.questionType === 'true_false_not_given' && (
                    <div css={formGroupStyle}>
                      <label css={labelStyle}>정답 *</label>
                      <select
                        css={correctAnswerSelectStyle}
                        value={question.correctAnswer || ''}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, 'correctAnswer', e.target.value || null)
                        }
                        required
                      >
                        <option value="">정답 선택</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                        <option value="not_given">Not Given</option>
                      </select>
                    </div>
                  )}

                  {question.questionType === 'sentence_completion' && (
                    <div css={formGroupStyle}>
                      <label css={labelStyle}>정답 *</label>
                      <input
                        css={inputStyle}
                        type="text"
                        value={question.correctAnswer || ''}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, 'correctAnswer', e.target.value || null)
                        }
                        placeholder="정답을 입력하세요"
                        required
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button css={submitButtonStyle} type="submit">
            {passage ? '수정하기' : '저장하기'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default ReadingPassageForm;








