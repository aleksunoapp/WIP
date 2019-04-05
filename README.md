# DMPI

## Project notes

### Resources
* [Designs (Dropbox)](https://www.dropbox.com/sh/dy34i2m7is072bx/AACLWvABQESnNiwCz1pkf0CFa?dl=0)
* [UNOapp repo](https://bitbucket.org/unoapp/dmpi2/src/develop/)
  * HTTP: https://bitbucket.org/unoapp/dmpi2/src/develop/
  * SSH: git@bitbucket.org:unoapp/dmpi2.git
* [DFX repo](https://dealer-fx.visualstudio.com/Digital%20MPI/_git/CustomerSite)
  * HTTP: https://dealer-fx.visualstudio.com/Digital%20MPI/_git/CustomerSite
  * SSH: dealer-fx@vs-ssh.visualstudio.com:v3/dealer-fx/Digital%20MPI/CustomerSite

### Data

#### Use
A customer checks in a vehicle for service at a car dealership. At check in, a service technician / advisor recommends a number of services to perform on the vehicle. Later, the vehicle is inspected and a list of further recommendations is created. A link to this app is sent to the customer to review and approve or decline / defer the recommended services. Following the first link, if more services are indicated, a second link to this app is sent to the customer where they can review services added or updated by the dealership, as well as services they declined in the first link.

#### Categories
There are 9 categories. Categories 6-9 are treated as aliases and children of category 5, for values like category name and whether the category is displayed or expanded. Most category names are found in the `name` field of the category, except for category 5, whose name is sent separately as a field called `customerConcernsLabel`.

Categories:
| `id` | `serviceCategoryType` |notes                                                              |
|:----:|-----------------------|-------------------------------------------------------------------|
| 1    | SAFETY                | fail/safety-related                                               |
| 2    | ATTN                  | warning                                                           |
| 3    | PASS                  | pass, no price                                                    |
| 4    | PRE                   | approved                                                          |
| 5    | CC                    | concern, container category for categories 6-9                    |
| 6    | n/a                   | child of `id: 5`, customer's concern of high severity, red        |
| 7    | n/a                   | child of `id: 5`, customer's concern of moderate severity, yellow |
| 8    | n/a                   | child of `id: 5`, customer's concern that isn't an issue, green   |
| 9    | n/a                   | child of `id: 5`, customer's concern that isn't an issue, grey    |

#### Services
A service belongs to one category. A service may be its own thing, or it may be a parent of other services. There may be duplicate parent services and they should be deleted.

If a service is a parent, it's generally not shown and its children are shown instead. A Guest Concern parent's name will still be shown instead of its children's names, and the parent's comment will be shown in the popup. Needs confirming: Guest Concerns in categories 6-9 are always children of a category 5 parent.

##### Comments
Comments are found in the `serviceAdvisorComments` field, except for Guest Concerns, where comments are in `comment` field. Guest Concerns also have advisor comments, found in their (own) `serviceAdvisorComments` field.

##### Checkboxes
Checkboxes are not shown for services in category type PRE, or for childless Guest Concerns, or for any Guest Concerns in category 8.

##### Prices
Price is found in the `price` field. If it's 0, 'Free' is shown instead, except in Guest Concerns where the zero amount is shown. Price is not shown wherever the checkbox isn't shown. A service may be covered by warranty or another payment plan. This is shown in the `laborMatrixPayment` field. For selected `laborMatrixPayment` values, the list price is taken from `laborMatrixPaymentTranslations`. There are also explanations based on `laborMatrixPayment`, shown in the popup.

##### Images
Images are not shown for services in category type PRE. They are not shown for Customer Concerns in the list view but they are shown in popups.

##### Popups
Services in category type PRE are not shown in a popup. Accept and Not Today buttons are not shown for services in category type PRE and in categories 8 and 9, as these do not require action from customer.

### Flows
- Empty:
  * login
  * summary, without signature or T&Cs checkbox
  * thanks
- Original (when no services have the `isHighlighted` flag): 
  * login
  * at-a-glance
  * all services
  * summary, signature
  * thanks
- Additional (when any service has the `isHighlighted` flag):
  * login
  * additional welcome screen
  * updated services, with first card open by default and cards not closing on approve / decline
  * wait screen - only if any of the remaining services are unselected
  * remaining unselected services, if any, with first card open by default and cards not closing on approve / decline
  * summary, signature
  * thanks

### CSS
Global CSS in App.vue, including variables and transitions.
SCSS, scoped, with nesting that reflects the HTML structure.
All margins and padding in rem, set on #DMPI (Vue's mount point).
Scroll frozen down to `.container`s.
Flexbox, getComputedPropertyStyle, a canvas with a signature_pad and hammerjs attached to it.

#### z-index
- service 1
- reason 2
- drawer 3
- menu-button 4
- help 5
- error 6

### Errors
Caught in App.vue, displayed in overlay.
Form validations on login and summary pages.

### vue-i18n
Locales: `en-CA`, `en-US`, `fr-CA`, `es-mx`.
`$t()` uses `messages`, `$d()` uses `dateTimeFormats`

### Mixins
Price logic conatined in `getServiceDisplayPrice()` imported as a mixin.

### Vuex
Actions are responsible for making http calls. Getters act as global computed properties for different combinations of services.
