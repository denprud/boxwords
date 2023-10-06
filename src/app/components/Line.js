import React from 'react'
import { useState } from 'react';

export default function Line({baseClass, rowValidity}) {

  const [className, setClassName] = useState(baseClass);

  if(rowValidity){
  return (
    <div className={className+ " validline"}></div>
  )
  }
  else{
  return (
    <div className={className+ " invalidline"}></div>
  )
  }
}

