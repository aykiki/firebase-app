import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { IPostForm } from '../../yup/yup.interfaces';
import { postSchema } from '../../yup/yup.schemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { $currentUser } from '../../currUserStore';
import {
	Alert,
	Backdrop,
	Box,
	Button,
	CircularProgress,
	Container,
	CssBaseline,
	Grid,
	Snackbar,
	TextField,
} from '@mui/material';
import { useStore } from 'effector-react';
import { IPost } from '../../interfaces';
import { push, update } from 'firebase/database';
import { postsRef } from '../App';

export const AddPost: React.FC = () => {
	const [loader, setLoader] = useState<boolean>(false);
	const [successPublish, setSuccessPublish] = useState<boolean>(false);

	const user = useStore($currentUser);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IPostForm>({
		resolver: yupResolver(postSchema),
	});

	const onSubmit: SubmitHandler<IPostForm> = async (data) => {
		setLoader(true);

		const updates: IPost = {};
		const postKey = push(postsRef, updates).key;

		updates[postKey + '/'] = {
			postUID: postKey!,
			authorID: user!.uid,
			authorEmail: user!.email!,
			title: data.title,
			description: data.description,
			date: new Date().toISOString(),
			photoURL: data.photoURL ?? '',
			mainText: data.mainText,
			countOfLikes: [],
			countOfDislikes: [],
			favorites: [],
		};

		try {
			await update(postsRef, updates);
			reset(undefined);
		} finally {
			setLoader(false);
			setSuccessPublish(true);
		}
	};

	return (
		<Container component="main" maxWidth="lg">
			<CssBaseline />
			<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 15 }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							{...register('title')}
							error={Boolean(errors.title?.message)}
							helperText={errors.title?.message}
							fullWidth
							id="title"
							label="Title"
							name="title"
							autoComplete="title"
							required
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
							{...register('description')}
							error={Boolean(errors.description?.message)}
							helperText={errors.description?.message}
							fullWidth
							name="description"
							label="Short description"
							type="text"
							id="description"
							autoComplete="description"
							required
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							{...register('mainText')}
							error={Boolean(errors.mainText?.message)}
							helperText={errors.mainText?.message}
							fullWidth
							name="mainText"
							label="Text"
							type="text"
							id="mainText"
							autoComplete="mainText"
							multiline
							rows={10}
							required
						/>
					</Grid>
				</Grid>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
				>
          Publish Post
				</Button>
			</Box>

			<Snackbar
				open={successPublish}
				autoHideDuration={4000}
				onClose={() => setSuccessPublish(false)}
			>
				<Alert severity="success" sx={{ width: '100%' }}>
          Post has been published
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
