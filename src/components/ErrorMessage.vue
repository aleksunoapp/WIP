<template>
	<div class="modal">
		<div class="modal-window">
			<div @click="closeModal()" class="modal-close"></div>
			<div class="clear"></div>
			<div class="modal-content">
				<div class="modal-header">
					{{ langTerms.error[$root.meta.local.toLowerCase()] }}
				</div>
				<div class="modal-message">
					{{ langTerms.error_occurred[$root.meta.local.toLowerCase()] }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'error-message',
	data () {
		return {
			langTerms: {
				error_occurred: {
					'en-ca': 'An error has occurred.',
					'en-us': 'An error has occurred.',
					'fr-ca': 'An error has occurred.',
					'es-mx': 'Se ha producido un error.'
				},
				error: {
					'en-ca': 'Error',
					'en-us': 'Error',
					'fr-ca': 'Error',
					'es-mx': 'Error'
				}
			}
		}
	},
	methods: {
		closeModal () {
			this.$emit('closeErrorModal')
		}
	}
}
</script>
