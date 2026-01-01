/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { WordInput, Word } from '@/domains/vocabulary/types';
import { createWords, getWordsByDate, deleteWord } from '@/domains/vocabulary/api';
import { ApiError } from '@/utils/api';
import Toast from '@/components/Toast';

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
  color: #004C97;
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
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

const formStyle = css`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #333;
`;

const formGroupStyle = css`
  margin-bottom: 1.5rem;
`;

const labelStyle = css`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const inputStyle = css`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
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
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const saveButtonStyle = css`
  background: #004C97;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;
  flex: 1;

  &:hover {
    background: #0066CC;
  }
`;

const addButtonStyle = css`
  background: #28a745;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #218838;
  }
`;

const wordsListStyle = css`
  margin-top: 2rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const wordItemStyle = css`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const wordInfoStyle = css`
  flex: 1;
`;

const wordTitleStyle = css`
  font-size: 1.25rem;
  font-weight: 700;
  color: #004C97;
  margin-bottom: 0.25rem;
`;

const wordDetailStyle = css`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
`;

const deleteButtonStyle = css`
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

const dateDisplayStyle = css`
  font-size: 1rem;
  opacity: 0.9;
  margin-top: 0.5rem;
`;

const INITIAL_WORD: WordInput = {
  word: '',
  meaning: '',
  partOfSpeech: '',
  synonyms: '',
  example: '',
};

function VocabularyInput() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState<WordInput>(INITIAL_WORD);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const handleInputChange = (field: keyof WordInput, value: string) => {
    setCurrentWord((prev: WordInput) => ({ ...prev, [field]: value }));
  };

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
      // 빈 배열은 정상적인 응답이므로 에러로 처리하지 않음
    } catch (error) {
      console.error('Failed to load words:', error);
      if (error instanceof ApiError) {
        // 404는 단어가 없는 경우이므로 에러로 처리하지 않음
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

  const handleAddWord = () => {
    if (currentWord.word && currentWord.meaning) {
      // 임시 ID로 로컬 상태에 추가 (저장 전까지)
      const tempWord: Word = {
        id: `temp-${Date.now()}`,
        word: currentWord.word,
        meaning: currentWord.meaning,
        partOfSpeech: currentWord.partOfSpeech || null,
        synonyms: currentWord.synonyms ? currentWord.synonyms.split(',').map((s: string) => s.trim()) : [],
        example: currentWord.example || null,
        date: date || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWords((prev) => [...prev, tempWord]);
      setCurrentWord(INITIAL_WORD);
      
      // 토스트 메시지 표시 (초록색)
      setToastMessage(`Word "${tempWord.word}" added successfully!`);
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const handleDeleteWord = async (id: string) => {
    // 삭제할 단어 찾기
    const wordToDelete = words.find((word) => word.id === id);
    const wordText = wordToDelete?.word || 'Word';

    // 임시 ID인 경우 (아직 저장되지 않은 단어)
    if (id.startsWith('temp-')) {
      setWords((prev) => prev.filter((word) => word.id !== id));
      
      // 토스트 메시지 표시 (빨간색)
      setToastMessage(`Word "${wordText}" removed from list`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return;
    }

    try {
      await deleteWord(id);
      setWords((prev) => prev.filter((word) => word.id !== id));
      
      // 토스트 메시지 표시 (빨간색)
      setToastMessage(`Word "${wordText}" deleted successfully!`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to delete word:', error);
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Unknown error';
      setToastMessage(`Failed to delete word: ${errorMessage}`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const handleSave = async () => {
    console.log('handleSave called', { date, wordsLength: words.length });
    
    if (!date) {
      alert('Date is required');
      return;
    }

    if (words.length === 0) {
      alert('Please add at least one word before saving.');
      return;
    }

    try {
      setIsSaving(true);
      console.log('Starting save...');

      // Word를 API 형식으로 변환
      const wordsToSave = words.map((word) => {
        // synonyms가 배열인지 확인하고 처리
        const synonymsArray = Array.isArray(word.synonyms) 
          ? word.synonyms 
          : (word.synonyms ? [word.synonyms] : []);
        
        return {
          word: word.word,
          meaning: word.meaning,
          partOfSpeech: word.partOfSpeech || undefined,
          synonyms: synonymsArray.length > 0 ? synonymsArray.join(', ') : undefined,
          example: word.example || undefined,
        };
      });

      const savedWords = await createWords(date, wordsToSave);
      setWords(savedWords);
      
      console.log('Setting toast message...');
      setToastMessage('Words saved successfully!');
      setToastType('info'); // 파란색
      setShowToast(true);
      console.log('Toast state updated:', { message: 'Words saved successfully!', showToast: true });
      
      setTimeout(() => {
        console.log('Hiding toast after 3 seconds');
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save words:', error);
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : error instanceof Error 
          ? error.message 
          : 'Unknown error';
      setToastMessage(`Failed to save words: ${errorMessage}`);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackClick = () => {
    navigate('/vocabulary');
  };

  return (
    <>
      <motion.div
        css={containerStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div css={headerStyle}>
          <div>
            <h1 css={titleStyle}>Input Words</h1>
            {date && <div css={dateDisplayStyle}>{formatDate(date)}</div>}
          </div>
          <button css={backButtonStyle} onClick={handleBackClick} type="button">
            ← Calendar
          </button>
        </div>
        <div css={contentStyle}>
        <motion.div
          css={formStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="word">
              Word *
            </label>
            <input
              id="word"
              css={inputStyle}
              type="text"
              value={currentWord.word}
              onChange={(e) => handleInputChange('word', e.target.value)}
              placeholder="e.g., beautiful"
            />
          </div>
          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="meaning">
              Meaning *
            </label>
            <input
              id="meaning"
              css={inputStyle}
              type="text"
              value={currentWord.meaning}
              onChange={(e) => handleInputChange('meaning', e.target.value)}
              placeholder="e.g., beautiful"
            />
          </div>
          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="partOfSpeech">
              Part of Speech
            </label>
            <select
              id="partOfSpeech"
              css={inputStyle}
              value={currentWord.partOfSpeech || ''}
              onChange={(e) => handleInputChange('partOfSpeech', e.target.value)}
            >
              <option value="">Select part of speech</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="pronoun">Pronoun</option>
              <option value="preposition">Preposition</option>
              <option value="conjunction">Conjunction</option>
              <option value="interjection">Interjection</option>
              <option value="determiner">Determiner</option>
              <option value="article">Article</option>
            </select>
          </div>
          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="synonyms">
              Synonyms (comma-separated)
            </label>
            <input
              id="synonyms"
              css={inputStyle}
              type="text"
              value={currentWord.synonyms}
              onChange={(e) => handleInputChange('synonyms', e.target.value)}
              placeholder="e.g., pretty, gorgeous, lovely"
            />
          </div>
          <div css={formGroupStyle}>
            <label css={labelStyle} htmlFor="example">
              Example
            </label>
            <textarea
              id="example"
              css={textareaStyle}
              value={currentWord.example}
              onChange={(e) => handleInputChange('example', e.target.value)}
              placeholder="e.g., She is a beautiful woman."
            />
          </div>
          <div css={buttonGroupStyle}>
            <button css={addButtonStyle} onClick={handleAddWord} type="button">
              Add Word
            </button>
            <button
              css={saveButtonStyle}
              onClick={handleSave}
              type="button"
              disabled={isSaving || words.length === 0}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div
            css={wordsListStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p style={{ textAlign: 'center', color: '#666' }}>Loading words...</p>
          </motion.div>
        ) : (
          words.length > 0 && (
            <motion.div
              css={wordsListStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 css={titleStyle} style={{ marginBottom: '1rem', color: '#333' }}>
                Saved Words ({words.length})
              </h2>
              {words.map((word) => (
                <div key={word.id} css={wordItemStyle}>
                  <div css={wordInfoStyle}>
                    <div css={wordTitleStyle}>{word.word}</div>
                    <div css={wordDetailStyle}>{word.meaning}</div>
                    {word.partOfSpeech && (
                      <div css={wordDetailStyle}>Part of Speech: {word.partOfSpeech}</div>
                    )}
                    {word.synonyms && 
                     (Array.isArray(word.synonyms) ? word.synonyms.length > 0 : word.synonyms) && (
                      <div css={wordDetailStyle}>
                        Synonyms: {Array.isArray(word.synonyms) 
                          ? word.synonyms.join(', ') 
                          : word.synonyms}
                      </div>
                    )}
                    {word.example && (
                      <div css={wordDetailStyle}>Example: {word.example}</div>
                    )}
                  </div>
                  <button
                    css={deleteButtonStyle}
                    onClick={() => handleDeleteWord(word.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </motion.div>
          )
        )}
        </div>
      </motion.div>
        <Toast
          message={toastMessage}
          isVisible={showToast}
          type={toastType}
        />
    </>
  );
}

export default VocabularyInput;

