import $ from 'jquery'

var BackgroundRotator = function (elm, images, options) {
	var wrapper, index, currentRatio
	const defaults = {
		centeredX: true,
		centeredY: true,
		duration: 5000,
		fade: 0
	}

	const styles = {
		wrapper: {
			left: 0, top: 0, overflow: 'hidden', margin: 0, padding: 0, height: '100%', width: '100%', zIndex: -999999, position: 'absolute'
		},
		image: {
			position: 'absolute', display: 'none', margin: 0, padding: 0, border: 'none', width: 'auto', height: 'auto', maxHeight: 'none', maxWidth: 'none', zIndex: -999999
		}
	}

	return {
		init: function () {
			if (images === undefined || images.length === 0) {
				return 'No images were passed.'
			}

			if (!elm) {
				// Set the function to render on the body if no element is passed
				elm = $('body')
			}

			elm.css('background-image', 'none')

			options = $.extend({}, defaults, options || {})

			wrapper = $('<div class="background-rotator"></div>').css(styles.wrapper).appendTo(elm)

			index = 0
			this.show(index)

			var localBackgroundRotator = this

			$(window).on('resize', function () {
				localBackgroundRotator.resize()
			})
		},
		show: function (newIndex) {
			if (newIndex > images.length - 1) {
				return
			}
			index = newIndex
			var localBackgroundRotator = this

			var oldImage = wrapper.find('img').addClass('delete_image')

			var img = $('<img/>').css(styles.image).bind('load', function (e) {
				var imgWidth = this.width || $(e.target).width()
				var imgHeight = this.height || $(e.target).height()

				currentRatio = imgWidth / imgHeight

				$(this).fadeIn(options.fade, function () {
					oldImage.remove()

					localBackgroundRotator.cycle()
				})

				localBackgroundRotator.resize()
			}).appendTo(wrapper)

			img.attr('src', images[newIndex])

			return
		},
		cycle: function () {
			if (images.length > 1) {
				clearInterval(this.interval)

				var localBackgroundRotator = this

				this.interval = setInterval(function () {
					localBackgroundRotator.next()
				}, options.duration)
			}
			return
		},
		next: function () {
			this.show(index < images.length - 1 ? index + 1 : 0)
		},
		resize: function () {
			var bgCss = {left: 0, top: 0}
			var rootWidth = elm.innerWidth()
			var bgWidth = rootWidth
			var rootHeight = elm.innerHeight()
			var bgHeight = bgWidth / currentRatio
			var bgOffset

			if (bgHeight >= rootHeight) {
				bgOffset = (bgHeight - rootHeight) / 2
				if (options.centeredY) {
					bgCss.top = '-' + bgOffset + 'px'
				}
			} else {
				bgHeight = rootHeight
				bgWidth = bgHeight * currentRatio
				bgOffset = (bgWidth - rootWidth) / 2
				if (options.centeredX) {
					bgCss.left = '-' + bgOffset + 'px'
				}
			}

			wrapper.css({width: rootWidth, height: rootHeight}).find('img:not(.delete_image)').css({width: bgWidth, height: bgHeight}).css(bgCss)
		}
	}
}

export {BackgroundRotator}
