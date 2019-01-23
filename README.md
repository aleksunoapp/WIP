# eComm

## To-do

1. Update user info

2. Assign a tag to Menu Items or to Modifier Items
POST: api/app/tags/addTagToItems {"item_sku": ["CP3", "002"], "tag_id": 28}
POST: api/app/tags/addTagToModifierItems {"modifier_item_sku": ["TMI7"], "tag_id": 28}
"menu_manager tags add modifier items by sku": false,
"menu_manager tags add modifier items by sku approve": false,
"menu_manager tags add items by sku": false,
"menu_manager tags add items by sku approve": false,

3. Location discounts
https://www.getpostman.com/collections/3f5c12447c2194af07a2

4. Trello eComm next-up

## Documentation

Every module should include the following code at the top of the file:

``` bash
/** @module My Component */
```

Every variable should be defined with the following code:

``` bash
/** What does this variable do. */
```

Every function should be defined with the following code:

``` bash
/**
 * What is this function.
 * @function
 * @param {param1_datatype} param1 - What this parameter is.
 * @param {param1_datatype} param1 - What this parameter is.
 * @returns What it returns.
 */
```
