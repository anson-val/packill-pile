<template>
	<div class='flex divide-x rounded-lg border border-transparent hover:shadow-lg hover:border-blue-600 active:scale-95 transition'>
		<div class='bg-white p-4 flex-1 space-y-4 rounded-l-lg'>
			<div class='space-y-2'>
				<h6 class='font-bold'>{{ name }}</h6>
				<VenustTooltip>
					<template #reference>
						<p class='line-clamp-3 text-xs font-medium text-neutral-700'>{{ description }}</p>
					</template>
					<template #tooltip>
						{{ description }}
					</template>
				</VenustTooltip>
			</div>
			<div class='flex items-center flex-wrap space-x-4'>
				<div class='flex space-x-1 items-center'>
					<VenustTooltip>
						<template #reference>
							<div
								class='w-fit rounded-full bg-neutral-300 p-1'
							>
								<LoadingOneIcon theme='filled' size='16' fill='#737373' />
							</div>
						</template>
						<template #tooltip>
							State
						</template>
					</VenustTooltip>
					<p class='text-xs font-medium capitalize text-neutral-500'>
						{{ state }}
					</p>
				</div>
				<div class='flex space-x-1 items-center' v-if='certificated'>
					<VenustTooltip>
						<template #reference>
							<div
								class='w-fit rounded-full bg-gradient-to-br from-blue-600 to-violet-600 p-1'
							>
								<CertificateIcon theme='filled' size='16' fill='#ffffff' />
							</div>
						</template>
						<template #tooltip>
							You will receive a certificate after completing this package.
						</template>
					</VenustTooltip>
					<p class='text-xs font-medium capitalize text-violet-600'>
						Certificated
					</p>
				</div>
			</div>
			<div class='flex space-x-1 flex-wrap'>
				<VenustTag
					v-for='area in areas'
					:style='{ color: area.attributes.primaryColor, background: area.attributes.secondaryColor, }'
				>
					{{ area.attributes.name }}
				</VenustTag>
			</div>
		</div>
		<div class='bg-slate-200 p-4 rounded-r-lg'>

		</div>
	</div>
</template>

<script setup>
import { LoadingOne as LoadingOneIcon, Certificate as CertificateIcon } from '@icon-park/vue-next';
import VenustTag from '@/components/venust/tag/venustTag.vue';
import { getPackage } from '@/api/package.js';
import { computed, onUnmounted, toRefs } from 'vue';
import VenustTooltip from '@/components/venust/tooltip/venustTooltip.vue';

const props = defineProps({
	packageId: Number,
});

const { packageId } = toRefs(props);

const packageResponse = getPackage(packageId, {
	populate: ['areas'],
});

const pack = computed(() => {
	return packageResponse.data.value?.data.attributes;
});

const name = computed(() => {
	return pack.value?.name;
});

const description = computed(() => {
	return pack.value?.description;
});

const certificated = computed(() => {
	return pack.value?.certificated;
});

const state = computed(() => {
	return pack.value?.state;
});

const areas = computed(() => {
	return pack.value?.areas?.data;
});


onUnmounted(() => {
	if (packageResponse.canAbort.value) {
		packageResponse.abort();
	}
});
</script>
