<template>
	<Activity>
		<template #icon>
			<BookOneIcon theme="filled" size="16" fill="#ffffff"/>
		</template>
		<template #message>
			{{ displayName }}
			<span class='text-neutral-500'>{{$t('activity.topicCompleteMessage', { title: title }) }}</span>
		</template>
		<template #createdAtDate>{{ createdAtDateString }}</template>
		<template #createdAtTime>{{ createdAtTimeString }}</template>
		<template #details>
			<router-link
				:to="`/workspace/${topicId}`"
				class="flex w-fit items-center space-x-2 rounded-lg border bg-white p-2 hover:text-sky-800 hover:underline"
			>
				<BookOneIcon theme="outline" size="16" fill="#ea580c"/>
				<p class="text-sm font-semibold">{{ title }}</p>
				<ArrowRightUpIcon theme="filled" size="12" />
			</router-link>
		</template>
	</Activity>
</template>

<script setup>
import { BookOne as BookOneIcon, ArrowRightUp as ArrowRightUpIcon } from '@icon-park/vue-next';
import Activity from '@/layouts/activity/activity.vue';
import { computed, onUnmounted, watch } from 'vue';
import { getActivity } from '@/api/activity.js';
import moment from 'moment';

const props = defineProps({
	activityId: Number,
});

const propActivityId = computed(() => {
	return props.activityId;
});

const activityResponse = getActivity(
	propActivityId,
	{
		populate: {
			target: {
				populate: {
					topic: {
						fields: ['id', 'title'],
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

const topicId = computed(() => {
	return target.value?.topic?.data?.id;
});

const topic = computed(() => {
	return target.value?.topic?.data?.attributes;
});

const title = computed(() => {
	return topic.value?.title;
});

onUnmounted(() => {
	if (activityResponse.canAbort.value) {
		activityResponse.abort();
	}
});
</script>
