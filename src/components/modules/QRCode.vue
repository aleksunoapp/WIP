<template>
  <div class="qr-code-container">
    <div class="qr-image-container">
      <a
        title="Click to download the QR code"
        alt="Click to download the QR code"
        @click="downloadAsImage()"
      >
        <img
          ref="imageTag"
          class="qr-image"
          crossOrigin="Anonymous"
        >
      </a>
    </div>
    <div>
      <button
        type="button"
        class="btn btn-circle btn-icon-only btn-default clickable"
        @click="downloadAsImage()"
      >
        <i
          class="fa fa-download"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script>
import qrCodeWithLogo from 'qr-code-with-logo'

export default {
	props: {
		// content to encode; string, required
		content: {
			type: String,
			default: () => '',
			required: true
		},

		// hex color value
		color: {
			type: String,
			default: () => '#000000',
			required: false
		},

		// hex color value
		backgroundColor: {
			type: String,
			default: () => '#ffffff',
			required: false
		},

		// name of downloaded file
		downloadName: {
			type: String,
			required: false,
			default: () => 'UNOcode.png'
		},

		// path to file containing image to place in center; string
		image: {
			type: String,
			default: () => '',
			required: false
		},

		// number of pixels (I think) to use as value of CSS width; positive float
		width: {
			type: Number,
			default: () => 1000,
			required: false
		},

		// value of id attribute of HTML canvas element; string, required
		id: {
			type: String,
			default: () => 'canvasVue',
			required: true
		}
	},
	mounted () {
		const options = {
			image: this.$refs.imageTag,
			download: false,
			content: this.content,
			width: this.width,
			logo: {
				src: this.image ? this.image : undefined
			},
			nodeQrCodeOptions: {
				color: {
					dark: this.color,
					light: this.backgroundColor
				}
			}
		}

		qrCodeWithLogo.toImage(options)
	},
	methods: {
		downloadAsImage () {
			const options = {
				image: this.$refs.imageTag,
				download: true,
				downloadName: this.downloadName,
				content: this.content,
				width: this.width,
				logo: {
					src: this.image ? this.image : undefined
				},
				nodeQrCodeOptions: {
					color: {
						dark: this.color,
						light: this.backgroundColor
					}
				}
			}

			qrCodeWithLogo.toImage(options)
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
