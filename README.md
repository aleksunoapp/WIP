# DMPI

## To-do
- a11y: service, reason, drawer, help, error

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
Scroll frozen down to `.container`s
Flexbox, getComputedPropertyStyle, basic canvas.

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
