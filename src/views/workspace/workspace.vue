<template>
	<Index>
		<div class="flex h-full w-full flex-col">
			<Dock>
				<transition name="fade" mode="out-in">
					<div v-if="isLoading" class="space-y-1">
						<div
							class="h-7 w-32 animate-pulse rounded bg-slate-200"
						/>
						<div
							class="h-4 w-20 animate-pulse rounded bg-slate-200"
						/>
					</div>
					<div v-else>
						<h5 class="font-medium">{{ topicTitle }}</h5>
						<p class="text-sm">Workspace</p>
					</div>
				</transition>
			</Dock>
			<div class="flex w-full flex-1 divide-x overflow-auto">
				<Topic class="w-full flex-1 overflow-auto" />
				<Problem
					:key="$route.fullPath"
					:topic-id="paramTopicId"
					:problem-id="problemIdSuggested"
					class="w-[500px] overflow-auto"
				/>
			</div>
		</div>
	</Index>
</template>

<script setup>
import Index from '@/layouts/utils/index.vue';
import Topic from '@/layouts/topic/topic.vue';
import Problem from '@/layouts/problem/problem.vue';
import { computed, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getTopic } from '@/api/topic.js';
import Dock from '@/layouts/dock/dock.vue';
import { getMyNextProblem } from '@/utils/problem.js';
import router from '@/router/index.js';

const route = useRoute();
const paramTopicId = computed(() => {
	return Number(route.params.topicId) || null;
});

const paramProblemId = computed(() => {
	return Number(route.params.problemId) || null;
});

const topicResponse = getTopic(
	paramTopicId,
	{
		populate: {
			problems: {
				fields: ['id'],
			},
		},
	},
	{ immediate: false },
);

if (paramTopicId.value) {
	topicResponse.execute();
}

watch(paramTopicId, (newTopicId) => {
	if (newTopicId) {
		topicResponse.execute();
	}
});

const isLoading = computed(() => {
	return (
		topicResponse.isFetching.value ||
		(!topicResponse.isFetching.value && !topicResponse.isFinished.value) ||
		!paramTopicId
	);
});

const topic = computed(() => {
	return topicResponse.data.value?.data?.attributes;
});

const topicTitle = computed(() => {
	return topic?.value?.title;
});

const problemSuggested = getMyNextProblem(paramTopicId);
const problemIdSuggested = computed(() => {
	if (paramProblemId.value) {
		return paramProblemId.value;
	} else {
		return problemSuggested.id.value;
	}
});

const problemSuggestedIsLoading = computed(() => {
	return problemSuggested.isLoading.value;
});

watch(problemSuggestedIsLoading, (newIsLoading, oldIsLoading) => {
	if (oldIsLoading && !newIsLoading) {
		if (
			!paramProblemId.value ||
			(paramProblemId.value === '0' && problemIdSuggested.value !== 0)
		) {
			router.replace(
				`/workspace/${paramTopicId.value}/${problemIdSuggested.value}`,
			);
		}
	}
});

watch(problemIdSuggested, (newId) => {
	if (
		!paramProblemId.value ||
		(paramProblemId.value === '0' && newId !== 0)
	) {
		router.replace(`/workspace/${paramTopicId.value}/${newId}`);
	}
});

watch(paramProblemId, () => {
	if (topicResponse.canAbort.value) {
		topicResponse.abort();
	}
});

onUnmounted(() => {
	if (topicResponse.canAbort.value) {
		topicResponse.abort();
	}
});
</script>
