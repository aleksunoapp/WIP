<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
	    <h1 class="page-title">Images</h1>
	    <!-- END PAGE TITLE-->
		<div class="note note-info">
            <p>Manage a folder's images.</p>
        </div>
        <!-- BEGIN CREATE NEW MENU-->
        <div class="portlet box blue-hoki">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreateImagePanel()">
				<div class="custom  tools">
					<a :class="{'expand': !createImageCollapse, 'collapse': createImageCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Add A New Image
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createImageCollapse}">
      			<form role="form" @submit.prevent="saveNewImage()">
      				<div class="form-body row">
      					<div class="col-md-12">
			        		<div class="alert alert-danger" v-if="errorMessage.length">
			        		    <button class="close" data-close="alert" @click="clearError()"></button>
			        		    <span>{{errorMessage}}</span>
			        		</div>
			        	</div>
		        		<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" :class="{'edited': newImage.name.length}" id="form_control_1" v-model="newImage.name">
							    <label for="form_control_1">Image Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
							    <input type="text" class="form-control input-sm" :class="{'edited': newImage.image_url.length}" id="form_control_2" v-model="newImage.image_url">
							    <label for="form_control_2">Image URL</label>
							</div>
		        		</div>
		        	</div>
      				<div class="form-actions right margin-top-20">
						<button type="submit" class="btn blue">Create</button>
					</div>
      			</form>
  			</div>
        </div>
        <!-- END CREATE NEW MENU-->
        <loading-screen :show="displayImages" :color="'#2C3E50'" :display="'inline'"></loading-screen>
        <div v-if="images.length && !displayImages">
		    <div class="portlet light portlet-fit bordered margin-top-20">
		        <div class="portlet-title bg-blue-chambray">
		        	<div class="menu-image">
		        		<img :src="folderDetails.cover_image">
		        	</div>
		            <div class="caption">
		                <span class="caption-subject font-green bold uppercase">{{ folderDetails.name }}</span>
		                <div class="caption-desc font-grey-cascade">Click on the edit icon to change the details of an image.</div>
		            </div>
		        </div>
		        <div class="portlet-body">
		        	<div class="tiles">
		        		<div class="col-md-3" v-for="image in images" :id="'image-' + image.id">
    		        		<div class="tile image selected">
    		        			<div class="corner"> </div>
                        		<div class="check clickable" @click="showEditImageModal(image, $event)"> </div>
                                <div class="tile-body">
                                    <img :src="image.image_url" alt="">
                                </div>
                            </div>
                            <h4 class="tile-width">
		        				<span>{{ image.name }}</span>
		        			</h4>
		        		</div>
		        	</div>
		        </div>
		    </div>
        </div>
        <div v-if="!images.length && !displayImages">
        	<no-results :show="!images.length" :type="'images'"></no-results>
        </div>
        <edit-image v-if="displayEditImageModal" :passedImageId="passedImageId" :passedFolderId="passedFolderId" @updateImage="updateImage" @closeEditImageModal="closeEditImageModal"></edit-image>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../modules/Breadcrumb'
import NoResults from '../modules/NoResults'
import LoadingScreen from '../modules/LoadingScreen'
import GalleryFunctions from '../../controllers/Gallery'
import EditImage from './GalleryImages/EditImage'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Gallery', link: '/app/gallery'},
				{name: 'Images', link: false}
			],
			displayImages: false,
			images: [],
			errorMessage: '',
			displayEditImageModal: false,
			passedImageId: 0,
			passedFolderId: this.$route.params.folder_id,
			folderDetails: [],
			createImageCollapse: true,
			newImage: {
				name: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				gallery_id: this.$route.params.folder_id
			}
		}
	},
	mounted () {
		this.getFolderDetails()
		this.getFolderImages()
	},
	methods: {
		/**
		 * To get the details of the selected folder.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getFolderDetails () {
			var galleryImagesVue = this
			return GalleryFunctions.getGalleryFolderDetails(galleryImagesVue.$route.params.folder_id, galleryImagesVue.$root.appId, galleryImagesVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					galleryImagesVue.folderDetails = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					galleryImagesVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get a list of menus for the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getFolderImages () {
			this.displayImages = true
			this.images = []
			var galleryImagesVue = this
			return GalleryFunctions.getFolderImages(galleryImagesVue.$route.params.folder_id, galleryImagesVue.$root.appId, galleryImagesVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					galleryImagesVue.displayImages = false
					galleryImagesVue.images = response.payload
				} else {
					galleryImagesVue.displayImages = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					galleryImagesVue.$router.push('/login/expired')
					return
				}
				galleryImagesVue.displayImages = false
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To show the modal for editing details of an image.
		 * @function
		 * @param {object} image - The selected image object.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		showEditImageModal (image, event) {
			event.stopPropagation()
			this.passedImageId = image.id
			this.displayEditImageModal = true
		},
		/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateImageData () {
			var addImageVue = this
			return new Promise(function (resolve, reject) {
				if (!addImageVue.newImage.name.length) {
					reject('Image name cannot be blank')
				} else if (!addImageVue.newImage.image_url.length) {
					reject('Image URL cannot be blank')
				} else if (!$.isNumeric(addImageVue.newImage.status)) {
					reject('Image status cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To add the new folder to the gallery and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		saveNewImage () {
			var addImageVue = this
			addImageVue.clearError()

			return addImageVue.validateImageData()
			.then(response => {
				GalleryFunctions.saveNewImage(addImageVue.newImage, addImageVue.$root.appId, addImageVue.$root.appSecret, addImageVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						addImageVue.newImage.id = response.payload.new_image_id
						addImageVue.addImage(addImageVue.newImage)
					} else {
						addImageVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						addImageVue.$router.push('/login/expired')
						return
					}
					addImageVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				addImageVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To clear the new menu form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewImage () {
			this.newImage = {
				name: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				gallery_id: this.$route.params.folder_id
			}
		},
		/**
		 * To add the image to the list.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		addImage (val) {
			this.images.push(val)
			this.showAlert()
			this.clearNewImage()
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Image \'' + this.newImage.name + '\' has been successfully added!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To update the image according to the emitted value.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.displayEditImageModal = false
			for (var i = 0; i < this.images.length; i++) {
				if (this.images[i].id === val.id) {
					this.images[i] = val
				}
			}
		},
		/**
		 * To close the modal for editing the detils of an image.
		 * @function
		 * @returns {undefined}
		 */
		closeEditImageModal () {
			this.displayEditImageModal = false
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To toggle the create menu panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateImagePanel () {
			this.createImageCollapse = !this.createImageCollapse
		}
	},
	watch: {},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		EditImage
	}
}
</script>

<style scoped>
</style>
