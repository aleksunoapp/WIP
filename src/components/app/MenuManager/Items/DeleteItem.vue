<template>
	<modal :show="showDeleteItemModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Delete Item</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="col-md-12">
				Are you sure you want to delete this item?
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer clear">
			<button 
				type="button" 
				class="btn btn-primary" 
				@click="deleteItem()"
				:disabled="deleting">
				Delete
				<i 
					v-show="deleting"
					class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import ItemsFunctions from '../../../../controllers/Items'

export default {
	data () {
		return {
			showDeleteItemModal: false,
			deleting: false,
			errorMessage: '',
			customWidth: 90
		}
	},
	props: {
		passedItemId: {
			type: Number
		}
	},
	mounted () {
		this.showDeleteItemModal = true
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
		 * To delete the item and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteItem () {
			this.deleting = true
			var deleteItemVue = this
			deleteItemVue.clearError()

			ItemsFunctions.deleteItem(deleteItemVue.passedItemId, deleteItemVue.$root.appId, deleteItemVue.$root.appSecret, deleteItemVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					this.deleteItemAndCloseModal()
				} else {
					deleteItemVue.errorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					deleteItemVue.$router.push('/login/expired')
					return
				}
				deleteItemVue.errorMessage = reason
				window.scrollTo(0, 0)
			}).finally(() => {
				deleteItemVue.deleting = false
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDeleteItemModal')
		},
		/**
		 * To close the modal and delete the item.
		 * @function
		 * @returns {undefined}
		 */
		deleteItemAndCloseModal () {
			this.$emit('deleteItemAndCloseModal')
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
