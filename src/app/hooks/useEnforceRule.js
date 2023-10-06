import {WORDS} from '../../../data/wordlist.js'
const { useState } = require("react")

/*
@params 
rowRule: Takes the current rule of the row
arr: the current array stucture of the row
lists: the current list or wordset
*/
export default function enforceRule(rowRule, arr, lists){
    const word = arrayToString(arr)
    //console.log(word)
    if (!checkWordValidity(word)){
        //console.log("not in list")
        return false
    }
    if (rowRule=="none"){
         return true
    }
    if (rowRule=="palindrome"){
        return palindrome(arr)
    }
    //Otherwise the rule is part of a complex object
    else{
        if (typeof(rowRule)==="object"){
            if(rowRule.name === "enforce"){
                return enforce(arr, rowRule.char, rowRule.count)
            }
        }
    }
    
    return false

    function checkWordValidity(word){
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

    function palindrome(arr){
        if (arr[0] === arr[4]){
            if(arr[1] === arr[3]){
                return true
            }
        }
        return false
    }

    function enforce(arr, char, count){
        
       let letterCount = 0
       arr.forEach(element=>{
            if(element === char){
                letterCount+=1
            }
       })
       //console.log(letterCount)
       return letterCount >= count
    }

        
}
        

    
    