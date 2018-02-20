/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to pitapit API to get the news feed.
	 * @function
	 * @param {integer} pageNumber - The page number.
	 * @param {integer} pageResults - The number of results to be displayed per page.
	 * @param {string} sortOrder - The sort order.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getSocialFeed: function (pageNumber, pageResults, sortOrder, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/socialmedia',
				data: {offset: pageNumber, limit: pageResults, orderBy: sortOrder},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to get the news feed.
	 * @function
	 * @param {integer} feedId - The id of the selected feed.
	 * @param {integer} newStatus - The updated status.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateFeedStatus: function (feedId, newStatus, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/socialmedia/changestatus',
				data: {id: feedId, status: newStatus},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
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
