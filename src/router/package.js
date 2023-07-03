const Packages = () => import('@/views/package/packages.vue');
const Package = () => import('@/views/package/package.vue');
const Overview = () => import('@/views/package/overview.vue');

export default [
	{
		name: 'Packages',
		path: '/packages',
		component: Packages,
	},
	{
		name: 'Package',
		path: '/packages/:id',
		component: Package,
	},
	{
		name: 'Overview',
		path: '/packages/:packageId/overview',
		component: Overview,
	}
];
