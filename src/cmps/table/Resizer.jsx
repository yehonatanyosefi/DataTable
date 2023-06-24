import PropTypes from 'prop-types'
function Resizer({ columnId, onMouseDown }) {
	return (
		<div
			className="resizer"
			title="Resize column"
			style={{
				position: 'absolute',
				top: 0,
				right: 0,
				bottom: 0,
				width: '5px',
				cursor: 'ew-resize',
			}}
			onMouseDown={(e) => onMouseDown(e, columnId)}
		/>
	)
}

Resizer.propTypes = {
	columnId: PropTypes.string.isRequired,
	onMouseDown: PropTypes.func.isRequired,
}

export default Resizer
