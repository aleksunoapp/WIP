<template>
	<modal :show="showDeletePromotionModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Delete Group</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<transition name="fade" mode="out-in">
				<div v-if="!deleted" key="a">
					<div class="alert alert-danger" v-if="errorMessage.length">
					    <button class="close" data-close="alert" @click="clearError()"></button>
					    <span>{{errorMessage}}</span>
					</div>
					<div class="col-md-12">
						Are you sure you want to delete this group?
					</div>
				</div>
				<div v-if="deleted" key="b">
					<div class="swal2-icon swal2-success swal2-animate-success-icon" style="display: block;">
						<div class="swal2-success-circular-line-left" style="background: rgb(255, 255, 255);"></div>
						<span class="swal2-success-line-tip swal2-animate-success-line-tip"></span> 
						<span class="swal2-success-line-long swal2-animate-success-line-long"></span>
						<div class="swal2-success-ring"></div> 
						<div class="swal2-success-fix" style="background: rgb(255, 255, 255);"></div>
						<div class="swal2-success-circular-line-right" style="background: rgb(255, 255, 255);"></div>
					</div>
				</div>
			</transition>
		</div>
		<div slot="modal-footer" class="modal-footer clear">
			<button v-show="!deleted" type="button" class="btn btn-primary" @click="deleteGroup()">Delete</button>
			<button v-show="deleted" type="button" class="btn btn-default" @click="deleteGroupAndCloseModal()">Close</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import UserGroupFunctions from '../../../controllers/UserGroups'

export default {
	data () {
		return {
			showDeletePromotionModal: false,
			errorMessage: '',
			customWidth: 90,
			deleted: false
		}
	},
	props: {
		selectedPromotionId: {
			type: Number
		}
	},
	mounted () {
		this.showDeletePromotionModal = true
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
		 * To delete the promotion and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteGroup () {
			var deleteGroupVue = this
			deleteGroupVue.clearError()

			UserGroupFunctions.deleteGroup(deleteGroupVue.selectedPromotionId, deleteGroupVue.$root.appId, deleteGroupVue.$root.appSecret, deleteGroupVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					deleteGroupVue.deleted = true
					window.setTimeout(() => {
						deleteGroupVue.deleteGroupAndCloseModal()
					}, 2000)
				} else {
					deleteGroupVue.errorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					deleteGroupVue.$router.push('/login/expired')
					return
				}
				deleteGroupVue.errorMessage = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDeleteGroupModal')
		},
		/**
		 * To close the modal and delete the promotion.
		 * @function
		 * @returns {undefined}
		 */
		deleteGroupAndCloseModal () {
			this.$emit('deleteGroupAndCloseModal', this.selectedPromotionId)
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
