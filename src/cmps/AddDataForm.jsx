import { useState, useEffect } from 'react'
import Modal from './util/Modal'

const AddDataForm = ({ isOpen, onRequestClose, onAddData, columns }) => {
	const [newData, setNewData] = useState({})
	const [error, setError] = useState('')

	useEffect(() => {
		const initialData = {}
		columns.forEach((column) => {
			if (column.type === 'boolean') {
				initialData[column.id] = false
			} else if (column.type === 'number') {
				initialData[column.id] = 0
			} else if (column.type === 'string') {
				initialData[column.id] = ''
			} else {
				initialData[column.id] = null
				setError('Error: Unknown column type')
			}
		})
		setNewData(initialData)
	}, [columns])

	const handleChange = (event, column, type) => {
		const value = type === 'boolean' ? event.target.checked : event.target.value
		setNewData({ ...newData, [column.id]: value })
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		onAddData(newData)
		onRequestClose()
	}

	return (
		<Modal isOpen={isOpen} onRequestClose={onRequestClose}>
			{error && <p>{error}</p>}
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
									onChange={(e) => handleChange(e, column, column.type)}
								/>
							) : (
								<input
									type={column.type === 'number' ? 'number' : 'text'}
									value={newData[column.id] || ''}
									onChange={(e) => handleChange(e, column, column.type)}
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
