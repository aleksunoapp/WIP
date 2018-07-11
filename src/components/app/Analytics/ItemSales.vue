<template>
	<div>
		<div class="row">
			<div class="col-md-12">  	      		
				<div class="portlet box blue-hoki">
					<div class="portlet-title bg-blue-chambray">
						<div class="caption" style="font-size:14px">
							<span class="fa-stack fa-sm">
								<i class="fa fa-circle fa-stack-2x" aria-hidden="true" style="color:rgb(26,188,156);line-height: inherit"></i>
								<i class="fa fa-trophy fa-stack-1x" aria-hidden="true" style="color:rgb(255,255,255);line-height:inherit"></i>
							</span>
							Top 10 Items
						</div>
						<div class="tools clickable" @click="downloadCSV(itemSummary)">
							<i class="fa fa-download" aria-hidden="true"></i>
						</div>
					</div>
					<div class="portlet-body">
						<el-table
							:data="itemSummary">
							<el-table-column
								prop="name"
								label="Name"
								sortable>
							</el-table-column>
							<el-table-column
								prop="actual_price"
								label="Price"
								width="150"
								:formatter="tableFormatUSD"
								sortable>
							</el-table-column>
							<el-table-column
								prop="total_sale"
								label="Total sales"
								width="150"
								sortable>
							</el-table-column>
							<el-table-column
								prop="item_sku"
								label="SKU"
								width="150"
								sortable>
							</el-table-column>
							<el-table-column
								label="Category">
								<template slot-scope="scope">
									<div class="tbl-category-column-wrapper">
										<img class="tbl-category-image" :src="scope.row.category_image"></img>
										<p class="tbl-category-name">{{scope.row.category}}</p>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AnalyticsFunctions from '../../../controllers/Analytics'

export default {
	data () {
		return {
			loadingItemSummary: false,
			itemSummary: [],
			isErrorMessage: ''
		}
	},
	created () {
		this.getItemSummary()
	},
	methods: {
		/**
		 * To save data as a CSV
		 * @function
		 * @param {array} dataSource - An array of objects containing summary data
		 * @returns {undefined}
		 */
		downloadCSV (dataSource) {
			var data = [...dataSource]

			let strip = function (text) {
				return text.toString().replace(',', ' ')
			}

			// Each CSV column is separated by ";" and new line "\n" for next row
			var csvContent = 'Name,Price,Total sales,SKU,Category\n'
			data.forEach(function (row, index) {
				let dataString = `${strip(row.name)},${strip(row.actual_price)},${strip(row.total_sale)},${strip(row.item_sku)},${strip(row.category)}`
				csvContent += index < data.length ? dataString + '\n' : dataString
			})

			/* eslint-disable no-undef */
			// The download function takes a CSV string, the filename and mimeType as parameters
			var download = function (content, fileName, mimeType) {
				var a = document.createElement('a')
				mimeType = mimeType || 'application/octet-stream'

				if (navigator.msSaveBlob) { // IE10
					navigator.msSaveBlob(new Blob([content], {
						type: mimeType
					}), fileName)
				} else if (URL && 'download' in a) { // html5 A[download]
					a.href = URL.createObjectURL(new Blob([content], {
						type: mimeType
					}))
					a.setAttribute('download', fileName)
					document.body.appendChild(a)
					a.click()
					document.body.removeChild(a)
				} else {
					location.href = 'data:application/octet-stream,' + encodeURIComponent(content) // only this mime type is supported
				}
			}

			download(csvContent, 'Top10Items.csv', 'text/csv;encoding:utf-8')
			/* eslint-enable no-undef */
		},
		/**
		 * To format a number
		 * @function
		 * @param {string} val - The number to format
		 * @returns {string} The formatted currency amount
		 */
		formatNumber (val) {
			if (val !== null && val !== undefined) {
				return val.toLocaleString('en-US', {style: 'decimal'})
			} else {
				return 'n/a'
			}
		},
		/**
		 * To format a number as currency
		 * @function
		 * @param {string} val - The number to format
		 * @returns {string} The formatted currency amount
		 */
		formatUSD (val) {
			if (val !== null && val !== undefined) {
				let local = Number(val)
				local = local.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
				if (local.indexOf('.') !== -1) {
					return local.slice(0, -3)
				} else {
					return local
				}
			} else {
				return 'n/a'
			}
		},
		/**
		 * el-table compliant cell data formatting function
		 * @function
		 * @param {object} row - The row to format
		 * @param {object} column - The column to format
		 * @returns {string} The formatted currency amount
		 */
		tableFormatNumber (row, column) {
			return this.formatNumber(row.value)
		},
		/**
		 * el-table compliant cell data formatting function
		 * @function
		 * @param {object} row - The row to format
		 * @param {object} column - The column to format
		 * @returns {string} The formatted currency amount
		 */
		tableFormatUSD (row, column) {
			return this.formatUSD(row.actual_price)
		},
		/**
		 * To get top selling items data
		 * @function
		 * @returns {undefined}
		 */
		getItemSummary () {
			this.loadingItemSummary = true
			var analyticsVue = this
			return AnalyticsFunctions.getItemSummary(analyticsVue.$root.appId, analyticsVue.$root.appSecret, analyticsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					analyticsVue.itemSummary = response.payload
					analyticsVue.loadingItemSummary = false
				} else {
					analyticsVue.loadingItemSummary = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					analyticsVue.$router.push('/login/expired')
					return
				}
				analyticsVue.loadingItemSummary = false
				if (reason.responseJSON) {
					analyticsVue.isErrorMessage = reason.responseJSON.message
				}
			})
		}
	}
}
</script>

<style scoped>
.tbl-category-column-wrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100px;
}
.tbl-category-name {
	margin: 0;
}
.tbl-category-image {
	margin: 0;
	max-width: 100%;
	max-height: 80%;
}
</style>
