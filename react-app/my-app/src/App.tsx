import React, { useState, FormEvent, useEffect } from "react";
import "./App.css";
import axios from "axios";
import WordCloud from "./components/WordCloud";

const App: React.FC = () => {
  const [animal, setAnimal] = useState("");
  const [selectedWords, setSelectedWords] = useState<Array<string>>([]); // ["cat", "dog"]

  const [result, setResult] = useState<Array<string>>([]);

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult([]); // Clear the previous results
    for (let i = 0; i < 3; i++) {
      try {
        const formData = new URLSearchParams();
        formData.append("animal", animal + " " + selectedWords.join(" "));

        const response = await axios.post("http://localhost:5000", formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        setResult((prevResult) => [...prevResult, response.data]);
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };


  const playTTS = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  useEffect(() => {
    if(selectedWords.length > 0) {
    handleSubmit(new Event("submit") as any)}}, [selectedWords])

  return (
    <div className="App">
      <h1>Sentence Generator</h1>

      {result && (
        <div>
          <h2>Phrases</h2>
          <p>
            {result.map((item, index) => (
              <div key={index}>
                {item}
                <button onClick={() => playTTS(item)}>Play</button>
              </div>
            ))}
          </p>
        </div>
      )}
       <form onSubmit={handleSubmit}>
        <label htmlFor="animal"></label>
        {/* <input
          type="text"
          id="animal"
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
        /> */}
        {/* <button type="submit" style={{fontSize: 50, marginBottom: "20px", borderRadius: "2%", color: "white", backgroundColor: "black"}}>Generate Sentences</button> */}
      </form>
      {<WordCloud 
        selectedWords = {selectedWords}
        setSelectedWords = {setSelectedWords}

        />}
    </div>
  );
};

export default App;