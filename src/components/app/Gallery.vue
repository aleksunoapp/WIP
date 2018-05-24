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
        <!-- BEGIN CREATE NEW MENU-->
			<div class="portlet-body">
      			<form role="form">
      				<div class="form-body row">
		        		<div :class="{'col-md-6 col-md-offset-3' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
							<resource-picker 
							    :noButton="true"
								@open="toggleImageMode('newMenu', true)"
								@close="toggleImageMode('newMenu', false)"
								@selected="updateImage"
								:imageButton="true"
								:imageUrl="newFolder.cover_image"
							>
							</resource-picker>
		        		</div>
		        	</div>
      				<div class="form-actions right margin-top-20" v-show="!imageMode.newMenu">
					<button type="button" class="btn btn-default pull-right" @click="closeResourceModal()">
					Close
				</button>
					</div>
      			</form>
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
			errorMessage: '',
			newFolder: {
				cover_image: ''
			},
			imageMode: {
				newMenu: false
			}

		}
	},
	methods: {
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {string} object - The name of the object the image is for
		 * @param {object} value - The open / closed value of the picker
		 * @returns {undefined}
		 */
		toggleImageMode (object, value) {
			this.imageMode[object] = value
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.newFolder.cover_image = val.image_url
		},
		/**
		 * To close the resource modal
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		closeResourceModal () {
			this.imageMode.newMenu = false
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

