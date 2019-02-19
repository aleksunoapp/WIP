/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to get payment methods for a store.
 * @function
 * @param {number} storeId - ID of the store
 * @returns {object} A promise
 */
export const listPaymentMethodsForStore = (storeId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      dataType: 'json',
      url: `/app/payment_methods/${storeId}`,
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
 * Call to API to create payment methods
 * @function
 * @param {object} paymentMethods - The payment methods to update
 * @returns {object} A promise
 */
export const createPaymentMethods = (paymentMethods) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: `/app/payment_methods/create`,
      data: paymentMethods,
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
 * Call to API to update payment methods
 * @function
 * @param {object} paymentMethods - The updated payment methods
 * @returns {object} A promise
 */
export const updatePaymentMethods = (paymentMethods) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: `/app/payment_methods/update/${paymentMethods.id}`,
      data: paymentMethods,
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
* Call to API to delete payment methods
* @function
* @param {object} paymentMethodsId - ID of the payment methods to delete
* @returns {object} A promise
*/
export const deletePaymentMethods = (paymentMethodsId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'DELETE',
      url: `/app/payment_methods/delete/${paymentMethodsId}`,
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
 * Call to API to list payment methods
 * @function
 * @param {object} locationId - ID of the store to get the payment methods for
 * @returns {object} A promise
 */
export const listNonIntegratedPaymentMethods = ({ locationId }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      dataType: 'json',
      url: `/app/locations/${locationId}/LocationNonIntegratedPaymentMethod/`,
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
 * Call to API to update a payment method
 * @function
 * @param {object} locationId - ID of the store to create the payment methods for
 * @param {object} paymentMethod - The updated payment methods
 * @returns {object} A promise
 */
export const createNonIntegratedPaymentMethod = ({ locationId, paymentMethod }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: `/app/locations/${locationId}/LocationNonIntegratedPaymentMethod/`,
      data: paymentMethod,
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
 * Call to API to update payment methods
 * @function
 * @param {object} paymentMethod - The updated payment method
 * @returns {object} A promise
 */
export const updateNonIntegratedPaymentMethod = ({ locationId, paymentMethod }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'PUT',
      dataType: 'json',
      url: `/app/locations/${locationId}/LocationNonIntegratedPaymentMethod/${paymentMethod.id}`,
      data: paymentMethod,
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
 * Call to API to delete a payment method
 * @function
 * @param {object} locationId - ID of the store the payment method belongs to
 * @param {object} paymentMethod - The payment method to delete
 * @returns {object} A promise
 */
export const deleteNonIntegratedPaymentMethod = ({ locationId, paymentMethod }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'DELETE',
      dataType: 'json',
      url: `/app/locations/${locationId}/LocationNonIntegratedPaymentMethod/${paymentMethod.id}`,
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
  listPaymentMethodsForStore,
  createPaymentMethods,
  updatePaymentMethods,
  deletePaymentMethods,
  listNonIntegratedPaymentMethods,
  createNonIntegratedPaymentMethod,
  updateNonIntegratedPaymentMethod,
  deleteNonIntegratedPaymentMethod
}
