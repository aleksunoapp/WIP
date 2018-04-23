import $ from 'jquery'
import GlobalFunctions from '../global'

/** Required for some IE specific logic however the only IE we will test for is 10. */
var isIE10 = false
/** Create a variable that will hold a list of functions to run on window resize. */
var resizeHandlers = []

/**
 * To check if the session has been set in locolStorage and if it is expired.
 * @function
 * @param {string} size - A string representing the breakpoint you want returned
 * @returns {integer} - The value of the specified breakpoint or 0 if no match is found
 */
var getResponsiveBreakpoint = function (size) {
	var sizes = {
		'xs': 480,
		'sm': 768,
		'md': 992,
		'lg': 1200
	}

	return sizes[size] ? sizes[size] : 0
}

/** Create a variable that will hold the medium screen breakpoint. */
var resBreakpointMd = getResponsiveBreakpoint('md')

/**
 * To initialize the html by adding any necessary classes (currently only being used for IE10).
 * @function
 * @returns {undefined}
 */
var handleInit = function () {
	isIE10 = !!navigator.userAgent.match(/MSIE 10.0/)

	if (isIE10) {
		$('html').addClass('ie10').addClass('ie')
	}
}

/**
 * To run each of the functions that needs to be called on window resize.
 * @function
 * @returns {undefined}
 */
var runResizeHandlers = function () {
	for (var i = 0; i < resizeHandlers.length; i++) {
		var each = resizeHandlers[i]
		each.call()
	}
}

/**
 * To determine if the resive is legit or forced and then runs the necessary resize handlers
 * @function
 * @returns {undefined}
 */
var handleOnResize = function () {
	var windowWidth = $(window).width()
	var windowHeight = $(window).height()
	var resize

	$(window).resize(function () {
		if ($(window).width() !== windowWidth || $(window).height() !== windowHeight) {
			windowWidth = $(window).width()
			windowHeight = $(window).height()
			if (resize) {
				clearTimeout(resize)
			}
			resize = setTimeout(function () {
				runResizeHandlers()
			}, 50)
		}
	})
}

/**
 * To append to the list of resize handlers to run on window resize
 * @function
 * @param {string} func - The name of the function that needs to be run
 * @returns {undefined}
 */
var addResizeHandler = function (func) {
	resizeHandlers.push(func)
}

/**
 * To initialize material design elements
 * @function
 * @returns {undefined}
 */
var handleMaterialDesign = function () {
	// Material design ckeckbox and radio effects
	$('body').on('click', '.md-checkbox > label, .md-radio > label', function () {
		var the = $(this)
		// find the first span which is our circle/bubble
		var el = $(this).children('span:first-child')

		// add the bubble class (we do this so it doesnt show on page load)
		el.addClass('inc')

		// clone it
		var newone = el.clone(true)

		// add the cloned version before our original
		el.before(newone)

		// remove the original so that it is ready to run on next click
		$('.' + el.attr('class') + ':last', the).remove()
	})

	if ($('body').hasClass('page-md')) {
		// Material design click effect
		var element
		var circle
		var d
		var x
		var y

		$('body').on('click', 'a.btn, button.btn, input.btn, label.btn', function (e) {
			element = $(this)

			if (element.find('.md-click-circle').length === 0) {
				element.prepend('<span class="md-click-circle"></span>')
			}

			circle = element.find('.md-click-circle')
			circle.removeClass('md-click-animate')

			if (!circle.height() && !circle.width()) {
				d = Math.max(element.outerWidth(), element.outerHeight())
				circle.css({height: d, width: d})
			}

			x = e.pageX - element.offset().left - circle.width() / 2
			y = e.pageY - element.offset().top - circle.height() / 2

			circle.css({top: y + 'px', left: x + 'px'}).addClass('md-click-animate')

			setTimeout(function () {
				circle.remove()
			}, 1000)
		})
	}

	// Floating labels
	var handleInput = function (el) {
		if (el.val() !== '') {
			el.addClass('edited')
		} else {
			el.removeClass('edited')
		}
	}

	$('body').on('keydown', '.form-md-floating-label .form-control', function (e) {
		handleInput($(this))
	})
	$('body').on('blur', '.form-md-floating-label .form-control', function (e) {
		handleInput($(this))
	})

	$('.form-md-floating-label .form-control').each(function () {
		if ($(this).val().length > 0) {
			$(this).addClass('edited')
		}
	})
}

/**
 * To get the width and height of the viewport
 * @function
 * @returns {object} - The width and height of the viewport
 */
