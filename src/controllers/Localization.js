/**
 * @module Stores
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to pitapit API to get all available languages.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getLocales () {
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
	},
	/**
	 * Call to pitapit API to get all promotions.
	 * @function
	 * @param {object} locale - The object containing the locale to be created.
	 * @param {string} appId - The app ID for the current user.
	 * @param {string} appSecret - The app secret for the current user.
	 * @param {string} userToken - The user token for the current user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createLocale (locale, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/locale/create',
				data: locale,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get all promotions.
	 * @function
	 * @param {number} locale - The object containing the locale to be updated.
	 * @param {string} appId - The app ID for the current user.
	 * @param {string} appSecret - The app secret for the current user.
	 * @param {string} userToken - The user token for the current user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateLocale (locale, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/locale/' + locale.id + '/update',
				data: locale,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get all promotions.
	 * @function
	 * @param {object} term - The field to translate.
	 * @param {string} appId - The app ID for the current user.
	 * @param {string} appSecret - The app secret for the current user.
	 * @param {string} userToken - The user token for the current user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getTerm (term, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/translate',
				data: term,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get all promotions.
	 * @function
	 * @param {string} group - The group the translation belongs to.
	 * @param {object} terms - The field to translate.
	 * @param {string} appId - The app ID for the current user.
	 * @param {string} appSecret - The app secret for the current user.
	 * @param {string} userToken - The user token for the current user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	translateTerms (group, terms, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/translate/update/' + group,
				data: terms,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-secret', appSecret)
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
})
