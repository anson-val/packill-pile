<template>
	<Activity>
		<template #icon>
			<BoxIcon theme='filled' size='16' fill='#ffffff' />
		</template>
		<template #message>
			{{ displayName }}
			<span class='text-neutral-500'>{{ $t('activity.packageCompleteMessage', { packageName: packageName })
				}}</span>
		</template>
		<template #createdAtDate>{{ createdAtDateString }}</template>
		<template #createdAtTime>{{ createdAtTimeString }}</template>
		<template #details>
			<router-link
				to=''
				class='flex w-fit items-center space-x-2 rounded-lg border bg-white p-2 hover:text-sky-800 hover:underline'
			>
				<BoxIcon theme='outline' size='16' fill='#2563eb' />
				<p class='text-sm font-semibold'>{{ packageName }}</p>
				<ArrowRightUpIcon theme="outline" size="12" />
			</router-link>
		</template>
	</Activity>
</template>

<script setup>
import { Box as BoxIcon, ArrowRightUp as ArrowRightUpIcon } from '@icon-park/vue-next';
import Activity from '@/layouts/activity/activity.vue';
import { computed, onUnmounted, watch } from 'vue';
import { getActivity } from '@/api/activity.js';
import moment from 'moment';
import {
	Square3Stack3DIcon,
	ArrowUpRightIcon,
} from '@heroicons/vue/24/outline/index.js';

const props = defineProps({
	activityId: Number,
});

const propActivityId = computed(() => {
	return props.activityId;
});

const activityResponse = getActivity(
	propActivityId,
	{
		fields: ['type', 'createdAt'],
		populate: {
			target: {
				populate: {
					package: {
						fields: ['id', 'name'],
					},
				},
			},
			user: {
				fields: ['id', 'displayName'],
			},
		},
	},
	{ immediate: false },
);

if (propActivityId.value) {
	activityResponse.execute();
}

watch(propActivityId, (newActivityId) => {
	if (newActivityId) {
		activityResponse.execute();
	}
});

const activity = computed(() => {
	return activityResponse.data.value?.data?.attributes;
});

const createdAt = computed(() => {
	return new Date(activity.value?.createdAt);
});

const createdAtDateString = computed(() => {
	return moment(createdAt.value).format('L');
});

const createdAtTimeString = computed(() => {
	return moment(createdAt.value).format('LT');
});

const user = computed(() => {
	return activity.value?.user?.data?.attributes;
});

const displayName = computed(() => {
	return user.value?.displayName;
});

const target = computed(() => {
	if (activity.value?.target) {
		return activity.value?.target[0];
	}
});

const pack = computed(() => {
	return target.value?.package?.data?.attributes;
});

const packageName = computed(() => {
	return pack.value?.name;
});

onUnmounted(() => {
	if (activityResponse.canAbort.value) {
		activityResponse.abort();
	}
});
</script>
