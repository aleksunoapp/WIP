<template>
  <label
    :class="[isButton?'btn btn-'+typeColor:'open checkbox '+typeColor,{active:checked,disabled:disabled,readonly:readonly}]"
    @click.prevent="toggle"
  >
    <input
      ref="input"
      type="checkbox"
      autocomplete="off"
      :checked="active"
      :value="value"
      :name="name"
      :readonly="readonly"
      :disabled="disabled"
    >
    <span
      v-if="!isButton"
      class="icon dropdown-toggle"
      :class="[active?'btn-'+typeColor:'',{bg:typeColor==='default'}]"
    />
    <span
      v-if="!isButton&active&&typeColor==='default'"
      class="icon"
    />
    <slot />
  </label>
</template>

<script>
import $ from 'jquery'
export default {
  props: {
    value: {
      default: true
    },
    checked: {
      type: Boolean,
      default: false
    },
    button: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: null
    }
  },
  computed: {
    active () {
      return typeof this.value !== 'boolean' && this.group
        ? ~this.$parent.value.indexOf(this.value)
        : this.checked === this.value
    },
    isButton () {
      return this.button || (this.group && this.$parent.buttons)
    },
    group () {
      return this.$parent && this.$parent._checkboxGroup
    },
    typeColor () {
      return this.type || (this.$parent && this.$parent.type) || 'default'
    }
  },
  watch: {
    checked (val) {
      if (typeof this.value !== 'boolean' && this.group) {
        if (this.checked && !~this.$parent.value.indexOf(this.value)) {
          this.$parent.value.push(this.value)
        }
        if (!this.checked && ~this.$parent.value.indexOf(this.value)) {
          this.$parent.value.$remove(this.value)
        }
      }
    }
  },
  created () {
    if (typeof this.value === 'boolean') {
      return
    }
    const parent = this.$parent
    if (parent && parent._btnGroup && !parent._radioGroup) {
      parent._checkboxGroup = true
      if (!(parent.value instanceof Array)) {
        parent.value = []
      }
    }
  },
  mounted () {
    if (!this.$parent._checkboxGroup || typeof this.value === 'boolean') {
      return
    }
    if (this.$parent.value.length) {
      this.checked = ~this.$parent.value.indexOf(this.value)
    } else if (this.checked) {
      this.$parent.value.push(this.value)
    }
  },
  methods: {
    eval () {
      if (typeof this.value !== 'boolean' && this.group) {
        this.checked = ~this.$parent.value.indexOf(this.value)
      }
    },
    focus () {
      $(this.$refs.input).focus()
    },
    toggle () {
      if (!this.disabled) {
        this.focus()
        if (!this.readonly) {
          this.checked = this.checked ? null : this.value
          if (this.group && typeof this.value !== 'boolean') {
            const index = this.$parent.value.indexOf(this.value)
            if (index >= 0) {
              this.$parent.value.splice(index, 1)
            } else if (index < 0) {
              this.$parent.value.push(this.value)
            }
          }
        }
      }
      return false
    }
  }
}
</script>

<style scoped>
label.checkbox {
  position: relative;
  padding-left: 18px;
}
label.checkbox > input {
  box-sizing: border-box;
  position: absolute;
  z-index: -1;
  padding: 0;
  opacity: 0;
  margin: 0;
}
label.checkbox > .icon {
  position: absolute;
  top: 0.2rem;
  left: 0;
  display: block;
  width: 1.4rem;
  height: 1.4rem;
  line-height: 1rem;
  text-align: center;
  user-select: none;
  border-radius: 0.35rem;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
}
label.checkbox:not(.active) > .icon {
  background-color: #ddd;
  border: 1px solid #bbb;
}
label.checkbox > input:focus ~ .icon {
  outline: 0;
  border: 1px solid #66afe9;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}
label.checkbox.active > .icon {
  background-size: 1rem 1rem;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNyIgaGVpZ2h0PSI3Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJtNS43MywwLjUybC0zLjEyNDIyLDMuMzQxNjFsLTEuMzM4OTUsLTEuNDMyMTJsLTEuMjQ5NjksMS4zMzY2NWwyLjU4ODYzLDIuNzY4NzZsNC4zNzM5LC00LjY3ODI2bC0xLjI0OTY5LC0xLjMzNjY1bDAsMGwwLjAwMDAyLDAuMDAwMDF6Ii8+PC9zdmc+);
}
label.checkbox.active .btn-default {
  filter: brightness(75%);
}
label.checkbox.disabled,
label.checkbox.readonly,
.btn.readonly {
  filter: alpha(opacity=65);
  box-shadow: none;
  opacity: 0.65;
}
label.btn > input[type="checkbox"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
}
</style>
