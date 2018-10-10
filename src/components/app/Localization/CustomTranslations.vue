<template>
	<div>
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class='page-title'>Custom Translations</h1>
		<div class="note note-info">
			<p>Translate your custom content.</p>
		</div>

		<!-- BEGIN TRANSLATE-->
		<div class="portlet box blue-hoki">
			<div class="portlet-title bg-blue-chambray">
				<div class="caption">
					Translate
				</div>
			</div>
			<div class="portlet-body">

				<div class="row">
					<div class="col-md-12">
						<div ref="translationsTableErrorMessage"
						     class="alert alert-danger"
						     v-show="translationsTableErrorMessage.length">
							<button class="close"
							        @click="clearError('translationsTableErrorMessage')"></button>
							<span>{{translationsTableErrorMessage}}</span>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-md-3">
						<el-collapse class="accordion margin-bottom-20"
						             v-model="platformAccordionOpen"
						             accordion>
							<el-collapse-item title="Platform"
							                  name="platform-accordion">
								<div v-for="platform in platforms"
								     class="clickable"
								     :class="{'active-term' : platform.name === selectedPlatfrom}"
								     @click="selectPlatformForTranslation(platform)"
								     :key="platform.id">
									{{platform.name}}
								</div>
								<div class="helper-text"
								     v-if="!platforms.length">
									No platforms yet.
									<router-link to="/app/localization/platforms">Create one.</router-link>
								</div>
							</el-collapse-item>
						</el-collapse>
					</div>
					<div class="col-md-3">
						<el-collapse class="accordion margin-bottom-20"
						             v-model="languageAccordionOpen"
						             accordion>
							<el-collapse-item title="Language"
							                  name="locale-accordion">
								<div v-for="language in allLocales"
								     class="clickable"
								     :class="{'active-term' : language.language_code === localeForTranslation.language_code}"
								     @click="selectLocaleForTranslation(language)"
								     :key="language.id">
									{{language.country_name}} ({{language.language_code}})
								</div>
								<div class="helper-text"
								     v-if="!allLocales.length">
									No languages yet.
									<router-link to="/app/localization/languages">Create one.</router-link>
								</div>
							</el-collapse-item>
						</el-collapse>
					</div>
				</div>

				<div class="translations-table">
					<div class="translations-table-header">
						<div class="translations-table-header-cell">Term</div>
						<div class="translations-table-header-cell">{{localeForTranslation.country.name}} Translation</div>
					</div>

					<loading-screen class="margin-top-20"
					                :show="loadingTerms"
					                :color="'#2C3E50'">
					</loading-screen>

					<div v-show="!loadingTerms"
					     v-for="(term, index) in terms"
					     class="translations-table-body"
					     label="Field"
					     :key="index">
						<div class="translations-table-body-row">
							<div class="translations-table-body-cell">{{term.term}}</div>
							<div class="translations-table-body-cell">
								<div class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       :class="{'edited': term.translation.length}"
									       :id="`term${term.id}`"
									       v-model="term.translation"
									       :disabled="!$root.permissions['localization update']">
									<label :for="`term${term.id}`">Translation</label>
								</div>
							</div>
						</div>
					</div>
					<div class="left margin-top-20">
						<button v-if="!loadingTerms && terms.length"
						        @click="translateTerms()"
						        class="btn blue"
						        :disabled="!$root.permissions['localization update'] || saving">
							Save
							<i v-show="saving"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
					<div>
						<p v-if="localeForTranslation.id === undefined"
						   class="no-data center">Select a platform and a language to begin translating.</p>
						<p v-if="localeForTranslation.id !== undefined && !loadingTerms && !terms.length"
						   class="no-data center">There are no items to translate.</p>
					</div>
				</div>
			</div>
		</div>
		<!-- END TRANSLATE-->
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LocalizationFunctions from '../../../controllers/Localization'
import TermsFunctions from '@/controllers/Terms'
import PlatformsFunctions from '@/controllers/Platforms'
import Dropdown from '../../modules/Dropdown'
import Modal from '../../modules/Modal'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import LoadingScreen from '@/components/modules/LoadingScreen'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Custom Translations', link: false }],

			loadingPlatforms: false,
			platforms: [],
			selectedPlatfrom: '',
			platformAccordionOpen: 'platform-accordion',

			allLocales: [],
			languageAccordionOpen: 'locale-accordion',

			localeForTranslation: {
				country: '',
				language_code: ''
			},

			loadingTerms: false,
			terms: [],
			translationsTableErrorMessage: '',
			saving: false
		}
	},
	created () {
		this.getLocales()
		this.getPlatforms()
	},
	methods: {
		/**
		 * To get the locales for a store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getLocales () {
			var localizationVue = this
			LocalizationFunctions.getLocales()
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						if (response.payload.length) {
							localizationVue.allLocales = response.payload
							.map(language => {
								return {
									...language,
									country_name: language.country ? language.country.name : ''
								}
							})
							.sort((a, b) => {
								if (
									a.language_code.toLowerCase() > b.language_code.toLowerCase()
								) {
									return 1
								} else if (
									a.language_code.toLowerCase() < b.language_code.toLowerCase()
								) {
									return -1
								} else {
									return 0
								}
							})
						}
					} else {
						localizationVue.translationsTableErrorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch available languages',
						errorName: 'translationsTableErrorMessage',
						vue: localizationVue
					})
				})
		},
		/**
		 * To get a list of all platforms.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPlatforms () {
			this.clearError('errorMessage')
			this.loadingPlatforms = true
			this.platforms = []
			var _this = this
			return PlatformsFunctions.listPlatforms()
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						_this.loadingPlatforms = false
						_this.platforms = response.payload
					} else {
						_this.loadingPlatforms = false
					}
				})
				.catch(reason => {
					_this.loadingPlatforms = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of platforms',
						errorName: 'errorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To select a platform to translate for.
		 * @function
		 * @param {object} platform - An object containing the selected platform
		 * @returns {undefined}
		 */
		selectPlatformForTranslation (platform) {
			this.selectedPlatfrom = platform.name
			this.getTermsForLanguage()
		},
		/**
		 * To update the status of the locale selected for translation.
		 * @function
		 * @param {object} locale - An object containing the selected locale
		 * @returns {undefined}
		 */
		selectLocaleForTranslation (locale) {
			this.localeForTranslation.id = locale.id
			this.localeForTranslation.country = locale.country
			this.localeForTranslation.language_code = locale.language_code
			this.getTermsForLanguage()
		},
		/**
		 * To fetch terms for the selected language
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getTermsForLanguage () {
			if (!this.selectedPlatfrom || !this.localeForTranslation.language_code) return
			this.clearError('translationsTableErrorMessage')
			this.loadingTerms = true
			var localizationVue = this
			TermsFunctions.listTermsForLanguage(
				this.localeForTranslation.language_code,
				this.selectedPlatfrom
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						this.terms = response.payload.map(term => {
							return {
								...term,
								translation: term.translation === null ? '' : term.translation
							}
						})
					} else {
						localizationVue.translationsTableErrorMessage = response.message
					}
					localizationVue.loadingTerms = false
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch terms',
						errorName: 'translationsTableErrorMessage',
						vue: localizationVue
					})
					localizationVue.loadingTerms = false
				})
		},
		/**
		 * To fetch terms for the selected language
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		translateTerms () {
			this.saving = true
			this.clearError('translationsTableErrorMessage')
			var localizationVue = this
			const payload = {
				localeId: this.localeForTranslation.id,
				translations: this.terms.map(term => ({
					term_id: term.id,
					translation: term.translation
				}))
			}
			TermsFunctions.translateTerms(payload)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						localizationVue.showSaveSuccess(response.payload)
					} else {
						localizationVue.translationsTableErrorMessage = response.message
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not save the translations',
						errorName: 'translationsTableErrorMessage',
						vue: localizationVue
					})
				})
				.finally(() => {
					localizationVue.saving = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showSaveSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Translations have been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Translations have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To clear the current error.
		 * @function
		 * @param {string} type - The type of error to be cleared.
		 * @returns {undefined}
		 */
		clearError (type) {
			this[type] = ''
		}
	},
	components: {
		Breadcrumb,
		Dropdown,
		Modal,
		ResourcePicker,
		LoadingScreen
	}
}
</script>

<style scoped>
.accordion {
  max-width: 300px;
}
.accordion .helper-text {
  color: rgb(128, 128, 128);
}
.active-term {
  color: rgb(81, 148, 202);
  font-weight: 600;
}
.translations-table {
  position: relative;
  min-height: 100px;
  color: rgb(63, 68, 74);
}
.translations-table-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  background-color: rgb(240, 246, 250);
}
.translations-table-header-cell {
  width: 50%;
  padding: 10px 5px 10px 5px;
}
.translations-table-body {
  display: flex;
  align-items: center;
}
.translations-table-body:nth-child(odd) {
  background-color: rgb(249, 249, 249);
}
.translations-table-body-row {
  width: 100%;
  display: flex;
  align-items: center;
}
.translations-table-body-row:hover {
  background-color: rgb(243, 244, 246);
}
.translations-table-body-cell {
  width: 50%;
  padding: 0 5px 0 5px;
  overflow-wrap: break-word;
}
.translations-table .no-data {
  margin-top: 20px;
}
</style>
<style>
.accordion .el-collapse-item__header {
  font-weight: 600;
}
</style>
