<template>
	<div class="portlet light bordered">
		<div class="portlet-body">
			<!-- HEADER START -->
			<h4 class="modal-title center margin-bottom-15">
				<i class="fa fa-chevron-left clickable pull-left"
				   v-show="mode !== 'list'"
				   @click="listMode()"></i>
				<span v-show="mode === 'create'">Add Image</span>
				<span v-show="mode === 'preview'">Preview</span>
				<span v-show="mode === 'edit'">Edit Image</span>
				<span v-show="mode === 'delete'">Delete Image</span>
			</h4>
			<!-- HEADER END -->
			<div class="relative-block">
				<loading-screen :show="loadingImages"
				                :color="'#2C3E50'"
				                :display="'inline'"></loading-screen>
				<div class="row">
					<div class="col-md-12"
					     v-show="imagesErrorMessage.length"
					     ref="imagesErrorMessage">
						<div class="alert alert-danger">
							<button class="close"
							        @click="clearError('imagesErrorMessage')"></button>
							<span>{{imagesErrorMessage}}</span>
						</div>
					</div>
					<div class="col-md-12"
					     v-if="!loadingImages">
						<!-- LIST START -->
						<div v-if="mode === 'list'">
							<div v-for="image in images"
							     class="col-md-4 margin-bottom-15"
							     :id="'image-' + image.id"
							     :key="image.id">
								<div class="tile image">
									<div class="tile-body custom-tile-body">
										<img class="custom-tile-body-img clickable"
										     @click="previewMode(image)"
										     :src="image.url">
									</div>
									<div class="actions-under-image">
										<div class="padding-x-5"
										     @click="flipDefault(image)">
											<el-tooltip :content="defaultButtonText(image.default)"
											            effect="light"
											            popper-class="tooltip-in-modal">
												<a class="btn btn-circle btn-icon-only btn-edit"
												   :disabled="!$root.permissions['stores images update']? true : false">
													<i v-show="image.default === 0"
													   class="fa fa-lg fa-check black-text"></i>
													<i v-show="image.default === 1"
													   class="fa fa-lg fa-times black-text"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="padding-x-5">
											<el-tooltip content="Edit"
											            effect="light"
											            popper-class="tooltip-in-modal">
												<a class="btn btn-circle btn-icon-only btn-edit"
												   @click="editMode(image)"
												   :disabled="!$root.permissions['stores images update']? true : false">
													<i class="fa fa-lg fa-pencil black-text"></i>
												</a>
											</el-tooltip>
										</div>
										<div class="padding-x-5">
											<el-tooltip content="Delete Image"
											            effect="light"
											            popper-class="tooltip-in-modal">
												<a class="btn btn-circle btn-icon-only btn-default"
												   @click="deleteMode(image)"
												   :disabled="!$root.permissions['stores images update']? true : false">
													<i class="fa fa-lg fa-trash black-text"></i>
												</a>
											</el-tooltip>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div :class="{'col-md-4': images.length, 'col-md-12': !images.length}">
							<div v-show="!images.length"
							     class="alert alert-info center">
								<h4>No Images</h4>
								<p>This store doesn't have any images yet. Add the first one by clicking the plus button below.</p>
							</div>
							<div class="add-container">
								<el-tooltip content="Add Image"
								            effect="light"
								            popper-class="tooltip-in-modal">
									<a class="btn btn-circle btn-icon-only btn-edit"
									   @click="createMode()"
									   :disabled="!$root.permissions['stores images update']? true : false">
										<i class="fa fa-lg fa-plus black-text"></i>
									</a>
								</el-tooltip>
							</div>
						</div>
					</div>
					<!-- LIST END -->
					<!-- PREVIEW START -->
					<div class="col-md-12"
					     v-if="mode === 'preview'">
						<div class="preview-container">
							<img class="preview-image"
							     :src="imageToPreview.url">
						</div>
					</div>
					<!-- PREVIEW END -->
					<!-- CREATE START -->
					<div class="col-md-12"
					     v-show="mode === 'create'">
						<div class="row"
						     v-show="!selectNew">
							<div class="col-md-3">
								<div class="preview-container">
									<img :src="imageToCreate.url"
									     @click="selectNew = true"
									     class="preview-image">
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="order"
									       type="text"
									       class="form-control input-sm"
									       :class="{'edited': imageToCreate.order.length}"
									       id="form_control_1"
									       v-model="imageToCreate.order">
									<label for="form_control_1">Order</label>
								</div>
								<label>Default</label><br>
								<el-switch v-model="imageToCreate.default"
								           active-color="#0c6"
								           inactive-color="#ff4949"
								           :active-value="1"
								           :inactive-value="0"
								           active-text="Yes"
								           inactive-text="No">
								</el-switch>
							</div>
							<div class="col-md-12">
								<button class="btn btn-primary margin-top-15 pull-right"
								        @click="createImage()">
									Create
								</button>
							</div>
						</div>
						<resource-picker v-show="selectNew"
						                 @selected="updateImageToCreate"
						                 :noButton="true"
						                 :showDoneButton="false"
						                 :imageUrl="imageToCreate.url"
						                 class="margin-top-15">
						</resource-picker>
					</div>
					<!-- CREATE END -->
					<!-- EDIT START -->
					<div class="col-md-12"
					     v-if="mode === 'edit'">
						<div class="row"
						     v-show="!selectEdited">
							<div class="col-md-3">
								<div class="preview-container">
									<img :src="imageToEdit.url"
									     @click="selectEdited = true"
									     class="preview-image">
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input ref="order"
									       type="text"
									       class="form-control input-sm"
									       :class="{'edited': imageToEdit.order.length}"
									       id="form_control_1"
									       v-model="imageToEdit.order">
									<label for="form_control_1">Order</label>
								</div>
								<label>Default</label><br>
								<el-switch v-model="imageToEdit.default"
								           active-color="#0c6"
								           inactive-color="#ff4949"
								           :active-value="1"
								           :inactive-value="0"
								           active-text="Yes"
								           inactive-text="No">
								</el-switch>
							</div>
							<div class="col-md-12">
								<button class="btn btn-primary margin-top-15 pull-right"
								        @click="editImage()">
									Save
								</button>
							</div>
						</div>
						<resource-picker v-show="selectEdited"
						                 @selected="updateImageToEdit"
						                 :noButton="true"
						                 :imageUrl="imageToEdit.url"
						                 class="margin-top-15">
						</resource-picker>
					</div>
					<!-- EDIT END -->
					<!-- DELETE START -->
					<div class="col-md-12"
					     v-if="mode === 'delete'">
						<div class="col-md-12">
							<div class="delete-preview-container">
								<img class="preview-image"
								     :src="imageToDelete.url">
							</div>
							<p class="center margin-top-10 margin-bottom-0">Are you sure you want to delete this image?</p>
						</div>
					</div>
					<!-- DELETE END -->
				</div>
			</div>
		</div>
		<div v-show="mode !== 'create' && mode !== 'edit'">
			<div class="row">
				<div class="col-md-12">
					<button v-show="mode === 'delete'"
					        @click="deleteImage()"
					        type="button"
					        class="btn blue pull-right"
									:disabled="deleting">
						Delete
					<i v-show="deleting"
					   class="fa fa-spinner fa-pulse fa-fw">
					</i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import LoadingScreen from '@/components/modules/LoadingScreen'
