<template>
	<modal v-bind:show="showEditFeedModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center" v-if="!selectImageMode">Edit News Feed</h4>
			<h4 class="modal-title center" v-else><i class="fa fa-chevron-left clickable pull-left back-button" @click="goToPageOne()"></i>Select An Image</h4>
		</div>
		<div slot="modal-body" class="modal-body">
				<div class="col-xs-12">
				<div class="alert alert-danger" v-if="errorMessage.length">
					<button class="close" data-close="alert" @click="clearError()"></button>
					<span>{{errorMessage}}</span>
				</div>
			    <div v-if="!selectLocationMode" :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
					<resource-picker 
						@open="goToPageTwo()"
						@close="goToPageOne()"
						@selected="updateImage" 
						:imageButton="true"
						:imageUrl="newsToBeEdited.image"
						class="margin-top-15"
					>
					</resource-picker>
        		</div>
				    <div class="col-xs-12">        			
	    			 <select-locations-popup 
	    				v-if="selectLocationMode" 
	    				@closeSelectLocationsPopup='updateSelectedLocations' 
	    				:previouslySelected="selectedLocations"
	    			 >
					 </select-locations-popup>
        		</div>
				<div class="col-md-12" v-show="!selectImageMode && !selectLocationMode">
					<div class="form-group form-md-line-input form-md-floating-label">
						<input type="text" class="form-control input-sm edited" id="form_control_1" v-model="newsToBeEdited.title">
						<label for="form_control_1">News Feed Title</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
						<input type="text" class="form-control input-sm edited" id="form_control_2" v-model="newsToBeEdited.short_description">
						<label for="form_control_2">Short Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label">
						<textarea rows="5" class="form-control edited" id="form_control_3" v-model="newsToBeEdited.body"></textarea>
						<label for="form_control_3">News Feed Body</label>
					</div>
		      	</div>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button v-if="!selectImageMode" type="button" class="btn btn-primary" @click="saveEditedFeed()">Save</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import NewsFeedFunctions from '../../../controllers/NewsFeed'
import ResourcePicker from '../../modules/ResourcePicker'
export default {
	data () {
		return {
			showEditFeedModal: false,
			newsToBeEdited: {
				image: ''
			},
			errorMessage: '',
			selectImageMode: false
		}
	},
	props: {
		selectedFeedId: {
			type: Number
		}
	},
	created () {
		// get category details by category id passed as route param
		this.getNewsFeedDetails()
	},
	mounted () {
		this.showEditFeedModal = true
	},
	methods: {
		/**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateFeedData () {
			var editNewsFeedVue = this
			return new Promise(function (resolve, reject) {
				if (!editNewsFeedVue.newsToBeEdited.title.length) {
					reject('News Feed title cannot be blank')
				} else if (!editNewsFeedVue.newsToBeEdited.short_description.length) {
					reject('News Feed description cannot be blank')
				} else if (!editNewsFeedVue.newsToBeEdited.image.length) {
					reject('News Feed image URL cannot be blank')
				} else if (!editNewsFeedVue.newsToBeEdited.body.length) {
					reject('News Feed body cannot be blank')
				}
				resolve('Hurray')
			})
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
		 * To get the details of the category to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getNewsFeedDetails () {
			var editNewsFeedVue = this
			NewsFeedFunctions.getNewsFeedDetails(editNewsFeedVue.selectedFeedId, editNewsFeedVue.$root.userToken, editNewsFeedVue.$root.appId, editNewsFeedVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editNewsFeedVue.newsToBeEdited = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editNewsFeedVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To prompt the backend call that updates a news feed.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		saveEditedFeed () {
			var editNewsFeedVue = this
			editNewsFeedVue.clearError()

			return editNewsFeedVue.validateFeedData()
			.then(response => {
				NewsFeedFunctions.saveEditedFeed(editNewsFeedVue.newsToBeEdited, editNewsFeedVue.$root.userToken, editNewsFeedVue.$root.appId, editNewsFeedVue.$root.appSecret).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editNewsFeedVue.closeModalAndUpdate()
					} else {
						editNewsFeedVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editNewsFeedVue.$router.push('/login/expired')
						return
					}
					editNewsFeedVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editNewsFeedVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeEditFeedModal')
		},
		closeModalAndUpdate () {
			this.$emit('updateNewsFeed', this.newsToBeEdited)
		},
		/**
		 * To change the page to the gallery view on the modal.
		 * @function
		 * @returns {undefined}
		 */
		goToPageTwo () {
			this.selectImageMode = true
		},
		/**
		 * To change the page to the main/form view on the modal.
		 * @function
		 * @returns {undefined}
		 */
		goToPageOne () {
			this.selectImageMode = false
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.goToPageOne()
			this.newsToBeEdited.image = val.image_url
		}
	},
	components: {
		Modal,
		ResourcePicker
	}
}
</script>
