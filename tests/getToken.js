/* eslint-disable */

// paste in browser console

(function ({
  additional = true, // include Additional services (isHighlighted = true, route = additional-services)
  unselected = true, // include unselected services (isSelected = false, route = wait-services)
  empty = false // zero services
}) {

  const getImage = (placeholder) => {
    const x = Math.round(Math.random() * (600 - 200) + 200)
    const y = Math.round(Math.random() * (600 - 200) + 200)
    let url = `https://via.placeholder.com/${x}x${y}.png`
    if (typeof placeholder === 'string') {
      url = url + `?text=${placeholder}`
    }
    return encodeURI(url)
  }
  const getIcon = (categoryId) => {
    let iconUrl = null
    const colors = {
      '6': 'red',
      '7': 'yellow',
      '8': 'green',
      '9': 'grey'
    }
    if (categoryId > '5') {
      iconUrl = `http://dfx-dmpi2.dev.unoapp.io/hosted/${colors[categoryId]}-dot.png`
    }
    return iconUrl
  }


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
      "isBusiness": false,
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
        "name": "Safety Concerns",
        "nameTranslations": [
          {
            "culture": "en-US",
            "name": "Safety Concerns"
          },
          {
            "culture": "en-CA",
            "name": "Safety Concerns"
          },
          {
            "culture": "fr-CA",
            "name": "FR-Safety Concerns"
          },
          {
            "culture": "es-mx",
            "name": "ES-Safety Concerns"
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
        "name": "Items Requiring Attention",
        "nameTranslations": [
          {
            "culture": "en-US",
            "name": "Items Requiring Attention"
          },
          {
            "culture": "en-CA",
            "name": "Items Requiring Attention"
          },
          {
            "culture": "fr-CA",
            "name": "FR-Items Requiring Attention"
          },
          {
            "culture": "es-mx",
            "name": "ES-Items Requiring Attention"
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
        "name": "Items Not Requiring Any Action",
        "nameTranslations": [
          {
            "culture": "en-US",
            "name": "Items Not Requiring Any Action"
          },
          {
            "culture": "en-CA",
            "name": "Items Not Requiring Any Action"
          },
          {
            "culture": "fr-CA",
            "name": "FR-Items Not Requiring Any Action"
          },
          {
            "culture": "es-mx",
            "name": "ES-Items Not Requiring Any Action"
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
        "name": "Previously Approved Services",
        "nameTranslations": [
          {
            "culture": "en-US",
            "name": "Previously Approved Services"
          },
          {
            "culture": "en-CA",
            "name": "Previously Approved Services"
          },
          {
            "culture": "fr-CA",
            "name": "FR-Previously Approved Services"
          },
          {
            "culture": "es-mx",
            "name": "ES-Previously Approved Services"
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
        "name": "Customer Concerns",
        "nameTranslations": [
          {
            "culture": "en-US",
            "name": "Customer Concerns"
          },
          {
            "culture": "en-CA",
            "name": "Customer Concerns"
          },
          {
            "culture": "fr-CA",
            "name": "FR-Customer Concerns"
          },
          {
            "culture": "es-mx",
            "name": "ES-Customer Concerns"
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
        "culture": "en-US",
        "name": "http://test2newommcache2.dealer-fx.com/41/8002/en-US/1420174_1N4AL2APXAN402749_201707241227060264.PDF"
      },
      {
        "culture": "fr-CA",
        "name": "http://test2newommcache2.dealer-fx.com/41/8004/fr-CA/1961512_KNMAT2MV6HP531123_201802021324370512.PDF"
      },
      {
        "culture": "es-MX",
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
    "promise": "2019-05-30T23:30:00+00:00",
    "responseBy": "2019-03-30T23:00:00+00:00",
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
            "culture": "en-US",
            "name": "I don't have time"
          },
          {
            "culture": "fr-CA",
            "name": "FR-I don't have time"
          },
          {
            "culture": "es-mx",
            "name": "ES-I don't have time"
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
            "culture": "en-US",
            "name": "I am concerned with the cost"
          },
          {
            "culture": "fr-CA",
            "name": "FR-I am concerned with the cost"
          },
          {
            "culture": "es-mx",
            "name": "ES-I am concerned with the cost"
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
            "culture": "en-US",
            "name": "I cannot afford this item"
          },
          {
            "culture": "fr-CA",
            "name": "FR-I cannot afford this item"
          },
          {
            "culture": "es-mx",
            "name": "ES-I cannot afford this item"
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
            "culture": "en-US",
            "name": "I am considering changing my vehicle"
          },
          {
            "culture": "fr-CA",
            "name": "FR-I am considering changing my vehicle"
          },
          {
            "culture": "es-mx",
            "name": "ES-I am considering changing my vehicle"
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
            "culture": "en-US",
            "name": "I need alternate transportation"
          },
          {
            "culture": "fr-CA",
            "name": "FR-I need alternate transportation"
          },
          {
            "culture": "es-mx",
            "name": "ES-I need alternate transportation"
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
            "culture": "en-US",
            "name": "No reason"
          },
          {
            "culture": "fr-CA",
            "name": "FR-No reason"
          },
          {
            "culture": "es-mx",
            "name": "ES-No reason"
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
      },
      {
        "culture": "es-mx",
        "name": "Spanish"
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
      },
      {
        "culture": "es-mx",
        "name": "ES-Customer Concerns"
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
      },
      {
        "culture": "es-mx",
        "name": "ES-Customer Comments"
      }
    ]
  }

  const getServiceName = (service) => {
    const idMap = {
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '5',
      '7': '5',
      '8': '5',
      '9': '5'
    }
    const category = payload.serviceCategory.find(
      category => category.serviceCategoryId === idMap[service.serviceCategoryId]
      )
    const name = `${category.name} Service ${service.serviceId}`
    const nameTranslations = payload.supportedLanguages.map(language => ({
      culture: language.culture,
      name: `${name} (${language.culture})`
    }))

    return {
      name,
      nameTranslations
    }
  }

  const base = [
    {
      "serviceId": "11",
      "itemId": "1",
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
    const length = base.length
    const services = []
    let categoryIds = ['1', '2', '3', '4', '6', '7', '8', '9']

    if (empty) {
      categoryIds = categoryIds.filter(id => id === '4')
    }
    for (const categoryId of categoryIds) {
      for (let i = 0; i < length; i++) {
        let service = base[i]
        service = {
          ...service,
          serviceId: `${categoryId}${i}`,
          itemId: `${i}`,
          serviceCategoryId: `${categoryId}`,
          isHighlighted: (additional && !empty) ? (Math.random() < .5) : service.isHighlighted,
          parentServiceId: service.parentServiceId ? `${categoryId}${i - 1}` : '',
          isSelected: unselected ? service.isSelected : true
        }
        const { name, nameTranslations } = getServiceName(service)
        const topImageUrl = getImage(name)
        const iconUrl = getIcon(categoryId)
        service = {
          ...service,
          name,
          nameTranslations,
          topImageUrl,
          iconUrl
        }
        services.push(service)
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
    .catch(error => console.log({ error }))
}({}))