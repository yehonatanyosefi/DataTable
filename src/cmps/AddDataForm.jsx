import { useState } from 'react'
import Modal from './util/Modal'

const EMPTY_DATA = {
	name: '',
	age: 0,
	email: '',
	telephone: '',
	isFinished: false,
	activeTasks: 0,
}

export default function AddDataForm({ isOpen, onRequestClose, onAddData }) {
	const [newData, setNewData] = useState(EMPTY_DATA)

	const handleChange = (event) => {
		setNewData({ ...newData, [event.target.name]: event.target.value })
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		onAddData(newData)
		setNewData(EMPTY_DATA)
	}

	return (
		<Modal isOpen={isOpen} onRequestClose={onRequestClose}>
			<h2>Add Data</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Name: <input name="name" type="text" value={newData.name} onChange={handleChange} required />
				</label>
				<label>
					Age: <input name="age" type="number" value={newData.age} onChange={handleChange} required />
				</label>
				<label>
					Email:{' '}
					<input name="email" type="email" value={newData.email} onChange={handleChange} required />
				</label>
				<button type="submit">Submit</button>
			</form>
		</Modal>
	)
}
