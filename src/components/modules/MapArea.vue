<!-- 

    REQUIRES :v-if="false" WHEN HIDDEN

    If used inside a hidden element
    (i.e. if an ancestor is controlled by a v-if or v-show directive)
    must be used with v-if

    <map-area v-if="!parentHidden"></map-area>

 -->
<template>
	<div class="map-polygon-container" :style="`width:${this.width};height:${this.height};`">
		<div :id="`map-polygon${this._uid}`" class="map-polygon"></div>
	</div>
</template>

<script>
/* eslint-disable no-undef, no-new */
import GoogleMapsApiLoader from 'google-maps-api-loader'
import GlobalFunctions from './../../global.js'

export default {
	props: {
		// any valid CSS value
		width: {
			type: String,
			required: false,
			default: () => '100px'
		},
		// any valid CSS value
		height: {
			type: String,
			required: false,
			default: () => '100px'
		},
		lat: {
			type: Number,
			required: false,
			default: () => 43.6532
		},
		lng: {
			type: Number,
			required: false,
			default: () => -79.3832
		},
		// zoom level from 1 to 20
		zoom: {
			type: Number,
			required: false,
			default: () => 13
		},
		// an array of arrays containing coordinates of vertices in the format [lat, lng]
		// let exampleRectangle = [ [44, -85], [45, -75], [40, -75], [40, -85] ]
		polygonToEdit: {
			type: Array,
			required: false,
			default: () => []
		}
	},
	data () {
		return {
			map: {},
			drawingManager: {},
			polygon: {},
			paths: []
		}
	},
	/**
	 * To load the Google Maps Javascript API
	 * @function
	 * @returns {undefined}
	 */
	mounted () {
		let _this = this
		GoogleMapsApiLoader({
			libraries: ['drawing'],
			apiKey: GlobalFunctions.googleMapsJavascriptApiKey
		})
		.then(function () {
			_this.mountMap()
		}, function (err) {
			console.error(err)
		})
	},
	methods: {
		/**
		 * To mount a map.
		 * @function
		 * @returns {undefined}
		 */
		mountMap () {
			let _this = this
			this.map = new google.maps.Map(document.getElementById(`map-polygon${_this._uid}`), {
				zoom: this.zoom,
				center: {lat: this.lat, lng: this.lng}
			})

			if (this.polygonToEdit.length) {
				this.resizeToPolygon()
				this.displayPolygon()
				this.addEditListeners()
			} else {
				this.map.setCenter({
					lat: this.lat,
					lng: this.lng
				})
				this.mountDrawingManager()
			}
		},
		/**
		 * To center and zoom map to fit the polygon.
		 * @function
		 * @returns {undefined}
		 */
		resizeToPolygon () {
			let bounds = new google.maps.LatLngBounds()

			for (let i = 0; i < this.polygonToEdit.length; i++) {
				bounds.extend({lat: this.polygonToEdit[i][0], lng: this.polygonToEdit[i][1]})
			}
			this.map.fitBounds(bounds)
		},
		/**
		 * To display the polygon.
		 * @function
		 * @returns {undefined}
		 */
		displayPolygon () {
			this.polygon = new google.maps.Polygon({
				paths: this.polygonToEdit.map(vertex => ({lat: vertex[0], lng: vertex[1]})),
				editable: true,
				draggable: true,
				strokeColor: '#2C3E50',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#2C3E50',
				fillOpacity: 0.35
			})
			this.polygon.setMap(this.map)
		},
		/**
		 * To enable user to draw a polygon.
		 * @function
		 * @returns {undefined}
		 */
		mountDrawingManager () {
			this.drawingManager = new google.maps.drawing.DrawingManager({
				drawingControl: true,
				drawingMode: google.maps.drawing.OverlayType.polygon,
				drawingControlOptions: {
					position: google.maps.ControlPosition.LEFT_CENTER,
					drawingModes: ['polygon']
				},
				polygonOptions: {
					editable: true,
					draggable: true,
					strokeColor: '#2C3E50',
					strokeWeight: 5,
					fillColor: '#2C3E50',
					fillOpacity: 0.35
				}
			})
			this.drawingManager.setMap(this.map)

			let _this = this
			google.maps.event.addListener(this.drawingManager, 'polygoncomplete', function (polygon) {
				_this.disableDrawingManager()
				_this.polygon = polygon
				_this.emitPolygon()
				_this.addEditListeners()
			})
		},
		/**
		 * To disable the ability to add polygons
		 * @function
		 * @returns {undefined}
		 */
		disableDrawingManager () {
			this.drawingManager.setOptions({
				drawingControl: false,
				drawingMode: google.maps.drawing.OverlayType.polygon,
				drawingControlOptions: {
					position: google.maps.ControlPosition.LEFT_CENTER,
					drawingModes: ['polygon']
				},
				polygonOptions: {
					editable: true,
					draggable: true,
					strokeColor: '#2C3E50',
					strokeWeight: 5,
					fillColor: '#2C3E50',
					fillOpacity: 0.35
				}
			})
		},
		/**
		 * To register listeners that trigger when polygon is edited
		 * @function
		 * @returns {undefined}
		 */
		addEditListeners () {
			let _this = this

			this.polygon.getPaths().forEach(function (path, index) {
				google.maps.event.addListener(path, 'insert_at', function () {
					_this.emitPolygon()
				})
				google.maps.event.addListener(path, 'remove_at', function () {
					_this.emitPolygon()
				})
				google.maps.event.addListener(path, 'set_at', function () {
					_this.emitPolygon()
				})
			})
			google.maps.event.addListener(_this.polygon, 'dragend', function () {
				_this.emitPolygon()
			})
		},
		/**
		 * To notify parent on create or change.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		emitPolygon () {
			var coordinates = this.polygon.getPath().getArray()
			this.paths = coordinates.map(vertex => ([vertex.lat(), vertex.lng()]))
			if (!(this.paths[0][0] === this.paths[this.paths.length - 1][0] && this.paths[0][1] === this.paths[this.paths.length - 1][1])) {
				this.paths.push(this.paths[0])
			}
			this.$emit('polygonEmitted', this.paths)
		}
	}
}
/* eslint-enable no-undef  */
</script>

<style scoped>
.map-polygon-container {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.map-polygon {
	height: 100%;
	width: 100%;
}
</style>
