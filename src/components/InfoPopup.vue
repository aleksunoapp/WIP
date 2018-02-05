<template>
	<div class="modal">
		<div class="modal-window">
			<div @click="closeModal()" class="modal-close"></div>
			<div class="clear"></div>
			<div class="modal-content info-modal">
				<div class="info-modal-image" :style="`background-image: url('${viewingService.imageUrl}');`"></div>
				<div>
					<div class="info-modal-info-top">
						<div class="green-bg">
							<p>{{ langTerms.recommendation[$root.meta.local.toLowerCase()] }}</p>
							<h2>{{ viewingService.name }}</h2>
						</div>
						<p>{{ viewingService.comment }}</p>
					</div>
					<div class="info-modal-info-bottom">
						<div class="info-modal-contact">
							<a :href="this.$root.meta.inspectionPdfUrl" target="_blank" class="inspection-summary-link" @click="$root.logEvent(`Opened Inspection Summary PDF`)">
								{{ langTerms.inspection_summary[$root.meta.local.toLowerCase()] }}
							</a>
							<a v-if="$root.mobile" :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon"></a>
							<a v-if="$root.mobile" :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon"></a>
						</div>
						<div class="info-modal-estimate">{{ langTerms.estimated_cost[$root.meta.local.toLowerCase()] }} <span>${{ (viewingService.price).toFixed(2) }}</span></div>
					</div>
				</div>
				<div class="modal-buttons">
					<div @click="approveService()" class="approve-btn">
						{{ langTerms.approve[$root.meta.local.toLowerCase()] }}
					</div>
					<div @click="deferService()" class="not-today-btn">
						{{ langTerms.not_today[$root.meta.local.toLowerCase()] }}
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
				not_today: {
					'en-ca': 'Not Today',
					'en-us': 'Not Today',
					'fr-ca': 'Not Today'
				},
				recommendation: {
					'en-ca': 'Recommendation',
					'en-us': 'Recommendation',
					'fr-ca': 'Recommendation'
				},
				inspection_summary: {
					'en-ca': 'Inspection Summary',
					'en-us': 'Inspection Summary',
					'fr-ca': 'Récapitulatif de l\'inspection'
				},
				estimated_cost: {
					'en-ca': 'Estimated cost of this item',
					'en-us': 'Estimated cost of this item',
					'fr-ca': 'Estimated cost of this item'
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
		}
	}
}
</script>
