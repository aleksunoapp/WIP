import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import permissions from './modules/permissions'
import auth from './modules/auth'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
	modules: {
		permissions,
		auth
	},
	actions: {},
	strict: debug,
	plugins: debug ? [createLogger()] : []
})

export default store
