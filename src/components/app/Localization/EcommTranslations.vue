<template>
	<div>
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class='page-title'>eComm Translations</h1>
		<div class="note note-info">
			<p>Translate your store and menu terms.</p>
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
							        data-close="alert"
							        @click="clearError('translationsTableErrorMessage')"></button>
							<span>{{translationsTableErrorMessage}}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-3">
						<el-collapse class="accordion margin-bottom-20"
						             v-model="languageAccordionOpen"
						             accordion>
							<el-collapse-item title="Language"
							                  name="1">
								<div v-for="language in allLocales"
								     class="clickable"
								     :class="{'active-term' : language.language_code === localeForTranslation.language_code}"
								     @click="selectLocaleForTranslation(language)"
								     :key="language.id">
									{{language.country.name}} ({{language.language_code}})
								</div>
								<div class="helper-text"
								     v-if="!allLocales.length">
									No languages yet.
									<router-link to="/app/localization/languages">Create one.</router-link>
								</div>
							</el-collapse-item>
						</el-collapse>
					</div>
					<div class="col-md-6"
					     v-show="localeForTranslation.id">
						<el-collapse class="accordion margin-bottom-20"
						             v-model="activeAccordionSection"
						             accordion>
							<el-collapse-item v-for="(group, index) in translationTermGroups"
							                  :title="group.group"
							                  :name="index + 1"
							                  :key="group.group">
								<div v-for="term in group.terms"
								     class="clickable"
								     :class="{'active-term' : term.term === activeTranslationGroup.term}"
								     @click="getTerm(group.groupUrl, term.term)"
								     :key="term.id">
									{{term.label}}
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
							<div v-if="activeTranslationGroup.term.substr(activeTranslationGroup.term.length - 3) !== 'url'"
							     class="translations-table-body-cell">{{term.term}}</div>
							<div v-else
							     class="translations-table-body-cell">
								<img class="image-thumb clickable"
								     :src="term.term"
								     @click="openImagePreview(term.term)">
							</div>
							<div class="translations-table-body-cell">
								<div v-if="activeTranslationGroup.term.substr(activeTranslationGroup.term.length - 3) !== 'url'"
								     class="form-group form-md-line-input form-md-floating-label">
									<input type="text"
									       class="form-control input-sm"
									       :class="{'edited': term.translation.length}"
									       :id="`term${term.id}`"
									       v-model="term.translation"
									       :disabled="!$root.permissions['localization update']">
									<label :for="`term${term.id}`">Translation</label>
								</div>
								<div v-else>
									<button v-if="!term.translation.length"
									        @click="openGallery(term.id)"
									        class="btn blue btn-outline"
									        :disabled="!$root.permissions['localization update']">
										Select image
									</button>
									<img v-if="!$root.permissions['localization update'] && $root.permissions['localization read']"
									     class="image-thumb clickable"
									     :src="term.translation">
									<img v-if="$root.permissions['localization update']"
									     class="image-thumb clickable"
									     :src="term.translation"
									     @click="openGallery(term.id)">
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
					<div v-show="!loadingTerms">
						<p v-if="!activeTranslationGroup.term"
						   class="no-data center">Select a language and a term to begin translating.</p>
						<p v-if="activeTranslationGroup.term && !terms.length"
						   class="no-data center">There are no items to translate.</p>
					</div>
				</div>
			</div>
		</div>
		<!-- END TRANSLATE-->
		<modal :show="imagePreviewShown"
		       effect="fade"
		       @closeOnEscape="closeImagePreview()">
			<div slot="modal-header"
			     class="modal-header center">
				<button type="button"
				        class="close"
				        @click="closeImagePreview()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Preview</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<img class="image-preview"
				     :src="imagePreviewUrl">
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<button @click="closeImagePreview()"
				        class="btn blue">Close</button>
			</div>
		</modal>
		<modal :show="galleryPopupShown"
		       effect="fade"
		       @closeOnEscape="closeGallery">
			<div slot="modal-header"
			     class="modal-header center">
				<button type="button"
				        class="close"
				        @click="closeGallery">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Select Image To Use in {{localeForTranslation.country.name}}</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<resource-picker :noButton="true"
				                 @selected="updateImage"
				                 :showDoneButton="false"
				                 :imageButton="false"
				                 :selectOnly="true">
				</resource-picker>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear"></div>
		</modal>
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import LocalizationFunctions from '../../../controllers/Localization'
import Dropdown from '../../modules/Dropdown'
import Modal from '../../modules/Modal'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import LoadingScreen from '@/components/modules/LoadingScreen'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'eComm Translations', link: false }],
			allLocales: [],

			localeForTranslation: {
				country: '',
				language_code: ''
			},
			translationTermGroups: [
				{
					group: 'Menus',
					groupUrl: 'menu',
					terms: [
						{
							term: 'menu_name',
							label: 'Menu Name'
						},
						{
							term: 'menu_desc',
							label: 'Menu Description'
						},
						{
							term: 'menu_image_url',
							label: 'Menu Image'
						}
					]
				},
				{
					group: 'Categories',
					groupUrl: 'category',
					terms: [
						{
							term: 'category_name',
							label: 'Category Name'
						},
						{
							term: 'category_desc',
							label: 'Category Description'
						},
						{
							term: 'category_image_url',
							label: 'Category Image'
						}
					]
				},
				{
					group: 'Items',
					groupUrl: 'item',
					terms: [
						{
							term: 'item_name',
							label: 'Item Name'
						},
						{
							term: 'item_desc',
							label: 'Item Description'
						},
						{
							term: 'item_image_url',
							label: 'Item Image'
						}
					]
				},
				{
					group: 'Modifiers',
					groupUrl: 'modifier',
					terms: [
						{
							term: 'modifier_name',
							label: 'Modifier Category Name'
						},
						{
							term: 'modifier_desc',
							label: 'Modifier Category Description'
						},
						{
							term: 'modifier_image_url',
							label: 'Modifier Image'
						}
					]
				},
				{
					group: 'Modifier Items',
					groupUrl: 'modifierItem',
					terms: [
						{
							term: 'modifier_item_name',
							label: 'Modifier Item Name'
						},
						{
							term: 'modifier_item_desc',
							label: 'Modifier Item Description'
						},
						{
							term: 'modifier_item_image_url',
							label: 'Modifier Item Image'
						}
					]
				},
				{
					group: 'Tags',
					groupUrl: 'tag',
					terms: [
						{
							term: 'tag_name',
							label: 'Tag Name'
						},
						{
							term: 'tag_type',
							label: 'Tag Type'
						},
						{
							term: 'tag_image_url',
							label: 'Tag Image'
						}
					]
				},
				{
					group: 'Portions',
					groupUrl: 'portion',
					terms: [
						{
							term: 'portionlist_name',
							label: 'Portion Name'
						},
						{
							term: 'portionlist_image_url',
							label: 'Portion Icon'
						}
					]
				},
				{
					group: 'Options',
					groupUrl: 'option',
					terms: [
						{
							term: 'option_name',
							label: 'Option Name'
						},
						{
							term: 'option_desc',
							label: 'Option Description'
						},
						{
							term: 'option_image_url',
							label: 'Option Image'
						}
					]
				},
				{
					group: 'Option Items',
					groupUrl: 'optionItem',
					terms: [
						{
							term: 'optionitem_name',
							label: 'Option Item Name'
						},
						{
							term: 'optionitem_desc',
							label: 'Option Item Description'
						},
						{
							term: 'optionitem_image_url',
							label: 'Option Item Image'
						}
					]
				},
				{
					group: 'News',
					groupUrl: 'news',
					terms: [
						{
							term: 'news_title',
							label: 'News Title'
						},
						{
							term: 'news_short_description',
							label: 'News Short Description'
						},
						{
							term: 'news_body',
							label: 'News Body'
						}
					]
				},
				{
					group: 'User FAQs',
					groupUrl: 'faq_user',
					terms: [
						{
							term: 'faq_users_question',
							label: 'Users FAQ Question'
						},
						{
							term: 'faq_users_answer',
							label: 'Users FAQ Answer'
						}
					]
				},
				{
					group: 'Stores FAQs',
					groupUrl: 'faq_stores',
					terms: [
						{
							term: 'faq_stores_question',
							label: 'Stores FAQ Question'
						},
						{
							term: 'faq_stores_answer',
							label: 'Stores FAQ Answer'
						}
					]
				},
				{
					group: 'Promotions',
					groupUrl: 'promotion',
					terms: [
						{
							term: 'promotions_name',
							label: 'Promotion Name'
						},
						{
							term: 'promotions_description',
							label: 'Promotion Description'
						},
						{
							term: 'promotions_short_description',
							label: 'Promotion Short Description'
						},
						{
							term: 'promotions_image',
							label: 'Promotion Image'
						},
						{
							term: 'promotions_cta_text',
							label: 'Promotion CTA Text'
						}
					]
				}
			],
			loadingTerms: false,
			terms: [],
			activeTranslationGroup: {
				groupUrl: '',
				term: ''
			},
			imageOwnerId: null,
			createOrEditErrorMessage: '',
			translationsTableErrorMessage: '',
			languageAccordionOpen: '1',
			activeAccordionSection: '',
			galleryPopupShown: false,
			imagePreviewShown: false,
			imagePreviewUrl: '',
			termRegex: new RegExp('_([a-zA-Z_])+$'),
			saving: false
		}
	},
	watch: {
		'localeForTranslation.language_code' () {
			if (this.activeTranslationGroup.term) {
				this.getTerm(
					this.activeTranslationGroup.groupUrl,
					this.activeTranslationGroup.term
				)
			}
		}
	},
	created () {
		this.getLocales()
	},
	methods: {
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {string} object - The name of the object the image is for
		 * @param {object} value - The open / closed value of the picker
		 * @returns {undefined}
		 */
		toggleImageMode (object, value) {
			this[object] = value
		},
		/**
		 * To open the image preview modal
		 * @function
		 * @param {string} url - The url of the image being previewed
		 * @returns {undefined}
		 */
		openImagePreview (url) {
			this.imagePreviewUrl = url
			this.imagePreviewShown = true
		},
		/**
		 * To close the image preview modal
		 * @function
		 * @returns {undefined}
		 */
		closeImagePreview () {
			this.imagePreviewUrl = ''
			this.imagePreviewShown = false
		},
		/**
		 * To update the image for a term.
		 * @function
		 * @param {object} val - The object containing details of the selected image.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.terms.forEach(term => {
				if (term.id === this.imageOwnerId) {
					term.translation = val.image_url
				}
			})
			this.imageOwnerId = null
			this.closeGallery()
		},
		/**
		 * To open the image gallery popup.
		 * @function
		 * @param {number} termId - The id of the term which is being edited
		 * @returns {undefined}
		 */
		openGallery (termId) {
			this.imageOwnerId = termId
			this.galleryPopupShown = true
		},
		/**
		 * To close the image gallery popup.
		 * @function
		 * @returns {undefined}
		 */
		closeGallery () {
			this.galleryPopupShown = false
		},

		/**
		 * To fetch instances of the selected term for translation.
		 * @function
		 * @param {string} term - The name of the field containing the term
		 * @returns {undefined}
		 */
		translateTerms (term) {
			this.clearError('translationsTable')
			var localizationVue = this
			return localizationVue
				.validateTranslationTermsData()
				.then(response => {
					localizationVue.saving = true

					let field
					switch (localizationVue.activeTranslationGroup.term) {
					case 'faq_users_question':
						field = 'question'
						break
					case 'faq_stores_question':
						field = 'question'
						break
					case 'faq_users_answer':
						field = 'answer'
						break
					case 'faq_stores_answer':
						field = 'answer'
						break
					case 'promotions_name':
						field = 'name'
						break
					case 'promotions_description':
						field = 'description'
						break
					case 'promotions_short_description':
						field = 'short_description'
						break
					case 'promotions_image':
						field = 'image'
						break
					case 'promotions_cta_text':
						field = 'cta_text'
						break
					default:
						field = localizationVue.termRegex
								.exec(localizationVue.activeTranslationGroup.term)[0]
								.slice(1)
					}

					let payload = {
						field: field,
						language: localizationVue.localeForTranslation.language_code,
						translations: localizationVue.terms
					}
					LocalizationFunctions.translateTerms(
						localizationVue.activeTranslationGroup.groupUrl,
						payload,
						localizationVue.$root.appId,
						localizationVue.$root.appSecret,
						localizationVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								localizationVue.terms = response.payload
								localizationVue.showSaveSuccess(response.payload)
							} else {
								localizationVue.translationsTableErrorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not save this translation',
								errorName: 'translationsTableErrorMessage',
								vue: localizationVue
							})
						})
						.finally(() => {
							localizationVue.saving = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					localizationVue.translationsTableErrorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To check if the translation data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateTranslationTermsData () {
			var localizationVue = this
			return new Promise(function (resolve, reject) {
				if (!localizationVue.localeForTranslation.language_code) {
					reject('Select the language to translate to')
				} else if (
					localizationVue.terms.forEach(term => {
						!term.translation
					})
				) {
					reject('Provide at least one translation')
				}
				resolve('Hurray')
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
		 * To alert the user that the menu has been successfully created.
		 * @function
		 * @returns {undefined}
		 */
		showLanguagePrompt () {
			this.$swal({
				title: 'Select language',
				text: 'Select the language you want to translate to first',
				type: 'warning'
			})
		},
		/**
		 * To fetch instances of the selected term for translation.
		 * @function
		 * @param {string} groupUrl - The name of the group containing the term
		 * @param {string} term - The name of the field containing the term
		 * @returns {undefined}
		 */
		getTerm (groupUrl, term) {
			if (!this.localeForTranslation.language_code) {
				this.showLanguagePrompt()
				return
			}
			this.activeTranslationGroup.groupUrl = groupUrl
			this.activeTranslationGroup.term = term
			this.terms = []
			this.loadingTerms = true
			var localizationVue = this
			LocalizationFunctions.getTerm(
				{
					field: term,
					language: localizationVue.localeForTranslation.language_code
				},
				localizationVue.$root.appId,
				localizationVue.$root.appSecret,
				localizationVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						localizationVue.terms = response.payload
						localizationVue.loadingTerms = false
					} else {
						localizationVue.createOrEditErrorMessage = response.message
					}
				})
				.catch(reason => {
					localizationVue.loadingTerms = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch translation terms for this entry',
						errorName: 'translationsTableErrorMessage',
						vue: localizationVue
					})
				})
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
		},
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
							localizationVue.allLocales = response.payload.sort((a, b) => {
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
.image-thumb {
  max-width: 100%;
  max-height: 50px;
  margin: 5px;
}
.image-preview {
  max-height: 100%;
  max-width: 100%;
}
</style>
<style>
.accordion .el-collapse-item__header {
  font-weight: 600;
}
</style>
