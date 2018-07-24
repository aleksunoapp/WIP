<template>
    <modal :show="showModal" effect="fade" @closeOnEscape="closeModal">
        <div slot="modal-header" class="modal-header">
            <button type="button" class="close" @click="closeModal()">
                <span>&times;</span>
            </button>
            <h4 class="modal-title center">Delete Modifier Tier</h4>
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
                    <p>Are you sure you want to delete {{tier.name}}?</p>
                </div>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button 
                @click="deleteModifierTier()"
                type="button" 
                class="btn btn-primary">
                Delete
            </button>
        </div>
    </modal>
</template>

<script>
import Modal from '@/components/modules/Modal'
import ModifierTierFunctions from '@/controllers/ModifierTiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'DeleteModifierTier',
	props: {
		tier: {
			type: Object,
			required: false,
			default: () => ({
				name: ''
			})
		}
	},
	data: () => ({
		showModal: false,
		errorMessage: ''
	}),
	mounted () {
		this.showModal = true
	},
	methods: {
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
		 * To make the delete call
		 * @function
		 * @returns {undefined}
		 */
		deleteModifierTier () {
			const deleteTierVue = this
			ModifierTierFunctions.deleteModifierTier(deleteTierVue.tier).then(response => {
				deleteTierVue.$emit('deleted')
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorName: 'errorMessage',
					errorText: 'We couldn\'t delete the tier',
					vue: deleteTierVue
				})
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
		Modal
	}
}
</script>

