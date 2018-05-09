/**
 * Resource functions are used for reaching the endpoints for resources.
 * @module Resources
 * @since 0.0.9
 */
import $ from 'jquery'
import GlobalFunctions from '../global'
import {App} from '../main.js'

export default {
	/**
	 * Call to unoapp API that gets folders within a parent folder.
	 * @function
	 * @param {integer} businessId - The id of the business where the folder is being pulled from.
	 * @param {integer} locationId - The id of the location where the folder is being pulled from.
	 * @param {integer} parentId - The id of the parent folder being pulled from.
	 * @param {integer} pageNumber - The `page` number being pulled in.
	 * @param {integer} recordsPerPage - The max number of records to pull in.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.8
	 */
	getFolders (businessId, locationId, parentId, pageNumber, recordsPerPage) {
		let httpParams = {parent_folder_id: parentId, sort_by: 'name', sort_order: 'asc', page_number: pageNumber, records_per_page: recordsPerPage}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = GlobalFunctions.v3BaseUrl + '/resources/search/location_folders'
		} else {
			httpParams.business_id = businessId
			url = GlobalFunctions.v3BaseUrl + '/resources/search/business_folders'
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'POST',
				dataType: 'json',
				url,
				data: JSON.stringify(httpParams),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				},
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that gets the details of a folder.
	 * @function
	 * @param {integer} businessId - The id of the business where the folder is being pulled from.
	 * @param {integer} locationId - The id of the location where the folder is being pulled from.
	 * @param {integer} folderId - The id of the folder we are pulling details for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.8
	 */
	getFolder (businessId, locationId, folderId) {
		let httpParams = {folder_id: folderId}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = '/resources/location_folders'
		} else {
			httpParams.business_id = businessId
			url = '/resources/business_folders'
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'POST',
				dataType: 'json',
				url,
				data: JSON.stringify(httpParams),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				},
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that creates a new folder.
	 * @function
	 * @param {integer} businessId - The id of the business where the folder is being created.
	 * @param {integer} locationId - The id of the location where the folder is being pulled from.
	 * @param {object} folder - The folder to be created.
	 * @param {integer} parentFolderId - The folder id of the new folders parent.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.8
	 */
	createFolder (businessId, locationId, folder, parentFolderId) {
		let httpParams = {name: folder.name, parent_id: parentFolderId}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = '/resources/location_folders'
		} else {
			httpParams.business_id = businessId
			httpParams.is_shared = GlobalFunctions.convertBooleanToInt(folder.is_shared)
			url = '/resources/business_folders'
		}
		return new Promise((resolve, reject) => {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url,
				data: httpParams,
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that updates an existing folder.
	 * @function
	 * @param {integer} businessId - The id of the business where the folder is being created.
	 * @param {integer} locationId - The id of the location where the folder is being pulled from.
	 * @param {integer} folderId - The id of the folder being modified.
	 * @param {string} folderName - The name of the folder being modified.
	 * @param {string} folderPrivacy - Whether of not the folder is public or private.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.8
	 */
	updateFolder (businessId, locationId, folderId, folderName, folderPrivacy) {
		let httpParams = {folder_id: folderId, name: folderName}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = '/resources/location_folders'
		} else {
			httpParams.business_id = businessId
			httpParams.is_shared = GlobalFunctions.convertBooleanToInt(folderPrivacy)
			url = '/resources/business_folders'
		}

		return new Promise((resolve, reject) => {
			GlobalFunctions.$ajax({
				method: 'PATCH',
				dataType: 'json',
				url,
				data: httpParams,
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that returns an array of resources for the specified page and search criteria.
	 * @function
	 * @param {integer} businessId - The id of the business where the resources are being fetched.
	 * @param {integer} locationId - The id of the location where the folder is being pulled from.
	 * @param {integer} folderId - The id of the folder where the resouces are being fetched.
	 * @param {integer} pageNumber - The current page that we are retrieving results for.
	 * @param {integer} recordsPerPage - The number of records to return per page.
	 * @param {object} searchCriteria - Object with all criteria to be searched by.
	 * @param {object} sortCriteria - The field and order to be sorted by.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.9
	 */
	getResources (businessId, locationId, folderId, pageNumber, recordsPerPage, searchCriteria, sortCriteria) {
		let httpParams = {page_number: pageNumber, records_per_page: recordsPerPage}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = GlobalFunctions.v3BaseUrl + '/resources/search/location_files'
		} else {
			httpParams.business_id = businessId
			url = GlobalFunctions.v3BaseUrl + '/resources/search/business_files'
		}

		if (folderId) {
			httpParams.folder_id = folderId
		}

		if (sortCriteria) {
			for (let sortKey in sortCriteria) {
				httpParams[sortKey] = sortCriteria[sortKey]
			}
		}

		if (searchCriteria) {
			for (let searchKey in searchCriteria) {
				httpParams[searchKey] = searchCriteria[searchKey]
			}
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'POST',
				dataType: 'json',
				url,
				data: JSON.stringify(httpParams),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				},
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that gets the details of a resource.
	 * @function
	 * @param {integer} businessId - The id of the business where the resource is being pulled from.
	 * @param {integer} locationId - The id of the location where the resource is being pulled from.
	 * @param {integer} resourceId - The id of the resource we are pulling details for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.9
	 */
	getResource (businessId, locationId, resourceId) {
		let httpParams = {file_id: resourceId}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = '/resources/location_file'
		} else {
			httpParams.business_id = businessId
			url = '/resources/business_file'
		}

		return new Promise((resolve, reject) => {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url,
				data: JSON.stringify(httpParams),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				},
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that updates an existing resource.
	 * @function
	 * @param {integer} businessId - The id of the business where the resource is being updated.
	 * @param {integer} locationId - The id of the location where the resource is being updated.
	 * @param {integer} resourceId - The id of the resource to be updated.
	 * @param {integer} resourceName - The updated name of the resource.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.8
	 */
	updateResource (businessId, locationId, resourceId, resourceName) {
		let httpParams = {file_id: resourceId, name: resourceName}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = '/resources/location_file'
		} else {
			httpParams.business_id = businessId
			url = '/resources/business_file'
		}

		return new Promise((resolve, reject) => {
			GlobalFunctions.$ajax({
				method: 'PATCH',
				dataType: 'json',
				url,
				data: httpParams,
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that updates an existing resources tags.
	 * @function
	 * @param {integer} businessId - The id of the business where the resource is being updated.
	 * @param {integer} locationId - The id of the location where the resource is being updated.
	 * @param {integer} resourceId - The id of the resource to be updated.
	 * @param {array} tags - The list of tags attached to the resource.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.8
	 */
	updateResourceTags (businessId, locationId, resourceId, tags) {
		let httpParams = {file_id: resourceId, tags}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = '/resources/location_files/update_tags'
		} else {
			httpParams.business_id = businessId
			url = '/resources/business_files/update_tags'
		}

		return new Promise((resolve, reject) => {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url,
				data: httpParams,
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that uploads a file to a business resource folder.
	 * @function
	 * @param {integer} businessId - The id of the business where the file is being uploaded.
	 * @param {integer} locationId - The id of the location where the file is being uploaded.
	 * @param {integer} folderId - The id of the folder where the file is being uploaded.
	 * @param {integer} file - The file to be uploaded
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.9
	 */
	upload (businessId, locationId, folderId, file) {
		let url
		if (locationId) {
			url = GlobalFunctions.v3BaseUrl + '/resources/location_file/' + locationId + '/' + folderId
		} else {
			url = GlobalFunctions.v3BaseUrl + '/resources/business_file/' + businessId + '/' + folderId
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'POST',
				dataType: 'json',
				url,
				data: file,
				contentType: false,
				processData: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('token', App.accountToken)
				},
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	},
	/**
	 * Call to unoapp API that gets all tags belonging to a business or location.
	 * @function
	 * @param {integer} businessId - The id of the business where the tags are being pulled from.
	 * @param {integer} locationId - The id of the location where the tags are being pulled from.
	 * @param {integer} pageNumber - The `page` number being pulled in.
	 * @param {integer} recordsPerPage - The max number of records to pull in.
	 * @returns {object} A promise that will return either a success object or an error object.
	 * @version 0.0.8
	 */
	getTags (businessId, locationId, pageNumber, recordsPerPage) {
		let httpParams = {sort_by: 'name', sort_order: 'asc', page_number: pageNumber, records_per_page: recordsPerPage}
		let url

		if (locationId) {
			httpParams.location_id = locationId
			url = GlobalFunctions.v3BaseUrl + '/resources/location_tags'
		} else {
			httpParams.business_id = businessId
			url = GlobalFunctions.v3BaseUrl + '/resources/business_tags'
		}

		return new Promise((resolve, reject) => {
			$.ajax({
				method: 'POST',
				dataType: 'json',
				url,
				data: JSON.stringify(httpParams),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				},
				success (response) {
					resolve(response)
				},
				error (e) {
					let _this = this
					let _wrapper = GlobalFunctions.refreshWrapper((e, status) => {
						if (status === 'error') {
							reject(e)
						} else {
							GlobalFunctions.$ajax(_this)
						}
					})
					_wrapper(e)
				}
			})
		})
	}
}
