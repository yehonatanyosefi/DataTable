function Checkbox({ row, column, onInputChange }) {
	return (
		<label className="checkbox-container">
			<input
				className="hidden-checkbox"
				type="checkbox"
				checked={row[column.id] || false}
				onChange={(e) => onInputChange(e, row.id, column.id, column.type)}
			/>
			<span className="custom-checkbox" />
		</label>
	)
}
export default Checkbox
