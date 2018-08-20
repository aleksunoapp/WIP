/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to get all available languages.
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
			url: '/app/locale/all',
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
 * Call to API to create a language
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const createLanguage = ({
	name = '',
	language_code = '',
	country_id = null,
	isDefault = 0,
	status = 0
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
				name,
				language_code,
				country_id,
				default: isDefault,
				status
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
 * Call to API to update a language
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const updateLanguage = ({
	name = '',
	id = null,
	language_code = '',
	country_id = null,
	isDefault = 0,
	status = 0
}) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/locale/${id}/update`,
			data: {
				name,
				language_code,
				country_id,
				default: isDefault,
				status
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

export default {
	listLanguages,
	createLanguage,
	updateLanguage
}
