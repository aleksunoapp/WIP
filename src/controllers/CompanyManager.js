/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default {
  /**
	 * Call to unoapp API to create a new company.
	 * @function
	 * @param {object} company - The object of company details.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  createNewCompany: function (company, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/application/create',
        data: { company: company },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to unoapp API to update a company.
	 * @function
	 * @param {object} company - The object of company details.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  updateCompany: function (company, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/application/update',
        data: { company: company },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to unoapp API to get a list of companies.
	 * @function
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getCompanies: function (userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/application/applications',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to unoapp API to assign a manager to a company.
	 * @function
	 * @param {string} companyId - The id of the company to be assigned a manager to.
	 * @param {object} manager - The object of manager details.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  assignManager: function (companyId, manager, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/application/users/create',
        data: {
          z_companyid_fk: companyId,
          name: manager.name,
          email: manager.email,
          password: manager.password
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
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
