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
					>
					</resource-picker>
				</div>
			</div>
			<div class="row margin-top-20" v-show="previewMode">
				<div class="col-xs-12 text-center">
					<img :src="image">
				</div>
				<div class="col-xs-12">
					<button 
						type="button" 
						class="btn btn-default pull-right" 
						@click="closePreview()"
					>
						Close
					</button>					
				</div>
			</div>
		</div>
    </div>
</template>

<script>
import Breadcrumb from '../modules/Breadcrumb'
import NoResults from '../modules/NoResults'
import LoadingScreen from '../modules/LoadingScreen'
import ResourcePicker from '../modules/ResourcePicker'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Gallery', link: false}
			],
			galleryData: [],
			image: '',
			previewMode: false,
			newFolder: {
				name: '',
				is_shared: false
			},
			parentFolderId: 0,
			createErrorMessage: ''
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
			this.image = val.image_url
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
		}
	},
	watch: {},
	components: {
		Breadcrumb,
		NoResults,
		LoadingScreen,
		ResourcePicker
	}
}
</script>

<style scoped>
img {
	max-height: 80vh;
	max-width: 100%;
}
</style>
