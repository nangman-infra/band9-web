/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Word } from '@/domains/vocabulary/types';
import { getWordsByDate } from '@/domains/vocabulary/api';
import { ApiError } from '@/utils/api';
import { WordCardSkeleton } from '@/components/WordCardSkeleton';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
  padding: 1rem;
  padding-top: 6rem;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    margin-bottom: 2rem;
    align-items: center;
    flex-wrap: nowrap;
  }
`;

const titleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: #004C97;

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const backButtonStyle = css`
  background: white;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;

  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const contentStyle = css`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const dateDisplayStyle = css`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const wordsGridStyle = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
`;

const wordCardStyle = css`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`;

const wordTitleStyle = css`
  font-size: 1.25rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 0.5rem;

  @media (min-width: 640px) {
    font-size: 1.5rem;
  }
`;

const wordMeaningStyle = css`
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.75rem;
  font-weight: 500;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
`;

const wordDetailStyle = css`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  line-height: 1.6;
`;

const partOfSpeechStyle = css`
  display: inline-block;
  background: #E6F2FF;
  color: #004C97;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const synonymsStyle = css`
  ${wordDetailStyle}
  color: #28a745;
`;

const exampleStyle = css`
  ${wordDetailStyle}
  font-style: italic;
  color: #666;
  border-left: 3px solid #004C97;
  padding-left: 0.75rem;
  margin-top: 0.75rem;
`;

const emptyStateStyle = css`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  font-size: 1.125rem;
`;

function VocabularyView() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (date) {
      loadWords();
    }
  }, [date]);

  const loadWords = async () => {
    if (!date) return;

    try {
      setIsLoading(true);
      const fetchedWords = await getWordsByDate(date);
      // synonyms가 배열이 아닌 경우 배열로 변환
      const normalizedWords = fetchedWords.map((word) => ({
        ...word,
        synonyms: Array.isArray(word.synonyms) 
          ? word.synonyms 
          : (word.synonyms ? [word.synonyms] : []),
      }));
      setWords(normalizedWords);
    } catch (error) {
      console.error('Failed to load words:', error);
      if (error instanceof ApiError) {
        if (error.status !== 404) {
          alert(`Failed to load words: ${error.message}`);
        }
      } else if (error instanceof Error) {
        alert(`Failed to load words: ${error.message}`);
      } else {
        alert('Failed to load words: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const handleBackClick = () => {
    navigate('/vocabulary');
  };

  if (isLoading) {
    return (
      <div css={containerStyle}>
        <div css={headerStyle}>
          <h1 css={titleStyle}>View Words</h1>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
          <div css={wordsGridStyle}>
            {[...Array(6)].map((_, index) => (
              <WordCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <h1 css={titleStyle}>View Words</h1>
          {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
        </div>
        <button css={backButtonStyle} onClick={handleBackClick} type="button">
          ← Calendar
        </button>
      </div>
      <div css={contentStyle}>
        {words.length === 0 ? (
          <div css={emptyStateStyle}>
            저장된 단어가 없습니다.
            <br />
            Input Words 탭에서 단어를 추가해주세요.
          </div>
        ) : (
          <div css={wordsGridStyle}>
            {words.map((word) => (
              <motion.div
                key={word.id}
                css={wordCardStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div css={wordTitleStyle}>{word.word}</div>
                {word.partOfSpeech && (
                  <div css={partOfSpeechStyle}>{word.partOfSpeech}</div>
                )}
                <div css={wordMeaningStyle}>{word.meaning}</div>
                {word.synonyms && 
                 (Array.isArray(word.synonyms) ? word.synonyms.length > 0 : word.synonyms) && (
                  <div css={synonymsStyle}>
                    <strong>Synonyms:</strong>{' '}
                    {Array.isArray(word.synonyms) 
                      ? word.synonyms.join(', ') 
                      : word.synonyms}
                  </div>
                )}
                {word.example && (
                  <div css={exampleStyle}>
                    <strong>Example:</strong> {word.example}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default VocabularyView;

