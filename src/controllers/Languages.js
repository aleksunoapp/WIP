/*

LANGUAGES

	listLanguages
		GET {{url}}/api/app/locale
		[
			{
				"id": 1,
				"language_code": "fr",
				"default": 0,
				"country_id": 0,
				"country": ""
			}
		]

	createLanguage
		{
			"language_code": "fr",
			"country_id": 1,
			"default": 0
		}
		POST {{url}}/api/app/locale/create

    updateLanguage
		{
			"language_code": "fr",
			"country_id": 1,
			"default": 0 // updating to 1 gets 500 Whoops
		}
		POST {{url}}/api/app/locale/ + language.id + /update

*/
