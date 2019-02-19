/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to list currencies
 * @function
 * @param {object} locationId - ID of the store to get the currencies for
 * @returns {object} A promise
 */
export const listCurrencies = ({ locationId }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      dataType: 'json',
      url: `/app/locations/${locationId}/locationAcceptedCurrencies/`,
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
 * Call to API to update a currency
 * @function
 * @param {object} locationId - ID of the store to create the currency for
 * @param {object} currency - The new currency
 * @returns {object} A promise
 */
export const createCurrency = ({ locationId, currency }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: `/app/locations/${locationId}/locationAcceptedCurrencies/`,
      data: currency,
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
 * Call to API to update a currency
 * @function
 * @param {object} currency - The updated currency
 * @returns {object} A promise
 */
export const updateCurrency = ({ locationId, currency }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'PUT',
      dataType: 'json',
      url: `/app/locations/${locationId}/locationAcceptedCurrencies/${currency.id}`,
      data: currency,
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
 * Call to API to delete a currency
 * @function
 * @param {object} locationId - ID of the store the currency belongs to
 * @param {object} currency - The currency to delete
 * @returns {object} A promise
 */
export const deleteCurrency = ({ locationId, currency }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'DELETE',
      dataType: 'json',
      url: `/app/locations/${locationId}/locationAcceptedCurrencies/${currency.id}`,
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
  listCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency
}
