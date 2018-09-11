<template>
	<div>
		<div class="help-screen-overlay" v-if="helpScreenShowing">
			<a @click="closeHelpScreen()" class="help-screen-close">{{ langTerms.close[$root.meta.local.toLowerCase()] }}</a>
			<div class="help-screen-information" v-if="this.$root.inspectionCounts.failCount !== 0 || this.$root.inspectionCounts.warningCount !== 0" :style="{'top': helpScreenVars.top, 'background-color': helpScreenVars.color}">
				<span class="help-screen-text">{{ langTerms.view_more_info[$root.meta.local.toLowerCase()] }}</span>
				<span class="help-screen-block">
					<span class="information-icon"></span>
				</span>
				<div class="help-screen-arrow"></div>
			</div>
			<div class="help-screen-select-all" :class="{'french-width': $root.meta.local.toLowerCase() === 'fr-ca'}" v-if="this.$root.inspectionCounts.failCount !== 0 || this.$root.inspectionCounts.warningCount !== 0" :style="{'top': helpScreenVars.selectTop, 'background-color': helpScreenVars.color, 'height': helpScreenVars.height - 1 + 'px'}">
				<span class="help-screen-text">{{ langTerms.select_all_services[$root.meta.local.toLowerCase()] }}</span>
				<span class="help-screen-block" :class="{'help-screen-height': helpScreenVars.height > 30, 'help-screen-selected': helpScreenVars.selectChecked, 'help-screen-not-selected': !helpScreenVars.selectChecked}">
					<span> {{ (helpScreenVars.selectChecked) ? langTerms.remove_all[$root.meta.local.toLowerCase()] : langTerms.select_all[$root.meta.local.toLowerCase()] }} </span>
					<div class="service-checkbox">
						<input type="checkbox" :checked="helpScreenVars.selectChecked">
						<label>
							<span class="check"></span>
							<span class="box"></span>
						</label>
					</div>
				</span>
				<div class="help-screen-arrow"></div>
			</div>
			<div class="help-screen-select-individual" v-if="this.$root.inspectionCounts.failCount !== 0 || this.$root.inspectionCounts.warningCount !== 0" :style="{'top': helpScreenVars.top, 'background-color': helpScreenVars.color}">
				<span class="help-screen-text">{{ langTerms.select_services_individually[$root.meta.local.toLowerCase()] }}</span>
				<span class="help-screen-block">
					<div class="service-checkbox">
						<input type="checkbox" :checked="helpScreenVars.checked">
						<label>
							<span class="check"></span>
							<span class="box"></span>
						</label>
					</div>
				</span>
				<div class="help-screen-arrow"></div>
			</div>
			<div class="help-screen-inspection">
				<span class="help-screen-text">{{ langTerms.view_inspection_summary[$root.meta.local.toLowerCase()] }}</span>
				<span class="inspection-icon"></span>
				<div class="help-screen-arrow"></div>
			</div>
			<div class="help-screen-contact" v-if="$root.mobile">
				<span class="help-screen-text">{{ langTerms.call_us[$root.meta.local.toLowerCase()] }}</span>
				<span class="contact-icon"></span>
				<div class="help-screen-arrow"></div>
			</div>
			<div class="help-screen-chat" v-if="$root.mobile">
				<span class="help-screen-text">{{ langTerms.message_us[$root.meta.local.toLowerCase()] }}</span>
				<span class="chat-icon"></span>
				<div class="help-screen-arrow"></div>
			</div>
		</div>
		<div class="wrapper" :class="{'wrapper-hold': helpScreenShowing}">
			<span class="help-icon" @click="openHelpScreen()"></span>
			<div class="summary-header"> {{ langTerms.inspection_summary[$root.meta.local.toLowerCase()] }}</div>
			<div class="summary-icons">
				<div class="icon">
					<img src="../assets/images/concern.png">
					({{ this.$root.inspectionCounts.concernCount }})
				</div>
				<div class="icon">
					<img src="../assets/images/fail.png">
					({{ this.$root.inspectionCounts.failCount }})
				</div>
				<div class="icon">
					<img src="../assets/images/warning.png">
					({{ this.$root.inspectionCounts.warningCount }})
				</div>
				<div class="icon">
					<img src="../assets/images/pass.png">
					({{ this.$root.inspectionCounts.passCount }})
				</div>
			</div>

			<template v-for="(category, index) in serviceCategories" v-if="category.id === '5' && $root.inspectionCounts.concernCount">
				<div class="grey accordion" :key="`category-${index}`">
					<div @click="toggleAccordion(category)" class="accordion-header">
						<img :src="require('../assets/images/concern-white.png')"> {{ category.name }} {{ ($root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0) ? `(${$root.inspectionCounts[countVariables[category.serviceCategoryType]]})` : '' }}
						<div class="accordion-status" v-if="$root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0"></div>
						<div class="clear"></div>
					</div>
					<div class="accordion-contents">
						<div class="summary-table">
							<div v-if="category.serviceCategoryType !== 'PASS' && $root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0" class="summary-table-row">
								<div class="summary-table-cell">
									<span class="summary-legend">
										<b>{{ langTerms.check_recommended_services[$root.meta.local.toLowerCase()] }}</b>
									</span>
								</div>

								<div class="summary-table-cell">
								</div>

								<div class="summary-table-cell">
									<span> {{ (category.allSelected) ? langTerms.remove_all[$root.meta.local.toLowerCase()] : langTerms.select_all[$root.meta.local.toLowerCase()] }} </span>
									<div class="service-checkbox">
										<input type="checkbox" :id="`select-${category.serviceCategoryType}`" v-model="category.allSelected" @change="toggleAll(category)">
										<label :for="`select-${category.serviceCategoryType}`">
											<span class="check"></span>
											<span class="box"></span>
										</label>
									</div>
								</div>
							</div>

							<template v-for="(service, serviceIndex) in $root.services">
								<template v-if="
									(
										category.id === '5' &&
										(service.category === '6' ||
										service.category === '7' ||
										service.category === '8')
									)">
									<div 
										class="summary-table-row summary-item" 
										v-if="showCategoryItems(category, service)" 
										:key="`service-${serviceIndex}`">
										<div class="summary-table-cell">
											<span 
												class="information-icon" 
												:class="{'no-icon-bg': category.serviceCategoryType === 'PASS' || service.category === '8'}" 
												@click="openServiceModal(service)">
											</span>
											<span 
												class="service-name" 
												v-bind:class="{'bold': (service.isHighlighted === true)}">
												<span v-if="service.isHighlighted === true">* </span>{{ service.name }}
											</span>
										</div>
										<div class="summary-table-cell">
											<div class="dot-caption-container">
												<div class="dot-container">
													<span :class="{'red-dot' : service.category === '6'}"></span>
													<span :class="{'yellow-dot' : service.category === '7'}"></span>
													<span :class="{'green-dot' : service.category === '8'}"></span>
												</div>
												<span class="dot-caption" v-if="service.subServices">{{service.subServices[0].name}}</span>
											</div>
										</div>
										<div class="summary-table-cell">
											<template v-if="category.serviceCategoryType !== 'PASS' && service.category !== '8'">
												<span class="price" v-if="service.price !== 0">{{ formatCurrency(service.price) }}</span>
												<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
												<div class="service-checkbox">
													<input 
														type="checkbox" 
														:id="`sub-service-${service.id}`" 
														v-model="service.isSelected" 
														@change="toggleCheckbox(category, service)">
													<label :for="`sub-service-${service.id}`">
														<span class="check"></span>
														<span class="box"></span>
													</label>
												</div>
											</template>
										</div>
									</div>
								</template>
							</template>
						</div>
					</div>
				</div>
				<div v-if="showLegend(category)" :key="`legend-${index}`"><p class="newRecAst">{{ langTerms.new_recommendation[$root.meta.local.toLowerCase()] }}</p></div>
			</template>

			<template v-for="(category, index) in serviceCategories" v-if="category.showOnInspection && category.id !=='5'">
				<div 
					:class="{
						'accordion-open': category.defaultExpended, 
						'accordion-closed': !category.defaultExpended, 
						'red': category.serviceCategoryType === 'SAFETY', 
						'yellow': category.serviceCategoryType === 'ATTN', 
						'green': category.serviceCategoryType === 'PASS'
					}" 
					class="accordion"
					:key="`category-${index}`">
					<div @click="toggleAccordion(category)" class="accordion-header">
						<img :src="category.iconUrl"> {{ category.name }} {{ ($root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0) ? `(${$root.inspectionCounts[countVariables[category.serviceCategoryType]]})` : '' }}
						<div class="accordion-status" v-if="$root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0"></div>
						<div class="clear"></div>
					</div>
					<div class="accordion-contents">
						<div v-if="category.serviceCategoryType === 'PASS'" class="view-full-report">
							<div class="view-full-report-btn" @click.stop="openFullInspection()">
								<a id="viewReport">
									{{ langTerms.view_full_report[$root.meta.local.toLowerCase()] }}
									<img src="../assets/images/external-link.png">
								</a>
							</div>
						</div>
						<div class="summary-table">
							<div v-if="category.serviceCategoryType !== 'PASS' && $root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0" class="summary-table-row">
								<div class="summary-table-cell">
									<span class="summary-legend">
										<b>{{ langTerms.check_recommended_services[$root.meta.local.toLowerCase()] }}</b>
									</span>
								</div>

								<div class="summary-table-cell">
								</div>

								<div class="summary-table-cell">
									<span> {{ (category.allSelected) ? langTerms.remove_all[$root.meta.local.toLowerCase()] : langTerms.select_all[$root.meta.local.toLowerCase()] }} </span>
									<div class="service-checkbox">
										<input type="checkbox" :id="`select-${category.serviceCategoryType}`" v-model="category.allSelected" @change="toggleAll(category)">
										<label :for="`select-${category.serviceCategoryType}`">
											<span class="check"></span>
											<span class="box"></span>
										</label>
									</div>
								</div>
							</div>

							<template v-for="(service, serviceIndex) in $root.services">
								<template v-if="
									(
										category.id === service.category
									) || 
									(
										category.id === '5' &&
										(service.category === '6' ||
										service.category === '7' ||
										service.category === '8')
									)">
									<template v-if="service.subServices">
										<div class="summary-table-row summary-item" v-for="subService in service.subServices" :key="`subService-${subService.id}`">
											<div class="summary-table-cell">
												<span class="information-icon" :class="{'no-icon-bg': category.serviceCategoryType === 'PASS'}" @click="openServiceModal(subService)"></span>
												<span class="service-name" v-bind:class="{'bold': (subService.isHighlighted ===  true)}"><span v-if="subService.isHighlighted === true">* </span>{{ subService.name }}</span>
											</div>
											<div class="summary-table-cell">
												<span :class="{'red-dot' : service.category === '6'}"></span>
												<span :class="{'yellow-dot' : service.category === '7'}"></span>
												<span :class="{'green-dot' : service.category === '8'}"></span>
											</div>
											<div class="summary-table-cell">
												<template v-if="category.serviceCategoryType !== 'PASS'">
													<span class="price" v-if="subService.price !== 0">{{ formatCurrency(subService.price) }} </span>
													<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
													<div class="service-checkbox">
														<input type="checkbox" :id="`sub-service-${subService.id}`" v-model="subService.isSelected" @change="toggleCheckbox(category, subService)">
														<label :for="`sub-service-${subService.id}`">
															<span class="check"></span>
															<span class="box"></span>
														</label>
													</div>
												</template>
											</div>
										</div>
									</template>
									<div class="summary-table-row summary-item" v-if="showCategoryItems(category, service)" :key="`service-${serviceIndex}`">
										<div class="summary-table-cell">
											<span class="information-icon" :class="{'no-icon-bg': category.serviceCategoryType === 'PASS'}" @click="openServiceModal(service)"></span>
											<span class="service-name" v-bind:class="{'bold': (service.isHighlighted === true)}"><span v-if="service.isHighlighted === true">* </span>{{ service.name }}</span>
										</div>
										<div class="summary-table-cell">
											<span :class="{'red-dot' : service.category === '6'}"></span>
											<span :class="{'yellow-dot' : service.category === '7'}"></span>
											<span :class="{'green-dot' : service.category === '8'}"></span>
										</div>
										<div class="summary-table-cell">
											<template v-if="category.serviceCategoryType !== 'PASS'">
												<span class="price" v-if="service.price !== 0">{{ formatCurrency(service.price) }}</span>
												<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
												<div class="service-checkbox">
													<input type="checkbox" :id="`sub-service-${service.id}`" v-model="service.isSelected" @change="toggleCheckbox(category, service)">
													<label :for="`sub-service-${service.id}`">
														<span class="check"></span>
														<span class="box"></span>
													</label>
												</div>
											</template>
										</div>
									</div>
								</template>
							</template>
						</div>
					</div>
				</div>
				<div v-if="showLegend(category)" :key="`legend-${index}`"><p class="newRecAst">{{ langTerms.new_recommendation[$root.meta.local.toLowerCase()] }}</p></div>
			</template>

			<div class="proceed-component">
				<div v-if="$root.inspectionCounts.failCount && $root.inspectionCounts.warningCount" class="time-notice" :class="{'danger-flag': timeExpired}">
					<span v-if="!timeExpired">{{ langTerms.if_approved_by[$root.meta.local.toLowerCase()] }} {{ computedResponseTime }} {{ langTerms.your_vehicle_will_be_ready[$root.meta.local.toLowerCase()] }} {{ computedPromiseTime }}.</span>
					<span v-else>{{ langTerms.your_service_advisor_will_contact[$root.meta.local.toLowerCase()] }}</span>
				</div>
				<div v-if="!$root.inspectionCounts.failCount && !$root.inspectionCounts.warningCount" class="time-notice">
					<span>{{ langTerms.your_vehicle_will_be_ready[$root.meta.local.toLowerCase()] }} {{ computedPromiseTime }}.</span>
				</div>
				<div class="total-estimate">
					<div class="total-label">
						<div class="large">
							{{ langTerms.estimate_for_selected_services[$root.meta.local.toLowerCase()] }}
						</div>
					</div>
					<div class="total-estimate-value">
						{{ formatCurrency(inspectionTotal.total) }}
					</div>
				</div>
				<div class="total-estimate">
					<div class="total-label">
						<div class="large">
							{{ langTerms.estimate_for_previous_services[$root.meta.local.toLowerCase()] }}
						</div>
					</div>
					<div class="total-estimate-value">
						{{ formatCurrency($root.totals.serviceTotal.total) }}
					</div>
				</div>
				<div @click="openServices()" class="proceed-btn">
					{{ langTerms.next[$root.meta.local.toLowerCase()] }}
				</div>
				<div class="footer-bar">
					<a v-if="$root.mobile" :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon" @click="$root.logEvent('Clicked Phone icon')"></a>
					<a v-if="$root.mobile" :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon" @click="$root.logEvent('Clicked Text icon')"></a>
					<!-- <a :href="this.$root.meta.inspectionPdfUrl" target="_blank" class="inspection-icon" @click="$root.logEvent(`Opened Inspection Summary PDF`)"></a> -->
					<a @click="openFullInspection()" href="javascript:void(0);" class="inspection-icon"></a>
				</div>
			</div>
		</div>
		<info-popup v-if="modalOpen" :viewingService="viewingService" @closeModal="closeServiceModal" @approve="approveService" @defer="deferService"></info-popup>
		<defer-modal v-if="deferModal" @deferReason="deferServiceReason"></defer-modal>
	</div>
