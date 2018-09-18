import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'
import permissions from './modules/permissions'
import auth from './modules/auth'
import stores from './modules/stores'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
	modules: {
		permissions,
		auth,
		stores
	},
	actions: {},
	strict: debug,
	plugins: [
		createPersistedState(),
		debug ? createLogger() : null
	]
})

export default store
