<template>
	<div id="app">
		<router-view v-if="computedMeta"></router-view>
	</div>
</template>

<script>
import $ from 'jquery'
import { isEmpty } from 'lodash'

export default {
	name: 'app',
	/**
	 * Run on `created` to pull all of the data.
	 * @function
	 * @returns {undefined}
	 */
	created: function () {
		if (this.$route.params.uniqueUrl) {
			this.$root.token = this.$route.params.uniqueUrl
		}

		this.getMetaData()
	},
	data () {
		return {}
	},
	computed: {
		/**
		 * To compute whether the meta data object is empty
		 * @function
		 * @returns {boolean} - Whether the meta data object is empty or not
		 */
		computedMeta () {
			return !isEmpty(this.$root.meta)
		}
	},
	methods: {
		/**
		 * To retreive services and meta data from api
		 * @function
		 * @returns {undefined}
		 */
		getMetaData () {
			let _this = this

			// Since we are repulling the data, the user should not be able to get past the verification screen
			if (this.$route.name !== 'code') {
				this.$router.push({name: 'code'})
			}

			$.getJSON('https://testdynamicmpi.dealer-fx.com/metadata/' + this.$root.token).done(response => {
				_this.$root.meta = Object.assign({}, response)
				delete _this.$root.meta.serviceCategories
				_this.$root.serviceCategories = response.serviceCategories
			})
		}
	}
}
</script>
