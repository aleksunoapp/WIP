<template>
	<div>
		<div class="help-screen-overlay" v-if="helpScreenShowing">
			<a 
				@click="closeHelpScreen()"
				class="help-screen-close"
			>
				{{ langTerms.close[$root.meta.local.toLowerCase()] }}
			</a>
			<div
				class="help-screen-information"
				v-if="
					this.$root.inspectionCounts.failCount !== 0 ||
					this.$root.inspectionCounts.warningCount !== 0
				"
				:style="`top: ${helpScreenVars.info.top}px;`"
			>
				<span
					class="help-screen-text"
				>
					{{ langTerms.view_more_info[$root.meta.local.toLowerCase()] }}
				</span>
				<span class="help-screen-block">
					<span class="information-icon"></span>
				</span>
				<div class="help-screen-arrow"></div>
			</div>
			<div 
				v-if="
					this.$root.inspectionCounts.failCount !== 0 ||
					this.$root.inspectionCounts.warningCount !== 0
				"
				class="help-screen-select-all"
				:class="{
					'french-width': $root.meta.local.toLowerCase() === 'fr-ca',
					'spanish': $root.meta.local.toLowerCase() === 'es-mx'
				}" 
				:style="`
					top: ${helpScreenVars.selectAll.top}px;
					background-color: ${helpScreenVars.selectAll.color};
					height: ${helpScreenVars.selectAll.height - 1}px;
				`"
			>
				<span class="help-screen-text">
					{{ langTerms.select_all_services[$root.meta.local.toLowerCase()] }}
				</span>
				<span
					class="help-screen-block select-block"
					:class="{
						'help-screen-height': helpScreenVars.selectAll.height > 30,
						'help-screen-selected': helpScreenVars.selectAll.checked,
						'help-screen-not-selected': !helpScreenVars.selectAll.checked
					}">
					<span> {{ (helpScreenVars.selectAll.checked) ? langTerms.remove_all[$root.meta.local.toLowerCase()] : langTerms.select_all[$root.meta.local.toLowerCase()] }} </span>
					<div class="service-checkbox">
						<input type="checkbox" :checked="helpScreenVars.selectAll.checked">
						<label>
							<span class="check"></span>
							<span class="box"></span>
						</label>
					</div>
				</span>
				<div class="help-screen-arrow"></div>
			</div>
			<div
				class="help-screen-select-individual"
				v-if="
					this.$root.inspectionCounts.failCount !== 0 ||
					this.$root.inspectionCounts.warningCount !== 0
				"
				:style="`
					top: ${helpScreenVars.select.top}px;
					background-color: ${helpScreenVars.select.color};
				`"
			>
				<span class="help-screen-text">
					{{ langTerms.select_services_individually[$root.meta.local.toLowerCase()] }}
				</span>
				<span class="help-screen-block select-block">
					<div class="service-checkbox">
						<input type="checkbox" :checked="helpScreenVars.select.checked">
						<label>
							<span class="check"></span>
							<span class="box"></span>
						</label>
					</div>
				</span>
				<div class="help-screen-arrow"></div>
			</div>
			<div class="help-screen-inspection">
				<span class="help-screen-text">{{ langTerms.view_inspection_summary[$root.meta.local.toLowerCase()] }}</span>
				<span class="inspection-icon"></span>
				<div class="help-screen-arrow"></div>
			</div>
			<div class="help-screen-contact" v-if="$root.mobile">
				<span class="help-screen-text">{{ langTerms.call_us[$root.meta.local.toLowerCase()] }}</span>
				<span class="contact-icon"></span>
				<div class="help-screen-arrow"></div>
			</div>
			<div class="help-screen-chat" v-if="$root.mobile">
				<span class="help-screen-text">{{ langTerms.message_us[$root.meta.local.toLowerCase()] }}</span>
				<span class="chat-icon"></span>
				<div class="help-screen-arrow"></div>
			</div>
		</div>
		<div class="wrapper" :class="{'wrapper-hold': helpScreenShowing}">
			<span class="help-icon" @click="openHelpScreen()"></span>
			<div class="summary-header"> {{ langTerms.inspection_summary[$root.meta.local.toLowerCase()] }}</div>
			<div class="summary-icons">
				<div class="icon">
					<img src="../assets/images/concern.png">
					({{ this.$root.inspectionCounts.concernCount }})
				</div>
				<div class="icon">
					<img src="../assets/images/fail.png">
					({{ this.$root.inspectionCounts.failCount }})
				</div>
				<div class="icon">
					<img src="../assets/images/warning.png">
					({{ this.$root.inspectionCounts.warningCount }})
				</div>
				<div class="icon">
					<img src="../assets/images/pass.png">
					({{ this.$root.inspectionCounts.passCount }})
				</div>
			</div>

			<template v-for="(category, index) in serviceCategories" v-if="category.id === '5'">
				<div class="grey accordion" :key="`category-${index}`">
					<div @click="toggleAccordion(category)" class="accordion-header">
						<img
							:src="require('../assets/images/concern-white.png')"
							class="accordion-image"
						> {{ $root.meta.customerConcernsLabel }} {{ ($root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0) ? `(${$root.inspectionCounts[countVariables[category.serviceCategoryType]]})` : '' }}
						<div class="accordion-status" v-if="$root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0"></div>
						<div class="clear"></div>
					</div>
					<div class="accordion-contents">
						<div class="summary-table">
							<div v-if="category.serviceCategoryType !== 'PASS' && $root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0" class="summary-table-row">
								<div class="summary-table-cell fit-to-content">
									<span class="summary-legend">
										<b>{{ langTerms.check_recommended_services[$root.meta.local.toLowerCase()] }}</b>
									</span>
								</div>

								<div class="summary-table-cell">
								</div>

								<div class="summary-table-cell" >
									<span v-if="showRemoveAllCheckBox(category)"> {{ (category.allSelected) ? langTerms.remove_all[$root.meta.local.toLowerCase()] : langTerms.select_all[$root.meta.local.toLowerCase()] }} </span>
									<div class="service-checkbox" v-if="showRemoveAllCheckBox(category)">
										<input
											type="checkbox"
											:id="`select-${category.serviceCategoryType}`"
											v-model="category.allSelected"
											@change="toggleAll(category)"
											class="select-all"
										>
										<label :for="`select-${category.serviceCategoryType}`">
											<span class="check"></span>
											<span class="box"></span>
										</label>
									</div>
								</div>
							</div>

							<template v-for="(service, serviceIndex) in $root.services">
								<template v-if="
										service.category === '6' ||
										service.category === '7' ||
										service.category === '8' ||
										service.category === '9'
									">
									<template v-if="service.subServices">
										<div
											v-for="(subService, subServiceIndex) in service.subServices"
											class="summary-table-row summary-item"
											:key="`service-${serviceIndex}-${subServiceIndex}`">
											<div class="summary-table-row-wrap">
												<div class="summary-table-cell fit-to-content">
													<span
														class="information-icon"
														@click="openServiceModal(service, subServiceIndex)">
													</span>
													<span
														class="service-name"
													>
														{{ service.name }}
													</span>
												</div>
												<div class="summary-table-cell">
													<div class="dot-caption-container">
														<div class="dot-container">
															<img :src="service.iconUrl">
														</div>
														<span
															v-if="service.subServices"
															class="dot-caption"
															v-bind:class="{'bold': (service.subServices[subServiceIndex].isHighlighted === true)}"
														>
															{{service.subServices[subServiceIndex].name}}
															<span v-if="service.subServices[subServiceIndex].isHighlighted === true">* </span>
														</span>
													</div>
												</div>
											</div>
											<div class="summary-table-cell">
												<div class="flex justify-center align-center" v-if="category.serviceCategoryType !== 'PASS' && service.category !== '8'">
													<span class="price" v-if="service.subServices[subServiceIndex].price === 0 && service.subServices[subServiceIndex].laborMatrixPayment">{{service.subServices[subServiceIndex].laborMatrixPayment}}</span>
													<span class="price" v-else-if="service.subServices[subServiceIndex].price !== 0">{{ formatCurrency(service.subServices[subServiceIndex].price) }}</span>
													<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
													<div class="service-checkbox">
														<input
															type="checkbox"
															:id="`sub-service-${serviceIndex}-${subServiceIndex}`"
															v-model="service.subServices[subServiceIndex].isSelected"
															@change="toggleCheckbox(category, service, subServiceIndex)"
															class="select"
														>
														<label :for="`sub-service-${serviceIndex}-${subServiceIndex}`">
															<span class="check"></span>
															<span class="box"></span>
														</label>
													</div>
												</div>
											</div>
										</div>
									</template>
									<template v-else>
										<div
											:key="`service-${serviceIndex}`"
											class="summary-table-row summary-item">
											<div class="summary-table-row-wrap">
												<div class="summary-table-cell fit-to-content">
													<span
														class="information-icon"
														@click="openServiceModal(service)">
													</span>
													<span
														class="service-name"
														v-bind:class="{'bold': (service.isHighlighted === true)}">
														<span v-if="service.isHighlighted === true">* </span>{{ service.name }}
													</span>
												</div>
												<div class="summary-table-cell">
													<div class="dot-caption-container">
														<div class="dot-container">
															<img :src="service.iconUrl">
														</div>
														<span 
															v-if="service.category === '6' || service.category === '7'"
															class="dot-caption"
														>
															{{langTerms.problem_identified[$root.meta.local.toLowerCase()]}}
														</span>
														<span 
															v-if="service.category === '8' || service.category === '9'"
															class="dot-caption"
														>
															{{langTerms.no_issue_found[$root.meta.local.toLowerCase()]}}
														</span>
													</div>
												</div>
											</div>
											<div class="summary-table-cell"></div>
										</div>
									</template>
								</template>
							</template>
						</div>
					</div>
				</div>
				<div v-if="showLegend(category)" :key="`legend-${index}`"><p class="newRecAst">{{ langTerms.new_recommendation[$root.meta.local.toLowerCase()] }}</p></div>
			</template>

			<template v-for="(category, index) in serviceCategories" v-if="category.showOnInspection && category.id !=='5'">
				<div
					:class="{
						'accordion-open': category.defaultExpended,
						'accordion-closed': !category.defaultExpended,
						'red': category.serviceCategoryType === 'SAFETY',
						'yellow': category.serviceCategoryType === 'ATTN',
						'green': category.serviceCategoryType === 'PASS'
					}"
					class="accordion"
					:key="`category-${index}`"
				>
					<div @click="toggleAccordion(category)" class="accordion-header">
						<img :src="category.iconUrl"> {{ category.name }} {{ ($root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0) ? `(${$root.inspectionCounts[countVariables[category.serviceCategoryType]]})` : '' }}
						<div class="accordion-status" v-if="$root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0"></div>
						<div class="clear"></div>
					</div>
					<div class="accordion-contents">
						<div v-if="category.serviceCategoryType === 'PASS'" class="view-full-report">
							<div class="view-full-report-btn" @click.stop="openFullInspection()">
								<a id="viewReport">
									{{ langTerms.view_full_report[$root.meta.local.toLowerCase()] }}
									<img src="../assets/images/external-link.png">
								</a>
							</div>
						</div>
						<div class="summary-table">
							<div v-if="category.serviceCategoryType !== 'PASS' && $root.inspectionCounts[countVariables[category.serviceCategoryType]] !== 0" class="summary-table-row">
								<div class="summary-table-cell">
									<span class="summary-legend">
										<b>{{ langTerms.check_recommended_services[$root.meta.local.toLowerCase()] }}</b>
									</span>
								</div>

								<div class="summary-table-cell">
								</div>

								<div class="summary-table-cell">
									<span> {{ (category.allSelected) ? langTerms.remove_all[$root.meta.local.toLowerCase()] : langTerms.select_all[$root.meta.local.toLowerCase()] }} </span>
									<div class="service-checkbox">
										<input 
											type="checkbox"
											:id="`select-${category.serviceCategoryType}`"
											v-model="category.allSelected"
											@change="toggleAll(category)"
											class="select-all"
										>
										<label :for="`select-${category.serviceCategoryType}`">
											<span class="check"></span>
											<span class="box"></span>
										</label>
									</div>
								</div>
							</div>

							<template v-for="(service, serviceIndex) in $root.services">
								<template v-if="category.id === service.category">
									<template v-if="service.subServices">
										<div class="summary-table-row summary-item" v-for="subService in service.subServices" :key="`subService-${subService.id}`">
											<div class="summary-table-cell">
												<span class="information-icon" :class="{'no-icon-bg': category.serviceCategoryType === 'PASS'}" @click="openServiceModal(subService)"></span>
												<span class="service-name" v-bind:class="{'bold': (subService.isHighlighted ===  true)}"><span v-if="subService.isHighlighted === true">* </span>{{ subService.name }}</span>
											</div>
											<div class="summary-table-cell">
											</div>
											<div class="summary-table-cell">
												<div class="flex justify-center align-center" 
												v-if="category.serviceCategoryType !== 'PASS'">
													<span class="price" v-if="subService.price === 0 && subService.laborMatrixPayment">{{subService.laborMatrixPayment}} </span>
													<span class="price" v-else-if="subService.price !== 0">{{ formatCurrency(subService.price) }} </span>
													<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
													<div class="service-checkbox">
														<input
															type="checkbox"
															:id="`sub-service-${subService.id}`"
															v-model="subService.isSelected"
															@change="toggleCheckbox(category, subService)"
															class="select"
														>
														<label :for="`sub-service-${subService.id}`">
															<span class="check"></span>
															<span class="box"></span>
														</label>
													</div>
												</div>
											</div>
										</div>
									</template>
									<div class="summary-table-row summary-item" v-if="showCategoryItems(category, service)" :key="`service-${serviceIndex}`">
										<div class="summary-table-cell">
											<span class="information-icon" :class="{'no-icon-bg': category.serviceCategoryType === 'PASS'}" @click="openServiceModal(service)"></span>
											<span class="service-name" v-bind:class="{'bold': (service.isHighlighted === true)}"><span v-if="service.isHighlighted === true">* </span>{{ service.name }}</span>
										</div>
										<div class="summary-table-cell">
										</div>
										<div class="summary-table-cell">
											<div class="flex justify-center align-center" 
											v-if="category.serviceCategoryType !== 'PASS'">
												<span class="price" v-if="service.price === 0 && service.laborMatrixPayment">{{service.laborMatrixPayment}}</span>
												<span class="price" v-else-if="service.price !== 0">{{ formatCurrency(service.price) }}</span>
												<span class="price" v-else> {{ langTerms.free[$root.meta.local.toLowerCase()] }} </span>
												<div class="service-checkbox">
													<input
														type="checkbox"
														:id="`sub-service-${service.id}`"
														v-model="service.isSelected"
														@change="toggleCheckbox(category, service)"
														class="select"
													>
													<label :for="`sub-service-${service.id}`">
														<span class="check"></span>
														<span class="box"></span>
													</label>
												</div>
											</div>
										</div>
									</div>
								</template>
							</template>
						</div>
					</div>
				</div>
				<div v-if="showLegend(category)" :key="`legend-${index}`"><p class="newRecAst">{{ langTerms.new_recommendation[$root.meta.local.toLowerCase()] }}</p></div>
			</template>

			<div class="proceed-component">
				<div v-if="$root.inspectionCounts.failCount && $root.inspectionCounts.warningCount" class="time-notice" :class="{'danger-flag': timeExpired}">
					<span v-if="!timeExpired">{{ langTerms.if_approved_by[$root.meta.local.toLowerCase()] }} {{ formatTime(this.$root.meta.responseBy) }} {{ langTerms.your_vehicle_will_be_ready[$root.meta.local.toLowerCase()] }} {{ formatTime(this.$root.meta.promise) }}.</span>
					<span v-else>{{ langTerms.your_service_advisor_will_contact[$root.meta.local.toLowerCase()] }}</span>
				</div>
				<div v-if="!$root.inspectionCounts.failCount && !$root.inspectionCounts.warningCount" class="time-notice">
					<span>{{ langTerms.your_vehicle_will_be_ready[$root.meta.local.toLowerCase()] }} {{ formatTime(this.$root.meta.promise) }}.</span>
				</div>
				<div class="total-estimate">
					<div class="total-label">
						<div class="large">
							{{ langTerms.estimate_for_selected_services[$root.meta.local.toLowerCase()] }}
						</div>
					</div>
					<div class="total-estimate-value">
						{{ formatCurrency(inspectionTotal.total) }}
					</div>
				</div>
				<div class="total-estimate">
					<div class="total-label">
						<div class="large">
							{{ langTerms.estimate_for_previous_services[$root.meta.local.toLowerCase()] }}
						</div>
					</div>
					<div class="total-estimate-value">
						{{ formatCurrency($root.totals.serviceTotal.total) }}
					</div>
				</div>
				<div @click="openServices()" class="proceed-btn">
					{{ langTerms.next[$root.meta.local.toLowerCase()] }}
				</div>
				<div class="footer-bar">
					<a v-if="$root.mobile" :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon" @click="$root.logEvent('Clicked Phone icon')"></a>
					<a v-if="$root.mobile" :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon" @click="$root.logEvent('Clicked Text icon')"></a>
					<!-- <a :href="this.$root.meta.inspectionPdfUrl" target="_blank" class="inspection-icon" @click="$root.logEvent(`Opened Inspection Summary PDF`)"></a> -->
					<a @click="openFullInspection()" href="javascript:void(0);" class="inspection-icon"></a>
				</div>
			</div>
		</div>
		<info-popup v-if="modalOpen" :viewingService="viewingService" :viewingSubServiceIndex="viewingSubServiceIndex" @closeModal="closeServiceModal" @approve="approveService" @defer="deferService"></info-popup>
		<defer-modal v-if="deferModal" @deferReason="deferServiceReason"></defer-modal>
	</div>
</template>

<script>
import $ from 'jquery'
import DeferModal from './DeferModal'
import InfoPopup from './InfoPopup'

let allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export default {
	data () {
		return {
			countVariables: {
				'SAFETY': 'failCount',
				'ATTN': 'warningCount',
				'PASS': 'passCount',
				'CC': 'concernCount'
			},
			services: this.$root.services,
			modalOpen: false,
			serviceCategories: [],
			inspectionTotal: 0,
			viewingService: {},
			viewingSubServiceIndex: undefined,
			timeExpired: false,
			helpScreenShowing: false,
			helpScreenVars: {
				info: {
					top: 0,
					backgroundColor: ''
				},
				selectAll: {
					top: 0,
					height: 0,
					backgroundColor: '',
					checked: false
				},
				select: {
					top: 0,
					backgroundColor: '',
					checked: false
				}
			},
			deferModal: false,
			activeDeferralService: {},
			activeDeferralCategory: {},
			categoryDeferral: false,
			langTerms: {
				close: {
					'en-ca': 'Close',
					'en-us': 'Close',
					'fr-ca': 'Fermer',
					'es-mx': 'Cerrar'
				},
				view_more_info: {
					'en-ca': 'View more information about the service',
					'en-us': 'View more information about the service',
					'fr-ca': 'Afficher des détails additionnels concernant le service',
					'es-mx': 'Ver más información acerca del servicio'
				},
				select_all_services: {
					'en-ca': 'Select all services',
					'en-us': 'Select all services',
					'fr-ca': 'Sélectionner tous les services',
					'es-mx': 'Seleccionar todos los servicios'
				},
				remove_all: {
					'en-ca': 'Remove All',
					'en-us': 'Remove All',
					'fr-ca': 'Supprimer tout',
					'es-mx': 'Quitar todos'
				},
				select_all: {
					'en-ca': 'Select All',
					'en-us': 'Select All',
					'fr-ca': 'Sélectionner tout',
					'es-mx': 'Seleccionar todos'
				},
				select_services_individually: {
					'en-ca': 'Select services individually',
					'en-us': 'Select services individually',
					'fr-ca': 'Sélectionner les services individuellement',
					'es-mx': 'Seleccionar los servicios individualmente'
				},
				view_inspection_summary: {
					'en-ca': 'View your inspection summary',
					'en-us': 'View your inspection summary',
					'fr-ca': 'Afficher votre récapitulatif de l\'inspection',
					'es-mx': 'Ver su resumen de inspección'
				},
				call_us: {
					'en-ca': 'Call Us',
					'en-us': 'Call Us',
					'fr-ca': 'Call Us',
					'es-mx': 'Llámenos'
				},
				message_us: {
					'en-ca': 'Message Us',
					'en-us': 'Message Us',
					'fr-ca': 'Message Us',
					'es-mx': 'Envíenos un mensaje'
				},
				inspection_summary: {
					'en-ca': 'Inspection Summary',
					'en-us': 'Inspection Summary',
					'fr-ca': 'Récapitulatif de l\'Inspection',
					'es-mx': 'Resumen de inspección'
				},
				no: {
					'en-ca': 'No',
					'en-us': 'No',
					'fr-ca': 'Aucun',
					'es-mx': 'No'
				},
				were_found: {
					'en-ca': 'were found',
					'en-us': 'were found',
					'fr-ca': 'découvert',
					'es-mx': 'se encontraron'
				},
				view_full_report: {
					'en-ca': 'View Full Report',
					'en-us': 'View Full Report',
					'fr-ca': 'Afficher le rapport complet',
					'es-mx': 'Ver el informe completo'
				},
				check_recommended_services: {
					'en-ca': 'Check the recommended services you authorize.',
					'en-us': 'Check the recommended services you authorize.',
					'fr-ca': 'Sélectionnez toutes les recommandations vous autorisez.',
					'es-mx': 'Verifique los servicios recomendados que usted autoriza.'
				},
				free: {
					'en-ca': 'Free',
					'en-us': 'Free',
					'fr-ca': 'Gratuit',
					'es-mx': 'Gratis'
				},
				if_approved_by: {
					'en-ca': 'If approved by',
					'en-us': 'If approved by',
					'fr-ca': 'Si les recommandations sont approuvées avant',
					'es-mx': 'Si aprueba antes de'
				},
				your_vehicle_will_be_ready: {
					'en-ca': 'your vehicle will be ready for pickup by',
					'en-us': 'your vehicle will be ready for pickup by',
					'fr-ca': 'votre véhicule sera prêt pour',
					'es-mx': 'su vehículo estará listo para su recogida a las'
				},
				your_service_advisor_will_contact: {
					'en-ca': 'Your service advisor will contact you when your services are completed',
					'en-us': 'Your service advisor will contact you when your services are completed',
					'fr-ca': 'Votre conseiller au service vous contactera lorsque les services seront complétés.',
					'es-mx': 'Su asesor de servicio se pondrá en contacto con usted cuando sus servicios se completen'
				},
				estimate_for_selected_services: {
					'en-ca': 'Estimate for Selected Services (not including taxes and fees)',
					'en-us': 'Estimate for Selected Services (not including taxes and fees)',
					'fr-ca': 'Coût estimatif pour les services sélectionnés (taxes et frais non inclus)',
					'es-mx': 'Presupuesto por servicios seleccionados (no incluye impuestos ni tasas)'
				},
				estimate_for_previous_services: {
					'en-ca': 'Estimate for Previously Approved Services',
					'en-us': 'Estimate for Previously Approved Services',
					'fr-ca': 'Coût estimatif pour les services précédemment approuvés',
					'es-mx': 'Presupuesto por servicios aprobados previamente'
				},
				next: {
					'en-ca': 'Next',
					'en-us': 'Next',
					'fr-ca': 'Suivant',
					'es-mx': 'Siguiente'
				},
				new_recommendation: {
					'en-ca': '* indicates a new/updated recommendation',
					'en-us': '* indicates a new/updated recommendation',
					'fr-ca': '* indique une recommandation ajoutée ou mise à jour',
					'es-mx': '* indica una recomendación nueva/actualizada'
				},
				no_issue_found: {
					'en-ca': 'No issue was found.  Please see comments for more information',
					'en-us': 'No issue was found.  Please see comments for more information',
					'fr-ca': 'Aucun problème trouvé. Veuillez voir les commentaires pour en savoir plus.',
					'es-mx': 'No se encontró ningún problema. Vea los comentarios para obtener más información.'
				},
				problem_identified: {
					'en-ca': 'Problem has been identified.  Please see comments for more information',
					'en-us': 'Problem has been identified.  Please see comments for more information',
					'fr-ca': 'Un problème a été trouvé. Veuillez voir les commentaires pour en savoir plus.',
					'es-mx': 'El problema ha sido identificado. Vea los comentarios para obtener más información'
				}
			}
		}
	},
	watch: {
		viewingService (thisService, previousService) {
			if (previousService.id !== undefined) {
				this.$root.logInfoPopupDuration(previousService.id)
			}
			if (thisService.id !== undefined) {
				this.$root.logInfoPopupDuration(thisService.id)
			}
		}
	},
	created () {
		if (this.$root.meta.expired) {
			this.$router.push('/')
		}
		this.serviceCategories = this.$root.serviceCategories
		this.inspectionTotal = this.$root.totals.inspectionTotal

		$('html, body').scrollTop(0)

		let dateConst = new Date()
		let responseDate = new Date(this.$root.meta.responseBy)
		this.timeExpired = responseDate < dateConst

		this.checkSelectAll()

		this.$root.logPageDuration('inspection')

		$(window).resize(() => {
			this.closeHelpScreen()
		})
	},
	destroyed () {
		this.$root.logPageDuration('inspection')
	},
	methods: {
		/**
		 * To format a time for the active locale
		 * @function
		 * @param {string} time - The time to format
		 * @returns {String} - A formatted string
		 */
		formatTime (time) {
			let formattedTime = ''
			let fullDate = new Date(time)
			let hour = fullDate.getHours()
			let minutes = fullDate.getMinutes()
			let meridian = 'AM'
			let preposition = 'on'
			if (this.$root.meta.local.toLowerCase() === 'fr-ca') {
				preposition = 'le'
			} else if (this.$root.meta.local.toLowerCase() === 'es-mx') {
				preposition = 'el'
			}

			if (
				this.$root.meta.local.toLowerCase() === 'en-ca' ||
				this.$root.meta.local.toLowerCase() === 'en-us' ||
				this.$root.meta.local.toLowerCase() === 'es-mx'
			) {
				if (hour === 12) {
					meridian = 'PM'
				} else if (hour > 12) {
					meridian = 'PM'
					hour -= 12
				} else if (hour === 0) {
					hour = 12
				}
			}

			if (minutes === 0) {
				minutes = '00'
			} else if (minutes < 10) {
				minutes = '0' + minutes
			}

			if (this.$root.meta.local.toLowerCase() === 'fr-ca') {
				formattedTime = hour + ' h ' + minutes
			} else {
				formattedTime = hour + ':' + minutes + ' ' + meridian
			}

			if (this.$root.meta.local.toLowerCase() === 'fr-ca') {
				allMonths = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
			} else if (this.$root.meta.local.toLowerCase() === 'es-mx') {
				allMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
			}
			if (!this.checkSameDate(time)) {
				if (this.$root.meta.local.toLowerCase() === 'es-mx') {
					formattedTime = ` ${preposition} ${fullDate.getDate()} de ${allMonths[fullDate.getMonth()]} de ${fullDate.getFullYear()} a las ${formattedTime}`
				} else {
					formattedTime += ` ${preposition} ${allMonths[fullDate.getMonth()]} ${fullDate.getDate()}, ${fullDate.getFullYear()}`
				}
			}
			return formattedTime
		},
		/**
		 * To format a number by locale to two decimal digits
		 * @function
		 * @param {number} number - The number to format
		 * @returns {String} - A formatted string
		 */
		formatCurrency (number) {
			const local = number.toLocaleString(this.$root.meta.local, {
				minimumFractionDigits: 2, maximumFractionDigits: 2
			})
			if (this.$root.meta.local === 'fr-CA') {
				return `${local} $`
			} else {
				return `$${local}`
			}
		},
		/**
		 * To determine if the legend should be displayed by checking if the category includes highlighted services (skip free services as they aren't shown)
		 * @function
		 * @param {object} category - The category to check
		 * @returns {Number} - Positive integer if legend should be displayed, 0 if not
		 */
		showLegend (category) {
			let show = 0
			this.$root.services.forEach(service => {
				if (
					category.id === '5' && (
						service.category === '6' ||
						service.category === '7' ||
						service.category === '8' ||
						service.category === '9'
					) ||
					service.category === category.id
				) {
					if (service.subServices) {
						service.subServices.forEach(subService => {
							let condition = subService.isHighlighted
							if (condition) {
								show = 1
							}
						})
					} else {
						let condition = service.isHighlighted
						if (condition) {
							show = 1
						}
					}
				}
			})
			return show
		},
		/**
		 * To determine if the items in categories need to shown or not.
		 * @function
		 * @param {object} category - The category to check
		 * @param {object} service - The service price to check
		 * @returns {Number} - True|False.
		 */
		showCategoryItems (category, service) {
			if (category.serviceCategoryType !== 'PASS' && service.price !== 0) {
				return true
			} else if (category.serviceCategoryType === 'PASS') {
				return true
			} else if (category.serviceCategoryType === 'CC') {
				return true
			} else {
				return false
			}
		},
		/**
		 * To determine if the Remove all/select all checkbox needs to shown or not.
		 * @function
		 * @param {object} category - The category to check
		 * @returns {Number} - True|False.
		 */
		showRemoveAllCheckBox (category) {
			let show = 0
			this.$root.services.forEach(service => {
				if (service.category === '6' ||
					service.category === '7' ||
					service.category === '8' ||
					service.category === '9'

				) {
					if (service.subServices) {
						service.subServices.forEach(subService => {
							if (subService.price !== 0) {
								show = 1
							}
						})
					} else {
						if (service.price !== 0) {
							show = 1
						}
					}
				}
			})
			return show
		},
		/**
		 * To open the full inspection in a separate tab
		 * @function
		 * @returns {undefined}
		 */
		openFullInspection () {
			this.$root.logEvent('Opened Inspection Summary PDF')
			window.open(this.$root.meta.inspectionPdfUrl, '_blank')
		},
		/**
		 * To toggle the category accordion open and close
		 * @param {object} category - The category to toggle
		 * @function
		 * @returns {undefined}
		 */
		toggleAccordion (category) {
			category.defaultExpended ? this.$root.logEvent(`Collapsed ${category.name} accordion`) : this.$root.logEvent(`Expanded ${category.name} accordion`)
			category.defaultExpended = !category.defaultExpended
		},
		/**
		 * To add and subtract the selected service from the total price
		 * @param {object} category - The parent category of the service
		 * @param {object} service - The service being toggled
		 * @param {integer} subServiceIndex - The index of the subservice being toggled
		 * @function
		 * @returns {undefined}
		 */
		toggleCheckbox (category, service, subServiceIndex) {
			if (!this.$root.$data.userActivity.eventTracker.length || this.$root.$data.userActivity.eventTracker[this.$root.$data.userActivity.eventTracker.length - 1].event !== `Deferred ${service.name} service`) {
				service.isSelected ? this.$root.logEvent(`Checked ${service.name} checkbox`) : this.$root.logEvent(`Unchecked ${service.name} checkbox`)
			}

			if (subServiceIndex !== undefined) {
				if (service.subServices[subServiceIndex].isSelected) {
					this.inspectionTotal.total += parseFloat(service.subServices[subServiceIndex].price)
					this.checkSelectAll()
				} else {
					category.allSelected = false
					this.inspectionTotal.total -= parseFloat(service.subServices[subServiceIndex].price)
					this.openDeferReasonModal(category, service, false, subServiceIndex)
				}
			} else {
				if (service.isSelected) {
					this.inspectionTotal.total += parseFloat(service.price)
					this.checkSelectAll()
				} else {
					category.allSelected = false
					this.inspectionTotal.total -= parseFloat(service.price)
					this.openDeferReasonModal(category, service, false, null)
				}
			}

			// Doing this only to prevent value of -0.00
			this.inspectionTotal.total = Math.abs(this.inspectionTotal.total)

			this.$root.totals.inspectionTotal = this.inspectionTotal
		},
		/**
		 * To open the defer modal and set the active service as the one being deferred
		 * @param {object} category - The parent category of the service
		 * @param {object} service - The service being deferred
		 * @param {boolean} multiple - Whether this is a category deferral or single service
		 * @param {boolean} subServiceIndex - Index of the subservice to defer
		 * @function
		 * @returns {undefined}
		 */
		openDeferReasonModal (category, service, multiple, subServiceIndex) {
			this.deferModal = true

			if (multiple) {
				this.categoryDeferral = true
				this.activeDeferralCategory = Object.assign({}, category)
			} else {
				this.categoryDeferral = false
				if (category.id === '5' && service.subServices) {
					this.activeDeferralService = Object.assign({}, service.subServices[subServiceIndex])
				} else {
					this.activeDeferralService = Object.assign({}, service)
				}
			}
		},
		/**
		 * To add the deferral reason to the service
		 * @param {object} reason - The reason for deferral
		 * @function
		 * @returns {undefined}
		 */
		deferServiceReason (reason) {
			this.deferModal = false

			if (this.categoryDeferral) {
				this.$root.services.forEach(service => {
					if (
						service.category === this.activeDeferralCategory.id ||
						this.activeDeferralCategory.id === '5' && (
							service.category === '6' ||
							service.category === '7' ||
							service.category === '8' ||
							service.category === '9'
						)
					) {
						if (this.activeDeferralCategory.id === '5') {
							if (service.subServices) {
								service.subServices.forEach(subService => {
									subService.reasonId = reason.id
								})
							}
							service.reasonId = reason.id
						} else {
							if (service.subServices) {
								service.subServices.forEach(subService => {
									subService.reasonId = reason.id
								})
							} else {
								service.reasonId = reason.id
							}
						}
					}
				})
				this.activeDeferralCategory = Object.assign({})
			} else {
				for (let i = 0, x = this.$root.services.length; i < x; i++) {
					if (this.$root.services[i].subServices) {
						for (let j = 0, y = this.$root.services[i].subServices.length; j < y; j++) {
							if (this.$root.services[i].subServices[j].id === this.activeDeferralService.id) {
								this.$root.services[i].subServices[j].reasonId = reason.id
								break
							}
						}
					} else {
						if (this.$root.services[i].id === this.activeDeferralService.id) {
							this.$root.services[i].reasonId = reason.id
							break
						}
					}
				}
				this.activeDeferralService = Object.assign({})
			}
		},
		/**
		 * To turn on or off the checkboxes for all category services as well as add and subtract the selected service from the total price
		 * @param {object} category - The category to be toggled
		 * @function
		 * @returns {undefined}
		 */
		toggleAll (category) {
			if (category.allSelected) {
				this.$root.logEvent(`Selected all in ${category.name} category`)
				this.$root.services.forEach(service => {
					if (
						(
							category.id !== '5' &&
							service.category === category.id
						) || (
							category.id === '5' &&
							(
								service.category === '6' ||
								service.category === '7' ||
								service.category === '8' ||
								service.category === '9'
							)
						)
					) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								if (!subService.isSelected) {
									subService.isSelected = true
									this.inspectionTotal.total += parseFloat(subService.price)
								}
							})
						}
						if (!service.isSelected) {
							service.isSelected = true
							this.inspectionTotal.total += parseFloat(service.price)
						}
					}
				})
			} else {
				this.$root.logEvent(`Removed all in ${category.name} category`)
				this.$root.services.forEach(service => {
					if (
						(
							category.id !== '5' &&
							service.category === category.id
						) || (
							category.id === '5' &&
							(
								service.category === '6' ||
								service.category === '7' ||
								service.category === '8' ||
								service.category === '9'
							)
						)
					) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								if (subService.isSelected) {
									subService.isSelected = false
									this.inspectionTotal.total -= parseFloat(subService.price)
								}
							})
						}
						if (service.isSelected && category.id !== '5') {
							service.isSelected = false
							this.inspectionTotal.total -= parseFloat(service.price)
						}

						this.openDeferReasonModal(category, {}, true, null)
					}
				})
			}

			// Doing this only to prevent value of -0.00
			this.inspectionTotal.total = Math.abs(this.inspectionTotal.total)

			this.$root.totals.inspectionTotal = this.inspectionTotal
		},
		/**
		 * To check if the select all toggle should be on or off
		 * @function
		 * @returns {undefined}
		 */
		checkSelectAll () {
			this.serviceCategories.forEach(category => {
				let count = 0
				let total = 0

				this.$root.services.forEach(service => {
					if (
						(service.category === category.id) ||
						(category.id === '5' &&
							(
								service.category === '6' ||
								service.category === '7' ||
								service.category === '8' ||
								service.category === '9'
							)
						)
					) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								total += 1
								if (subService.isSelected) {
									count += 1
								}
							})
						} else {
							total += 1
							if (service.isSelected) {
								count += 1
							}
						}
					}
				})

				if (count === total) {
					this.$set(category, 'allSelected', true)
				} else {
					this.$set(category, 'allSelected', false)
				}
			})
		},
		/**
		 * To open the detailed view modal
		 * @function
		 * @param {object} service - The service to be viewed in detail
		 * @param {object} subServiceIndex - The index of the subservice to be viewed in detail
		 * @returns {undefined}
		 */
		openServiceModal (service, subServiceIndex) {
			this.$root.logEvent(`Displayed ${service.name} info window`)
			this.viewingSubServiceIndex = subServiceIndex
			this.viewingService = service
			this.modalOpen = true
		},
		/**
		 * To close the detailed view modal
		 * @function
		 * @returns {undefined}
		 */
		closeServiceModal () {
			this.viewingSubServiceIndex = undefined
			this.viewingService = {}
			this.modalOpen = false
		},
		/**
		 * To approve the service and close the modal
		 * @function
		 * @returns {undefined}
		 */
		approveService () {
			if (this.viewingSubServiceIndex !== undefined) {
				if (!this.viewingService.subServices[this.viewingSubServiceIndex].isSelected) {
					this.viewingService.subServices[this.viewingSubServiceIndex].isSelected = true
					this.toggleCheckbox(null, this.viewingService, this.viewingSubServiceIndex)
				}
			} else {
				if (!this.viewingService.isSelected) {
					this.viewingService.isSelected = true
					this.toggleCheckbox(null, this.viewingService)
				}
			}
			this.closeServiceModal()
		},
		/**
		 * To defer the service and close the modal
		 * @function
		 * @returns {undefined}
		 */
		deferService () {
			const category = this.serviceCategories.find(category => {
				if (
					this.viewingService.category === '6' ||
					this.viewingService.category === '7' ||
					this.viewingService.category === '8' ||
					this.viewingService.category === '9'
				) {
					return category.id === '5'
				} else {
					return category.id === this.viewingService.category
				}
			})
			if (this.viewingSubServiceIndex !== undefined) {
				this.viewingService.subServices[this.viewingSubServiceIndex].isSelected = false
				this.toggleCheckbox(category, this.viewingService, this.viewingSubServiceIndex)
			} else {
				this.viewingService.isSelected = false
				this.toggleCheckbox(category, this.viewingService)
			}
			this.closeServiceModal()
		},
		/**
		 * To redirect to the services route
		 * @function
		 * @returns {undefined}
		 */
		openServices () {
			this.$root.logEvent(`Clicked the Next button`)
			this.$router.push({name: 'services'})
		},
		/**
		 * To check whether the responseBy date is today or a future date
		 * @function
		 * @param {string} date - The date being checked
		 * @returns {boolean} - Whether or not it is the same date
		 */
		checkSameDate (date) {
			let checkDate = new Date(date)
			let now = new Date()

			return checkDate.getFullYear() === now.getFullYear() && checkDate.getMonth() === now.getMonth() && checkDate.getDate() === now.getDate()
		},
		/**
		 * To open the help screen and initialize help screen variables
		 * @function
		 * @returns {undefined}
		 */
		openHelpScreen () {
			this.serviceCategories.forEach(category => {
				category.defaultExpended = true
			})
			setTimeout(() => {
				const info = document.querySelector('.information-icon:not(.no-icon-bg)')
				this.helpScreenVars.info.top = info.closest('.summary-table-cell').offsetTop
				this.helpScreenVars.info.color = getComputedStyle(info.closest('.accordion')).backgroundColor

				const selectAll = document.querySelector('input.select-all')
				const selectAllParent = selectAll.closest('.summary-table-cell')
				this.helpScreenVars.selectAll.top = selectAllParent.offsetTop
				this.helpScreenVars.selectAll.height = selectAllParent.offsetHeight
				this.helpScreenVars.selectAll.color = getComputedStyle(selectAll.closest('.accordion')).backgroundColor
				this.helpScreenVars.selectAll.checked = selectAll.checked

				const select = document.querySelector('input.select')
				const selectParent = select.closest('.summary-table-cell')
				this.helpScreenVars.select.top = selectParent.offsetTop
				this.helpScreenVars.select.height = selectParent.offsetHeight
				this.helpScreenVars.select.color = getComputedStyle(select.closest('.accordion')).backgroundColor
				this.helpScreenVars.select.checked = select.checked

				this.helpScreenShowing = true
			}, 0)
		},
		/**
		 * To close the help screen
		 * @function
		 * @returns {undefined}
		 */
		closeHelpScreen () {
			this.helpScreenShowing = false
		}
	},
	components: {
		DeferModal,
		InfoPopup
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@media (max-width: 500px) {
	.summary-table-row-wrap{
		flex-direction: column;
	}
}

.summary-table-row-wrap{
	display: flex;
	width: 100%;
}
@media (max-width: 500px) {
	.summary-table-row-wrap > .summary-table-cell:last-child{
		width: 100%;
		padding-left: 30px;
		text-align: left;
	}
  .summary-table-row-wrap > .summary-table-cell:first-child{
    display: flex;
    flex-wrap: nowrap;
  }
}
@media (min-width: 500px) {
	.summary-table-row-wrap > .summary-table-cell:last-child{
		flex-grow: 1;
		text-align: left;
	}
  .summary-table-row-wrap > .summary-table-cell:first-child{
    width:50%;
    text-align: left;
    display: flex;
  }
}
.bold{
	font-weight: bold;
}
.newRecAst{
	font-size: 12px;
	text-align: left;
	padding: 3px 10px;
	font-weight: bold;
}
.accordion-open .accordion-status {
	float: right;
	margin-top: 8px;
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 6px solid #fff;
}
.accordion-closed .accordion-status {
	float: right;
	margin-top: 8px;
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-bottom: 6px solid #fff;
}
.service-checkbox {
	display: inline-block;
	position: relative;
	height: 15px;
	width: 15px;
	min-width: 15px;
	vertical-align: middle;
	margin-left: 5px;
}
.service-checkbox input {
	visibility: hidden;
	position: absolute;
}
.service-checkbox label {
	display: block;
	background: #fff;
	width: 100%;
	height: 100%;
	background-size: 15px 15px;
}
.service-checkbox input[type=checkbox]:checked~label {
	background-image: url('../assets/images/checkbox-checked.png');
}
.help-screen-block.help-screen-height {
	padding-left: 28px;
	text-align: right;
	padding-right: 10px;
}
.help-screen-block.help-screen-selected {
	padding-left: 5px;
}
.french-width .help-screen-block.help-screen-selected {
	padding-left: 25px;
}
.help-screen-block.help-screen-not-selected {
	padding-left: 16px;
}
.select-block {
	padding-right: 10px;
	padding-top: 5px;
	display: flex;
	justify-content: flex-end;
}
.select-block span {
	margin-right: 3px;
}
.help-screen-select-all.french-width {
	width: 130px;
}
.help-screen-select-all.spanish {
	width: 135px;
}
.fit-to-content {
	/* width: 1%; */
	/* white-space: nowrap; */
}
.service-name{
  word-wrap: normal;
  hyphens: auto;
}
.flex {
	display:flex;
}
.justify-center {
	justify-content:flex-end;
}
.align-center {
	align-items:center;
}
</style>
