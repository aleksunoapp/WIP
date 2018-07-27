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
		'stores info read': false,
		'stores info create': false,
		'stores info update': false,
		'stores info delete': false,
		'stores info approve': false,
		'stores meta read': false,
		'stores meta create': false,
		'stores meta update': false,
		'stores meta approve': false,
		'stores hours read': false,
		'stores hours create': false,
		'stores hours update': false,
		'stores hours approve': false,
		'stores holiday_hours read': false,
		'stores holiday_hours create': false,
		'stores holiday_hours update': false,
		'stores holiday_hours delete': false,
		'stores holiday_hours approve': false,
		'stores images read': false,
		'stores images create': false,
		'stores images update': false,
		'stores images delete': false,
		'stores images approve': false,
		'groups': {
			'stores groups read': false,
			'stores groups create': false,
			'stores groups update': false,
			'stores groups delete': false,
			'stores groups approve': false
		},
		'amenities': {
			'stores amenities read': false,
			'stores amenities create': false,
			'stores amenities update': false,
			'stores amenities delete': false,
			'stores amenities approve': false
		},
		'order_settings': {
			'stores order_settings read': false,
			'stores order_settings update': false,
			'stores order_settings delete': false,
			'stores order_settings approve': false
		}
	},
	'analytics': {
		'analytics overview': {
			'analytics overview read': false,
			'analytics overview approve': false
		},
		'store analytics': {
			'analytics store read': false,
			'analytics store approve': false
		},
		'item analytics': {
			'analytics item read': false,
			'analytics item approve': false
		},
		'user analytics': {
			'analytics user read': false,
			'analytics user approve': false
		}
	},
	'approvals': {
		'approvals read': false,
		'approvals create': false,
		'approvals update': false,
		'approvals delete': false,
		'approvals approve': false
	},
	'modules': {
		'approvals modules read': false,
		'approvals modules create': false,
		'approvals modules update': false,
		'approvals modules delete': false,
		'approvals modules approve': false
	},
	'admin': {
		'brand_admins': {
			'admin brand_admins read': false,
			'admin brand_admins create': false,
			'admin brand_admins update': false,
			'admin brand_admins approve': false
		},
		'location_managers': {
			'admin location_managers read': false,
			'admin location_managers create': false,
			'admin location_managers update': false,
			'admin location_managers delete': false,
			'admin location_managers approve': false
		},
		'oma_users': {
			'admin oma_users read': false,
			'admin oma_users create': false,
			'admin oma_users update': false,
			'admin oma_users delete': false,
			'admin oma_users approve': false
		},
		'store_app_users': {
			'admin store_app_users read': false,
			'admin store_app_users create': false,
			'admin store_app_users update': false,
			'admin store_app_users approve': false
		}
	},
	'news_feed': {
		'news_feed read': false,
		'news_feed create': false,
		'news_feed update': false,
		'news_feed delete': false,
		'news_feed approve': false
	},
	'social_feed': {
		'social_feed read': false,
		'social_feed update': false,
		'social_feed approve': false
	},
	'tax': {
		'tax tax_classes': {
			'tax tax_classes read': false,
			'tax tax_classes create': false,
			'tax tax_classes update': false,
			'tax tax_classes delete': false,
			'tax tax_classes approve': false
		},
		'item_types': {
			'tax item_types read': false,
			'tax item_types create': false,
			'tax item_types update': false,
			'tax item_types delete': false,
			'tax item_types approve': false
		}
	},
	'menu_manager': {
		'menus': {
			'menu_manager menus read': false,
			'menu_manager menus create': false,
			'menu_manager menus update': false,
			'menu_manager menus delete': false,
			'menu_manager menus approve': false,
			'add category addons': false,
			'add category addons approve': false,
			'menu_manager menus menu_hours create': false,
			'menu_manager menus menu_hours read': false,
			'menu_manager menus menu_hours update': false,
			'menu_manager menus menu_hours delete': false,
			'menu_manager menus menu_hours approve': false,
			'categories': {
				'menu_manager menus categories read': false,
				'menu_manager menus categories create': false,
				'menu_manager menus categories update': false,
				'menu_manager menus categories delete': false,
				'menu_manager menus categories approve': false,
				'menu_manager menus categories hours create': false,
				'menu_manager menus categories hours read': false,
				'menu_manager menus categories hours update': false,
				'menu_manager menus categories hours delete': false,
				'menu_manager menus categories hours approve': false,
				'subcategories': {
					'menu_manager menus categories subcategories read': false,
					'menu_manager menus categories subcategories create': false,
					'menu_manager menus categories subcategories update': false,
					'menu_manager menus categories subcategories delete': false,
					'menu_manager menus categories subcategories approve': false,
					'menu items': {
						'menu_manager menus categories subcategories items read': false,
						'menu_manager menus categories subcategories items create': false,
						'menu_manager menus categories subcategories items update': false,
						'menu_manager menus categories subcategories items delete': false,
						'menu_manager menus categories subcategories items approve': false,
						'menu_manager menus categories subcategories items assign modifier': false,
						'menu_manager menus categories subcategories items assign modifier approve': false,
						'menu_manager menus categories subcategories items tags update': false,
						'menu_manager menus categories subcategories items tags update approve': false,
						'item nutrition': {
							'menu_manager menus categories subcategories items nutrition read': false,
							'menu_manager menus categories subcategories items nutrition create': false,
							'menu_manager menus categories subcategories items nutrition update': false,
							'menu_manager menus categories subcategories items nutrition delete': false,
							'menu_manager menus categories subcategories items nutrition approve': false
						},
						'item images': {
							'menu_manager menus categories subcategories items images create': false,
							'menu_manager menus categories subcategories items images update': false,
							'menu_manager menus categories subcategories items images delete': false,
							'menu_manager menus categories subcategories items images approve': false
						}
					}
				}
			}
		},
		'menu tiers': {
			'menu_manager tiers read': false,
			'menu_manager tiers create': false,
			'menu_manager tiers update': false,
			'menu_manager tiers approve': false,
			'menu manager tiers assign menu': false
		},
		'modifiers': {
			'menu_manager modifiers read': false,
			'menu_manager modifiers create': false,
			'menu_manager modifiers update': false,
			'menu_manager modifiers delete': false,
			'menu_manager modifiers approve': false,
			'modifier items': {
				'menu_manager modifiers items read': false,
				'menu_manager modifiers items create': false,
				'menu_manager modifiers items update': false,
				'menu_manager modifiers items delete': false,
				'menu_manager modifiers items approve': false,
				'menu_manager modifiers items update tags': false,
				'menu_manager modifiers items update tags approve': false,
				'menu_manager modifiers items update portions': false,
				'menu_manager modifiers items update portions approve': false,
				'menu_manager modifiers items update options': false,
				'menu_manager modifiers items update options approve': false,
				'modifier item nutrition': {
					'menu_manager modifiers items nutrition read': false,
					'menu_manager modifiers items nutrition create': false,
					'menu_manager modifiers items nutrition update': false,
					'menu_manager modifiers items nutrition delete': false,
					'menu_manager modifiers items nutrition approve': false
				}
			}
		},
		'tags': {
			'menu_manager tags read': false,
			'menu_manager tags create': false,
			'menu_manager tags update': false,
			'menu_manager tags add modifier items': false,
			'menu_manager tags add modifier items approve': false,
			'menu_manager tags add items': false,
			'menu_manager tags add items approve': false,
			'menu_manager tags approve': false
		},
		'portions': {
			'menu_manager portions read': false,
			'menu_manager portions create': false,
			'menu_manager portions update': false,
			'menu_manager portions delete': false,
			'menu_manager portions approve': false
		},
		'options': {
			'menu_manager options read': false,
			'menu_manager options create': false,
			'menu_manager options update': false,
			'menu_manager options add modifier items': false,
			'menu_manager options add modifier items approve': false,
			'menu_manager options approve': false,
			'option items': {
				'menu_manager options items read': false,
				'menu_manager options items create': false,
				'menu_manager options items update': false,
				'menu_manager options items approve': false
			}
		},
		'attributes': {
			'menu_manager attributes read': false,
			'menu_manager attributes create': false,
			'menu_manager attributes update': false,
			'menu_manager attributes delete': false,
			'menu_manager attributes approve': false
		},
		'hours': {
			'menu_manager hours read': false,
			'menu_manager hours create': false,
			'menu_manager hours update': false,
			'menu_manager hours approve': false
		}
	},
	'printers': {
		'printers read': false,
		'printers create': false,
		'printers update': false,
		'printers approve': false
	},
	'user_manager': {
		'users': {
			'user_manager users read': false,
			'user_manager users approve': false
		},
		'user_groups': {
			'user_manager user_groups read': false,
			'user_manager user_groups create': false,
			'user_manager user_groups update': false,
			'user_manager user_groups delete': false,
			'user_manager user_groups approve': false
		},
		'attributes': {
			'user_manager attributes read': false,
			'user_manager attributes create': false,
			'user_manager attributes update': false,
			'user_manager attributes delete': false,
			'user_manager attributes approve': false
		}
	},
	'faq': {
		'store': {
			'faq store read': false,
			'faq store create': false,
			'faq store update': false,
			'faq store approve': false
		},
		'user': {
			'faq user read': false,
			'faq user create': false,
			'faq user update': false,
			'faq user approve': false
		}
	},
	'gallery': {
		'gallery read': false,
		'gallery create': false,
		'gallery approve': false
	},
	'loyalty': {
		'base_rule': {
			'loyalty base_rule read': false,
			'loyalty base_rule create': false,
			'loyalty base_rule update': false,
			'loyalty base_rule delete': false,
			'loyalty base_rule approve': false
		},
		'promotion_rules': {
			'loyalty promotion_rules read': false,
			'loyalty promotion_rules create': false,
			'loyalty promotion_rules update': false,
			'loyalty promotion_rules delete': false,
			'loyalty promotion_rules approve': false
		},
		'reward_tiers': {
			'reward_tiers read': false,
			'reward_tiers create': false,
			'reward_tiers update': false,
			'reward_tiers approve': false,
			'reward tier items': {
				'reward_tiers items read': false,
				'reward_tiers items create': false,
				'reward_tiers items update': false,
				'reward_tiers items approve': false
			}
		}
	},
	'promocodes': {
		'promocodes read': false,
		'promocodes create': false,
		'promocodes update': false,
		'promocodes delete': false,
		'promocodes approve': false
	},
	'promotions': {
		'promotions read': false,
		'promotions create': false,
		'promotions update': false,
		'promotions delete': false,
		'promotions approve': false,
		'geolocations': {
			'promotions geolocations read': false,
			'promotions geolocations create': false,
			'promotions geolocations update': false,
			'promotions geolocations delete': false,
			'promotions geolocations approve': false
		}
	},
	'localization': {
		'localization read': false,
		'localization create': false,
		'localization update': false,
		'localization approve': false,
		'countries': {
			'localization countries create': false,
			'localization countries read': false,
			'localization countries update': false,
			'localization countries delete': false,
			'localization countries approve': false
		},
		'languages': {
			'localization languages create': false,
			'localization languages read': false,
			'localization languages update': false,
			'localization languages delete': false,
			'localization languages approve': false
		}
	}
}