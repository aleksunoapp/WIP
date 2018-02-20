<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
	    <h1 class="page-title">Gallery</h1>
	    <!-- END PAGE TITLE-->
		<div class="note note-info">
            <p>Add and manage an application's gallery folders and images.</p>
        </div>
        <!-- BEGIN CREATE NEW MENU-->
        <div class="portlet box blue-hoki">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreateFolderPanel()">
				<div class="custom tools">
					<a :class="{'expand': !createGalleryFolderCollapse, 'collapse': createGalleryFolderCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Create A New Gallery Folder
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createGalleryFolderCollapse}">
      			<form role="form" @submit.prevent="createNewFolder()">
      				<div class="form-body row">
      					<div class="col-md-12">
			        		<div class="alert alert-danger" v-if="errorMessage.length">
			        		    <button class="close" data-close="alert" @click="clearError()"></button>
			        		    <span>{{errorMessage}}</span>
			        		</div>
			        	</div>
		        		<div class="col-md-6">
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newFolder.name.length}" id="form_control_1" v-model="newFolder.name">
		        			    <label for="form_control_1">Folder Name</label>
		        			</div>
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newFolder.cover_image.length}" id="form_control_2" v-model="newFolder.cover_image">
		        			    <label for="form_control_2">Folder Image</label>
		        			</div>
		        		</div>
		        		<div class="col-md-6">
		        			<div class="form-group form-md-line-input form-md-floating-label">
		        			    <input type="text" class="form-control input-sm" :class="{'edited': newFolder.description.length}" id="form_control_3" v-model="newFolder.description">
		        			    <label for="form_control_3">Folder Description</label>
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
        <loading-screen :show="displayGalleryData" :color="'#2C3E50'" :display="'inline'"></loading-screen>
        <div v-if="galleryData.length && !displayGalleryData">
		    <div class="portlet light portlet-fit bordered margin-top-20">
		        <div class="portlet-title bg-blue-chambray">
		        	<div class="menu-image-main">
		        		<img src="../../../static/client_logo.png">
		        	</div>
		            <div class="caption">
		                <span class="caption-subject font-green bold uppercase">Gallery</span>
                        <div class="caption-desc font-grey-cascade">Click on a folder to view its images.</div>
		            </div>
		        </div>
		        <div class="portlet-body">
		        	<div class="tiles">
		        		<div class="col-md-3 margin-bottom-30" v-for="folder in galleryData" :id="'folder-' + folder.id">
    		        		<div class="tile bg-blue-hoki image selected" @click="openFolder(folder)">
    		        			<div class="corner"> </div>
                        		<div class="check clickable" @click="showEditFolderModal(folder, $event)"> </div>
                                <div class="tile-body">
                                    <img :src="folder.cover_image" alt="">
                                </div>
                                <div class="tile-object">
                                    <div class="name"> {{ folder.name }} </div>
                                </div>
                            </div>
		        		</div>
		        	</div>
		        </div>
		    </div>
        </div>
        <div v-if="!galleryData.length && !displayGalleryData">
        	<no-results :show="!galleryData.length" :type="'folders'"></no-results>
        </div>
        <edit-folder v-if="displayEditFolderModal" :passedFolderId="passedFolderId" @closeEditFolderModal="closeEditFolderModal" @updateFolder="updateFolder"></edit-folder>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../modules/Breadcrumb'