var getViewPort = function () {
	var e = window
	var	a = 'inner'
	if (!('innerWidth' in window)) {
		a = 'client'
		e = document.documentElement || document.body
	}

	return {
		width: e[a + 'Width'],
		height: e[a + 'Height']
	}
}

var handleHeight = function () {
	// Do nothing at this time
}

/**
 * To set the content section to be the full height based on the size of the browser window
 * @function
 * @returns {undefined}
 */
var handle100HeightContent = function () {
	$('.full-height-content').each(function () {
		var target = $(this)
		var height

		height = getViewPort().height - $('.page-header').outerHeight(true) - $('.page-footer').outerHeight(true) - $('.page-title').outerHeight(true) - $('.page-bar').outerHeight(true)

		// NOTE: have not added all logic from Metronic yet
		target.css('min-height', height)
	})
}

/**
 * To set the sidebar and content to be the full height based on the size of the browser window
 * @function
 * @returns {undefined}
 */
var handleSidebarAndContentHeight = function () {
	// NOTE: this will deliver a strange height until I handle the sidebar
	var content = $('.page-content')
	var sidebar = $('.page-sidebar')
	var height

	var headerHeight = $('.page-header').outerHeight()
	var footerHeight = $('.page-footer').outerHeight()

	if (!headerHeight) {
		headerHeight = 0
	}
	if (!footerHeight) {
		footerHeight = 0
	}

	if (getViewPort().width < resBreakpointMd) {
		height = getViewPort().height - headerHeight - footerHeight
	} else {
		height = sidebar.height() + 20
	}

	if ((height + headerHeight + footerHeight) <= getViewPort().height) {
		height = getViewPort().height - headerHeight - footerHeight
	}

	content.css('min-height', height)
}

/**
 * To calculate the height or the fixed sidebar
 * @function
 * @returns {integer} - The height of the sidebar
 */
var calculateFixedSidebarViewportHeight = function () {
	var sidebarHeight = getViewPort().height - $('.page-header').outerHeight(true)

	return sidebarHeight
}

/**
 * To initialize the sidebar
 * @function
 * @returns {undefined}
 */
var handleFixedSidebar = function () {
	var menu = $('.page-sidebar-menu')
	handleSidebarAndContentHeight()

	if (getViewPort().width >= resBreakpointMd && !$('body').hasClass('page-sidebar-menu-not-fixed')) {
		menu.attr('data-height', calculateFixedSidebarViewportHeight())
		// NOTE: need to add slimscroll first
		// destroySlimScroll(menu);
		// initSlimScroll(menu);
		handleSidebarAndContentHeight()
	}
}

/**
 * To handle the sidebar menu toggler on responsive
 * @function
 * @returns {undefined}
 */
var handleResponsiveSidebarToggler = function () {
	$('a.responsive-toggler').on('click', function (e) {
		var sidebar = $('.page-sidebar')

		if (sidebar.hasClass('in')) {
			sidebar.removeClass('in')
		} else {
			sidebar.addClass('in')
		}

		$(window).trigger('resize')
	})
}

/**
 * To handle the sidebar menu toggler
 * @function
 * @returns {undefined}
 */
var handleSidebarToggler = function () {
	// handle sidebar show/hide
	$('body').on('click', '.sidebar-toggler', function (e) {
		var body = $('body')
		var sidebar = $('.page-sidebar')
		var sidebarMenu = $('.page-sidebar-menu')
		$('.sidebar-search', sidebar).removeClass('open')

		if (body.hasClass('page-sidebar-closed')) {
			body.removeClass('page-sidebar-closed')
			sidebarMenu.removeClass('page-sidebar-menu-closed')
		} else {
			body.addClass('page-sidebar-closed')
			sidebarMenu.addClass('page-sidebar-menu-closed')
			if (body.hasClass('page-sidebar-fixed')) {
				sidebarMenu.trigger('mouseleave')
			}
		}

		$(window).trigger('resize')
	})
}

// Handles Bootstrap Tabs.
var handleTabs = function () {
	// fix content height on tab click
	$('body').on('shown.bs.tab', 'a[data-toggle="tab"]', function () {
		handleSidebarAndContentHeight()
	})
}

