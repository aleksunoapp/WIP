<template>
	<div>
		<small v-if="totalResults && activePage"><b>{{pageStart}}</b> - <b>{{pageEnd}}</b> of <b>{{ totalResults }}</b> results</small>
		<b class="margin-left-5 margin-right-5">|</b>
		<small>Show</small>
		<el-dropdown trigger="click" @command="updateResultsPerPage" size="mini" :show-timeout="50" :hide-timeout="50">
			<el-button size="mini">
				{{ resultsPerPage }}
				<i class="el-icon-arrow-down el-icon--right"></i>
			</el-button>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item :command="25">25</el-dropdown-item>
				<el-dropdown-item :command="50">50</el-dropdown-item>
				<el-dropdown-item :command="100">100</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<small>Results Per Page</small>
	</div>
</template>

<script>
import Dropdown from './Dropdown'

/**
 * @module Page Results
 */

/** Create a variable that will hold the default number of results. */
var defaultResults = 25
export default {
	name: 'page-results',
	props: {
		// Total number of items to display
		totalResults: {
			default: 0
		},
		// Number of the page currently being displayed
		activePage: {
			default: 1
		}
	},
	data () {
		return {
			resultsPerPage: defaultResults
		}
	},
	/**
	 * Run on `created` to retrieve the users preference from localStorage or to set it as the default value. Also let the parent know that the results have been set.
	 * @function
	 * @returns {undefined}
	 */
	created () {
		if (this.checkLocalStorage()) {
			this.resultsPerPage = parseInt(this.checkLocalStorage())
		} else {
			this.setLocalStorage(defaultResults)
		}
		this.emitResults()
	},
	computed: {
		/**
		 * Computed to determine the start point for the current page that is displaying.
		 * @function
		 * @returns {integer} - An integer representing the start point for the current page.
		 */
		pageStart () {
			var localPageStart = 0
			if (this.activePage) {
				localPageStart = (this.activePage - 1) * this.resultsPerPage + 1
			}
			return localPageStart
		},
		/**
		 * Computed to determine the end point for the current page that is displaying.
		 * @function
		 * @returns {integer} - An integer representing the end point for the current page.
		 */
		pageEnd () {
			var localPageEnd = 0
			if (this.activePage) {
				localPageEnd = this.activePage * this.resultsPerPage
			}
			if (localPageEnd > this.totalResults) {
				localPageEnd = this.totalResults
			}
			return localPageEnd
		}
	},
	methods: {
		/**
		 * To check localStorage to see if the user has set a preference.
		 * @function
		 * @returns {integer} - An integer that indicates the number of results the user has set as their preference or 0 to indicate that the preference is not set.
		 */
		checkLocalStorage () {
			/* eslint-disable no-undef */
			if (localStorage.getItem('pageResults')) {
				return localStorage.getItem('pageResults')
			} else {
				return 0
			}
		},
		/**
		 * To set the localStorage to hold the users preference for page results.
		 * @function
		 * @param {integer} results - An integer that represents the number of results to show per page.
		 * @returns {undefined}
		 */
		setLocalStorage (results) {
			localStorage.setItem('pageResults', results)
		},
		/**
		 * To set the users selection as the active page results which will then update localStorage and inform the parent.
		 * @function
		 * @param {integer} results - An integer that represents the number of results to show per page.
		 * @returns {undefined}
		 */
		updateResultsPerPage (results) {
			if (this.resultsPerPage === results) {
				return
			}

			this.resultsPerPage = results
			this.setLocalStorage(results)
			this.emitResults()
		},
		/**
		 * To emit to the parent what the number of results are in order to pull in the appropriate number of results.
		 * @function
		 * @returns {undefined}
		 */
		emitResults () {
			this.$emit('pageResults', this.resultsPerPage)
		}
	},
	components: {
		Dropdown
	}
}
</script>
