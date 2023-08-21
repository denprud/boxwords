import React, { useEffect } from "react";


export default function useOutsideAlerter(ref, isSelecting, handleClick) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        console.log(ref.current)
        if(!isSelecting){
          if (ref.current && !ref.current.contains(event.target)) {
            alert("You clicked outside of me!");
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
    }, [ref, isSelecting, handleClick]);
  }