// - render only links to available routes in sidebar
// - put v-if on every list, create, edit, delete
// - save {permissions} after login call

export const role = {
	'create role': true,
	'update role': true,
	'delete role': true,
	'list role': true,
	'create permission': true,
	'update permission': true,
	'delete permission': true,
	'list permission': true,
	'list role\'s permissions': true,
	'assign permissions to role': true,
	'revoke permissions from role': true,
	'sync permissions for role': true,
	'list user\'s roles': true,
	'assign roles to user': true,
	'revoke roles from user': true,
	'sync roles for user': true,
	'list user\'s permissions': true,
	'assign permissions to user': true,
	'revoke permissions from user': true,
	'sync permissions for user': true,
	'search users with role & permission': true,
	'stores': {
		'stores info read': true,
		'stores info create': true,
		'stores info update': true,
		'stores info delete': true,
		'stores info approve': true,

		'stores meta read': true,
		'stores meta create': true,
		'stores meta update': true,
		'stores meta approve': true,

		'stores hours read': true,
		'stores hours create': true,
		'stores hours update': true,
		'stores hours approve': true,

		'stores holiday_hours read': true,
		'stores holiday_hours create': true,
		'stores holiday_hours update': true,
		'stores holiday_hours delete': true,
		'stores holiday_hours approve': true,

		'stores images read': true,
		'stores images create': true,
		'stores images update': true,
		'stores images delete': true,
		'stores images approve': true,

		'groups': {
			'stores groups read': true,
			'stores groups create': true,
			'stores groups update': true,
			'stores groups delete': true,
			'stores groups approve': true
		},
		'amenities': {
			'stores amenities read': true,
			'stores amenities create': true,
			'stores amenities update': true,
			'stores amenities delete': true,
			'stores amenities approve': true
		},
		'order_settings': {
			'stores order_settings read': true,
			'stores order_settings update': true,
			'stores order_settings delete': true,
			'stores order_settings approve': true
		}
	},
	'analytics': {
		'overview': {
			'analytics overview read': true,
			'analytics overview approve': true
		},
		'store': {
			'analytics store read': true,
			'analytics store approve': true
		},
		'item': {
			'analytics item read': true,
			'analytics item approve': true
		},
		'user': {
			'analytics user read': true,
			'analytics user approve': true
		}
	},
	'approvals': {
		'approvals read': true,
		'approvals create': true,
		'approvals update': true,
		'approvals delete': true,
		'approvals approve': true
	},
	'admin': {
		'brand_admins': {
			'admin brand_admins read': true,
			'admin brand_admins create': true,
			'admin brand_admins update': true,
			'admin brand_admins approve': true
		},
		'location_managers': {
			'admin location_managers read': true,
			'admin location_managers create': true,
			'admin location_managers update': true,
			'admin location_managers approve': true
		},
		'oma_users': {
			'admin oma_users read': true,
			'admin oma_users create': true,
			'admin oma_users update': true,
			'admin oma_users delete': true,
			'admin oma_users approve': true
		},
		'store_app_users': {
			'admin store_app_users read': true,
			'admin store_app_users create': true,
			'admin store_app_users update': true,
			'admin store_app_users approve': true
		}
	},
	'news_feed': {
		'news_feed read': true,
		'news_feed create': true,
		'news_feed update': true,
		'news_feed approve': true
	},
	'social_feed': {
		'social_feed read': true,
		'social_feed update': true,
		'social_feed approve': true
	},
	'tax': {
		'tax tax_classes': {
			'tax tax_classes read': true,
			'tax tax_classes create': true,
			'tax tax_classes update': true,
			'tax tax_classes delete': true,
			'tax tax_classes approve': true
		},
		'item_types': {
			'tax item_types read': true,
			'tax item_types create': true,
			'tax item_types update': true,
			'tax item_types delete': true,
			'tax item_types approve': true
		}
	},
	'menu_manager': {
		'menus': {
			'menu_manager menus read': true,
			'menu_manager menus create': true,
			'menu_manager menus update': true,
			'menu_manager menus delete': true,
			'menu_manager menus approve': true,
			'categories': {
				'menu_manager menus categories read': true,
				'menu_manager menus categories create': true,
				'menu_manager menus categories update': true,
				'menu_manager menus categories delete': true,
				'menu_manager menus categories approve': true,
				'subcategories': {
					'menu_manager menus categories subcategories read': true,
					'menu_manager menus categories subcategories create': true,
					'menu_manager menus categories subcategories update': true,
					'menu_manager menus categories subcategories delete': true,
					'menu_manager menus categories subcategories approve': true,
					'items': {
						'menu_manager menus categories subcategories items read': true,
						'menu_manager menus categories subcategories items create': true,
						'menu_manager menus categories subcategories items update': true,
						'menu_manager menus categories subcategories items delete': true,
						'menu_manager menus categories subcategories items approve': true
					}
				}
			}
		},
		'tiers': {
			'menu_manager tiers read': true,
			'menu_manager tiers create': true,
			'menu_manager tiers update': true,
			'menu_manager tiers approve': true
		},
		'modifiers': {
			'menu_manager modifiers read': true,
			'menu_manager modifiers create': true,
			'menu_manager modifiers update': true,
			'menu_manager modifiers delete': true,
			'menu_manager modifiers approve': true,
			'items': {
				'menu_manager modifiers items read': true,
				'menu_manager modifiers items create': true,
				'menu_manager modifiers items update': true,
				'menu_manager modifiers items delete': true,
				'menu_manager modifiers items approve': true
			}
		},
		'tags': {
			'menu_manager tags read': true,
			'menu_manager tags create': true,
			'menu_manager tags update': true,
			'menu_manager tags approve': true
		},
		'portions': {
			'menu_manager portions read': true,
			'menu_manager portions create': true,
			'menu_manager portions update': true,
			'menu_manager portions approve': true
		},
		'options': {
			'menu_manager options read': true,
			'menu_manager options create': true,
			'menu_manager options update': true,
			'menu_manager options approve': true,
			'items': {
				'menu_manager options items read': true,
				'menu_manager options items create': true,
				'menu_manager options items update': true,
				'menu_manager options items approve': true
			}
		},
		'attributes': {
			'menu_manager attributes read': true,
			'menu_manager attributes create': true,
			'menu_manager attributes update': true,
			'menu_manager attributes delete': true,
			'menu_manager attributes approve': true
		}
	},
	'printers': {
		'printers read': true,
		'printers create': true,
		'printers update': true,
		'printers approve': true
	},
	'user_manager': {
		'users': {
			'user_manager users read': true,
			'user_manager users approve': true
		},
		'user_groups': {
			'user_manager user_groups read': true,
			'user_manager user_groups create': true,
			'user_manager user_groups update': true,
			'user_manager user_groups delete': true,
			'user_manager user_groups approve': true
		},
		'attributes': {
			'user_manager attributes read': true,
			'user_manager attributes create': true,
			'user_manager attributes update': true,
			'user_manager attributes delete': true,
			'user_manager attributes approve': true
		}
	},
	'faq': {
		'store': {
			'faq store read': true,
			'faq store create': true,
			'faq store update': true,
			'faq store approve': true
		},
		'user': {
			'faq user read': true,
			'faq user create': true,
			'faq user update': true,
			'faq user approve': true
		}
	},
	'gallery': {
		'gallery read': true,
		'gallery create': true,
		'gallery approve': true
	},
	'loyalty': {
		'base_rule': {
			'loyalty base_rule read': true,
			'loyalty base_rule create': true,
			'loyalty base_rule update': true,
			'loyalty base_rule delete': true,
			'loyalty base_rule approve': true
		},
		'promotion_rules': {
			'loyalty promotion_rules read': true,
			'loyalty promotion_rules create': true,
			'loyalty promotion_rules update': true,
			'loyalty promotion_rules delete': true,
			'loyalty promotion_rules approve': true
		},
		'reward_tiers': {
			'reward_tiers read': true,
			'reward_tiers create': true,
			'reward_tiers update': true,
			'reward_tiers approve': true,
			'items': {
				'reward_tiers items read': true,
				'reward_tiers items create': true,
				'reward_tiers items update': true,
				'reward_tiers items approve': true
			}
		}
	},
	'promocodes': {
		'promocodes read': true,
		'promocodes create': true,
		'promocodes update': true,
		'promocodes delete': true,
		'promocodes approve': true
	},
	'promotions': {
		'promotions read': true,
		'promotions create': true,
		'promotions update': true,
		'promotions delete': true,
		'promotions approve': true,
		'geolocations': {
			'promotions geolocations read': true,
			'promotions geolocations create': true,
			'promotions geolocations update': true,
			'promotions geolocations delete': true,
			'promotions geolocations approve': true
		}
	},
	'localization': {
		'localization read': true,
		'localization create': true,
		'localization update': true,
		'localization approve': true
	}
}

