<template>
	<button
		class='relative'
		@click='toggle'
	>
		<slot />
	</button>
	<div>
		<transition name='fade'>
			<div
				class='fixed left-0 top-0 z-50 h-screen w-screen backdrop-blur backdrop-brightness-90'
				v-show='isActive'
			>
				<div
					class='absolute left-1/2 top-1/2 flex h-[80%] w-[1040px] -translate-x-1/2 -translate-y-1/2 flex-col space-y-4'
					v-on-click-outside='close'
				>
					<ais-instant-search
						:search-client='searchClient'
						index-name='package'
						class='flex flex-1 flex-col space-y-4 overflow-auto'
					>
						<ais-search-box>
							<template
								v-slot='{
								currentRefinement,
								isSearchStalled,
								refine,
							}'
							>
								<div class='flex items-center'>
									<div
										class='rounded-l-lg border border-r-0 border-gray-300 bg-neutral-50 px-2 py-2 shadow-sm'
									>
										<SearchIcon theme='outline' size='24' fill='#737373' />
									</div>
									<input
										v-focus
										placeholder='Search everything'
										type='search'
										class='input rounded-r-lg'
										:value='currentRefinement'
										@input='refine($event.currentTarget.value)'
									/>
								</div>
							</template>
						</ais-search-box>
						<div
							class='flex max-h-full flex-1 divide-x overflow-auto rounded-xl border bg-neutral-50 shadow'
						>
							<div class='flex h-full w-1/2 flex-col divide-y'>
								<div class='space-y-2 p-4'>
									<p
										class='text-xs font-bold uppercase text-neutral-500'
									>
										What are you looking for?
									</p>
									<MultiTagSelector
										:tags='categories'
										class='flex flex-wrap gap-2'
										@model='getCategories'
									/>
								</div>
								<div class='flex-1 space-y-4 overflow-auto p-4'>
									<ais-index
										index-name='package'
										v-if="isCategoryNeeded('package')"
									>
										<ais-state-results>
											<template
												v-slot='{
												results: { hits, query },
											}'
											>
												<div class='space-y-1'>
													<div
														class='flex items-center justify-between'
													>
														<p
															class='text-xs font-bold uppercase text-neutral-500'
														>
															Packages
														</p>
														<ais-stats
															v-slot='{ nbHits }'
														>
															<VenustBadge>
																{{ nbHits }}
															</VenustBadge>
														</ais-stats>
													</div>
													<ais-hits
														v-if='hits.length > 0'
													>
														<template
															v-slot='{
															items,
															sendEvent,
														}'
														>
															<ul>
																<li
																	v-for='item in items'
																	:key='
																	item._meilisearch_id
																'
																	class='flex items-center space-x-2 rounded-lg bg-neutral-50 px-4 py-1 hover:brightness-95'
																	:id='`result-${item._meilisearch_id}`'
																	@click='
																	setIndexSelected(
																		`result-${item._meilisearch_id}`,
																	);
																	selectLi(
																		`result-${item._meilisearch_id}`,
																	);
																	setResultSelected(
																		item,
																	);
																'
																	@dblclick='
																	router.push(
																		`/packages/${item.id}`,
																	);
																	close();
																'
																>
																<span
																	class='h-3 w-3 rounded-bl border-b-2 border-l-2 border-neutral-300'
																/>
																	<BoxIcon theme='filled' size='16' fill='#404040' />
																	<div>
																		<label
																			class='font-medium text-neutral-700'
																		>
																			{{
																				item.name
																			}}
																		</label>
																	</div>
																</li>
															</ul>
														</template>
													</ais-hits>
												</div>
											</template>
										</ais-state-results>
									</ais-index>
									<ais-index
										index-name='topic'
										v-if="isCategoryNeeded('topic')"
									>
										<ais-state-results>
											<template
												v-slot='{
												results: { hits, query },
											}'
											>
												<div class='space-y-1'>
													<div
														class='flex items-center justify-between'
													>
														<p
															class='text-xs font-bold uppercase text-neutral-500'
														>
															Topics
														</p>
														<ais-stats
															v-slot='{ nbHits }'
														>
															<VenustBadge>
																{{ nbHits }}
															</VenustBadge>
														</ais-stats>
													</div>
													<ais-hits
														v-if='hits.length > 0'
													>
														<template
															v-slot='{
															items,
															sendEvent,
														}'
														>
															<ul>
																<li
																	v-for='item in items'
																	:key='
																	item._meilisearch_id
																'
																	class='flex items-center space-x-2 rounded-lg bg-neutral-50 px-4 py-1 hover:brightness-95'
																	:id='`result-${item._meilisearch_id}`'
																	@click='
																	setIndexSelected(
																		`result-${item._meilisearch_id}`,
																	);
																	selectLi(
																		`result-${item._meilisearch_id}`,
																	);
																	setResultSelected(
																		item,
																	);
																'
																	@dblclick='
																	router.push(
																		`/workspace/${item.id}`,
																	);
																	close();
																'
																>
																<span
																	class='h-3 w-3 rounded-bl border-b-2 border-l-2 border-neutral-300'
																/>
																	<BookOneIcon theme='filled' size='16'
																				 fill='#404040' />
																	<div>
																		<label
																			class='font-medium text-neutral-700'
																		>
																			{{
																				item.title
																			}}
																		</label>
																	</div>
																</li>
															</ul>
														</template>
													</ais-hits>
												</div>
											</template>
										</ais-state-results>
									</ais-index>
									<ais-index
										index-name='knowledge'
										v-if="isCategoryNeeded('knowledge')"
									>
										<ais-state-results>
											<template
												v-slot='{
												results: { hits, query },
											}'
											>
												<div class='space-y-1'>
													<div
														class='flex items-center justify-between'
													>
														<p
															class='text-xs font-bold uppercase text-neutral-500'
														>
															Knowledge
														</p>
														<ais-stats
															v-slot='{ nbHits }'
														>
															<VenustBadge>
																{{ nbHits }}
															</VenustBadge>
														</ais-stats>
													</div>
													<ais-hits
														v-if='hits.length > 0'
													>
														<template
															v-slot='{
															items,
															sendEvent,
														}'
														>
															<ul>
																<li
																	v-for='item in items'
																	:key='
																	item._meilisearch_id
																'
																	class='flex items-center space-x-2 rounded-lg bg-neutral-50 px-4 py-1 hover:brightness-95'
																	:id='`result-${item._meilisearch_id}`'
																	@click='
																	setIndexSelected(
																		`result-${item._meilisearch_id}`,
																	);
																	selectLi(
																		`result-${item._meilisearch_id}`,
																	);
																	setResultSelected(
																		item,
																	);
																'
																>
																<span
																	class='h-3 w-3 rounded-bl border-b-2 border-l-2 border-neutral-300'
																/>
																	<TipsIcon theme='filled' size='16' fill='#404040'/>
																	<div>
																		<label
																			class='font-medium text-neutral-700'
																		>
																			{{
																				item.title
																			}}
																		</label>
																	</div>
																</li>
															</ul>
														</template>
													</ais-hits>
												</div>
											</template>
										</ais-state-results>
									</ais-index>
									<ais-index
										index-name='user'
										v-if="isCategoryNeeded('user')"
									>
										<ais-state-results>
											<template
												v-slot='{
												results: { hits, query },
											}'
											>
												<div class='space-y-1'>
													<div
														class='flex items-center justify-between'
													>
														<p
															class='text-xs font-bold uppercase text-neutral-500'
														>
															People
														</p>
														<ais-stats
															v-slot='{ nbHits }'
														>
															<VenustBadge>
																{{ nbHits }}
															</VenustBadge>
														</ais-stats>
													</div>
													<ais-hits
														v-if='hits.length > 0'
													>
														<template
															v-slot='{
															items,
															sendEvent,
														}'
														>
															<ul
																class='flex flex-wrap'
															>
																<li
																	v-for='item in items'
																	:key='
																	item._meilisearch_id
																'
																	class='space-y-1 rounded-lg bg-neutral-50 px-2 py-1 hover:brightness-95'
																	:id='`result-${item._meilisearch_id}`'
																	@click='
																	setIndexSelected(
																		`result-${item._meilisearch_id}`,
																	);
																	selectLi(
																		`result-${item._meilisearch_id}`,
																	);
																	setResultSelected(
																		item,
																	);
																'
																>
																	<VenustAvatar
																		:user-id='
																		item.id
																	'
																	/>
																	<div
																		class='flex flex-col'
																	>
																		<label
																			class='text-center font-medium text-neutral-700'
																		>
																			{{
																				item.displayName
																			}}
																		</label>
																		<div
																			class='flex w-full items-center justify-center space-x-0.5'
																		>
																			<AtSignIcon theme='outline' size='12'
																						fill='#404040' />
																			<label
																				class='text-center text-xs'
																			>
																				{{
																					item.username
																				}}
																			</label>
																		</div>
																	</div>
																</li>
															</ul>
														</template>
													</ais-hits>
												</div>
											</template>
										</ais-state-results>
									</ais-index>
								</div>
							</div>
							<div class='flex-1 overflow-auto p-4'>
								<SearchPreview
									:category='resultSelectedCategory'
									:item='resultSelected'
								/>
							</div>
						</div>
					</ais-instant-search>
					<div class='flex h-max items-center justify-between'>
						<div
							class='flex w-fit items-center space-x-4 rounded-xl border bg-neutral-50 p-4 shadow'
						>
							<div class='flex items-center space-x-1'>
								<label
									class='rounded border border-blue-600 px-1 text-xs shadow transition'
								>
									Enter
								</label>
								<p
									class='text-xs font-medium tracking-wide text-neutral-500'
								>
									to select
								</p>
							</div>
							<div class='flex items-center space-x-1'>
								<div class='flex items-center space-x-0.5'>
									<label
										class='rounded border border-blue-600 px-1 text-xs shadow transition'
									>
										<ArrowUpIcon theme='outline' size='12' fill='#404040'/>
									</label>
									<label
										class='rounded border border-blue-600 px-1 text-xs shadow transition'
									>
										<ArrowDownIcon theme='outline' size='12' fill='#404040'/>
									</label>
								</div>
								<p
									class='text-xs font-medium tracking-wide text-neutral-500'
								>
									to navigate
								</p>
							</div>
							<div class='flex items-center space-x-1'>
								<label
									class='rounded border border-blue-600 px-1 text-xs shadow transition'
								>
									Esc
								</label>
								<p
									class='text-xs font-medium tracking-wide text-neutral-500'
								>
									to close
								</p>
							</div>
						</div>
						<div
							class='flex w-fit items-center space-x-1 rounded-xl border bg-neutral-50 px-4 py-2 shadow'
						>
							<p
								class='text-xs font-medium tracking-wide text-neutral-500'
							>
								Powered by
							</p>
							<a href='https://www.meilisearch.com'>
								<img
									src='../../assets/img/providers/meilisearch.png'
									alt='Meilisearch'
									class='h-8 w-8'
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import {
	AtSign as AtSignIcon,
	Search as SearchIcon,
	Box as BoxIcon,
	BookOne as BookOneIcon,
	Tips as TipsIcon,
	ArrowUp as ArrowUpIcon,
	ArrowDown as ArrowDownIcon,
} from '@icon-park/vue-next';
import MultiTagSelector from '@/components/pile/multiTagSelector.vue';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import VenustBadge from '@/components/venust/badge/venustBadge.vue';
import { computed, ref } from 'vue';
import { onKeyStroke, useMagicKeys, whenever } from '@vueuse/core';
import { vOnClickOutside } from '@vueuse/components';
import SearchPreview from '@/layouts/search/preview/searchPreview.vue';
import VenustAvatar from '@/components/venust/avatar/venustAvatar.vue';
import router from '@/router/index.js';

