<template>
  <div class="page-wrapper">
    <!-- BEGIN HEADER -->
    <div
      class="page-header navbar navbar-fixed-top"
      :class="{'master' : $root.master, 'staging' : $root.staging}"
    >
      <!-- BEGIN HEADER INNER -->
      <div class="page-header-inner">
        <div class="page-logo">
          <a>
            <img
              src="../assets/img/app/unoapp-commerce-logo.png"
              alt="logo"
              class="logo-default logo-unoapp"
            >
          </a>
        </div>
        <!-- END LOGO -->

        <!-- BEGIN TOP NAVIGATION MENU -->
        <div class="top-menu">
          <ul class="nav navbar-nav pull-right">
            <!-- BEGIN USER LOGIN DROPDOWN -->
            <li
              class="dropdown dropdown-user left"
              @click="$root.logOut()"
            >
              <a
                href="javascript:;"
                class="dropdown-toggle log-out-button"
              >
                <span class="username username-hide-on-mobile">
                  Log out
                </span>
              </a>
            </li>
            <!-- END USER LOGIN DROPDOWN -->
            <!-- BEGIN QUICK SIDEBAR TOGGLER -->
            <li
              class="dropdown dropdown-quick-sidebar-toggler width-auto"
              @click="toggleQuickSidebar($event)"
            >
              <a class="dropdown-toggle location-panel width-auto">
                <div class="logo-container">
                  <img
                    class="business-logo"
                    src="../assets/img/app/logo-refresh.png"
                    width="38"
                    height="38"
                  >
                </div>
                <div
                  v-if="activeLocation.display_name"
                  class="location-name-container"
                >
                  <span class="business-name">
                    {{ $root.activeUser.name }}
                  </span>
                  <span class="business-location-name">
                    {{ activeLocation.display_name }}
                  </span>
                </div>
                <div
                  v-else
                  class="location-name-container"
                >
                  <span class="business-name big">
                    {{ $root.activeUser.name }}
                  </span>
                </div>
              </a>
            </li>
            <!-- END QUICK SIDEBAR TOGGLER -->
          </ul>
        </div>
        <!-- END TOP NAVIGATION MENU -->
      </div>
      <!-- END HEADER INNER -->
    </div>
    <!-- END HEADER -->

    <!-- BEGIN HEADER & CONTENT DIVIDER -->
    <div class="clearfix" />
    <!-- END HEADER & CONTENT DIVIDER -->
    <!-- BEGIN CONTAINER -->
    <div class="page-container">
      <left-sidebar />

      <!-- BEGIN CONTENT -->
      <div class="page-content-wrapper">
        <!-- BEGIN CONTENT BODY -->
        <div class="page-content">
          <transition
            name="fade"
            mode="out-in"
          >
            <router-view />
          </transition>
        </div>
      </div>
      <!-- BEGIN QUICK SIDEBAR -->
      <div
        class="page-quick-sidebar-wrapper"
        data-close-on-body-click="false"
      >
        <a
          class="page-quick-sidebar-toggler"
          @click="toggleQuickSidebar($event)"
        >
          <span class="icon-close" />
        </a>
        <div class="page-quick-sidebar">
          <div>
            <div class="tab-content">
              <div class="tab-pane active page-quick-sidebar-chat">
                <div
                  class="page-quick-sidebar-chat-users active-business"
                  data-rail-color="#ddd"
                  data-wrapper-class="page-quick-sidebar-list"
                >
                  <ul class="media-list list-items">
                    <router-link
                      tag="li"
                      to="/app/profile"
                      class="media selected-location current-location padding-sidebar-user"
                    >
                      <img
                        class="media-object"
                        src="../assets/img/app/logo-refresh.png"
                        alt="..."
                      >
                      <div class="media-status">
                        <i class="fa fa-gear" />
                      </div>
                      <div class="media-body">
                        <h4 class="media-heading">
                          {{ $root.activeUser.name }}
                        </h4>
                        <div class="media-heading-sub">
                          Account Settings
                        </div>
                      </div>
                    </router-link>
                  </ul>
                </div>
              </div>
            </div>
            <div class="tab-content">
              <div class="tab-pane active page-quick-sidebar-chat">
                <div
                  class="page-quick-sidebar-chat-users"
                  data-rail-color="#ddd"
                  data-wrapper-class="page-quick-sidebar-list"
                >
                  <h3
                    v-if="activeLocation.id !== undefined"
                    class="list-heading location-panel-heading blue font-default"
                  >
                    Active Store
                  </h3>
                  <ul
                    v-if="activeLocation.id !== undefined"
                    class="media-list list-items"
                  >
                    <li class="media padding-sidebar-search">
                      <div
                        class="media-status"
                        @click="unselectLocation($event)"
                      >
                        <div class="active-location-dots">
                          <div class="active-location-dot">
                            <i class="fa fa-circle blue" />
                          </div>
                          <div class="deactivate-location-dot">
                            <i class="fa fa-times-circle" />
                          </div>
                        </div>
                      </div>
                      <div class="media-body">
                        <h4 class="media-heading">
                          {{ activeLocation.display_name }}
                        </h4>
                        <div class="media-heading-sub">
                          {{ activeLocation.address_line_1 }}
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="padding-box padding-sidebar-search">
                    <div class="form-group form-md-line-input form-md-floating-label">
                      <input
                        id="location_search"
                        v-model="searchQuery"
                        type="text"
                        class="form-control input-sm padding-right-20"
                        :class="{'edited': searchQuery.length}"
                      >
                      <i
                        v-if="searchQuery.length"
                        class="fa fa-times clear-icon"
                        @click="clearSearch()"
                      />
                      <label for="location_search">
                        Search for a store
                      </label>
                      <span class="help-block persist">
                        <span v-if="searchError.length">
                          {{ searchError }}
                        </span>
                        <span v-else>
                          Search by name, address or ID
                        </span>
                      </span>
                    </div>
                  </div>
                  <div class="margin-top-30">
                    <h3 class="list-heading location-panel-heading blue font-default">
                      Stores
                    </h3>
                    <loading-screen :show="loading" />
                    <div
                      v-show="! loading"
                      class="tab-content"
                    >
                      <div :class="{'tab-pane active page-quick-sidebar-chat scrollable' : activeLocation.id !== undefined, 'tab-pane active page-quick-sidebar-chat scrollable-select-location' : activeLocation.id == undefined}">
                        <div
                          class="page-quick-sidebar-chat-users"
                          data-rail-color="#ddd"
                          data-wrapper-class="page-quick-sidebar-list"
                        >
                          <ul class="media-list list-items">
                            <li
                              v-for="location in searchResult"
                              :key="location.id"
                              class="media padding-sidebar-store"
                              @click="selectLocation(location)"
                            >
                              <div class="media-body">
                                <h4 class="media-heading">
                                  {{ location.display_name }}
                                </h4>
                                <div class="media-heading-sub">
                                  {{ location.address_line_1 }}
                                </div>
                              </div>
                            </li>
                          </ul>
                          <div
                            v-show="lastPage > 1"
                            class="pagination-wrapper"
                          >
                            <div
                              class="pagination-arrow"
                              :class="{ 'disabled' : currentPage === 1 }"
                              @click="goToPreviousPage()"
                            >
                              <i
                                class="fa fa-angle-left"
                                aria-hidden="true"
                              />
                            </div>
                            <div
                              class="pagination-arrow"
                              :class="{ 'disabled' : currentPage === lastPage }"
                              @click="goToNextPage()"
                            >
                              <i
                                class="fa fa-angle-right"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END QUICK SIDEBAR -->
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import AppFunctions from '../controllers/App'
import { findIndex } from 'lodash'
import LeftSidebar from '@/components/app/LeftSidebar'
import LoadingScreen from '@/components/modules/LoadingScreen'
import { mapMutations } from 'vuex'

