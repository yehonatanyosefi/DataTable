import { useState, useEffect } from 'react'
import { getSvg } from '../../services/svg.service'

const SvgMarkup = ({ markup, ...rest }) => {
	return <span dangerouslySetInnerHTML={{ __html: markup }} {...rest} />
}

const SvgIcon = ({ iconName, ...rest }) => {
	const { className } = rest
	const [svgMarkup, setSvgMarkup] = useState(null)

	useEffect(() => {
		const fetchSvg = () => {
			const markup = getSvg(iconName)
			setSvgMarkup(markup)
		}
		fetchSvg()
	}, [iconName])

	if (!svgMarkup) {
		return null
	}
	if (className) {
		delete rest.className
		return <SvgMarkup markup={svgMarkup} className={`svg-icon ${className}`} {...rest} />
	}
	return <SvgMarkup markup={svgMarkup} className="svg-icon" {...rest} />
}
export default SvgIcon
