import freshiiConfig from '@/global_FRESHII.js'
import pitapitConfig from '@/global_PITAPIT.js'
import laprepConfig from '@/global_LAPREP.js'
import yogenfruzConfig from '@/global_YOGENFRUZ.js'

const freshii = 'freshii'
const pitapit = 'pitapit'
const laprep = 'laprep'
const yogenfruz = 'yogenfruz'

// change the following line
const client = freshii

const fileRouter = (function () {
	if (client === freshii) {
		return freshiiConfig
	} else if (client === pitapit) {
		return pitapitConfig
	} else if (client === laprep) {
		return laprepConfig
	} else if (client === yogenfruz) {
		return yogenfruzConfig
	} else {
		return null
	}
})()

export default fileRouter
