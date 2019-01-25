# DMPI

## Flows:
- Original Flow: https://dmpi2.netlify.com/#/login/3d487dae-3bf6-4871-8857-327445bc7168
- Original Flow, with no new recommendations: https://dmpi2.netlify.com/#/login/545ee449-c47d-4700-9842-fe9f68a8a268
- Additional Flow, with no previously unselected services: https://dmpi2.netlify.com/#/login/fb27e730-fb55-44f1-8791-d9f41b960c95
- Additional Flow, with some previously unselected services: https://dmpi2.netlify.com/#/login/b2c8de2c-0de5-406b-ab9b-d471577fb223


## To-do
- glance header
- help: scroll to top, uncollapse 1st, skip pages 1-2 if no recommendations, check X on each page
- unhide headers in desktop
- break long strings
- a11y: service, reason, drawer, help, error
- multiple images
- scroll past Confirm button 2h

## Project notes

### Resources
[Designs (Dropbox)](https://www.dropbox.com/sh/dy34i2m7is072bx/AACLWvABQESnNiwCz1pkf0CFa?dl=0)

### Data
Recommended services, grouped into categories by urgency and approval status. `service`s with a `parentServiceId` are treated as `subService`s of their parent and displayed instead of the parent.
Category `id`s:

|`id`|`serviceCategoryType`||
|---|---|---|
|1|SAFETY|fail/safety-related|
|2|ATTN|warning|
|3|PASS|pass, no price|
|4|PRE|approved|
|5|CC|concern, used only for `name`, parent of categories 6-9|
|6|n/a|child of `id: 5`, critical/safety-related?|
|7|n/a|child of `id: 5`, moderate?|
|8|n/a|child of `id: 5`, optional?|
|9|n/a|child of `id: 5`, optional?|

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
