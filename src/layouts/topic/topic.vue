<template>
	<div class="flex h-full flex-col bg-white">
		<div class="flex items-center space-x-1 border-b px-4 py-2">
			<DocumentTextIcon class="h-4 w-4 text-neutral-500" />
			<p class="font-bold uppercase text-neutral-500">Topic</p>
		</div>
		<div class="flex-1 items-center divide-y overflow-auto">
			<div v-for="(knowledge, index) in knowledges">
				<Knowledge
					:order="index"
					:id="knowledge.id"
					class="mx-auto p-6 min-w-[300px] max-w-[900px]"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { DocumentTextIcon } from '@heroicons/vue/24/solid';
import { useRoute } from 'vue-router';
import { getTopic } from '@/api/workspace.js';
import Knowledge from '@/layouts/knowledge/knowledge.vue';
import { computed } from 'vue';

const route = useRoute();
const topicId = route.params.topicId;

const topicResponse = getTopic(topicId);

const topic = computed(() => {
	return topicResponse.data.value?.data;
});

const attributes = computed(() => {
	return topic.value?.attributes;
});

const knowledges = computed(() => {
	return attributes.value?.knowledges?.data;
});
</script>