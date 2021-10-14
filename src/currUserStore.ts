import { createEvent, createStore } from 'effector';
import { User } from 'firebase/auth';

const pushCurrentUser = createEvent<User>();
const clearCurrentUser = createEvent();

const $currentUser = createStore<User | null>(null)
	.on(pushCurrentUser, ( _, user) => user)
	.on(clearCurrentUser, () => null);

export { $currentUser, pushCurrentUser, clearCurrentUser };