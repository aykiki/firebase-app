import React, { useState } from 'react';
import { IPostData, IPost } from '../../interfaces';
import {
	Alert,
	Backdrop,
	Box,
	Button,
	Container,
	CssBaseline,
	Grid,
	CircularProgress,
	Snackbar,
	TextField,
} from '@mui/material';
import { update } from 'firebase/database';
import { postsRef } from '../App';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IPostForm } from '../../yup/yup.interfaces';
import { postSchema } from '../../yup/yup.schemas';

interface IEditPostFormProps {
  item: IPostData;
  closeEdit: () => void;
}

export const EditPost: React.FC<IEditPostFormProps> = ({
	item,
	closeEdit,
}) => {


	const [loader, setLoader] = useState<boolean>(false);
	const [successPublish, setSuccessPublish] = useState<boolean>(false);


	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IPostForm>({
		resolver: yupResolver(postSchema),
		defaultValues: {
			title: item.title,
			photoURL: item.photoURL,
			description: item.description,
			mainText: item.mainText,
		},
	});

	const onSubmit: SubmitHandler<IPostForm> = async (data) => {
		setLoader(true);
		const updates: IPost = {};
		updates[item.postUID + '/'] = {
			postUID: item.postUID,
			authorID: item.authorID,
			authorEmail: item.authorEmail,
			title: data.title,
			description: data.description,
			date: item.date,
			photoURL: data.photoURL ?? '',
			mainText: data.mainText,
			countOfLikes: item.countOfLikes,
			countOfDislikes: item.countOfDislikes,
			favorites: item.favorites,
		};

		try {
			await update(postsRef, updates);
			reset(undefined);
		} finally {
			setLoader(false);
			setSuccessPublish(true);
			closeEdit();
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
