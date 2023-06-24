import { useRef, useEffect } from 'react'

function useThrottle(fn, delay) {
	const fnRef = useRef(fn)
	const throttled = useRef({ wait: false })

	useEffect(() => {
		fnRef.current = fn
	})

	throttled.current = function (...args) {
		if (!throttled.current.wait) {
			fnRef.current.apply(this, args)
			throttled.current.wait = true
			setTimeout(() => {
				throttled.current.wait = false
			}, delay)
		}
	}

	return throttled.current
}

export default useThrottle
