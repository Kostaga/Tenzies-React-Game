
import './style.css';
import Die from  './Components/Die';
import React from "react";
import {nanoid} from "nanoid";
import useWindowSize from './useWindowSize';
import Confetti from 'react-confetti';


function App() {


  const generateNewDie = () => {
    return {
        id: nanoid(),
        value: Math.floor(Math.random() * 7),
        isHeld: false
    }
  }

  const allNewDice = () => {
    let dices = [];
  
    for (let i = 0; i < 10; i++) {
      dices.push(generateNewDie());
    }
    return dices;
  }

  
  const [dice,setDice] = React.useState(allNewDice);

  const [tenzies, setTenzies] = React.useState(false);

  const [rolls, setRolls] = React.useState(0);

  const [time, setTime] = React.useState(Date.now());

  const [bestTime, setBestTime] = React.useState(() => JSON.parse(localStorage.getItem("BestTime")) || 'None');

  console.log(bestTime);

  React.useEffect(() => {
    let tempArr = [];

    dice.forEach((diceElement) => {
      if (diceElement.isHeld)
        tempArr.push(diceElement.value);
    })

    if (tempArr.length === dice.length && tempArr.every(die => die === tempArr[0])) {
      setTenzies(true);
      setTime(prev =>{
         const newTime = (Date.now() - prev)/1000;
         return newTime.toFixed(2);
      }) 

    }
    

  },[dice]) 


  React.useEffect(() => {
    if (time < bestTime) {
        setBestTime(time);
        localStorage.setItem("BestTime", JSON.stringify(time));
    }
  },[bestTime,time])


  React.useEffect(() => {
    const savedTime = localStorage.getItem("BestTime");
    const initialValue = JSON.parse(savedTime);
    if (initialValue !== null) {
      setBestTime(initialValue);
    }

  }, []);

  const rollDice = () => {
    if (tenzies) {
      setDice(allNewDice());
      setTenzies(false);
      setRolls(0);
      setTime(Date.now());
    }
    else {
      setDice(previous => 
        previous.map((dice) => {
          return dice.isHeld ? 
          dice : generateNewDie()
      }));

      setRolls(prev => prev + 1)
  }
  }


  const holdDice = (id) => {
    setDice(previous => 
       previous.map((dice) => {
        return dice.id === id ? 
        {...dice ,isHeld:!dice.isHeld} : dice 
      })
    )
  }


  const diceElements = dice.map((die) => {
    return (
      <Die handleClick={() => holdDice(die.id)} key = {die.id} value={die.value} isHeld = {die.isHeld} />
    )
  }) 

  const { width, height } = useWindowSize();

  return (
    
    <main>
      <div className='info'>
        <h2 className='highscore'>Best Time: {bestTime ? bestTime : "None"} </h2>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <h2>{`Current Rolls: ${rolls}`}</h2>
        {tenzies && <h2>Time it took to win: {time}s</h2>}
      </div>
      <div className="App">
          {diceElements}
          
      </div>
      <button onClick={rollDice} className='roll' type='button'>{tenzies ? 'New Game' : 'Roll'}</button>

      {tenzies && <Confetti width={width} height={height}/>}
    </main>
  );
}

export default App;