/**
 * App module is the main component which holds the navigation, page header, and side panel.
 * @class App
 */

export default {
  data () {
    return {
      routeMessage: '',
      activeTab: 0,
      searchQuery: '',
      activeLocation: {},
      searchError: '',
      currentPage: 1,
      loading: false
    }
  },
  computed: {
    lastPage () {
      this.currentPage = 1
      if (this.searchQuery) {
        return Math.ceil(this.searchResult.length / 5)
      } else {
        return Math.ceil(this.$root.storeLocations.length / 5)
      }
    },
    searchResult () {
      let searchArray = this.$root.storeLocations

      const searchResult = searchArray.filter(store => {
        let searchArea =
					store.display_name +
					store.address_line_1 +
					store.internal_id
        return (
          searchArea
            .toLowerCase()
            .indexOf(this.searchQuery.toLowerCase()) > -1
        )
      })
      searchResult.sort((a, b) => a.display_name > b.display_name)

      let begin = (this.currentPage - 1) * 10
      let end = this.currentPage * 10

      return searchResult.slice(begin, end)
    }
  },
  /**
	 * Run on `mounted` to initialize the app defaults.
	 * @function
	 * @returns {undefined}
	 */
  mounted () {
    // This will add all of the necessary classes to the body that aren't required outside of the app
    $('body')
      .addClass('page-header-fixed')
      .addClass('page-sidebar-closed-hide-logo')
      .addClass('page-content-white')
      .addClass('page-md')
      .addClass('app-body')

    AppFunctions.init()
    AppFunctions.initApp()

    // get list of stores
    if (this.$root.accountType === 'application_admin') {
      this.getStoreLocations()
    }

    // eslint-disable-next-line
		const activeLocation = localStorage.getItem('activeLocation')
    if (activeLocation !== null) {
      this.selectLocation(JSON.parse(activeLocation))
    }
  },
  methods: {
    /**
		 * To move to the next page of stores.
		 * @function
		 * @returns {undefined}
		 */
    goToNextPage () {
      if (this.currentPage < this.lastPage) {
        this.currentPage = this.currentPage + 1
      }
    },
    /**
		 * To move to the previous page of stores.
		 * @function
		 * @returns {undefined}
		 */
    goToPreviousPage () {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1
      }
    },
    /**
		 * To clear the search field.
		 * @function
		 * @returns {undefined}
		 */
    clearSearch () {
      this.searchQuery = ''
    },
    /**
		 * To toggle whether or not the sidebar should be toggled open.
		 * @function
		 * @returns {undefined}
		 */
    toggleQuickSidebar () {
      if (this.$root.activeAccountType !== 'location') {
        $('body').toggleClass('page-quick-sidebar-open')
      }
    },
    /**
		 * To get a list of store locations for the current application.
		 * @function
		 * @returns {undefined}
		 */
    getStoreLocations () {
      this.loading = true
      var appVue = this
      AppFunctions.getPaginatedStoreLocations(
        appVue.$root.appId,
        appVue.$root.appSecret,
        appVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            // set the active location if already present in local storage
            // eslint-disable-next-line
						var activeLocation = localStorage.getItem(
              'activeLocation'
            )
						let stores = response.payload
            if (activeLocation) {
							activeLocation = JSON.parse(activeLocation)
							appVue.selectLocation(activeLocation)
							stores = stores.filter(store => store.id !== activeLocation.id)
            }
						appVue.setStoreLocations(stores)
            appVue.loading = false
          }
        })
        .catch(reason => {
          if (reason.responseJSON) {
          }
          throw reason
        })
    },
    /**
		 * To select another location from the list of locations for the current application.
		 * @function
		 * @param {object} location - The location object to be selected.
		 * @returns {undefined}
		 */
    selectLocation (location) {
      // ToDo: make a call to the appropriate endpoint and update the logic once this part is scoped out
      if (this.activeLocation && this.activeLocation.id) {
        let temp = [...this.$root.storeLocations]

        temp.splice(
          findIndex(this.$root.storeLocations, location),
          1
        )
        temp.unshift(this.activeLocation)
        this.setStoreLocations(temp)
      } else {
        let temp = [...this.$root.storeLocations]
        temp.splice(
          findIndex(this.$root.storeLocations, location),
          1
        )
        this.setStoreLocations(temp)
      }
      this.activeLocation = location
      this.$root.activeLocation = location
      /* eslint-disable no-undef */
      localStorage.setItem(
        'activeLocation',
        JSON.stringify(this.$root.activeLocation)
      )
      this.toggleQuickSidebar()
    },
    /**
		 * To clear the selection of location.
		 * @function
		 * @param {object} event - The event that triggered the function.
		 * @returns {undefined}
		 */
    unselectLocation (event) {
      event.stopPropagation()
      let temp = [...this.$root.storeLocations]
      temp.unshift(this.activeLocation)
      this.setStoreLocations(temp)
      /* eslint-disable no-undef */
      localStorage.removeItem('activeLocation')
      this.$root.activeLocation = {}
      this.activeLocation = {}
    },
    ...mapMutations({
      setStoreLocations: 'SET_STORE_LOCATIONS'
    })
  },
  components: {
    LeftSidebar,
    LoadingScreen
  }
}
</script>

