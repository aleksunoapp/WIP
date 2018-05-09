/**
 * @module Loyalty
 */

import $ from 'jquery'
import GlobalFunctions from '../global'

/**
 * Ajax wrapper for making backend calls.
 * @function
 * @param {object} options - Options for the ajax call being made.
 * @param {boolean} noRetry - Used to prevent retrying the call.
 * @returns {undefined}
 */
let $ajax = function (options, noRetry) {
	options.url = GlobalFunctions.loyaltyUrl + options.url
	if (options.method.toLowerCase() === 'post') {
		options.contentType = 'application/json'
		options.data = JSON.stringify(options.data)
	}

	$.ajax(options)
}

export default ({
	/**
	 * Call to API to create a rule.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {object} rule - An object containing the rule to create.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createRule: function (appId, appSecret, rule) {
		return new Promise(function (resolve, reject) {
			$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/api/rules/create',
				data: rule,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
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
	 * Call to API to update a rule.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {object} rule - An object containing the rule to update.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateRule: function (appId, appSecret, rule) {
		return new Promise(function (resolve, reject) {
			$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/api/rules/' + rule.id + '/update',
				data: rule,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
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
	 * Call to API to get a list of rules.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getRules: function (appId, appSecret) {
		return new Promise(function (resolve, reject) {
			$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/api/rules',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
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
	 * Call to API to delete a rule.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {integer} ruleId - The id of the rule to delete.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteRule: function (appId, appSecret, ruleId) {
		return new Promise(function (resolve, reject) {
			$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/api/rules/' + ruleId + '/delete',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
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
	 * Call to API to create a promotion rule.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {object} rule - An object containing the rule to create.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createPromotionRule: function (appId, appSecret, rule) {
		return new Promise(function (resolve, reject) {
			$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/api/promotion/create',
				data: rule,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
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
	 * Call to API to update a promotion rule.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {object} rule - An object containing the rule to update.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updatePromotionRule: function (appId, appSecret, rule) {
		return new Promise(function (resolve, reject) {
			$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/api/promotion/' + rule.id + '/update',
				data: rule,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
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
	 * Call to API to get a list of promotion rules.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getPromotionRules: function (appId, appSecret) {
		return new Promise(function (resolve, reject) {
			$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/api/promotion',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
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
	 * Call to API to delete a rule.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {integer} ruleId - The id of the rule to delete.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deletePromotionRule: function (appId, appSecret, ruleId) {
		return new Promise(function (resolve, reject) {
			$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/api/promotion/' + ruleId + '/delete',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
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
