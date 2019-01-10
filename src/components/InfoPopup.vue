<script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>
<template>
	<div class="modal">
		<div class="modal-window">
			<div class="clear"></div>
			<div class="modal-content info-modal">
				<div @click="closeModal()" class="modal-close"></div>
				<div v-if="imageUrl" class="info-modal-image" :style="`background-image: url('${imageUrl}');`"></div>
				<div>
					<div class="info-modal-info-top">
						<div 
							:class="{
								'green-bg' : 
									viewingService.category !== '6' &&
									viewingService.category !== '7' &&
									viewingService.category !== '8' &&
									viewingService.category !== '9',
								'grey-bg' : 
									viewingService.category === '6' ||
									viewingService.category === '7' ||
									viewingService.category === '8' ||
									viewingService.category === '9'
							}">
							<p v-if="
								viewingService.category !== '6' &&
								viewingService.category !== '7' &&
								viewingService.category !== '8' &&
								viewingService.category !== '9'
							">
								{{ langTerms.recommendation[$root.meta.local.toLowerCase()] }}</p>
							<p v-if="
								viewingService.category === '6' || 
								viewingService.category === '7' ||
								viewingService.category === '8' ||
								viewingService.category === '9'
							">{{ $root.meta.customerConcernsLabel }}</p>
							<h2>{{ viewingService.name }}</h2>
						</div>
					</div>
					<template v-if="
						viewingService.category !== '6' && 
						viewingService.category !== '7' &&
						viewingService.category !== '8' &&
						viewingService.category !== '9'
					">
						<div class="info-modal-concerns">
							<p class="customer-comments">{{ viewingService.serviceAdvisorComments }}</p>
						</div>
					</template>
					<template v-if="(
							viewingService.category === '6' ||
							viewingService.category === '7' ||
							viewingService.category === '8' ||
							viewingService.category === '9'
						)"
					>
						<div class="info-modal-concerns">
							<p class="customer-comments-label" v-if="viewingService.comment">
								{{ $root.meta.customerCommentsLabel }}
							</p>
							<p class="customer-comments" v-if="viewingService.comment">
								{{viewingService.comment}}
							</p>
							<template v-if="viewingSubServiceIndex !== undefined">
								<p class="advisor-comments-label" 
									v-if="viewingService.subServices[viewingSubServiceIndex].serviceAdvisorComments">
									{{ langTerms.advisor_comments[$root.meta.local.toLowerCase()] }}
								</p>
								<p class="advisor-comments" v-if="viewingService.subServices[viewingSubServiceIndex].serviceAdvisorComments">
									{{viewingService.subServices[viewingSubServiceIndex].serviceAdvisorComments}}
								</p>
							</template>
							<template v-else>
								<p class="advisor-comments-label" 
									v-if="viewingService.serviceAdvisorComments">
									{{ langTerms.advisor_comments[$root.meta.local.toLowerCase()] }}
								</p>
								<p class="advisor-comments" v-if="viewingService.serviceAdvisorComments">
									{{viewingService.serviceAdvisorComments}}
								</p>
							</template>
						</div>
					</template>
					<div class="info-modal-info-bottom">
						<div class="info-modal-contact">
							<a @click.stop="openFullInspection()" class="inspection-summary-link">
								{{ langTerms.inspection_summary[$root.meta.local.toLowerCase()] }}
							</a>
						</div>
						<div class="info-modal-estimate">
							<template v-if="viewingSubServiceIndex === undefined">
								<span v-if="viewingService.price === 0 && viewingService.laborMatrixPayment">{{ translateWarranty(viewingService.laborMatrixPayment) }}</span>
								<template v-else>
									{{ langTerms.estimated_cost[$root.meta.local.toLowerCase()] }} <span>{{ formatCurrency(viewingService.price) }}</span>
								</template>
							</template>
							<template v-else>
								<span v-if="viewingService.subServices[viewingSubServiceIndex].price === 0 && viewingService.subServices[viewingSubServiceIndex].laborMatrixPayment">{{ translateWarranty(viewingService.subServices[viewingSubServiceIndex].laborMatrixPayment) }}</span>
								<template v-else>
									{{ langTerms.estimated_cost[$root.meta.local.toLowerCase()] }} <span>{{ formatCurrency(viewingService.subServices[viewingSubServiceIndex].price) }}</span>
								</template>

							</template>
						</div>
					</div>
				</div>
				<div class="modal-buttons">
					<div @click="approveService()" class="approve-btn">
						{{ langTerms.approve[$root.meta.local.toLowerCase()] }}
					</div>
					<div @click="toggleMoreInfo()" class="more-info-btn">
						{{ langTerms.more_info[$root.meta.local.toLowerCase()] }}
					</div>
					<div @click="deferService()" class="not-today-btn">
						{{ langTerms.not_today[$root.meta.local.toLowerCase()] }}
					</div>
					<div class="more-info-popup">
						<a v-if="$root.mobile" :href="`tel:${$root.meta.dealerContactInfo.phone}`"><div class="info-popup-btn">
							<i class="fas fa-phone"
							data-fa-transform="flip-h"></i>
							{{ langTerms.more_info_call[$root.meta.local.toLowerCase()] }}
						</div></a>
						<a v-if="$root.mobile" :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`"><div class="info-popup-btn">
							<i class="fas fa-comment"
							data-fa-transform="flip-h"></i>
							{{ langTerms.more_info_text[$root.meta.local.toLowerCase()] }}
						</div></a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'info-popup',
	data () {
		return {
			langTerms: {
				approve: {
					'en-ca': 'Approve',
					'en-us': 'Approve',
					'fr-ca': 'Approuver',
					'es-mx': 'Aprobar'
				},
				more_info: {
					'en-ca': 'I need more information',
					'en-us': 'I need more information',
					'fr-ca': 'J’ai besoin de précisions',
					'es-mx': 'Necesito más información'
				},
				more_info_call: {
					'en-ca': 'Call Dealership',
					'en-us': 'Call Dealership',
					'fr-ca': 'Appeler la concession',
					'es-mx': 'Llamar al concesionario'
				},
				more_info_text: {
					'en-ca': 'Text Dealership',
					'en-us': 'Text Dealership',
					'fr-ca': 'Envoyer un texto à la concession',
					'es-mx': 'Enviar mensaje de texto al concesionario'
				},
				not_today: {
					'en-ca': 'Not today',
					'en-us': 'Not today',
					'fr-ca': 'Pas aujourd’hui',
					'es-mx': 'Hoy no'
				},
				recommendation: {
					'en-ca': 'Recommendation',
					'en-us': 'Recommendation',
					'fr-ca': 'Recommandation',
					'es-mx': 'Recomendación'
				},
				customer_concern: {
					'en-ca': 'Customer Concern',
					'en-us': 'Customer Concern',
					'fr-ca': 'Préoccupations du client',
					'es-mx': 'Preocupación del cliente'
				},
				inspection_summary: {
					'en-ca': 'Inspection Summary',
					'en-us': 'Inspection Summary',
					'fr-ca': 'Récapitulatif de l\'inspection',
					'es-mx': 'Resumen de inspección'
				},
				estimated_cost: {
					'en-ca': 'Estimated cost of this item',
					'en-us': 'Estimated cost of this item',
					'fr-ca': 'Coût estimé de cet article',
					'es-mx': 'Costo estimado de este ítem'
				},
				advisor_comments: {
					'en-ca': 'Advisor comments',
					'en-us': 'Advisor comments',
					'fr-ca': 'Commentaires du conseiller',
					'es-mx': 'Comentarios del asesor'
				},

				free: {
					'en-ca': 'Please note this service is free - you will NOT be charged for it',
					'en-us': 'Please note this service is free - you will NOT be charged for it',
					'fr-ca': 'Please note this service is free - you will NOT be charged for it',
					'es-mx': 'Tenga en cuenta que este servicio es gratuito, NO se le cobrará por él'
				},
				covered_by_warranty: {
					'en-ca': 'Please note this service is covered under Warranty - you will NOT be charged for it',
					'en-us': 'Please note this service is covered under Warranty - you will NOT be charged for it',
					'fr-ca': 'Please note this service is covered under Warranty - you will NOT be charged for it',
					'es-mx': 'Tenga en cuenta que este servicio está cubierto por la garantía, NO se le cobrará por él'
				},
				included: {
					'en-ca': 'Please note the price of this service is included - you will NOT be charged for it',
					'en-us': 'Please note the price of this service is included - you will NOT be charged for it',
					'fr-ca': 'Please note the price of this service is included - you will NOT be charged for it',
					'es-mx': 'Tenga en cuenta que el precio de este servicio está incluido, NO se le cobrará por separado'
				},
				covered_by_dealership: {
					'en-ca': 'Please note this service is free - you will NOT be charged for it',
					'en-us': 'Please note this service is free - you will NOT be charged for it',
					'fr-ca': 'Please note this service is free - you will NOT be charged for it',
					'es-mx': 'Tenga en cuenta  que este servicio es gratuito, NO se le cobrará por él'
				}
			}
		}
	},
	computed: {
		imageUrl () {
			if (this.viewingSubServiceIndex !== undefined) {
				return this.viewingService.subServices[this.viewingSubServiceIndex].imageUrl
			} else {
				return this.viewingService.imageUrl
			}
		}
	},
	props: {
		viewingService: {
			default: null
		},
		viewingSubServiceIndex: {
			default: undefined
		}
	},
	methods: {
		/**
		 * To convert warranty price information into an explanation string
		 * @function
		 * @param {string} text - The short warranty description
		 * @returns {String} - String to display
		 */
		translateWarranty (text) {
			if (!text) return ''

			const translations = {
				'en-us': {
					'covered by warranty': 'Please note this service is covered under Warranty - you will NOT be charged for it',
					'included': 'Please note the price of this service is included - you will NOT be charged for it',
					'covered by dealership': 'Please note this service is free - you will NOT be charged for it',
					'free': 'Please note this service is free - you will NOT be charged for it'
				},
				'en-ca': {
					'covered by warranty': 'Please note this service is covered under Warranty - you will NOT be charged for it',
					'included': 'Please note the price of this service is included - you will NOT be charged for it',
					'covered by dealership': 'Please note this service is free - you will NOT be charged for it',
					'free': 'Please note this service is free - you will NOT be charged for it'
				},
				'fr-ca': {
					'couvert par la garantie': 'Veuillez noter que ce service est couvert par la garantie, il ne vous sera PAS facturé',
					'inclus': 'Veuillez noter que ce service est gratuit, il ne vous sera PAS facturé',
					'couvert par la concession': 'Veuillez noter que le prix de ce service est inclus, il ne vous sera PAS facturé',
					'gratuit': 'Veuillez noter que ce service est gratuit, il ne vous sera PAS facturé'
				},
				'es-mx': {
					'cubierto por la garantía': 'Tenga en cuenta que este servicio está cubierto por la garantía, NO se le cobrará por él',
					'incluido': 'Tenga en cuenta que el precio de este servicio está incluido, NO se le cobrará por separado',
					'cubierto por el concesionario': 'Tenga en cuenta que este servicio es gratuito, NO se le cobrará por él',
					'gratis': 'Tenga en cuenta que este servicio es gratuito, NO se le cobrará por él'
				}
			}

			return translations[this.$root.meta.local.toLowerCase()][text.trim().toLowerCase()]
		},
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
		 * To open the full inspection in a separate tab
		 * @function
		 * @returns {undefined}
		 */
		openFullInspection () {
			this.$root.logEvent('Opened Inspection Summary PDF')
			window.open(this.$root.meta.inspectionPdfUrl, '_blank')
		},
		/**
		 * To tell the parent component to close the modal
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$root.logEvent(`Closed ${this.viewingService.name} info window`)
			this.$emit('closeModal')
		},
		/**
		 * To tell the parent component to approve the service
		 * @function
		 * @returns {undefined}
		 */
		approveService () {
			this.$root.logEvent(`Accepted ${this.viewingService.name} service`)
			this.$emit('approve')
		},
		/**
		 * To tell the parent component to defer the service
		 * @function
		 * @returns {undefined}
		 */
		deferService () {
			this.$root.logEvent(`Deferred ${this.viewingService.name} service`)
			this.$emit('defer')
		},
		toggleMoreInfo () {
			var moreInfoPopup = document.getElementsByClassName('more-info-popup')

			moreInfoPopup[0].style.display = moreInfoPopup[0].style.display === 'block' ? '' : 'block'
		}
	}
}
</script>
