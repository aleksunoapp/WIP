<template>
	<modal :show="showTagsModal" :width="900" effect="fade" @closeOnEscape="closeModal">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Select a Tag</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="alert alert-danger" v-if="errorMessage.length">
				<button class="close" data-close="alert" @click="clearError()"></button>
				<span>{{errorMessage}}</span>
			</div>
			<div class="table-scrollable table-fixed-height" style="float: left; width: 50%;">
				<table class="table">
					<thead>
						<tr>
							<th>  </th>
							<th> Image </th>
							<th> Name </th>
							<th> Type </th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="tag in containTags" :key="tag.id">
							<td>
								<div class="md-checkbox has-success">
									<input type="checkbox" :id="'tag_checkbox_' + tag.id" class="md-check" v-model="tag.selected">
									<label :for="'tag_checkbox_' + tag.id">
										<span class="inc"></span>
										<span class="check"></span>
										<span class="box"></span>
									</label>
								</div>
							</td>
							<td> <img :src="tag.image_url" width="30" height="30"> </td>
							<td> {{tag.name}} </td>
							<td> {{tag.type}} </td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="table-scrollable table-fixed-height" style="float: left; width: 50%;">
				<table class="table">
					<thead>
						<tr>
							<th>  </th>
							<th> Image </th>
							<th> Name </th>
							<th> Type </th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="tag in mayContainTags" :key="tag.id">
							<td>
								<div class="md-checkbox has-success">
									<input type="checkbox" :id="'tag_checkbox_' + tag.id" class="md-check" v-model="tag.selected">
									<label :for="'tag_checkbox_' + tag.id">
										<span class="inc"></span>
										<span class="check"></span>
										<span class="box"></span>
									</label>
								</div>
							</td>
							<td> <img :src="tag.image_url" width="30" height="30"> </td>
							<td> {{tag.name}} </td>
							<td> {{tag.type}} </td>
						</tr>
					</tbody>
				</table>
			</div>
			<div style="clear: both;"></div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button 
				type="button" 
				class="btn btn-primary" 
				@click="applyTagsToItem()"
				:disabled="applying">
				Apply Tags
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
import TagsFunctions from '../../../../controllers/Tags'

export default {
	data () {
		return {
			showTagsModal: false,
			applying: false,
			errorMessage: '',
			containTags: [],
			mayContainTags: []
		}
	},
	props: {
		appliedTags: {
			type: Array,
			default: []
		},
		selectedItemId: {
			type: Number,
			default: 0
		},
		itemType: {
			type: String,
			default: 'menu-item'
		}
	},
	created () {
		this.getTags()
	},
	mounted () {
		this.showTagsModal = true
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
		getTags () {
			var tagsListVue = this
			tagsListVue.containTags = []
			tagsListVue.mayContainTags = []
			TagsFunctions.getTags(tagsListVue.$root.appId, tagsListVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					for (let i = 0; i < response.payload.length; i++) {
						var tag = response.payload[i]
						if (tag.type === 'contains') {
							tagsListVue.containTags.push(tag)
						} else {
							tagsListVue.mayContainTags.push(tag)
						}
					}
					if (tagsListVue.appliedTags.length) {
						for (let i = 0; i < tagsListVue.containTags.length; i++) {
							tagsListVue.$set(tagsListVue.containTags[i], 'selected', false)
						}
						for (let i = 0; i < tagsListVue.mayContainTags.length; i++) {
							tagsListVue.$set(tagsListVue.mayContainTags[i], 'selected', false)
						}
						for (let j = 0; j < tagsListVue.appliedTags.length; j++) {
							for (let i = 0; i < tagsListVue.containTags.length; i++) {
								if (tagsListVue.containTags[i].id === tagsListVue.appliedTags[j].id) {
									tagsListVue.$set(tagsListVue.containTags[i], 'selected', true)
									break
								}
							}
							for (let i = 0; i < tagsListVue.mayContainTags.length; i++) {
								if (tagsListVue.mayContainTags[i].id === tagsListVue.appliedTags[j].id) {
									tagsListVue.$set(tagsListVue.mayContainTags[i], 'selected', true)
									break
								}
							}
						}
					}
				} else {
					tagsListVue.errorMessage = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					tagsListVue.$router.push('/login/expired')
					return
				}
				tagsListVue.errorMessage = reason.responseJSON.payload
			})
		},
		/**
		 * To apply some of the existing modifiers to an item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyTagsToItem () {
			this.applying = true
			var tagsListVue = this
			var tagsToBeApplied = []
			for (let k = 0; k < tagsListVue.containTags.length; k++) {
				if (tagsListVue.containTags[k].selected) {
					tagsToBeApplied.push(tagsListVue.containTags[k])
				}
			}
			for (let k = 0; k < tagsListVue.mayContainTags.length; k++) {
				if (tagsListVue.mayContainTags[k].selected) {
					tagsToBeApplied.push(tagsListVue.mayContainTags[k])
				}
			}
			if (tagsListVue.itemType === 'menu-item') {
				TagsFunctions.applyTagsToItem(tagsListVue.selectedItemId, tagsToBeApplied, tagsListVue.$root.appId, tagsListVue.$root.appSecret, tagsListVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						tagsListVue.closeModal()
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						tagsListVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
					}
					throw reason
				}).finally(() => {
					tagsListVue.applying = false
				})
			} else if (tagsListVue.itemType === 'modifier-item') {
				TagsFunctions.applyTagsToModifierItem(tagsListVue.selectedItemId, tagsToBeApplied, tagsListVue.$root.appId, tagsListVue.$root.appSecret, tagsListVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						tagsListVue.closeModal()
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						tagsListVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
					}
					throw reason
				}).finally(() => {
					tagsListVue.applying = false
				})
			}
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('deactivateTagsListModal', this.selectedItemId)
		}
	},
	components: {
		Modal
	}
}
</script>
