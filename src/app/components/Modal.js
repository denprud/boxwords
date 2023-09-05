import React from "react";
import "./Modal.css";

function Modal({ setOpenModal, numberOfTries }) {
  //Must be less than four because of a calculating error form useEffect
  if (numberOfTries < 3){
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="title">
          <h1>Congrats</h1>
        </div>
        <div className="message">
          <p>You've completed the puzzle!</p>
        </div>
        <div className="footer">
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
            <h1>Congrats</h1>
          </div>
          <div className="message">
            <p>You finished the puzzle</p>
          </div>
          <div className="footer">
          </div>
        </div>
      </div>
     );
  }
}

export default Modal;
