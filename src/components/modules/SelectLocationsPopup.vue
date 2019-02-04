<template>
  <div class="select-locations-popup-container">
    <div class="row">
      <div class="col-xs-12">
        <div
          v-show="errorMessage"
          ref="errorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click="clearError()"
          />
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-6">
        <el-dropdown
          trigger="click"
          size="mini"
          :show-timeout="50"
          :hide-timeout="50"
          @command="selectGroup"
        >
          <el-button size="mini">
            {{ selectedGroup.name || 'All stores' }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{}">
              All stores
            </el-dropdown-item>
            <el-dropdown-item
              v-for="group in groups"
              :key="group.id"
              :command="group"
            >
              {{ group.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="col-xs-6">
        <div class="form-group form-md-line-input form-md-floating-label form-md-line-input-trimmed">
          <div class="input-icon right">
            <input
              id="search_locations"
              v-model="searchTerm"
              type="text"
              placeholder="Search Stores"
              class="form-control input-sm"
              :class="{'edited': searchTerm.length}"
            >
            <i
              class="fa fa-times-circle-o clickable"
              aria-hidden="true"
              @click.prevent="resetSearch()"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="margin-top-15 locations-container">
      <table class="table">
        <thead>
          <tr>
            <th>
              <div class="md-checkbox has-success">
                <input
                  id="locations-selectAll"
                  v-model="selectAllSelected"
                  type="checkbox"
                  class="md-check"
                  :disabled="!editable"
                  @change="selectAll()"
                >
                <label for="locations-selectAll">
                  <span class="inc" />
                  <span class="check" />
                  <span class="box" />
                </label>
              </div>
            </th>
            <th> Store Name </th>
            <th> Street Address </th>
            <th> City, Province, Country </th>
          </tr>
        </thead>
        <tbody v-show="!loading">
          <tr
            v-for="store in searchResults"
            :key="store.id"
          >
            <td>
              <div class="md-checkbox has-success">
                <input
                  :id="`store-${store.id}`"
                  v-model="store.selected"
                  type="checkbox"
                  class="md-check"
                  :disabled="!editable"
                  @change="syncSelectAll(store.selected)"
                >
                <label :for="`store-${store.id}`">
                  <span class="inc" />
                  <span class="check" />
                  <span class="box" />
                </label>
              </div>
            </td>
            <td> {{ store.display_name }} </td>
            <td> {{ store.address_line_1 }} </td>
            <td> {{ store.city }}, {{ store.province }}, {{ store.country }} </td>
          </tr>
        </tbody>
      </table>

      <loading-screen :show="loading" />
    </div>
    <div
      v-show="withButton"
      class="clear"
    >
      <button
        type="button"
        class="pull-right margin-top-15 btn btn-primary"
        @click="selectLocations()"
      >
        {{ editable ? 'Select' : 'Close' }}
      </button>
    </div>
  </div>
</template>

<script>
import Dropdown from './Dropdown'
import StoreGroupsFunctions from '../../controllers/StoreGroups'
import App from '../../controllers/App'
import LoadingScreen from '@/components/modules/LoadingScreen'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	components: {
		Dropdown,
		LoadingScreen
	},
	props: {
		previouslySelected: {
			type: Array,
			default: () => [],
			required: false
		},
		withButton: {
			type: Boolean,
			default: true,
			required: false
		},
		exclude: {
			type: Array,
			default: () => [],
			required: false
		},
		editable: {
			type: Boolean,
			required: false,
			default: () => true
		}
	},
	data () {
		return {
			locations: [],
			loading: false,
			groups: [],
			selectedGroup: {},
			selectAllSelected: false,
			selectedLocations: [],
			errorMessage: '',
			searchTerm: ''
		}
	},
	computed: {
		searchResults () {
			if (this.searchTerm.length) {
				return this.locations.filter(location => {
					let searchIn =
						location.display_name +
						location.address_line_1 +
						location.city +
						location.province +
						location.country
					return searchIn.toLowerCase().includes(this.searchTerm.toLowerCase())
				})
			} else {
				return this.locations
			}
		}
	},
	mounted () {
		this.getGroups()
		this.getPaginatedStoreLocations()
		if (!this.withButton) {
			this.$emit('selectedLocations', [...this.previouslySelected])
		}
	},
	methods: {
		/**
		 * To clear the search term
		 * @function
		 * @returns {undefined}
		 */
		resetSearch () {
			this.searchTerm = ''
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To add the selected locations to the selected locations array
		 * @function
		 * @returns {undefined}
		 */
		selectLocations () {
			this.locations.forEach(location => {
				if (location.selected) {
					this.selectedLocations.push(location.id)
				}
			})
			this.$emit('closeSelectLocationsPopup', this.selectedLocations)
		},
		/**
		 * To select or deselect all stores
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			for (var i = 0; i < this.searchResults.length; i++) {
				this.searchResults[i].selected = this.selectAllSelected
			}
			let payload = []
			this.locations.forEach(location => {
				if (location.selected) {
					payload.push(location.id)
				}
			})
			this.$emit('selectedLocations', payload)
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
		syncSelectAll (value) {
			let payload = []
			this.locations.forEach(location => {
				if (location.selected) {
					payload.push(location.id)
				}
			})
			if (payload.length === this.locations.length) {
				this.selectAllSelected = true
			} else {
				this.selectAllSelected = false
			}
			if (!this.withButton) {
				this.$emit('selectedLocations', payload)
			}
		},
		/**
		 * To get a list of location for the current application/business.
		 * @function
		 * @param {object} group - The object containing details of the selected store group
		 * @returns {undefined}
		 */
		selectGroup (group) {
			this.selectedGroup = group
			if (group.name) {
				this.getGroupLocations()
			} else {
				this.getPaginatedStoreLocations()
			}
		},
		/**
		 * To get a list of location for the current application/business.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPaginatedStoreLocations () {
			this.loading = true
			var selectLocationsVue = this

			App.getPaginatedStoreLocations(
				selectLocationsVue.$root.appId,
				selectLocationsVue.$root.appSecret,
				selectLocationsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						let all = true
						response.payload.forEach(store => {
							if (!selectLocationsVue.previouslySelected.includes(store.id)) {
								all = false
							}
							selectLocationsVue.previouslySelected.forEach(previous => {
								if (store.id === previous) {
									store.selected = true
								} else if (store.selected !== true) {
									store.selected = false
								}
							})
						})
						selectLocationsVue.selectAllSelected = all
						selectLocationsVue.locations = response.payload.filter(
							location => !selectLocationsVue.exclude.includes(location.id)
						)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch stores',
						errorName: 'errorMessage',
						vue: selectLocationsVue
					})
				})
				.finally(() => {
					selectLocationsVue.loading = false
				})
		},
		/**
		 * To get the details of the selected group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroupLocations () {
			var selectLocationsVue = this

			StoreGroupsFunctions.getGroupLocations(
				selectLocationsVue.selectedGroup.id,
				selectLocationsVue.$root.appId,
				selectLocationsVue.$root.appSecret,
				selectLocationsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						let all = true
						response.payload.locations.forEach(store => {
							if (!selectLocationsVue.previouslySelected.includes(store.id)) {
								all = false
							}
							selectLocationsVue.previouslySelected.forEach(previous => {
								if (store.id === previous) {
									store.selected = true
								} else if (store.selected !== true) {
									store.selected = false
								}
							})
						})
						selectLocationsVue.selectAllSelected = all
						selectLocationsVue.locations = response.payload.locations.filter(
							location => !selectLocationsVue.exclude.includes(location.id)
						)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch group info',
						errorName: 'errorMessage',
						vue: selectLocationsVue
					})
				})
		},
		/**
		 * To get the details of the selected group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroups () {
			var selectLocationsVue = this

			StoreGroupsFunctions.getGroups(
				selectLocationsVue.$root.appId,
				selectLocationsVue.$root.appSecret,
				selectLocationsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						selectLocationsVue.groups = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch store groups',
						errorName: 'errorMessage',
						vue: selectLocationsVue
					})
				})
		}
	}
}
</script>

<style scoped>
.select-locations-popup-container {
  min-height: 200px;
  max-height: calc(100vh - 60px);
  overflow-x: hidden;
  overflow-y: auto;
}
.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
.locations-container {
  min-height: 200px;
  max-height: calc(100vh - 400px);
  overflow-x: hidden;
  overflow-y: auto;
}
.form-md-line-input-trimmed {
  padding-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>
