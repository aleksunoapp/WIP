<template>
	<modal :show="showApplyCategoriesModal" effect="fade" @closeOnEscape="closeModal" ref="applyModal">
		<div slot="modal-header" class="modal-header center">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Apply Add-on Category</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-show="errorMessage" ref="errorMessage">
			    <button class="close" @click="clearError()"></button>
                <span>{{ errorMessage }}</span>
			</div>
			<loading-screen :show="displaySpinner" :color="'#2C3E50'" :display="'inline'"></loading-screen>
			<form role="form" novalidate v-if="categories.length">
				<div class="form-body invite-user-form height-mod">
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
			                	<th> Category </th>
			                	<th> Description </th>
			                	<th> Status </th>
			                </tr>
			            </thead>
			            <tbody>
			                <tr v-for="category in categories" :key="category.id">
			                	<td>
			                		<div class="md-checkbox has-success">
		                                <input type="checkbox" :id="`category-${category.id}`" class="md-check" v-model="category.selected" @change="syncSelectAll(category.selected)">
		                                <label :for="`category-${category.id}`">
		                                    <span class="inc"></span>
		                                    <span class="check"></span>
		                                    <span class="box"></span>
		                                </label>
		                            </div>
			                	</td>
			                    <td> {{ category.name }} </td>
			                    <td> {{ category.desc }} </td>
			                    <td> <span v-if="category.status === 0">un</span><span>available</span> </td>
			                </tr>
			            </tbody>
			        </table>
				</div>
			</form>
        	<no-results v-if="!categories.length && !displaySpinner" :type="'categories'" :custom="true" :text="'There are no add-on categories for this location.'"></no-results>
		</div>
		<div slot="modal-footer" class="modal-footer clear">
			<button 
				type="button" 
				@click="updateAddOnCategories" 
				class="btn btn-primary"
				:disabled="applying">
				Save
				<i 
					v-show="applying"
					class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
import NoResults from '../../../modules/NoResults'
import LoadingScreen from '../../../modules/LoadingScreen'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showApplyCategoriesModal: false,
			menuToBeEdited: {
				image_url: ''
			},
			applying: false,
			errorMessage: '',
			selectImageMode: false,
			customWidth: 90,
			statusChecked: false,
			selectLocationMode: false,
			selectedLocations: [],
			selectAllSelected: false,
			categories: [],
			displaySpinner: false
		}
	},
	props: {
		passedMenu: {
			type: Object
		}
	},
	mounted () {
		this.getAddOnCategories()
		this.showApplyCategoriesModal = true
	},
	methods: {
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
			for (var i = 0; i < this.categories.length; i++) {
				this.categories[i].selected = this.selectAllSelected
			}
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
		 * To get the add on categories for this menu.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAddOnCategories () {
			this.displaySpinner = true
			var addOnCategoriesVue = this
			MenusFunctions.getAddOnCategories(addOnCategoriesVue.$root.activeLocation.id, addOnCategoriesVue.$root.appId, addOnCategoriesVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					let allCategories = response.payload
					if (addOnCategoriesVue.passedMenu.id !== 'new') {
						let menuCategories = addOnCategoriesVue.passedMenu.add_on
						for (var i = 0; i < menuCategories.length; i++) {
							for (var j = 0; j < allCategories.length; j++) {
								if (menuCategories[i].addon_category_id === allCategories[j].id) {
									allCategories[j].selected = true
								} else if (allCategories[j].selected !== true) {
									allCategories[j].selected = false
								}
							}
						}
						allCategories.forEach((category) => {
							if (!category.hasOwnProperty('selected')) {
								category.selected = false
							}
						})
						if (allCategories.some((store) => { return store.selected === false || store.selected === undefined })) {
							addOnCategoriesVue.selectAllSelected = false
						} else {
							addOnCategoriesVue.selectAllSelected = true
						}
					}
					addOnCategoriesVue.categories = allCategories
					addOnCategoriesVue.displaySpinner = false
				}
			}).catch(reason => {
				addOnCategoriesVue.displaySpinner = false
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch add-on categories',
					errorName: 'errorMessage',
					vue: addOnCategoriesVue,
					containerRef: 'applyModal'
				})
			})
		},
		/**
		 * To update the menu and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateAddOnCategories () {
			if (this.passedMenu.id === 'new') {
				this.closeModalAndUpdate()
			} else {
				this.applying = true
				let payload = {
					category_to_add: [],
					category_to_remove: []
				}
				this.categories.forEach((category) => {
					category.selected ? payload.category_to_add.push(category.id) : payload.category_to_remove.push(category.id)
				})

				var addOnCategoriesVue = this
				MenusFunctions.updateAddOnCategories(addOnCategoriesVue.passedMenu.id, payload, addOnCategoriesVue.$root.appId, addOnCategoriesVue.$root.appSecret, addOnCategoriesVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.closeModalAndUpdate()
					} else {
						addOnCategoriesVue.errorMessage = response.message
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not apply the categories',
						errorName: 'errorMessage',
						vue: addOnCategoriesVue,
						containerRef: 'applyModal'
					})
				}).finally(() => {
					addOnCategoriesVue.applying = false
				})
			}
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeAddOnCategoriesModal')
		},
		/**
		 * To close the modal and update the menu details.
		 * @function
		 * @returns {undefined}
		 */
		closeModalAndUpdate () {
			let payload = []
			this.categories.forEach(category => {
				if (category.selected === true) {
					payload.push({addon_category_id: category.id})
				}
			})
			this.$emit('updateAddOnCategories', payload)
		}
	},
	components: {
		Modal,
		NoResults,
		LoadingScreen
	}
}
</script>
