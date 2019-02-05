<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Users
    </h1>
    <!-- END PAGE TITLE-->
    <div class="note note-info">
      <p>Search and view Application Users.</p>
    </div>

    <!-- SEARCH START -->
    <div class="margin-top-20">
      <div class="portlet box blue-hoki">
        <div
          class="portlet-title"
          @click="toggleSearchPanel()"
        >
          <div class="caption">
            <i class="fa fa-search" />
            Search Panel
          </div>
          <div class="tools">
            <a :class="{'expand': !searchCollapse, 'collapse': searchCollapse}" />
          </div>
        </div>
        <div
          class="portlet-body"
          :class="{'display-hide': searchCollapse}"
        >
          <form role="form">
            <div class="form-body">
              <div class="row">
                <div class="col-md-12">
                  <div
                    v-show="searchError"
                    ref="searchError"
                    class="alert alert-danger"
                  >
                    <button
                      class="close"
                      @click.stop.prevent="clearSearchError()"
                    />
                    <span>{{ searchError }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      v-model="search.first_name"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': search.first_name.length}"
                    >
                    <label for="search_options_search">
                      First name
                    </label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      v-model="search.last_name"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': search.last_name.length}"
                    >
                    <label for="search_options_search">
                      Last name
                    </label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      v-model="search.email"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': search.email.length}"
                    >
                    <label for="search_options_search">
                      Email
                    </label>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group form-md-line-input form-md-floating-label">
                    <input
                      v-model="search.phone"
                      type="text"
                      class="form-control input-sm"
                      :class="{'edited': search.phone.length}"
                    >
                    <label for="search_options_search">
                      Phone
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-actions right margin-top-20">
              <button
                type="button"
                class="btn btn-default"
                @click="resetSearch()"
              >
                Reset Search
              </button>
              <button
                type="button"
                class="btn blue"
                :disabled="searching"
                @click="searchUsers(1)"
              >
                Search
                <i
                  v-show="searching"
                  class="fa fa-spinner fa-pulse fa-fw"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- SEARCH END -->

    <div
      v-show="view === 'all'"
      class="margin-top-20"
    >
      <div class="relative-block">
        <div class="margin-top-30 search-content-4">
          <div class="row">
            <div class="col-md-12">
              <div
                v-show="listErrorMessage"
                ref="listErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  @click="clearError('listErrorMessage')"
                />
                <span>{{ listErrorMessage }}</span>
              </div>
            </div>
          </div>

          <loading-screen
            :show="loadingAll"
            :color="'#2C3E50'"
            :display="'inline'"
          />

          <no-results
            :show="!loadingAll && !users.length"
            :type="'users'"
          />

          <div
            v-show="!loadingAll && users.length"
            class="search-table table-responsive"
          >
            <div class="clearfix margin-bottom-10">
              <el-dropdown
                trigger="click"
                size="mini"
                :show-timeout="50"
                :hide-timeout="50"
                @command="updateSortByOrder"
              >
                <el-button size="mini">
                  Sort by
                  <span>
                    <i
                      v-if="sortBy.order === 'ASC'"
                      class="fa fa-sort-alpha-asc"
                    />
                    <i
                      v-if="sortBy.order === 'DESC'"
                      class="fa fa-sort-alpha-desc"
                    />
                  </span>
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="ASC">
                    <i class="fa fa-sort-alpha-asc" />
                  </el-dropdown-item>
                  <el-dropdown-item command="DESC">
                    <i class="fa fa-sort-alpha-desc" />
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <page-results
                class="pull-right"
                :total-results="totalResults"
                :active-page="activePage"
                @pageResults="resultsPerPageUpdate"
              />
            </div>

            <table class="table table-bordered table-striped table-condensed table-hover">
              <thead class="bg-blue-chambray">
                <tr>
                  <th />
                  <th>
                    <a class="no-click">
                      Name
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Email
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Phone
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      City
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Province
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Total orders
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Total spent
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Sign Up Date
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in users"
                  :key="user.id"
                  class="clickable"
                  @click="openUserProfile(user)"
                >
                  <td class="profile-image-table-row">
                    <div class="missing-profile-image">
                      <span v-if="user.first_name || user.last_name">
                        {{ user.first_name.toUpperCase().substring(0, 1) }}{{ user.last_name.toUpperCase().substring(0, 1) }}
                      </span>
                      <span v-else>
                        {{ user.email.toUpperCase().substring(0, 1) }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <h3 v-if="user.first_name.length && user.last_name.length">
                      {{ user.first_name }} {{ user.last_name }}
                    </h3>
                  </td>
                  <td> {{ user.email }} </td>
                  <td> {{ formatPhone(user.phone) }} </td>
                  <td> {{ user.city }} </td>
                  <td> {{ user.province }} </td>
                  <td> {{ user.total_orders }} </td>
                  <td> ${{ user.total_spent }} </td>
                  <td> {{ user.created_at.substring(0,10) }} </td>
                </tr>
              </tbody>
            </table>

            <div
              v-if="users.length && numPages > 1"
              class="clearfix"
            >
              <pagination
                :passed-page="activePage"
                :num-pages="numPages"
                @activePageChange="activePageUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="view === 'search'"
      class="margin-top-20"
    >
      <div class="relative-block">
        <loading-screen
          :show="loadingSearch"
          :color="'#2C3E50'"
          :display="'inline'"
        />

        <no-results
          :show="!loadingSearch && !searchResults.length"
          :type="'users'"
        />

        <div
          v-if="!loadingSearch && searchResults.length"
          class="margin-top-30 search-content-4"
        >
          <div class="clearfix margin-bottom-10">
            <el-dropdown
              trigger="click"
              size="mini"
              :show-timeout="50"
              :hide-timeout="50"
              @command="updateSortByOrder"
            >
              <el-button size="mini">
                Sort by
                <span>
                  <i
                    v-if="sortBy.order === 'ASC'"
                    class="fa fa-sort-alpha-asc"
                  />
                  <i
                    v-if="sortBy.order === 'DESC'"
                    class="fa fa-sort-alpha-desc"
                  />
                </span>
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="ASC">
                  <i class="fa fa-sort-alpha-asc" />
                </el-dropdown-item>
                <el-dropdown-item command="DESC">
                  <i class="fa fa-sort-alpha-desc" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <page-results
              class="pull-right"
              :total-results="totalResults"
              :active-page="searchActivePage"
              @pageResults="resultsPerPageUpdate"
            />
          </div>

          <div class="search-table table-responsive">
            <table class="table table-bordered table-striped table-condensed">
              <thead class="bg-blue-chambray">
                <tr>
                  <th />
                  <th>
                    <a class="no-click">
                      Name
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Email
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Phone
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      City
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Province
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Total orders
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Total spent
                    </a>
                  </th>
                  <th>
                    <a class="no-click">
                      Sign Up Date
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in searchResults"
                  :key="user.id"
                >
                  <td class="profile-image-table-row">
                    <div class="missing-profile-image">
                      <span v-if="user.first_name || user.last_name">
                        {{ user.first_name.toUpperCase().substring(0, 1) }}{{ user.last_name.toUpperCase().substring(0, 1) }}
                      </span>
                      <span v-else>
                        {{ user.email.toUpperCase().substring(0, 1) }}
                      </span>
                    </div>
                  </td>
                  <td
                    class="clickable"
                    @click="openUserProfile(user)"
                  >
                    <h3 v-if="user.first_name.length && user.last_name.length">
                      {{ user.first_name }} {{ user.last_name }}
                    </h3>
                  </td>
                  <td> {{ user.email }} </td>
                  <td> {{ formatPhone(user.phone) }} </td>
                  <td> {{ user.city }} </td>
                  <td> {{ user.province }} </td>
                  <td> {{ user.total_orders }} </td>
                  <td> ${{ user.total_spent }} </td>
                  <td> {{ user.created_at.substring(0,10) }} </td>
                </tr>
              </tbody>
            </table>

            <div
              v-if="searchResults.length && searchNumPages > 1"
              class="clearfix"
            >
              <pagination
                :passed-page="searchActivePage"
                :num-pages="searchNumPages"
                @activePageChange="activeSearchPageUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import PageResults from '../../modules/PageResults'
import Pagination from '../../modules/Pagination'
import NoResults from '../../modules/NoResults'
import Dropdown from '../../modules/Dropdown'
import Modal from '../../modules/Modal'
import UsersFunctions from '../../../controllers/Users'
import LoadingScreen from '../../modules/LoadingScreen'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Breadcrumb,
    PageResults,
    Pagination,
    Dropdown,
    Modal,
    NoResults,
    LoadingScreen
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Users Manager', link: false },
        { name: 'Users', link: false }
      ],
      view: 'all',
      loadingAll: false,
      listErrorMessage: '',
      users: [],
      searchCollapse: true,
      search: {
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
      },
      searchError: '',
      searchResults: [],
      resultsPerPage: 50,
      totalResults: 0,
      sortBy: {
        order: 'ASC'
      },
      activePage: 1,
      numPages: 1,
      searchActivePage: 1,
      searchNumPages: 1,
      loadingSearch: false,
      searching: false
    }
  },
  watch: {
    activePage () {
      this.getUsers()
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    /**
		 * To clear an error.
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
    clearError (name) {
      this[name] = ''
    },
    /**
		 * To format a phone number
		 * @function
		 * @param {string} phone - The phone number to format
		 * @returns {string} The formatted phone string
		 */
    formatPhone (phone) {
      try {
        let digits = phone.replace(/\D/g, '')
        return (
          digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
        )
      } catch (err) {
        return '--'
      }
    },
    /**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
    updateSortByOrder (value) {
      this.sortBy.order = value
      this.searchResults.length
        ? this.activeSearchPageUpdate(1)
        : this.activePageUpdate(1)
    },
    /**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
    resultsPerPageUpdate (val) {
      if (parseInt(this.resultsPerPage) !== parseInt(val)) {
        this.resultsPerPage = val
        this.searchResults.length
          ? this.activeSearchPageUpdate(1)
          : this.activePageUpdate(1)
      }
    },
    /**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
    activePageUpdate (val) {
      if (parseInt(this.activePage) !== parseInt(val)) {
        this.activePage = val
        this.getUsers()
      } else {
        this.getUsers()
      }
    },
    /**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
    activeSearchPageUpdate (val) {
      if (parseInt(this.searchActivePage) !== parseInt(val)) {
        this.searchActivePage = val
        this.searchUsers()
      } else {
        this.searchUsers()
      }
    },
    /**
		 * To toggle the search panel
		 * @function
		 * @returns {undefined}
		 */
    toggleSearchPanel () {
      this.searchCollapse = !this.searchCollapse
    },
    /**
		 * To clear the current search error.
		 * @function
		 * @returns {undefined}
		 */
    clearSearchError () {
      this.searchError = ''
    },
    /**
		 * To clear the current search criteria.
		 * @function
		 * @returns {undefined}
		 */
    resetSearch () {
      this.toggleSearchPanel()

      if (this.view !== 'all') {
        this.view = 'all'
        this.getUsers()
        this.search = {
          first_name: '',
          last_name: '',
          email: '',
          phone: ''
        }
        this.searchResults = []
        this.searchActivePage = 1
      }
    },
    /**
		 * To navigate to the profile page of a user.
		 * @function
		 * @param {object} user - The selected user.
		 * @returns {undefined}
		 */
    openUserProfile (user) {
      this.$router.push({
        name: 'UserProfile',
        params: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`
        }
      })
    },
    /**
		 * To get a list of users.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getUsers () {
      this.loadingAll = true
      var usersVue = this
      let paginationPreferences = {
        page: this.activePage,
        order: this.sortBy.order,
        per_page: this.resultsPerPage
      }
      UsersFunctions.getUsers(
        usersVue.$root.appId,
        usersVue.$root.appSecret,
        usersVue.$root.userToken,
        paginationPreferences
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            usersVue.numPages = response.payload.last_page
            usersVue.totalResults = response.payload.total
            usersVue.users = response.payload.data
            window.scrollTo(0, 0)
            usersVue.loadingAll = false
          } else {
            usersVue.loadingAll = false
          }
        })
        .catch(reason => {
          usersVue.loadingAll = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch users',
            errorName: 'listErrorMessage',
            vue: usersVue
          })
        })
    },
    /**
		 * To check if the search data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateSearchData () {
      var userListVue = this
      return new Promise(function (resolve, reject) {
        if (
          !userListVue.search.first_name &&
					!userListVue.search.last_name &&
					!userListVue.search.email &&
					!userListVue.search.phone
        ) {
          reject('Enter at least one search term')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To call the endpoint to create a new location group.
		 * @function
		 * @param {integer} page - Integer for search page
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    searchUsers (page) {
      var userListVue = this
      userListVue.clearSearchError()
      return userListVue
        .validateSearchData()
        .then(response => {
          if (page !== undefined) {
            userListVue.searching = true
          }
          userListVue.view = 'search'
          userListVue.loadingSearch = true
          let searchParams = {}
          searchParams.first_name = this.search.first_name
          searchParams.last_name = this.search.last_name
          searchParams.email = this.search.email
          searchParams.phone = this.search.phone
          searchParams.order = this.sortBy.order
          searchParams.per_page = this.resultsPerPage
          searchParams.page = page === undefined ? this.searchActivePage : page

          UsersFunctions.searchUsers(
            userListVue.$root.appId,
            userListVue.$root.appSecret,
            userListVue.$root.userToken,
            searchParams
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                if (response.payload.data.length === 0) {
                  userListVue.searchError = 'No results found'
                  userListVue.searchNumPages = 1
                  userListVue.totalResults = 0
                } else {
                  if (page !== undefined) {
                    userListVue.searchActivePage = page
                  }
                  userListVue.searchNumPages = response.payload.last_page
                  userListVue.totalResults = response.payload.total
                }
                userListVue.searchResults = response.payload.data
                window.scrollTo(0, 0)
              } else {
                userListVue.searchError = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not fetch users',
                errorName: 'searchError',
                vue: userListVue
              })
            })
            .finally(() => {
              userListVue.loadingSearch = false
              userListVue.searching = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          userListVue.searchError = reason
          window.scrollTo(0, 0)
          throw reason
        })
    }
  }
}
</script>
<style>
.search-content-4 .search-table td.profile-image-table-row {
  width: 75px;
  padding-right: 15px;
  padding-left: 15px;
}
.missing-profile-image {
  position: relative;
  display: inline-block;
  color: #fff;
  background-color: rgba(44, 62, 80, 0.5);
  width: 100%;
  height: 0;
  padding-right: 50px;
  padding: 50% 0;
  border-radius: 50%;
  text-align: center;
  font-size: 15px;
  line-height: 0;
}
</style>
