'use client'

import React, { useRef } from 'react'
import { useState } from 'react';


export default function Row({baseClass, onRowClick, hoverStatus, reference}) {
  
  const [className, setClassName] = useState(baseClass);

    function Square(){
        return <div className="square"></div>
    }

  return (
    <>
        <div className={className}
        ref={reference} 
        onMouseEnter={() => {
          setClassName(() => { return hoverStatus ? baseClass + " hover" : baseClass});
          console.log(className);
        }}
        onMouseLeave={() => {
          setClassName(baseClass)
        }}
        onClick={onRowClick}>
            <Square />
            <Square />
            <Square />
            <Square />
            <Square />
        </div>
    </>
  )
}
