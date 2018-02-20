<template>
	<div>
		<div class="text-center margin-top-30" v-if="display">
			<h4>No Results Found</h4>
			<p class="no-margin-top" v-if="type !== 'news feed'">There are no {{ type }} to show.</p>
			<p v-if="type === 'menus'">Please select another store from the location panel on the right to view its menu(s) or create new menus.</p>
			<p v-if="type === 'items'">Please select a category first.</p>
			<p v-if="type === 'categories'">Please select a menu from the 'Menus' page first.</p>
			<p v-if="type === 'modifier items'">Please select a modifier category first.</p>
			<p v-if="type === 'tags'">Click on the button above to create one.</p>
			<p v-if="type === 'promotions'">Click on the button above to create one.</p>
		</div>
		<div class="text-center margin-top-30" v-if="customDisplay">
			<h4>No Results Found</h4>
			<p class="no-margin-top">{{ text }}</p>
		</div>
	</div>
</template>

<script>
/**
 * No Results module is used to display a 'No Results' message in a dashboard component
 * @class NoResults
 * @prop {boolean} show - Used to determine whether or not the no results component should be shown
 * @prop {string} type - Used to determine the type to display in the message (default: `results`)
 * @since 0.0.4
 */

export default {
	name: 'no-results',
	props: {
		show: {
			default: false
		},
		type: {
			default: 'results'
		},
		custom: {
			default: false
		},
		text: {
			default: ''
		}
	},
	data () {
		return {
			display: false,
			customDisplay: false
		}
	},
	/**
	 * Run on `created` to set the display variable equal to the show value
	 * @function
	 * @return {undefined}
	 * @memberof NoResults
	 * @version 0.0.4
	 */
	created () {
		if (!this.custom) {
			this.display = this.show
		} else {
			this.customDisplay = this.show
		}
	},
	watch: {
		/**
		 * Watch `show` value to determine whether to display the message or not
		 * @function
		 * @param {boolean} val - The current value of this.show
		 * @return {undefined}
		 * @memberof NoResults
		 * @version 0.0.4
		 */
		show (val) {
			if (val) {
				this.display = true
			} else {
				this.display = false
			}
		}
	}
}
</script>
