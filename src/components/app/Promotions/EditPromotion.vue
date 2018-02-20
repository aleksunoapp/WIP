<template>
	<modal :show="showEditPromotionModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center" v-if="!selectImageMode">Update Promotion</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="page-one" v-if="!selectImageMode" :class="{'active': !selectImageMode, 'disabled': selectImageMode}">
				<div class="alert alert-danger" v-if="errorMessage.length">
				    <button class="close" data-close="alert" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
				<div class="col-md-3">
					<label>Promotion Icon</label>
					<div class="image-container clickable" v-if="!promotionToBeEdited.image">
						<img width="100" height="80" src="../../../assets/img/app/image-placeholder.png" @click="goToPageTwo()">
					</div>
					<div class="image-container clickable" v-else>
						<img width="100" height="80" :src="promotionToBeEdited.image" @click="goToPageTwo()">
					</div>
				</div>
				<div class="col-md-9">
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="promotionToBeEdited.name">
					    <label for="form_control_1">Promotion Name</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="promotionToBeEdited.description">
					    <label for="form_control_2">Promotion Description</label>
					</div>
					<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
					    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="promotionToBeEdited.external_url">
					    <label for="form_control_3">Promotion Link</label>
					</div>
        			<div class="form-group form-md-line-input form-md-floating-label">
        				<p>Promotion Start Date and Time</p>
	        			<el-date-picker v-model="promotionToBeEdited.start_date" type="datetime" placeholder="Select end"></el-date-picker>
        			</div>
        			<div class="form-group form-md-line-input form-md-floating-label">
        				<p>Promotion End Date and Time</p>
	        			<el-date-picker v-model="promotionToBeEdited.end_date" type="datetime" placeholder="Select end"></el-date-picker>
        			</div>
				</div>
			</div>
			<div class="page-two" v-if="selectImageMode" :class="{'active': selectImageMode, 'disabled': !selectImageMode}">
				<gallery-popup @selectedImage="updateIcon"></gallery-popup>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button v-if="!selectImageMode" type="button" class="btn btn-primary" @click="updatePromotion()">Save</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../modules/Modal'
import PromotionsFunctions from '../../../controllers/Promotions'
import GalleryPopup from '../../modules/GalleryPopup'

export default {
	data () {
		return {
			showEditPromotionModal: false,
			promotionToBeEdited: {},
			errorMessage: '',
			selectImageMode: false
		}
	},
	props: {
		selectedPromotionId: {
			type: Number
		}
	},
	mounted () {
		this.showEditPromotionModal = true
		this.getPromotionDetails()
		$('body').off('click', '.el-date-editor')
		$('body').on('click', '.el-date-editor', function () {
			$('.el-date-picker').css('z-index', '10501')
			$('.el-time-panel').css('z-index', '10501')
			$('.time-select').css('z-index', '10501')
		})
	},
	methods: {
		/**
		 * To check if the promotion data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatePromotionData () {
			var editPromotionVue = this
			return new Promise(function (resolve, reject) {
				if (!editPromotionVue.promotionToBeEdited.name.length) {
					reject('Promotion name cannot be blank')
				} else if (!editPromotionVue.promotionToBeEdited.description.length) {
					reject('Promotion description cannot be blank')
				} else if (!editPromotionVue.promotionToBeEdited.image.length) {
					reject('Promotion image cannot be blank')
				} else if (!editPromotionVue.promotionToBeEdited.external_url.length) {
					reject('Promotion link cannot be blank')
				} else if (!editPromotionVue.promotionToBeEdited.start_date) {
					reject('Please provide Start Date and Time')
				} else if (!editPromotionVue.promotionToBeEdited.end_date) {
					reject('Please provide End Date and Time')
				} else if (new Date(editPromotionVue.promotionToBeEdited.start_date) > new Date(editPromotionVue.promotionToBeEdited.end_date)) {
					reject('Start Date cannot be after End Date')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To format a date object into a string.
		 * @function
		 * @param {object} date - The date object that is to be formatted.
		 * @returns {string} A string formatted YYYY-MM-DD HH:MM:SS
		 */
		formatDateTimeForApi (date) {
			let year = date.getFullYear()
			let month = date.getMonth() + 1
			let day = date.getDate()
			let hours = date.getHours()
			let minutes = date.getMinutes()
			let seconds = date.getSeconds()

			if (month < 10) {
				month = '0' + month
			}
			if (day < 10) {
				day = '0' + day
			}
			if (hours < 10) {
				hours = '0' + hours
			}
			if (minutes < 10) {
				minutes = '0' + minutes
			}
			if (seconds < 10) {
				seconds = '0' + seconds
			}

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
		 * To get the details of a specific promotion.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPromotionDetails () {
			var editPromotionVue = this
			PromotionsFunctions.getPromotionDetails(editPromotionVue.selectedPromotionId, editPromotionVue.$root.appId, editPromotionVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editPromotionVue.promotionToBeEdited = response.payload
					editPromotionVue.promotionToBeEdited.start_date = new Date(response.payload.start_date)
					editPromotionVue.promotionToBeEdited.end_date = new Date(response.payload.end_date)
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editPromotionVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To update an existing promotion.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updatePromotion () {
			var editPromotionVue = this
			editPromotionVue.clearError()

			return editPromotionVue.validatePromotionData()
			.then(response => {
				let promotionToBeEdited = editPromotionVue.promotionToBeEdited
				promotionToBeEdited.start_date = editPromotionVue.formatDateTimeForApi(promotionToBeEdited.start_date)
				promotionToBeEdited.end_date = editPromotionVue.formatDateTimeForApi(promotionToBeEdited.end_date)
				PromotionsFunctions.updatePromotion(editPromotionVue.promotionToBeEdited, editPromotionVue.$root.appId, editPromotionVue.$root.appSecret, editPromotionVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editPromotionVue.errorMessage = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editPromotionVue.$router.push('/login/expired')
						return
					}
					editPromotionVue.errorMessage = reason
					window.scrollTo(0, 0)
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editPromotionVue.errorMessage = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To close the modal and emit the updated promotion object to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			this.$emit('updatePromotion', this.promotionToBeEdited)
			this.$emit('closeEditPromotionModal')
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeEditPromotionModal')
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
		updateIcon (val) {
			this.goToPageOne()
			this.promotionToBeEdited.image = val.image_url
		}
	},
	components: {
		Modal,
		GalleryPopup
	}
}
</script>
