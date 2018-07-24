<template>
    <modal :show="showModal" effect="fade" @closeOnEscape="closeModal">
        <div slot="modal-header" class="modal-header">
            <button type="button" class="close" @click="closeModal()">
                <span>&times;</span>
            </button>
            <h4 class="modal-title center">Edit Modifier Tier</h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <div class="row">
                <div class="col-xs-12">
                    <div class="alert alert-danger" v-show="errorMessage.length" ref="errorMessage">
                        <button class="close" @click.prevent="clearError('errorMessage')"></button>
                        <span>{{errorMessage}}</span>
                    </div>
                </div>
                <div class="col-xs-12">
                    <div class="form-group form-md-line-input form-md-floating-label">
                        <input 
                            type="text" 
                            class="form-control input-sm" 
                            id="form_control_1" 
                            :class="{'edited': tierToEdit.name.length}" 
                            v-model="tierToEdit.name">
                        <label for="form_control_1">Modifier Tier Name</label>
                    </div>
                </div>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button 
                @click="updateModifierTier()"
                type="button" 
                class="btn btn-primary">Save</button>
        </div>
    </modal>
</template>

<script>
import Modal from '@/components/modules/Modal'
import ModifierTierFunctions from '@/controllers/ModifierTiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'EditModifierTier',
	props: {
		tier: {
			type: Object,
			required: true,
			default: () => ({
				name: ''
			})
		}
	},
	data: () => ({
		showModal: false,
		errorMessage: '',
		tierToEdit: {
			name: ''
		}
	}),
	created () {
		this.tierToEdit = {...this.tier}
	},
	mounted () {
		this.showModal = true
	},
	methods: {
        /**
		 * To clear an error
		 * @function
         * @param {string} name - Name of the variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
        /**
		 * To emit the close event
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('close')
		},
        /**
		 * To validate form data
		 * @function
		 * @returns {object} - Promise that rejects incorrect fields with an error message
		 */
		validate () {
			const editTierVue = this
			return new Promise(function (resolve, reject) {
				if (!editTierVue.tierToEdit.name.length) {
					reject('Name cannot be blank')
				}
				resolve('Hurray')
			})
		},
        /**
		 * To make the update call
		 * @function
		 * @returns {undefined}
		 */
		updateModifierTier () {
			const editTierVue = this
			this.validate().then(response => {
				ModifierTierFunctions.updateModifierTier(editTierVue.tierToEdit).then(response => {
					editTierVue.$emit('updated', response.payload)
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorName: 'errorMessage',
						errorText: 'We couldn\'t fetch tier info',
						vue: editTierVue
					})
				})
			}).catch(reason => {
				editTierVue.errorMessage = reason
				editTierVue.$scrollTo(editTierVue.$refs.errorMessage, 1000, { offset: -50 })
			})
		}
	},
	components: {
		Modal
	}
}
</script>

