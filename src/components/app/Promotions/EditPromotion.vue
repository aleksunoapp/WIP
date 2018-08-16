<template>
	<modal :show="showEditPromotionModal" effect="fade" @closeOnEscape="closeModal" :width="modalWidth" ref="modal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center" v-if="!selectImageMode">Update Promotion</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="col-xs-12">
				<div class="alert alert-danger" v-show="errorMessage" ref="errorMessage">
				    <button class="close" @click="clearError()"></button>
				    <span>{{errorMessage}}</span>
				</div>
        		<div :class="{'col-xs-4 col-xs-offset-4': !selectImageMode, 'col-xs-12': selectImageMode}">
					<resource-picker 
						@open="goToPageTwo()"
						@close="goToPageOne()"
						@selected="updateIcon" 
						:imageButton="true"
						:imageUrl="promotionToBeEdited.image"
						class="margin-top-15"
					>
					</resource-picker>
        		</div>
				<div class="col-md-12" v-show="!selectImageMode">
					<fieldset :disabled="!$root.permissions['promotions update']">
						<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
							<input type="text" class="form-control input-sm edited" id="form_control_1" v-model="promotionToBeEdited.name">
							<label for="form_control_1">Promotion Name</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
							<input type="text" class="form-control input-sm edited" id="form_control_2" v-model="promotionToBeEdited.description">
							<label for="form_control_2">Promotion Description</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
							<input type="text" class="form-control input-sm" :class="{'edited': promotionToBeEdited.short_description.length}" id="form_control_short_description" v-model="promotionToBeEdited.short_description">
							<label for="form_control_short_description">Promotion Short Description</label>
						</div>
					</fieldset>
        			<div>
        				<p class="grey-label">Promotion Start Date and Time</p>
	        			<el-date-picker 
							:disabled="!$root.permissions['promotions update']"
							v-model="promotionToBeEdited.start_date" 
							type="datetime" 
							placeholder="Select end">
						</el-date-picker>
        			</div>
        			<div>
        				<p class="grey-label">Promotion End Date and Time</p>
	        			<el-date-picker 
							:disabled="!$root.permissions['promotions update']"
							v-model="promotionToBeEdited.end_date" 
							type="datetime" 
							placeholder="Select end">
						</el-date-picker>
        			</div>
					<div>
						<p class="grey-label">Call to action type</p>
						<el-select 
							:disabled="!$root.permissions['promotions update']"
							v-model="promotionToBeEdited.cta_type" 
							placeholder="Select type" 
							size="small" 
							class="margin-bottom-15" 
							id="form_control_cta_type" 
							@change="clearCtaValue()">
							<el-option label="hyperlink" value="hyperlink"></el-option>
							<el-option label="menu item" value="menu_item"></el-option>
							<el-option label="promo code" value="promo_code"></el-option>
							<el-option label="camera" value="camera"></el-option>
							<el-option label="call" value="call"></el-option>
							<el-option label="SMS" value="sms"></el-option>
							<el-option label="video" value="video"></el-option>
						</el-select>
					</div>
					<fieldset :disabled="!$root.permissions['promotions update']">
						<div class="form-group form-md-line-input form-md-floating-label" v-show="promotionToBeEdited.cta_type !== 'menu_item' && promotionToBeEdited.cta_type !== 'promo_code'">
							<input type="text" class="form-control input-sm" :class="{'edited': promotionToBeEdited.cta_value.length}" id="form_control_cta_value" v-model="promotionToBeEdited.cta_value">
							<label for="form_control_cta_value">Call to action value</label>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label" v-show="promotionToBeEdited.cta_type === 'promo_code'">
							<button type="button" class="btn blue btn-outline" @click="openPromoCodesCodeModal()">Select</button>
							<p class="grey-label margin-top-10" v-show="promotionToBeEdited.cta_value.length">Selected {{promotionToBeEdited.cta_value.split(',').length}} code<span v-show="promotionToBeEdited.cta_value.split(',').length !== 1">s</span></p>
						</div>
						<div class="form-group form-md-line-input form-md-floating-label" v-show="promotionToBeEdited.cta_type === 'menu_item'">
							<button type="button" class="btn blue btn-outline" @click="openMenuModifierTree()">Select</button>	
							<p class="grey-label margin-top-10" v-show="promotionToBeEdited.skuArray.length">Selected {{promotionToBeEdited.skuArray.length}} item<span v-show="promotionToBeEdited.skuArray.length !== 1">s</span></p>									
						</div>
						<div class="form-group form-md-line-input form-md-floating-label">
							<input type="text" class="form-control input-sm" :class="{'edited': promotionToBeEdited.cta_text.length}" id="form_control_cta_text" v-model="promotionToBeEdited.cta_text">
							<label for="form_control_cta_text">Call to action text</label>
						</div>
					</fieldset>
					<div class="form-group form-md-line-input form-md-floating-label">
						<label>Featured:</label><br>
						<el-switch
							:disabled="!$root.permissions['promotions update']"
							v-model="promotionToBeEdited.featured"
							active-color="#0c6"
							inactive-color="#ff4949"
							:active-value="1"
							:inactive-value="0"
							active-text="Yes"
							inactive-text="No">
						</el-switch>
					</div>
				</div>
			</div>
			<div class="page-two" v-if="selectPromoCodesMode">
				<div class="row">
					<div class="col-xs-12">
				        <table class="table">
				            <thead>
				                <tr>
				                	<th></th>
				                	<th> Code </th>
				                	<th> Value </th>
				                	<th> From </th>
				                	<th> To </th>
				                </tr>
				            </thead>
				            <tbody>
				                <tr v-for="code in promoCodes" :key="code.id">
				                	<td>
				                		<div class="md-checkbox has-success">
			                                <input 
												:disabled="!$root.permissions['promotions update']"
												type="checkbox" 
												:id="`code-${code.id}`" 
												class="md-check" 
												v-model="code.selected">
			                                <label :for="`code-${code.id}`">
			                                    <span class="inc"></span>
			                                    <span class="check"></span>
			                                    <span class="box"></span>
			                                </label>
			                            </div>
				                	</td>
				                    <td> {{ code.codes }} </td>
				                    <td> <span v-show="code.value_type === 'dollar'">$</span>{{ code.value }}<span v-show="code.value_type === 'percentage'">%</span> </td>
				                    <td> {{ code.start_from }} </td>
				                    <td> {{ code.end_on }} </td>
				                </tr>
				            </tbody>
				        </table>
					</div>
				</div>
			</div>
			<menu-modifier-tree
				v-if="showMenuModifierTreeModal" 
				:selectedObject="promotionToBeEdited" 
				:showModifierItems="false"
				@closeMenuModifierTreeModal="closeMenuModifierTree" 
				@closeMenuModifierTreeModalAndUpdate="setSelectedItems"
			>
			</menu-modifier-tree>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button 
				v-if="selectPromoCodesMode && !$root.permissions['promotions update']" 
				type="button" 
				class="btn btn-primary" 
				@click="closePromoCodesCodeModal()">
				Back
			</button>
			<button 
				v-if="selectPromoCodesMode && $root.permissions['promotions update']" 
				type="button" 
				class="btn btn-primary" 
				@click="selectPromoCodes()">
				Select
			</button>
			<button 
				v-if="!selectImageMode && !selectPromoCodesMode && !$root.permissions['promotions update']" 
				type="button" 
				class="btn btn-primary" 
				@click="closeModal()">
				Close
			</button>
			<button 
				v-if="!selectImageMode && !selectPromoCodesMode && $root.permissions['promotions update']" 
				type="button" 
				class="btn btn-primary" 
				@click="updatePromotion()"
				:disabled="updating">
				Save
				<i 
					v-show="updating"
					class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../modules/Modal'
