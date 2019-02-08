# DMPI

## Project notes

### Resources
[Designs (Dropbox)](https://www.dropbox.com/sh/dy34i2m7is072bx/AACLWvABQESnNiwCz1pkf0CFa?dl=0)

### Data


#### Categories
There are 5 categories. There are 9, but 6-9 are treated as aliases of 5, for values like category name and whether the category is displayed or expanded. Most category names are found in the `name` field of the category, except for category 5, whose name is sent separately as a field called `customerConcernsLabel`.

Categories:
| `id` | `serviceCategoryType` |notes                                           |
|:----:|-----------------------|------------------------------------------------|
| 1    | SAFETY                | fail/safety-related                            |
| 2    | ATTN                  | warning                                        |
| 3    | PASS                  | pass, no price                                 |
| 4    | PRE                   | approved                                       |
| 5    | CC                    | concern, container category for categories 6-9 |
| 6    | n/a                   | child of `id: 5`, critical/safety-related?     |
| 7    | n/a                   | child of `id: 5`, moderate?                    |
| 8    | n/a                   | child of `id: 5`, optional?                    |
| 9    | n/a                   | child of `id: 5`, optional?                    |

#### Services
A service belongs to one category. A service may be its own thing, or it may be a parent of other services. There may be duplicate parent services and they should be deleted.

If a service is a parent, it's generally not shown and its children are shown instead. A Guest Concern parent's name will still be shown instead of its children's names, and the parent's comment will be shown in the popup.

##### Comments
Comments are found in the `serviceAdvisorComments` field, except for Guest Concerns, where comments are in `comment` field. Guest Concerns also have advisor comments, found in their (own) `serviceAdvisorComments` field.

##### Checkboxes
Checkboxes are not shown for services in category type PRE, or for childless Guest Concerns, or for any Guest Concerns in category 8.

##### Prices
Price is found in the `price` field. If it's 0, 'Free' is shown instead, except in Guest Concerns where the zero amount is shown. Price is not shown wherever the checkbox isn't shown. A service may be covered by warranty or another payment plan. This is shown in the `laborMatrixPayment` field. For selected `laborMatrixPayment` values, the list price is taken from `laborMatrixPaymentTranslations`. There are also explanations based on `laborMatrixPayment`, shown in the popup.

##### Images
Images are not shown for services in category type PRE. 

##### Popups
Services in category type PRE are not shown in a popup.

### Flows
- Empty:
  * login
  * summary
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
  * updated services
  * wait screen - only if any of the remaining services are unselected
  * remaining unselected services, if any
    QUESTION: Should we show selected services here too?
  * summary, signature
    QUESTION: If selected services are hidden on the previous screen, should their prices be inlcluded in the total? Should they be sent back to the server as approved?
  * thanks

### CSS
SCSS, scoped and nested the same way as HTML, or CSS.
Global CSS in App.vue, including variables and transitions.
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
