<template>
	<div class="modal">
		<div class="modal-window">
			<div class="modal-content">
				<div class="modal-header">
					{{ langTerms.select_reason[$root.meta.local.toLowerCase()] }}
				</div>
				<div class="modal-message no-padding-bottom no-padding-top">
					<ul class="modal-list-options">
						<template v-for="reason in $root.meta.declinedReasons">
							<li @click="emitReason(reason)">{{ reason.name }}</li>
						</template>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'defer-modal',
	data () {
		return {
			langTerms: {
				select_reason: {
					'en-ca': 'Select a reason for deferring this service',
					'en-us': 'Select a reason for deferring this service',
					'fr-ca': 'Sélectionnez une raison pour différer ce service'
				}
			}
		}
	},
	props: {},
	methods: {
		/**
		 * To tell the parent component to the defer reason
		 * @function
		 * @param {object} reason - The reason for deferral
		 * @returns {undefined}
		 */
		emitReason (reason) {
			this.$emit('deferReason', reason)
		}
	}
}
</script>
