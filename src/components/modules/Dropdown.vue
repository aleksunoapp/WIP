<template>
	<li v-if="isLi" :class="classes" @keyup.esc="open = false">
		<slot name="button">
			<a class="dropdown-toggle" role="button" :class="{disabled: disabled}">
				{{ text }}
				<span class="caret"></span>
			</a>
		</slot>
		<slot name="dropdown-menu">
			<ul class="dropdown-menu">
				<slot></slot>
			</ul>
		</slot>
	</li>
	<div v-else :class="classes">
		<slot name="before"></slot>
		<slot name="button">
			<button type="button" class="btn dropdown-toggle" :disabled="disabled" :class="type">
				{{ text }}
				<span class="caret"></span>
			</button>
		</slot>
		<slot name="dropdown-menu">
			<ul class="dropdown-menu">
				<slot></slot>
			</ul>
		</slot>
	</div>
</template>
<script>
/**
 * Dropdown module is used to replicate the bootstrap dropdown functionality.
 * @class Dropdown
 * @prop {boolean} isLi - Used to determine whether the dropdown is in an `li` or a `div`
 * @prop {boolean} show - Used to determine whether the dropdown should be open or not
 * @prop {string} class - Used if you want to pass a class from the parent
 * @prop {boolean} disabled - To determine whether the dropdown should be disabled or not
 * @prop {string} text - The text to display on the button
 * @prop {string} type - Used to determine the button type (default: `btn-default`)
 * @since 0.0.2
 */

import $ from 'jquery'

export default {
	data () {
		return {
			open: false,
			displayLeft: false
		}
	},
	props: {
		isLi: {
			default: false
		},
		show: {
			default: false
		},
		'passedClass': null,
		disabled: {
			default: false
		},
		text: {
			default: null
		},
		type: {
			default: 'btn-default'
		},
		menuAtTop: {
			default: false
		},
		customTop: {
			default: ''
		}
	},
	computed: {
		/**
		 * Compute classes to add to the dropdown based off props passed in
		 * @function
		 * @returns {string} - A string combination of number and pixels
		 * @memberof Dropdown
		 * @version 0.0.4
		 */
		classes () {
			return [{open: this.open, disabled: this.disabled}, this.passedClass, this.isLi ? 'dropdown dropdown-user' : this.inInput ? 'input-group-btn' : 'btn-group', this.displayLeft ? 'left' : '']
		},
		/**
		 * Find the elements parent that could restrict the display of the dropdown
		 * @function
		 * @returns {object} - A DOM element
		 * @memberof Dropdown
		 * @version 0.0.4
		 */
		getElementsRestrictiveParent () {
			var tempEl = $(this.$el)
			if (tempEl.parent().is('body')) {
				return tempEl.parent()
			}

			while (!tempEl.parent().is('body')) {
				tempEl = tempEl.parent()
				if (tempEl.css('overflow') === 'hidden' || tempEl.css('overflow') === 'scroll' || tempEl.css('overflow') === 'auto') {
					return tempEl
				}
			}

			return $('body')
		}
	},
	/**
	 * Run on `mounted` to initialize the dropdown
	 * @function
	 * @returns {undefined}
	 * @memberof Dropdown
	 * @version 0.0.4
	 */
	mounted () {
		// Set open to hold the value of show because otherwise we run into scope issues
		this.open = this.show

		const $el = $(this.$el)

		var dropdownVue = this

		// When the dropdown loses focus we want to close it
		$(document).bind('click', (e) => {
			if (dropdownVue.open) {
				dropdownVue.open = false
			}
		})

		$el.find('a, button.dropdown-toggle').on('click', e => {
			// If the dropdown button is clicked, perform opening logic
			e.preventDefault()
			if (this.disabled) { return false }
			this.open = !this.open
			return false
		})

		// When an element in the dropdown is clicked, close the dropdown
		$el.find('ul').on('click', 'li>a', e => {
			this.open = false
		})

		this.checkLeft()
		this.checkTop()

		$(window).on('resize', () => {
			this.checkLeft()
			this.checkTop()
		})
	},
	methods: {
		/**
		 * Check if the element is going to get cut off on the right side of the page and apply the proper class if it is
		 * @function
		 * @returns {undefined}
		 * @memberof Dropdown
		 * @version 0.0.4
		 */
		checkLeft () {
			const $el = $(this.$el)

			var leftDistance = $(window).width() - $el.offset().left
			var ulWidth = $el.find('ul').width()

			if (leftDistance < ulWidth) {
				this.displayLeft = true
			} else {
				this.displayLeft = false
			}
		},
		/**
		 * Check if the element is going to get cut off on the bottom of the page and apply the proper styles if it is
		 * @function
		 * @returns {undefined}
		 * @memberof Dropdown
		 * @version 0.0.4
		 */
		checkTop () {
			const $el = $(this.$el)

			// The distance from the top of the page to the bottom of the restricting element
			var bottomDistance = $(this.getElementsRestrictiveParent).offset().top + $(this.getElementsRestrictiveParent).height()
			// The height of the dropdown element
			var ulHeight = $el.find('ul').height()
			// The height of the dropdown button
			var buttonHeight = $el.height()
			// The distance from the top of the page to the top of the dropdown button element
			var elementOffsetTop = $el.offset().top

			if (bottomDistance < ulHeight + buttonHeight + elementOffsetTop) {
				$el.find('ul').css('top', -ulHeight)
			} else if (this.menuAtTop) {
				$el.find('ul').css('top', this.customTop)
			} else {
				$el.find('ul').css('top', '100%')
			}
		}
	},
	/**
	 * Run before `destroyed` to remove all dropdown focus
	 * @function
	 * @returns {undefined}
	 * @memberof Dropdown
	 * @version 0.0.4
	 */
	beforeDestroy () {
		const $el = $(this.$el)
		$(document).unbind('click')
		$el.find('a,button').off()
		$el.find('ul').off()
	}
}
</script>

<style scoped>
.secret {
  position: absolute;
  clip: rect(0 0 0 0);
  overflow: hidden;
  margin: -1px;
  height: 1px;
  width: 1px;
  padding: 0;
  border: 0;
}
.btn-group.left ul.dropdown-menu {
	right: 0;
	left: inherit;
}
</style>
