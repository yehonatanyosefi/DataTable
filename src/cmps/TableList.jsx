import { memo } from 'react'
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
	if (!rowData) return <div>Loading...</div>

	return (
		<>
			<div className="data-table">
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
export default memo(TableList)
