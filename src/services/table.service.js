import { storageService } from './async-storage.service.js'
// import { httpService } from './http.service'
const TABLE_ENDPOINT = 'table'

export const tableService = {
	query,
	getById,
	post,
	put,
	remove,
}

async function query() {
	return storageService.query(TABLE_ENDPOINT)
	// return httpService.get(TABLE_ENDPOINT)
}

async function getById(id) {
	return storageService.get(TABLE_ENDPOINT, id)
	// return httpService.get(`${TABLE_ENDPOINT}/${id}`)
}

async function post(item) {
	return storageService.post(TABLE_ENDPOINT, item)
	// return httpService.post(TABLE_ENDPOINT, item)
}

async function put(item) {
	return storageService.put(TABLE_ENDPOINT, item)
	// return httpService.put(`${TABLE_ENDPOINT}/${item.id}`, item)
}

async function remove(id) {
	return storageService.remove(TABLE_ENDPOINT, id)
	// return httpService.delete(`${TABLE_ENDPOINT}/${id}`)
}
