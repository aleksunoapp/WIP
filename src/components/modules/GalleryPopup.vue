<template>
	<div>
		<div class="row">	
			<div class="col-xs-12 margin-bottom-10">
				<div class="col-xs-12">
					<el-dropdown trigger="click" @command="selectFolder" size="mini" :show-timeout="50" :hide-timeout="50">
						<el-button size="mini">
							{{ activeFolder.name || 'All Images' }}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command="{}">
								All Images
							</el-dropdown-item>
							<el-dropdown-item v-for="folder in galleryFolders" :command="folder" :key="folder.id">
								{{ folder.name }}
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
		</div>		
		<div class="images-container">
			<loading-screen :show="displayImages" :color="'#2C3E50'" :display="'inline'"></loading-screen>
			<div v-if="!displayImages">
				<div class="tiles margin-top-10" v-if="!activeFolder.id">
		    		<div v-if="allImages.length" class="col-md-4 center-x" v-for="image in allImages" :id="'image-' + image.id">
		        		<div class="tile image selected" @click="selectImage(image)" @keyup.enter="selectImage(image)" @dblclick="selectAndEmit(image)" tabindex="0" :class="{'active': image.id === selectedImage.id}">
		        			<div class="corner" v-if="image.id === selectedImage.id"> </div>
		        			<div class="check" v-if="image.id === selectedImage.id"> </div>
		                    <div class="tile-body custom-tile-body">
		                        <img class="custom-tile-body-img" :src="image.image_url" alt="">
		                    </div>
		                </div>
		                <h4 class="tile-width">
		    				<span>{{ image.name }}</span>
		    			</h4>
		    		</div>
		    		<div v-if="!allImages.length">
						<no-results :show="!allImages.length" :type="'images'"></no-results>
					</div>
		    	</div>
		    	<div class="tiles margin-top-10" v-else>
					<div v-if="folderImages.length" class="col-md-4 margin-bottom-30" v-for="folderImage in folderImages" :id="'folderImage-' + folderImage.id">
						<div class="tile image selected" @click="selectImage(folderImage)" @keyup.enter="selectImage(image)" @dblclick="selectAndEmit(image)" tabindex="0" :class="{'active': folderImage.id === selectedImage.id}">
			    			<div class="corner" v-if="folderImage.id === selectedImage.id"> </div>
			    			<div class="check" v-if="folderImage.id === selectedImage.id"> </div>
			                <div class="tile-body custom-tile-body">
			                    <img class="custom-tile-body-img" :src="folderImage.image_url" alt="">
			                </div>
			            </div>
			            <h4 class="tile-width">
							<span>{{ folderImage.name }}</span>
						</h4>
					</div>
					<div v-if="!folderImages.length">
						<no-results :show="!folderImages.length" :type="'images'"></no-results>
					</div>
		    	</div>
			</div>
		</div>
		<div class="clear">
			<button type="button" class="pull-right btn btn-primary" @click="emitSelectedImage()">Select</button>
		</div>
	</div>
</template>

<script>
import Dropdown from './Dropdown'
import NoResults from './NoResults'
import LoadingScreen from './LoadingScreen'
import GalleryFunctions from '../../controllers/Gallery'

export default {
	data () {
		return {
			galleryFolders: [],
			allImages: [],
			folderImages: [],
			activeFolder: {},
			selectedImage: {},
			displayImages: false
		}
	},
	mounted () {
		this.getGalleryFolders()
		this.getAllImages()
	},
	methods: {
		/**
		 * To get all the folders.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGalleryFolders () {
			this.galleryFolders = []
			var galleryPopupVue = this
			return GalleryFunctions.getGalleryFolders(galleryPopupVue.$root.appId, galleryPopupVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					galleryPopupVue.galleryFolders = response.payload
				} else {
					galleryPopupVue.errorMessage = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					galleryPopupVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get all the images irrespective of the folder.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllImages () {
			this.displayImages = true
			this.allImages = []
			var galleryPopupVue = this
			return GalleryFunctions.getAllImages(galleryPopupVue.$root.appId, galleryPopupVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					setTimeout(function () {
						galleryPopupVue.displayImages = false
					}, 1000)
					galleryPopupVue.allImages = response.payload
				} else {
					setTimeout(function () {
						galleryPopupVue.displayImages = false
					}, 1000)
					galleryPopupVue.errorMessage = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					galleryPopupVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To get all the images for a particular folder.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getImagesForFolder () {
			this.displayImages = true
			this.folderImages = []
			var galleryPopupVue = this
			return GalleryFunctions.getFolderImages(galleryPopupVue.activeFolder.id, galleryPopupVue.$root.appId, galleryPopupVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					setTimeout(function () {
						galleryPopupVue.displayImages = false
					}, 1000)
					galleryPopupVue.folderImages = response.payload
				} else {
					setTimeout(function () {
						galleryPopupVue.displayImages = false
					}, 1000)
					galleryPopupVue.errorMessage = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					galleryPopupVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To set the active folder.
		 * @function
		 * @param {object} folder - The selected folder.
		 * @returns {undefined}
		 */
		selectFolder (folder) {
			this.activeFolder = folder
			if (folder.id !== undefined) {
				this.getImagesForFolder()
			}
		},
		/**
		 * To set the active image.
		 * @function
		 * @param {object} image - The selected image.
		 * @returns {undefined}
		 */
		selectImage (image) {
			this.selectedImage = image
		},
		/**
		 * To emit the selected image to the parent.
		 * @function
		 * @returns {undefined}
		 */
		emitSelectedImage () {
			if (this.selectedImage.id) {
				this.$emit('selectedImage', this.selectedImage)
			}
		},
		/**
		 * To set the selected image and emit it to the parent.
		 * @function
		 * @param {object} image - The selected image.
		 * @returns {undefined}
		 */
		selectAndEmit (image) {
			this.selectImage(image)
			this.emitSelectedImage()
		}
	},
	components: {
		Dropdown,
		NoResults,
		LoadingScreen
	}
}
</script>

<style scoped>
.center-x {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.tiles .tile.selected.active {
	border-color: rgba(55, 183, 217, 1) !important;
}
.images-container {
	min-height: 200px;
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
}
.custom-tile-body {
	display: flex;
	justify-content: center;
	align-items: center;
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
</style>
