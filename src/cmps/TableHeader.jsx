import { memo } from 'react'
import PropTypes from 'prop-types'
import ColumnVisibilityDropdown from './tableHeader/ColumnVisibilityDropdown'

function TableHeader({ columns, hiddenColumns, onToggleColumnVisibility, handleModalChange }) {
	return (
		<div className="table-header">
			<h1 id="table-title">Cemento Board</h1>
			<div className="controls">
				<button
					className="add-data-btn"
					onClick={handleModalChange}
					aria-controls="modal"
					aria-expanded={false}>
					Add Data
				</button>
				<ColumnVisibilityDropdown
					columns={columns}
					hiddenColumns={hiddenColumns}
					onToggleColumnVisibility={onToggleColumnVisibility}
					aria-labelledby="table-title"
				/>
			</div>
		</div>
	)
}

TableHeader.propTypes = {
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			title: PropTypes.string,
			type: PropTypes.string,
		})
	).isRequired,
	hiddenColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
	onToggleColumnVisibility: PropTypes.func.isRequired,
	handleModalChange: PropTypes.func.isRequired,
}

export default memo(TableHeader)
