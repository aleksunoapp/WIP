import freshiiConfig from '@/global_FRESHII.js'
import pitapitConfig from '@/global_PITAPIT.js'
import laprepConfig from '@/global_LAPREP.js'

const freshii = 'freshii'
const pitapit = 'pitapit'
const laprep = 'laprep'
let client = window.location.hostname.split('.')[0]

if (client === 'localhost') {
	client = freshii
}

const fileRouter = (function () {
	if (client === freshii) {
		return freshiiConfig
	} else if (client === pitapit) {
		return pitapitConfig
	} else if (client === laprep) {
		return laprepConfig
	} else {
		return null
	}
})()

export default fileRouter
