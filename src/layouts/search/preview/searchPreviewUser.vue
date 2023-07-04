<template>
	<div class="space-y-8">
		<div class="flex items-start justify-between">
			<div class="flex items-start space-x-4">
				<div class="rounded-full border border-blue-600 bg-white p-2">
					<UserIcon theme="filled" size="16" fill='#404040'/>
				</div>
				<div>
					<h6 class="font-semibold text-neutral-700">
						{{ displayName }}
					</h6>
					<div class="flex items-center space-x-1">
						<AtSignIcon theme='outline' size='16' fill='#737373' />
						<p class="text-sm text-neutral-700">{{ username }}</p>
					</div>
				</div>
			</div>
			<div>
				<router-link :to="`/users/${username}`">
					<VenustAvatar :user-id="id" size="xs" />
				</router-link>
			</div>
		</div>
		<div
			class="w-full space-y-4 rounded-lg border bg-neutral-100 px-4 py-2"
		></div>
		<div class="space-y-1">
			<div class="flex items-center justify-between">
				<p class="text-sm font-bold uppercase text-neutral-500">
					Location
				</p>
				<LocalPinIcon theme='outline' size='16' fill='#737373' />
			</div>
			<p class="text-sm medium capitalize text-neutral-500">
				{{ location }}
			</p>
		</div>
		<div class="space-y-1" v-if="birthday">
			<div class="flex items-center justify-between">
				<p class="text-sm font-bold uppercase text-neutral-500">
					Birthday
				</p>
				<BirthdayCakeIcon theme='outline' size='16' fill='#737373' />
			</div>
			<p class="text-sm medium capitalize text-neutral-500">
				{{ birthdayDateString }}
			</p>
		</div>
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<p class="text-sm font-bold uppercase text-neutral-500">
					Contact details
				</p>
				<PhoneTelephoneIcon outline='theme' size='16' fill='#737373'/>
			</div>
			<div class="flex items-center space-x-1">
				<VenustTooltip>
					<template #reference>
						<AtSignIcon outline='theme' size='16' fill='#737373' />
					</template>
					<template #tooltip>Packill username</template>
				</VenustTooltip>
				<p class='text-sm font-medium text-neutral-500'>{{ username }}</p>
			</div>
		</div>
		<div class="space-y-2" v-if="bio">
			<div class="flex items-center justify-between">
				<p class="text-sm font-bold uppercase text-neutral-500">
					Biography
				</p>
			</div>
			<p class="text-justify text-sm font-medium text-neutral-500">
				{{ bio }}
			</p>
		</div>
	</div>
</template>

<script setup>
import {
	User as UserIcon,
	AtSign as AtSignIcon,
	BirthdayCake as BirthdayCakeIcon,
	LocalPin as LocalPinIcon,
	PhoneTelephone as PhoneTelephoneIcon,
} from '@icon-park/vue-next';
import { computed, toRefs } from 'vue';
import VenustAvatar from '@/components/venust/avatar/venustAvatar.vue';
import moment from 'moment';
import VenustTooltip from '@/components/venust/tooltip/venustTooltip.vue';

const props = defineProps({
	userObject: Object,
});

const { userObject } = toRefs(props);

const id = computed(() => {
	return userObject.value.id;
});

const displayName = computed(() => {
	return userObject.value.displayName;
});

const username = computed(() => {
	return userObject.value.username;
});

const bio = computed(() => {
	return userObject.value.bio;
});

const location = computed(() => {
	return userObject.value.location;
});

const birthday = computed(() => {
	if (props.userObject.birthday) {
		return new Date(props.userObject.birthday);
	}
});

const birthdayDateString = computed(() => {
	if (birthday.value) {
		return moment(birthday.value).format('L');
	}
});
</script>
