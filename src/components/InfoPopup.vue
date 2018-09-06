<script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>
<template>
	<div class="modal">
		<div class="modal-window">
			<div @click="closeModal()" class="modal-close"></div>
			<div class="clear"></div>
			<div class="modal-content info-modal">
				<div class="info-modal-image" :style="`background-image: url('${viewingService.imageUrl}');`"></div>
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
							">{{ langTerms.customer_concern[$root.meta.local.toLowerCase()] }}</p>
							<h2>{{ viewingService.name }}</h2>
						</div>
						<p v-if="
							viewingService.category !== '6' &&
							viewingService.category !== '7'
						">{{ viewingService.comment }}</p>
					</div>
					<div class="info-modal-concerns">
						<p for="customer-comments">
							{{ langTerms.customer_comments[$root.meta.local.toLowerCase()] }}
						</p>
						<input id="customer-comments" type="text">
						<p for="advisor-comments">
							{{ langTerms.advisor_comments[$root.meta.local.toLowerCase()] }}
						</p>
						<input id="advisor-comments" type="text">
					</div>
					<div class="info-modal-info-bottom">
						<div class="info-modal-contact">
							<!-- <a :href="this.$root.meta.inspectionPdfUrl" target="_blank" class="inspection-summary-link" @click="$root.logEvent(`Opened Inspection Summary PDF`)">
								{{ langTerms.inspection_summary[$root.meta.local.toLowerCase()] }}
							</a> -->
							<a @click.stop="openFullInspection()" class="inspection-summary-link">
								{{ langTerms.inspection_summary[$root.meta.local.toLowerCase()] }}
							</a>
						</div>
						<div class="info-modal-estimate">{{ langTerms.estimated_cost[$root.meta.local.toLowerCase()] }} <span>{{ formatCurrency(viewingService.price) }}</span></div>
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
					'fr-ca': ''
				},
				customer_comments: {
					'en-ca': 'Customer comments',
					'en-us': 'Customer comments',
					'fr-ca': ''
				},
				advisor_comments: {
					'en-ca': 'Advisor comments',
					'en-us': 'Advisor comments',
					'fr-ca': ''
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
				}
			}
		}
	},
	props: {
		viewingService: {
			default: null
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
