/**
 * @module Loyalty
 */

import GlobalFunctions from '../global'

export default {
  /**
	 * Call to API to create a rule.
	 * @function
	 * @param {object} rule - An object containing the rule to create.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  createRule: function (rule) {
    return new Promise(function (resolve, reject) {
      let options = {
        method: 'POST',
        dataType: 'json',
        url: '/api/rules/create',
        data: rule,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      }
      GlobalFunctions.$ajax(options, 'loyalty')
    })
  },
  /**
	 * Call to API to update a rule.
	 * @function
	 * @param {object} rule - An object containing the rule to update.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  updateRule: function (rule) {
    return new Promise(function (resolve, reject) {
      let options = {
        method: 'POST',
        dataType: 'json',
        url: '/api/rules/' + rule.id + '/update',
        data: rule,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      }
      GlobalFunctions.$ajax(options, 'loyalty')
    })
  },
  /**
	 * Call to API to get a list of rules.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getRules: function () {
    return new Promise(function (resolve, reject) {
      let options = {
        method: 'GET',
        dataType: 'json',
        url: '/api/rules',
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      }
      GlobalFunctions.$ajax(options, 'loyalty')
    })
  },
  /**
	 * Call to API to delete a rule.
	 * @function
	 * @param {integer} ruleId - The id of the rule to delete.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  deleteRule: function (ruleId) {
    return new Promise(function (resolve, reject) {
      let options = {
        method: 'DELETE',
        dataType: 'json',
        url: '/api/rules/' + ruleId + '/delete',
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      }
      GlobalFunctions.$ajax(options, 'loyalty')
    })
  },
  /**
	 * Call to API to create a promotion rule.
	 * @function
	 * @param {object} rule - An object containing the rule to create.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  createPromotionRule: function (rule) {
    return new Promise(function (resolve, reject) {
      let options = {
        method: 'POST',
        dataType: 'json',
        url: '/api/promotion/create',
        data: rule,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      }
      GlobalFunctions.$ajax(options, 'loyalty')
    })
  },
  /**
	 * Call to API to update a promotion rule.
	 * @function
	 * @param {object} rule - An object containing the rule to update.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  updatePromotionRule: function (rule) {
    return new Promise(function (resolve, reject) {
      let options = {
        method: 'POST',
        dataType: 'json',
        url: '/api/promotion/' + rule.id + '/update',
        data: rule,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      }
      GlobalFunctions.$ajax(options, 'loyalty')
    })
  },
  /**
	 * Call to API to get a list of promotion rules.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getPromotionRules: function () {
    return new Promise(function (resolve, reject) {
      let options = {
        method: 'GET',
        dataType: 'json',
        url: '/api/promotion',
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      }
      GlobalFunctions.$ajax(options, 'loyalty')
    })
  },
  /**
	 * Call to API to delete a rule.
	 * @function
	 * @param {integer} ruleId - The id of the rule to delete.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  deletePromotionRule: function (ruleId) {
    return new Promise(function (resolve, reject) {
      let options = {
        method: 'DELETE',
        dataType: 'json',
        url: '/api/promotion/' + ruleId + '/delete',
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      }
      GlobalFunctions.$ajax(options, 'loyalty')
    })
  }
}