import PromotionsFunctions from '../../../controllers/Promotions'
import PromoCodesFunctions from '../../../controllers/PromoCodes'
import ResourcePicker from '../../modules/ResourcePicker'
import MenuModifierTree from '../../modules/MenuModifierTree'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showEditPromotionModal: false,
			updating: false,
			promotionToBeEdited: {
				name: '',
				description: '',
				image: '',
				start_date: '',
				end_date: '',
				apply_to_all_locations: 0,
				apply_to_a_store_group: 0,
				location_group_id: '',
				location_group_name: '',
				created_by: this.$root.createdBy,
				cta_type: '',
				cta_value: '',
				skuArray: [],
				cta_text: '',
				featured: 0,
				short_description: '',
				sort_order: ''
			},
			errorMessage: '',
			selectImageMode: false,
			showMenuModifierTreeModal: false,
			selectPromoCodesMode: false,
			promoCodes: []
		}
	},
	computed: {
		modalWidth () {
			return this.showMenuModifierTreeModal ? 900 : null
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
		this.getAllPromoCodes()
	},
	methods: {
		/**
		 * To open menu item selection.
		 * @function
		 * @returns {undefined}
		 */
		openMenuModifierTree () {
			this.showMenuModifierTreeModal = true
		},
		/**
		 * To close menu items selection
		 * @function
		 * @returns {undefined}
		 */
		closeMenuModifierTree () {
			this.showMenuModifierTreeModal = false
		},
		/**
		 * To record the selected items
		 * @function
		 * @param {object} data - An object containing a selectedSKUs property
		 * @returns {undefined}
		 */
		setSelectedItems (data) {
			if (this.$root.permissions['promotions update']) {
				this.promotionToBeEdited.skuArray = data.selectedSKUs
			}
			this.showMenuModifierTreeModal = false
		},
		/**
		 * To open the promo codes selection
		 * @function
		 * @returns {undefined}
		 */
		openPromoCodesCodeModal () {
			this.selectPromoCodesMode = true
		},
		/**
		 * To close the promo codes modal
		 * @function
		 * @returns {undefined}
		 */
		closePromoCodesCodeModal () {
			this.clearError('promoCodesErrorMessage')
			this.selectPromoCodesMode = false
		},
		/**
		 * To set the selected promo codes as cta_value and close promo code selection
		 * @function
		 * @returns {undefined}
		 */
		selectPromoCodes () {
			this.promotionToBeEdited.cta_value = this.promoCodes.filter(code => code.selected).map(code => code.id).toString()
			this.closePromoCodesCodeModal()
		},
		/**
		 * To reset the cta_value when cta_type changes.
		 * @function
		 * @returns {undefined}
		 */
		clearCtaValue () {
			this.promotionToBeEdited.cta_value = ''
		},
		/**
		 * To get a list of all promoCodes.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAllPromoCodes () {
			var editPromotionVue = this
			return PromoCodesFunctions.getAllPromoCodes(editPromotionVue.$root.appId, editPromotionVue.$root.appSecret, editPromotionVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editPromotionVue.promoCodes = response.payload.map(code => {
						code.selected = false
						return code
					})
				} else {
					throw new Error('We could not fetch a list of promo codes')
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch a list of promo codes',
					errorName: 'promoCodesErrorMessage',
					vue: editPromotionVue
				})
			})
		},
		/**
		 * To check if the promotion data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatePromotionData () {
			var editPromotionVue = this
			return new Promise(function (resolve, reject) {
				if (!editPromotionVue.promotionToBeEdited.image.length) {
					reject('Promotion image cannot be blank')
				} else if (!editPromotionVue.promotionToBeEdited.name.length) {
					reject('Promotion name cannot be blank')
				} else if (!editPromotionVue.promotionToBeEdited.description.length) {
					reject('Promotion description cannot be blank')
				} else if (!editPromotionVue.promotionToBeEdited.short_description.length) {
					reject('Promotion short description cannot be blank')
				} else if (!$.isNumeric(editPromotionVue.promotionToBeEdited.sort_order)) {
					reject('Sort order must be a number')
				} else if (!editPromotionVue.promotionToBeEdited.start_date) {
					reject('Please provide Start Date and Time')
				} else if (!editPromotionVue.promotionToBeEdited.end_date) {
					reject('Please provide End Date and Time')
				} else if (!editPromotionVue.promotionToBeEdited.cta_type) {
					reject('Please select type of call to action')
				} else if (editPromotionVue.promotionToBeEdited.cta_type === 'menu_item' && !editPromotionVue.promotionToBeEdited.skuArray.length) {
					reject('Select at least one menu item')
				} else if (editPromotionVue.promotionToBeEdited.cta_type === 'promo_code' && !editPromotionVue.promotionToBeEdited.cta_value.length) {
					reject('Select at least one promo code')
				} else if (editPromotionVue.promotionToBeEdited.cta_type !== 'menu_item' && editPromotionVue.promotionToBeEdited.cta_type !== 'promo_code' && !editPromotionVue.promotionToBeEdited.cta_value) {
					reject('Call to action value cannot be blank')
				} else if (!editPromotionVue.promotionToBeEdited.cta_text) {
					reject('Call to action text cannot be blank')
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
					response.payload.cta_type === 'menu_item' ? response.payload.skuArray = response.payload.cta_value.split(',') : response.payload.skuArray = []
					editPromotionVue.promotionToBeEdited = response.payload
					editPromotionVue.promotionToBeEdited.start_date = new Date(response.payload.start_date)
					editPromotionVue.promotionToBeEdited.end_date = new Date(response.payload.end_date)
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch promotion info',
					errorName: 'errorMessage',
					vue: editPromotionVue,
					containerRef: 'modal'
				})
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
				editPromotionVue.updating = true
				let payload = {...editPromotionVue.promotionToBeEdited}
				payload.start_date = editPromotionVue.formatDateTimeForApi(payload.start_date)
				payload.end_date = editPromotionVue.formatDateTimeForApi(payload.end_date)
				if (payload.cta_type === 'menu_item') {
					payload.cta_value = payload.skuArray.toString()
				}
				delete payload.skuArray

				PromotionsFunctions.updatePromotion(payload, editPromotionVue.$root.appId, editPromotionVue.$root.appSecret, editPromotionVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						editPromotionVue.errorMessage = response.message
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the promotion',
						errorName: 'errorMessage',
						vue: editPromotionVue,
						containerRef: 'modal'
					})
				}).finally(() => {
					editPromotionVue.updating = false
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
			if (this.$root.permissions['promotions update']) {
				this.promotionToBeEdited.image = val.image_url
			}
			this.goToPageOne()
		}
	},
	components: {
		Modal,
		ResourcePicker,
		MenuModifierTree
	}
}
</script>

<style scoped>
.grey-label {
	color: rgb(136, 136, 136);
	font-size: 13px;
	margin-bottom: 5px;
}
</style>
