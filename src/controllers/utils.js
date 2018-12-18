/**
* To check if the input is a positive number
* @function
* @param {string} input - User's input
* @returns {boolean} True is positive integer or float, false is not
*/
export const isNonNegativeNumber = function (input) {
	try {
		const inputString = String(input)
		if (inputString.length === 0) return false
		if (inputString.length > inputString.replace(/[^\d.]/g, '').length) {
			return false
		}
		const value = Number(input)
		if (value < 0) {
			return false
		}
		return true
	} catch (e) {
		return false
	}
}

/**
 * To format a number as currency
 * @function
 * @param {string} val - The number to format
 * @param {string} fallback - Preferred fallback return value
 * @returns {string} The formatted currency amount
 */
export const formatUSD = function (val, fallback = '') {
	try {
		if (val === '') return fallback
		let input = Number(val)
		if (isNaN(input)) return fallback

		input = input.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		})
		return input
	} catch (e) {
		return fallback
	}
}

/**
 * To format a number as currency
 * @function
 * @param {string} val - The number to format
 * @param {string} fallback - Preferred fallback return value
 * @returns {string} The formatted currency amount
 */
export const formatInteger = function (val, fallback = '') {
	try {
		if (val === '') return fallback
		let input = Number(val)
		if (isNaN(input)) return fallback

		input = input.toLocaleString(
			'en-US',
			{
				style: 'decimal',
				maximumFractionDigits: 0
			}
		)
		return input
	} catch (e) {
		return fallback
	}
}

export default {
	isNonNegativeNumber,
	formatUSD,
	formatInteger
}
