<template>
	<div class="file-upload">
		<form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
			<div class="file-input-container" :class="{'uploading': isSaving}">
				<input id="file-input" class="file-input" type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length">
				<label for="file-input"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> <span>Choose a file&hellip;</span></label>
				<p class="file-upload-loader" v-if="isSaving">
					<loading-screen :show="true" :color="'#3598dc'" :display="'inline'" :position="'left'" :size="'small'"></loading-screen>
					Uploading {{ fileCount }} file{{ fileCount > 1 ? 's' : '' }}...
				</p>
			</div>
		</form>
	</div>
</template>
<script>
/**
 * FileUpload module is used to upload files to resource folders.
 * @class FileUpload
 * @extends Resources
 * @prop {integer} folderId - The folder where the file is being uploaded.
 * @since 0.0.9
 */

import LoadingScreen from './LoadingScreen'
import Resources from '../../controllers/Resources'

const STATUS_INITIAL = 0
const STATUS_SAVING = 1
const STATUS_SUCCESS = 2
const STATUS_FAILED = 3

export default {
	name: 'file-upload',
	props: {
		folderId: {
			default: 0
		}
	},
	data () {
		return {
			uploadedFiles: [],
			uploadError: null,
			currentStatus: null,
			uploadFieldName: 'file',
			activeBusinessId: 30,
			activeLocationId: null
		}
	},
	/**
	 * Run on `created` to run the reset function to initialize data.
	 * @function
	 * @returns {undefined}
	 * @memberof FileUpload
	 * @version 0.0.9
	 */
	created () {
		this.reset()
	},
	computed: {
		isInitial () {
			return this.currentStatus === STATUS_INITIAL
		},
		isSaving () {
			return this.currentStatus === STATUS_SAVING
		},
		isSuccess () {
			return this.currentStatus === STATUS_SUCCESS
		},
		isFailed () {
			return this.currentStatus === STATUS_FAILED
		}
	},
	methods: {
		/**
		 * To reset the initial values of the data
		 * @function
		 * @returns {undefined}
		 * @memberof FileUpload
		 * @version 0.0.9
		 */
		reset () {
			// reset form to initial state
			this.currentStatus = STATUS_INITIAL
			this.uploadedFiles = []
			this.uploadError = null
		},
		/**
		 * Run when the file input changes to format the file for upload.
		 * @function
		 * @param {string} fieldName - The name to be set in the FormData object.
		 * @param {array} fileList - The list of files being uploaded.
		 * @returns {undefined}
		 * @memberof FileUpload
		 * @version 0.0.9
		 */
		filesChange (fieldName, fileList) {
			// handle file changes
			/* eslint-disable no-undef */
			const formData = new FormData()

			if (!fileList.length) return

			// append the files to FormData
			Array
				.from(Array(fileList.length).keys())
				.map(x => {
					formData.append(fieldName, fileList[x], fileList[x].name)
				})

			// save it
			this.upload(formData)
		},
		/**
		 * To make the call to the UNOapp API to upload the file to the selected folder
		 * @function
		 * @param {object} form - The formatted FormData object being sent to the backend.
		 * @returns {undefined}
		 * @memberof FileUpload
		 * @version 0.0.9
		 */
		upload (form) {
			let _this = this
			const businessId = this.activeBusinessId
			const locationId = this.activeLocationId
			this.currentStatus = STATUS_SAVING
			this.$emit('savingUpdate', true)

			return Resources.upload(businessId, locationId, _this.folderId, form).then(response => {
				setTimeout(() => {
					_this.currentStatus = STATUS_INITIAL
					_this.$emit('savingUpdate', false)
					_this.$emit('success', response.payload.file_id)
				}, 200)
			}).catch(_this.$root.errorWrapper(e => {
				setTimeout(() => {
					_this.currentStatus = STATUS_INITIAL
					_this.$emit('savingUpdate', false)
				}, 200)
			}))
		}
	},
	components: {
		LoadingScreen
	}
}
</script>
<style>
.file-upload {
	display: inline-block;
}
.file-input-container {
	width: 180px;
}
.file-input-container.uploading {
	width: 325px;
}
.file-input-container .file-input {
	width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}
.file-input-container label {
	max-width: 80%;
    font-size: 1.25rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    padding: 0.625rem 1.25rem;
    color: #fff;
    background-color: #3598dc;
}
.file-input-container .file-input:focus + label {
    outline: 1px dotted #000;
    outline: -webkit-focus-ring-color auto 5px;
}
.file-input:focus + label,
.file-input + label:hover {
    background-color: #217ebd;
}
.file-input + label svg {
	width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    margin-top: -0.25em;
    margin-right: 0.25em;
}
.file-upload-loader {
	display: inline-block;
    margin: 6px 15px;
    padding-left: 15px;
    vertical-align: top;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
    position: relative;
}

</style>
