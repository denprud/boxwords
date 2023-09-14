import React from "react";
import "./Tutorial.css";

function Tutorial({setShowTutorial}) {
    return (
        <div className="tutorialBackground">
          <div className="tutorialContainer">
            <div className="titleCloseBtn">
              <button
                onClick={() => {
                    setShowTutorial(false);
                }}
              >
                X
              </button>
            </div>
            <div className="title">
              <h1>Box Words Tutorial</h1>
            </div>
            <div className="body">
              <p>Welcome to Boxwords! The rules of the game are simple; fill in each row with a five letter word. But make sure that each word fulfils each rule of the row. 
                Be creative with your word, as the more rare the word the higher your score will be. Each day you will get a new puzzle to solve.</p>
            </div>
          </div>
        </div>
      );
}
  
export default Tutorial;