<style>
body .modal {
	z-index: 100;
}

svg {
  max-width: 100%;
  max-height: 100%;
  fill: black;
}

.app-bg {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: #292e33;
	z-index: 10000;
}
.page-header.navbar .page-logo .logo-default.logo-unoapp {
	width: auto;
	max-width: 125px;
	height: auto;
	display: block;
	margin: 9px 0px 0px;
}
.page-sidebar .page-sidebar-menu li.open > .sub-menu {
	display: block;
}
.center {
	text-align: center;
}
.form-body {
	margin-top: 20px;
}
body .swal2-container {
	z-index: 10050;
}
.swal2-modal .swal2-confirm:focus {
	outline: none;
}
.location-panel .logo-container {
	width: 48px;
	height: 100%;
	display: inline-block;
}
.location-panel .location-name-container {
	display: inline-block;
	margin-right: 8px;
}
.location-panel .logo-container .business-logo {
	height: 38px;
	border-radius: 50%;
	position: absolute;
	top: 6px;
	left: 0;
	margin: 0px 8px;
}
.location-panel .location-name-container .business-name,
.location-panel .location-name-container .business-location-name {
	color: #c6cfda;
	width: auto;
	max-width: 155px;
	display: block;
	font-size: 11px;
	font-weight: 300;
	word-break: break-word;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
.location-panel .location-name-container .business-name.big {
	font-size: 13px;
	line-height: 41px;
}
.location-panel .location-name-container .business-location-name {
	font-size: 13px;
}
.page-quick-sidebar {
	margin-top: 50px;
}
.page-quick-sidebar-wrapper
	.page-quick-sidebar
	.page-quick-sidebar-chat
	.page-quick-sidebar-chat-users
	.media-list
	.media.selected-location {
	background-color: rgba(55, 183, 217, 0.3);
}
.page-quick-sidebar-wrapper
	.page-quick-sidebar
	.page-quick-sidebar-chat
	.page-quick-sidebar-chat-users
	.media-list
	.media.selected-location:hover {
	background-color: rgba(55, 183, 217, 0.5);
}
.page-quick-sidebar-wrapper
	.page-quick-sidebar
	.page-quick-sidebar-chat
	.page-quick-sidebar-chat-users
	.media-list
	.media.current-location:hover {
	cursor: default;
}
.deactivate-location-dot-top {
	transition: opacity 0.2s ease-in;
	opacity: 0;
}
.page-quick-sidebar-wrapper
	.page-quick-sidebar
	.page-quick-sidebar-chat
	.page-quick-sidebar-chat-users
	.media-list
	.media.selected-location:hover
	.deactivate-location-dot-top {
	opacity: 1;
	cursor: pointer;
}
.page-quick-sidebar-wrapper
	.page-quick-sidebar
	.list-heading.location-panel-heading {
	color: rgba(55, 183, 217, 0.5);
	font-size: 18px;
	text-transform: uppercase;
}
.page-header
	.top-menu
	.dropdown-quick-sidebar-toggler
	> .dropdown-toggle.location-panel {
	padding: 5px 0px !important;
	height: 50px;
	width: 120px;
}
.page-header
	.top-menu
	.dropdown-quick-sidebar-toggler
	> .dropdown-toggle.location-panel.width-auto {
	width: auto;
	max-width: 220px;
}
.page-quick-sidebar-wrapper .page-quick-sidebar-toggler {
	position: absolute;
}
.page-quick-sidebar-open .page-quick-sidebar-toggler > span {
	color: #99a8b5;
	font-size: 20px;
}
.page-quick-sidebar-toggler > span:hover {
	color: #fff !important;
}
a.panel-link {
	color: #99a8b5;
	text-decoration: underline;
}
a.panel-link:hover {
	color: #fff !important;
}
.scrollable {
	height: calc(100vh - 400px);
	overflow-y: auto;
	overflow-x: hidden;
}
.scrollable-select-location {
	height: calc(100vh - 295px);
	overflow-y: auto;
	overflow-x: hidden;
}
div.tab-pane::-webkit-scrollbar {
	background-color: transparent;
	width: 7px;
}
div.tab-pane::-webkit-scrollbar-thumb {
	background-color: #99a8b5;
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
div.tab-pane::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	border-radius: 10px;
}
.col-sm-3.no-padding,
.col-sm-8.no-padding {
	padding: 0;
	margin-left: 5px;
}
.page-quick-sidebar-wrapper
	.page-quick-sidebar
	.page-quick-sidebar-chat
	.page-quick-sidebar-chat-users.active-business {
	padding-top: 0px;
}
.page-quick-sidebar-wrapper
	.page-quick-sidebar
	.page-quick-sidebar-chat
	.page-quick-sidebar-chat-users
	.media-list
	.media
	.media-body
	.media-heading-sub {
	margin-top: 5px;
}
.padding-box {
	padding: 10px;
}
#location_search {
	color: #99a8b5;
}
.blue {
	color: rgba(55, 183, 217, 0.5);
}
.form-group.form-md-line-input .form-control.input-sm.padding-right-20 {
	padding-right: 20px;
}
.clear-icon {
	position: absolute;
	right: 0;
	top: 30px;
	color: #32c5d2;
	cursor: pointer;
}
.page-header.navbar .top-menu .navbar-nav > li.dropdown.width-auto {
	width: auto;
	max-width: 220px;
}
.pagination-wrapper {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}
.pagination-arrow {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 2.5em;
	width: 2.5em;
	border-radius: 50%;
	background-color: #ddd;
	color: #666;
	font-size: 1em;
	cursor: pointer;
}
.pagination-arrow:hover {
	background-color: #67809f;
	color: #fff;
}
.pagination-arrow.disabled {
	cursor: not-allowed;
}
.pagination-arrow.disabled:hover {
	background-color: #ddd;
	color: #666;
}
.active-location-dots {
	position: relative;
}
.active-location-dot {
	position: absolute;
	top: 0;
	left: -20px;
}
.deactivate-location-dot {
	position: absolute;
	top: 0;
	left: -20px;
	transition: opacity 0.3s ease-in;
	opacity: 0;
}
.deactivate-location-dot:hover {
	opacity: 1;
}
@media (min-width: 992px) {
	.page-sidebar-wrapper {
		position: fixed;
		height: calc(100vh - 35px);
		overflow: scroll;
	}
}
.page-header.navbar
	.top-menu
	.navbar-nav
	> li.dropdown
	> .dropdown-toggle.log-out-button:last-child {
	padding-right: 8px;
}
.fa.danger {
	color: rgba(201, 0, 0, 0.8);
}

