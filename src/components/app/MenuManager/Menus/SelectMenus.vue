<template>
	<modal :show="showMenuListModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select Menus</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
			    <button class="close" data-close="alert" @click="clearError()"></button>
			    <span>{{errorMessage}}</span>
			</div>
			<div class="table-scrollable table-fixed-height">
    	        <table class="table">
    	            <thead>
    	                <tr>
    	                	<th> Select </th>
    	                	<th> Image </th>
    	                    <th> Name </th>
    	                    <th> Status </th>
    	                </tr>
    	            </thead>
    	            <tbody>
    	                <tr v-for="menu in allMenus">
    	                	<td>
    	                		<div class="md-checkbox has-success">
                                    <input type="checkbox" :id="`menu-${menu.id}`" class="md-check" v-model="menu.selected">
                                    <label :for="`menu-${menu.id}`">
                                        <span class="inc"></span>
                                        <span class="check"></span>
                                        <span class="box"></span>
                                    </label>
                                </div>
    	                	</td>
    	                    <td> <img :src="menu.image_url" width="30" height="30"> </td>
    	                    <td> {{menu.name}} </td>
    	                    <td>
    	                    	<span v-if="menu.status === 1">Available</span>
    	                    	<span v-if="menu.status === 0">Sold Out</span>
    	                    </td>
    	                </tr>
    	            </tbody>
    	        </table>
    	    </div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="applyMenusToGroup()">Apply Menus</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
// import StoreGroupsFunctions from '../../../../controllers/StoreGroups'

export default {
	data () {
		return {
			showMenuListModal: false,
			errorMessage: '',
			allMenus: []
		}
	},
	props: {
		selectedGroupId: {
			type: Number,
			default: 0
		}
	},
	created () {
		this.getCorporateStoreMenus()
	},
	mounted () {
		this.showMenuListModal = true
	},
	methods: {
		/**
		 * To just close the modal and emit the selected item to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeMenusListModal')
		},
		/**
		 * To get a list of menus.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCorporateStoreMenus () {
			var selectMenusVue = this
			selectMenusVue.allMenus = []
			return MenusFunctions.getStoreMenus(selectMenusVue.$root.appId, selectMenusVue.$root.appSecret, selectMenusVue.$root.corporateStoreId).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					selectMenusVue.allMenus = response.payload
					for (var i = 0; i < selectMenusVue.allMenus.length; i++) {
						selectMenusVue.$set(selectMenusVue.allMenus[i], 'selected', false)
					}
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					selectMenusVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To apply some of the existing menus to a location group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyMenusToGroup () {
			// var selectMenusVue = this
			// var menusToBeApplied = []
			// for (var k = 0; k < selectMenusVue.allMenus.length; k++) {
			// 	if (selectMenusVue.allMenus[k].selected) {
			// 		menusToBeApplied.push(selectMenusVue.allMenus[k])
			// 	}
			// }
			// StoreGroupsFunctions.applyMenusToGroup(selectMenusVue.selectedGroupId, menusToBeApplied, selectMenusVue.$root.appId, selectMenusVue.$root.appSecret, selectMenusVue.$root.userToken).then(response => {
			// 	if (response.code === 200 && response.status === 'ok') {
			// 		// show sweetalert to tell them it will change the menus on all child locations and then close the modal
			// 	}
			// }).catch(reason => {
			// 	if (reason.responseJSON) {
			// 	}
			// 	throw reason
			// })
		}
	},
	components: {
		Modal
	}
}
</script>
