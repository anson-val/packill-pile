<template>
	<div>
		<div v-for="area in areas" :key="area.id">
			<input
				type="checkbox"
				class="peer hidden"
				name="areas"
				:value="area.id"
				:id="`areas-checkbox-${area?.attributes?.name}`"
				v-model="selectedAreas"
				@change="
					sendParent();
					updateTagColor(
						area?.attributes?.name,
						area?.attributes?.primaryColor,
						area?.attributes?.secondaryColor,
					);
				"
			/>
			<VenustTag
				:label-for="`areas-checkbox-${area?.attributes?.name}`"
				class="flex items-center space-x-0.5 border shadow"
				:id="`areas-label-${area?.attributes?.name}`"
			>
				<PlusIcon
					class="h-3 w-3 transition"
					:class="{ 'rotate-45': selectedAreas.includes(area.id) }"
				/>
				<span>{{ area.attributes.name }}</span>
			</VenustTag>
		</div>
	</div>
</template>

<script setup>
import VenustTag from '@/components/venust/tag/venustTag.vue';
import { PlusIcon } from '@heroicons/vue/24/outline/index.js';
import { computed, onUnmounted, ref } from 'vue';
import { getAreas } from '@/api/area.js';
const emit = defineEmits(['model']);

const areasResponse = getAreas();
const areas = computed(() => {
	return areasResponse.data?.value?.data;
});
const selectedAreas = ref([]);

function updateTagColor(tagName, textColor, bgColor) {
	const label = document.getElementById(`areas-label-${tagName}`);
	const labelAttributes = label.attributes;
	const input = document.getElementById(labelAttributes.for.value);

	if (input.checked === true) {
		label.style.background = bgColor;
		label.style.borderColor = textColor;
		label.style.color = textColor;
	} else {
		label.style.background = 'white';
		label.style.borderColor = 'inherit';
		label.style.color = 'black';
	}
}

function sendParent() {
	emit('model', selectedAreas.value);
}

onUnmounted(() => {
	if (areasResponse.canAbort.value) {
		areasResponse.abort();
	}
});
</script>
