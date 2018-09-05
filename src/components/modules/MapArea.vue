<!-- 

	REQUIRES v-if="false" WHEN HIDDEN

	If used inside a hidden element
	(i.e. if an ancestor is controlled by a v-if or v-show directive)
	must be used with v-if

	<map-area v-if="!parentHidden"></map-area>

 -->

<template>
	<div class="map-polygon-container"
	     :style="`width:${this.width};height:${this.height};`">

		<div :id="`map-polygon${this._uid}`"
		     class="map-polygon"></div>

		<div class="legend">
			<div class="mode-buttons-container">
				<button class="btn blue"
						:class="{'btn-outline' : mode !== 'move'}"
						@click.stop.prevent="shapeMoveMode()">
					Move
					<i class="fa fa-hand-pointer-o"
					aria-hidden="true"></i>
				</button>
				<button class="btn blue draw-button"
						:class="{'btn-outline' : mode !== 'polygon'}"
						@click.stop.prevent="polygonDrawingMode()"
						:disabled="drawButtonDisabled">
					Draw
					<i class="fa fa-pencil"
					aria-hidden="true"></i>
				</button>
			</div>

			<div class="remove-buttons-container">
				<button 
						v-for="(polygon, index) in mapPolygons"
						:key="index"
						class="btn blue btn-outline remove-button"
						@click.stop.prevent="deletePolygon(index)">
					<div class="remove-button-contents">
						<span>Remove</span>
						<i class="fa fa-lg fa-trash"
						:style="`color:${polygon.fillColor}`"
						aria-hidden="true">
						</i>
					</div>
				</button>
			</div>
		</div>
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
		/* 	an array of objects, each containing a coordinates property with the vertex lat and lng
			[
				{
					id: 1,
					paths: [ [44, -85], [45, -75], [40, -75], [40, -85] ]
				}
			]
		*/
		polygons: {
			type: Array,
			required: false,
			default: () => []
		},
		// indicates that user can create multiple polygons
		multi: {
			type: Boolean,
			required: false,
			default: () => false
		},
		// an array of colors for polygon borders and fills
		colors: {
			type: Array,
			required: false,
			default: () => [
				'#000075',
				'#e6194B',
				'#3cb44b',
				'#4363d8',
				'#f58231',
				'#46f0f0',
				'#f032e6',
				'#008080',
				'#e6beff',
				'#9A6324',
				'#fffac8',
				'#800000',
				'#aaffc3',
				'#a9a9a9',
				'#000000'
			]
		}
	},
	data () {
		return {
			map: {},
			drawingManager: {},
			mapPolygons: [],
			colorsArray: [],
			mode: 'move',
			lastId: 0
		}
	},
	computed: {
		drawButtonDisabled () {
			return this.mapPolygons.length > 0 && this.multi === false
		}
	},
	created () {
		this.colorsArray = [...this.colors]
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
		}).then(
			function () {
				_this.mountMap()
			},
			function (err) {
				console.error(err)
			}
		)
	},
	methods: {
		/**
		 * To mount a map.
		 * @function
		 * @returns {undefined}
		 */
		mountMap () {
			let _this = this
			this.map = new google.maps.Map(
				document.getElementById(`map-polygon${_this._uid}`),
				{
					zoom: this.zoom,
					center: { lat: this.lat, lng: this.lng }
				}
			)

			if (this.polygons.length) {
				this.resizeToPolygons()
				this.displayPolygons()
				this.mapPolygons.forEach(polygon => {
					this.addEditListeners(polygon)
				})
			} else {
				this.map.setCenter({
					lat: this.lat,
					lng: this.lng
				})
			}

			this.emitPolygons()
			this.mountDrawingManager()
		},

		/**
		 * To center and zoom map to fit the polygon.
		 * @function
		 * @returns {undefined}
		 */
		resizeToPolygons () {
			let bounds = new google.maps.LatLngBounds()

			this.polygons.forEach(polygon => {
				if (polygon.paths && polygon.paths.length) {
					const paths = polygon.paths
					for (let i = 0; i < paths.length; i++) {
						bounds.extend({
							lat: paths[i][0],
							lng: paths[i][1]
						})
					}
				}
			})
			this.map.fitBounds(bounds)
		},

		/**
		 * To display the polygon.
		 * @function
		 * @returns {undefined}
		 */
		displayPolygons () {
			this.polygons.forEach((polygon, index) => {
				const paths = polygon.paths
				const color = this.getColor(index)
				if (paths && paths.length) {
					let newPolygon = new google.maps.Polygon({
						paths: paths.map(vertex => ({
							lat: vertex[0],
							lng: vertex[1]
						})),
						editable: true,
						draggable: true,
						strokeColor: color,
						strokeOpacity: 1,
						strokeWeight: 2,
						fillColor: color,
						fillOpacity: 0.1
					})
					if (polygon.id === undefined) {
						newPolygon.id = this.getId()
					} else {
						newPolygon.id = polygon.id
					}
					this.mapPolygons.push(newPolygon)
					this.mapPolygons[this.mapPolygons.length - 1].setMap(this.map)
				}
			})
		},

		/**
		 * To register listeners that trigger when polygon is edited
		 * @function
		 * @param {object} polygon - The polygon to attach the listeners to
		 * @returns {undefined}
		 */
		addEditListeners (polygon) {
			let _this = this

			polygon.getPaths().forEach(function (path, index) {
				google.maps.event.addListener(path, 'insert_at', function () {
					_this.emitPolygons()
				})
				google.maps.event.addListener(path, 'remove_at', function () {
					_this.emitPolygons()
				})
				google.maps.event.addListener(path, 'set_at', function () {
					_this.emitPolygons()
				})
			})
			google.maps.event.addListener(polygon, 'dragend', function () {
				_this.emitPolygons()
			})
		},

		/**
		 * To switch to polygon drawing mode
		 * @function
		 * @returns {undefined}
		 */
		polygonDrawingMode () {
			this.drawingManager.setDrawingMode('polygon')
			this.mode = 'polygon'
		},
		/**
		 * To switch to shape moving mode
		 * @function
		 * @returns {undefined}
		 */
		shapeMoveMode () {
			this.drawingManager.setDrawingMode(null)
			this.mode = 'move'
		},

		/**
		 * To generate options for the Drawing Manager
		 * @function
		 * @returns {undefined}
		 */
		getDrawingManagerOptions () {
			const color = this.getColor()
			return {
				drawingControl: false,
				polygonOptions: {
					editable: true,
					draggable: true,
					strokeColor: color,
					strokeWeight: 2,
					fillColor: color,
					fillOpacity: 0.1
				}
			}
		},
		/**
		 * To get the next available color
		 * @function
		 * @returns {undefined}
		 */
		getColor () {
			const color = this.colorsArray[0]
			this.colorsArray.splice(0, 1)
			this.colorsArray.push(color)
			return color
		},
		/**
		 * To reuse a color
		 * @function
		 * @param {string} color - A string with the hex of the color to reuse
		 * @returns {undefined}
		 */
		recycleColor (color) {
			const colorIndex = this.colorsArray.indexOf(color)
			this.colorsArray.splice(colorIndex, 1)
			this.colorsArray = [color, ...this.colorsArray]
		},
		getId () {
			const id = `id${this.lastId}`
			this.lastId++
			return id
		},
		/**
		 * To enable user to draw a polygon.
		 * @function
		 * @returns {undefined}
		 */
		mountDrawingManager () {
			this.drawingManager = new google.maps.drawing.DrawingManager(
				this.getDrawingManagerOptions()
			)
			this.drawingManager.setMap(this.map)

			let _this = this
			google.maps.event.addListener(
				this.drawingManager,
				'polygoncomplete',
				function (polygon) {
					_this.polygonComplete(polygon)
				}
			)
		},

		/**
		 * To register listeners that trigger when polygon is edited
		 * @function
		 * @param {object} polygon - The polygon to attach the listeners to
		 * @returns {undefined}
		 */
		polygonComplete (polygon) {
			if (!this.multi) {
				this.shapeMoveMode()
			}

			polygon.id = this.getId()
			this.mapPolygons.push(polygon)
			this.drawingManager.setOptions(
				this.getDrawingManagerOptions()
			)
			this.addEditListeners(
				this.mapPolygons[this.mapPolygons.length - 1]
			)
			this.emitPolygons()
		},

		/**
		 * To remove a shape
		 * @function
		 * @param {integer} index - Index of the polygon to remove
		 * @returns {undefined}
		 */
		deletePolygon (index) {
			this.mapPolygons[index].setMap(null)
			this.recycleColor(this.mapPolygons[index].fillColor)
			this.mapPolygons.splice(index, 1)
			this.drawingManager.setOptions(this.getDrawingManagerOptions())
			this.emitPolygons()
		},

		/**
		 * To update the paths property of the polygons prop, add a color property and add new polygons
		 * @function
		 * @returns {undefined}
		 */
		editedPolygons () {
			let polygons = []
			this.mapPolygons.forEach(mapPolygon => {
				let coordinates = mapPolygon.getPath().getArray()
				coordinates = coordinates.map(vertex => [
					vertex.lat(),
					vertex.lng()
				])
				// duplicate the last vertex
				if (
					!(
						coordinates[0][0] ===
							coordinates[coordinates.length - 1][0] &&
						coordinates[0][1] ===
							coordinates[coordinates.length - 1][1]
					)
				) {
					coordinates.push(coordinates[0])
				}

				const propPolygon = this.polygons.find(p => p.id === mapPolygon.id)
				if (propPolygon === undefined) {
					polygons.push({
						color: mapPolygon.fillColor,
						paths: coordinates
					})
				} else {
					polygons.push({
						...propPolygon,
						color: mapPolygon.fillColor,
						paths: coordinates
					})
				}
			})
			return polygons
		},
		/**
		 * To notify parent on create or change.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		emitPolygons () {
			this.$emit('polygonEmitted', this.editedPolygons())
		}
	}
}
/* eslint-enable no-undef  */
</script>

<style scoped>
.map-polygon-container {
	position: relative;
	display: flex;
	flex-direction: column;
}
.map-polygon {
	height: 100%;
	width: 100%;
}
.legend {
	width: 100%;
	display: flex;
	align-items: center;
	padding: 20px 0;
}
.mode-buttons-container {
	display: inline-flex;
	padding-top: 5px;
}
.remove-buttons-container {
	display: inline-flex;
	flex-wrap: wrap;
}
.draw-button {
	margin: 0 20px 0 5px;
}
.remove-button {
	margin-top: 5px;
	margin-right: 5px;
}
.remove-button-contents {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
}
.remove-button-contents i {
	margin-left: 5px;
}
</style>
