<template>
	<div class="modal">
		<div class="modal-window">
			<div @click="closeModal()" class="modal-close"></div>
			<div class="clear"></div>
			<div class="modal-content">
				<div class="modal-header">
					Error
				</div>
				<div class="modal-message">
					An error has occurred.
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'error-message',
	methods: {
		closeModal () {
			this.$emit('closeErrorModal')
		}
	}
}
</script>
