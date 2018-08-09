<template>
    <modal
        :width="900"
        :show="showModal" 
        effect="fade" 
        @closeOnEscape="closeModal">

        <div slot="modal-header" class="modal-header">
            <button type="button" class="close" @click="closeModal()">
                <span>&times;</span>
            </button>
            <h4 class="modal-title center">Apply {{tier.name}} To Items</h4>
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
            <div class="row">
                <div class="col-xs-12">
                    <menu-item-picker 
                        @update="itemsSelected"
                    >
                    </menu-item-picker>
                </div>
            </div>
        </div>

        <div slot="modal-footer" class="modal-footer">
            <button 
				@click="applyModifierToMenuItems()"
				type="button" 
				class="btn btn-primary"
				:disabled="saving">
				Save
				<i 
					v-show="saving"
					class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
        </div>

    </modal>
</template>

<script>
import Modal from '@/components/modules/Modal'
import MenuItemPicker from '@/components/modules/MenuItemPicker'
import ModifierTiersFunctions from '@/controllers/ModifierTiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'AssignModifiersToModifierTier',
	data: () => ({
		saving: false,
		showModal: false,
		errorMessage: '',
		assignedModifiers: null,
		payload: {
			modifier_tier_id: null,
			items: []
		}
	}),
	props: {
		tier: {
			type: Object,
			required: true,
			default: () => {}
		}
	},
	mounted () {
		this.showModal = true
	},
	methods: {
        /**
         * To update selection of items
		 * @function
		 * @param {array} items - Array of items selected by user
		 * @returns {undefined}
		 */
		itemsSelected (items) {
			this.payload.items = items.map(item => item.id)
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
				if (!assignTiersVue.payload.items.length) {
					reject('Please select at least one item')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To post modifier selection to the API
		 * @function
		 * @returns {object} - A network call promise
		 */
		applyModifierToMenuItems () {
			const assignTiersVue = this
			let payload = {
				...this.payload,
				modifier_tier_id: this.tier.id
			}
			this.validate().then(response => {
				assignTiersVue.saving = true
				return ModifierTiersFunctions.applyModifierTierToMenuItems(payload).then(response => {
					assignTiersVue.$emit('assigned')
				}).catch(reason => {
					assignTiersVue.showModal = true
					ajaxErrorHandler({
						reason,
						errorName: 'errorMessage',
						errorText: 'We couldn\'t assign modifiers',
						vue: assignTiersVue
					})
				}).finally(() => {
					assignTiersVue.saving = false
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
		MenuItemPicker
	}
}
</script>

