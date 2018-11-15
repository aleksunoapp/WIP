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
		if (this.environment !== 'production') {
			console.log({e})
		}
		return false
	}
}

export default {
	isNonNegativeNumber
}
