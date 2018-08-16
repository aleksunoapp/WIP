<template>
	<modal :show="showDeleteSubCategoryModal" effect="fade" @closeOnEscape="closeModal" ref="modal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Delete Sub-category</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-show="errorMessage" ref="errorMessage">
			    <button class="close" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="col-md-12">
				Are you sure you want to delete this sub-category?
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer clear">
			<button 
				type="button" 
				class="btn btn-primary" 
				@click="deleteSubCategory()"
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
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showDeleteSubCategoryModal: false,
			deleting: false,
			errorMessage: '',
			customWidth: 90
		}
	},
	props: {
		passedSubCategoryId: {
			type: Number
		}
	},
	mounted () {
		this.showDeleteSubCategoryModal = true
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
		 * To delete the SubCategory and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteSubCategory () {
			this.deleting = true
			var deleteSubCategoryVue = this
			deleteSubCategoryVue.clearError()

			CategoriesFunctions.deleteCategory(deleteSubCategoryVue.passedSubCategoryId, deleteSubCategoryVue.$root.appId, deleteSubCategoryVue.$root.appSecret, deleteSubCategoryVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					this.deleteSubCategoryAndCloseModal()
				} else {
					deleteSubCategoryVue.errorMessage = response.message
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not delete the subcategory',
					errorName: 'errorMessage',
					vue: deleteSubCategoryVue,
					containerRef: 'modal'
				})
			}).finally(() => {
				deleteSubCategoryVue.deleting = false
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDeleteSubCategoryModal')
		},
		/**
		 * To close the modal and delete the SubCategory.
		 * @function
		 * @returns {undefined}
		 */
		deleteSubCategoryAndCloseModal () {
			this.$emit('deleteSubCategoryAndCloseModal')
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
