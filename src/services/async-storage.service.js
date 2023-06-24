export const storageService = {
	query,
	get,
	post,
	put,
	remove,
}

function query(entityType, delay = 1) {
	var entities = JSON.parse(localStorage.getItem(entityType)) || _createDemoData(entityType)
	return new Promise((resolve) => setTimeout(() => resolve(entities), delay))
}

function get(entityType, entityId) {
	return query(entityType).then((entities) => {
		const entity = entities.find((entity) => entity._id === entityId)
		if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
		return entity
	})
}

function post(entityType, newEntity) {
	newEntity = JSON.parse(JSON.stringify(newEntity))
	newEntity._id = _makeId()
	return query(entityType).then((entities) => {
		entities.push(newEntity)
		_save(entityType, entities)
		return newEntity
	})
}

function put(entityType, updatedEntity) {
	updatedEntity = JSON.parse(JSON.stringify(updatedEntity))
	return query(entityType).then((entities) => {
		const idx = entities.findIndex((entity) => entity._id === updatedEntity._id)
		if (idx < 0)
			throw new Error(
				`Update failed, cannot find entity with id: ${updatedEntity._id} in: ${entityType}`
			)
		entities.splice(idx, 1, updatedEntity)
		_save(entityType, entities)
		return updatedEntity
	})
}

function remove(entityType, entityId) {
	return query(entityType).then((entities) => {
		const idx = entities.findIndex((entity) => entity._id === entityId)
		if (idx < 0)
			throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
		entities.splice(idx, 1)
		_save(entityType, entities)
	})
}

// Private functions

function _save(entityType, entities) {
	localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return txt
}

function _createColumn(id, ordinalNo, title, type, width) {
	return {
		id,
		ordinalNo,
		title,
		type,
		width,
	}
}

function _createRowData(
	id,
	name,
	age,
	email,
	telephone,
	isFinished,
	activeTasks,
	address,
	company,
	position,
	experience,
	project
) {
	return {
		id,
		name,
		age,
		email,
		telephone,
		isFinished,
		activeTasks,
		address,
		company,
		position,
		experience,
		project,
	}
}

function _createDemoBoard() {
	const columns = [
		_createColumn('name', 1, 'Name', 'string', 200),
		_createColumn('age', 2, 'Age', 'number', 150),
		_createColumn('email', 3, 'Email', 'string', 200),
		_createColumn('telephone', 4, 'Telephone', 'string', 150),
		_createColumn('isFinished', 5, 'Is Finished', 'boolean', 150),
		_createColumn('activeTasks', 6, 'Active Tasks', 'number', 150),
		_createColumn('address', 7, 'Address', 'string', 250),
		_createColumn('company', 8, 'Company', 'string', 200),
		_createColumn('position', 9, 'Position', 'string', 150),
		_createColumn('experience', 10, 'Experience', 'number', 150),
		_createColumn('project', 11, 'Project', 'string', 200),
	]

	const data = []

	for (let i = 0; i < 50; i++) {
		let name = `Person ${i}`
		let age = Math.floor(Math.random() * 60) + 20
		let email = `person${i}@example.com`
		let telephone = `05${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10000000)}`
		let isFinished = Math.random() > 0.5
		let activeTasks = Math.floor(Math.random() * 10)
		let address = `Street ${i}, City ${i}`
		let company = `Company ${i}`
		let position = `Position ${i}`
		let experience = Math.floor(Math.random() * 20)
		let project = `Project ${i}`

		data.push(
			_createRowData(
				_makeId(),
				name,
				age,
				email,
				telephone,
				isFinished,
				activeTasks,
				address,
				company,
				position,
				experience,
				project
			)
		)
	}

	return {
		columns,
		data,
	}
}

function _createDemoData(entityType) {
	const DEMO_DATA = [_createDemoBoard()]
	const entities = JSON.parse(JSON.stringify(DEMO_DATA))
	_save(entityType, entities)
	return entities
}
