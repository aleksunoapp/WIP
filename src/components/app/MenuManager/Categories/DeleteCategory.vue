<template>
	<modal :show="showDeleteCategoryModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Delete Category</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="col-md-12">
				Are you sure you want to delete this category?
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer clear">
			<button 
				type="button" 
				class="btn btn-primary" 
				@click="deleteCategory()"
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
import CategoriesFunctions from '../../../../controllers/Categories'

export default {
	data () {
		return {
			showDeleteCategoryModal: false,
			deleting: false,
			errorMessage: '',
			customWidth: 90
		}
	},
	props: {
		passedCategoryId: {
			type: Number
		}
	},
	mounted () {
		this.showDeleteCategoryModal = true
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
		 * To delete the category and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteCategory () {
			this.deleting = true
			var deleteCategoryVue = this
			deleteCategoryVue.clearError()

			CategoriesFunctions.deleteCategory(deleteCategoryVue.passedCategoryId, deleteCategoryVue.$root.appId, deleteCategoryVue.$root.appSecret, deleteCategoryVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					this.deleteCategoryAndCloseModal()
				} else {
					deleteCategoryVue.errorMessage = response.message
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					deleteCategoryVue.$router.push('/login/expired')
					return
				}
				deleteCategoryVue.errorMessage = reason
				window.scrollTo(0, 0)
			}).finally(() => {
				deleteCategoryVue.deleting = false
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDeleteCategoryModal')
		},
		/**
		 * To close the modal and delete the category.
		 * @function
		 * @returns {undefined}
		 */
		deleteCategoryAndCloseModal () {
			this.$emit('deleteCategoryAndCloseModal')
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
