import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'
import permissions from './modules/permissions'
import auth from './modules/auth'
import stores from './modules/stores'
const environment = require('../environment.js')

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		permissions,
		auth,
		stores
	},
	actions: {},
	strict: environment.development,
	plugins: environment.development
		? [
			createPersistedState(),
			createLogger()
		] : [
			createPersistedState()
		]
})

export default store
