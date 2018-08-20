/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default {
	/**
	 * Call to pitapit API to get a list of users.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The user token of the current user.
	 * @param {object} paginationPreferences - The object containing pagination info.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getUsers: function (appId, appSecret, userToken, paginationPreferences) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/userManagement/users',
				data: paginationPreferences,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to get the order history for a user.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The user token of the current user.
	 * @param {string} userId - The ID of the user whose order history is being requested.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getUserOrders: function (appId, appSecret, userToken, userId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/userManagement/' + userId + '/orders',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to get the details of an order
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The user token of the current user.
	 * @param {integer} orderId - The ID of the order to look up
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getOrderDetails: function (appId, appSecret, userToken, orderId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/userManagement/' + orderId + '/orderDetail',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to get the profile details for a single user.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The user token of the current user.
	 * @param {string} userId - The ID of the user whose details are being requested.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getUserDetails: function (appId, appSecret, userToken, userId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/userManagement/' + userId + '/detail',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to get the social feed for a single user.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The user token of the current user.
	 * @param {string} userId - The ID of the user whose social feed being requested.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getUserSocialFeed: function (appId, appSecret, userToken, userId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/userManagement/' + userId + '/socialMedia',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to get the social feed for a single user.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The user token of the current user.
	 * @param {object} searchTerms - The terms to search against.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	searchUsers: function (appId, appSecret, userToken, searchTerms) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/userManagement/search',
				data: searchTerms,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to refund an order.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The user token of the current user.
	 * @param {string} orderId - The ID of the order to refund.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	refundOrder: function (appId, appSecret, userToken, orderId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/order/' + orderId + '/refund',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to API to add points.
	 * @function
	 * @param {string} data - An object containing an array of user IDs and the number of points to add.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	addPoints: function (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/admin/addPoints',
				data,
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	}
}
