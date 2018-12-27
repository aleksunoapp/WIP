<template>
	<ul class="pagination-list mb-0">


		<a 
			v-if="pagesArray.length"
			@click="setActivePage(1)"
		>
			<li class="page-number"
			    :class="{'disabled': activePage === 1}">
				<i class="fa fa-angle-double-left"
				   aria-hidden="true"></i>
			</li>
		</a>
		<a 
			v-if="pagesArray.length"
			@click="setActivePage(activePage - 1)"
		>
			<li class="page-number"
			    :class="{'disabled': activePage === 1}">
				<i class="fa fa-angle-left"
				   aria-hidden="true"></i>
			</li>
		</a>

		<a v-for="(page, index) in pagesArray"
		   @click="setActivePage(page)"
		   :key="index">
			<li
				class="page-number"
				:class="{'active': activePage === page}"
			>
				{{ page }}
			</li>
		</a>

		<a 
			v-if="pagesArray.length"
			@click="setActivePage(activePage + 1)"
		>
			<li class="page-number"
			    :class="{'disabled': activePage === numPages}">
				<i class="fa fa-angle-right"
				   aria-hidden="true"></i>
			</li>
		</a>
		<a 
			v-if="pagesArray.length"
			@click="setActivePage(numPages)"
		>
			<li class="page-number"
			    :class="{'disabled': activePage === numPages}">
				<i class="fa fa-angle-double-right"
				   aria-hidden="true"></i>
			</li>
		</a>
	</ul>
</template>
<script>
/**
 * @module Pagination
 */

export default {
	name: 'pagination',
	props: {
		// Total number of pages
		numPages: {
			default: 1
		},
		passedPage: {}
	},
	data () {
		return {
			activePage: 1
		}
	},
	/**
	 * Run on `created` to set the active page as the value passed in.
	 * @function
	 * @returns {undefined}
	 */
	created () {
		if (this.passedPage) {
			if (this.passedPage <= this.numPages) {
				if (this.activePage !== this.passedPage) {
					this.activePage = this.passedPage
				}
			} else {
				this.activePage = 1
			}
		}
	},
	/**
	 * Run on `updated` to set the active page as the value passed in. Mainly used to reset the pagination to the first page when something on the parent prompts it.
	 * @function
	 * @returns {undefined}
	 */
	beforeUpdate () {
		if (this.passedPage <= this.numPages) {
			if (this.activePage !== this.passedPage) {
				this.activePage = this.passedPage
			}
		} else {
			this.activePage = this.numPages
			this.$emit('activePageChange', this.activePage)
		}
	},
	computed: {
		/**
		 * Computed to create an array of numbers based on the number of pages.
		 * @function
		 * @returns {array} - An array of numbers counting from 1 up to the total number of pages.
		 */
		pagesArray () {
			var localPagesArray = []
			for (var i = this.activePage - 5; i <= this.numPages; i++) {
				if (i > 0) {
					localPagesArray.push(i)
				}
			}
			return localPagesArray.splice(0, 6)
		}
	},
	methods: {
		/**
		 * To set the active page.
		 * @function
		 * @param {integer} page - An integer representing the page that is we are setting as active.
		 * @returns {undefined}
		 */
		setActivePage (page) {
			if (page !== this.activePage && page !== 0 && page <= this.numPages) {
				this.activePage = page
				this.emitActivePage()
			}
		},
		/**
		 * To emit the updated active page to the parent.
		 * @function
		 * @returns {undefined}
		 */
		emitActivePage () {
			this.$emit('activePageChange', this.activePage)
		},
		/**
		 * To limit the number of page options that are displaying.
		 * @function
		 * @param {integer} index - An integer representing the page that is being filtered.
		 * @returns {undefined}
		 */
		showPageIndex (index) {
			// Make sure that the first and last page never show in this list
			if (index === 0 || index === this.pagesArray.length - 1) {
				return false
			}

			// Show the current active page
			if (index === this.activePage - 1) {
				return true
			}

			// Show the previous page and next page
			if (index === this.activePage - 2 || index === this.activePage) {
				return true
			}

			return false
		}
	}
}
</script>
<style scoped>
.pagination-list {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  padding: 0;
	height: 2.5rem;
}
.pagination-list a,
.pagination-list a:hover {
  text-decoration: none;
  color: inherit;
}
.page-number {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px;
  cursor: pointer;
	border: 1px #fff solid;
}
.page-number:hover:not(.disabled) {
	background-color: rgb(221, 221, 221);
	border: 1px rgb(221, 221, 221) solid;
  text-decoration: none;
}
.page-number.disabled {
  cursor: not-allowed;
}
.page-number.active {
	border: 1px #409EFF solid;
}
.page-number {
  color: inherit;
}
.elipsis {
  background-color: transparent;
}
</style>
