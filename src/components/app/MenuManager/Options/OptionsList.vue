<template>
	<modal :show="showOptionsModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select an Option</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="table-scrollable table-fixed-height">
    	        <table class="table">
    	            <thead>
    	                <tr>
    	                	<th>  </th>
    	                	<th> Icon </th>
    	                    <th> Name </th>
    	                    <th> Description </th>
    	                </tr>
    	            </thead>
    	            <tbody>
    	                <tr v-for="option in options">
    	                	<td>
    	                		<div class="md-checkbox has-success">
                                    <input type="checkbox" :id="'option_checkbox_' + option.id" class="md-check" v-model="option.selected">
                                    <label :for="'option_checkbox_' + option.id">
                                        <span class="inc"></span>
                                        <span class="check"></span>
                                        <span class="box"></span>
                                    </label>
                                </div>
    	                	</td>
    	                	<td> <img :src="option.image_url" width="30" height="30"> </td>
    	                    <td> {{option.name}} </td>
    	                    <td> {{option.description}} </td>
    	                </tr>
    	            </tbody>
    	        </table>
    	    </div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="applyOptionsToItem()">Apply Options</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import OptionsFunctions from '../../../../controllers/Options'

export default {
	data () {
		return {
			showOptionsModal: false,
			errorMessage: '',
			options: []
		}
	},
	props: {
		appliedOptions: {
			type: Array,
			default: []
		},
		selectedItemId: {
			type: Number,
			default: 0
		},
		itemType: {
			type: String,
			default: 'modifier-item'
		}
	},
	created () {
		this.getOptions()
	},
	mounted () {
		this.showOptionsModal = true
	},
	methods: {
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To get a list of modifier categories for a store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getOptions () {
			var optionsListVue = this
			optionsListVue.options = []
			OptionsFunctions.getOptions(optionsListVue.$root.appId, optionsListVue.$root.appSecret, optionsListVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					optionsListVue.options = response.payload
					if (optionsListVue.appliedOptions.length) {
						for (var i = 0; i < optionsListVue.options.length; i++) {
							for (var j = 0; j < optionsListVue.appliedOptions.length; j++) {
								if (optionsListVue.options[i].id === optionsListVue.appliedOptions[j].id) {
									optionsListVue.$set(optionsListVue.options[i], 'selected', true)
									break
								} else {
									optionsListVue.$set(optionsListVue.options[i], 'selected', false)
								}
							}
							optionsListVue.$set(optionsListVue.options[i], 'created_by', optionsListVue.$root.createdBy)
						}
					} else {
						for (var k = 0; k < optionsListVue.options.length; k++) {
							optionsListVue.$set(optionsListVue.options[k], 'created_by', optionsListVue.$root.createdBy)
						}
					}
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					optionsListVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To apply some of the existing modifiers to an item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyOptionsToItem () {
			var optionsListVue = this
			var optionsToBeApplied = []
			for (var k = 0; k < optionsListVue.options.length; k++) {
				if (optionsListVue.options[k].selected) {
					optionsToBeApplied.push(optionsListVue.options[k].id)
				}
			}
			if (optionsListVue.itemType === 'modifier-item') {
				OptionsFunctions.applyOptionsToModifierItem(optionsListVue.selectedItemId, this.$root.createdBy, optionsToBeApplied, optionsListVue.$root.appId, optionsListVue.$root.appSecret, optionsListVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						optionsListVue.closeModal()
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						optionsListVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
					}
					throw reason
				})
			}
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeOptionsListModal', this.selectedItemId)
		}
	},
	components: {
		Modal
	}
}
</script>
