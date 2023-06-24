import { memo } from 'react'
import ColumnVisibilityDropdown from './tableHeader/ColumnVisibilityDropdown'
function TableHeader({ columns, hiddenColumns, onToggleColumnVisibility, handleModalChange }) {
	return (
		<div className="table-header">
			<h1>Cemento Board</h1>
			<div className="controls">
				<button className="add-data-btn" onClick={() => handleModalChange}>
					Add Data
				</button>
				<ColumnVisibilityDropdown
					columns={columns}
					hiddenColumns={hiddenColumns}
					onToggleColumnVisibility={onToggleColumnVisibility}
				/>
			</div>
		</div>
	)
}

export default memo(TableHeader)
