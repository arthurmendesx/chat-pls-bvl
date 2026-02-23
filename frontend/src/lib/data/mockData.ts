import {
	type Contact,
	type Message,
	type Conversation,
	MessageSender,
	ConversationStatus
} from '$lib/types';

export const mockContacts: Contact[] = [
	{
		id: '1',
		name: 'Sarah Johnson',
		phone: '+1 (555) 123-4567',
		initials: 'SJ',
		isOnline: true,
		lastMessage: 'I need help with my recent order',
		avatarColor: 'bg-emerald-600'
	},
	{
		id: '2',
		name: 'Michael Chen',
		phone: '+1 (555) 234-5678',
		initials: 'MC',
		isOnline: true,
		lastMessage: 'Thanks for your help!',
		avatarColor: 'bg-blue-600'
	},
	{
		id: '3',
		name: 'Emma Williams',
		phone: '+1 (555) 345-6789',
		initials: 'EW',
		isOnline: true,
		lastMessage: 'Can I change my shipping address?',
		avatarColor: 'bg-purple-600'
	},
	{
		id: '4',
		name: 'James Martinez',
		phone: '+1 (555) 456-7890',
		initials: 'JM',
		isOnline: true,
		lastMessage: 'When will my package arrive?',
		avatarColor: 'bg-amber-600'
	},
	{
		id: '5',
		name: 'Lisa Anderson',
		phone: '+1 (555) 567-8901',
		initials: 'LA',
		isOnline: true,
		lastMessage: 'I received the wrong item',
		avatarColor: 'bg-rose-600'
	},
	{
		id: '6',
		name: 'David Thompson',
		phone: '+1 (555) 678-9012',
		initials: 'DT',
		isOnline: true,
		lastMessage: 'How do I track my order?',
		avatarColor: 'bg-cyan-600'
	},
	{
		id: '7',
		name: 'Maria Garcia',
		phone: '+1 (555) 789-0123',
		initials: 'MG',
		isOnline: true,
		lastMessage: 'Is there a warranty on this product?',
		avatarColor: 'bg-indigo-600'
	},
	{
		id: '8',
		name: 'Robert Taylor',
		phone: '+1 (555) 890-1234',
		initials: 'RT',
		isOnline: true,
		lastMessage: 'Perfect, thank you!',
		avatarColor: 'bg-teal-600'
	}
];

export const mockMessages: Message[] = [
	{
		id: 'm1',
		conversationId: '1',
		sender: MessageSender.BOT,
		content:
			"Hello! I'd be happy to help you with your order. Could you please provide your order number?",
		timestamp: '10:23 AM'
	},
	{
		id: 'm2',
		conversationId: '1',
		sender: MessageSender.USER,
		content: 'Hi, I need help with my recent order.',
		timestamp: '10:23 AM'
	},
	{
		id: 'm3',
		conversationId: '1',
		sender: MessageSender.USER,
		content: "It's order #12345",
		timestamp: '10:24 AM'
	},
	{
		id: 'm4',
		conversationId: '1',
		sender: MessageSender.BOT,
		content:
			'Thank you! I found your order. It looks like it was shipped yesterday and should arrive within 3-5 business days. Is there anything specific you need help with?',
		timestamp: '10:24 AM'
	},
	{
		id: 'm5',
		conversationId: '1',
		sender: MessageSender.USER,
		content:
			'Actually, I need to change the shipping address. I made a mistake when ordering.',
		timestamp: '10:25 AM'
	},
	{
		id: 'm6',
		conversationId: '1',
		sender: MessageSender.BOT,
		content:
			'I understand you need to update the shipping address. Let me connect you with a customer service representative who can help you with this.',
		timestamp: '10:25 AM'
	}
];

export const mockConversation: Conversation = {
	id: 'c1',
	contact: mockContacts[0],
	messages: mockMessages,
	status: ConversationStatus.WAITING,
	waitingTime: 'Waiting for 5 min'
};
