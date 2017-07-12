import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Tutorial from '@/components/Tutorial'
import Code from '@/components/Code'
import Inspection from '@/components/Inspection'
import Services from '@/components/Services'
import Thanks from '@/components/Thanks'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'error',
			component: Error
		},
		{
			path: '/:uniqueUrl',
			component: Home,
			children: [
				{
					path: '',
					name: 'code',
					component: Code
				},
				{
					path: 'tutorial',
					name: 'tutorial',
					component: Tutorial
				},
				{
					path: 'inspection',
					name: 'inspection',
					component: Inspection
				},
				{
					path: 'services',
					name: 'services',
					component: Services
				},
				{
					path: 'thanks',
					name: 'thanks',
					component: Thanks
				}
			]
		},
		{ path: '*', redirect: '/' }
	]
})
