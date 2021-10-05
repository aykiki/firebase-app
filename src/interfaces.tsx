import * as yup from 'yup';
import type { Asserts } from 'yup';

export const userSchemaWithConfirmationPassword = yup.object({
  email: yup.string().email().required('Field is required'),
  password: yup
    .string()
    .required('Field is required')
    .min(8, 'Password is too short. Should be 8 chars minimum'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must be the same'),
});

export const userSchema = yup.object({
  email: yup.string().email().required('Field is required'),
  password: yup
    .string()
    .required('Field is required')
    .min(8, 'Password is too short. Should be 8 chars minimum'),
});

export const newDataUserSchema = yup.object({
  email: yup.string().email().required('Field is required'),
  displayName: yup.string(),
  photoURL: yup.string(),
});
export const passwordSchema = yup.object({
  password: yup
    .string()
    .required('Field is required')
    .min(8, 'Password is too short. Should be 8 chars minimum'),
});

export interface IUser
  extends Asserts<typeof userSchemaWithConfirmationPassword> {}

export interface IUserAuthInfo extends Asserts<typeof userSchema> {}
export interface IUserInfo extends Asserts<typeof newDataUserSchema> {}
export interface IPassword extends Asserts<typeof passwordSchema> {}

