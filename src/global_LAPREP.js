/**
 * @module Global
 */
import $ from 'jquery'
import environment from './environment'
import store from './store'
const { production, staging, development } = environment

export default {
	urls: {
		approvals: (function () {
			if (production) {
				return 'https://approval.api.unoapp.io'
			} else if (staging) {
				return 'https://approval.beta.api.unoapp.io'
			} else if (development) {
				return 'https://approval.dev.api.unoapp.io'
			}
		})(),
		loyalty: (function () {
			if (production) {
				return 'https://loyalty.api.unoapp.io'
			} else if (staging) {
				return 'https://loyalty.beta.api.unoapp.io'
			} else if (development) {
				return 'https://loyalty.dev.api.unoapp.io'
			}
		})(),
		ecomm: (function () {
			if (production) {
				return 'https://laprep.api.unoapp.io/api'
			} else if (staging) {
				return 'https://laprep.beta.api.unoapp.io/api'
			} else if (development) {
				return 'http://laprep.dev.api.unoapp.io/api'
			}
		})(),
		resources: (function () {
			if (production) {
				return 'https://resources.api.unoapp.io'
			} else if (staging) {
				return 'https://resources.beta.api.unoapp.io'
			} else if (development) {
				return 'https://resources.dev.api.unoapp.io'
			}
		})()
	},
	headers: function () {
		return {
			approvals: (function () {
				if (production) {
					return {
						appId: '',
						appSecret: ''
					}
				} else if (staging) {
					return {
						appId: 'j1avUDF87aJlFugUSOjirtg04vhjjuss',
						appSecret: '3hWskZHgXOFGmhrw9zAFGAziEj9fsjt1'
					}
				} else if (development) {
					return {
						appId: 'qzQk0zVIL4QnDmFCVxhbR3jJIMoDLAJW2',
						appSecret: 'TBmquk3EjjbRc6iw2cgLb2aWAyY1OjWxZ'
					}
				}
			})(),
			loyalty: (function () {
				if (production) {
					return {
						appId: '',
						appSecret: ''
					}
				} else if (staging) {
					return {
						appId: 'BKCM4XSi9ym8C9SDfJb5HJMlveGq1vrf',
						appSecret: 'EPhJNl1KHKIxwtgf6fzkMIqYYfs4r4mT'
					}
				} else if (development) {
					return {
						appId: 'wOoxggzMMrXxyzmXQCSnESBCTiOwZYCW',
						appSecret: 'Jo19PDgsBMQCwyJVxdevoJ5jJ4nCMNPN'
					}
				}
			})(),
			resources: (function () {
				return {
					appId: store.getters.appId,
					appSecret: store.getters.appSecret
				}
			})(),
			ecomm: (function () {
				return {
					appId: store.getters.appId,
					appSecret: store.getters.appSecret
				}
			})()
		}
	},
	/**
	 * app_id for the Approvals API
	 */
	approvalsAppId: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return '5bd87057e39d933feee0751b'
		} else if (development) {
			return '5b7301ecdb4a13057f091aba'
		}
	})(),
	/**
	 * business ID to use for the Resources API
	 */
	resourcesBusinessId: (function () {
		if (production) {
			return
		} else if (staging) {
			return 4
		} else if (development) {
			return 3
		}
	})(),
	/**
	 * base url for API calls to send Messages
	 */
	messageBaseUrl: (function () {
		if (production) {
			return 'https://notifications.api.unoapp.io'
		} else if (staging) {
			return 'https://notifications.beta.api.unoapp.io'
		} else if (development) {
			return 'https://notifications.dev.api.unoapp.io'
		}
	})(),
	/**
	 * app token for API calls to send Messages
	 */
	messageAppToken: (function () {
		if (production) {
			return 'bearer '
		} else if (staging) {
			return 'bearer 82d320a2a0a82917995ddca06860d0d5'
		} else if (development) {
			return 'bearer 41738cd6f3aef91e9133dc757825392c'
		}
	})(),
	/**
	 * Individual User Message actions and ID's
	 */
	messageAction: (function () {
		if (production) {
			return [
				{
					id: 51,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 55,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 52,
					type: 'GOTO_LINK',
					value: 'Website'
				},
				{
					id: 54,
					type: 'RATE_US',
					value: 'Rate Us'
				}
			]
		} else if (staging) {
			return [
				{
					id: 31,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 35,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 32,
					type: 'GOTO_LINK',
					value: 'Website'
				},
				{
					id: 34,
					type: 'RATE_US',
					value: 'Rate Us'
				}
			]
		} else if (development) {
			return [
				{
					id: 41,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 45,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 42,
					type: 'GOTO_LINK',
					value: 'Website'
				},
				{
					id: 44,
					type: 'RATE_US',
					value: 'Rate Us'
				}
			]
		}
	})(),
	/**
	 * string to prepend to user's id as alias when messaging OMA users
	 */
	application_name: (function () {
		if (production) {
			return ''
		} else if (staging) {
			return 'laprep'
		} else if (development) {
			return 'laprep_dev'
		}
	})(),
	/**
	 * app token for API calls to send Messages to OMA users
	 */
	OMAUsersMessageAppToken: (function () {
		if (production) {
			return 'bearer cac7cc0ab25cff18fcc86b2f139d4f7e'
		} else if (staging) {
			return 'bearer 39d270dc380d5ac331f0affc7a4ddb59'
		} else if (development) {
			return 'bearer 6b1642515315f527604919b430fe79de'
		}
	})(),
	/**
	 * OMA Message actions and ID's
	 */
	OMAMessageAction: (function () {
		if (production) {
			return [
				{
					id: 11,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 15,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 12,
					type: 'GOTO_LINK',
					value: 'Website'
				}
			]
		} else if (staging) {
			return [
				{
					id: 11,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 15,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 12,
					type: 'GOTO_LINK',
					value: 'Website'
				}
			]
		} else if (development) {
			return [
				{
					id: 21,
					type: 'CLOSE',
					value: 'Close'
				},
				{
					id: 25,
					type: 'CALL',
					value: 'Call'
				},
				{
					id: 22,
					type: 'GOTO_LINK',
					value: 'Website'
				}
			]
		}
	})(),
	/**
	 * API key for Google Maps Javascript API
	 */
	googleMapsJavascriptApiKey: 'AIzaSyBJs2f0TNNui_OcRHgVRTIsJAvGQ0EB7oA',
	/**
	 * Ajax wrapper for making backend calls.
	 * @function
	 * @param {object} options - Options for the ajax call being made.
	 * @param {string} api - The api to call
	 * @returns {undefined}
	 */
	$ajax: function (options, api = 'ecomm') {
		let headers = this.headers()
		options.url = this.urls[api] + options.url

		options.beforeSend = function (xhr) {
			if (api === 'approvals') {
				xhr.setRequestHeader('approvals-app-id', headers[api].appId)
				xhr.setRequestHeader('approvals-app-secret', headers[api].appSecret)
			}
			xhr.setRequestHeader('app-id', headers[api].appId)
			xhr.setRequestHeader('app-secret', headers[api].appSecret)
			xhr.setRequestHeader('auth-token', store.getters.userToken)
		}

		if (
			options.processData !== false &&
			(
				options.method.toLowerCase() === 'post' ||
				options.method.toLowerCase() === 'put'
			)
		) {
			options.contentType = 'application/json'
			options.data = JSON.stringify(options.data)
		}

		$.ajax(options)
	},
	/**
	 * Global function for disabling buttons when a request is made.
	 * To use: Set up a variable `my_variable` that calls this function
	 *		   When the backend call is a success call my_variable.complete()
	 *		   When the backend call is an error call my_variable.cancel()
	 * @function
	 * @param {object} event - The click event that triggered this function.
	 * @returns {object} An object of functions for manipulating the selected button
	 */
	disableButton: function (event) {
		var button
		if (event.type === 'submit') {
			button = $(event.target).find('button[type=submit]')
		} else {
			button = $(event.target)
		}

		var originalText

		// For bypassing the DOM when unit testing
		if (!button[0]) {
			originalText = 'This is for save testing.'
		} else {
			originalText = button[0].textContent
		}
		var originalColor = button.css('background-color')
		var whileDisabled, complete

		button.addClass('background-animate')

		if (originalText.toLowerCase().indexOf('save') !== -1) {
			whileDisabled = 'saving'
			complete = 'complete'
		}

		if (whileDisabled) {
			button.text(whileDisabled)
		}

		button.prop('disabled', true)
		return {
			complete: function () {
				setTimeout(function () {
					if (complete) {
						button.text(complete)
						button.css({ 'background-color': '#5cb85c' })
					}
					button.prop('disabled', false)

					setTimeout(function () {
						button.css({ 'background-color': originalColor })
						button.text(originalText)
					}, 1000)
				}, 100)
			},
			cancel: function () {
				setTimeout(function () {
					button.text(originalText)
					button.prop('disabled', false)
				}, 100)
			}
		}
	}
}
