import GlobalFunctions from '@/global.js'
/**
 * Call to API to get all available platforms.
 * @function
 * @returns {object} A promise with response shaped
 * [
 *   {
 *       "id": 1,
 *       "name": "France"
 *   }
 * ]
 */
export const listPlatforms = () => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: '/app/platform',
			data: {},
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to create a platform
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const createPlatform = ({ name = '', code = '' }) => {
	if (!name) {
		return Error('Please provide a name')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: '/app/platform/create',
			data: {
				name,
				code
			},
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to update a platform
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const updatePlatform = ({ name = '', code = '', id = null }) => {
	if (!name) {
		return Error('Please provide a name')
	}
	if (!id && id !== 0) {
		return Error('Platform ID is missing.')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/platform/${id}/update`,
			data: {
				name,
				code
			},
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to delete a platform
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const deletePlatform = ({ id = null }) => {
	return new Promise(function (resolve, reject) {
		if (id !== 0 && !id) {
			reject('Platform ID is missing.')
			return
		}

		GlobalFunctions.$ajax({
			method: 'DELETE',
			dataType: 'json',
			url: `/app/platform/${id}/delete`,
			data: {},
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

export default {
	listPlatforms,
	createPlatform,
	updatePlatform,
	deletePlatform
}
