<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ChatArea from '$lib/components/ChatArea.svelte';
	import ContactProfile from '$lib/components/ContactProfile.svelte';
	import { mockContacts, mockConversation } from '$lib/data/mockData';
	import type { Contact } from '$lib/types';

	let activeContactId = $state(mockContacts[0].id);

	function handleSelectContact(contact: Contact): void {
		activeContactId = contact.id;
	}
</script>

<svelte:head>
	<title>ChatSupport — Customer Service Dashboard</title>
	<meta name="description" content="Omnichannel customer service dashboard" />
</svelte:head>

<div class="flex h-screen w-screen overflow-hidden bg-gray-50">
	<!-- Left Column: Sidebar -->
	<Sidebar
		contacts={mockContacts}
		{activeContactId}
		onSelectContact={handleSelectContact}
	/>

	<!-- Center Column: Chat Area -->
	<ChatArea conversation={mockConversation} />

	<!-- Right Column: Contact Profile -->
	<ContactProfile contact={mockConversation.contact} />
</div>
