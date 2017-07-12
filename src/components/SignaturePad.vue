<template>
	<div class="signature noselect">
		<canvas width="320" height="120"></canvas>
	</div>
</template>

<script>
import SignaturePad from 'signature_pad'

export default {
	name: 'signature-pad',
	data () {
		return {
			signaturePad: false
		}
	},
	mounted () {
		let canvas = document.querySelector('canvas')
		this.signaturePad = new SignaturePad(canvas)
	},
	methods: {
		/**
		 * To clear the signature pad
		 * @function
		 * @returns {undefined}
		 */
		clearSignature () {
			this.signaturePad.clear()
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
