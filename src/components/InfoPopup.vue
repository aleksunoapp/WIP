<script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>
<template>
	<div class="modal">
		<div class="modal-window">
			<div @click="closeModal()" class="modal-close"></div>
			<div class="clear"></div>
			<div class="modal-content info-modal">
				<div v-if="imageUrl" class="info-modal-image" :style="`background-image: url('${imageUrl}');`"></div>
				<div>
					<div class="info-modal-info-top">
						<div 
							:class="{
								'green-bg' : 
									viewingService.category !== '6' &&
									viewingService.category !== '7',
								'grey-bg' : 
									viewingService.category === '6' ||
									viewingService.category === '7'
							}">
							<p v-if="
								viewingService.category !== '6' &&
								viewingService.category !== '7'">
								{{ langTerms.recommendation[$root.meta.local.toLowerCase()] }}</p>
							<p v-if="
								viewingService.category === '6' || 
								viewingService.category === '7'
							">{{ $root.meta.customerConcernsLabel }}</p>
							<h2>{{ viewingService.name }}</h2>
						</div>
					</div>
					<template v-if="viewingService.category !== '6' && viewingService.category !== '7'">
						<div class="info-modal-concerns">
							<p>{{ viewingService.comment }}</p>
						</div>
					</template>
					<template v-if="(
							viewingService.category === '6' || 
							viewingService.category === '7'
						)">
						<div class="info-modal-concerns">
							<p class="customer-comments-label" v-if="viewingService.comment">
								{{ $root.meta.customerCommentsLabel }}
							</p>
							<p class="customer-comments" v-if="viewingService.comment">
								{{viewingService.comment}}
							</p>
							<template v-if="viewingSubServiceIndex">
								<p class="advisor-comments-label" 
									v-if="viewingService.subServices[viewingSubServiceIndex].comment">
									{{ langTerms.advisor_comments[$root.meta.local.toLowerCase()] }}
								</p>
								<p class="advisor-comments" v-if="viewingService.subServices[viewingSubServiceIndex].comment">
									{{viewingService.subServices[viewingSubServiceIndex].comment}}
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
						<div class="info-modal-estimate">{{ langTerms.estimated_cost[$root.meta.local.toLowerCase()] }} 
							<span v-if="!viewingSubServiceIndex">{{ formatCurrency(viewingService.price) }}</span>
							<span v-else>{{ formatCurrency(viewingService.subServices[viewingSubServiceIndex].price) }}</span>
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
					'fr-ca': 'Approuver'
				},
				more_info: {
					'en-ca': 'I need more information',
					'en-us': 'I need more information',
					'fr-ca': 'J’ai besoin de précisions'
				},
				more_info_call: {
					'en-ca': 'Call Dealership',
					'en-us': 'Call Dealership',
					'fr-ca': 'Appeler la concession'
				},
				more_info_text: {
					'en-ca': 'Text Dealership',
					'en-us': 'Text Dealership',
					'fr-ca': 'Envoyer un texto à la concession'
				},
				not_today: {
					'en-ca': 'Not today',
					'en-us': 'Not today',
					'fr-ca': 'Pas aujourd’hui'
				},
				recommendation: {
					'en-ca': 'Recommendation',
					'en-us': 'Recommendation',
					'fr-ca': 'Recommandation'
				},
				customer_concern: {
					'en-ca': 'Customer Concern',
					'en-us': 'Customer Concern',
					'fr-ca': 'Préoccupations'
				},
				inspection_summary: {
					'en-ca': 'Inspection Summary',
					'en-us': 'Inspection Summary',
					'fr-ca': 'Récapitulatif de l\'inspection'
				},
				estimated_cost: {
					'en-ca': 'Estimated cost of this item',
					'en-us': 'Estimated cost of this item',
					'fr-ca': 'Coût estimé de cet article'
				},
				advisor_comments: {
					'en-ca': 'Advisor comments',
					'en-us': 'Advisor comments',
					'fr-ca': 'Commentaires du conseiller'
				}
			}
		}
	},
	computed: {
		imageUrl () {
			if (this.viewingSubServiceIndex) {
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
