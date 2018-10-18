<template>
	<modal :show="showPortionsModal"
	       effect="fade"
	       @closeOnEscape="closeModal"
	       ref="modal">
		<div slot="modal-header"
		     class="modal-header">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select a Portion</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="alert alert-danger"
			     v-show="errorMessage"
			     ref="errorMessage">
				<button class="close"
				        @click="clearError()"></button>
				<span>{{errorMessage}}</span>
			</div>
			<div class="table-scrollable table-fixed-height">
				<table class="table">
					<thead>
						<tr>
							<th> </th>
							<th> Icon </th>
							<th> Name </th>
							<th> Multiplier </th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="portion in portions" :key="portion.id">
							<td>
								<div class="md-checkbox has-success">
									<input type="checkbox"
									       :id="'portion_checkbox_' + portion.id"
									       class="md-check"
									       v-model="portion.selected">
									<label :for="'portion_checkbox_' + portion.id">
										<span class="inc"></span>
										<span class="check"></span>
										<span class="box"></span>
									</label>
								</div>
							</td>
							<td> <img :src="portion.icon_url"
								     width="30"
								     height="30"> </td>
							<td> {{portion.name}} </td>
							<td> {{portion.multiplier}} </td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div slot="modal-footer"
		     class="modal-footer">
			<button type="button"
			        class="btn btn-primary"
			        @click="applyPortionsToItem()"
							:disabled="saving">
				Apply Portions
				<i v-show="saving"
						class="fa fa-spinner fa-pulse fa-fw">
				</i>
			</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import PortionsFunctions from '../../../../controllers/Portions'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			showPortionsModal: false,
			errorMessage: '',
			portions: [],
			saving: false
		}
	},
	props: {
		appliedPortions: {
			type: Array,
			default: []
		},
		selectedItemId: {
			type: Number,
			default: 0
		},
		itemType: {
			type: String,
			default: 'modifier-item'
		}
	},
	created () {
		this.getPortions()
	},
	mounted () {
		this.showPortionsModal = true
	},
	methods: {
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To get a list of modifier categories for a store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPortions () {
			var portionsListVue = this
			portionsListVue.portions = []
			PortionsFunctions.getPortions(
				portionsListVue.$root.appId,
				portionsListVue.$root.appSecret,
				portionsListVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						portionsListVue.portions = response.payload
						if (portionsListVue.appliedPortions.length) {
							for (var i = 0; i < portionsListVue.portions.length; i++) {
								for (
									var j = 0;
									j < portionsListVue.appliedPortions.length;
									j++
								) {
									if (
										portionsListVue.portions[i].id ===
										portionsListVue.appliedPortions[j].id
									) {
										portionsListVue.$set(
											portionsListVue.portions[i],
											'selected',
											true
										)
										break
									} else {
										portionsListVue.$set(
											portionsListVue.portions[i],
											'selected',
											false
										)
									}
								}
								portionsListVue.$set(
									portionsListVue.portions[i],
									'created_by',
									portionsListVue.$root.createdBy
								)
							}
						} else {
							for (var k = 0; k < portionsListVue.portions.length; k++) {
								portionsListVue.$set(
									portionsListVue.portions[k],
									'created_by',
									portionsListVue.$root.createdBy
								)
							}
						}
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch portions',
						errorName: 'errorMessage',
						vue: portionsListVue,
						containerRef: 'modal'
					})
				})
		},
		/**
		 * To apply some of the existing modifiers to an item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyPortionsToItem () {
			this.saving = true
			var portionsListVue = this
			var portionsToBeApplied = []
			for (var k = 0; k < portionsListVue.portions.length; k++) {
				if (portionsListVue.portions[k].selected) {
					portionsToBeApplied.push(portionsListVue.portions[k].id)
				}
			}
			if (portionsListVue.itemType === 'modifier-item') {
				PortionsFunctions.applyPortionsToModifierItem(
					portionsListVue.selectedItemId,
					this.$root.createdBy,
					portionsToBeApplied,
					portionsListVue.$root.appId,
					portionsListVue.$root.appSecret,
					portionsListVue.$root.userToken
				)
					.then(response => {
						if (response.code === 200 && response.status === 'ok') {
							portionsListVue.closeModal()
							portionsListVue.showEditSuccess(response.payload)
						}
					})
					.catch(reason => {
						ajaxErrorHandler({
							reason,
							errorText: 'We could not apply the portion',
							errorName: 'errorMessage',
							vue: portionsListVue,
							containerRef: 'modal'
						})
					})
					.finally(() => {
						portionsListVue.saving = false
					})
			}
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showEditSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Modifier Item has been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The changes have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closePortionsListModal', this.selectedItemId)
		}
	},
	components: {
		Modal
	}
}
</script>
