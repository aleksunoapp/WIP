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
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getNewsFeed: function (pageNumber, pageResults, sortOrder, userToken, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/application/news',
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
	 * Call to pitapit API to create news feed.
	 * @function
	 * @param {object} newsFeed - The news feed to be created.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createNewsFeed: function (newsFeed, userToken, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/news/create',
				data: {news: newsFeed},
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
	 * Call to pitapit API to update news feed.
	 * @function
	 * @param {object} newsFeed - The news feed object to be updated.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	saveEditedFeed: function (newsFeed, userToken, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/application/news/update/' + newsFeed.id,
				data: {news: newsFeed},
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
	 * Call to pitapit API to get the details of a specific news feed.
	 * @function
	 * @param {integer} newsFeedId - The id of the selected news feed.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getNewsFeedDetails: function (newsFeedId, userToken, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/application/news/show/' + newsFeedId,
				data: {},
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
