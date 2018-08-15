<template>
	<div class="row">
		<div class="col-md-12">
			<div class="alert alert-danger" v-show="listErrorMessage" ref="listErrorMessage">
				<button class="close" @click="clearError('listErrorMessage')"></button>
				<span>{{listErrorMessage}}</span>
			</div>
		</div>
	</div>
</template>

<script>
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	listErrorMessage: ''

	ajaxErrorHandler({
		reason,
		errorText: 'We could not delete the modifier',
		errorName: 'errorMessage',
		vue: deleteModifierCategoryVue,
		containerRef: 'modal'
	})

	clearError (name) {
	clearError ('
}
</script>
