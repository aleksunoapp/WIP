<template>
	<modal :show="showDuplicateMenuModal"
	       effect="fade"
	       @closeOnEscape="closeModal">
		<div slot="modal-header"
		     class="modal-header center">
			<button type="button"
			        class="close"
			        @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Duplicate Menu</h4>
		</div>
		<div slot="modal-body"
		     class="modal-body">
			<div class="row">
				<div class="col-xs-12">
					<div class="alert alert-danger"
					     v-show="errorMessage.length"
					     ref="errorMessage">
						<button class="close"
						        data-close="alert"
						        @click="clearError()"></button>
						<span>{{errorMessage}}</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<p>Do you want to duplicate this menu?</p>
					<div class="form-group form-md-line-input form-md-floating-label">
						<label>Replace existing?</label><br>
						<el-switch v-model="replaceExisting"
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
			<div class="row">
				<div class="col-xs-12">
					<div class="pull-right">
						<button class="btn blue"
						        @click="duplicateMenu()"
						        :disabled="duplicating">
							Duplicate
							<i v-show="duplicating"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div slot="modal-footer">
		</div>
	</modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import MenusFunctions from '../../../../controllers/Menus'
import ajaxErrorHandler from '../../../../controllers/ErrorController'

export default {
	data () {
		return {
			showDuplicateMenuModal: false,
			duplicating: false,
			errorMessage: '',
			idPrefix: 'cpm',
			replaceExisting: 0
		}
	},
	props: {
		passedMenuId: {
			type: Number
		}
	},
	created () {
		this.idPrefix = this._uid
	},
	mounted () {
		this.showDuplicateMenuModal = true
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
		 * To update the menu and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		duplicateMenu () {
			this.duplicating = true
			var editMenuVue = this
			editMenuVue.clearError()
			let payload = {
				menu_id: this.passedMenuId,
				location_id: this.$root.activeLocation.id,
				replace_existing: this.replaceExisting
			}

			MenusFunctions.duplicateMenu(
				payload,
				editMenuVue.$root.appId,
				editMenuVue.$root.appSecret,
				editMenuVue.$root.userToken
			)
				.then(response => {
					this.emitDuplicateSuccess(response.payload)
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not duplicate the menu',
						errorName: 'errorMessage',
						vue: editMenuVue
					})
				})
				.finally(() => {
					editMenuVue.duplicating = false
				})
		},
		/**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeDuplicateMenuModal')
		},
		/**
		 * To notify parent the duplication succeeded
		 * @function
		 * @param {object} payload - The payload property of the response
		 * @returns {undefined}
		 */
		emitDuplicateSuccess (payload = {}) {
			this.$emit('duplicateSuccess', payload)
		}
	},
	components: {
		Modal
	}
}
</script>
<style scoped>
.select-locations-popup-container {
  min-height: 200px;
  max-height: calc(100vh - 60px);
  overflow-x: hidden;
  overflow-y: auto;
}
.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
.locations-container {
  min-height: 200px;
  max-height: calc(100vh - 400px);
  overflow-x: hidden;
  overflow-y: auto;
}
.form-md-line-input-trimmed {
  padding-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>

