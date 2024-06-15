import React, { useState, useEffect } from "react";
import { quizQuestions } from "../QuizData/quizdata";
import { useNavigate } from "react-router-dom";

const Quiz = ({ startTimer, setName }) => {
  const [qNumber, setQNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(false);
  const [clickedAnswer, setClickedAnswer] = useState([]);
  const [totalSeconds, setTotalSeconds] = useState(600); // 10 minutes
  const [currentTime, setCurrentTime] = useState(600);
  const [isFullScreen, setIsFullScreen] = useState(true); // New state for fullscreen check

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("quizTimer", JSON.stringify(600)); // Reset to zero
  }, []);

  useEffect(() => {
    const savedTimer = localStorage.getItem("quizTimer");
    if (savedTimer) {
      const parsedTimer = JSON.parse(savedTimer);
      setTotalSeconds(parsedTimer);
      setCurrentTime(parsedTimer);
    }
  }, []);

  useEffect(() => {
    const saveTimerState = () => {
      localStorage.setItem("quizTimer", JSON.stringify(totalSeconds));
    };

    if (!startTimer) return;

    const checkFullScreen = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", checkFullScreen);
    const timer = setInterval(() => {
      setTotalSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          setDisplayScore(true);
          clearInterval(timer);
          return 0;
        }
        saveTimerState();
        setCurrentTime(prevSeconds - 1);
        return prevSeconds - 1;
      });
    }, 1000);

    checkFullScreen();

    return () => {
      clearInterval(timer);
      document.removeEventListener("fullscreenchange", checkFullScreen);
    };
  }, [startTimer, totalSeconds]);

  const requestFullScreen = () => {
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const selectedAnswer = (selected, id) => {
    setClickedAnswer((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((item) => item !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  const submitAnswers = () => {
    const correctAnswers = quizQuestions[qNumber].answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer.id);
  
    const selectedAnswers = clickedAnswer;
  
    // Check if all correct answers are selected
    const allCorrectSelected = correctAnswers.every((id) => selectedAnswers.includes(id));
  
    // If no answer is selected, treat it as incorrect
    const areAllCorrect = selectedAnswers.length > 0 && allCorrectSelected;
  
    if (areAllCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  
    const nextQ = qNumber + 1;
    if (nextQ < quizQuestions.length) {
      setQNumber(nextQ);
      setClickedAnswer([]);
    } else {
      setDisplayScore(true);
    }
  };
  

  return (
    <div className="Main_Div">
      <div className="Quiz_Div">
        {!isFullScreen ? (
          <div className="fullscreen_popup">
            <p>Please enable fullscreen mode to take the quiz.</p>
            <button onClick={requestFullScreen}>Enter Fullscreen</button>
          </div>
        ) : displayScore ? (
          <div className="score">
            <p >
              Your score: {score} / {quizQuestions.length}
            </p>
            <div className="buttons_div">
              <button
                onClick={() => {
                  navigate(-1);
                  setName("");
                }}
              >
                Retry
              </button>
              <button
                onClick={() => {
                  navigate("/");
                  setName("");
                }}
              >
                Exit
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz_top_div">
              <h2>
                {qNumber + 1} of {quizQuestions.length}
              </h2>
              <div>
                Time left: {formatTime(currentTime)}
              </div>
            </div>

            <h5>{quizQuestions[qNumber].question}</h5>
            <ul>
              {quizQuestions[qNumber].answers.map((answer) => (
                <li
                  className={clickedAnswer.includes(answer.id) ? `answerCss` : null}
                  key={answer.id}
                  onClick={() => selectedAnswer(answer.isCorrect, answer.id)}
                >
                  {answer.ans}
                </li>
              ))}
            </ul>

            <button onClick={submitAnswers}>Submit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
