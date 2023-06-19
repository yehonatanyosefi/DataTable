import { useState, useEffect, useRef, useCallback } from 'react'

export function useCallbackState(initialValue) {
     const [state, setState] = useState(initialValue)
     const callbacksQueueRef = useRef([])

     const setCallbackState = useCallback((value, callback) => {
          if (callback && typeof callback === "function") {
               callbacksQueueRef.current.push(callback)
          }
          setState(value)
     }, [])

     useEffect(() => {
          if (callbacksQueueRef.current.length > 0) {
               callbacksQueueRef.current.forEach((callback) => callback(state))
               callbacksQueueRef.current = []
          }
     }, [state])

     return [state, setCallbackState]
}

//!Usage:
// const [cb, setCb] = useCallbackState(null)
// setCb('check', (newCb)=>{console.log(`cb:`, newCb)}) - works