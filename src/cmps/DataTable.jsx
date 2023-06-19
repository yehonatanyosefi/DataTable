import { useState, useEffect, useRef } from 'react'

export default function DataTable({ tableData, handleTableDataChange }) {
	const [rowData, setRowData] = useState([])
	const [colWidths, setColWidths] = useState(
		tableData.columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
	)
	const headerRef = useRef(null)
	let draggingColumnId = null
	let draggingStartX = 0

	const handleMouseDown = (e, columnId) => {
		draggingColumnId = columnId
		draggingStartX = e.pageX
	}

	const handleMouseMove = (e) => {
		if (draggingColumnId) {
			const currentWidth = colWidths[draggingColumnId]
			const newWidth = Math.max(currentWidth + e.pageX - draggingStartX, 50) // Minimum width of 50
			setColWidths((prev) => ({ ...prev, [draggingColumnId]: newWidth }))
			draggingStartX = e.pageX
		}
	}

	const handleMouseUp = () => {
		draggingColumnId = null
	}

	useEffect(() => {
		setRowData(tableData.data)
	}, [tableData.data])

	useEffect(() => {
		if (headerRef.current) {
			headerRef.current.addEventListener('mousemove', handleMouseMove)
			headerRef.current.addEventListener('mouseup', handleMouseUp)
		}
		return () => {
			if (headerRef.current) {
				headerRef.current.removeEventListener('mousemove', handleMouseMove)
				headerRef.current.removeEventListener('mouseup', handleMouseUp)
			}
		}
	}, [headerRef.current])

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

	const handleBlur = (rowId) => {
		handleTableDataChange({
			...tableData,
			data: rowData,
		})
	}

	const gridTemplateColumns = tableData.columns.map((col) => `${colWidths[col.id] || '240'}px`).join(' ')

	return (
		<div className="data-table">
			<div ref={headerRef} className="grid-header" style={{ gridTemplateColumns }}>
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
								/>
							</div>
						))}
					</div>
				))}
		</div>
	)
}
