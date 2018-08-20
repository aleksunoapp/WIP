<template>
	<modal :show="showDeleteModifierItemModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="deleteModal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Delete Modifier Item</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="alert alert-danger"
			     v-show="errorMessage"
			     ref="errorMessage">
				<button class="close"
				        @click="clearError()"></button>
				<span>{{errorMessage}}</span>
			</div>
			<div class="col-md-12">
				Are you sure you want to delete this modifier item?
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer clear">
			<button type="button"
			        class="btn btn-primary"
			        @click="deleteModifierItem()">Delete</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import ModifiersFunctions from '../../../../controllers/Modifiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showDeleteModifierItemModal: false,
			errorMessage: '',
			customWidth: 90
		}
	},
	props: {
		itemId: {
			type: Number
		}
	},
	mounted () {
		this.showDeleteModifierItemModal = true
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
		 * To delete the modifier item and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteModifierItem () {
			var deleteModifierItemVue = this
			deleteModifierItemVue.clearError()

			ModifiersFunctions.deleteModifierItem(
				deleteModifierItemVue.itemId,
				deleteModifierItemVue.$root.appId,
				deleteModifierItemVue.$root.appSecret,
				deleteModifierItemVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.deleteModifierItemAndCloseModal()
					} else {
						deleteModifierItemVue.errorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the modifier item',
						errorName: 'errorMessage',
						vue: deleteModifierItemVue,
						containerRef: 'deleteModal'
					})
				})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDeleteModifierItemModal')
		},
		/**
		 * To close the modal and delete the modifier item.
		 * @function
		 * @returns {undefined}
		 */
		deleteModifierItemAndCloseModal () {
			this.$emit('deleteModifierItemAndCloseModal')
		}
	},
	components: {
		Modal
	}
}
</script>
<style>
.image-container {
  border: 1px dotted #c2cad8;
  text-align: center;
}
</style>
