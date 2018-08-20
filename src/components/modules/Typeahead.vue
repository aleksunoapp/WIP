<template>
	<div class="unoapp-typeahead"
	     :class="{'open': showDropdown}">

		<!-- Predictive Input (Readonly) -->
		<input type="text"
		       class="form-control prediction-input"
		       readonly
		       autocomplete="off"
		       spellcheck="false"
		       tabindex="-1"
		       v-model="predictiveValue" />

		<!-- Typeahead Input -->
		<input type="text"
		       class="form-control input-sm prediction-output-input"
		       :class="{'edited': value.length}"
		       :placeholder="placeholder"
		       autocomplete="off"
		       v-model="value"
		       @input="update"
		       @keydown.up="up"
		       @keydown.down="down"
		       @keydown.enter="hit"
		       @keydown.esc="reset"
		       @keydown.tab="selectPredictiveOption"
		       @blur="showDropdown = false; hidePredictiveValue()"
		       @focus="onFocus()"
		       :tabindex="tabindex" />

		<!-- DROPDOWN START -->
		<ul class="dropdown-menu">
			<li v-for="(item, index) in items"
			    v-bind:class="{'active': isActive(index)}"
				:key="index">
				<a @mousedown.prevent="hit"
				   @mousemove="setActive(index)">
					<span v-if="!objectKey"
					      v-html="highlight(item)"></span>
					<span v-if="objectKey"
					      v-html="highlight(item[objectKey])"></span>
				</a>
			</li>
			<li v-if="!items.length">
				<a>
					<span>There are no {{label.toLowerCase() + 's'}} that match your search.</span>
				</a>
			</li>
		</ul>
		<!-- DROPDOWN END -->

		<label>{{ label }}</label>
	</div>
</template>

<script>
import $ from 'jquery'

