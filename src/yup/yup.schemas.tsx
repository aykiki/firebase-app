import * as yup from 'yup';

export const passwordSchema = yup.object({
  password: yup
    .string()
    .required('Field is required')
    .min(8, 'Password is too short. Should be 8 chars minimum'),
});

export const userSchema = yup.object({
  email: yup.string().email().required('Field is required'),
  password: yup
    .string()
    .required('Field is required')
    .min(8, 'Password is too short. Should be 8 chars minimum'),
});

export const userSchemaRegistration = yup.object({
  email: yup.string().email().required('Field is required'),
  password: yup
    .string()
    .required('Field is required')
    .min(8, 'Password is too short. Should be 8 chars minimum'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must be the same'),
});

export const userSchemaEditInfo = yup.object({
  email: yup.string().email().required('Field is required'),
  displayName: yup.string(),
  photoURL: yup.string(),
});

export const postSchema = yup.object({
  title: yup.string().required('Field id required'),
  description: yup.string().required('Field id required'),
  photoURL: yup.string(),
  mainText: yup.string().required('Field is required'),
});

export const commentSchema = yup.object({
  mainText: yup.string().required('Field is required'),
});
