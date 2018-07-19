<template>
	<li class="jstree-node" :class="{'jstree-last': last, 'jstree-open': folder.expanded, 'jstree-closed': !folder.expanded}">
		<i class="jstree-icon jstree-ocl" @click="expandNode()"></i>
		<a class="jstree-anchor" @click="getResources(1, folder)" :class="{'jstree-clicked': folder.id === activeFolder}">
			{{ folder.name }} 
			<i 
				class="fa" 
				:class="{'fa-eye': folder.is_shared, 'fa-eye-slash': !folder.is_shared}" 
				v-if="!activeLocationId && !selectOnly">
			</i>
			<i class="fa fa-pencil" @click.stop="manageFolder()" v-if="!selectOnly"></i>
		</a>
		<ul class="jstree-children" v-if="folder.expanded">
			<li 
				class="jstree-node jstree-leaf" 
				:class="{'jstree-last': !folder.children || !folder.children.length}" 
				v-if="!selectOnly && $root.permissions['gallery create']">
				<i class="jstree-icon jstree-ocl"></i>
				<a class="jstree-anchor" @click="createFolder()">
					<button class="btn blue btn-outline btn-xs">
						Create Folder
					</button>
				</a>
			</li>
			<template v-for="(subfolder, subindex) in folder.children">
				<resource-folder :folder="subfolder" :activeFolder="activeFolder" :last="subindex === folder.children.length - 1" @expandNode="expandNode" @createFolder="createFolder" @manageFolder="manageFolder" @getResources="getResources" :selectOnly="selectOnly"></resource-folder>
			</template>
		</ul>
	</li>
</template>
<script>
/**
 * Resource Folder module is used to the recursive resource folder structure.
 * @class ResourceFolder
 * @extends Resources
 * @prop {object} folder - Used to pass the folder data to the component
 * @prop {boolean} last - Used to determine if this is the last folder in it's branch
 * @prop {object} activeFolder - Used to pass the id of the active folder to the component
 * @since 0.0.9
 */

export default {
	name: 'resource-folder',
	data () {
		return {
			activeLocationId: null
		}
	},
	props: {
		folder: {
			type: Object,
			required: true,
			default: () => { return {} }
		},
		last: {
			type: Boolean,
			required: true,
			default: false
		},
		activeFolder: {
			type: Number,
			required: false,
			default: 0
		},
		selectOnly: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		/**
		 * To emit that the node has been expanded or collapsed to the parent component until it reaches the top of the hierarchy
		 * @function
		 * @param {object} passedFolder - The folder being passed to the parent for modification
		 * @returns {undefined}
		 * @memberof ResourceFolder
		 * @version 0.0.9
		 */
		expandNode (passedFolder) {
			if (passedFolder) {
				this.$emit('expandNode', passedFolder)
			} else {
				this.$emit('expandNode', this.folder)
			}
		},
		/**
		 * To emit that the user wants to create a new folder to the parent component until it reaches the top of the hierarchy
		 * @function
		 * @param {object} passedFolder - The folder being passed to the parent for modification
		 * @returns {undefined}
		 * @memberof ResourceFolder
		 * @version 0.0.9
		 */
		createFolder (passedFolder) {
			if (passedFolder) {
				this.$emit('createFolder', passedFolder)
			} else {
				this.$emit('createFolder', this.folder)
			}
		},
		/**
		 * To emit that the user wants to manage a folder to the parent component until it reaches the top of the hierarchy
		 * @function
		 * @param {object} passedFolder - The folder being passed to the parent for modification
		 * @returns {undefined}
		 * @memberof ResourceFolder
		 * @version 0.0.9
		 */
		manageFolder (passedFolder) {
			if (passedFolder) {
				this.$emit('manageFolder', passedFolder)
			} else {
				this.$emit('manageFolder', this.folder)
			}
		},
		/**
		 * To emit that the user wants to pull in the resources in the folder to the parent component until it reaches the top of the hierarchy
		 * @function
		 * @param {integer} pageNumber - The page number to be passed to the parent.
		 * @param {object} passedFolder - The folder being passed to the parent for fetching.
		 * @returns {undefined}
		 * @memberof ResourceFolder
		 * @version 0.0.9
		 */
		getResources (pageNumber, passedFolder) {
			if (passedFolder) {
				this.$emit('getResources', pageNumber, passedFolder, true)
			} else {
				this.$emit('getResources', pageNumber, this.folder, true)
			}
		}
	}
}
</script>
