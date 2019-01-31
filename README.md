# eComm

## To-do

PROJECT: https://bitbucket.org/account/user/unoecomm/projects/ECOMM
REPOS:
    frontend/
        ecomm/
            pitapit/
                current/
                next/
                    menu/manager


-2. price_includes_tax' => '0,1',
'tax => numeric

we need to add these 2 for locations, we will start with pitapit

-1. ```add new key in promocode as description , this will be free text```
we start this with freshii

0. Below are the tabs which need to have delete button with it:-

1) in loyalty > rewards >  rewards tier >  no options to  delete created rewards tiers & rewards items too 
2) in stores manager > store groups >  no options to  delete created store group 
3) in menu manger > tags > no options to remove created tags 
4) in menu manger > portions > no options to remove created portion
5) in menu manger > options > no options to remove created options & option items
6) in localization > languages > no options to remove created languages
7)Printers<  No option to delete printers  

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

4. Payment methods
https://www.getpostman.com/collections/b42351df9e36560f8261

5. Trello eComm next-up

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
