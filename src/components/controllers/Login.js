/**
 * @module Login
 */
// import GlobalFunctions from '../global'
import Env from '../../environment.js'
import axios from 'axios'

export default {
	/**
	 * Call to unoapp API to log the application admin in.
	 * @function
	 * @param {string} email - The users email.
	 * @param {string} password - The users password.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	login: function (email, password) {
    return axios({
      method: 'POST',
      url: `${Env.url}/api/auth/login`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'email': email,
        'password': password
      }
    })
	},
  /**
	 * Call to unoapp API to log the application admin out.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	logout: function () {
    return axios({
      method: 'POST',
      url: `${Env.url}/api/auth/logout`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
	},
	/**
	 * Call to unoapp API to send password reset to user after password is forgotten.
	 * @function
	 * @param {string} email - The users email.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	forgot: function (email) {
    console.log(email)
    return axios({
      method: 'POST',
      url: `${Env.url}/api/forgot_password`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'email': email
      }
    })
		// return new Promise(function (resolve, reject) {
		// 	GlobalFunctions.$ajax({
		// 		method: 'POST',
		// 		dataType: 'json',
		// 		url: '/application/admin/forgotPassword',
		// 		data: { email: email },
		// 		success: function (response) {
		// 			resolve(response)
		// 		},
		// 		error: function (error) {
		// 			reject(error)
		// 		}
		// 	})
		// })
	},
	/**
	 * Call to unoapp API to reset/change password after password is forgotten.
	 * @function
	 * @param {string} password - The users new password.
	 * @param {string} passwordConfirmation - The users password confirm.
	 * @param {string} token - The temporary password token.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	reset: function (password, passwordConfirmation, token) {
		return axios({
      method: 'POST',
      url: `${Env.url}/api/user_new_password`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'token': token,
				'new_password': password,
				'new_password_confirmation': passwordConfirmation
      }
		})
	}
}
