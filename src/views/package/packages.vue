<template>
	<Index>
		<div class="flex h-full flex-col">
			<Dock>
				<template #icon>
					<BoxIcon theme="filled" size="16" fill="#262626"/>
				</template>
				<template #path>
					Packages
				</template>
			</Dock>
			<div class="flex-1 flex space-x-4 p-8 overflow-auto">
				<transition-group
					name="list"
					tag="div"
					class="flex-1 grid gap-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 h-fit"
				>
					<router-link
						:to="`/packages/${pack.id}`"
						:key="pack.id"
						v-for="pack in packsFiltered"
						class="block"
					>
						<PackageCard :key="pack.id" :package-id="pack.id" />
					</router-link>
				</transition-group>
				<div class="h-fit justify-between rounded-xl border bg-white">
					<div
						class="flex items-center justify-between border-b px-4 py-2"
					>
						<p class="text-sm font-bold uppercase text-neutral-500">
							Filters
						</p>
						<div class="flex items-center space-x-1">
							<VenustNumberBadge>
								{{ packsFilteredCount.toFixed(0) }}
							</VenustNumberBadge>
							<FunnelIcon class="h-4 w-4 text-neutral-500" />
						</div>
					</div>
					<div class="w-[250px] space-y-1 p-4">
						<label
							class="text-sm font-medium tracking-wide text-neutral-500"
						>
							Areas
						</label>
						<MultiAreaSelector
							class="flex flex-wrap gap-2"
							@model="getAreasSelected"
						/>
					</div>
				</div>
			</div>
		</div>
	</Index>
</template>

<script setup>
import { Box as BoxIcon } from '@icon-park/vue-next'
import Index from '@/layouts/utils/index.vue';
import { FunnelIcon } from '@heroicons/vue/24/solid';
import { getPackages } from '@/api/package.js';
import { computed, onUnmounted, ref, watch } from 'vue';
import Dock from '@/layouts/dock/dock.vue';
import PackageCard from '@/layouts/package/packageCard.vue';
import MultiAreaSelector from '@/components/pile/multiAreaSelector.vue';
import VenustNumberBadge from '@/components/venust/badge/venustBadge.vue';

const packageResponse = getPackages({
	fields: ['id'],
	populate: ['areas'],
});

const packageLoading = computed(() => {
	return packageResponse.isFetching.value;
});
const packs = computed(() => {
	return packageResponse.data?.value?.data;
});

const packsFiltered = ref([]);
// Update packsFiltered when data is fetched
watch(packageLoading, (newState, oldState) => {
	if (newState === false && oldState === true) {
		packsFiltered.value = packs.value;
	}
});

const packsFilteredCount = computed(() => {
	return packsFiltered.value?.length || 0
});

const areasSelected = ref();
function getAreasSelected(value) {
	areasSelected.value = value;
}

watch(areasSelected, () => {
	filterPackages();
});

function filterPackages() {
	if (areasSelected.value.length) {
		packsFiltered.value = packs.value.filter((pack) =>
			pack.attributes.areas.data.some((area) =>
				areasSelected.value.includes(area.id),
			),
		);
	} else {
		packsFiltered.value = packs.value;
	}
}

onUnmounted(() => {
	if (packageResponse.canAbort.value) {
		packageResponse.abort();
	}
});
</script>
