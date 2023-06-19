import { useState, useEffect, useRef } from 'react'

export default function DataTable({ tableData, handleTableDataChange, handleColWidthChange }) {
	const [rowData, setRowData] = useState([])
	const [colWidths, setColWidths] = useState(
		tableData.columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
	)
	const [dragging, setDragging] = useState({ columnId: null, startX: 0 })

	const gridTemplateColumns = tableData.columns.map((col) => `${colWidths[col.id] || '240'}px`).join(' ')

	const handleMouseDown = (e, columnId) => {
		setDragging({ columnId, startX: e.pageX })
	}

	const handleMouseMove = (e) => {
		if (dragging.columnId) {
			const deltaX = e.pageX - dragging.startX
			const newWidth = Math.max(colWidths[dragging.columnId] + deltaX, 50)
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
			<div className="grid-header" style={{ gridTemplateColumns }}>
				{tableData.columns.map((column) => (
					<div key={column.id} className="grid-cell" style={{ position: 'relative' }}>
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
						{tableData.columns.map((column) => (
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