export default {
	/**
	 * Run on `created` to initialize the items list and to set the initial value if one was passed into the component.
	 * @function
	 * @returns {undefined}
	 */
	created() {
		this.items = this.primitiveData
		if (this.passedValue) {
			if (this.objectKey) {
				this.value = this.passedValue[this.objectKey]
			} else {
				this.value = this.passedValue
			}
		}
	},
	name: 'typeahead',
	props: {
		data: {
			type: Array
		},
		emitter: {
			type: String
		},
		label: {
			type: String
		},
		limit: {
			type: Number,
			default: 8
		},
		objectKey: {
			type: String,
			default: null
		},
		placeholder: {
			type: String
		},
		passedValue: {
			default: null
		},
		tabindex: {
			default: 0
		}
	},
	data() {
		return {
			showDropdown: false,
			noResult: true,
			current: 0,
			items: [],
			value: '',
			predictiveValue: ''
		}
	},
	computed: {
		/**
		 * Compute data that matches the current search in the typeahead.
		 * @function
		 * @returns {array} - An array of objects that meet the search criteria.
		 */
		primitiveData() {
			if (this.data) {
				return this.data
					.filter(value => {
						var query = this.value.toLowerCase()
						if (this.objectKey) {
							value = value[this.objectKey].toLowerCase()
						} else {
							value = value.toLowerCase()
						}
						return value.indexOf(query) !== -1
					})
					.slice(0, this.limit)
			}
		},
		/**
		 * Compute an alphabetically sorted list for use in predictions
		 * @function
		 * @returns {array} - A sorted version of the items array.
		 */
		sortedPredictionList() {
			return this.items.sort((a, b) => {
				if (this.objectKey) {
					if (a[this.objectKey] < b[this.objectKey]) return -1
					if (a[this.objectKey] > b[this.objectKey]) return 1
				} else {
					if (a < b) return -1
					if (a > b) return 1
				}
				return 0
			})
		}
	},
	methods: {
		/**
		 * To update the items list, show the dropdown, and updated the current prediction. Called whenever the input changes.
		 * @function
		 * @returns {boolean} - Returns only if there is no value set.
		 */
		update() {
			if (!this.value) {
				this.reset()
				return false
			}

			if (this.data) {
				this.items = this.primitiveData
				this.showDropdown = true
				this.calculatePredictiveValue()
			}
		},
		/**
		 * To reset the items list and clear the current value.
		 * @function
		 * @returns {undefined}
		 */
		reset() {
			this.items = []
			this.value = ''
			this.showDropdown = false
		},
		/**
		 * To update the current item. The current item is used to set a value when selected.
		 * @function
		 * @param {integer} index - the index within the items array that is to be set as current.
		 * @returns {undefined}
		 */
		setActive(index) {
			this.current = index
		},
		/**
		 * To compare the current index to a passed index to check if it is the currently active index.
		 * @function
		 * @param {integer} index - the index within the items array that is to be checked.
		 * @returns {boolean} - Returns whether the item passed in is the current active item.
		 */
		isActive(index) {
			return this.current === index
		},
		/**
		 * To set the current item (or the override) as the active item and pass it to the parent.
		 * @function
		 * @param {event} e - the event that triggered the function.
		 * @param {integer} override - the index that is to be set to override the current index.
		 * @returns {undefined}
		 */
		hit(e, override) {
			this.predictiveValue = ''
			if (e) {
				e.preventDefault()
			}

			var currentOverride = this.current
			if (override || override === 0) {
				currentOverride = override
			}

			if (this.items[currentOverride]) {
				this.showDropdown = false
				if (this.objectKey) {
					this.value = this.items[currentOverride][this.objectKey]
					this.$emit(this.emitter, this.items[currentOverride])
				} else {
					this.value = this.items[currentOverride]
					this.$emit(this.emitter, this.value)
				}
			}
		},
		/**
		 * To move the current index up the dropdown by one index.
		 * @function
		 * @returns {undefined}
		 */
		up() {
			if (this.current > 0) {
				this.current--
			}
		},
		/**
		 * To move the current index down the dropdown by one index.
		 * @function
		 * @returns {undefined}
		 */
		down() {
			if (this.current < this.items.length - 1) {
				this.current++
			}
		},
		/**
		 * To let the parent know that the input has been focused on so that they can perform an event if needed.
		 * @function
		 * @returns {undefined}
		 */
		onFocus() {
			this.$emit('onFocus')
			$(this.$el)
				.find('.prediction-output-input')
				.select()
		},
		/**
		 * To highlight the characters in the passed in phrase that match the input value.
		 * @function
		 * @param {string} phrase - The item in the dropdown that we are applying the highlight to.
		 * @returns {undefined}
		 */
		highlight(phrase) {
			return phrase.replace(
				new RegExp('(' + this.value + ')', 'gi'),
				'<strong>$1</strong>'
			)
		},
		/**
		 * To determine which word is being used as the current prediction. A word can only be used if the input value matches starting at index 0 (case insensitive).
		 * @function
		 * @returns {undefined}
		 */
		calculatePredictiveValue() {
			if (!this.value.length) {
				this.predictiveValue = ''
				return
			}

			// Going to attempt a binary search here
			var updated = false
			var minIndex = 0
			var maxIndex = this.sortedPredictionList.length - 1
			var currentIndex
			var currentElement

			while (minIndex <= maxIndex) {
				currentIndex = ((minIndex + maxIndex) / 2) | 0
				if (this.objectKey) {
					currentElement = this.sortedPredictionList[currentIndex][
						this.objectKey
					]
				} else {
					currentElement = this.sortedPredictionList[currentIndex]
				}
				if (
					currentElement.toLowerCase().indexOf(this.value.toLowerCase()) === 0
				) {
					// Creating this element to handle upper-vs-lower case differences between the predictive name and the typed value
					var frankensteinElement =
						this.value + currentElement.substring(this.value.length)
					this.predictiveValue = frankensteinElement
					updated = true
					break
				} else if (currentElement < this.value) {
					minIndex = currentIndex + 1
				} else if (currentElement > this.value) {
					maxIndex = currentIndex - 1
				}
			}

			if (!updated) {
				// If we couldn't find a word that matches then clear the predictive text.
				this.predictiveValue = ''
			}
		},
		/**
		 * To clear the current predicted word.
		 * @function
		 * @returns {undefined}
		 */
		hidePredictiveValue() {
			this.predictiveValue = ''
		},
		/**
		 * To select the current predictive value and set it as the actual value.
		 * @function
		 * @returns {undefined}
		 */
		selectPredictiveOption() {
			this.value = this.predictiveValue

			// This value is used in case the user is hovering over an option which is not the predictive option
			var currentOverride
			for (var i = 0, x = this.items.length; i < x; i++) {
				if (this.objectKey) {
					if (
						this.items[i][this.objectKey].toLowerCase() ===
						this.value.toLowerCase()
					) {
						currentOverride = i
					}
				} else {
					if (this.items[i].toLowerCase() === this.value.toLowerCase()) {
						currentOverride = i
					}
				}
			}

			this.hit(false, currentOverride)
			this.hidePredictiveValue()
		}
	},
	/**
	 * Watch `passedValue` in case the data is changed from the parent component.
	 * @function
	 * @returns {undefined}
	 */
	watch: {
		passedValue() {
			if (this.objectKey) {
				if (this.passedValue[this.objectKey] !== this.value) {
					this.value = this.passedValue[this.objectKey]
				}
			} else {
				if (this.passedValue !== this.value) {
					this.value = this.passedValue
				}
			}
		}
	}
}
</script>
<style>
.form-group.form-md-line-input
  .unoapp-typeahead
  .form-control.prediction-input {
  position: absolute;
  top: 17px;
  border-bottom: none;
  z-index: 0;
  opacity: 0.5;
}
.form-group.form-md-line-input
  .unoapp-typeahead
  .form-control.prediction-output-input {
  z-index: 1;
  position: relative;
}
</style>
