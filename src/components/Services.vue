<template>
	<div class="wrapper">
		<div class="summary-header">
			{{ langTerms.service_summary[$root.meta.local.toLowerCase()] }}
		</div>
		<div v-if="$root.inspectionCounts.failCount || $root.inspectionCounts.warningCount" class="service-header">
			<div class="large">
				{{ langTerms.newly_approved_services[$root.meta.local.toLowerCase()] }}
			</div>
			<div class="small">
				{{ langTerms.items_you_approved[$root.meta.local.toLowerCase()] }}
			</div>
		</div>
		<div v-if="$root.inspectionCounts.failCount || $root.inspectionCounts.warningCount" class="summary-table">
			<template v-for="service in $root.services">
				<template v-if="checkSubServices(service)">
					<!-- <div class="summary-table-row summary-item">
						<div class="summary-table-cell">
							<span class="information-icon no-icon-bg"></span>
							<span class="service-name"><b>{{ service.name }}</b></span>
						</div>
						<div class="summary-table-cell"></div>
					</div> -->
					<template v-for="subService in service.subServices">
						<template v-if="subService.isSelected && service.category !== '4' && service.category !== '3'">
							<div class="summary-table-row summary-item">
								<div class="summary-table-cell">
									<span class="information-icon" @click="openServiceModal(subService)"></span>
									<span class="service-name">{{ subService.name }}</span>
								</div>
								<div class="summary-table-cell">
									<span class="price" v-if="subService.price !== 0"> ${{ (subService.price).toFixed(2) }} </span>
									<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
								</div>
							</div>
						</template>
					</template>
				</template>
				<template v-if="!service.subServices">
					<template v-if="service.isSelected && service.category !== '4' && service.category !== '3'">
						<div class="summary-table-row summary-item">
							<div class="summary-table-cell">
								<span class="information-icon" @click="openServiceModal(service)"></span>
								<span class="service-name">{{ service.name }}</span>
							</div>
							<div class="summary-table-cell">
								<span class="price" v-if="service.price !== 0"> ${{ (service.price).toFixed(2) }} </span>
								<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
							</div>
						</div>
					</template>
				</template>
			</template>
			<div class="summary-table-row service-subtotal">
				<div class="summary-table-cell">
					{{ langTerms.subtotal[$root.meta.local.toLowerCase()] }}:
				</div>
				<div class="summary-table-cell">
					<span class="price"> ${{ (this.$root.totals.inspectionTotal.total).toFixed(2) }} </span>
				</div>
			</div>
		</div>

		<div :class="{'accordion-open': this.accordion, 'accordion-closed': !this.accordion}" class="service-accordion">
			<div @click="toggleAccordion()" class="service-accordion-header service-header">
				<div class="service-accordion-status"></div>
				<div class="large">
					{{ langTerms.previously_approved_services[$root.meta.local.toLowerCase()] }}
				</div>
				<div class="small">
					{{ langTerms.items_you_approved_when_you_checked[$root.meta.local.toLowerCase()] }}
				</div>
			</div>
			<div class="accordion-contents">
				<div class="summary-table">
					<template v-for="service in $root.services">
						<template v-if="service.category === '4'">
							<template v-if="service.subServices">
								<!-- <div class="summary-table-row summary-item">
									<div class="summary-table-cell">
										<span class="information-icon no-icon-bg"></span>
										<span class="service-name"><b>{{ service.name }}</b></span>
									</div>
									<div class="summary-table-cell"></div>
								</div> -->
								<template v-for="subService in service.subServices">
									<div class="summary-table-row summary-item">
										<div class="summary-table-cell">
											<span class="information-icon no-icon-bg"></span>
											<span class="service-name">{{ subService.name }}</span>
										</div>
										<div class="summary-table-cell">
											<span class="price" v-if="subService.price !== 0"> ${{ (subService.price).toFixed(2) }} </span>
											<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
										</div>
									</div>
								</template>
							</template>
							<template v-else>
								<div class="summary-table-row summary-item">
									<div class="summary-table-cell">
										<span class="information-icon no-icon-bg"></span>
										<span class="service-name">{{ service.name }}</span>
									</div>
									<div class="summary-table-cell">
										<span class="price" v-if="service.price !== 0"> ${{ (service.price).toFixed(2) }} </span>
										<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
									</div>
								</div>
							</template>
						</template>
					</template>
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell">
							{{ langTerms.subtotal[$root.meta.local.toLowerCase()] }}:
						</div>
						<div class="summary-table-cell">
							<span class="price"> ${{ (this.$root.totals.serviceTotal.total).toFixed(2) }} </span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="accept-estimate-component" v-if="!open">
			<div class="service-total">
				<div v-if="$root.inspectionCounts.failCount || $root.inspectionCounts.warningCount" class="time-notice" :class="{'danger-flag': timeExpired}">
					<span v-if="!timeExpired">{{ langTerms.if_approved_by[$root.meta.local.toLowerCase()] }} {{ computedResponseTime }} {{ langTerms.your_vehicle_will_be_ready[$root.meta.local.toLowerCase()] }} {{ computedPromiseTime }}.</span>
					<span v-else>{{ langTerms.your_service_advisor_will[$root.meta.local.toLowerCase()] }}</span>
				</div>
				<div v-if="!$root.inspectionCounts.failCount && !$root.inspectionCounts.warningCount" class="time-notice">
					<span>{{ langTerms.your_vehicle_will_be_ready[$root.meta.local.toLowerCase()] }} {{ computedPromiseTime }}.</span>
				</div>
				<div class="summary-table">
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell">
							{{ langTerms.estimated_taxes_and_fees[$root.meta.local.toLowerCase()] }}
						</div>
						<div class="summary-table-cell">
							<span class="price">${{ tax.toFixed(2) }}</span>
						</div>
					</div>
				</div>
				<div class="summary-table">
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell grand-total">
							{{ langTerms.estimate_total[$root.meta.local.toLowerCase()] }}
						</div>
						<div class="summary-table-cell">
							<span class="price">${{ (tax + this.$root.totals.inspectionTotal.total + this.$root.totals.serviceTotal.total).toFixed(2) }}</span>
						</div>
					</div>
				</div>
			</div>
			<div v-if="noActionRequired" @click="openThanksWithoutSignature()" class="proceed-btn">
				{{ langTerms.continue[$root.meta.local.toLowerCase()] }}
			</div>
			<div v-else @click="openSignature(true)" class="proceed-btn">
				{{ langTerms.accept_estimate[$root.meta.local.toLowerCase()] }}
			</div>
			<div class="footer-bar">
				<div class="footer-bar">
					<a v-if="$root.mobile" :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon" @click="$root.logEvent(`Clicked Phone icon`)"></a>
					<a v-if="$root.mobile" :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon" @click="$root.logEvent(`Clicked Text icon`)"></a>
					<a :href="this.$root.meta.inspectionPdfUrl" target="_blank" class="inspection-icon" @click="$root.logEvent(`Opened Inspection Summary PDF`)"></a>
				</div>
			</div>
		</div>

		<div class="signature-component" v-if="open">
			<div class="service-total white-background">
				<div class="summary-table">
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell">
							{{ langTerms.estimated_taxes_and_fees[$root.meta.local.toLowerCase()] }}:
						</div>
						<div class="summary-table-cell">
							<span class="price">${{ tax.toFixed(2) }}</span>
						</div>
					</div>
				</div>
				<div class="summary-table">
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell grand-total">
							{{ langTerms.estimate_total[$root.meta.local.toLowerCase()] }}
						</div>
						<div class="summary-table-cell">
							<span class="price">${{ (tax + this.$root.totals.inspectionTotal.total + this.$root.totals.serviceTotal.total).toFixed(2) }}</span>
						</div>
					</div>
				</div>
			</div>

			<div @click="drawSignature()" class="click-sign">
				<div>
					{{ langTerms.click_sign[$root.meta.local.toLowerCase()] }}
				</div>
			</div>

			<div class="sign-below">
				{{ langTerms.please_sign_below[$root.meta.local.toLowerCase()] }}
			</div>

			<signature-pad @signatureUpdate="signatureStatusChanged"></signature-pad>

			<div>
				<div class="terms-warning"><p>** {{ langTerms.you_need_to_acknowledge[$root.meta.local.toLowerCase()] }} <a @click.prevent="toggleTerms(true)">{{ langTerms.terms_and_conditions[$root.meta.local.toLowerCase()] }}</a> {{ langTerms.before_you_can_approve[$root.meta.local.toLowerCase()] }}</p></div>
				<div class="css-checkbox">
					<input type="checkbox" id="terms-and-conditions" v-model="termsAndConditions">
					<label for="terms-and-conditions">
						<span class="check"></span>
						<span class="box"></span>
						{{ langTerms.i_agree_to[$root.meta.local.toLowerCase()] }} <a @click.prevent="toggleTerms(true)">{{ langTerms.terms_and_conditions[$root.meta.local.toLowerCase()] }}</a>
					</label>
				</div>
			</div>
			<div class="modal-buttons">
				<div @click="openThanks()" class="approve-btn" :class="{'disabled': !termsAndConditions || !signatureSigned}">
					{{ langTerms.approve[$root.meta.local.toLowerCase()] }}
				</div>
				<div @click="returnToInspection()" class="not-today-btn">
					{{ langTerms.cancel[$root.meta.local.toLowerCase()] }}
				</div>
			</div>
		</div>
		<div class="terms-and-conditions" v-if="showTerms">
			<span class="close-btn" @click="toggleTerms(false)"></span>
			<div class="terms-header">
				<h2>{{ langTerms.terms_header_1[$root.meta.local.toLowerCase()] }}</h2>
			</div>
			<div class="terms-body">
				<h3>{{ langTerms.terms_header_2[$root.meta.local.toLowerCase()] }}</h3>
				<p>{{ langTerms.terms_body_1[$root.meta.local.toLowerCase()] }}</p>
			</div>
			<div class="terms-body">
				<h3>{{ langTerms.terms_header_3[$root.meta.local.toLowerCase()] }}</h3>
				<p>{{ langTerms.terms_body_2[$root.meta.local.toLowerCase()] }}</p>
			</div>
			<div class="terms-close">
				<div class="terms-close-btn" @click="toggleTerms(false)">{{ langTerms.close[$root.meta.local.toLowerCase()] }}</div>
			</div>
		</div>
		<info-popup v-if="modalOpen" :viewingService="viewingService" @closeModal="closeServiceModal" @approve="approveService" @defer="deferService"></info-popup>
		<defer-modal v-if="deferModal" @deferReason="deferServiceReason"></defer-modal>
		<error-message v-if="showErrorMessage" @closeErrorModal="closeErrorModal()"></error-message>
	</div>
