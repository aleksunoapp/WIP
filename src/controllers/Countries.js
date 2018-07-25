import GlobalFunctions from '@/global.js'
/**
 * Call to pitapit API to get all available languages.
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
 * Call to pitapit API to get all available languages.
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const createCountry = ({
	name = ''
}) => {
	if (!name) {
		return Error('Please provide a name')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: '/app/country/create',
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
 * Call to pitapit API to get all available languages.
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const updateCountry = ({
	name = '',
	id = null
}) => {
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
			data: {name},
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
 * Call to pitapit API to get all available languages.
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const deleteCountry = ({
	id = null
}) => {
	if (!id && id !== 0) {
		return Error('Country ID is missing.')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/country/${id}/delete`,
			data: {name},
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

export default ({
	listCountries,
	createCountry
})

