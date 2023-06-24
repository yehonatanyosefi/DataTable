import PropTypes from 'prop-types'

const Input = ({ row, column, onInputChange, onBlur }) => {
	return (
		<input
			className="edit-input"
			type={column.type}
			value={row[column.id] || ''}
			onChange={(e) => onInputChange(e, row.id, column.id, column.type)}
			onBlur={onBlur}
			title={row[column.id] || ''}
			aria-label={column.id}
		/>
	)
}

Input.propTypes = {
	row: PropTypes.object.isRequired,
	column: PropTypes.object.isRequired,
	onInputChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
}

export default Input
