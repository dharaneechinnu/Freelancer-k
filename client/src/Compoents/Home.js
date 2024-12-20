import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import backgroundImage from '../Assest/bg.png';
import { Link } from "react-router-dom";

const Home = () => {
  const [currentText, setCurrentText] = useState("Bring the change in you");

  useEffect(() => {
    const texts = [
      "Bring the change in you",
      "For a focussed mind and to stay balanced",
      "No extra time required. Simply excel at what you do by using a different approach."
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setCurrentText(texts[index]);
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <Container id='home'>
      <BackgroundImage />
      <CenteredText>{currentText}<br />
      <Link to={"/login"}>
      <Button className='read'>Start Your Journey</Button>

      </Link>
      </CenteredText>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Button = styled.button`
  padding: 15px 25px;
  font-size: 1rem;
  font-family: Poppins;
  color: black;
  background-color: transparent;
  border: 2px solid black;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #fff;
    color: #FDA537;
    border: 2px solid white;
}

  @media (max-width: 768px) {
    font-size: 1rem;
}
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  z-index: -1;
  // margin-top:75px;


  @media (max-width: 768px) {
    background-position: center;
}

  @media (max-width: 480px) {
    background-position: center;
}
`;

const CenteredText = styled.h1`
  color: black;
  font-size: 3rem;
  text-align: center;
  z-index: 1;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    width: 90%;
  }
`;

export default Home;
