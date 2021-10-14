import type { Asserts } from 'yup';
import {
	userSchemaEditInfo,
	passwordSchema,
	postSchema,
	userSchema,
	userSchemaRegistration,
} from './yup.schemas';

export type IUser = Asserts<typeof userSchemaRegistration>

export type IUserAuthInfo = Asserts<typeof userSchema>
export type IUserInfo = Asserts<typeof userSchemaEditInfo>
export type IPassword = Asserts<typeof passwordSchema>
export type IPostForm = Asserts<typeof postSchema>
