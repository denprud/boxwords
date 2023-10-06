import React, { useEffect } from "react";


export default function useOutsideAlerter(gameCompleted, ref, isSelecting, setDisplayValidity, handleClick) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        
        //setDisplayValidity(false)
        if(!isSelecting){
          if (ref.current && !ref.current.contains(event.target)) {
            //alert("You clicked outside of me!");
            handleClick()
            
          }
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [gameCompleted, ref, isSelecting, handleClick, setDisplayValidity]);
  }