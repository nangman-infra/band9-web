/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { WordInput } from '/Users/junoshon/Developments/band9-web/src/domains/vocabulary/types.ts';

const containerStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
  padding: 2rem;
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
  const [words, setWords] = useState<Array<WordInput & { id: string }>>([]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${month}/${day}/${year}`;
  };

  const handleInputChange = (field: keyof WordInput, value: string) => {
    setCurrentWord((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddWord = () => {
    if (currentWord.word && currentWord.meaning) {
      const newWord = {
        ...currentWord,
        id: Date.now().toString(),
      };
      setWords((prev) => [...prev, newWord]);
      setCurrentWord(INITIAL_WORD);
    }
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) => prev.filter((word) => word.id !== id));
  };

  const handleSave = () => {
    // TODO: 백엔드 API 호출
    console.log('Words to save:', words);
    alert('Words saved successfully!');
  };

  const handleBackClick = () => {
    navigate('/vocabulary');
  };

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
            <input
              id="partOfSpeech"
              css={inputStyle}
              type="text"
              value={currentWord.partOfSpeech}
              onChange={(e) => handleInputChange('partOfSpeech', e.target.value)}
              placeholder="e.g., adjective"
            />
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
            <button css={saveButtonStyle} onClick={handleSave} type="button">
              Save
            </button>
          </div>
        </motion.div>

        {words.length > 0 && (
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
        )}
      </div>
    </motion.div>
  );
}

export default VocabularyInput;

