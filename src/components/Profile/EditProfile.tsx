import React, { useState } from 'react';
import { $currentUser } from '../../currUserStore';
import { useStore } from 'effector-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
	Alert,
	Container,
	CssBaseline,
	Box,
	Grid,
	TextField,
	Button,
	Snackbar,
	Backdrop,
	CircularProgress,
} from '@mui/material';
import { IUserInfo } from '../../yup/yup.interfaces';
import { userSchemaEditInfo } from '../../yup/yup.schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateEmail, updateProfile } from 'firebase/auth';

export const EditProfile: React.FC = () => {
	const [loader, setLoader] = useState<boolean>(false);
	const [successEdit, setSuccessEdit] = useState<boolean>(false);

	const user = useStore($currentUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUserInfo>({
		resolver: yupResolver(userSchemaEditInfo),
		defaultValues: {
			displayName: user?.displayName ?? '',
			email: user?.email ?? '',
			photoURL: user?.photoURL ?? '',
		},
	});

	const onSubmit: SubmitHandler<IUserInfo> = (data) => {
		setLoader(true);
		if (data.email !== user!.email!) {
			updateEmail(user!, data.email).then(() => setSuccessEdit(true));
		}

		if (user!.displayName! === null) {
			if (data.displayName !== '') {
				updateProfile(user!, { displayName: data.displayName }).then(() =>
					setSuccessEdit(true)
				);
			}
		} else if (data.displayName !== user!.displayName!) {
			updateProfile(user!, { displayName: data.displayName }).then(() =>
				setSuccessEdit(true)
			);
		}

		if (user!.photoURL! === null) {
			if (data.photoURL !== '') {
				updateProfile(user!, { photoURL: data.photoURL }).then(() =>
					setSuccessEdit(true)
				);
			}
		} else if (data.photoURL !== user!.photoURL!) {
			updateProfile(user!, { photoURL: data.photoURL }).then(() =>
				setSuccessEdit(true)
			);
		}

		setLoader(false);
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 15 }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							{...register('email')}
							error={Boolean(errors.email?.message)}
							helperText={errors.email?.message}
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							{...register('photoURL')}
							error={Boolean(errors.photoURL?.message)}
							helperText={errors.photoURL?.message}
							fullWidth
							name="photoURL"
							label="Photo"
							type="photoURL"
							id="photoURL"
							autoComplete="new-photoURL"
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							{...register('displayName')}
							error={Boolean(errors.displayName?.message)}
							helperText={errors.displayName?.message}
							fullWidth
							name="displayName"
							label="Display Name"
							type="text"
							id="displayName"
							autoComplete="display-Name"
						/>
					</Grid>
				</Grid>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
				>
          Change Profile
				</Button>
			</Box>

			<Snackbar
				open={successEdit}
				autoHideDuration={4000}
				onClose={() => setSuccessEdit(false)}
			>
				<Alert severity="success" sx={{ width: '100%' }}>
          Data have been changed
				</Alert>
			</Snackbar>
			{loader && (
				<Backdrop
					open={true}
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			)}
		</Container>
	);
};
