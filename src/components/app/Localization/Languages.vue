<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->

		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Languages</h1>
		<!-- END PAGE TITLE -->
		<div class="note note-info">
			<p>Add and manage languages.</p>
		</div>

		<!-- BEGIN CREATE -->
		<div class="portlet box blue-hoki"
		     v-if="$root.permissions['localization languages create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreatePanel()">
				<div class="caption">
					<i class="fa fa-2x fa-plus-circle"></i>
					Create a New Language
				</div>
				<div class="tools">
					<a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}"></a>
				</div>
			</div>
			<div class="portlet-body relative-block"
			     :class="{'display-hide': createNewCollapse}">
				<form role="form"
				      @submit.prevent="createLanguage()">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="createErrorMessage.length"
							     ref="createErrorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError('createErrorMessage')"></button>
								<span>{{ createErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newLanguage.name.length}"
								       id="form_control_create_name"
								       v-model="newLanguage.name">
								<label for="form_control_create_name">Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newLanguage.language_code.length}"
								       id="form_control_1"
								       v-model="newLanguage.language_code">
								<label for="form_control_1">Language code</label>
							</div>
							<label>
								Country:
								<el-select v-model="newLanguage.country_id"
								           placeholder="Select a country"
								           size="small"
								           no-data-text="No countries"
								           remote
								           :loading="loadingCountries">
									<el-option v-for="country in countries"
									           :label="country.name"
									           :value="country.id"
									           :key="country.id">
									</el-option>
								</el-select>
							</label>
							<div class="form-group form-md-line-input form-md-floating-label">
								<label>Default language</label><br>
								<el-switch v-model="newLanguage.isDefault"
								           active-color="#0c6"
								           inactive-color="#ff4949"
								           :active-value="1"
								           :inactive-value="0"
								           active-text="Yes"
								           inactive-text="No">
								</el-switch>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<label>Status</label><br>
								<el-switch v-model="newLanguage.status"
								           active-color="#0c6"
								           inactive-color="#ff4949"
								           :active-value="1"
								           :inactive-value="0"
								           active-text="Enabled"
								           inactive-text="Disabled">
								</el-switch>
							</div>
							<button type="submit"
							        class="btn blue pull-right"
							        :disabled="creating">
								Create
								<i v-show="creating"
								   class="fa fa-spinner fa-pulse fa-fw">
								</i>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE -->

		<!-- BEGIN LIST -->
		<div class="portlet light portlet-fit bordered margin-top-20"
				id="languages-container">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../public/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-default bold uppercase">Languages</span>
					<div class="caption-desc font-grey-cascade">Create, edit or delete languages.</div>
				</div>
			</div>
			<div class="col-md-12">
				<div class="alert alert-danger"
						v-show="listErrorMessage.length"
						ref="listErrorMessage">
					<button class="close"
							data-close="alert"
							@click="clearError('listErrorMessage')"></button>
					<span>{{ listErrorMessage }}</span>
				</div>
			</div>
			<div class="portlet-body relative-block">
				<loading-screen :show="loadingLanguages && activeLocationId !== undefined"
								:color="'#2C3E50'"
								:display="'inline'"></loading-screen>
				<div class="mt-element-list margin-top-15"
						v-if="languages.length && !loadingLanguages">
					<div class="mt-list-container list-news ext-1 no-border">
						<ul>
							<li class="mt-list-item actions-at-left margin-top-15 three-vertical-actions"
								v-for="language in languages"
								:id="'language-' + language.id"
								:key="language.id">
								<div class="list-item-actions">
									<el-tooltip v-if="$root.permissions['localization languages update']"
												content="Edit"
												effect="light"
												placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
											@click="editLanguage(language, $event)">
											<i class="fa fa-lg fa-pencil"></i>
										</a>
									</el-tooltip>
									<el-tooltip v-if="$root.permissions['localization languages read'] && !$root.permissions['localization languages update']"
												content="View"
												effect="light"
												placement="right">
										<a class="btn btn-circle btn-icon-only btn-default"
											@click="editLanguage(language, $event)">
											<i class="fa fa-lg fa-eye"></i>
										</a>
									</el-tooltip>
								</div>
								<div class="col-md-12 bold uppercase font-red">
									<span>{{ language.name }} - {{countryNames[language.country_id]}}</span>
								</div>
								<div class="col-md-6">
									<strong></strong>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="margin-top-20">
					<no-results :show="!languages.length && !loadingLanguages"
								:type="'languages'"></no-results>
				</div>
			</div>
		</div>
		<!-- END LIST -->

		<!-- START EDIT -->
		<modal :show="showEditModal"
		       effect="fade"
		       @closeOnEscape="closeEditModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeEditModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Edit Language</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<form role="form">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="editErrorMessage.length"
							     ref="editErrorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError('editErrorMessage')"></button>
								<span>{{ editErrorMessage }}</span>
							</div>
						</div>
						<div class="col-md-12">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input :disabled="!$root.permissions['localization languages update']"
								       type="text"
								       class="form-control input-sm"
								       :class="{'edited': languageToEdit.name.length}"
								       id="form_control_edit_name"
								       v-model="languageToEdit.name">
								<label for="form_control_edit_name">Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input :disabled="!$root.permissions['localization languages update']"
								       type="text"
								       class="form-control input-sm"
								       :class="{'edited': languageToEdit.language_code.length}"
								       id="form_control_1"
								       v-model="languageToEdit.language_code">
								<label for="form_control_1">Language code</label>
							</div>
							<label>
								Country:
								<el-select :disabled="!$root.permissions['localization languages update']"
								           v-model="languageToEdit.country_id"
								           placeholder="Select a country"
								           size="small"
								           no-data-text="No countries"
								           remote
								           :loading="loadingCountries">
									<el-option v-for="country in countries"
									           :label="country.name"
									           :value="country.id"
									           :key="country.id">
									</el-option>
								</el-select>
							</label>
							<div class="form-group form-md-line-input form-md-floating-label">
								<label>Default language</label><br>
								<el-switch :disabled="!$root.permissions['localization languages update']"
								           v-model="languageToEdit.isDefault"
								           active-color="#0c6"
								           inactive-color="#ff4949"
								           :active-value="1"
								           :inactive-value="0"
								           active-text="Yes"
								           inactive-text="No">
								</el-switch>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<label>Status</label><br>
								<el-switch :disabled="!$root.permissions['localization languages update']"
								           v-model="languageToEdit.status"
								           active-color="#0c6"
								           inactive-color="#ff4949"
								           :active-value="1"
								           :inactive-value="0"
								           active-text="Enabled"
								           inactive-text="Disabled">
								</el-switch>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button v-if="!$root.permissions['localization languages update']"
				        @click="closeEditModal()"
				        type="button"
				        class="btn blue">
					Close
				</button>
				<button v-else
				        @click="updateLanguage()"
				        type="submit"
				        class="btn blue"
				        :disabled="updating">
					Save
					<i v-show="updating"
					   class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- END EDIT -->
	</div>
