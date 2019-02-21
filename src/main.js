// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import ElementUI from 'element-ui'
import router, { routes } from './router'
import locale from 'element-ui/lib/locale/lang/en'
import '@/assets/css/Element-UI-variable-overrides.scss'
import VueSweetAlert from 'vue-sweetalert'
import VueScrollTo from 'vue-scrollto'
import { mapState, mapMutations } from 'vuex'
import $ from 'jquery'
import GlobalFunctions from '@/global'
import AppFunctions from '@/controllers/App'
import environment from '@/environment.js'

// require('./assets/css/font-awesome/css/font-awesome.min.css')
require('./assets/css/simple-line-icons/simple-line-icons.min.css')
require('./assets/css/bootstrap/css/bootstrap.min.css')
require('./assets/css/components-md.min.css')
require('./assets/css/plugins.min.css')
require('./assets/plugins/socicon/socicon.css')
require('./assets/plugins/jquery-nestable/jquery.nestable.css')
require('./assets/css/blog.min.css')
require('./assets/css/profile-2.min.css')
require('./assets/css/search.min.css')
require('./assets/css/layout/css/custom.css')
require('./assets/css/layout/css/layout.min.css')
require('./assets/css/layout/css/themes/unoapp.css')

Vue.use(ElementUI, { locale })
Vue.use(VueSweetAlert)
Vue.use(VueScrollTo)

var App = new Vue({
  store,
  data () {
    return {
      activeUser: {},
      accountType: '',
      activeLocation: {},
      createdBy: 0,
      activeMenuId: 0,
      requestsPending: false,
      roles: []
    }
  },
  computed: {
    corporateStoreId () {
      const firstCorporateStore = this.storeLocations.find(store => store.is_corporate === 1)
      if (firstCorporateStore !== undefined) {
        return firstCorporateStore.id
      } else {
        return null
      }
    },
    staging () {
      const { staging } = environment
      return window.location.hostname.split('.')[0] === 'localhost' && staging
    },
    master () {
      const { production } = environment
      return window.location.hostname.split('.')[0] === 'localhost' && production
    },
    ...mapState({
      permissions: state => state.permissions,
      appId: state => state.auth.appId,
      appSecret: state => state.auth.appSecret,
      userToken: state => state.auth.userToken,
      storeLocations: state => state.stores.storeLocations
    })
  },
  created () {
    this.readLocalStorage()
  },
  methods: {
    /**
		 * To check for log in info in localStorage, fetch permissions and route to app
		 * @function
		 * @returns {undefined}
		 */
    readLocalStorage () {
      /* eslint-disable no-undef */
      const activeUser = localStorage.getItem('activeUser')
      const userToken = localStorage.getItem('userToken')
      const appId = localStorage.getItem('appId')
      const appSecret = localStorage.getItem('appSecret')
      const createdBy = localStorage.getItem('createdBy')
      const accountType = localStorage.getItem('accountType')
      const roles = localStorage.getItem('roles')

      const activeLocation = localStorage.getItem('activeLocation')
      /* eslint-enable no-undef */

      if (
        activeUser !== null &&
				userToken !== null &&
				appId !== null &&
				appSecret !== null &&
				createdBy !== null &&
				accountType !== null &&
				roles !== null
      ) {
        this.activeUser = JSON.parse(activeUser)
        this.setUserToken(userToken)
        this.setAppId(appId)
        this.setAppSecret(appSecret)
        this.createdBy = createdBy
        this.accountType = accountType
        this.roles = JSON.parse(roles)

        this.activeLocation = JSON.parse(activeLocation) || {}

        this.getPermissionsOfUser(this.activeUser.id).then(response => {
          let userPermissions = {}
          response.payload.permissions.forEach(
            permission => {
              userPermissions[permission.name] = true
            }
          )
          this.setPermissions(userPermissions)
          this.routeUser()
        }).catch(error => {
          this.logOut(error)
        })
      } else if (!this.$route.query.token) {
        this.logOut()
      }
    },
    /**
		 * To get permissions of the user.
		 * @function
		 * @param {integer} id - User ID
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getPermissionsOfUser (id) {
      const _this = this
      return $.ajax({
        method: 'GET',
        dataType: 'json',
        url: `${GlobalFunctions.urls.ecomm}/app/admin/users/${id}/all_permissions`,
        data: {
          guard_name: 'admin'
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('app-id', _this.appId)
          xhr.setRequestHeader('app-secret', _this.appSecret)
          xhr.setRequestHeader('auth-token', _this.userToken)
        },
        success: function (response) {
          return response
        },
        error: function (error) {
          return error
        }
      })
    },
    /**
		 * To route user to the first route they have permission to access.
		 * @function
		 * @param {integer} id - User ID
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    routeUser () {
      // redirect
      let appRoutes = routes.filter(
        route => route.path === '/app'
      )[0].children
      let accessible = false
      // eslint-disable-next-line
			const routePath = sessionStorage.getItem('routePath')
      for (let i = 0; i < appRoutes.length; i++) {
        const route = appRoutes[i]
        accessible = route.meta.permissions.some(
          permission =>
            this.$root.permissions[permission]
        )
        if (accessible) {
          if (routePath !== null) {
            const routePathAccessible = appRoutes.find(route => {
              if (`/app/${route.path}` === routePath) {
                return route.meta.permissions.some(
                  permission =>
                    this.$root.permissions[permission]
                )
              }
            })
            if (routePathAccessible) {
              this.$router.push({
                path: routePath
              })
            } else {
              this.$router.push({
                path: `/app/${route.path}`
              })
            }
          } else {
            this.$router.push({
              path: `/app/${route.path}`
            })
          }
          break
        }
      }
      if (!accessible) {
        this.$router.push('/app/unauthorized')
      }
    },
    /**
		 * To clear user login data
		 * @function
		 * @returns {undefined}
		 */
    clearGlobalVariables () {
      this.activeUser = {}
      this.setUserToken('')
      this.setAppId('')
      this.setAppSecret('')
      this.accountType = ''
      this.activeLocation = {}
      this.createdBy = 0
      this.activeMenuId = 0
      this.setStoreLocations([])
      this.setPermissions({})
      this.roles = []
    },
    /**
		 * To log the user out of their current session and clear global variables and local storage.
		 * @function
		 * @param {object} error - An optional error object
		 * @returns {undefined}
		 */
    logOut (error) {
      if (this.appId && this.appSecret && this.userToken) {
        AppFunctions.logOut()
      }

      this.setAccountToken('')
      this.clearGlobalVariables()
      this.$router.push({
        name: 'LoginExpired',
        params: {
          expired: 'expired'
        }
      })
      // eslint-disable-next-line
			localStorage.clear()
      if (error) {
        console.log(error)
      }
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
              return

            default:
							// No default
          }
        }

        errorCallback(e)
      }
    },
    ...mapMutations({
      setPermissions: 'SET_PERMISSIONS',
      setAppId: 'SET_APP_ID',
      setAppSecret: 'SET_APP_SECRET',
      setUserToken: 'SET_USER_TOKEN',
      setStoreLocations: 'SET_STORE_LOCATIONS',
      setAccountToken: 'SET_ACCOUNT_TOKEN'
    })
  },
  router
})

App.$mount('#app')

export { App }
