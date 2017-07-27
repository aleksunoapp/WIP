<template>
	<div class="modal">
		<div class="modal-window">
			<div @click="closeModal()" class="modal-close"></div>
			<div class="clear"></div>
			<div class="modal-content info-modal">
				<div class="info-modal-image" :style="`background-image: url('${viewingService.topImageUrl}');`"></div>
				<div>
					<div class="info-modal-info-top">
						<div class="green-bg">
							<p>Recommendation</p>
							<h2>{{ viewingService.name }}</h2>
						</div>
						<p>{{ viewingService.comment }}</p>
					</div>
					<div class="info-modal-info-bottom">
						<div class="info-modal-contact">
							<a :href="this.$root.meta.inspectionPdfUrl" target="_blank" class="inspection-summary-link">
								Inspection Summary
							</a>
							<a :href="`sms:${$root.meta.dealer.smsPhone}`" class="chat-icon"></a>
							<a :href="`tel:${$root.meta.dealer.phone}`" class="contact-icon"></a>
						</div>
						<div class="info-modal-estimate">Estimated cost of this item <span>${{ (viewingService.laborPrice + viewingService.partsPrice).toFixed(2) }}</span></div>
					</div>
				</div>
				<div class="modal-buttons" v-if="viewingService.serviceCategoryId !== '4'">
					<div @click="approveService()" class="approve-btn">
						Approve
					</div>
					<div @click="deferService()" class="not-today-btn">
						Not Today
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'info-popup',
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
			this.$emit('closeModal')
		},
		/**
		 * To tell the parent component to approve the service
		 * @function
		 * @returns {undefined}
		 */
		approveService () {
			this.$emit('approve')
		},
		/**
		 * To tell the parent component to defer the service
		 * @function
		 * @returns {undefined}
		 */
		deferService () {
			this.$emit('defer')
		}
	}
}
</script>
