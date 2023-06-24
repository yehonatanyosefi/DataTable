import { memo } from 'react'
import PropTypes from 'prop-types'
import GridHeader from './table/GridHeader'
import GridRow from './table/GridRow'
import Pagination from './table/Pagination'

function TableList({
	tableData,
	onPageChange,
	paginatedData,
	rowData,
	gridTemplateColumns,
	sortField,
	sortOrder,
	page,
	totalPages,
	hiddenColumns,
	onSortChange,
	onMouseDown,
	onDeleteRow,
	onInputChange,
	onRowDataChange,
}) {
	if (!rowData) return <div role="status">Loading...</div>

	return (
		<>
			<div className="data-table" role="grid" aria-label="Data Table">
				<GridHeader
					tableData={tableData}
					hiddenColumns={hiddenColumns}
					gridTemplateColumns={gridTemplateColumns}
					sortField={sortField}
					sortOrder={sortOrder}
					onSortChange={onSortChange}
					onMouseDown={onMouseDown}
				/>
				{paginatedData &&
					paginatedData.map((row) => (
						<GridRow
							key={row.id}
							row={row}
							tableData={tableData}
							hiddenColumns={hiddenColumns}
							gridTemplateColumns={gridTemplateColumns}
							onInputChange={onInputChange}
							onBlur={onRowDataChange}
							onDeleteRow={onDeleteRow}
						/>
					))}
			</div>
			<Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
		</>
	)
}

TableList.propTypes = {
	tableData: PropTypes.object.isRequired,
	onPageChange: PropTypes.func.isRequired,
	paginatedData: PropTypes.array,
	rowData: PropTypes.array,
	gridTemplateColumns: PropTypes.string,
	sortField: PropTypes.string,
	sortOrder: PropTypes.string,
	page: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	hiddenColumns: PropTypes.array.isRequired,
	onSortChange: PropTypes.func.isRequired,
	onMouseDown: PropTypes.func.isRequired,
	onDeleteRow: PropTypes.func.isRequired,
	onInputChange: PropTypes.func.isRequired,
	onRowDataChange: PropTypes.func.isRequired,
}

export default memo(TableList)
