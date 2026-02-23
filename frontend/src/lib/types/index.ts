/** Shared TypeScript types for the ChatSupport frontend. */

export enum MessageSender {
	BOT = 'BOT',
	USER = 'USER',
	AGENT = 'AGENT'
}

export enum ConversationStatus {
	ACTIVE = 'ACTIVE',
	WAITING = 'WAITING',
	CLOSED = 'CLOSED'
}

export enum ContactFilter {
	ALL = 'ALL',
	BOT = 'BOT',
	WAITING = 'WAITING',
	MINE = 'MINE'
}

export interface Contact {
	readonly id: string;
	name: string;
	phone: string;
	initials: string;
	isOnline: boolean;
	lastMessage: string;
	avatarColor: string;
}

export interface Message {
	readonly id: string;
	conversationId: string;
	sender: MessageSender;
	content: string;
	timestamp: string;
}

export interface Conversation {
	readonly id: string;
	contact: Contact;
	messages: Message[];
	status: ConversationStatus;
	waitingTime: string;
}
