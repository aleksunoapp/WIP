<template>
  <div class="container">
    <div
      class="header"
    >
      <div
        v-show="!loading && stores.length"
        class="display-flex flex-basis-033"
      >
        <div class="display-flex align-items-center">
          <div
            v-if="multiple"
            class="md-checkbox has-success"
          >
            <input
              id="all"
              v-model="allSelected"
              type="checkbox"
              :disabled="!editable"
              class="md-check"
            >
            <label for="all">
              <span class="inc" />
              <span class="check" />
              <span class="box" />
            </label>
          </div>
          <p class="my-0">
            <strong>Name</strong>
            <i 
              :class="{
                'fa fa-arrow-up' : sortBy('display_name') === true,
                'fa fa-arrow-down' : sortBy('display_name') === false
              }"
              @click="resort('display_name')"
            />
          </p>
        </div>
      </div>
      <div
        v-show="!loading && stores.length"
        class="display-flex flex-basis-033 align-items-center"
      >
        <p class="my-0">
          <strong>Address</strong>
          <i 
            :class="{
              'fa fa-arrow-up' : sortBy('address') === true,
              'fa fa-arrow-down' : sortBy('address') === false
            }"
            @click="resort('address')"
          />
        </p>
      </div>
      <div
        v-show="!loading && stores.length"
        class="display-flex flex-basis-033 align-items-center"
      >
        <p class="my-0">
          <strong>ID</strong>
          <i 
            :class="{
              'fa fa-arrow-up' : sortBy('internal_id') === true,
              'fa fa-arrow-down' : sortBy('internal_id') === false
            }"
            @click="resort('internal_id')"
          />
        </p>
      </div>
    </div>
    <div class="list">
      <div
        v-show="loading"
        class="height-100 display-flex justify-content-center align-items-center"
      >
        <loading-screen :show="loading" />
      </div>
      <div
        v-show="!loading && displayedStores.length === 0"
        class="height-100 display-flex justify-content-center align-items-center"
      >
        <no-results
          :show="displayedStores.length === 0 && !loading"
          :custom="true"
          :text="noResults"
        />
      </div>
      <template
        v-show="displayedStores.length"
      >
        <div
          v-for="store in displayedStores"
          :key="store.id"
          class="store"
        >
          <div class="display-flex flex-basis-033">
            <div class="display-flex align-items-center">
              <div
                v-if="multiple"
                class="md-checkbox has-success"
              >
                <input
                  :id="`store-${store.id}${_uid}`"
                  v-model="store.selected"
                  type="checkbox"
                  :disabled="!editable"
                  name="id"
                  class="md-check"
                  @change="toggle()"
                >
                <label :for="`store-${store.id}${_uid}`">
                  <span class="inc" />
                  <span class="check" />
                  <span class="box" />
                </label>
              </div>
              <div 
                v-else
                class="md-radio"
              >
                <input
                  :id="`store-${store.id}${_uid}`"
                  v-model="single"
                  type="radio"
                  name="id"
                  :disabled="!editable"
                  class="md-radiobtn"
                  :value="store.id"
                  @change="toggle()"
                >
                <label :for="`store-${store.id}${_uid}`">
                  <span class="inc" />
                  <span class="check" />
                  <span class="box" />
                </label>
              </div>
              <p class="break my-0 pr-5px">
                {{ store.display_name }} {{ store.is_corporate ? '(corporate)' : '' }}
              </p>
            </div>
          </div>
          <div class="display-flex flex-basis-033 align-items-center">
            <p class="break my-0 pr-5px">
              {{ `${store.city}, ${store.province}` }}
            </p>
          </div>
          <div class="display-flex flex-basis-033 align-items-center">
            <p class="break my-0 pr-5px">
              {{ store.internal_id }}
            </p>
          </div>
        </div>
      </template>
    </div>
    <div
      v-show="errorMessage"
      ref="errorMessage"
      class="alert alert-danger mt-1em"
    >
      <span>{{ errorMessage }}</span>
      <i 
        class="fa fa-repeat"
        aria-hidden="true"
        @click="getAllStores()"
      />

      <button
        class="close"
        @click="clearError('errorMessage')"
      />
    </div>
    <div
      v-show="!errorMessage"
      class="options"
    >
      <div 
        v-show="stores.length"
        class="display-flex justify-content-space-between align-items-center pt-1em"
      >
        <div class="display-flex align-items-center width-100">
          <el-input
            v-model="searchTerm"
            class="search__input"
            size="small"
            clearable
            placeholder="Search"
          />
          <div
            class="display-flex align-items-center width-100"
          >
            <el-select
              v-model="selectedGroups"
              class="width-100 pl-5px"
              multiple
              collapse-tags
              placeholder="Group"
              size="small"
            >
              <el-option
                v-for="group in groups"
                :key="group.id"
                :label="group.name"
                :value="group.id"
              />
            </el-select>
            <div class="display-flex flex-direction-column">
              <el-checkbox
                v-model="filter.corporate"
                class="pl-5px mb-0"
                @change="page = 1"
              >
                Corporate
              </el-checkbox>
              <span />
              <el-checkbox
                v-model="filter.selected"
                class="pl-5px ma-0"
                @change="page = 1"
              >
                Selected
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
      <div 
        v-show="stores.length"
        class="display-flex justify-content-space-between align-items-center pt-1em"
      >
        <page-results
          v-show="stores.length"
          class="pull-right"
          :total-results="filteredStores.length"
          :active-page="page"
          @pageResults="setPageSize"
        />
        <pagination
          :passed-page="page"
          :num-pages="lastPage"
          @activePageChange="setPage"
        />
        <p
          v-show="stores.length"
          class="selected__counter my-0"
        >
          {{ this.selected.length }} selected
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import ajaxErrorHandler from '@/controllers/ErrorController'
import AppFunctions from '@/controllers/App'
import StoreGroupsFunctions from '@/controllers/StoreGroups'
import LoadingScreen from '@/components/modules/LoadingScreen'
import NoResults from '@/components/modules/NoResults'
import PageResults from '@/components/modules/PageResults'
import Pagination from '@/components/modules/Pagination-1.1'

