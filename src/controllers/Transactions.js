import GlobalFunctions from '@/global.js'

/**
 * Call to API to get combo offers.
 * @function
 * @param {number} userId - ID of the user to fetch transactions for
 * @returns {object} A promise
 */
export const getTransactionsForUser = (userId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: `/application/admin/user_transactions/${userId}`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to search transactions.
 * @function
 * @param {object} params - Search criteria
 * @returns {object} A promise
 */
export const searchTransactions = (params) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			data: params,
			url: `/application/admin/all_transactions`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

export default {
	getTransactionsForUser,
	searchTransactions
}
