import React, { useState, FormEvent } from "react";
import axios from "axios";
import wordsData from "../data/words.json";

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

  const wordsDataOrdered = wordsData.sort((a, b) => {
    return b.frequency - a.frequency;
    });

   return (
    <div>
      <h1>Word List</h1>
      <ol>
        {wordsDataOrdered.map((word) => (
          <li key={word.id}>
            {word.text} - {word.frequency}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;