import StoresFunctions from '@/controllers/Stores'
import ajaxErrorHandler from '@/controllers/ErrorController'
import ResourcePicker from '@/components/modules/ResourcePicker'
import ImagePlaceholder from '@/assets/img/app/image-placeholder.png'

export default {
	data: () => ({
		mode: 'list',
		imagesErrorMessage: '',
		loadingImages: false,
		images: [],
		imageToPreview: {
			id: null
		},
		imageToCreate: {
			url: ImagePlaceholder,
			order: '',
			type: 'image',
			default: 0
		},
		selectNew: false,
		imageToEdit: {},
		imageToDelete: {},
		deleting: false,
		selectEdited: false
	}),
	props: {
		storeId: {
			type: Number,
			required: true,
			default: () => null
		}
	},
	created () {
		this.getStoreImages()
	},
	methods: {
		/**
		 * To get images for the store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreImages () {
			this.loadingImages = true
			var imagesVue = this
			imagesVue.images = []
			return StoresFunctions.getStoreImages(
				imagesVue.$root.appId,
				imagesVue.$root.appSecret,
				imagesVue.$root.userToken,
				imagesVue.storeId
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						imagesVue.images = response.payload.images
						imagesVue.loadingImages = false
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not fetch images for ${
							imagesVue.storeToBeEdited.name
						}`,
						errorName: 'imagesErrorMessage',
						vue: imagesVue
					})
				})
		},
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
		 * To determine the tooltip text
		 * @function
		 * @param {integer} isDefault - The default status of the image
		 * @returns {string} - The tooltip text
		 */
		defaultButtonText (isDefault) {
			return isDefault ? 'Remove Default' : 'Make Default'
		},
		/**
		 * To set the active image.
		 * @function
		 * @param {object} image - The selected image.
		 * @returns {undefined}
		 */
		previewMode (image) {
			this.clearError('imagesErrorMessage')
			this.imageToPreview = image
			this.mode = 'preview'
		},
		/**
		 * To open the create interface
		 * @function
		 * @returns {undefined}
		 */
		createMode () {
			this.clearError('imagesErrorMessage')
			this.mode = 'create'
			this.selectNew = true
			this.$nextTick(function () {
				this.$refs.order.focus()
			})
		},
		/**
		 * To replace the url with the selected url
		 * @function
		 * @param {object} image - The image to edit
		 * @returns {undefined}
		 */
		updateImageToCreate (image) {
			this.imageToCreate.url = image.image_url
			this.selectNew = false
		},
		/**
		 * To validate new image data before submitting
		 * @function
		 * @returns {undefined}
		 */
		validateImageToCreate () {
			var imagesVue = this
			return new Promise(function (resolve, reject) {
				if (!$.isNumeric(imagesVue.imageToCreate.order)) {
					reject('Order must be a number')
				} else if (!imagesVue.imageToCreate.url.length) {
					reject('Select an image')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To add an image to a store
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createImage () {
			const imagesVue = this
			this.clearError('imagesErrorMessage')
			return imagesVue
				.validateImageToCreate()
				.then(response => {
					return StoresFunctions.createStoreImage(
						imagesVue.$root.appId,
						imagesVue.$root.appSecret,
						imagesVue.$root.userToken,
						imagesVue.storeId,
						imagesVue.imageToCreate
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								imagesVue.images = response.payload.images
								imagesVue.mode = 'list'
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: `We could not set the image as default`,
								errorName: 'imagesErrorMessage',
								vue: imagesVue
							})
						})
				})
				.catch(reason => {
					imagesVue.imagesErrorMessage = reason
					imagesVue.$scrollTo(imagesVue.$refs.imagesErrorMessage, 1000, {
						offset: -50
					})
				})
		},
		/**
		 * To reset the create form
		 * @function
		 * @returns {undefined}
		 */
		clearCreateForm () {
			this.imageToCreate = {
				url: '',
				order: '',
				type: 'image',
				default: 0
			}
		},
		/**
		 * To open the main list interface
		 * @function
		 * @param {object} image - The image to edit
		 * @returns {undefined}
		 */
		listMode () {
			if (this.mode === 'create') {
				this.clearCreateForm()
			} else if (this.mode === 'edit') {
				this.clearEditForm()
			}
			this.clearError('imagesErrorMessage')
			this.mode = 'list'
		},
		/**
		 * To set an image as the default image
		 * @function
		 * @param {object} image - The image to make default
		 * @returns {undefined}
		 */
		flipDefault (image) {
			this.imageToEdit = {
				...image,
				default: Number(image.default) === 1 ? 0 : 1
			}
			this.editImage()
		},
		/**
		 * To open the image edit interface
		 * @function
		 * @param {object} image - The image to edit
		 * @returns {undefined}
		 */
		editMode (image) {
			this.clearError('imagesErrorMessage')
			this.imageToEdit = {
				...image,
				order: String(image.order)
			}
			this.mode = 'edit'
		},
		/**
		 * To replace the url with the selected url
		 * @function
		 * @param {object} image - The image to edit
		 * @returns {undefined}
		 */
		updateImageToEdit (image) {
			this.imageToEdit.url = image.image_url
			this.selectEdited = false
		},
		/**
		 * To validate new image data before submitting
		 * @function
		 * @returns {undefined}
		 */
		validateImageToEdit () {
			var imagesVue = this
			return new Promise(function (resolve, reject) {
				if (!$.isNumeric(imagesVue.imageToEdit.order)) {
					reject('Order must be a number')
				} else if (!imagesVue.imageToEdit.url.length) {
					reject('Select an image')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update image data in the backend
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		editImage () {
			var imagesVue = this
			this.clearError('imagesErrorMessage')
			return imagesVue
				.validateImageToEdit()
				.then(response => {
					return StoresFunctions.updateStoreImage(
						imagesVue.$root.appId,
						imagesVue.$root.appSecret,
						imagesVue.$root.userToken,
						imagesVue.storeId,
						imagesVue.imageToEdit
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								imagesVue.images = response.payload.images
								imagesVue.mode = 'list'
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: `We could not update the image`,
								errorName: 'imagesErrorMessage',
								vue: imagesVue
							})
						})
				})
				.catch(reason => {
					imagesVue.imagesErrorMessage = reason
					imagesVue.$scrollTo(imagesVue.$refs.imagesErrorMessage, 1000, {
						offset: -50
					})
				})
		},
		/**
		 * To reset the edit form
		 * @function
		 * @returns {undefined}
		 */
		clearEditForm () {
			this.imageToEdit = {}
		},
		/**
		 * To open the delete interface
		 * @function
		 * @param {object} image - The image to delete
		 * @returns {undefined}
		 */
		deleteMode (image) {
			this.clearError('imagesErrorMessage')
			this.imageToDelete = image
			this.mode = 'delete'
		},
		/**
		 * To delete the image
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		deleteImage () {
			this.deleting = true
			var imagesVue = this
			this.clearError('imagesErrorMessage')
			return StoresFunctions.deleteStoreImage(
				imagesVue.$root.appId,
				imagesVue.$root.appSecret,
				imagesVue.$root.userToken,
				imagesVue.storeId,
				imagesVue.imageToDelete.id
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						if (response.payload && response.payload.pending_approval !== true) {
							imagesVue.images = imagesVue.images.filter(image => {
								return image.id !== imagesVue.imageToDelete.id
							})
						}
						imagesVue.showDeleteSuccess(response.payload)
						imagesVue.mode = 'list'
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: `We could not delete the image`,
						errorName: 'imagesErrorMessage',
						vue: imagesVue
					})
				})
				.finally(() => {
					imagesVue.deleting = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showDeleteSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Image has been deleted'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The removal has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		}
	},
	components: {
		ResourcePicker,
		LoadingScreen
	}
}
</script>

<style>
.actions-under-image {
  width: 100%;
  padding: 5px 0 0 0;
  display: flex;
  justify-content: center;
}
.custom-tile-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
.custom-tile-body-img {
  width: auto !important;
  height: auto !important;
  min-width: auto !important;
  min-height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
  margin-right: 0 !important;
}
.preview-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-image {
  max-width: 100%;
  max-height: 100%;
}
.add-container {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.delete-preview-container {
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.black-text {
  color: #333;
}
.margin-bottom-0 {
  margin-bottom: 0;
}
.padding-x-5 {
  padding: 0 3px 0 3px;
}
</style>
