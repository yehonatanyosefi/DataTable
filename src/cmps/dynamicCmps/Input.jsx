const Input = ({ row, column, onInputChange, onBlur }) => {
	return (
		<input
			className="edit-input"
			type={column.type}
			value={row[column.id] || ''}
			onChange={(e) => onInputChange(e, row.id, column.id, column.type)}
			onBlur={onBlur}
			title={row[column.id] || ''}
		/>
	)
}
export default Input
