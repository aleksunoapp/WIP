/* eslint-disable */

/**
 * @module Login
 */
import GlobalFunctions from '../global'


export default {
	/**
	 * Call to unoapp API to log the application admin in.
	 * @function
	 * @param {string} token - The authentication token.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	login: function (token) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/admin/login',
				data: { token },
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
