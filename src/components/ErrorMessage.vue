<template>
	<div class="modal">
		<div class="modal-window">
			<div @click="closeModal()" class="modal-close"></div>
			<div class="clear"></div>
			<div class="modal-content">
				<div class="modal-header">
					{{ langTerms.error[$root.meta.local] }}
				</div>
				<div class="modal-message">
					{{ langTerms.error_occurred[$root.meta.local] }}
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
					en: 'An error has occurred.',
					fr: 'An error has occurred.'
				},
				error: {
					en: 'Error',
					fr: 'Error'
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
