function Resizer({ columnId, onMouseDown }) {
	return (
		<div
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
export default Resizer
