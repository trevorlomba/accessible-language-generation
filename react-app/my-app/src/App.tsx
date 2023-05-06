import React, { useState, FormEvent } from "react";
import "./App.css";
import axios from "axios";
import WordCloud from "./components/WordCloud";

const App: React.FC = () => {
  const [animal, setAnimal] = useState("");
  const [result, setResult] = useState<Array<string>>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newResults: Array<string> = [];
    for (let i = 0; i < 3; i++) {
      try {
        const formData = new URLSearchParams();
        formData.append("animal", animal);

        const response = await axios.post("http://localhost:5000", formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        newResults.push(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setResult([...newResults]);
  };

  return (
    <div className="App">
      <h1>Sentence Generator</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="animal">Keywords:</label>
        <input
          type="text"
          id="animal"
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
        />
        <button type="submit">Generate Sentences</button>
      </form>
      {result && (
        <div>
          <h2>Phrases</h2>
          <p>
            {result.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </p>
        </div>
      )}
      {<WordCloud />}
    </div>
  );
};

export default App;
