/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to unoapp API to log the application admin in.
	 * @function
	 * @param {string} email - The users email.
	 * @param {string} password - The users password.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	login: function (email, password) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/admin/login',
				data: {user_name: email, password: password},
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
	 * Call to unoapp API to send password reset to user after password is forgotten.
	 * @function
	 * @param {string} email - The users email.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	forgot: function (email) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/admin/forgotPassword',
				data: {email: email},
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
	 * Call to unoapp API to reset/change password after password is forgotten.
	 * @function
	 * @param {string} token - The temporary password token.
	 * @param {string} email - The users email.
	 * @param {string} password - The users new password.
	 * @param {string} passwordConfirmation - The users password confirm.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	reset: function (token, email, password, passwordConfirmation) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/admin/resetPassword',
				data: {
					token: token,
					email: email,
					password: password,
					password_confirmation: passwordConfirmation
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
	 * Call to unoapp API to reset/change password after password is forgotten.
	 * @function
	 * @param {string} currentPassword - The current password.
	 * @param {string} newPassword - The new password.
	 * @param {string} newPasswordConfirmation - The new password confirmation.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	change: function (currentPassword, newPassword, newPasswordConfirmation) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/admin/changePassword',
				data: {
					current_password: currentPassword,
					password: newPassword,
					password_confirmation: newPasswordConfirmation
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
