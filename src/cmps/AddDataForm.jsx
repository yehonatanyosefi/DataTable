import { useState, useEffect } from 'react'
import Modal from './util/Modal'

const AddDataForm = ({ isOpen, onRequestClose, onAddData, columns }) => {
	const [newData, setNewData] = useState({})

	useEffect(() => {
		const initialData = {}
		columns.forEach((column) => {
			if (column.type === 'boolean') {
				initialData[column.id] = false
			} else if (column.type === 'number') {
				initialData[column.id] = 0
			} else {
				initialData[column.id] = ''
			}
		})
		setNewData(initialData)
	}, [columns])

	const handleChange = (event, columnId, type) => {
		const value = type === 'boolean' ? event.target.checked : event.target.value
		setNewData({ ...newData, [columnId]: value })
	}

	const handleSubmit = (event) => {
		event.preventDefault()

		// Form validation
		for (const [key, value] of Object.entries(newData)) {
			const column = columns.find((column) => column.id === key)
			if (column.type === 'string' && value.trim() === '') {
				alert(`${column.title} is required.`)
				return
			}
			if (column.type === 'number' && isNaN(value)) {
				alert(`${column.title} must be a number.`)
				return
			}
		}

		onAddData(newData)
		onRequestClose()
	}

	return (
		<Modal isOpen={isOpen} onRequestClose={onRequestClose}>
			<div className="add-data-form">
				<h2>Add Data</h2>
				<form onSubmit={handleSubmit}>
					{columns.map((column) => (
						<label key={column.id}>
							{column.title}:
							{column.type === 'boolean' ? (
								<input
									type="checkbox"
									checked={newData[column.id] || false}
									onChange={(e) => handleChange(e, column.id, column.type)}
									required
								/>
							) : (
								<input
									type={column.type === 'number' ? 'number' : 'text'}
									value={newData[column.id] || ''}
									onChange={(e) => handleChange(e, column.id, column.type)}
									required
								/>
							)}
						</label>
					))}
					<button type="submit">Submit</button>
				</form>
			</div>
		</Modal>
	)
}

export default AddDataForm
