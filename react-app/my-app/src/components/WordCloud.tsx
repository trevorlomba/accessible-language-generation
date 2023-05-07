import React, { useState } from "react";
import wordsData from "../data/words.json";
import styles from "../styles/WordCloud.module.css";

interface WordCloudProps {
  selectedWords: string[];
  setSelectedWords: React.Dispatch<React.SetStateAction<string[]>>;
}

const WordCloud: React.FC<WordCloudProps> = ({ selectedWords, setSelectedWords }) => {
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [clearLettersOnWordSelect, setClearLettersOnWordSelect] = useState(true);

  const handleAddWord = (val: string) => {
    console.log(val);
    if (selectedWords.includes(val)) {
      setSelectedWords(selectedWords.filter((word) => word !== val));
    } else {
      setSelectedWords([...selectedWords, val]);
      if (clearLettersOnWordSelect) {
        setSelectedLetters([]);
      }
    }
  };

  const handleLetterClick = (letter: string) => {
    
      setSelectedLetters([...selectedLetters, letter]);
    
  };

    const handleAddSelectedLetters = () => {
    const selectedWord = selectedLetters.join('').toLowerCase();
    if (!selectedWords.includes(selectedWord)) {
      setSelectedWords([...selectedWords, selectedWord]);
    }
    setSelectedLetters([]);
  };

  const visibleWords = wordsData
  .filter((word) =>
    selectedLetters.length === 0 || word.text.startsWith(selectedLetters.join("").toLowerCase())
  )
  .sort((a, b) => b.frequency - a.frequency) // Sort by frequency in descending order
  .slice(0, 100); // Keep only the top 20 words


  const minFrequency = Math.min(...visibleWords.map((word) => word.frequency));
  const maxFrequency = Math.max(...visibleWords.map((word) => word.frequency));

  const computeFontSize = (frequency: number): number => {
    const minFontSize = 12;
    const maxFontSize = 50;
    return minFontSize + (((frequency - minFrequency) / (maxFrequency - minFrequency)) * (maxFontSize - minFontSize));
  };

//   const color = () => {
//     return '#' + Math.floor(Math.random()*16777215).toString(16);
//   };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div>
      <div>
        {selectedWords.map((val, i) => (
          <button key={i} value={val} onClick={() => handleAddWord(val)}style={{fontSize: "20px",
          margin: "5px",
          marginBottom: "20px"}}>
            {val}
          </button>
        ))}
        {selectedWords.length > 0 && (
        <div>
        <button onClick={() => setSelectedWords([])}>Clear Selected Words</button>
      </div>)}</div>

      <div>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            style={{ margin: "calc(1vw)", padding: "calc(1vw)", fontSize: "calc(100vw / 30)", borderRadius: "50%",}}
          >
            {letter}
          </button>
        ))}
        <button style={{ margin: "10px", padding: "20px", fontSize: "15px", backgroundColor: "aqua"}} onClick={() => setSelectedLetters(selectedLetters.slice(0, -1))}>Backspace</button>
        <div>
        <button onClick={() => setSelectedLetters([])}>Clear Selected Letters</button>
        <button onClick={handleAddSelectedLetters}>Add Selected Letters as Word</button>
      </div></div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={clearLettersOnWordSelect}
            onChange={() => setClearLettersOnWordSelect(!clearLettersOnWordSelect)}
          />
          Clear selected letters when a new word is chosen
        </label>
      </div>
        <div style={{margin: "20px", fontSize: "120px"}}>{selectedLetters}</div>

<div className={styles.wordCloud} style={{ margin: "auto", display: "flex", textAlign: "center" }}>
  {visibleWords
    .sort((a, b) => a.text.localeCompare(b.text))
    .map((word) => (
      <div
        key={word.id}
        onClick={() => handleAddWord(word.text)}
        className={styles.word}
        style={{
          fontSize: `${computeFontSize(word.frequency)}px`,
          backgroundColor: "black",
          borderRadius: "50%",
          padding: "5px 10px",
          margin: "5px",
          color: "white",
          display: "inline-block",
          paddingTop: "20px",
          paddingBottom: "20px"
        }}
      >
        {word.text}
      </div>
    ))}
</div>   </div>
  );
};

export default WordCloud;