export const metaPermissions = {
	'create role': true,
	'update role': true,
	'delete role': true,
	'list role': true,
	'create permission': true,
	'update permission': true,
	'delete permission': true,
	'list permission': true,
	'list role\'s permissions': true,
	'assign permissions to role': true,
	'revoke permissions from role': true,
	'sync permissions for role': true,
	'list user\'s roles': true,
	'assign roles to user': true,
	'revoke roles from user': true,
	'sync roles for user': true,
	'list user\'s permissions': true,
	'assign permissions to user': true,
	'revoke permissions from user': true,
	'sync permissions for user': true,
	'search users with role & permission': true
}

export const permissions = {
	// Analytics
	'analytics overview read': true,
	'analytics store read': true,
	'analytics item read': true,
	'analytics user read': true,
	// Approvals Manager
	'create role': true,
	'update role': true,
	'delete role': true,
	'list role': true,
	'list role\'s permissions': true,
	'assign permissions to role': true,
	'revoke permissions from role': true,
	'sync permissions for role': true,
	'create permission': true,
	'update permission': true,
	'delete permission': true,
	'list permission': true,
	'approvals read': true,
	'approvals update': true,
	'list user\'s roles': true,
	'assign roles to user': true,
	'revoke roles from user': true,
	'sync roles for user': true,
	'list user\'s permissions': true,
	'assign permissions to user': true,
	'revoke permissions from user': true,
	'sync permissions for user': true,
	'search users with role & permission': true,
	'approvals modules read': true,
	'approvals modules create': true,
	'approvals modules update': true,
	'approvals modules delete': true,
	// Admin Manager
	'admin brand_admins read': true,
	'admin brand_admins create': true,
	'admin brand_admins update': true,
	'admin location_managers read': true,
	'admin location_managers create': true,
	'admin location_managers update': true,
	'admin oma_users read': true,
	'admin oma_users create': true,
	'admin oma_users update': true,
	'admin oma_users delete': true,
	'admin store_app_users read': true,
	'admin store_app_users create': true,
	'admin store_app_users update': true,
	// Stores Manager
	'stores info read': true,
	'stores info create': true,
	'stores info update': true,
	'stores info delete': true,
	'stores meta read': true,
	'stores meta create': true,
	'stores meta update': true,
	'stores hours read': true,
	'stores hours create': true,
	'stores hours update': true,
	'stores holiday_hours read': true,
	'stores holiday_hours create': true,
	'stores holiday_hours update': true,
	'stores holiday_hours delete': true,
	'stores images read': true,
	'stores images create': true,
	'stores images update': true,
	'stores images delete': true,
	'stores groups read': true,
	'stores groups create': true,
	'stores groups update': true,
	'stores groups delete': true,
	'stores amenities read': true,
	'stores amenities create': true,
	'stores amenities update': true,
	'stores amenities delete': true,
	'stores order_settings read': true,
	'stores order_settings update': true,
	'stores order_settings delete': true,
	// News Feed
	'news_feed read': true,
	'news_feed create': true,
	'news_feed update': true,
	// Social Feed
	'social_feed read': true,
	'social_feed update': true,
	// Tax Manager
	'tax tax_classes read': true,
	'tax tax_classes create': true,
	'tax tax_classes update': true,
	'tax tax_classes delete': true,
	'tax item_types read': true,
	'tax item_types create': true,
	'tax item_types update': true,
	'tax item_types delete': true,
	// Menu Manager
	'menu_manager menus read': true,
	'menu_manager menus create': true,
	'menu_manager menus update': true,
	'menu_manager menus delete': true,
	'menu_manager menus categories read': true,
	'menu_manager menus categories create': true,
	'menu_manager menus categories update': true,
	'menu_manager menus categories delete': true,
	'menu_manager menus categories subcategories read': true,
	'menu_manager menus categories subcategories create': true,
	'menu_manager menus categories subcategories update': true,
	'menu_manager menus categories subcategories delete': true,
	'menu_manager menus categories subcategories items read': true,
	'menu_manager menus categories subcategories items create': true,
	'menu_manager menus categories subcategories items update': true,
	'menu_manager menus categories subcategories items delete': true,
	'menu_manager tiers read': true,
	'menu_manager tiers create': true,
	'menu_manager tiers update': true,
	'menu_manager modifiers read': true,
	'menu_manager modifiers create': true,
	'menu_manager modifiers update': true,
	'menu_manager modifiers delete': true,
	'menu_manager modifiers items read': true,
	'menu_manager modifiers items create': true,
	'menu_manager modifiers items update': true,
	'menu_manager modifiers items delete': true,
	'menu_manager tags read': true,
	'menu_manager tags create': true,
	'menu_manager tags update': true,
	'menu_manager portions read': true,
	'menu_manager portions create': true,
	'menu_manager portions update': true,
	'menu_manager options read': true,
	'menu_manager options create': true,
	'menu_manager options update': true,
	'menu_manager options items read': true,
	'menu_manager options items create': true,
	'menu_manager options items update': true,
	'menu_manager attributes read': true,
	'menu_manager attributes create': true,
	'menu_manager attributes update': true,
	'menu_manager attributes delete': true,
	// Printers
	'printers read': true,
	'printers create': true,
	'printers update': true,
	// User Manager
	'user_manager users read': true,
	'user_manager user_groups read': true,
	'user_manager user_groups create': true,
	'user_manager user_groups update': true,
	'user_manager user_groups delete': true,
	'user_manager attributes read': true,
	'user_manager attributes create': true,
	'user_manager attributes update': true,
	'user_manager attributes delete': true,
	// FAQ
	'faq user read': true,
	'faq user create': true,
	'faq user update': true,
	'faq store read': true,
	'faq store create': true,
	'faq store update': true,
	// Gallery
	'gallery read': true,
	'gallery create': true,
	'gallery update': true,
	// Loyalty
	'loyalty base_rule read': true,
	'loyalty base_rule create': true,
	'loyalty base_rule update': true,
	'loyalty base_rule delete': true,
	'loyalty promotion_rules read': true,
	'loyalty promotion_rules create': true,
	'loyalty promotion_rules update': true,
	'loyalty promotion_rules delete': true,
	'reward_tiers read': true,
	'reward_tiers create': true,
	'reward_tiers update': true,
	'reward_tiers items read': true,
	'reward_tiers items create': true,
	'reward_tiers items update': true,
	// Promocodes
	'promocodes read': true,
	'promocodes create': true,
	'promocodes update': true,
	'promocodes delete': true,
	// Promotions
	'promotions read': true,
	'promotions create': true,
	'promotions update': true,
	'promotions delete': true,
	'promotions geolocations read': true,
	'promotions geolocations create': true,
	'promotions geolocations update': true,
	'promotions geolocations delete': true,
	// Localization
	'localization read': true,
	'localization create': true,
	'localization update': true
}
