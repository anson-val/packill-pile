<template>
	<Activity>
		<template #icon>
			<ThreeSlashesIcon theme='filled' size='16' fill='#ffffff' />
		</template>
		<template #message>
			{{ displayName }}
			<span class='text-neutral-500'>{{ $t('activity.partitionCompleteMessage', { partitionName: name }) }}</span>
		</template>
		<template #createdAtDate>{{ createdAtDateString }}</template>
		<template #createdAtTime>{{ createdAtTimeString }}</template>
		<template #details>
			<router-link
				:to='`/topics`'
				class='flex w-fit items-center space-x-2 rounded-lg border bg-white p-2 hover:text-sky-800 hover:underline'
			>
				<ThreeSlashesIcon theme='outline' size='16' fill='#059669' />
				<p class='text-sm font-semibold'>{{ name }}</p>
				<ArrowRightUpIcon theme="outline" size="12" />
			</router-link>
		</template>
	</Activity>
</template>

<script setup>
import { ThreeSlashes as ThreeSlashesIcon, ArrowRightUp as ArrowRightUpIcon } from '@icon-park/vue-next';
import Activity from '@/layouts/activity/activity.vue';
import { computed, onUnmounted, toRefs, watch } from 'vue';
import { getActivity } from '@/api/activity.js';
import moment from 'moment';

const props = defineProps({
	activityId: Number,
});

const { activityId } = toRefs(props);

const activityResponse = getActivity(
	activityId,
	{
		populate: {
			target: {
				populate: {
					partition: {
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

if (activityId.value) {
	activityResponse.execute();
}

watch(activityId, (newActivityId) => {
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

const partitionId = computed(() => {
	return target.value?.partition?.data?.id;
});

const partition = computed(() => {
	return target.value?.partition?.data?.attributes;
});

const name = computed(() => {
	return partition.value?.name;
});

onUnmounted(() => {
	if (activityResponse.canAbort.value) {
		activityResponse.abort();
	}
});
</script>
