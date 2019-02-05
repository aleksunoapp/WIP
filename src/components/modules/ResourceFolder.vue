<template>
  <li
    class="jstree-node"
    :class="{'jstree-last': last, 'jstree-open': folder.expanded, 'jstree-closed': !folder.expanded}"
  >
    <i
      class="jstree-icon jstree-ocl"
      @click="expandNode()"
    />
    <a
      class="jstree-anchor"
      :class="{'jstree-clicked': folder.id === activeFolder}"
      @click="getResources(1, folder)"
    >
      <div class="folder-name-container">
        <div class="folder-name">
          {{ folder.name }}
        </div>
        <i
          v-if="!activeLocationId && !selectOnly"
          class="fa"
          :class="{'fa-eye': folder.is_shared, 'fa-eye-slash': !folder.is_shared}"
        />
        <i
          v-if="!selectOnly"
          class="fa fa-pencil"
          @click.stop="manageFolder()"
        />
      </div>
    </a>
    <ul
      v-if="folder.expanded"
      class="jstree-children"
    >
      <li
        v-if="!selectOnly && $root.permissions['gallery create']"
        class="jstree-node jstree-leaf"
        :class="{'jstree-last': !folder.children || !folder.children.length}"
      >
        <i class="jstree-icon jstree-ocl" />
        <a
          class="jstree-anchor"
          @click="createFolder()"
        >
          <button class="btn blue btn-outline btn-xs">
            Create Folder
          </button>
        </a>
      </li>
      <template v-for="(subfolder, subindex) in folder.children">
        <resource-folder
          :key="subindex"
          :folder="subfolder"
          :active-folder="activeFolder"
          :last="subindex === folder.children.length - 1"
          :select-only="selectOnly"
          @expandNode="expandNode"
          @createFolder="createFolder"
          @manageFolder="manageFolder"
          @getResources="getResources"
        />
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
  name: 'ResourceFolder',
  props: {
    folder: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
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
  data () {
    return {
      activeLocationId: null
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
<style scoped>
.jstree-anchor {
	width: calc(100% - 30px);
}
.folder-name-container {
	display: flex;
}
.folder-name {
	display: inline-block;
	width: calc(100% - 35px);
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.folder-name:hover {
	overflow: auto;
	white-space: normal;
	text-overflow: initial;
	background-color: #ddd;
	z-index: 2;
}
</style>
