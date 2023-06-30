<template>
	<Activity>
		<template #icon>
			<ThinkingProblemIcon theme="outline" size="16" fill="#ffffff"/>
		</template>
		<template #message>
			{{displayName}}
			<span class='text-neutral-500'>{{ $t('activity.problemCompleteMessage', { problemName: problemName }) }}</span>
		</template>
		<template #createdAtDate>{{ createdAtDateString }}</template>
		<template #createdAtTime>{{ createdAtTimeString }}</template>
		<template #details>
			<router-link
				to=""
				class="flex w-fit items-center space-x-2 rounded-lg border bg-white p-2 hover:text-sky-800 hover:underline"
			>
				<ThinkingProblemIcon theme="outline" size="16" fill="#7c3aed"/>
				<p class="text-sm font-semibold">{{ problemName }}</p>
				<ArrowRightUpIcon theme="outline" size="12" />
			</router-link>
		</template>
	</Activity>
</template>

<script setup>
import { ThinkingProblem as ThinkingProblemIcon, ArrowRightUp as ArrowRightUpIcon } from '@icon-park/vue-next';
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
					problem: {
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

const problem = computed(() => {
	return target.value?.problem?.data?.attributes;
});

const problemName = computed(() => {
	return problem.value?.name;
});

onUnmounted(() => {
	if (activityResponse.canAbort.value) {
		activityResponse.abort();
	}
});
</script>
