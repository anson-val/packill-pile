<template>
	<div class='relative flex flex-col border-r bg-white p-4 justify-between'>
		<div class='space-y-10'>
<!--			Placeholder for logo-->
			<BabyPants theme="multi-color" size="24" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']"/>
			<div class='space-y-6'>
				<router-link to='/dashboard' class='block relative'>
					<button>
						<HomeIcon theme="multi-color" size="24" :fill="['#262626' ,'#2563eb' ,'#FFF' ,'#bfdbfe']" v-if='isAtDashboard'/>
						<HomeIcon theme='filled' size='24' fill='#94a3b8' v-else/>
					</button>
					<div class='absolute rounded-full h-1 w-1 bg-blue-600 bottom-0 left-1/2 -translate-x-1/2' v-if='isAtDashboard'/>
				</router-link>
				<router-link to='/packages' class='block relative'>
					<button>
						<BoxIcon theme="multi-color" size="24" :fill="['#262626' ,'#ea580c' ,'#FFF' ,'#fed7aa']" v-if='isAtPackages'/>
						<BoxIcon theme='filled' size='24' fill='#94a3b8' v-else/>
					</button>
					<div class='absolute rounded-full h-1 w-1 bg-orange-600 bottom-0 left-1/2 -translate-x-1/2' v-if='isAtPackages'/>
				</router-link>
				<router-link to='/blog' class='block relative'>
					<button>
						<AnnouncementIcon theme="multi-color" size="24" :fill="['#262626' ,'#d97706' ,'#FFF' ,'#fde68a']" v-if='isAtBlog'/>
						<AnnouncementIcon theme='filled' size='24' fill='#94a3b8' v-else/>
					</button>
					<div class='absolute rounded-full h-1 w-1 bg-amber-600 bottom-0 left-1/2 -translate-x-1/2' v-if='isAtBlog'/>
				</router-link>
			</div>
		</div>
		<div class='space-y-6'>
			<LangDropdown>
				<TranslateIcon theme='filled' size='24' fill='#94a3b8' />
			</LangDropdown>
			<Notifications>
				<AlarmIcon theme='filled' size='24' fill='#94a3b8' />
			</Notifications>
			<router-link to='/settings' class='block relative'>
				<button>
					<SettingTwoIcon theme='filled' size='24' fill='#262626' v-if='isAtSettings'/>
					<SettingTwoIcon theme='filled' size='24' fill='#94a3b8' v-else/>
				</button>
				<div class='absolute rounded-full h-1 w-1 bg-neutral-800 bottom-0 left-1/2 -translate-x-1/2' v-if='isAtSettings'/>
			</router-link>
		</div>
	</div>
</template>

<script setup>
import {
	Home as HomeIcon,
	Box as BoxIcon,
	Announcement as AnnouncementIcon,
	Translate as TranslateIcon,
	SettingTwo as SettingTwoIcon,
	Alarm as AlarmIcon,
	BabyPants
} from '@icon-park/vue-next';
import { logout } from '@/api/auth.js';
import Notifications from '@/layouts/notification/notifications.vue';
import LangDropdown from '@/layouts/locale/langDropdown.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const path = computed(() => {
	return route.path;
});
const isAtDashboard = path.value === '/dashboard';
const isAtPackages = path.value === '/packages';
const isAtBlog = path.value === '/blog';
const isAtSettings = /^\/settings/.test(path.value);
</script>