const searchClient = instantMeiliSearch(
	'http://localhost:7700',
	'h9kyooq_Lz4KhOZrnlVxoL7mGaSjyVqmcRNnwBPKRJw',
	{
		placeholderSearch: false,
	},
);

const isActive = ref(false);

function toggle() {
	isActive.value = !isActive.value;
}

function close() {
	isActive.value = false;
}

const keys = useMagicKeys();

whenever(keys.ctrl_k, (isPressed) => {
	if (isPressed) {
		toggle();
	}
});

onKeyStroke('Escape', (e) => {
	e.preventDefault();
	close();
});

const resultsLiIndexSelected = ref(-1);
const resultSelected = ref();
const resultSelectedCategory = computed(() => {
	return resultSelected.value?._meilisearch_id?.split('-')[0];
});

function setIndexSelected(id) {
	const resultsLi = document.querySelectorAll('li');
	const resultsLiArray = Array.from(resultsLi);
	resultsLiIndexSelected.value = resultsLiArray.findIndex(
		(el) => el.id === id,
	);
}

function setResultSelected(item) {
	resultSelected.value = item;
}

function selectLi(id) {
	const resultsLi = document.querySelectorAll('[id^="result-"]');

	resultsLi.forEach((el) => {
		const elChildren = document.querySelectorAll(`#${el.id} *`);
		if (el.id === id) {
			el.style.background = '#2563eb'; //bg-blue-600
			elChildren.forEach((el) => {
				el.style.color = '#ffffff'; //bg-white
			});
		} else {
			el.style.background = 'transparent';
			el.style.background = '#fafafa';
			elChildren.forEach((el) => {
				el.style.color = '#404040'; //text-neutral-700
			});
		}
	});
}