export default ({
	/**
	 * List of functions to run to initialize the Metronic portion of the app
	 * @function
	 * @returns {undefined}
	 */
	init: function () {
		// IMPORTANT!!!: Do not modify the core handlers call order.

		// Core handlers
		handleInit() // initialize core variables
		handleOnResize() // set and handle responsive

		// UI Component handlers
		handleMaterialDesign() // handle material design
		// handleiCheck() // handles custom icheck radio and checkboxes
		// handleBootstrapSwitch() // handle bootstrap switch plugin
		// handleScrollers() // handles slim scrolling contents
		// handleFancybox() // handle fancy box
		// handleSelect2() // handle custom Select2 dropdowns
		// handlePortletTools() // handles portlet action bar functionality(refresh, configure, toggle, remove)
		// handleAlerts() //handle closabled alerts
		// handleDropdowns() // handle dropdowns
		// handleTabs() // handle tabs
		// handleTooltips() // handle bootstrap tooltips
		// handlePopovers() // handles bootstrap popovers
		// handleAccordions() //handles accordions
		// handleModals() // handle modals
		// handleBootstrapConfirmation() // handle bootstrap confirmations
		// handleTextareaAutosize() // handle autosize textareas
		// handleCounterup() // handle counterup instances

		// Handle group element heights
		addResizeHandler(handleHeight) // handle auto calculating height on window resize
	},
	/**
	 * List of functions to run to initialize the app structure
	 * @function
	 * @returns {undefined}
	 */
	initApp: function () {
		this.initHeader()
		this.initSidebar(null)
		this.initContent()
	},
	initHeader: function () {
		// This function currently doesn't require any content (will be needed when we start using the location sidebar)
	},
	/**
	 * List of functions to run to initialize the side navigation bar
	 * @function
	 * @returns {undefined}
	 */
	initSidebar: function () {
		handleFixedSidebar() // handles fixed sidebar menu
		handleSidebarToggler() // handles sidebar hide/show
		handleResponsiveSidebarToggler() // handles sidebar hide/show on responsive

		// addResizeHandler(handleFixedSidebar); // reinitialize fixed sidebar on window resize
	},
	/**
	 * List of functions to run to initialize the app content
	 * @function
	 * @returns {undefined}
	 */
	initContent: function () {
		handle100HeightContent() // handles 100% height elements(block, portlet, etc)
		handleTabs() // handle bootstrap tabs
		handleSidebarAndContentHeight()

		addResizeHandler(handleSidebarAndContentHeight) // recalculate sidebar & content height on window resize
		addResizeHandler(handle100HeightContent) // reinitialize content height on window resize
	},
	/**
	 * Call to pitapit API to log a user out.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The userToken of the current user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	logOut: function (appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/application/admin/logout',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to API to get the list of locations from V3.
	 * @function
	 * @param {string} accountToken - The V3 accountToken.
	 * @param {string} paginationPreferences - The paginationPreferences object containing pagination preferences.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getV3StoreLocations: function (accountToken, paginationPreferences) {
		return new Promise(function (resolve, reject) {
			let options = {
				method: 'POST',
				dataType: 'json',
				url: GlobalFunctions.v3BaseUrl + '/location/search',
				data: JSON.stringify(paginationPreferences),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('token', accountToken)
					let csrfToken = ('' + Math.random()).replace('0.', '')
					if (document.cookie !== '' && document.cookie.indexOf('csrf_token=') !== -1) {
						csrfToken = document.cookie.split('csrf_token=')[1]
					} else {
						if (process.env.NODE_ENV === 'development') {
							document.cookie = 'csrf_token=' + csrfToken
						} else {
							document.cookie = 'csrf_token=' + csrfToken + '; domain=.unoapp.io;'
						}
					}
					xhr.setRequestHeader('X-CSRF-Token', csrfToken)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			}

			$.ajax(options)
		})
	},
	/**
	 * Call to pitapit API to get the list of locations for a business.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The userToken of the current user.
	 * @param {string} paginationPreferences - The paginationPreferences object containing pagination preferences.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getPaginatedStoreLocations: function (appId, appSecret, userToken, paginationPreferences = {}) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/locations/all',
				data: paginationPreferences,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get the list of locations for a business.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getStoreLocations: function (appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/locations/search',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to API to check if the token is still valid.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The userToken of the current user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	validateToken: function (appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/application/admin/validateToken',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get a list of locations using the google API based off the input.
	 * @function
	 * @param {string} input - The input text that the user typed in.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getGoogleLocationSearchResults: function (input, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/locations/googlelocation/' + input,
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get the details of a location using the google API based off the place id.
	 * @function
	 * @param {string} placeId - The place id returned by the google API for a particular location.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getGoogleLocationDetails: function (placeId, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/locations/googlelocationdetail/' + placeId,
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * To check if the location exists in ecomm
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The userToken of the current user.
	 * @param {string} accountToken - The accountToken of the current user.
	 * @param {string} locationId - ID of the location to check
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	checkV3Location: function (appId, appSecret, userToken, accountToken, locationId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/locations/selectLocation',
				data: {v3_location_id: locationId},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	}
})
