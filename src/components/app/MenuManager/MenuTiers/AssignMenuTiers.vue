<template>
	<modal :show="showTiersModal" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select Menu Tiers</h4>
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
    	                    <th> Name </th>
    	                    <th> Description </th>
    	                </tr>
    	            </thead>
    	            <tbody>
    	                <tr v-for="tier in menuTiers">
    	                	<td>
    	                		<div class="md-checkbox has-success">
                                    <input type="checkbox" :id="`tier-${tier.id}`" class="md-check" v-model="tier.selected">
                                    <label :for="`tier-${tier.id}`">
                                        <span class="inc"></span>
                                        <span class="check"></span>
                                        <span class="box"></span>
                                    </label>
                                </div>
    	                	</td>
    	                    <td> {{tier.name}} </td>
    	                    <td> {{tier.description}}</td>
    	                </tr>
    	            </tbody>
    	        </table>
    	    </div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" class="btn btn-primary" @click="applyTiersToGroup()">Apply Tiers</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import MenuTiersFunctions from '../../../../controllers/MenuTiers'
// import StoreGroupsFunctions from '../../../../controllers/StoreGroups'

export default {
	data () {
		return {
			showTiersModal: false,
			errorMessage: '',
			menuTiers: []
		}
	},
	props: {
		selectedGroupId: {
			type: Number,
			default: 0
		}
	},
	created () {
		this.getMenuTiers()
	},
	mounted () {
		this.showTiersModal = true
	},
	methods: {
		/**
		 * To just close the modal and emit the selected item to the parent.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeMenuTiersModal')
		},
		/**
		 * To get a list of menu tiers.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getMenuTiers () {
			this.menuTiers = []
			var menuTiersVue = this
			return MenuTiersFunctions.getMenuTiers(this.$root.corporateStoreId, menuTiersVue.$root.appId, menuTiersVue.$root.appSecret, menuTiersVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					menuTiersVue.menuTiers = response.payload
					for (var i = 0; i < menuTiersVue.menuTiers.length; i++) {
						menuTiersVue.$set(menuTiersVue.menuTiers[i], 'selected', false)
					}
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					menuTiersVue.$router.push('/login/expired')
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
		applyTiersToGroup () {
			// var menuTiersVue = this
			// var tiersToBeApplied = []
			// for (var k = 0; k < menuTiersVue.menuTiers.length; k++) {
			// 	if (menuTiersVue.menuTiers[k].selected) {
			// 		tiersToBeApplied.push(menuTiersVue.menuTiers[k].id)
			// 	}
			// }
			// MenuTiersFunctions.applyTiersToGroup(menuTiersVue.selectedGroupId, tiersToBeApplied, menuTiersVue.$root.appId, menuTiersVue.$root.appSecret, menuTiersVue.$root.userToken).then(response => {
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

<style scoped>
.portlet-body form {
	background-color: white;
	padding-left: 20px;
	margin-left: -20px;
}
</style>
