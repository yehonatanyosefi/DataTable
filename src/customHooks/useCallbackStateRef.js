
import { useState, useEffect, useRef, useCallback } from 'react'

export function useCallbackState(initialValue) {
     const [state, setState] = useState(initialValue)
     const stateRef = useRef(initialValue)
     const callbacksQueueRef = useRef([])

     const setCallbackState = useCallback((value, callback) => {
          if (callback) {
               callbacksQueueRef.current.push(callback)
          }
          stateRef.current = value
          setState(value)
     }, [])

     useEffect(() => {
          if (callbacksQueueRef.current.length > 0) {
               callbacksQueueRef.current.forEach((callback) => callback())
               callbacksQueueRef.current = []
          }
     }, [state])

     return [state, setCallbackState, stateRef]
}


//!Usage:
// const [cb, setCb, cbRef] = useCallbackState(null)
// setCb('check', ()=>{console.log(`cb:`, cbRef.current)}) - works
// console.log(`cb:`, cbRef.current) - works too