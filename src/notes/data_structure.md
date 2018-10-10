current:
```
services: [
  {
    id: '1',
    category: `5 | 6 | 7 | 8 | 9`,
    comment: 'Guest Concerns go here',
    parentServiceId: '',
    subservices: [
      {
        id: '2',
        parentServiceId: '1',
        category: `5 | 6 | 7 | 8 | 9`,
        comment: 'Service Advisor Comments go here'
      }
    ]
  }
]
```

new:
```
services: [
  {
    id: '1',
    category: `5 | 6 | 7 | 8 | 9`,
    serviceAdvisorComments: 'Guest Concerns go here',
    parentServiceId: '',
    subservices: [
      {
        id: '2',
        parentServiceId: '1',
        category: `5 | 6 | 7 | 8 | 9`,
        serviceAdvisorComments: 'Service Advisor Comments go here'
      }
    ]
  }
]
```