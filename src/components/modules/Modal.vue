<template>
  <div
    role="dialog"
    class="modal"
    :class="{'fade': effect === 'fade' || effect === 'custom', 'zoom': effect === 'zoom', 'custom': effect === 'custom'}"
  >
    <div
      class="modal-dialog"
      role="document"
      :style="{width: computedWidth}"
    >
      <div class="modal-content">
        <slot name="modal-header">
          <div class="modal-header">
            <button
              type="button"
              class="close"
              @click="close"
            >
              <span>&times;</span>
            </button>
            <h4 class="modal-title center">
              <slot name="title">
                {{ title }}
              </slot>
            </h4>
          </div>
        </slot>
        <slot name="modal-body">
          <div class="modal-body" />
        </slot>
        <slot name="modal-footer">
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-default"
              @click="close"
            >
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="callback()"
            >
              {{ okText }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

/**
 * Fancy function for getting the width of the scroll bar for use in window width calculations
 * @function
 * @returns {interget} - A number that represents the width of the scroll bar
 */
var getScrollBarWidth = function () {
  if (
    document.documentElement.scrollHeight <=
		document.documentElement.clientHeight
  ) {
    return 0
  }
  let inner = document.createElement('p')
  inner.style.width = '100%'
  inner.style.height = '200px'

  let outer = document.createElement('div')
  outer.style.position = 'absolute'
  outer.style.top = '0px'
  outer.style.left = '0px'
  outer.style.visibility = 'hidden'
  outer.style.width = '200px'
  outer.style.height = '150px'
  outer.style.overflow = 'hidden'
  outer.appendChild(inner)

  document.body.appendChild(outer)
  let w1 = inner.offsetWidth
  outer.style.overflow = 'scroll'
  let w2 = inner.offsetWidth
  if (w1 === w2) w2 = outer.clientWidth

  document.body.removeChild(outer)

  return w1 - w2
}

export default {
  name: 'Modal',
  props: {
    backdrop: {
      default: false
    },
    cancelText: {
      default: 'Close'
    },
    effect: {
      default: 'fade'
    },
    okText: {
      default: 'Save'
    },
    show: {
      required: true,
      twoWay: true
    },
    title: {
      default: ''
    },
    width: {
      default: null
    }
  },
  computed: {
    /**
		 * Compute width to display as pixels vs just a straight integer
		 * @function
		 * @returns {string} - A string combination of number and pixels
		 */
    computedWidth: function () {
      if (this.width === null) {
        return null
      } else if (Number.isInteger(this.width)) {
        return this.width + 'px'
      }
      return this.width
    }
  },
  watch: {
    /**
		 * Watch `show` to determine whether or not to show the modal
		 * @function
		 * @param {boolean} val - Used to determine whether the modal should show or not
		 * @returns {undefined}
		 */
    show: function (val) {
      var modalVue = this
      const el = this.$el
      const body = document.body
      const scrollBarWidth = getScrollBarWidth()
      if (val) {
        $(el)
          .find('.modal-content')
          .focus()
        el.style.display = 'block'
        setTimeout(() => $(el).addClass('in'), 0)
        $(body).addClass('modal-open-noscroll')
        if (scrollBarWidth !== 0) {
          body.style.paddingRight = scrollBarWidth + 'px'
        }
        if (this.backdrop) {
          $(el).on('click', e => {
            if (e.target === el) this.show = false
          })
        }
        $(document).keyup(function (e) {
          if (e.keyCode === 27) {
            modalVue.$emit('closeOnEscape')
          }
        })
      } else {
        body.style.paddingRight = null
        $(body).removeClass('modal-open-noscroll')
        $(el)
          .removeClass('in')
          .on('transitionend', () => {
            $(el).off('click transitionend')
            el.style.display = 'none'
          })
      }
    }
  },
  beforeDestroy () {
    $(document.body).removeClass('modal-open-noscroll')
  },
  methods: {
    /**
		 * Used to close the modal
		 * @function
		 * @returns {undefined}
		 */
    close: function () {
      this.show = false
    },
    /**
		 * Used to perform a callback when an action is selected on the modal
		 * @function
		 * @returns {undefined}
		 */
    callback: function () {
      this.$emit('callback')
    }
  }
}
</script>
<style>
.modal {
  transition: all 0.3s ease;
}
.modal.in {
  background-color: rgba(0, 0, 0, 0.5);
}
.custom.in {
  background-color: #292e33;
}
</style>