</template>

<script>
import $ from 'jquery'
import ENV from '../environment'
import ErrorMessage from './ErrorMessage'
import DeferModal from './DeferModal'
import InfoPopup from './InfoPopup'
import SignaturePad from './SignaturePad'

let allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export default {
	data () {
		return {
			signaturePad: null,
			accordion: false,
			open: false,
			termsAndConditions: false,
			signatureSigned: false,
			showTerms: false,
			modalOpen: false,
			viewingService: {},
			timeExpired: false,
			signaturePadData: '',
			tax: 0,
			showErrorMessage: false,
			deferModal: false,
			activeDeferralService: {},
			langTerms: {
				service_summary: {
					'en-ca': 'Service Summary',
					'en-us': 'Service Summary',
					'fr-ca': 'Récapitulatif de l\'entretien'
				},
				newly_approved_services: {
					'en-ca': 'Newly Approved Services',
					'en-us': 'Newly Approved Services',
					'fr-ca': 'Services approuvés'
				},
				items_you_approved: {
					'en-ca': 'Items you approved after the inspection',
					'en-us': 'Items you approved after the inspection',
					'fr-ca': 'Articles que vous avez approuvés après l\'inspection'
				},
				free: {
					'en-ca': 'Free',
					'en-us': 'Free',
					'fr-ca': 'Gratuit'
				},
				subtotal: {
					'en-ca': 'Subtotal',
					'en-us': 'Subtotal',
					'fr-ca': 'Sous-total'
				},
				previously_approved_services: {
					'en-ca': 'Previously Approved Services',
					'en-us': 'Previously Approved Services',
					'fr-ca': 'Services précédemment approuvés'
				},
				items_you_approved_when_you_checked: {
					'en-ca': 'Items you approved when you checked into the dealership',
					'en-us': 'Items you approved when you checked into the dealership',
					'fr-ca': 'Articles que vous avez approuvés lorsque vous vous êtes enregistrés(es) chez le concessionnaire'
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
				your_service_advisor_will: {
					'en-ca': 'Your service advisor will contact you when your services are completed',
					'en-us': 'Your service advisor will contact you when your services are completed',
					'fr-ca': 'Votre conseiller au service vous contactera lorsque les services seront complétés.'
				},
				estimated_taxes_and_fees: {
					'en-ca': 'Estimated Taxes & Fees (Newly Approved Services)',
					'en-us': 'Estimated Taxes & Fees (Newly Approved Services)',
					'fr-ca': 'Taxes et frais estimatifs (Services approuvés)'
				},
				estimate_total: {
					'en-ca': 'Estimate Total',
					'en-us': 'Estimate Total',
					'fr-ca': 'Coût estimatif'
				},
				continue: {
					'en-ca': 'Continue',
					'en-us': 'Continue',
					'fr-ca': 'Suivant'
				},
				accept_estimate: {
					'en-ca': 'Accept Estimate',
					'en-us': 'Accept Estimate',
					'fr-ca': 'Accepter le Devis'
				},
				click_sign: {
					'en-ca': 'Click to sign',
					'en-us': 'Click to sign',
					'fr-ca': 'Cliquez pour signer'
				},
				please_sign_below: {
					'en-ca': 'Please sign below',
					'en-us': 'Please sign below',
					'fr-ca': 'Signez ici'
				},
				you_need_to_acknowledge: {
					'en-ca': 'You need to acknowledge the Dealership\'s',
					'en-us': 'You need to acknowledge the Dealership\'s',
					'fr-ca': 'Vous devez accepter les '
				},
				terms_and_conditions: {
					'en-ca': 'terms and conditions',
					'en-us': 'terms and conditions',
					'fr-ca': 'conditions générales du concessionnaire'
				},
				before_you_can_approve: {
					'en-ca': 'before you can approve these additional services.',
					'en-us': 'before you can approve these additional services.',
					'fr-ca': 'avant de pouvoir approuver ces services supplémentaires'
				},
				i_agree_to: {
					'en-ca': 'I agree to the Dealership\'s',
					'en-us': 'I agree to the Dealership\'s',
					'fr-ca': 'J\'accepte les'
				},
				approve: {
					'en-ca': 'Approve',
					'en-us': 'Approve',
					'fr-ca': 'Approuver'
				},
				cancel: {
					'en-ca': 'Cancel',
					'en-us': 'Cancel',
					'fr-ca': 'Annuler'
				},
				close: {
					'en-ca': 'CLOSE',
					'en-us': 'CLOSE',
					'fr-ca': 'FERMER'
				},
				terms_header_1: {
					'en-ca': 'Terms and Conditions',
					'en-us': 'Terms and Conditions',
					'fr-ca': 'Conditions Générales du Concessionnaire'
				},
				terms_header_2: {
					'en-ca': 'Exclusion of warranties',
					'en-us': 'Exclusion of warranties',
					'fr-ca': 'EXCLUSION DES GARANTIES'
				},
				terms_header_3: {
					'en-ca': 'Authorization for repairs',
					'en-us': 'Authorization for repairs',
					'fr-ca': 'AUTORISATION DES RÉPARATIONS'
				},
				terms_body_1: {
					'en-ca': 'All warranties on the parts and accessories sold hereby are made by the manufacturer. The undersigned purchaser understand and agrees that dealer makes no warranties of any kind, express or implied, and disclaims all warranties, including warranties of merchantability or fitness for a particular purpose; and that in no event shall dealer be liable for incidental or consequential damages or commercial losses arising out of such purchase. The undersighed purchaser further agrees that the warranties excluded by the dealer, include, but are not limited to any warranties that such parts and/or accessories are of merchantable quality or that they will enable any vehicle or any of its systems to perform with reasonable safety, efficiency, or comfort.',
					'en-us': 'All warranties on the parts and accessories sold hereby are made by the manufacturer. The undersigned purchaser understand and agrees that dealer makes no warranties of any kind, express or implied, and disclaims all warranties, including warranties of merchantability or fitness for a particular purpose; and that in no event shall dealer be liable for incidental or consequential damages or commercial losses arising out of such purchase. The undersighed purchaser further agrees that the warranties excluded by the dealer, include, but are not limited to any warranties that such parts and/or accessories are of merchantable quality or that they will enable any vehicle or any of its systems to perform with reasonable safety, efficiency, or comfort.',
					'fr-ca': 'Toutes les garanties sur les pièces et accessoires vendus par la présente sont faites par le constructeur. L’acheteur soussigné comprend et accepte que la concession ne fait aucune garantie d’aucune sorte, explicite ou implicite, et se dégage de toute responsabilité quant à toute garantie, y compris la garantie de qualité marchande ou la garantie de capacité du produit à accomplir un but précis; et que la concession ne saurait, en aucun cas, être tenue pour responsable de tout dommage accessoire ou immatériel, ou de toute perte commerciale résultant de cet achat. L’acheteur soussigné accepte également que les garanties exclues par la concession incluent, sans s’y limiter, toute garantie que lesdites pièces et/ou lesdits accessoires auront une quelconque qualité marchande ou qu’ils permettront à un quelconque véhicule ou système de fonctionner avec une sécurité, une efficacité ou un confort raisonnable.'
				},
				terms_body_2: {
					'en-ca': 'I hereby authorize the repair work herein set forth to be done along with the necessary material and agree that you are not responsible for loss or damage to vehicle or articles left in vehicle in case of fire, theft, or any cause beyond your control or for any delays caused by unavailability of parts or delays in parts shipments by the supplier or transporter. I hereby grant you and/or your employees permission to operate the behicle herein described on streets, highways, or elsewhere for the purpose of testing and/or inspection. An express mechanical lien is hereby acknowledged on above vehicle to secure the amount of repairs thereto. The dealership is not responsible for damages from freezing due to lack of antifreeze.',
					'en-us': 'I hereby authorize the repair work herein set forth to be done along with the necessary material and agree that you are not responsible for loss or damage to vehicle or articles left in vehicle in case of fire, theft, or any cause beyond your control or for any delays caused by unavailability of parts or delays in parts shipments by the supplier or transporter. I hereby grant you and/or your employees permission to operate the behicle herein described on streets, highways, or elsewhere for the purpose of testing and/or inspection. An express mechanical lien is hereby acknowledged on above vehicle to secure the amount of repairs thereto. The dealership is not responsible for damages from freezing due to lack of antifreeze.',
					'fr-ca': 'J’autorise, par la présente, la réalisation du travail de réparation décrit par la présente et l’utilisation de tout matériel nécessaire. J’accepte également que la concession n’assume aucune responsabilité pour la perte ou les dommages causés au véhicule ou aux articles laissés dans le véhicule en cas d’incendie, de vol ou de toute autre raison en dehors du contrôle de la concession, et que la concession ne saurait être tenue pour responsable des retards causés par l’indisponibilité des pièces ou les retards d’expédition des pièces par le fournisseur ou le transporteur. Je donne, par la présente, l’autorisation à la concession et/ou à ses employés de conduire le véhicule décrit dans la présente sur les routes, les autoroutes et ailleurs, dans le but de réaliser des tests et/ou une inspection. La présente reconnaît expressément un droit de rétention mécanique pour le véhicule ci-dessus, dans le but de réaliser la quantité des réparations décrites. La concession ne saurait être tenue comme responsable des dommages causés par le gel résultant d’une quantité insuffisante d’antigel.'
				}
			}
		}
	},
	watch: {
		termsAndConditions (oldValue, newValue) {
			newValue ? this.$root.logEvent('Checked Terms and Conditions checkbox') : this.$root.logEvent('Unchecked Terms and Conditions checkbox')
		}
	},
	created () {
		if (this.$root.meta.expired) {
			this.$router.push('/')
		}
		this.$root.serviceCategories.forEach(category => {
			if (category.id === '4') {
				this.accordion = category.defaultExpended
			}
		})

		$('html, body').scrollTop(0)

		let dateConst = new Date()
		let responseDate = new Date(this.$root.meta.responseBy)
		this.timeExpired = responseDate < dateConst
		this.tax = this.$root.totals.serviceTotal.tax

		this.getTaxTotals()

		this.$root.logPageDuration('services')
	},
	destroyed () {
		this.$root.logPageDuration('services')
	},
	computed: {
		/**
		 * To check whether there are services in categories 1 or 2
		 * @function
		 * @returns {boolean} - True if categories 1 and 2 are empty, false otherwise
		 */
		noActionRequired () {
			return this.$root.inspectionCounts.failCount === 0 && this.$root.inspectionCounts.warningCount === 0
		},
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

			if (hour === 12) {
				meridian = 'PM'
			} else if (hour > 12) {
				meridian = 'PM'
				hour -= 12
			} else if (hour === 0) {
				hour = 12
			}

			if (minutes === 0) {
				minutes = '00'
			} else if (minutes < 10) {
				minutes = '0' + minutes
			}

			formattedTime = hour + ':' + minutes + ' ' + meridian
			if (!this.checkSameDate(this.$root.meta.responseBy)) {
				formattedTime += ` on ${allMonths[fullDate.getMonth()]} ${fullDate.getDate()}, ${fullDate.getFullYear()}`
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

			if (hour === 12) {
				meridian = 'PM'
			} else if (hour > 12) {
				meridian = 'PM'
				hour -= 12
			} else if (hour === 0) {
				hour = 12
			}

			if (minutes === 0) {
				minutes = '00'
			} else if (minutes < 10) {
				minutes = '0' + minutes
			}

			formattedTime = hour + ':' + minutes + ' ' + meridian
			if (!this.checkSameDate(this.$root.meta.promise)) {
				formattedTime += ` on ${allMonths[fullDate.getMonth()]} ${fullDate.getDate()}, ${fullDate.getFullYear()}`
			}
			return formattedTime
		}
	},
	methods: {
		/**
		 * To toggle the accordion open and close
		 * @function
		 * @returns {undefined}
		 */
		toggleAccordion () {
			this.accordion ? this.$root.logEvent(`Collapsed Previously Approved Services accordion`) : this.$root.logEvent(`Expanded Previously Approved Services accordion`)
			this.accordion = !this.accordion
		},
		/**
		 * To open and close the signature pad
		 * @param {boolean} val - Whether it is open or closed
		 * @function
		 * @returns {undefined}
		 */
		openSignature (val) {
			this.$root.logEvent(`Clicked Accept Estimate`)
			this.open = val
		},
		/**
		 * To return to the inspection page
		 * @function
		 * @returns {undefined}
		 */
		returnToInspection () {
			this.$root.logEvent(`Declined estimate`)
			this.$router.push({name: 'inspection'})
		},
		/**
		 * To redirect to the thanks route
		 * @function
		 * @returns {undefined}
		 */
		openThanks () {
			this.$root.logEvent(`Accepted estimate`)
			let _this = this
			let confirmedServices = []
			this.$root.services.forEach(service => {
				if (service.category !== '4' && service.category !== '3') {
					if (service.subServices) {
						service.subServices.forEach(subService => {
							if (subService.isSelected) {
								subService.isApproved = true
								subService.reasonId = null
								confirmedServices.push(subService)
							} else {
								subService.isApproved = false
								confirmedServices.push(subService)
							}
						})
					} else {
						if (service.isSelected) {
							service.isApproved = true
							service.reasonId = null
							confirmedServices.push(service)
						} else {
							service.isApproved = false
							confirmedServices.push(service)
						}
					}
				}
			})

			if (this.termsAndConditions && this.signatureSigned) {
				$.ajax({
					url: ENV.production_url + '/services/' + _this.$root.token,
					method: 'POST',
					data: {
						confirmedServices,
						customerSignature: _this.signaturePadData
					},
					beforeSend (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer ' + _this.$root.accessToken)
					}
				}).done((response, textStatus, xhr) => {
					if (xhr.status === 202) {
						this.$router.push({name: 'thanks'})
					} else {
						this.showErrorMessage = true
					}
				}).fail(reason => {
					console.log(reason)
				})
			}
		},
		/**
		 * To redirect to the thanks route without approving services
		 * @function
		 * @returns {undefined}
		 */
		openThanksWithoutSignature () {
			this.$root.logEvent(`Accepted estimate`)
			this.$router.push({name: 'thanks'})
		},
		/**
		 * To auto-draw the signature
		 * @function
		 * @returns {undefined}
		 */
		drawSignature () {
			// let _this = this
			// $.ajax({
			// 	url: ENV.production_url + '/customer/' + _this.$root.token,
			// 	method: 'GET',
			// 	dataType: 'xml',
			// 	beforeSend (xhr) {
			// 		xhr.setRequestHeader('Authorization', 'Bearer ' + _this.$root.accessToken)
			// 	}
			// }).done((response, textStatus, xhr) => {
			// 	console.log('hello')
			// }).fail(reason => {
			// 	console.log(reason)
			// })

			var name = 'Gary Kalk'
			let canvas = document.querySelector('canvas')
			var ctx = canvas.getContext('2d')
			ctx.font = '30px Arial'
			ctx.fillText(name, 80, 90)
		},
		/**
		 * To check if the signature pad has been signed and set the proper variable
		 * @function
		 * @param {boolean} val - The current value of isEmpty() on the signature pad
		 * @returns {undefined}
		 */
		signatureStatusChanged (val) {
			if (val.isEmpty && this.$root.$data.userActivity.eventTracker[this.$root.$data.userActivity.eventTracker.length - 1].event !== `Signed`) {
				this.$root.logEvent(`Signed`)
			} else if (this.$root.$data.userActivity.eventTracker[this.$root.$data.userActivity.eventTracker.length - 1].event !== `Cleared signature`) {
				this.$root.logEvent(`Cleared signature`)
			}
			this.signatureSigned = !val.isEmpty
			this.signaturePadData = val.data
		},
		/**
		 * To toggle visibility of the terms and conditions overlay
		 * @function
		 * @param {boolean} val - Whether to show or hide the terms and conditions overlay
		 * @returns {undefined}
		 */
		toggleTerms (val) {
			val ? this.$root.logEvent(`Displayed Terms and Conditions`) : this.$root.logEvent(`Closed Terms and Conditions`)
			this.showTerms = val
		},
		/**
		 * To open the detailed view modal
		 * @function
		 * @param {object} service - The service to be viewed in detail
		 * @returns {undefined}
		 */
		openServiceModal (service) {
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
		 * To close the detailed view modal since the service is already approved
		  * @function
		  * @returns {undefined}
		  */
		approveService () {
			// No need to do anything because the service is already approved
			this.closeServiceModal()
		},
		/**
		 * To remove the service from approved services
		  * @function
		  * @returns {undefined}
		  */
		deferService () {
			this.viewingService.isSelected = false
			this.$root.totals.inspectionTotal.total -= parseFloat(this.viewingService.price)
			this.getTaxTotals()
			this.openDeferReasonModal(this.viewingService)
			this.closeServiceModal()
		},
		/**
		 * To add the deferral reason to the service
		 * @param {object} reason - The reason for deferral
		 * @function
		 * @returns {undefined}
		 */
		deferServiceReason (reason) {
			this.deferModal = false

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
		},
		/**
		 * To open the defer modal and set the active service as the one being deferred
		 * @param {object} service - The service being deferred
		 * @function
		 * @returns {undefined}
		 */
		openDeferReasonModal (service) {
			this.deferModal = true
			this.activeDeferralService = Object.assign({}, service)
		},
		/**
		 * To get the tax totals for the backend
		 * @function
		 * @returns {undefined}
		 */
		getTaxTotals () {
			let _this = this
			let approvedServices = []
			this.$root.services.forEach(service => {
				if (service.category !== '3' && service.category !== '4') {
					if (service.subServices) {
						service.subServices.forEach(subService => {
							if (subService.isSelected) {
								approvedServices.push(subService.id)
							}
						})
					} else {
						if (service.isSelected) {
							approvedServices.push(service.id)
						}
					}
				}
			})

			$.ajax({
				url: ENV.production_url + '/tax/' + _this.$root.token,
				method: 'POST',
				data: '{ selectedServices: ' + JSON.stringify(approvedServices) + '}',
				beforeSend (xhr) {
					xhr.setRequestHeader('Content-Type', 'application/json')
					xhr.setRequestHeader('Authorization', 'Bearer ' + _this.$root.accessToken)
				}
			}).done((response, textStatus, xhr) => {
				if (xhr.status === 202) {
					_this.$root.totals.serviceTotal.tax = response.taxAndFee
					_this.tax = response.taxAndFee
				} else {
					this.showErrorMessage = true
				}
			}).fail(reason => {
				console.log(reason)
			})
		},
		/**
		 * To check if the service has subServices and if it does, to check if at least one of them is selected
		 * @function
		 * @param {object} service - The service to be tested
		 * @returns {boolean} - Whether the service passes or fails the test
		 */
		checkSubServices (service) {
			let isSelected = false
			if (service.subServices) {
				service.subServices.forEach(subService => {
					if (subService.isSelected) {
						isSelected = true
					}
				})
			}
			return isSelected
		},
		/**
		 * To close the error modal
		 * @function
		 * @returns {undefined}
		 */
		closeErrorModal () {
			this.showErrorMessage = false
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
		}
	},
	components: {
		DeferModal,
		ErrorMessage,
		InfoPopup,
		SignaturePad
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
	margin-bottom:235px;
}
.terms-warning {
	font-size: 11px;
    font-weight: bold;
    margin: 10px auto 0;
    width: 350px;
}
.terms-warning a {
	color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
}
</style>
