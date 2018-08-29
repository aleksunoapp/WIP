/**
 * @module Admin Manager
 */
import GlobalFunctions from '../global'
// import {App} from '@/main.js'

export default {
	/**
	 * Call to API to approve a request.
	 * @function
	 * @param {object} request - The request to approve
	 * @param {object} review - The reviewer's info
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	approveRequest: function (request, review) {
		return new Promise(function (resolve, reject) {
			let options = {
				method: 'POST',
				dataType: 'json',
				url: '/app/request/' + request._id + '/approvalAction',
				data: review,
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			}
			GlobalFunctions.$ajax(options, 'approvals')
		})
	},
	/**
	 * Call to API to get a list of requests.
	 * @function
	 * @param {object} pagination - The pagination settings
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getRequests: function (pagination) {
		return new Promise(function (resolve, reject) {
			let options = {
				method: 'GET',
				dataType: 'json',
				url: '/app/request/list/' + GlobalFunctions.approvalsAppId,
				data: pagination,
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			}
			GlobalFunctions.$ajax(options, 'approvals')
		})
	}
}
