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
            <p>Preview and upload images.</p>
        </div>
		<div class="portlet-body">
			<div class="row" v-show="!previewMode">
				<div class="col-md-12">
					<resource-picker 
						:noButton="true"
						@selected="updateImage"
						:showDoneButton="false"
						:imageButton="false"
						:selectOnly="false"
						:key="pickerKey"
					>
					</resource-picker>
				</div>
			</div>
			<div class="row margin-top-20" v-show="previewMode">
				<div class="col-xs-12 text-center">
					<img :src="image.image_url">
				</div>
				<div class="col-xs-12">
					<button 
						type="button" 
						class="btn btn-default pull-right" 
						@click="closePreview()"
					>
						Close
					</button>
					<button 
						v-if="$root.permissions['gallery delete']"
						type="button" 
						class="btn btn-outline blue pull-right margin-right-10" 
						@click="openDeleteModal()"
					>
						Delete
					</button>
				</div>
			</div>
		</div>

		<!-- DELETE IMAGE MODAL START -->
		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Delete Image</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="deleteErrorMessage.length" ref="deleteErrorMessage">
					<button class="close" @click="clearDeleteErrorMessage()"></button>
					<span>{{deleteErrorMessage}}</span>
				</div>
				<p>Are you sure you want to delete this image?</p>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-primary" @click="deleteImage()">Delete</button>
			</div>
		</modal>
		<!-- DELETE IMAGE MODAL END -->
    </div>
</template>

<script>
import Breadcrumb from '../modules/Breadcrumb'
import NoResults from '../modules/NoResults'
import LoadingScreen from '../modules/LoadingScreen'
import ResourcePicker from '../modules/ResourcePicker'
import ResourcesFunctions from '@/controllers/Resources'
import ajaxErrorHandler from '@/controllers/ErrorController'
import Modal from '@/components/modules/Modal'
import global from '@/global'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Gallery', link: false}
			],
			image: {
				image_url: ''
			},
			previewMode: false,
			pickerKey: 1,
			deleteErrorMessage: '',
			showDeleteModal: false
		}
	},
	methods: {
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {object} val - The open / closed value of the picker
		 * @returns {undefined}
		 */
		toggleImageMode (val) {
			this.previewMode = val
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.image = val
			this.toggleImageMode(true)
		},
		/**
		 * To close the resource modal
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		closePreview () {
			this.previewMode = false
		},
		openDeleteModal () {
			this.showDeleteModal = true
		},
		closeDeleteModal () {
			this.deleteErrorMessage = ''
			this.showDeleteModal = false
		},
		clearDeleteErrorMessage () {
			this.deleteErrorMessage = ''
		},
		deleteImage () {
			let galleryVue = this
			return ResourcesFunctions.deleteResource(global.resourcesBusinessId, galleryVue.image.id).then(response => {
				galleryVue.closeDeleteModal()
				galleryVue.confirmDelete()
				galleryVue.pickerKey++
				galleryVue.previewMode = false
				galleryVue.image = {image_url: ''}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not delete the image',
					errorName: 'deleteErrorMessage',
					vue: galleryVue
				})
			})
		},
		/**
		 * To notify user that the operation succeeded.
		 * @function
		 * @returns {undefined}
		 */
		confirmDelete () {
			this.$swal({
				title: 'Success',
				text: 'Image deleted',
				type: 'success',
				confirmButtonText: 'OK'
			})
		}
	},
	watch: {},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		ResourcePicker,
		Modal
	}
}
</script>

<style scoped>
img {
	max-height: 80vh;
	max-width: 100%;
}
</style>
