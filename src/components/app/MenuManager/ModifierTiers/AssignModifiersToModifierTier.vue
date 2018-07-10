<template>
    <modal :show="showModal" effect="fade" @closeOnEscape="closeModal">
        <div slot="modal-header" class="modal-header">
            <button type="button" class="close" @click="closeModal()">
                <span>&times;</span>
            </button>
            <h4 class="modal-title center">Assign Modifiers</h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <div class="row">
                <div class="col-xs-12">
                    <div class="alert alert-danger" v-show="errorMessage.length" ref="errorMessage">
                        <button class="close" @click.prevent="clearError('errorMessage')"></button>
                        <span>{{errorMessage}}</span>
                    </div>
                </div>
            </div>
            <modifier-picker
                v-if="assignedModifiers !== null"
                :previouslySelected="assignedModifiers"
                @selected="updateSelected">
            </modifier-picker>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button 
				@click="assignModifiers()"
				type="button" 
				class="btn btn-primary">
				Save
			</button>
        </div>
    </modal>
</template>

<script>
import Modal from '@/components/modules/Modal'
import ModifierPicker from '@/components/app/MenuManager/Modifiers/ModifierCategoryPicker'
import ModifierTierFunctions from '@/controllers/ModifierTiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'AssignModifiersToModifierTier',
	data: () => ({
		showModal: false,
		errorMessage: '',
		assignedModifiers: null,
		payload: {
			modifiers_to_add: [],
			modifiers_to_remove: []
		}
	}),
	props: {
		tier: {
			type: Object,
			required: true,
			default: () => {}
		}
	},
	created () {
		this.getModifierTierDetails(this.tier)
	},
	methods: {
        /**
		 * To fetch tier details from API
		 * @function
		 * @returns {object} - A network call promise
		 */
		getModifierTierDetails () {
			let assignTiersVue = this
			return ModifierTierFunctions.getModifierTierDetails(assignTiersVue.tier).then(response => {
				assignTiersVue.assignedModifiers = response.payload.map(category => category.id)
				assignTiersVue.showModal = true
			}).catch(reason => {
				assignTiersVue.showModal = true
				ajaxErrorHandler({
					reason,
					errorName: 'errorMessage',
					errorText: 'We couldn\'t fetch tier info',
					vue: assignTiersVue
				})
			})
		},
		/**
		 * To clear an error
		 * @function
		 * @param {string} name - Name of the error variable
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To update selection based on picker data
		 * @function
		 * @param {array} tiers - Array of tiers
		 * @returns {undefined}
		 */
		updateSelected (tiers) {
			this.payload.modifiers_to_add = tiers.filter(tier => tier.selected).map(tier => tier.id)
			this.payload.modifiers_to_remove = tiers.filter(tier => !tier.selected).map(tier => tier.id)
		},
		/**
		 * To validate data before submitting it
		 * @function
		 * @returns {undefined}
		 */
		validate () {
			const assignTiersVue = this
			return new Promise(function (resolve, reject) {
				assignTiersVue
				resolve('Hurray')
			})
		},
		/**
		 * To post modifier selection to the API
		 * @function
		 * @returns {object} - A network call promise
		 */
		assignModifiers () {
			const assignTiersVue = this
			let payload = {
				...this.payload,
				id: this.tier.id
			}
			this.validate().then(response => {
				return ModifierTierFunctions.addModifiersToTier(payload).then(response => {
					assignTiersVue.$emit('assigned')
				}).catch(reason => {
					assignTiersVue.showModal = true
					ajaxErrorHandler({
						reason,
						errorName: 'errorMessage',
						errorText: 'We couldn\'t assign modifiers',
						vue: assignTiersVue
					})
				})
			}).catch(reason => {
				assignTiersVue.errorMessage = reason
				assignTiersVue.$scrollTo(assignTiersVue.$refs.errorMessage, 1000, { offset: -50 })
			})
		},
		/**
		 * To emit a close event
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('close')
		}
	},
	components: {
		Modal,
		ModifierPicker
	}
}
</script>

