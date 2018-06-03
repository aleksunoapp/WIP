// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import router from './router'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import VueSweetAlert from 'vue-sweetalert'
import VueScrollTo from 'vue-scrollto'
// import globals from './global.js'

require('./assets/css/font-awesome/css/font-awesome.min.css')
require('./assets/css/simple-line-icons/simple-line-icons.min.css')
require('./assets/css/bootstrap/css/bootstrap.min.css')
require('./assets/css/components-md.min.css')
require('./assets/css/plugins.min.css')
require('./assets/plugins/socicon/socicon.css')
require('./assets/plugins/jquery-nestable/jquery.nestable.css')
require('./assets/css/blog.min.css')
require('./assets/css/profile-2.min.css')
require('./assets/css/login.min.css')
require('./assets/css/search.min.css')
require('./assets/css/layout/css/custom.css')
require('./assets/css/layout/css/layout.min.css')
require('./assets/css/layout/css/themes/unoapp.css')

Vue.use(ElementUI, { locale })
Vue.use(VueSweetAlert)
Vue.use(VueScrollTo)

var App = new Vue({
	data () {
		return {
			activeUser: {},
			userToken: '',
			appId: '',
			appSecret: '',
			accountType: '',
			activeLocation: {},
			createdBy: 0,
			activeMenuId: 0,
			corporateStoreId: null,
			storeLocations: [],
			requestsPending: false
		}
	},
	methods: {
		clearGlobalVariables () {
			this.activeUser = {}
			this.userToken = ''
			this.appId = ''
			this.appSecret = ''
			this.accountType = ''
			this.activeLocation = {}
			this.createdBy = 0
			this.activeMenuId = 0
			this.corporateStoreId = null
			this.storeLocations = []
		},
		/**
		 * A wrapper to handle errors for special cases
		 * @param {function} errorCallback - A function to be run if all of the special error cases are passed
		 * @returns {function} - A function that determines if it needs to apply special logic or just run the callback
		 * @version 0.0.9
		 */
		errorWrapper (errorCallback) {
			return e => {
				if (e.responseJSON && e.responseJSON.declaration) {
					switch (e.responseJSON.declaration) {

					case 'auth_token_needs_refresh':
					case 'no_account_selected':
					case 'csrf_token_mismatch':
					case 'auth_token_missing':
					case 'auth_token_expired':
					case 'auth_token_invalid':
							// Redirect to the login screen and clear all variables
						// window.location.href = `${globals.accountsUrl}/login/?redirect_to=ecomm`
						return

					default:
							// No default
					}
				}

				errorCallback(e)
			}
		}
	},
	router
})

App.$mount('#app')

export {App}