/* Transitions */
.fade-enter {
	opacity: 0;
}
.fade-enter-active {
	transition: opacity 0.4s;
}
.fade-leave-active {
	transition: opacity 0.4s;
	opacity: 0;
}
.quick-fade-enter {
	opacity: 0;
}
.quick-fade-enter-active {
	transition: all 0.1s;
}
.quick-fade-leave-active {
	transition: all 0.1s;
	opacity: 0;
}
.page-header.navbar.master {
	background-color: palevioletred;
}
.page-header.navbar.staging {
	background-color: paleturquoise;
}

/* Atomic classes */
.three-vertical-actions {
  min-height: 124px;
}
.width-100 {
	width: 100%;
}
.height-100 {
	height: 100%;
}
.max-height-100 {
	max-height: 100%;
}
.min-height-100 {
	min-height: 100%;
}
.min-height-100px {
	min-height: 100px;
}

.display-flex {
	display: flex;
}
.flex-wrap-wrap {
	flex-wrap: wrap;
}
.flex-direction-column {
	flex-direction: column;
}
.flex-basis-48 {
	flex-basis: 48%;
}
.justify-content-center {
	justify-content: center;
}
.justify-content-space-between {
	justify-content: space-between;
}
.justify-content-flex-end {
	justify-content: flex-end;
}
.align-items-center {
	align-items: center;
}
.align-items-flex-end {
	align-items: flex-end;
}
.align-self-end {
	align-self: end;
}

