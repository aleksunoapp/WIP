<template>
  <canvas 
    :id="this.id"
    :ref="this.id"
  >
  </canvas>
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

		// download trigger, download starts on true
		download: {
			type: Boolean,
			required: false,
			default: () => false
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
			default: () => 100,
			required: false
		},

		// value of id attribute of HTML canvas element; string, required
		id: {
			type: String,
			default: () => 'canvasVue',
			required: true
		}
	},
	data () {
		return {
			start: true
		}
	},
	inject: ['downloadTrigger', 'width'],
	mounted () {
		const options = {
			canvas: this.$refs[this.id],
			content: this.content,
			width: this.width,
			logo: this.image ? {src: this.image} : undefined
		}

		qrCodeWithLogo.toCanvas(options)
	},
	updated () {
		console.log('updated canvas')
	},
	methods: {
    // Download function, linked to a download button <a href="#">
    // IMPORTANT: Call it from within a onclick event.

    // https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    // https://jsfiddle.net/AbdiasSoftware/7PRNN/
		downloadCanvas (link, canvasId, filename) {
			link.href = document.getElementById(canvasId).toDataURL()
			link.download = filename

			this.$emit('downloadCanvas', {link, canvasId, filename})
		}
	}
}
</script>
