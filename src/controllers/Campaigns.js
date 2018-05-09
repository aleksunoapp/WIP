/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to gamification API to get a list of campaigns.
	 * @function
	 * @param {integer} pageNumber - The current page that we are retrieving results for.
	 * @param {integer} recordsPerPage - The number of records to return per page.
	 * @param {string} campaignType - The selected campaign type filter.
	 * @param {string} status - The selected campaign status filter.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getCampaigns (pageNumber, recordsPerPage, campaignType, status, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/campaign/list',
				data: {records_per_page: recordsPerPage, page_number: pageNumber, campaign_type: campaignType, status: status},
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
	 * Call to gamification API to get all the details related to a campaign.
	 * @function
	 * @param {integer} campaignId - The id of the selected campaign.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getCampaignDetails (campaignId, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/campaign/' + campaignId,
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
	},
	/**
	 * Call to gamification API to create a new campaign.
	 * @function
	 * @param {integer} campaign - The new campaign object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createNewCampaign (campaign, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/campaign/create',
				data: campaign,
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
	 * Call to gamification API to delete a campaign.
	 * @function
	 * @param {integer} campaignId - The id of the selected campaign.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteCampaign (campaignId, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/campaign/' + campaignId,
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
	},
	/**
	 * Call to gamification API to create a new campaign.
	 * @function
	 * @param {integer} campaignId - The id of the selected campaign.
	 * @param {string} startDate - The new start date.
	 * @param {string} endDate - The new end date.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateCampaign (campaignId, startDate, endDate, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PATCH',
				dataType: 'json',
				url: '/campaign/' + campaignId,
				data: {start_date: startDate, end_date: endDate},
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
	 * Call to gamification API to create a new campaign.
	 * @function
	 * @param {integer} campaignId - The id of the selected campaign.
	 * @param {string} newStatus - The new status.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateCampaignStatus (campaignId, newStatus, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PATCH',
				dataType: 'json',
				url: '/campaign_status/' + campaignId,
				data: {status: newStatus},
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