.pa-1em {
	padding: 1em;
}
.pt-1em {
	padding-top: 1em;
}
.pl-5px {
	padding-left: 5px;
}
.pr-5px {
	padding-left: 5px;
}
.px-1em {
	padding-left: 1em;
	padding-right: 1em;
}
.py-1em {
	padding-top: 1em;
	padding-bottom: 1em;
}
.py-2em {
	padding-top: 2em;
	padding-bottom: 2em;
}

.my-0 {
	margin-top: 0;
	margin-bottom: 0;
}
.my-0em {
	margin-top: 0;
	margin-bottom: 0;
}
.ma-0 {
	margin-top: 0;
	margin-right: 0;
	margin-bottom: 0;
	margin-left: 0;
}
.ma-1em {
	margin: 1em;
}
.mx-1em {
	margin-left: 1em;
	margin-right: 1em;
}
.mb-0 {
	margin-bottom: 0;
}
.mb-5px {
	margin-bottom: 5px;
}
.mb-1em {
	margin-bottom: 1em;
}
.mb-2em {
	margin-bottom: 2em;
}
.mb-3em {
	margin-bottom: 3em;
}
.mt-1em {
	margin-top: 1em;
}
.ml-1em {
	margin-left: 1em;
}
.ml-5px {
	margin-left: 1em;
}
.mr-5px {
	margin-right: 5px;
}

.white-space-no-wrap {
	white-space: nowrap;
}

.position-relative {
	position: relative;
}
</style>
