<template>
	<Index>
		<div
			class="flex h-full w-full flex-col space-y-4 bg-white p-6 sm:rounded-xl sm:p-8"
		>
			<div
				class="space-y-2 md:flex md:items-center md:justify-between md:space-y-0"
			>
				<div class="space-y-2">
					<h3 class="font-semibold">{{ attributes?.name }}</h3>
					<div class="flex items-center space-x-1">
						<div class="flex space-x-1">
							<p
								v-for="area in attributes?.areas?.data"
								class="rounded px-2 text-xs font-medium text-white"
								:style="`background: ${area?.attributes?.color}`"
							>
								{{ area?.attributes?.tag }}
							</p>
						</div>
					</div>
				</div>
				<button
					class="btn-accent group flex items-center space-x-1"
					@click.prevent=""
				>
					<CursorArrowRippleIcon class="h-4 w-4 animate-pulse" />
					<label class="animate-pulse">
						Unpack and start this package
					</label>
				</button>
			</div>
			<div
				class="w-full flex-1 space-y-8 overflow-auto rounded-xl border p-4 md:flex md:space-x-8 md:space-y-0"
			>
				<div
					class="space-y-4 rounded-lg bg-gradient-to-tr from-neutral-700 to-purple-300 p-4 shadow-lg md:flex md:w-1/2 md:flex-col md:justify-between md:space-y-0 lg:w-1/3"
				>
					<div
						class="grid grid-flow-row grid-cols-2 justify-between gap-y-2 lg:grid-cols-3"
					>
						<div>
							<h4 class="font-medium capitalize text-white">
								{{ attributes?.state }}
							</h4>
							<div class="text-sm font-medium text-white">
								State
							</div>
						</div>
						<div>
							<h4 class="font-medium capitalize text-white">
								227
							</h4>
							<div class="text-sm font-medium text-white">
								Topics
							</div>
						</div>
						<div>
							<h4 class="font-medium capitalize text-white">
								15
							</h4>
							<div class="text-sm font-medium text-white">
								Available projects
							</div>
						</div>
						<div v-if="attributes?.certificate">
							<h4 class="font-medium capitalize text-white">
								Certificate
							</h4>
							<div class="text-sm font-medium text-white">
								Available
							</div>
						</div>
					</div>
					<p class="font-medium text-white">
						{{ attributes?.description }}
					</p>
				</div>
				<div class="flex-1 space-y-8 overflow-auto">
					<div class="space-y-2">
						<h5
							class="w-full rounded-lg bg-blue-600 px-4 py-1 font-semibold uppercase tracking-widest text-white md:w-fit md:px-2 md:py-0"
						>
							Learning Objective
						</h5>
						<div
							v-html="attributes?.objective"
							class="prose-article rounded-lg border p-4"
						/>
					</div>
					<div class="space-y-2">
						<h5
							class="w-full rounded-lg bg-blue-600 px-4 py-1 font-semibold uppercase tracking-widest text-white md:w-fit md:px-2 md:py-0"
						>
							Topics Covered
						</h5>
						<div class="rounded-lg border p-4">TODO</div>
					</div>
				</div>
			</div>
		</div>
	</Index>
</template>

<script setup>
import Index from '@/layouts/utils/index.vue';
import { CursorArrowRippleIcon } from '@heroicons/vue/24/outline/index.js';
import { useRoute } from 'vue-router';
import { getPackage } from '@/api/package.js';
import { computed } from 'vue';

const route = useRoute();
const packageId = route.params.id;

const { response, data, error, loading, retry } = getPackage(packageId);

const attributes = computed(() => {
	return data.value?.data?.attributes;
});
</script>
