<template>
	<modal :show="showDeleteMenuModal"
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
			<h4 class="modal-title center">Delete Menu</h4>
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
				Are you sure you want to delete this menu?
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer clear">
			<button type="button"
			        class="btn btn-primary"
			        @click="deleteMenu()"
			        :disabled="deleting">
				Delete
				<i v-show="deleting"
				   class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showDeleteMenuModal: false,
			deleting: false,
			errorMessage: '',
			customWidth: 90
		}
	},
	props: {
		passedMenuId: {
			type: Number
		}
	},
	mounted () {
		this.showDeleteMenuModal = true
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
		 * To delete the menu and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteMenu () {
			this.deleting = true
			var deleteMenuVue = this
			deleteMenuVue.clearError()

			MenusFunctions.deleteMenu(
				deleteMenuVue.passedMenuId,
				deleteMenuVue.$root.appId,
				deleteMenuVue.$root.appSecret,
				deleteMenuVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.deleteMenuAndCloseModal()
					} else {
						deleteMenuVue.errorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the menu',
						errorName: 'errorMessage',
						vue: deleteMenuVue,
						containerRef: 'deleteModal'
					})
				})
				.finally(() => {
					deleteMenuVue.deleting = false
				})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDeleteMenuModal')
		},
		/**
		 * To close the modal and delete the menu.
		 * @function
		 * @returns {undefined}
		 */
		deleteMenuAndCloseModal () {
			this.$emit('deleteMenuAndCloseModal')
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
