<template>
	<Index>
		<Dock>
			<template #icon>
				<BoxIcon theme='filled' size='16' fill='#262626' />
			</template>
			<template #path>
				<span class='flex items-center'>
					<span>Overview</span>
					<RightIcon theme='outline' size='16' fill='#737373' />
					<span class='text-neutral-500'>{{ name }}</span>
				</span>
			</template>
		</Dock>
		<div class='overflow-auto'>
			<div class='flex overflow-auto p-8'>
				<div class='w-0.5 bg-neutral-200 self-stretch min-w-fit' />
				<div class='space-y-8'>
					<div v-for='(partition, index) in partitions' :key='partition.id' class='space-y-8 overflow-auto'>
						<div class='flex items-start space-x-4'>
							<div class='flex items-center'>
								<div class='h-0.5 w-4 bg-neutral-200' />
								<div
									class='w-fit px-2 py-1 rounded-full bg-stripes bg-stripes-blue-100 border-blue-600 border flex items-center justify-center space-x-1'
								>
									<ThreeSlashesIcon theme='filled' size='12' fill='#2563eb' />
									<p class='text-blue-600 text-sm font-bold'>{{ index }}</p>
								</div>
							</div>
							<div class='space-y-8'>
								<div class='space-y-1'>
									<h4 class='font-bold text-neutral-700'>
										{{ partition.attributes.name }}
									</h4>
									<div class='flex items-center space-x-1'>
										<VenustTooltip>
											<template #reference>
												<TargetIcon theme='outline' size='16' fill='#737373' />
											</template>
											<template #tooltip>
												Partition description
											</template>
										</VenustTooltip>
										<p class='text-neutral-500 font-medium text-sm'>
											{{ partition.attributes.description }}</p>
									</div>
								</div>
								<div class='space-y-2'>
									<div
										class='flex items-center justify-center space-x-1 w-fit'
									>
										<BookOneIcon theme='outline' size='16' fill='#737373' />
										<p class='font-semibold text-neutral-500 uppercase'>{{ partition.attributes.topics.data.length
											}}
											Topics</p>
									</div>
									<div
										class='flex flex-wrap gap-2'
									>
										<div class='space-x-2 flex items-center group'
											 v-for='topic in partition.attributes.topics.data'>
											<router-link
												:to='`/workspace/${topic.id}`'
												:key='topic.id'
												class='relative w-fit flex justify-between items-center space-x-8 bg-white border rounded-full py-1 px-2 transition hover:brightness-95 active:scale-95'
												:class='{"border-rose-600 border-2 bg-stripes bg-stripes-rose-100": currentIsTopic && currentTopicOrQuizId === topic.id}'
											>
												<p
													class='text-sm font-medium'
													:class='{"text-neutral-500": checkTopicIsDone(topic.id)}'
												>
													{{ topic.attributes.title }}
												</p>
												<div class='flex space-x-2 items-center'>
													<VenustTooltip>
														<template #reference>
															<BookOneIcon theme='outline' size='16' :fill='checkTopicIsDone(topic.id) ? "#737373" : "#ea580c"'/>
														</template>
														<template #tooltip>
															Topic
														</template>
													</VenustTooltip>
													<VenustTooltip>
														<template #reference>
															<CheckIcon theme='outline' size='16' fill='#2563eb' v-if='checkTopicIsDone(topic.id)'/>
														</template>
														<template #tooltip>
															Completed
														</template>
													</VenustTooltip>
												</div>
												<div class='absolute px-1 right-0 top-0 text-xs text-white bg-rose-600 w-fit rounded-full -translate-y-1/2 translate-x-1/4' v-if='currentIsTopic && currentTopicOrQuizId === topic.id'>Next</div>
											</router-link>
											<ArrowRightIcon theme='outline' size='12' fill='#737373'
															class='group-last:hidden' />
										</div>
									</div>
								</div>
								<div class='space-y-2' v-if='partition?.attributes?.quiz?.data'>
									<div
										class='flex items-center justify-center space-x-1 w-fit'
									>
										<PencilIcon theme='outline' size='16' fill='#737373' />
										<p class='text-neutral-500 font-semibold uppercase'>Quiz</p>
									</div>
									<div
										class='flex flex-wrap gap-2'
									>
										<router-link
											:to='`/quizzes/${partition?.attributes?.quiz?.data?.id}`'
											class='relative w-fit flex justify-between items-center space-x-8 bg-white border rounded-full py-1 px-2 transition hover:brightness-95 active:scale-95'
											:class='{"border-rose-600 border-2 bg-stripes bg-stripes-rose-100": currentIsQuiz && currentTopicOrQuizId === partition?.attributes?.quiz?.data?.id}'
										>
											<p
												class='text-sm font-medium'
												:class='{"text-neutral-500": checkQuizIsDone(partition?.attributes?.quiz?.data?.id)}'
											>
												{{ partition?.attributes?.quiz?.data?.attributes?.name }}
											</p>
											<div class='flex space-x-2 items-center'>
												<VenustTooltip>
													<template #reference>
														<PencilIcon theme='outline' size='16' :fill='checkTopicIsDone(partition?.attributes?.quiz?.data?.id) ? "#737373" : "#e11d48"'/>
													</template>
													<template #tooltip>
														Topic
													</template>
												</VenustTooltip>
												<VenustTooltip>
													<template #reference>
														<CheckIcon theme='outline' size='16' fill='#2563eb' v-if='checkQuizIsDone(partition?.attributes?.quiz?.data?.id)'/>
													</template>
													<template #tooltip>
														Completed
													</template>
												</VenustTooltip>
											</div>
											<div class='absolute px-1 right-0 top-0 text-xs text-white bg-rose-600 w-fit rounded-full -translate-y-1/2 translate-x-1/4' v-if='currentIsQuiz && currentTopicOrQuizId === partition?.attributes?.quiz?.data?.id'>Next</div>
										</router-link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Index>
