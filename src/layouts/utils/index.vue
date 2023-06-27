<template>
	<div class="h-full w-full bg-stone-50">
		<div class="flex h-full min-h-fit w-full">
			<Menubar class="hidden sm:flex" />
			<div class="flex-1 overflow-auto">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup>
import Menubar from '@/layouts/menuBar/navBar.vue';
</script>
