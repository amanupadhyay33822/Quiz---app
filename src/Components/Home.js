import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ setName, name }) => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  //onclick of start button ====> Go to instructions page
  const start = () => {
    if (name === "") {
      setError(true);
    } else {
      setError(false);
      navigate("/instructions");
    }
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    const re = /^[A-Za-z]+$/;
    if (re.test(value) || value === "") {
      setName(value);
      if (value.length > 0) {
        setError(false);
      } else {
        setError(true);
      }
    }
  };
  return (
    <div className="Main_Div">
      <div className="Home_Div">
        <h1>Quiz</h1>
        <p className="first_p">Enter your name to start the quiz</p>
        <input
          type="text"
          value={name}
          name="name"
          placeholder="your name"
          autoComplete="off"
          onChange={(e) => handleNameChange(e)}
        />
        {error && <p className="error">Please enter your name</p>}
        <button onClick={start}>Click here to start</button>
      </div>
    </div>
  );
};
export default Home;
