<template>
	<div class="loading-spinner" :style="{'color': this.color}" :class="{'no-z-index': this.display === 'inline'}">
		<img 
			:src="spinner" 
			class="spinner"
			alt="UNOapp logo, two half-circle arrows pointing in the same direction laid on a circle, spinning">
	</div>
</template>

<script>
/**
 * Loading Screen module is used to produce a full screen loading overlay as well as an inline loading animation.
 * @class LoadingScreen
 * @prop {boolean} appBackground - Used to determine whether or not to display as a full page loading screen
 * @prop {string} color - Used to determine the color of the loading animation (default: `white`)
 * @prop {boolean} show - Used to determine whether the loading screen should be shown or not
 * @prop {boolean} autoStop - Used to determine if the loading animation should stop and disappear on it's own
 * @prop {string} display - Used to determine if the loading animation should be displayed inline or full screen
 * @since 0.0.2
 */

import $ from 'jquery'
import spinner from '@/assets/img/loading.gif'

export default {
	props: {
		appBackground: {
			default: false
		},
		color: {
			default: 'white'
		},
		show: {
			default: false
		},
		autoStop: {
			default: false
		},
		display: {
			default: null
		}
	},
	data () {
		return {
			spinner,
			timeout: '',
			activeSpinner: false
		}
	},
	/**
	 * Methods for loading screen.
	 * To use: Set up a boolean variable `my_variable`
	 *		   To show the loading screen call LoadingScreen.methods.startLoading(my_variable)
	 *		   If `my_variable` is set to true, the loading screen will be hidden after 2 seconds automatically
	 *		   If `my_variable` is set to false, when the backend call is a success call LoadingScreen.methods.stopLoading()
	 *		   When the backend call is an error call LoadingScreen.methods.removeLoadingScreen()
	 */
	methods: {
		/**
		 * To show the loading screen.
		 * @function
		 * @returns {undefined}
		 * @memberof LoadingScreen
	 	 * @version 0.0.4
		 */
		startLoading () {
			if (this.timeout) {
				clearTimeout(this.timeout)
			}

			const $el = $(this.$el)
			$el.show()

			if (this.appBackground) {
				$('body').prepend('<div class="app-bg"></div>')
			}
			if (this.autoStop) {
				this.stopLoading()
			}

			this.activeSpinner = true
		},
		/**
		 * To hide the loading screen after 2 seconds.
		 * @function
		 * @returns {undefined}
		 * @memberof LoadingScreen
	 	 * @version 0.0.4
		 */
		stopLoading () {
			const $el = $(this.$el)

			this.timeout = setTimeout(() => {
				$el.fadeOut(500)
				if (this.appBackground) {
					$('.app-bg').fadeOut(1000)
				}
				this.activeSpinner = false
				this.emitStop()
			}, 2000)
		},
		/**
		 * To remove the loading screen immediately.
		 * @function
		 * @returns {undefined}
		 * @memberof LoadingScreen
	 	 * @version 0.0.4
		 */
		removeLoadingScreen () {
			if (this.timeout) {
				clearTimeout(this.timeout)
			}
			if (this.appBackground) {
				$('.app-bg').remove()
			}

			const $el = $(this.$el)
			$el.hide()

			this.activeSpinner = false
			this.emitStop()
		},
		emitStop () {
			this.$emit('stopLoadingScreen')
		}
	},
	watch: {
		/**
		 * To watch the value of show to determine the loading screen should be started or stopped.
		 * @function
		 * @param {boolean} val - The current value of this.show
		 * @returns {undefined}
		 * @memberof LoadingScreen
	 	 * @version 0.0.4
		 */
		show (val) {
			if (val) {
				this.startLoading()
			} else if (this.activeSpinner) {
				this.removeLoadingScreen()
			}
		}
	}
}
</script>

<style scoped>
.loading-spinner {
	display: none;
	position: absolute;
    top: 50%;
    left: 50%;
    font-size: 400%;
    z-index: 10000;
    transform: translate(-50%, -50%);
}
.loading-spinner.no-z-index {
	z-index: 0;
}
.spinner {
	width: 50px;
	height: 50px;
	max-width: 100%;
	max-height: 100%;
}
</style>
