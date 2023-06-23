import { useState, useRef } from 'react'
import useClickOutside from '../customHooks/useClickOutside'

function ColumnVisibilityDropdown({ columns, hiddenColumns, onToggleColumnVisibility }) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null)

	useClickOutside(dropdownRef, () => setIsOpen(false))

	const toggleDropdown = () => setIsOpen(!isOpen)

	const toggleColumnVisibility = (columnId) => {
		onToggleColumnVisibility(columnId)
	}

	return (
		<div className={`dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
			<button className="dropdown-btn" onClick={toggleDropdown}>
				Column Visibility
			</button>
			<div className="dropdown-content">
				{columns.map((column) => (
					<div
						key={column.id}
						className={`dropdown-item ${!hiddenColumns.includes(column.id) ? 'active' : ''}`}
						onClick={() => toggleColumnVisibility(column.id)}>
						{column.title}
					</div>
				))}
			</div>
		</div>
	)
}

export default ColumnVisibilityDropdown
