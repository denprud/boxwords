import {WORDS} from '../../../data/wordlist.js'
const { useState } = require("react")

export default function enforceRule(rowRule, arr, lists){
    const word = arrayToString(arr)
    console.log(word)
    if (!enforceWord(word)){
        //console.log("not in list")
        return false
    }
    if (rowRule=="none"){
         return true
    }
    return false

    function enforceWord(word){
        let count = 0
        lists.forEach(element => {
            if (word === arrayToString(element.word))
            count += 1
        });
        return WORDS.includes(word) && count < 2;
    }

    function arrayToString(arr){
        let stringOutput = '';
        for (const element of arr){
            stringOutput += element;
        }
        return stringOutput
    }

        
}
        

    
    