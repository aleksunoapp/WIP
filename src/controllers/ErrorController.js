/**
 * Error handler for ajax calls
 * @function
 * @param {object} reason - The exception object
 * @param {object} errorText - The error message to display
 * @param {string} errorName - Name of the variable that holds the error
 * @param {object} vue - The vue instance
 * @returns {undefined}
 */
export default function ajaxErrorHandler ({reason, errorText = 'Something went wrong ...', errorName, vue}) {
	try {
		// Expired token
		if (reason.responseJSON && reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
			vue.$router.push('/login/expired')
			return
		}
		// Show error message from backend
		vue[errorName.toString()] = reason.responseJSON.message
	} catch (error) {
		// Any other error (unknown)
		try {
			vue[errorName.toString()] = errorText
		} catch (err) {
			console.log(err)
		}
	} finally {
		try {
			vue.$scrollTo(vue.$refs[errorName.toString()], 1000, { offset: -50 })
		} catch (err) {
			console.log(err)
		}
	}
}
