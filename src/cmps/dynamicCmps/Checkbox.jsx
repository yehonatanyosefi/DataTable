import PropTypes from 'prop-types'

function Checkbox({ row, column, onInputChange }) {
	return (
		<label className="checkbox-container">
			<input
				className="hidden-checkbox"
				type="checkbox"
				checked={row[column.id] || false}
				onChange={(e) => onInputChange(e, row.id, column.id, column.type)}
				aria-checked={row[column.id] || false}
			/>
			<span className="custom-checkbox" />
		</label>
	)
}

Checkbox.propTypes = {
	row: PropTypes.object.isRequired,
	column: PropTypes.object.isRequired,
	onInputChange: PropTypes.func.isRequired,
}

export default Checkbox