</template>

<script>
import $ from 'jquery'
import DeferModal from './DeferModal'
import InfoPopup from './InfoPopup'

let allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export default {
	data () {
		return {
			countVariables: {
				'SAFETY': 'failCount',
				'ATTN': 'warningCount',
				'PASS': 'passCount',
				'CCRD': 'concernCount'
			},
			services: this.$root.services,
			modalOpen: false,
			serviceCategories: [],
			inspectionTotal: 0,
			viewingService: {},
			timeExpired: false,
			helpScreenShowing: false,
			helpScreenVars: {
				top: 0,
				color: '#fff',
				selectTop: 0,
				height: 0
			},
			deferModal: false,
			activeDeferralService: {},
			activeDeferralCategory: {},
			categoryDeferral: false,
			langTerms: {
				close: {
					'en-ca': 'Close',
					'en-us': 'Close',
					'fr-ca': 'Fermer'
				},
				view_more_info: {
					'en-ca': 'View more information about the service',
					'en-us': 'View more information about the service',
					'fr-ca': 'Afficher des détails additionnels concernant le service'
				},
				select_all_services: {
					'en-ca': 'Select all services',
					'en-us': 'Select all services',
					'fr-ca': 'Sélectionner tous les services'
				},
				remove_all: {
					'en-ca': 'Remove All',
					'en-us': 'Remove All',
					'fr-ca': 'Supprimer tout'
				},
				select_all: {
					'en-ca': 'Select All',
					'en-us': 'Select All',
					'fr-ca': 'Sélectionner tout'
				},
				select_services_individually: {
					'en-ca': 'Select services individually',
					'en-us': 'Select services individually',
					'fr-ca': 'Sélectionner les services individuellement'
				},
				view_inspection_summary: {
					'en-ca': 'View your inspection summary',
					'en-us': 'View your inspection summary',
					'fr-ca': 'Afficher votre récapitulatif de l\'inspection'
				},
				call_us: {
					'en-ca': 'Call Us',
					'en-us': 'Call Us',
					'fr-ca': 'Call Us'
				},
				message_us: {
					'en-ca': 'Message Us',
					'en-us': 'Message Us',
					'fr-ca': 'Message Us'
				},
				inspection_summary: {
					'en-ca': 'Inspection Summary',
					'en-us': 'Inspection Summary',
					'fr-ca': 'Récapitulatif de l\'Inspection'
				},
				no: {
					'en-ca': 'No',
					'en-us': 'No',
					'fr-ca': 'Aucun'
				},
				were_found: {
					'en-ca': 'were found',
					'en-us': 'were found',
					'fr-ca': 'découvert'
				},
				view_full_report: {
					'en-ca': 'View Full Report',
					'en-us': 'View Full Report',
					'fr-ca': 'Afficher le rapport complet'
				},
				check_recommended_services: {
					'en-ca': 'Check the recommended services you authorize.',
					'en-us': 'Check the recommended services you authorize.',
					'fr-ca': 'Sélectionnez toutes les recommandations vous autorisez.'
				},
				free: {
					'en-ca': 'Free',
					'en-us': 'Free',
					'fr-ca': 'Gratuit'
				},
				if_approved_by: {
					'en-ca': 'If approved by',
					'en-us': 'If approved by',
					'fr-ca': 'Si les recommandations sont approuvées avant'
				},
				your_vehicle_will_be_ready: {
					'en-ca': 'your vehicle will be ready for pickup by',
					'en-us': 'your vehicle will be ready for pickup by',
					'fr-ca': 'votre véhicule sera prêt pour'
				},
				your_service_advisor_will_contact: {
					'en-ca': 'Your service advisor will contact you when your services are completed',
					'en-us': 'Your service advisor will contact you when your services are completed',
					'fr-ca': 'Votre conseiller au service vous contactera lorsque les services seront complétés.'
				},
				estimate_for_selected_services: {
					'en-ca': 'Estimate for Selected Services (not including taxes and fees)',
					'en-us': 'Estimate for Selected Services (not including taxes and fees)',
					'fr-ca': 'Coût estimatif pour les services sélectionnés (taxes et frais non inclus)'
				},
				estimate_for_previous_services: {
					'en-ca': 'Estimate for Previously Approved Services',
					'en-us': 'Estimate for Previously Approved Services',
					'fr-ca': 'Coût estimatif pour les services précédemment approuvés'
				},
				next: {
					'en-ca': 'Next',
					'en-us': 'Next',
					'fr-ca': 'Suivant'
				},
				new_recommendation: {
					'en-ca': '* indicates a new/updated recommendation',
					'en-us': '* indicates a new/updated recommendation',
					'fr-ca': '* indique une recommandation ajoutée ou mise à jour'
				}
			}
		}
	},
	watch: {
		viewingService (thisService, previousService) {
			if (previousService.id !== undefined) {
				this.$root.logInfoPopupDuration(previousService.id)
			}
			if (thisService.id !== undefined) {
				this.$root.logInfoPopupDuration(thisService.id)
			}
		}
	},
	created () {
		if (this.$root.meta.expired) {
			this.$router.push('/')
		}
		this.serviceCategories = this.$root.serviceCategories
		this.inspectionTotal = this.$root.totals.inspectionTotal

		$('html, body').scrollTop(0)

		let dateConst = new Date()
		let responseDate = new Date(this.$root.meta.responseBy)
		this.timeExpired = responseDate < dateConst

		this.checkSelectAll()

		this.$root.logPageDuration('inspection')

		$(window).resize(() => {
			this.closeHelpScreen()
		})
	},
	destroyed () {
		this.$root.logPageDuration('inspection')
	},
	computed: {
		/**
		 * To compute the format of time the customer needs to respond by
		 * @function
		 * @returns {string} - The formatted time
		 */

		computedResponseTime () {
			let formattedTime = ''
			let fullDate = new Date(this.$root.meta.responseBy)
			let hour = fullDate.getHours()
			let minutes = fullDate.getMinutes()
			let meridian = 'AM'
			let preposition = this.$root.meta.local === 'en-CA' || this.$root.meta.local === 'en-US' ? 'on' : 'le'

			if (this.$root.meta.local === 'en-CA' || this.$root.meta.local === 'en-US') {
				if (hour === 12) {
					meridian = 'PM'
				} else if (hour > 12) {
					meridian = 'PM'
					hour -= 12
				} else if (hour === 0) {
					hour = 12
				}
			}

			if (minutes === 0) {
				minutes = '00'
			} else if (minutes < 10) {
				minutes = '0' + minutes
			}

			if (this.$root.meta.local === 'fr-CA') {
				formattedTime = hour + ' h ' + minutes
			} else {
				formattedTime = hour + ':' + minutes + ' ' + meridian
			}

			if (this.$root.meta.local === 'fr-CA') {
				allMonths = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
			}
			if (!this.checkSameDate(this.$root.meta.responseBy)) {
				formattedTime += ` ${preposition} ${allMonths[fullDate.getMonth()]} ${fullDate.getDate()}, ${fullDate.getFullYear()}`
			}
			return formattedTime
		},
		/**
		 * To compute the format of time the customers car will be ready
		 * @function
		 * @returns {string} - The formatted time
		 */
		computedPromiseTime () {
			let formattedTime = ''
			let fullDate = new Date(this.$root.meta.promise)
			let hour = fullDate.getHours()
			let minutes = fullDate.getMinutes()
			let meridian = 'AM'
			let preposition = this.$root.meta.local === 'en-CA' || this.$root.meta.local === 'en-US' ? 'on' : 'le'

			if (this.$root.meta.local === 'en-CA' || this.$root.meta.local === 'en-US') {
				if (hour === 12) {
					meridian = 'PM'
				} else if (hour > 12) {
					meridian = 'PM'
					hour -= 12
				} else if (hour === 0) {
					hour = 12
				}
			}

			if (minutes === 0) {
				minutes = '00'
			} else if (minutes < 10) {
				minutes = '0' + minutes
			}

			if (this.$root.meta.local === 'fr-CA') {
				formattedTime = hour + ' h ' + minutes
			} else {
				formattedTime = hour + ':' + minutes + ' ' + meridian
			}

			if (this.$root.meta.local === 'fr-CA') {
				allMonths = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
			}
			if (!this.checkSameDate(this.$root.meta.promise)) {
				formattedTime += ` ${preposition} ${allMonths[fullDate.getMonth()]} ${fullDate.getDate()}, ${fullDate.getFullYear()}`
			}
			return formattedTime
		}
	},
	methods: {
		/**
		 * To format a number by locale to two decimal digits
		 * @function
		 * @param {number} number - The number to format
		 * @returns {String} - A formatted string
		 */
		formatCurrency (number) {
			const local = number.toLocaleString(this.$root.meta.local, {
				minimumFractionDigits: 2, maximumFractionDigits: 2
			})
			if (this.$root.meta.local === 'fr-CA') {
				return `${local} $`
			} else {
				return `$${local}`
			}
		},
		/**
		 * To determine if the legend should be displayed by checking if the category includes highlighted services (skip free services as they aren't shown)
		 * @function
		 * @param {object} category - The category to check
		 * @returns {Number} - Positive integer if legend should be displayed, 0 if not
		 */
		showLegend (category) {
			let show = 0
			this.$root.services.forEach(service => {
				if (service.category === category.id) {
					if (service.subServices) {
						service.subServices.forEach(subService => {
							let condition = subService.isHighlighted
							if (condition) {
								show = 1
							}
						})
					} else {
						let condition = service.isHighlighted
						if (condition) {
							show = 1
						}
					}
				}
			})
			return show
		},
		/**
		 * To determine if the items in categories need to shown or not.
		 * @function
		 * @param {object} category - The category to check
		 * @param {object} service - The service price to check
		 * @returns {Number} - True|False.
		 */
		showCategoryItems (category, service) {
			if (category.serviceCategoryType !== 'PASS' && service.price !== 0) {
				return true
			} else if (category.serviceCategoryType === 'PASS') {
				return true
			} else if (category.serviceCategoryType === 'CCRD') {
				return true
			} else {
				return false
			}
		},
		/**
		 * To open the full inspection in a separate tab
		 * @function
		 * @returns {undefined}
		 */
		openFullInspection () {
			this.$root.logEvent('Opened Inspection Summary PDF')
			window.open(this.$root.meta.inspectionPdfUrl, '_blank')
		},
		/**
		 * To toggle the category accordion open and close
		 * @param {object} category - The category to toggle
		 * @function
		 * @returns {undefined}
		 */
		toggleAccordion (category) {
			category.defaultExpended ? this.$root.logEvent(`Collapsed ${category.name} accordion`) : this.$root.logEvent(`Expanded ${category.name} accordion`)
			category.defaultExpended = !category.defaultExpended
		},
		/**
		 * To add and subtract the selected service from the total price
		 * @param {object} category - The parent category of the service
		 * @param {object} service - The service being toggled
		 * @function
		 * @returns {undefined}
		 */
		toggleCheckbox (category, service) {
			if (!this.$root.$data.userActivity.eventTracker.length || this.$root.$data.userActivity.eventTracker[this.$root.$data.userActivity.eventTracker.length - 1].event !== `Deferred ${service.name} service`) {
				service.isSelected ? this.$root.logEvent(`Checked ${service.name} checkbox`) : this.$root.logEvent(`Unchecked ${service.name} checkbox`)
			}
			if (service.isSelected) {
				this.inspectionTotal.total += parseFloat(service.price)
				this.checkSelectAll()
			} else {
				this.inspectionTotal.total -= parseFloat(service.price)
				if (category) {
					if (category.allSelected) {
						category.allSelected = false
					}
				} else {
					this.checkSelectAll()
				}

				this.openDeferReasonModal(category, service)
			}

			// Doing this only to prevent value of -0.00
			this.inspectionTotal.total = Math.abs(this.inspectionTotal.total)

			this.$root.totals.inspectionTotal = this.inspectionTotal
		},
		/**
		 * To open the defer modal and set the active service as the one being deferred
		 * @param {object} category - The parent category of the service
		 * @param {object} service - The service being deferred
		 * @param {boolean} multiple - Whether this is a category deferral or single service
		 * @function
		 * @returns {undefined}
		 */
		openDeferReasonModal (category, service, multiple) {
			this.deferModal = true

			if (multiple) {
				this.categoryDeferral = true
				this.activeDeferralCategory = Object.assign({}, category)
			} else {
				this.categoryDeferral = false
				this.activeDeferralService = Object.assign({}, service)
			}
		},
		/**
		 * To add the deferral reason to the service
		 * @param {object} reason - The reason for deferral
		 * @function
		 * @returns {undefined}
		 */
		deferServiceReason (reason) {
			this.deferModal = false

			if (this.categoryDeferral) {
				this.$root.services.forEach(service => {
					if (service.category === this.activeDeferralCategory.id) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								subService.reasonId = reason.id
							})
						} else {
							service.reasonId = reason.id
						}
					}
				})
				this.activeDeferralCategory = Object.assign({})
			} else {
				for (let i = 0, x = this.$root.services.length; i < x; i++) {
					if (this.$root.services[i].subServices) {
						for (let j = 0, y = this.$root.services[i].subServices.length; j < y; j++) {
							if (this.$root.services[i].subServices[j].id === this.activeDeferralService.id) {
								this.$root.services[i].subServices[j].reasonId = reason.id
								break
							}
						}
					} else {
						if (this.$root.services[i].id === this.activeDeferralService.id) {
							this.$root.services[i].reasonId = reason.id
							break
						}
					}
				}
				this.activeDeferralService = Object.assign({})
			}
		},
		/**
		 * To turn on or off the checkboxes for all category services as well as add and subtract the selected service from the total price
		 * @param {object} category - The category to be toggled
		 * @function
		 * @returns {undefined}
		 */
		toggleAll (category) {
			if (category.allSelected) {
				this.$root.logEvent(`Selected all in ${category.name} category`)
				this.$root.services.forEach(service => {
					if (
						(service.category === category.id) ||
						(category.id === '5' &&
							(
								service.category === '6' ||
								service.category === '7' ||
								service.category === '8'
							)
						)
					) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								if (!subService.isSelected) {
									subService.isSelected = true
									this.inspectionTotal.total += parseFloat(subService.price)
								}
							})
						}
						if (!service.isSelected) {
							service.isSelected = true
							this.inspectionTotal.total += parseFloat(service.price)
						}
					}
				})
			} else {
				this.$root.logEvent(`Removed all in ${category.name} category`)
				this.$root.services.forEach(service => {
					console.log({service, category})
					if (
						(service.category === category.id) ||
						(category.id === '5' &&
							(
								service.category === '6' ||
								service.category === '7' ||
								service.category === '8'
							)
						)
					) {
						if (service.subServices && service.subServices.length) {
							service.subServices.forEach(subService => {
								if (subService.isSelected) {
									subService.isSelected = false
									this.inspectionTotal.total -= parseFloat(subService.price)
								}
							})
						}
						if (service.isSelected) {
							service.isSelected = false
							this.inspectionTotal.total -= parseFloat(service.price)
						}

						this.openDeferReasonModal(category, {}, true)
					}
				})
			}

			// Doing this only to prevent value of -0.00
			this.inspectionTotal.total = Math.abs(this.inspectionTotal.total)

			this.$root.totals.inspectionTotal = this.inspectionTotal
		},
		/**
		 * To check if the select all toggle should be on or off
		 * @function
		 * @returns {undefined}
		 */
		checkSelectAll () {
			this.serviceCategories.forEach(category => {
				let count = 0
				let total = 0

				this.$root.services.forEach(service => {
					if (
						(service.category === category.id) ||
						(category.id === '5' &&
							(
								service.category === '6' ||
								service.category === '7' ||
								service.category === '8'
							)
						)
					) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								total += 1
								if (subService.isSelected) {
									count += 1
								}
							})
						} else {
							total += 1
							if (service.isSelected) {
								count += 1
							}
						}
					}
				})

				if (count === total) {
					this.$set(category, 'allSelected', true)
				} else {
					this.$set(category, 'allSelected', false)
				}
			})
		},
		/**
		 * To open the detailed view modal
		 * @function
		 * @param {object} service - The service to be viewed in detail
		 * @returns {undefined}
		 */
		openServiceModal (service) {
			this.$root.logEvent(`Displayed ${service.name} info window`)
			this.viewingService = service
			this.modalOpen = true
		},
		/**
		 * To close the detailed view modal
		 * @function
		 * @returns {undefined}
		 */
		closeServiceModal () {
			this.viewingService = {}
			this.modalOpen = false
		},
		/**
		 * To approve the service and close the modal
		 * @function
		 * @returns {undefined}
		 */
		approveService () {
			if (!this.viewingService.isSelected) {
				this.viewingService.isSelected = true
				this.toggleCheckbox(null, this.viewingService)
			}
			this.closeServiceModal()
		},
		/**
		 * To defer the service and close the modal
		 * @function
		 * @returns {undefined}
		 */
		deferService () {
			this.viewingService.isSelected = false
			this.toggleCheckbox(null, this.viewingService)
			this.closeServiceModal()
		},
		/**
		 * To redirect to the services route
		 * @function
		 * @returns {undefined}
		 */
		openServices () {
			this.$root.logEvent(`Clicked the Next button`)
			this.$router.push({name: 'services'})
		},
		/**
		 * To check whether the responseBy date is today or a future date
		 * @function
		 * @param {string} date - The date being checked
		 * @returns {boolean} - Whether or not it is the same date
		 */
		checkSameDate (date) {
			let checkDate = new Date(date)
			let now = new Date()

			return checkDate.getFullYear() === now.getFullYear() && checkDate.getMonth() === now.getMonth() && checkDate.getDate() === now.getDate()
		},
		/**
		 * To open the help screen and initialize help screen variables
		 * @function
		 * @returns {undefined}
		 */
		openHelpScreen () {
			this.serviceCategories.forEach(category => {
				category.defaultExpended = true
			})
			setTimeout(() => {
				if (this.$root.inspectionCounts.failCount > 0) {
					this.helpScreenVars.height = $('.wrapper').find('.accordion.red').find('.summary-table-row').first().height()
					this.helpScreenVars.top = ($('.wrapper').find('.accordion.red').offset().top + this.helpScreenVars.height + 34) + 'px'
					this.helpScreenVars.selectTop = ($('.wrapper').find('.accordion.red').offset().top + 34) + 'px'
					this.helpScreenVars.color = '#f4b2b2'
					this.helpScreenVars.checked = $('.accordion.red').find('.summary-item').find('input').first()[0].checked
					this.helpScreenVars.selectChecked = $('.accordion.red').find('input').first()[0].checked
				} else if (this.$root.inspectionCounts.warningCount > 0) {
					this.helpScreenVars.height = $('.wrapper').find('.accordion.yellow').find('.summary-table-row').first().height()
					this.helpScreenVars.top = ($('.wrapper').find('.accordion.yellow').offset().top + this.helpScreenVars.height + 34) + 'px'
					this.helpScreenVars.selectTop = ($('.wrapper').find('.accordion.yellow').offset().top + 34) + 'px'
					this.helpScreenVars.color = '#fbeab4'
					this.helpScreenVars.checked = $('.accordion.yellow').find('.summary-item').find('input').first()[0].checked
					this.helpScreenVars.selectChecked = $('.accordion.yellow').find('input').first()[0].checked
				}

				this.helpScreenShowing = true
			}, 0)
		},
		/**
		 * To close the help screen
		 * @function
		 * @returns {undefined}
		 */
		closeHelpScreen () {
			this.helpScreenShowing = false
		}
	},
	components: {
		DeferModal,
		InfoPopup
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bold{
	font-weight: bold;
}
.newRecAst{
	font-size: 12px;
	text-align: left;
	padding: 3px 10px;
	font-weight: bold;
}
.accordion-open .accordion-status {
	float: right;
	margin-top: 8px;
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 6px solid #fff;
}
.accordion-closed .accordion-status {
	float: right;
	margin-top: 8px;
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-bottom: 6px solid #fff;
}
.service-checkbox {
	display: inline-block;
	position: relative;
	height: 15px;
	width: 15px;
	vertical-align: middle;
	margin-left: 5px;
}
.service-checkbox input {
	visibility: hidden;
	position: absolute;
}
.service-checkbox label {
	display: block;
	background: #fff;
	width: 100%;
	height: 100%;
	background-size: 15px 15px;
}
.service-checkbox input[type=checkbox]:checked~label {
	background-image: url('../assets/images/checkbox-checked.png');
}
.help-screen-block.help-screen-height {
	padding-left: 28px;
	text-align: right;
	padding-right: 10px;
}
.help-screen-block.help-screen-selected {
	padding-left: 5px;
}
.french-width .help-screen-block.help-screen-selected {
	padding-left: 25px;
}
.help-screen-block.help-screen-not-selected {
	padding-left: 16px;
}
.help-screen-select-all.french-width {
	width: 130px;
}
</style>