export default {
	components: {
		LoadingScreen,
		NoResults,
		PageResults,
		Pagination
	},
	props: {
		exclude: {
			default: () => []
		},
		previouslySelected: {
			default: () => []
		},
		locations: {
			default: () => null
		},
		multiple: {
			default: () => true
		},
		editable: {
			default: () => true
		}
	},
	data: () => ({
		errorMessage: '',
		noResults: 'No matches',
		loading: false,
		previous: [],
		groups: [],
		selectedGroups: [],
		stores: [],
		searchTerm: '',
		pageSize: 25,
		page: 1,
		sort: [
			{
				field: 'internal_id',
				ascending: true
			},
			{
				field: 'address',
				ascending: true
			},
			{
				field: 'display_name',
				ascending: true
			}
		],
		filter: {
			selected: false,
			corporate: false
		},
		single: null
	}),
	computed: {
		allSelected: {
			get () {
				return this.filteredStores.length && !this.filteredStores.some(store => !store.selected)
			},
			set (value) {
				this.filteredStores.forEach(store => {
					store.selected = value
				})
				if (!value) { this.filter.selected = false }
			}
		},
		lastPage () {
			return Math.ceil(this.filteredStores.length / this.pageSize)
		},
		selectedGroupStores () {
			if (this.selectedGroups.length) {
				let all = []
				this.groups.forEach(group => {
					if (this.selectedGroups.includes(group.id)) {
						all = all.concat(group.locations)
					}
				})
				return all
			} else {
				return []
			}
		},
		unexcludedStores () {
			if (this.exclude.length) {
				return this.stores
					.filter(
						store => !this.exclude.includes(store.id)
					)
			} else {
				return this.stores
			}
		},
		filteredStores () {
			return this.unexcludedStores
				.filter(
					store => {
						if (this.selectedGroupStores.length) {
							return this.selectedGroupStores.includes(store.id)
						} else {
							return true
						}
					}
				)
				.filter(
					store => {
						if (this.searchTerm) {
							const searchArea = `${store.display_name} ${store.internal_id}`
							return searchArea.toLowerCase().includes(this.searchTerm.toLowerCase())
						} else return true
					}
				)
				.filter(
					store => {
						if (this.filter.selected) {
							if (this.multiple) {
								return store.selected
							} else {
								return this.single === store.id
							}
						} else return true
					}
				)
				.filter(
					store => {
						if (this.filter.corporate) {
							return store.is_corporate === 1
						} else return true
					}
				)
		},
		sortedStores () {
			let sorted = [...this.filteredStores]
			for (let step of this.sort) {
				let field = step.field
				let ascending = step.ascending
				sorted.sort(this.compareValues(field, ascending).bind(this))
			}
			return sorted
		},
		displayedStores () {
			return this.sortedStores
				.filter(
					(store, index) => {
						const from = (this.page - 1) * this.pageSize
						const to = this.page * this.pageSize
						return (index >= from) && (index <= to)
					}
				)
		},
		selected () {
			return this.stores.filter(store => {
				return this.multiple ? store.selected : store.id === this.single
			})
		}
	},
	created () {
		this.getGroups()
		if (this.locations === null) {
			this.getAllStores()
		}
		if (this.previouslySelected.length) {
			this.previous = [...this.previouslySelected]
			if (this.multiple) {
				if (this.locations) {
					this.stores = [
						...this.locations.map(location => (
							{
								...location,
								selected: this.previous.includes(location.id)
							}
						))
					]
				}
			} else {
				this.single = this.previouslySelected[0]
			}
		}
	},
	methods: {
		getAllStores () {
			this.loading = true
			return AppFunctions.getPaginatedStoreLocations()
				.then(response => {
					if (response.payload && response.payload.length) {
						if (this.multiple) {
							this.stores = response.payload
								.map(location => (
									{
										...location,
										selected: this.previous.includes(location.id)
									}
								))
						} else {
							this.stores = response.payload
							this.single = this.previouslySelected[0]
						}
					} else {
						this.noResults = 'You don\'t have any stores yet'
					}
				})
				.catch(reason => {
					this.noResults = ''
					ajaxErrorHandler({
						reason,
						errorText: 'We couldn\'t fetch stores.',
						errorName: 'errorMessage',
						vue: this
					})
				})
				.finally(() => {
					this.loading = false
				})
		},
		getGroups () {
			StoreGroupsFunctions.getGroups()
				.then(response => {
					response.payload.forEach(group => this.getGroupLocations(group))
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch store groups',
						errorName: 'errorMessage',
						vue: this
					})
				})
		},
		/**
		 * To get the details of the selected group.
		 * @function
		 * @param {number} group - Group to get locations for
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGroupLocations (group) {
			var selectLocationsVue = this

			StoreGroupsFunctions.getGroupLocations(group.id)
				.then(response => {
					this.groups.push({
						...response.payload,
						locations: response.payload.locations.map(location => location.id)
					})
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
		sortBy (field) {
			return this.sort.find(key => key.field === field).ascending
		},
		addKey (store, name, component1, component2) {
			try {
				return {...store, [name]: `${store[component1]} ${store[component2]}`}
			} catch (e) {
				return
			}
		},
		compareValues (key, ascending) {
			return function (a, b) {
				if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
					a = this.addKey(a, 'address', 'city', 'province')
					b = this.addKey(b, 'address', 'city', 'province')
				}

				if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
					return 0
				}

				const varA = (typeof a[key] === 'string')
					? a[key].toUpperCase() : a[key]
				const varB = (typeof b[key] === 'string')
					? b[key].toUpperCase() : b[key]

				let comparison = 0
				if (varA > varB) {
					comparison = 1
				} else if (varA < varB) {
					comparison = -1
				}
				return (
					(!ascending) ? (comparison * -1) : comparison
				)
			}
		},
		resort (field) {
			let index = this.sort.findIndex(key => key.field === field)
			let patch = !this.sort[index].ascending
			this.sort.splice(index, 1)
			this.sort.push({field: field, ascending: patch})
		},
		setPageSize (value) {
			if (this.page !== value) {
				this.pageSize = value
				this.setPage(1)
			}
		},
		setPage (page) {
			this.page = page
		},
		toggleSelectedFilter () {
			this.filter.selected = !this.filter.selected
		},
		toggle () {
			this.$emit('update', this.multiple ? this.selected.map(store => store.id) : this.single)
		},
		clearError (name) {
			this[name] = ''
		}
	}
}
</script>
<style scoped>
.container {
	width: 100%;
	height: 500px;
	max-height: 100%;
	max-width: 100%;
	padding: 0;
}
.header {
	min-height: 2em;
	display: flex;
	width: 100%;
}
.list {
	height: 100%;
	max-height: calc(100% - 9em);
	overflow-y: auto;
	overflow-x: hidden;
	box-shadow: inset  0  5px 5px -5px grey, 
							inset  0 -5px 5px -5px grey;
}
.list::-webkit-scrollbar {
	width: 5px;
}
 
.list::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
 
.list::-webkit-scrollbar-thumb {
	background-color: darkgrey;
	outline: 1px solid slategrey;
}
.store {
	display: flex;
	padding: 0.5em 0;
}
.options {
	min-height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end; 
}
.search__input {
	max-width: 300px;
}
.selected__counter {
	border: 1px #fff solid;
	background-color: #fff;
	min-width: 120px;
}
.flex-basis-025 {
	width: 25%;
}
.flex-basis-033 {
	width: 33.33%;
}
.break {
	overflow-wrap: break-word;
	max-width: 100%;
}
</style>
