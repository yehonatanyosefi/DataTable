import PropTypes from 'prop-types'
import SvgIcon from '../util/SvgIcon'

function DeleteButton({ rowId, onDeleteRow }) {
	return (
		<div className="delete-btn-wrapper">
			<SvgIcon
				iconName="delete"
				className="delete-btn"
				title="Delete Row"
				onClick={() => onDeleteRow(rowId)}
				role="button"
				aria-label="Delete Row"
			/>
		</div>
	)
}

DeleteButton.propTypes = {
	rowId: PropTypes.string.isRequired,
	onDeleteRow: PropTypes.func.isRequired,
}

export default DeleteButton
