import React from "react";
import { useNavigate } from "react-router-dom";

const Instructions = ({ setStartTimer, name }) => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate("/quiz");
    setStartTimer(true);
  };
  return (
    <div className="Main_Div">
      <div className="Instructions_Div">
        <h4>
          Hi <span>{name}</span>, Welcome!! Please read the instructions
          carefully
        </h4>
        <ul>
          <li>
            This quiz consists of 10 MCQ questions. You will be given 10 minute for Quiz
          </li>
          <li>
            Give the answers carefully as you can't go back once you select an
            answer
          </li>
          <li>Each correct answer carries 1 mark</li>
          <li>To start the Quiz, click the “Start Quiz” button.</li>
        </ul>
        <button onClick={startQuiz}>Start Quiz</button>
      </div>
    </div>
  );
};

export default Instructions;
