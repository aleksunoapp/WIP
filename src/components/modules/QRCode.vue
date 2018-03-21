<template>
	<div class="qr-code-container">
		<div class="qr-image-container">
			<a :href="`data:image/png;base64, ${base64}`" download="QR_code.png" title="Click to download the QR code" alt="Click to download the QR code">
				<img class="qr-image" :src="`data:image/png;base64, ${base64}`" alt="Promotion QR code">
			</a>
		</div>
		<div>
			<a :href="`data:image/png;base64, ${base64}`" download="QR_code.png" title="Download the QR code" alt="Download the QR code">
				<button type="button" class="btn btn-circle btn-icon-only btn-default clickable"><i class="fa fa-download" aria-hidden="true"></i></button>
			</a>
		</div>
	</div>
</template>

<script>
import QRImage from 'qr-image'

export default {
	props: {
		// string to encode
		text: {
			type: String,
			required: true,
			default: () => ''
		}
	},
	data () {
		return {
			base64: null
		}
	},
	mounted () {
		this.generateImage()
	},
	methods: {
		/**
		 * To generate a png QR code.
		 * @function
		 * @returns {array} - A Uint8 buffer array
		 */
		generateImage () {
			let image = QRImage.imageSync(this.text, { type: 'png', size: 30 })
			this.decodeUint8(image)
		},
		/**
		 * To decode the u8int array to base64
		 * @function
		 * @param {array} uint8 - A uint8 array to decode
		 * @returns {undefined}
		 */
		decodeUint8 (uint8) {
			this.base64 = window.btoa(String.fromCharCode.apply(null, uint8))
		}

	}
}
</script>

<style scoped>
.qr-code-container {
	max-width: 100%;
	max-height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.qr-image-container {
	max-width: 100%;
	max-height: 100%;
	height: calc(100% - 35px);
}
.qr-image {
	max-height: 100%;
	max-width: 100%;
}
.download-button-container {
	height: 35px;
}
</style>
