/** Shared TypeScript types for the ChatSupport frontend. */

export enum SenderType {
	BOT = 'BOT',
	USER = 'USER',
	AGENT = 'AGENT',
	CONTACT = 'CONTACT'
}

export enum SessionStatus {
	ACTIVE = 'ACTIVE',
	WAITING = 'WAITING',
	CLOSED = 'CLOSED',
	BOT = 'BOT'
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
	avatarUrl?: string;
	notes?: string;
}

export interface Message {
	readonly id: string;
	sessionId: string;
	senderType: SenderType;
	content: string;
	createdAt: string;
}

export interface Session {
	readonly id: string;
	contactId: string;
	contact: Contact;
	messages: Message[];
	status: SessionStatus;
	bot_state?: string;
	updatedAt: string;
}
