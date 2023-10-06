import React, { useEffect, useState } from "react";
import "./Modal.css";

function Modal({ setOpenModal, numberOfTries, rarity, maxRarity }) {
  //Must be less than four because of a calculating error form useEffect
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setTimeout(() => {
       setLoading(false)
    }, 1100)

  }, []);

  if(loading){
    return null
  }

  if (numberOfTries < 3){
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="title">
        <div className="message">Score</div>
          <h1>{rarity}</h1>
        </div>
        <div className="message">
          <p>
            You&apos;ve solved the puzzle!
          </p>
        </div>
        <div className="footer">
        <button
            onClick={() => {
              window.open(`https://twitter.com/intent/tweet?text=Box%20Words%0ARarity%20Score:%20${rarity}%0Aboxwords.vercel.app`, '_blank');
            }}
            id="tweetBtn"
          >Tweet Score</button>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
   );
  }
  else{
    return (
      <div className="modalBackground">
        <div className="modalContainer">
        <div className="title">
        <div className="message">Best Rarity Score</div>
          <h1>{maxRarity}</h1>
        </div>
          <div className="message">
            <p>You finished the puzzle</p>
          </div>
          <div className="footer">
            <button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=Box%20Words%0ARarity%20Score:%20${maxRarity}%0Aboxwords.vercel.app`, '_blank');
              }}
              id="tweetBtn"
            >Tweet Score</button>
          </div>
        </div>
      </div>
     );
  }
}

export default Modal;
