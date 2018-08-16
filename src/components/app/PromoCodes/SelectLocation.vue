<template>
	<modal :show="showSelectLocationModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select Store</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<form role="form" novalidate>
				<div class="alert alert-danger" v-show="errorMessage" ref="errorMessage">
				    <button class="close" @click="clearError()"></button>
                    <span>{{ errorMessage }}</span>
				</div>
				<div class="invite-user-form height-mod">
			        <table class="table">
			            <thead>
			                <tr>
			                	<th> 
			                		<div class="md-checkbox has-success" @click.prevent="selectAll()">
		                                <input type="checkbox" id="locations-promocodes" class="md-check" v-model="selectAllSelected">
		                                <label for="locations-promocodes">
		                                    <span class="inc"></span>
		                                    <span class="check"></span>
		                                    <span class="box"></span>
		                                </label>
		                            </div>
			                	</th>
			                	<th> Store Name </th>
			                	<th> Street Address </th>
			                	<th> City, Province, Country </th>
			                </tr>
			            </thead>
			            <tbody>
			                <tr v-for="location in searchResults">
			                	<td>
			                		<div class="md-checkbox has-success">
		                                <input type="checkbox" :id="`location-${location.id}`" class="md-check" v-model="location.selected" @click="syncSelectAll(location.selected)">
		                                <label :for="`location-${location.id}`">
		                                    <span class="inc"></span>
		                                    <span class="check"></span>
		                                    <span class="box"></span>
		                                </label>
		                            </div>
			                	</td>
			                    <td> {{ location.display_name }} </td>
			                    <td> {{ location.address_line_1 }} </td>
			                    <td> {{ location.city }}, {{ location.province }}, {{ location.country }} </td>
			                </tr>
			            </tbody>
			        </table>
				</div>
			</form>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<div class="row">
				<div class="col-xs-6">
					<div class="form-group form-md-line-input form-md-floating-label form-md-line-input-trimmed">
						<div class="input-icon right">
							<input  
								type="text" 
								placeholder="Search Stores" 
								class="form-control input-sm" 
								:class="{'edited': searchTerm.length}" 
								v-model="searchTerm" 
								id="search_locations"
							>
							<i class="fa fa-times-circle-o clickable" @click.prevent="resetSearch()" aria-hidden="true"></i>
						</div>
					</div>
				</div>
				<div class="col-xs-6">
					<button type="button" class="btn blue" @click="selectStores()">Select</button>
				</div>
			</div>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import App from '../../../controllers/App'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showSelectLocationModal: false,
			errorMessage: '',
			locations: [],
			selectAllSelected: false,
			searchTerm: ''
		}
	},
	props: {
		promoCode: {
			type: Object
		}
	},
	computed: {
		searchResults () {
			if (this.searchTerm.length) {
				return this.locations.filter((location) => {
					return (location.display_name + location.address_line_1 + location.city + location.province + location.country).toLowerCase().includes(this.searchTerm)
				})
			} else {
				return this.locations
			}
		}
	},
	mounted () {
		this.promoCode.locations === 'all' ? this.selectAllSelected = true : this.selectAllSelected = false
		this.getPaginatedStoreLocations()
		this.showSelectLocationModal = true
	},
	methods: {
		/**
		 * To reset the search form
		 * @function
		 * @returns {undefined}
		 */
		resetSearch () {
			this.searchTerm = ''
		},
		/**
		 * To record the selected locations in the new or edited promo code object.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		selectStores () {
			let selectedStores = []
			if (this.selectAllSelected === true) {
				selectedStores = 'all'
			} else {
				for (let k = 0; k < this.locations.length; k++) {
					if (this.locations[k].selected) {
						selectedStores.push(this.locations[k].id)
					}
				}
			}
			if (selectedStores.length === 0) {
				this.errorMessage = 'You have not selected any locations'
				this.$el.scrollTop = 0
				return
			}
			this.promoCode.locations = selectedStores
			this.$emit('closeSelectLocationModal', this.promoCode.locations)
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
		syncSelectAll (value) {
			if (!value) {
				this.selectAllSelected = false
			}
		},
		/**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
		selectAll () {
			this.selectAllSelected = !this.selectAllSelected
			for (var i = 0; i < this.locations.length; i++) {
				this.locations[i].selected = this.selectAllSelected
			}
		},
		/**
		 * To get a list of location for the current application/business.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPaginatedStoreLocations () {
			var editPromoCodeVue = this

			App.getPaginatedStoreLocations(editPromoCodeVue.$root.appId, editPromoCodeVue.$root.appSecret, editPromoCodeVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					response.payload.forEach((location) => {
						if (editPromoCodeVue.promoCode.locations === 'all') {
							location.selected = true
						} else {
							location.selected = editPromoCodeVue.promoCode.locations.includes(parseInt(location.id))
						}
					})
					editPromoCodeVue.locations = response.payload
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch stores',
					errorName: 'errorMessage',
					vue: editPromoCodeVue,
					containerRef: 'modal'
				})
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
		 * To just close the modal when the user clicks on the 'x' to close the modal without creating a new tag.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeSelectLocationModal')
		}
	},
	components: {
		Modal
	}
}

</script>

<style scoped>
	.modal-body {
		min-height: 200px;
	    max-height: calc(100vh - 200px);
	    overflow-x: hidden;
	    overflow-y: auto;
	    margin-bottom: 20px;
	}
	.form-md-line-input-trimmed {
		padding-top:0 !important;
		margin-bottom:0 !important;
	}
</style>
