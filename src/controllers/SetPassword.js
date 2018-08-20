/**
 * @module SetPassword
 */
import zxcvbn from 'zxcvbn'
import GlobalFunctions from '../global'

module.exports = {
	/**
	 * Call to zxcvbn API to check password strength.
	 * @function
	 * @param {string} password - The password to be tested.
	 * @returns {string} The password strength.
	 */
	passwordStrengthCheck: function (password) {
		// We will assume that any password longer than 50 characters is strong enough
		var result = zxcvbn(password.substring(0, 50), ['unoapp', 'street'])

		var crackTime =
			result.crack_times_seconds.offline_slow_hashing_1e4_per_second

		if (password.length < 8) {
			return 'Password must be 8 characters minimum'
		}

		if (crackTime < 60 * 60 * 24) {
			return 'Very Weak'
		} else if (crackTime < 60 * 60 * 24 * 365) {
			return 'Weak'
		} else if (crackTime < 60 * 60 * 24 * 365 * 100) {
			return 'OK'
		} else {
			return 'Strong'
		}
	},
	/**
	 * Call to unoapp API to set a users password.
	 * @function
	 * @param {string} invitationToken - The invitation token to specify that it is not an
	 *									 expired request and the user who has requested it.
	 * @param {string} password - The password to be set.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	setPassword: function (invitationToken, password) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/auth/set_password',
				data: { token: invitationToken, password: password },
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
	 * Call to unoapp API to check if an invitation token is expired.
	 * @function
	 * @param {string} invitationToken - The invitation token to be tested.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	checkInvitationTokenExpiry: function (invitationToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/auth/validate_request',
				data: { token: invitationToken },
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
