import { useState, useEffect } from 'react'

export default function DataTable({ tableData, handleTableDataChange, handleColWidthChange }) {
	const [rowData, setRowData] = useState([])
	const [colWidths, setColWidths] = useState(
		tableData.columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
	)
	const [hiddenColumns, setHiddenColumns] = useState([])

	const [dragging, setDragging] = useState({ columnId: null, startX: 0 })
	const [sortField, setSortField] = useState(null)
	const [sortOrder, setSortOrder] = useState(null) // 'asc' or 'desc'
	const handleToggleColumnVisibility = (columnId) => {
		setHiddenColumns((prevHiddenColumns) => {
			if (prevHiddenColumns.includes(columnId)) {
				return prevHiddenColumns.filter((id) => id !== columnId)
			} else {
				return [...prevHiddenColumns, columnId]
			}
		})
	}

	const handleSortChange = (columnId) => {
		if (sortField === columnId) {
			// If already sorted by this field, toggle the order
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			// Otherwise, sort by this field in ascending order
			setSortField(columnId)
			setSortOrder('asc')
		}
	}

	useEffect(() => {
		let sortedData = [...tableData.data]
		if (sortField) {
			sortedData.sort((a, b) => {
				if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1
				if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1
				return 0
			})
		}
		setRowData(sortedData)
	}, [tableData.data, sortField, sortOrder])
	const visibleColumns = tableData.columns.filter((column) => !hiddenColumns.includes(column.id))
	const gridTemplateColumns = visibleColumns
		.map((column) => `${colWidths[column.id] || '240'}px`)
		.join(' ')

	// const gridTemplateColumns = tableData.columns.map((col) => `${colWidths[col.id] || '240'}px`).join(' ')

	const handleMouseDown = (e, columnId) => {
		setDragging({ columnId, startX: e.pageX })
	}

	const handleMouseMove = (e) => {
		if (dragging.columnId) {
			const deltaX = e.pageX - dragging.startX
			const newWidth = Math.max(colWidths[dragging.columnId] + deltaX, 100)
			setColWidths((prev) => ({ ...prev, [dragging.columnId]: newWidth }))
			setDragging((prev) => ({ ...prev, startX: e.pageX }))
			handleColWidthChange(dragging.columnId, newWidth)
		}
	}

	useEffect(() => {
		document.body.addEventListener('mousemove', handleMouseMove)
		document.body.addEventListener('mouseup', handleMouseUp)
		return () => {
			document.body.removeEventListener('mousemove', handleMouseMove)
			document.body.removeEventListener('mouseup', handleMouseUp)
		}
	}, [dragging, colWidths])

	const handleMouseUp = () => {
		setDragging({ columnId: null, startX: 0 })
	}

	useEffect(() => {
		setRowData(tableData.data)
	}, [tableData.data])

	const handleInputChange = (e, rowId, columnId) => {
		const value = e.target.value
		setRowData((prevState) => {
			return prevState.map((row) => {
				if (row.id === rowId) {
					return {
						...row,
						[columnId]: value,
					}
				} else {
					return row
				}
			})
		})
	}

	const handleBlur = () => {
		handleTableDataChange({
			...tableData,
			data: rowData,
		})
	}

	return (
		<div className="data-table">
			<div className="controls-panel">
				<h3>Column Visibility</h3>
				{tableData.columns.map((column) => (
					<label key={column.id}>
						<input
							type="checkbox"
							checked={!hiddenColumns.includes(column.id)}
							onChange={() => handleToggleColumnVisibility(column.id)}
						/>
						{column.title}
					</label>
				))}
			</div>

			<div className="grid-header" style={{ gridTemplateColumns }}>
				{tableData.columns
					.filter((column) => !hiddenColumns.includes(column.id))
					.map((column) => (
						<div
							key={column.id}
							className="grid-cell"
							style={{ position: 'relative' }}
							onClick={() => handleSortChange(column.id)}>
							{column.title}
							<div
								style={{
									position: 'absolute',
									top: 0,
									right: 0,
									bottom: 0,
									width: '5px',
									cursor: 'ew-resize',
								}}
								onMouseDown={(e) => handleMouseDown(e, column.id)}></div>
						</div>
					))}
			</div>

			{rowData &&
				rowData.map((row) => (
					<div key={row.id} className="grid-row" style={{ gridTemplateColumns }}>
						{tableData.columns
							.filter((column) => !hiddenColumns.includes(column.id))
							.map((column) => (
								<div key={column.id} className="grid-cell">
									<input
										className="edit-input"
										type={column.type}
										value={row[column.id] || ''}
										onChange={(e) => handleInputChange(e, row.id, column.id)}
										onBlur={() => handleBlur(row.id)}
										title={row[column.id] || ''}
									/>
								</div>
							))}
					</div>
				))}
		</div>
	)
}