import NoResults from '../modules/NoResults'
import LoadingScreen from '../modules/LoadingScreen'
import GalleryFunctions from '../../controllers/Gallery'
import EditFolder from './Gallery/EditFolder'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Gallery', link: false}
			],
			displayGalleryData: false,
			galleryData: [],
			errorMessage: '',
			displayEditFolderModal: false,
			passedFolderId: 0,
			createGalleryFolderCollapse: true,
			newFolder: {
				name: '',
				description: '',
				cover_image: '',
				user_id: this.$root.createdBy,
				status: 1
			}
		}
	},
	mounted () {
		this.getGalleryFolders()
	},
	methods: {
		/**
		 * To get a list of menus for the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGalleryFolders () {
			this.displayGalleryData = true
			this.galleryData = []
			var galleryVue = this
			return GalleryFunctions.getGalleryFolders(galleryVue.$root.appId, galleryVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					galleryVue.displayGalleryData = false
					galleryVue.galleryData = response.payload
				} else {
					galleryVue.displayGalleryData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					galleryVue.$router.push('/login/expired')
					return
				}
				galleryVue.displayGalleryData = false
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To show the modal for editing a gallery folder.
		 * @function
		 * @param {object} folder - The folder object that is to be edited.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		showEditFolderModal (folder, event) {
			event.stopPropagation()
			this.passedFolderId = folder.id
			this.displayEditFolderModal = true
		},
		/**
		 * To close the modal for editing a gallery folder.
		 * @function
		 * @returns {undefined}
		 */
		closeEditFolderModal () {
			this.displayEditFolderModal = false
		},
		/**
		 * To clear the new gallery folder form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewFolder () {
			this.newFolder = {
				name: '',
				description: '',
				cover_image: '',
				user_id: this.$root.createdBy,
				status: 1
			}
		},
				/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateFolderData () {
			var createFolderVue = this
			return new Promise(function (resolve, reject) {
				if (!createFolderVue.newFolder.name.length) {
					reject('Folder name cannot be blank')
				} else if (!createFolderVue.newFolder.description.length) {
					reject('Folder description cannot be blank')
				} else if (!createFolderVue.newFolder.cover_image.length) {
					reject('Folder image URL cannot be blank')
				} else if (!$.isNumeric(createFolderVue.newFolder.status)) {
					reject('Folder status cannot be blank')
				}
				resolve('Hurray')
			})
		},
		createNewFolder () {
			var createFolderVue = this
			createFolderVue.clearError()

			return createFolderVue.validateFolderData()
			.then(response => {
				GalleryFunctions.createNewFolder(createFolderVue.newFolder, createFolderVue.$root.appId, createFolderVue.$root.appSecret, createFolderVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						createFolderVue.newFolder.id = response.payload.new_gallery
						createFolderVue.addFolder(createFolderVue.newFolder)
					} else {
						createFolderVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						createFolderVue.$router.push('/login/expired')
						return
					}
					createFolderVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				createFolderVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To add the newly created gallery folder to the list of folders.
		 * @function
		 * @param {object} folder - The folder object that is to be added.
		 * @returns {undefined}
		 */
		addFolder (folder) {
			this.galleryData.push(folder)
			this.showAlert()
			this.clearNewFolder()
		},
		/**
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Gallery folder \'' + this.newFolder.name + '\' has been successfully added!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To update the gallery folder info.
		 * @function
		 * @param {object} folder - The folder object that is to be updated.
		 * @returns {undefined}
		 */
		updateFolder (folder) {
			this.displayEditFolderModal = false
			for (var i = 0; i < this.galleryData.length; i++) {
				if (this.galleryData[i].id === folder.id) {
					this.galleryData[i] = folder
				}
			}
		},
		/**
		 * To route to the images page.
		 * @function
		 * @param {object} folder - The selected folder.
		 * @returns {undefined}
		 */
		openFolder (folder) {
			this.$router.push('/app/gallery/' + folder.id + '/images')
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
		toggleCreateFolderPanel () {
			this.createGalleryFolderCollapse = !this.createGalleryFolderCollapse
		}
	},
	watch: {},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		EditFolder
	}
}
</script>

<style>
.tiles .tile .tile-body > div {
    height: 80px;
    background-size: cover;
    background-repeat: no-repeat;
    background-size: 100%;
}
.tile-width {
	width: 127px;
	text-align: center;
}
.tile-width > span {
	max-width: 90%;
	height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    font-size: 13px;
}
.tiles .tile.image .corner:after {
	z-index: 1;
}
.tiles .tile.image.selected .check:after {
	z-index: 1;
	content: "\f040";
	color: #000;
}
.tiles .tile.image.selected.active .check:after {
	content: "\F00C";
}
.tiles .tile.image.selected.active .corner:after {
	border-right: 40px solid rgba(55, 183, 217, 1);
}
</style>
