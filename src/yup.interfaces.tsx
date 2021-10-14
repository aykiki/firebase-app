import type { Asserts } from 'yup';
import {
  userSchemaEditInfo,
  passwordSchema,
  postSchema,
  userSchema,
  userSchemaRegistration,
} from './yup.schemas';

export interface IUser
  extends Asserts<typeof userSchemaRegistration> {}

export interface IUserAuthInfo extends Asserts<typeof userSchema> {}
export interface IUserInfo extends Asserts<typeof userSchemaEditInfo> {}
export interface IPassword extends Asserts<typeof passwordSchema> {}
export interface IPostForm extends Asserts<typeof postSchema> {}
