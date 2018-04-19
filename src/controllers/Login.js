/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to unoapp API to log the application admin in.
	 * @function
	 * @param {string} data - The login data
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	login: function (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/admin/login',
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
})