onKeyStroke('ArrowDown', (e) => {
	e.preventDefault();
	const resultsLi = document.querySelectorAll('[id^="result-"]');
	if (resultsLi.length >= 0) {
		if (resultsLiIndexSelected.value >= resultsLi.length - 1) {
			resultsLiIndexSelected.value = 0;
		} else {
			++resultsLiIndexSelected.value;
		}

		const resultSelectedId = resultsLi[resultsLiIndexSelected.value].id;
		document.getElementById(resultSelectedId).click();
	}
});

onKeyStroke('ArrowUp', (e) => {
	e.preventDefault();
	const resultsLi = document.querySelectorAll('[id^="result-"]');
	if (resultsLi.length >= 0) {
		if (resultsLiIndexSelected.value <= 0) {
			resultsLiIndexSelected.value = resultsLi.length - 1;
		} else {
			--resultsLiIndexSelected.value;
		}

		const resultSelectedId = resultsLi[resultsLiIndexSelected.value].id;
		document.getElementById(resultSelectedId).click();
	}
});

const categories = [
	{
		name: 'Area',
		value: 'area',
	},
	{
		name: 'Knowledge',
		value: 'knowledge',
	},
	{
		name: 'Package',
		value: 'package',
	},
	{
		name: 'Problem',
		value: 'problem',
	},
	{
		name: 'Topic',
		value: 'topic',
	},
	{
		name: 'User',
		value: 'user',
	},
];

const selectedCategories = ref([]);

function getCategories(value) {
	selectedCategories.value = value;
}

function isCategoryNeeded(category) {
	return (
		selectedCategories.value.includes(category) ||
		!selectedCategories.value.length
	);
}
</script>
