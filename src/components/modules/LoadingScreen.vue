<template>
	<div 
		v-show="show"
		class="loading-spinner">
		<img 
			:src="spinner" 
			class="spinner"
			alt="UNOapp logo, two half-circle arrows pointing in the same direction laid on a circle, spinning">
	</div>
</template>

<script>
import spinner from '@/assets/img/loading.gif'

export default {
	props: {
		show: {
			type: Boolean,
			required: false,
			default: () => true
		}
	},
	data () {
		return {
			spinner: spinner
		}
	}
}
</script>

<style scoped>
.loading-spinner {
	width: 100%;
	display: flex;
	justify-content: center;
}
.spinner {
	width: 50px;
	height: 50px;
	max-width: 100%;
	max-height: 100%;
}
</style>
