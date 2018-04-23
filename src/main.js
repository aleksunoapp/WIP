// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import router from './router'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import VueSweetAlert from 'vue-sweetalert'
import VueScrollTo from 'vue-scrollto'

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
			activeUser: '',
			userToken: '',
			appId: '',
			appSecret: '',
			accountType: '',
			activeLocation: {},
			createdBy: 0,
			activeMenuId: 0,
			corporateStoreId: 0,
			storeLocations: [],
			businessId: null,
			accountToken: ''
		}
	},
	methods: {
		clearGlobalVariables () {
			this.activeUser = ''
			this.userToken = ''
			this.appId = ''
			this.appSecret = ''
			this.accountType = ''
			this.activeLocation = {}
			this.createdBy = 0
			this.activeMenuId = 0
			this.corporateStoreId = 0
			this.storeLocations = []
			this.businessId = null
			this.accountToken = ''
		}
	},
	router
})

App.$mount('#app')

export {App}
