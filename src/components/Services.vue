<template>
	<div class="wrapper">
		<div class="wrapper">
			<div class="summary-header">
				Service Summary
			</div>
			<div class="service-header">
				<div class="large">
					Newly Approved Service
				</div>
				<div class="small">
					Items you approved after the inspection
				</div>
			</div>
			<div class="summary-table">
				<template v-for="service in $root.services">
					<template v-for="sub in service.subServices">
						<template v-if="sub.isSelected">
							<div class="summary-table-row summary-item">
								<div class="summary-table-cell">
									<span class="information-icon"></span> {{ sub.name }}
								</div>
								<div class="summary-table-cell">
									<span class="price"> ${{ sub.price }} </span>
								</div>
							</div>
						</template>
					</template>
				</template>
				<div class="summary-table-row service-subtotal">
					<div class="summary-table-cell">
						Subtotal:
					</div>
					<div class="summary-table-cell">
						<span class="price"> ${{ (this.$root.total).toFixed(2) }} </span>
					</div>
				</div>
			</div>

			<div :class="{'accordian-open': this.accordian, 'accordian-closed': !this.accordian}" class="service-accordian">
				<div @click="toggleAccordian()" class="service-accordian-header service-header">
					<div class="service-accordian-status"></div>
					<div class="large">
						Previously approved services
					</div>
					<div class="small">
						When you checked your vehicle in
					</div>
				</div>
				<div class="accordian-contents">
					<div class="summary-table">
						<template v-for="service in $root.services">
							<template v-if="service.category === 3">
								<template v-for="sub in service.subServices">
									<div class="summary-table-row summary-item">
										<div class="summary-table-cell">
											<span class="information-icon"></span> {{ sub.name }}
										</div>
										<div class="summary-table-cell"></div>
									</div>
								</template>
							</template>
						</template>
					</div>
				</div>
			</div>

			<div class="accept-estimate-component" v-if="!open">
				<div class="service-total">
					<div class="summary-table">
						<div class="summary-table-row service-subtotal">
							<div class="summary-table-cell">
								Est. Taxes &amp; Fees:
							</div>
							<div class="summary-table-cell">
								<span class="price">${{ (this.$root.total * 0.13).toFixed(2) }}</span>
							</div>
						</div>
					</div>
					<div class="summary-table">
						<div class="summary-table-row service-subtotal">
							<div class="summary-table-cell grand-total">
								Estimated Total
							</div>
							<div class="summary-table-cell">
								<span class="price">${{ (this.$root.total * 1.13).toFixed(2) }}</span>
							</div>
						</div>
					</div>
					<div class="time-notice">
						If approved by 2:00PM your vehicle will be ready for pickup by 4:00PM.
					</div>
				</div>
				<div @click="openSignature(true)" class="proceed-btn">
					Accept Estimate
				</div>
				<div class="footer-bar">
					<div class="footer-bar">
						<a href="tel:14166288553" class="contact-icon"></a>
						<a href="sms:14166288553" class="chat-icon"></a>
						<a :href="this.$root.fullInspectionLink" target="_blank" class="inspection-summary-link">
							Inspection Summary
						</a>
					</div>
				</div>
			</div>

			<div class="signature-component" v-if="open">
				<div class="service-total white-background">
					<div class="summary-table">
						<div class="summary-table-row service-subtotal">
							<div class="summary-table-cell">
								Est. Taxes &amp; Fees:
							</div>
							<div class="summary-table-cell">
								<span class="price">${{ (this.$root.total * 0.13).toFixed(2) }}</span>
							</div>
						</div>
					</div>
					<div class="summary-table">
						<div class="summary-table-row service-subtotal">
							<div class="summary-table-cell grand-total">
								Estimated Total
							</div>
							<div class="summary-table-cell">
								<span class="price">${{ (this.$root.total * 1.13).toFixed(2) }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="sign-below">
					Please sign below that you agree with this estimate
				</div>
				<signature-pad></signature-pad>
				<div class="modal-buttons">
					<div @click="openThanks()" class="approve-btn">
						Approve
					</div>
					<div @click="openSignature(false)" class="not-today-btn">
						Cancel
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SignaturePad from './SignaturePad'

export default {
	data () {
		return {
			signaturePad: null,
			accordian: false,
			open: false
		}
	},
	created () {
		if (localStorage.getItem('verificationCode') === null) {
			this.$router.push({name: 'code'})
			return
		}
	},
	methods: {
		/**
		 * To toggle the accordian open and close
		 * @function
		 * @returns {undefined}
		 */
		toggleAccordian () {
			this.accordian = !this.accordian
		},
		/**
		 * To open and close the signature pad
		 * @param {boolean} val - Whether it is open or closed
		 * @function
		 * @returns {undefined}
		 */
		openSignature (val) {
			this.open = val
		},
		/**
		 * To redirect to the thanks route
		 * @function
		 * @returns {undefined}
		 */
		openThanks () {
			this.$router.push({name: 'thanks'})
		}
	},
	components: {
		SignaturePad
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
	margin-bottom:235px;
}
</style>
