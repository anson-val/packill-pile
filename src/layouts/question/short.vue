<template>
	<div
		class="h-full w-full space-y-6 rounded-lg border bg-slate-50 px-6 py-4"
	>
		<div class="space-y-2">
			<div
				class="w-fit rounded border px-1 text-sm font-medium text-neutral-500"
			>
				Short Answer
			</div>
			<p class="flex-1 text-justify font-medium">{{ description }}</p>
		</div>
		<div class="space-y-4">
			<VenustInput
				placeholder="Type your answer here..."
				default-type="text"
				input-class="rounded-lg"
				@model="sendParent"
				:disabled="isWaitingResult"
			/>
		</div>
		<details class="space-y-4" v-if="answer && !isInsideQuiz">
			<summary class="text-sm font-medium text-neutral-500 underline">
				Show answer
			</summary>
			<div class="space-y-1">
				<p class="text-xs text-neutral-500">Solution</p>
				<p class="text-justify font-medium text-blue-600">
					{{ answer }}
				</p>
			</div>
		</details>
	</div>
</template>

<script setup>
import VenustInput from '@/components/venust/input/venustInput.vue';

import { computed, inject } from 'vue';

const emit = defineEmits(['model']);
const props = defineProps({
	question: Object,
});

const isWaitingResult = inject('isWaitingResult', false);
const isInsideQuiz = inject('isInsideQuiz', false);

const description = computed(() => {
	return props.question?.description;
});

const answer = computed(() => {
	return props.question?.answer;
});

function sendParent(value) {
	emit('model', value);
}
</script>
