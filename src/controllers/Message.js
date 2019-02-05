/**
 * @module Message
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
  options.url = GlobalFunctions.messageBaseUrl + options.url
  if (options.method.toLowerCase() === 'post') {
    options.contentType = 'application/json'
    options.data = JSON.stringify(options.data)
  }

  $.ajax(options)
}

export default {
  /**
	 * Call to message API to send a new message.
	 * @function
	 * @param {object} message - The message object.
	 * @param {string} appToken - The app token of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  sendMessage: function (message, appToken) {
    return new Promise(function (resolve, reject) {
      $ajax({
        method: 'POST',
        dataType: 'json',
        url: '/notification/sendNotification',
        data: message,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('app-token', appToken)
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
}
