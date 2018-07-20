/*

questions / issues
the current localization remains as is, under Admin.
new localization goes under Static or Website.

- will Static and Admin share the new COUNTRY - LANGUAGE, or will they continue to use the old Locale

COUNTRY has many LANGUAGE, country is a container for LANGUAGE
TERM can be dynamically created
TRANSLATION is an instance of a TERM and LANGUAGE with a string value. create and update TRANSLATION is one endpoint (sql update if exists).

FLOWS:
- create country
- assign languages to country

- create language
- assign language to country

- create term

- select country
- select language
- select term
- create a translation

COUNTRIES

    listCountries
		GET {{url}}/api/app/country
		[
			{
				"id": 1,
				"name": "France"
			}
		]

    createCountry
		{
			"name": "France"
		}
		POST {{url}}/api/app/country/create

    updateCountry
		{
			"name": "France"
		}
		POST {{url}}/api/app/country/ + country.id + /update

    deleteCountry
	    DELETE {{url}}/api/app/country/ + country.id + /delete

LANGUAGES

	listLanguages
		GET {{url}}/api/app/locale
		[
			{
				"id": 1,
				"language_code": "fr",
				"default": 0,
				"country_id": 0,
				"country": ""
			}
		]

	createLanguage
		{
			"language_code": "fr",
			"country_id": 1,
			"default": 0
		}
		POST {{url}}/api/app/locale/create

    updateLanguage
		{
			"language_code": "fr",
			"country_id": 1,
			"default": 0 // updating to 1 gets 500 Whoops
		}
		POST {{url}}/api/app/locale/ + language.id + /update

TERMS

	listAllTerms
		GET {{url}}/api/app/term_translation/3/getTermForAllLocale
		[
			{
				"en": {
					"register with email": "register with email"
				}
			},
			{
				"fr": {
					"register with email": "register with email"
				}
			}
		]

TRANSLATIONS

*/

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
