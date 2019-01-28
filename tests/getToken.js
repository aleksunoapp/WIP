/* eslint-disable */

// paste in browser console

(function ({
    additional = false, // include isHighlighted services (route: additional-services)
    unselected = true // include unselected services (route: wait-services)
}) {
    const payload = {
        "repairOrderId": "0",
        "tag": null,
        "customer": {
            "customerId": "995",
            "title": null,
            "firstName": "Gary",
            "lastName": "Kalk",
            "authenticationAnswer": "gary",
            "culture": "en-CA",
            "phone": "14169061031",
            "notificationType": 0,
            "email": null,
            "isBusiness": true,
            "name": "Gary Kalk"
        },
        "advisor": {
            "advisorUserId": "346739",
            "advisorDmsId": null,
            "advisorName": "JOHN WILLIAMS",
            "advisorImageUrl": "http://unoapp.com/dfx-mpi/v1/images/guy.png",
            "advisorEmail": null
        },
        "dealer": {
            "dealerId": "8004",
            "name": "Nissan of Anytown USA",
            "logoUrl": "",
            "phone": "7709988686",
            "email": "service@regalauto.com",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nissan-logo.png",
            "bottomImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nissan-car.png",
            "marketingImageUrl": "",
            "disclaimer": "The information contained on this Website (the \"Service\") is for general information purposes only.Dealer - Fx assumes no responsibility for errors or omissions in the contents on the Service.",
            "address": "123 Demo Street",
            "smsPhone": "12242035286",
            "salesTaxRate": 6.99,
            "salesTaxApplyToParts": true,
            "salesTaxApplyToLabor": false,
            "shopSupplyChargeIsPercentage": true,
            "shopSupplyChargeValue": 4.3,
            "shopSupplyChargeMin": 2.5,
            "shopSupplyChargeMax": 75,
            "shopSupplyChargeApplyToParts": true,
            "shopSupplyChargeApplyToLabor": true,
            "shopSupplyChargeTaxable": true,
            "mainManufacturersId": null,
            "dealerTimeZoneName": null
        },
        "serviceCategory": [
            {
                "serviceCategoryId": "1",
                "name": "SAFETY CONCERNS",
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "SAFETY CONCERNS"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-SAFETY CONCERNS"
                    }
                ],
                "serviceCategoryType": "SAFETY",
                "iconUrl": "http://www.unoapp.com/dfx-mpi/v1/images/fail-white.png",
                "sortOrder": 1,
                "defaultExpended": true,
                "isPreApproved": false,
                "showOnSummary": true,
                "showOnInspection": true
            },
            {
                "serviceCategoryId": "2",
                "name": "ITEMS REQUIRING ATTENTION",
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "ITEMS REQUIRING ATTENTION"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-ITEMS REQUIRING ATTENTION"
                    }
                ],
                "serviceCategoryType": "ATTN",
                "iconUrl": "http://www.unoapp.com/dfx-mpi/v1/images/warning-white.png",
                "sortOrder": 2,
                "defaultExpended": true,
                "isPreApproved": false,
                "showOnSummary": true,
                "showOnInspection": true
            },
            {
                "serviceCategoryId": "3",
                "name": "ITEMS NOT REQUIRING ANY ACTION",
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "ITEMS NOT REQUIRING ANY ACTION"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-ITEMS NOT REQUIRING ANY ACTION"
                    }
                ],
                "serviceCategoryType": "PASS",
                "iconUrl": "http://unoapp.com/dfx-mpi/v1/images/pass-white.png",
                "sortOrder": 3,
                "defaultExpended": false,
                "isPreApproved": false,
                "showOnSummary": false,
                "showOnInspection": true
            },
            {
                "serviceCategoryId": "4",
                "name": "PREVIOUSLY APPROVED SERVICES",
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "PREVIOUSLY APPROVED SERVICES"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-PREVIOUSLY APPROVED SERVICES"
                    }
                ],
                "serviceCategoryType": "PRE",
                "iconUrl": "",
                "sortOrder": 99,
                "defaultExpended": true,
                "isPreApproved": true,
                "showOnSummary": true,
                "showOnInspection": false
            },
            {
                "serviceCategoryId": "5",
                "name": "CUSTOMER CONCERNS",
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "CUSTOMER CONCERNS"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-CUSTOMER CONCERNS"
                    }
                ],
                "serviceCategoryType": "CC",
                "iconUrl": "https://test2dynamicmpibridge.dealer-fx.com/Content/images/ServiceCategory/Guest_Concerns_Greybard.png",
                "sortOrder": 4,
                "defaultExpended": true,
                "isPreApproved": false,
                "showOnSummary": true,
                "showOnInspection": false
            }
        ],
        "inspectionPdfUrl": [
            {
                "culture": "en-CA",
                "name": "http://test2newommcache2.dealer-fx.com/41/8002/en-US/1420174_1N4AL2APXAN402749_201707241227060264.PDF"
            },
            {
                "culture": "fr-CA",
                "name": "http://test2newommcache2.dealer-fx.com/41/8004/fr-CA/1961512_KNMAT2MV6HP531123_201802021324370512.PDF"
            }
        ],
        "vehicle": {
            "vin": null,
            "description": "2010 ALTIMA",
            "imageUrl": "http://unoapp.com/dfx-mpi/v1/images/nissan-car.png",
            "vehicleId": 0
        },
        "themeId": "NISSAN",
        "promise": "2019-01-30T18:00:00+00:00",
        "responseBy": "2019-01-30T16:00:00+00:00",
        "statusId": 5,
        "declineReasons": [
            {
                "id": 1,
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "I don't have time"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-I don't have time"
                    }
                ],
                "name": "I don't have time"
            },
            {
                "id": 2,
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "I am concerned with the cost"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-I am concerned with the cost"
                    }
                ],
                "name": "I am concerned with the cost"
            },
            {
                "id": 3,
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "I cannot afford this item"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-I cannot afford this item"
                    }
                ],
                "name": "I cannot afford this item"
            },
            {
                "id": 4,
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "I am considering changing my vehicle"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-I am considering changing my vehicle"
                    }
                ],
                "name": "I am considering changing my vehicle"
            },
            {
                "id": 5,
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "I need alternate transportation"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-I need alternate transportation"
                    }
                ],
                "name": "I need alternate transportation"
            },
            {
                "id": 0,
                "nameTranslations": [
                    {
                        "culture": "en-CA",
                        "name": "No reason"
                    },
                    {
                        "culture": "fr-CA",
                        "name": "FR-No reason"
                    }
                ],
                "name": "No reason"
            }
        ],
        "supportedLanguages": [
            {
                "culture": "en-CA",
                "name": "English"
            },
            {
                "culture": "fr-CA",
                "name": "French"
            }
        ],
        "customerConcernsLabel": [
            {
                "culture": "en-CA",
                "name": "Customer Concerns"
            },
            {
                "culture": "fr-CA",
                "name": "Préoccupations du client"
            }
        ],
        "customerCommentsLabel": [
            {
                "culture": "en-CA",
                "name": "Customer Comments"
            },
            {
                "culture": "fr-CA",
                "name": "Commentaires du client"
            }
        ]
    }

    const base = [
        {
            "serviceId": "11",
            "itemId": "1",
            "nameTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Brake Pad Replacement"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Brake Pad Replacement"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Brake Pad Replacement"
                }
            ],
            "name": "Brake Pad Replacement",
            "parentServiceId": "",
            "serviceCategoryId": "1",
            "laborPrice": 400,
            "partsPrice": 100,
            "taxAndFee": 50,
            "comment": "Comment text goes here",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nna.jpg",
            "marketingText": "",
            "marketingImageUrl": "",
            "technicienId": null,
            "mediaId": null,
            "isSelected": true,
            "isHighlighted": false,
            "declinedReasonId": 1,
            "iconUrl": null,
            "serviceAdvisorComments": [
                {
                    "culture": "en-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "fr-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "es-MX",
                    "name": "Service Advisor comments go here."
                }
            ],
            "laborMatrixPayment": "None",
            "laborMatrixPaymentTranslations": null
        },
        {
            "serviceId": "12",
            "itemId": "2",
            "nameTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Brake Pad"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Brake Pad"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Brake Pad"
                }
            ],
            "name": "Brake Pad",
            "parentServiceId": "",
            "serviceCategoryId": "1",
            "laborPrice": 0,
            "partsPrice": 0,
            "taxAndFee": 0,
            "comment": "Comment text goes here",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nna.jpg",
            "marketingText": "",
            "marketingImageUrl": "",
            "technicienId": null,
            "mediaId": null,
            "isSelected": true,
            "isHighlighted": false,
            "declinedReasonId": 1,
            "iconUrl": null,
            "serviceAdvisorComments": [
                {
                    "culture": "en-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "fr-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "es-MX",
                    "name": "Service Advisor comments go here."
                }
            ],
            "laborMatrixPayment": "Warranty",
            "laborMatrixPaymentTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Covered by warranty"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Covered by warranty"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Covered by warranty"
                }
            ]
        },
        {
            "serviceId": "13",
            "itemId": "3",
            "nameTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Air Conditioning Service"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Air Conditioning Service"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Air Conditioning Service"
                }
            ],
            "name": "Air Conditioning Service",
            "parentServiceId": "",
            "serviceCategoryId": "1",
            "laborPrice": 100,
            "partsPrice": 0,
            "taxAndFee": 15,
            "comment": "Comment text goes here",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nna.jpg",
            "marketingText": "",
            "marketingImageUrl": "",
            "technicienId": null,
            "mediaId": null,
            "isSelected": false,
            "isHighlighted": false,
            "declinedReasonId": 2,
            "iconUrl": null,
            "serviceAdvisorComments": [
                {
                    "culture": "en-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "fr-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "es-MX",
                    "name": "Service Advisor comments go here."
                }
            ],
            "laborMatrixPayment": "Warranty",
            "laborMatrixPaymentTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Covered by warranty"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Covered by warranty"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Covered by warranty"
                }
            ]
        },
        {
            "serviceId": "14",
            "itemId": "4",
            "nameTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Replace in-cabin microfilter"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Replace in-cabin microfilter"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Replace in-cabin microfilter"
                }
            ],
            "name": "Replace in-cabin microfilter",
            "parentServiceId": "13",
            "serviceCategoryId": "1",
            "laborPrice": 0,
            "partsPrice": 40,
            "taxAndFee": 20,
            "comment": "Comment text goes here",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nna.jpg",
            "marketingText": "",
            "marketingImageUrl": "",
            "technicienId": null,
            "mediaId": null,
            "isSelected": false,
            "isHighlighted": false,
            "declinedReasonId": 3,
            "iconUrl": null,
            "serviceAdvisorComments": [
                {
                    "culture": "en-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "fr-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "es-MX",
                    "name": "Service Advisor comments go here."
                }
            ],
            "laborMatrixPayment": "Free",
            "laborMatrixPaymentTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Free"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Free"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Free"
                }
            ]
        },
        {
            "serviceId": "15",
            "itemId": "5",
            "nameTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Rear mirror"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Rear mirror"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Rear mirror"
                }
            ],
            "name": "Rear mirror",
            "parentServiceId": "",
            "serviceCategoryId": "1",
            "laborPrice": 0,
            "partsPrice": 40,
            "taxAndFee": 20,
            "comment": "Comment text goes here",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nna.jpg",
            "marketingText": "",
            "marketingImageUrl": "",
            "technicienId": null,
            "mediaId": null,
            "isSelected": false,
            "isHighlighted": false,
            "declinedReasonId": 3,
            "iconUrl": null,
            "serviceAdvisorComments": [
                {
                    "culture": "en-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "fr-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "es-MX",
                    "name": "Service Advisor comments go here."
                }
            ],
            "laborMatrixPayment": "Free",
            "laborMatrixPaymentTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Free"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Free"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Free"
                }
            ]
        },
        {
            "serviceId": "16",
            "itemId": "6",
            "nameTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Rear mirror replacement"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Rear mirror replacement"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Rear mirror replacement"
                }
            ],
            "name": "Rear mirror replacement",
            "parentServiceId": "16",
            "serviceCategoryId": "1",
            "laborPrice": 0,
            "partsPrice": 40,
            "taxAndFee": 20,
            "comment": "Comment text goes here",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nna.jpg",
            "marketingText": "",
            "marketingImageUrl": "",
            "technicienId": null,
            "mediaId": null,
            "isSelected": false,
            "isHighlighted": false,
            "declinedReasonId": 3,
            "iconUrl": null,
            "serviceAdvisorComments": [
                {
                    "culture": "en-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "fr-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "es-MX",
                    "name": "Service Advisor comments go here."
                }
            ],
            "laborMatrixPayment": "Free",
            "laborMatrixPaymentTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Free"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Free"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Free"
                }
            ]
        },
        {
            "serviceId": "17",
            "itemId": "7",
            "nameTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Rear mirror"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Rear mirror"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Rear mirror"
                }
            ],
            "name": "Rear mirror",
            "parentServiceId": "",
            "serviceCategoryId": "1",
            "laborPrice": 0,
            "partsPrice": 0,
            "taxAndFee": 0,
            "comment": "Comment text goes here",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nna.jpg",
            "marketingText": "",
            "marketingImageUrl": "",
            "technicienId": null,
            "mediaId": null,
            "isSelected": false,
            "isHighlighted": false,
            "declinedReasonId": 3,
            "iconUrl": null,
            "serviceAdvisorComments": [
                {
                    "culture": "en-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "fr-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "es-MX",
                    "name": "Service Advisor comments go here."
                }
            ],
            "laborMatrixPayment": "Free",
            "laborMatrixPaymentTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Free"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Free"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Free"
                }
            ]
        },
        {
            "serviceId": "18",
            "itemId": "8",
            "nameTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Rear mirror replacement"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Rear mirror replacement"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Rear mirror replacement"
                }
            ],
            "name": "Rear mirror replacement",
            "parentServiceId": "16",
            "serviceCategoryId": "1",
            "laborPrice": 0,
            "partsPrice": 0,
            "taxAndFee": 0,
            "comment": "Comment text goes here",
            "topImageUrl": "http://unoapp.com/dfx-mpi/v1/images/nna.jpg",
            "marketingText": "",
            "marketingImageUrl": "",
            "technicienId": null,
            "mediaId": null,
            "isSelected": false,
            "isHighlighted": false,
            "declinedReasonId": 3,
            "iconUrl": null,
            "serviceAdvisorComments": [
                {
                    "culture": "en-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "fr-CA",
                    "name": "Service Advisor comments go here."
                },
                {
                    "culture": "es-MX",
                    "name": "Service Advisor comments go here."
                }
            ],
            "laborMatrixPayment": "Free",
            "laborMatrixPaymentTranslations": [
                {
                    "culture": "en-CA",
                    "name": "Free"
                },
                {
                    "culture": "fr-CA",
                    "name": "FR-Free"
                },
                {
                    "culture": "es-MX",
                    "name": "ES-Free"
                }
            ]
        }
    ]

    const generate = function () {
        const categoryIds = ['1', '2', '3', '4', '6', '7', '8', '9']
        const length = base.length
        const services = []
    
        for (const categoryId of categoryIds) {
            for (let i = 0; i < length; i++) {
                const service = base[i]
                services.push({
                    ...service,
                    serviceId: `${categoryId}${i}`,
                    itemId: `${i}`,
                    serviceCategoryId: `${categoryId}`,
                    isHighlighted: additional ? (Math.random() < .5) : service.isHighlighted,
                    parentServiceId: service.parentServiceId ? `${categoryId}${i-1}` : '',
                    isSelected: unselected ? service.isSelected : true
                })
            }
        }

        const output = {
            ...payload,
            services
        }

        return JSON.stringify(output, null, 2)
    }

    fetch('https://test2dmpiapi.dealer-fx.com/test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: generate()
    })
        .then((r) => r.json())
        .then((r) => {
            console.log(`%c${r.clientId}`, 'font-size: x-large;')
        })
        .catch(error => console.log({error}))
}({}))