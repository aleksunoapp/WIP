<template>
	<div class="width-100">
		<store-picker
			:editable="editable"
			:multiple="true"
			:previouslySelected="previouslySelected"
			@update="update"
		>
		</store-picker>
		<div
			class="width-100 display-flex justify-content-flex-end"
			v-show="withButton"
		>
			<button
				type="button"
				class="pull-right margin-top-15 btn btn-primary"
				@click="selectLocations()"
			>
				{{editable ? 'Select' : 'Close'}}
			</button>
		</div>
	</div>
</template>

<script>
import StorePicker from '@/components/modules/StorePicker'

export default {
	name: 'StorePickerWithButton',
	components: {
		StorePicker
	},
	data () {
		return {
			locations: []
		}
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
		editable: {
			type: Boolean,
			required: false,
			default: () => true
		}
	},
	methods: {
		/**
		 * Pass up user selection
		 * @function
		 * @param {array} locations - Selected store IDs
		 * @returns {undefined}
		 */
		update (locations) {
			this.locations = locations
			this.$emit('update', locations)
		},
		/**
		 * Emit a close event with selected values
		 * @function
		 * @returns {undefined}
		 */
		selectLocations () {
			this.$emit('close', this.locations)
		}
	}
}
</script>
