<template>
	<div class="flex items-start space-x-2 group">
		<div class="flex flex-col items-center self-stretch">
			<div class="h-1.5 w-0.5 bg-neutral-200 group-first:invisible" />
			<div
				class="w-fit rounded-full bg-blue-600 p-1"
			>
				<slot name="icon" />
			</div>
			<div class="h-full w-0.5 bg-neutral-200" />
		</div>
		<div class="flex-1 space-y-2 border-b pb-4 pt-1.5">
			<p class="text-sm font-semibold text-neutral-700">
				<slot name="message" />
			</p>
			<div class='flex space-x-2 items-center'>
				<p class="text-xs font-medium text-neutral-500">
					<slot name="createdAtDate" />
				</p>
				<DotIcon theme='filled' size='8' fill='#737373'/>
				<p class="text-xs font-medium text-neutral-500">
					<slot name="createdAtTime" />
				</p>
			</div>

			<slot name="details" />
		</div>
	</div>
</template>

<script setup>
import { Dot as DotIcon } from '@icon-park/vue-next';
</script>