</template>

<script setup>
import {
	Box as BoxIcon,
	Right as RightIcon,
	ThreeSlashes as ThreeSlashesIcon,
	Target as TargetIcon,
	BookOne as BookOneIcon,
	Pencil as PencilIcon,
	ArrowRight as ArrowRightIcon,
	Check as CheckIcon,
} from '@icon-park/vue-next';
import { computed } from 'vue';
import Index from '@/layouts/utils/index.vue';
import Dock from '@/layouts/dock/dock.vue';
import { getPackage } from '@/api/package.js';
import { useMyStore } from '@/store/me.js';
import { storeToRefs } from 'pinia';
import VenustTooltip from '@/components/venust/tooltip/venustTooltip.vue';
import { useRouteParams } from '@vueuse/router';

const myStore = useMyStore();
const { completedTopics, completedQuizzes, currentTopicOrQuiz, currentType } = storeToRefs(myStore);

const packageId = useRouteParams('packageId');

const packageResponse = getPackage(packageId, {
	populate: {
		partitions: {
			populate: {
				topics: true,
				quiz: true,
			},
		},
	},
});

const pack = computed(() => {
	return packageResponse.data.value?.data?.attributes;
});

const name = computed(() => {
	return pack.value?.name;
});

const partitions = computed(() => {
	return pack.value?.partitions?.data;
});

const partitionsCount = computed(() => {
	return partitions.value?.length;
});

function checkTopicIsDone(topicId) {
	if (topicId && completedTopics.value) {
		return completedTopics.value.some((topic) => topic.id === topicId);
	} else {
		return false;
	}
}

function checkQuizIsDone(quizId) {
	if (quizId && completedQuizzes.value) {
		return completedQuizzes.value.some((topic) => topic.id === quizId);
	} else {
		return false;
	}
}

const currentIsTopic = computed(() => {
	return currentType.value === "topic"
});

const currentIsQuiz = computed(() => {
	return currentType.value === "quiz";
});

const currentTopicOrQuizId = computed(() => {
	return currentTopicOrQuiz.value.id;
});
</script>
