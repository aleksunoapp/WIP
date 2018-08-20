import GlobalFunctions from '@/global.js'
/**
 * Call to API to get all available countries.
 * @function
 * @returns {object} A promise with response shaped
 * [
 *   {
 *       "id": 1,
 *       "name": "France"
 *   }
 * ]
 */
export const listCountries = () => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: '/app/country',
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
 * Call to API to create a country
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const createCountry = ({ name = '', code = '' }) => {
	if (!name) {
		return Error('Please provide a name')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: '/app/country/create',
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
 * Call to API to update a country
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const updateCountry = ({ name = '', code = '', id = null }) => {
	if (!name) {
		return Error('Please provide a name')
	}
	if (!id && id !== 0) {
		return Error('Country ID is missing.')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/country/${id}/update`,
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
 * Call to API to delete a country
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const deleteCountry = ({ id = null }) => {
	return new Promise(function (resolve, reject) {
		if (id !== 0 && !id) {
			reject('Country ID is missing.')
			return
		}

		GlobalFunctions.$ajax({
			method: 'DELETE',
			dataType: 'json',
			url: `/app/country/${id}/delete`,
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
	listCountries,
	createCountry,
	updateCountry,
	deleteCountry
}
