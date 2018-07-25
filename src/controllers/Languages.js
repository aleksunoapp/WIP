/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to pitapit API to get all available languages.
 * @function
 * @returns {object} A promise with response shaped
 *	[
 *		{
 *			"id": 1,
 *			"language_code": "fr",
 *			"default": 0,
 *			"country_id": 0,
 *			"country": ""
 *		}
 *	]
 */
export const listLanguages = () => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: '/app/locale',
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
export const createLanguage = ({
	language_code = '',
	country_id = null,
	isDefault = 0
}) => {
	return new Promise(function (resolve, reject) {
		if (!language_code) {
			reject('Please provide a name')
		}
		if (country_id !== 0 && !country_id) {
			reject('Please provide a country ID')
		}
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: '/app/locale/create',
			data: {
				language_code,
				country_id,
				default: isDefault
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
 * Call to pitapit API to get all available languages.
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const updateLanguage = ({
	id = null,
	language_code = '',
	country_id = null,
	isDefault = 0
}) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/locale/${id}/update`,
			data: {
				language_code,
				country_id,
				default: isDefault
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

export default ({
	listLanguages,
	createLanguage,
	updateLanguage
})