</template>

<script>
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import LanguagesFunctions from '@/controllers/Languages'
import CountriesFunctions from '@/controllers/Countries'
import Modal from '@/components/modules/Modal'
import NoResults from '@/components/modules/NoResults'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Languages', link: false }],

			createNewCollapse: true,
			creating: false,
			createErrorMessage: '',
			newLanguage: {
				name: '',
				language_code: '',
				isDefault: 0,
				country_id: '',
				status: 0
			},

			loadingLanguages: false,
			listErrorMessage: '',
			languages: [],

			showEditModal: false,
			updating: false,
			editErrorMessage: '',
			languageToEdit: {
				name: '',
				language_code: '',
				isDefault: 0,
				country_id: '',
				status: 0
			},

			loadingCountries: false,
			countries: []
		}
	},
	computed: {
		activeLocationId: function () {
			return this.$root.activeLocation.id
		},
		countryNames () {
			let countryNames = {}
			this.countries.forEach(country => {
				countryNames[country.id] = country.name
			})
			return countryNames
		}
	},
	watch: {
		activeLocationId: function (newId) {
			if (newId !== undefined) {
				this.getLanguages()
				this.getCountries()
			}
		}
	},
	mounted () {
		this.getLanguages()
		this.getCountries()
	},
	methods: {
		/**
		 * To get a list of all countries.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCountries () {
			this.clearError('createErrorMessage')
			this.loadingCountries = true
			this.countries = []
			var _this = this
			return CountriesFunctions.listCountries()
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.loadingCountries = false
						_this.countries = response.payload
					} else {
						_this.loadingCountries = false
					}
				})
				.catch(reason => {
					_this.loadingCountries = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of countries',
						errorName: 'createErrorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To toggle the create tier panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreatePanel () {
			this.createNewCollapse = !this.createNewCollapse
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {object} errorMessageName - The error message to be cleared.
		 * @returns {undefined}
		 */
		clearError (errorMessageName) {
			this[errorMessageName] = ''
		},
		/**
		 * To check if the language data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewLanguageData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.newLanguage.name.length) {
					reject('Name cannot be blank')
				} else if (!_this.newLanguage.language_code.length) {
					reject('Language code cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new language.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		createLanguage () {
			var _this = this
			_this.clearError('createErrorMessage')

			return _this
				.validateNewLanguageData()
				.then(response => {
					_this.creating = true
					LanguagesFunctions.createLanguage(_this.newLanguage)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.showCreateSuccess(response.payload)
								_this.clearNewLanguage()
								_this.getLanguages()
							} else {
								_this.createErrorMessage = response.message
								_this.$scrollTo(_this.$refs.createErrorMessage, 1000, {
									offset: -50
								})
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not create the language',
								errorName: 'createErrorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.creating = false
						})
				})
				.catch(reason => {
					_this.createErrorMessage = reason
					_this.$scrollTo(_this.$refs.createErrorMessage, 1000, { offset: -50 })
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCreateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Language has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Language has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the new language form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewLanguage () {
			this.newLanguage = {
				name: '',
				language_code: '',
				isDefault: 0,
				country_id: '',
				status: 0
			}
		},
		/**
		 * To get a list of all languages.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getLanguages () {
			this.clearError('listErrorMessage')
			this.loadingLanguages = true
			this.languages = []
			var _this = this
			return LanguagesFunctions.listLanguages()
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.languages = response.payload.map(language => ({
							...language,
							country: language.country === null ? {name: ''} : language.country
						}))
						_this.loadingLanguages = false
					} else {
						_this.loadingLanguages = false
					}
				})
				.catch(reason => {
					_this.loadingLanguages = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of languages',
						errorName: 'listErrorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To show the modal to edit an language details.
		 * @function
		 * @param {object} language - The selected language.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editLanguage (language, event) {
			event.stopPropagation()
			this.languageToEdit = {
				name: language.name,
				id: language.id,
				country_id: language.country_id,
				language_code: language.language_code,
				isDefault: language.default,
				status: language.status
			}
			this.showEditModal = true
		},
		/**
		 * To check if the language data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateEditedLanguageData () {
			var _this = this
			return new Promise(function (resolve, reject) {
				if (!_this.languageToEdit.name.length) {
					reject('Name cannot be blank')
				} else if (!_this.languageToEdit.language_code.length) {
					reject('Language code cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update a language.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		updateLanguage () {
			var _this = this
			_this.clearError('editErrorMessage')
			let payload = { ...this.languageToEdit }

			return _this
				.validateEditedLanguageData()
				.then(response => {
					_this.updating = true
					LanguagesFunctions.updateLanguage(
						payload,
						_this.$root.appId,
						_this.$root.appSecret,
						_this.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								_this.getLanguages()
								_this.closeEditModal()
								_this.showEditSuccess(response.payload)
								_this.resetEdit()
							} else {
								_this.editErrorMessage = response.message
								_this.$scrollTo(_this.$refs.editErrorMessage, 1000, {
									offset: -50
								})
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not update the language',
								errorName: 'editErrorMessage',
								vue: _this
							})
						})
						.finally(() => {
							_this.updating = false
						})
				})
				.catch(reason => {
					_this.editErrorMessage = reason
					_this.$scrollTo(_this.$refs.editErrorMessage, 1000, { offset: -50 })
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showEditSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Language has been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Language has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To close the modal for editing a promotion.
		 * @function
		 * @returns {undefined}
		 */
		closeEditModal () {
			this.clearError('editErrorMessage')
			this.showEditModal = false
		},
		/**
		 * To reset the edit form
		 * @function
		 * @returns {undefined}
		 */
		resetEdit () {
			this.languageToEdit = {
				name: '',
				language_code: '',
				isDefault: 0,
				country_id: '',
				status: 0
			}
		}
	},
	components: {
		Breadcrumb,
		LoadingScreen,
		Modal,
		NoResults
	}
}
</script>

<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover {
  background-color: white;
}
.three-vertical-actions {
  min-height: 124px;
}
</style>
