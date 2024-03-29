<template>
	<section :id="normalizedTitle" class="flex flex-col items-center space-y-4">
		<div class="flex w-full items-center justify-between space-x-4">
			<transition name="fade" mode="out-in">
				<div v-if="isLoading" class="space-y-2">
					<div
						class="h-7 w-48 animate-pulse rounded-lg bg-blue-600"
					/>
					<div class="flex items-center space-x-1">
						<div
							class="h-[18px] w-16 animate-pulse rounded bg-slate-200"
						/>
						<div
							class="h-[18px] w-16 animate-pulse rounded bg-slate-200"
						/>
					</div>
				</div>
				<div class="space-y-2" v-else>
					<h5
						class="w-fit rounded-lg bg-blue-600 px-2 font-semibold uppercase tracking-widest text-white"
					>
						{{ order }}. {{ title }}
					</h5>
					<div class="flex items-center space-x-1">
						<div
							class="rounded border border-orange-600 bg-orange-600 px-1 text-xs font-medium text-white"
							v-if="type"
						>
							<p>{{ type }}</p>
						</div>
						<div v-for="area in areas">
							<div
								class="rounded border px-1 text-xs font-medium text-neutral-500"
							>
								{{ area?.attributes?.name }}
							</div>
						</div>
					</div>
				</div>
			</transition>
			<ProfileCard :user-id="authorId">
				<transition name="fade" mode="out-in">
					<div
						v-if="isLoading"
						class="flex flex-col items-end space-y-1"
					>
						<div
							class="h-6 w-20 animate-pulse rounded bg-slate-200"
						/>
						<div
							class="h-5 w-32 animate-pulse rounded bg-slate-200"
						/>
					</div>
					<div
						class="flex flex-col items-end space-y-1 text-right"
						v-else
					>
						<div class="flex items-center space-x-2">
							<div
								class="w-fit rounded border px-1 text-xs font-medium text-neutral-500"
							>
								BY
							</div>
							<p class="font-bold">{{ authorDisplayName }}</p>
						</div>
						<p class="text-sm text-neutral-500">
							Published at
							<span class="font-medium">
								{{ publishedAtString }}
							</span>
						</p>
					</div>
				</transition>
			</ProfileCard>
		</div>
		<transition name="fade" mode="out-in">
			<div v-if="isLoading" class="w-full">
				<div
					class="ml-auto mr-auto h-5 w-3/5 animate-pulse rounded bg-slate-200"
				/>
			</div>
			<div class="flex items-center space-x-2" v-else-if="purpose">
				<FireIcon
					class="h-4 min-h-fit w-4 min-w-fit text-neutral-500"
				/>
				<p class="text-sm font-medium italic text-neutral-500">
					This knowledge aims to {{ purpose }}.
				</p>
			</div>
		</transition>
		<transition name="fade" mode="out-in">
			<div v-if="isLoading" class="w-full space-y-5">
				<div
					class="h-[500px] w-full animate-pulse rounded bg-slate-200"
				/>
				<div
					class="h-[300px] w-full animate-pulse rounded bg-gradient-to-tr from-blue-50 to-purple-50"
				/>
				<div
					class="h-[200px] w-full animate-pulse rounded bg-orange-200"
				/>
			</div>
			<div
				v-else
				v-html="content"
				class="prose-article w-full text-justify font-text"
			/>
		</transition>
	</section>
</template>

<script setup>
import { FireIcon } from '@heroicons/vue/24/outline/index.js';
import 'highlight.js/styles/a11y-dark.css';
import { computed, onUnmounted, watch } from 'vue';
import { getKnowledge } from '@/api/knowledge.js';
import ProfileCard from '@/layouts/user/profileCard.vue';
import { normalize } from '@/utils/format.js';

const props = defineProps({
	knowledgeId: Number,
	order: Number,
});

const propKnowledgeId = computed(() => {
	return props.knowledgeId;
});

const knowledgeResponse = getKnowledge(
	propKnowledgeId,
	{
		populate: {
			author: {
				populate: ['avatar'],
			},
			areas: true,
		},
	},
	{ immediate: false },
);

if (propKnowledgeId.value) {
	knowledgeResponse.execute();
}

watch(propKnowledgeId, (newKnowledgeId) => {
	if (newKnowledgeId) {
		knowledgeResponse.execute();
	}
});

const isLoading = computed(() => {
	return (
		knowledgeResponse.isFetching.value ||
		(!knowledgeResponse.isFetching.value &&
			!knowledgeResponse.isFinished.value) ||
		!propKnowledgeId.value
	);
});

const knowledge = computed(() => {
	return knowledgeResponse.data.value?.data?.attributes;
});

const title = computed(() => {
	return knowledge.value?.title;
});

const normalizedTitle = computed(() => {
	if (title.value) {
		return normalize(title.value);
	} else {
		return null;
	}
});

const areas = computed(() => {
	return knowledge.value?.areas?.data;
});

const content = computed(() => {
	return knowledge.value?.content;
});

const type = computed(() => {
	return knowledge.value?.type;
});

const purpose = computed(() => {
	return knowledge.value?.purpose;
});

const authorId = computed(() => {
	return knowledge.value?.author?.data?.id;
});

const author = computed(() => {
	return knowledge.value?.author?.data?.attributes;
});

const authorDisplayName = computed(() => {
	return author.value?.displayName;
});

const publishedAtString = computed(() => {
	return new Date(knowledge?.value?.publishedAt).toLocaleString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
});

onUnmounted(() => {
	if (knowledgeResponse.canAbort.value) {
		knowledgeResponse.abort();
	}
});
</script>
