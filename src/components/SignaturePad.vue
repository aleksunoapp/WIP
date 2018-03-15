<template>
	<v-touch @pan="checkSignature()">
		<div class="signature noselect">
			<span class="signature-clear" @click="clearSignature()">{{ langTerms.clear[$root.meta.local.toLowerCase()] }}</span>
		</div>
	</v-touch>
</template>

<script>
import $ from 'jquery'
import SignaturePad from 'signature_pad'

export default {
	name: 'signature-pad',
	data () {
		return {
			signaturePad: false,
			langTerms: {
				clear: {
					'en-ca': 'CLEAR',
					'en-us': 'CLEAR',
					'fr-ca': 'EFFACER'
				}
			}
		}
	},
	mounted () {
		let canvasWidth
		let windowWidth = $(window).width()
		if (windowWidth >= 414) {
			canvasWidth = 372
		} else {
			canvasWidth = windowWidth * 0.9
		}

		$('.signature').css({'width': canvasWidth + 'px'})
		$('.signature').append('<canvas width="' + canvasWidth + '" height="120" style="z-index: 3; cursor: pointer;"></canvas>')

		this.mountCanvas()
	},
	methods: {
		/**
		 * To mount the signature pad to the canvas after render (this is done to solve responsive issues)
		 * @function
		 * @returns {undefined}
		 */
		mountCanvas () {
			let canvas = document.querySelector('canvas')
			this.signaturePad = new SignaturePad(canvas)
		},
		/**
		 * To clear the signature pad
		 * @function
		 * @returns {undefined}
		 */
		clearSignature () {
			this.signaturePad.clear()
			this.$emit('signatureUpdate', {isEmpty: this.signaturePad.isEmpty()})
		},
		/**
		 * To check if the signature pad has been signed and send the data to it's parent
		 * @function
		 * @returns {undefined}
		 */
		checkSignature () {
			this.$emit('signatureUpdate', {isEmpty: this.signaturePad.isEmpty(), data: this.signaturePad.toDataURL()})
		}
	},
	/**
	 * Run before `destroy` in order to clear the signature pad
	 * @function
	 * @returns {undefined}
	 */
	beforeDestroy () {
		this.clearSignature()
	}
}
</script>
