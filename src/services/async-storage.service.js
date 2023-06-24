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

function _createRowData(id, name, age, email, telephone, isFinished, activeTasks) {
	return {
		id,
		name,
		age,
		email,
		telephone,
		isFinished,
		activeTasks,
	}
}

function _createDemoBoard() {
	const columns = [
		_createColumn('name', 1, 'Name', 'string', 150),
		_createColumn('age', 2, 'Age', 'number', 100),
		_createColumn('email', 3, 'Email', 'string', 200),
		_createColumn('telephone', 4, 'Telephone', 'string', 100),
		_createColumn('isFinished', 5, 'Is Finished', 'boolean', 100),
		_createColumn('activeTasks', 6, 'Active Tasks', 'number', 100),
	]

	const data = [
		_createRowData('101uid', 'John Doe', 32, 'john@example.com', '054-1234567', true, 3),
		_createRowData('102uid', 'Jane Doe', 28, 'jane@example.com', '052-1245567', false, 5),
		_createRowData('103uid', 'David Smith', 45, 'david@example.com', '058-1234567', true, 2),
		_createRowData('104uid', 'Emily Johnson', 39, 'emily@example.com', '054-1254567', false, 4),
	]

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
