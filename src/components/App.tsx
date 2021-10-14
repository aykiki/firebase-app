import React from 'react';
import { getAuth } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase.config';
import { getDatabase, ref } from 'firebase/database';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { UnAuthLayout } from './Layouts/UnAuthLayout';
import { AuthLayout } from './Layouts/AuthLayout';
import { Login } from './Auth/Login';
import { Registration } from './Auth/Registration';
import { StartPage } from './StartPage';
import { EditProfile } from './Profile/EditProfile';
import { ChangePassword } from './Profile/ChangePassword';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AddPost } from './Posts/AddPost';
import { Feed } from './Posts/Feed';
import { Favorites } from './Posts/Favorites';

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const appAuth = getAuth();
export const postsRef = ref(db, 'posts/');
const theme = createTheme();

/**
 * Создание поста
 * 1. заголовок
 * 2. короткое описание
 * 3. обложка (ссылка на картинку)
 * 4. дата заполняется автоматически (при сабмите)
 * 5. тело поста (выводить в <pre>)
 *
 * Вывод всех постов
 * 1. Заголовок, краткое описание, обложка, дата, автор (email), количество
 *  лайков и дизлайков.
 * 2. Добавление в избранное
 *
 * Избранное пользователя
 * 1. Список избранных постов с возможностью удалить пост из избранного.
 *
 * Страница поста
 * 1. Если пост относится к текущему  пользователю, то он может его редактировать.
 * 2. Если это пост другого человека, то можно поставить лайк/дизлайк.
 * 3. На будущее: комментарии, с лайками, с дизлайками, с возможностью ответить
 * на комментарий :)
 *
 */
/**
 * posts: [
 * {
 *   title: 'asdasdasd',
 *    id: FIREBASE_USER_ID
 * }
 * ]
 *
 *
 */
export const App: React.FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Switch>
					<Route path="/(login|registration)">
						<UnAuthLayout>
							<Switch>
								<Route component={Login} path="/login" />
								<Route component={Registration} path="/registration" />
							</Switch>
						</UnAuthLayout>
					</Route>

					<Route path="/profile/(info|password|addPost|feed|favorites)">
						<AuthLayout>
							<Switch>
								<Route component={EditProfile} path="/profile/info" />
								<Route
									component={ChangePassword}
									path="/profile/password"
								/>
								<Route component={AddPost} path="/profile/addPost" />
								<Route component={Feed} path="/profile/feed" />
								<Route component={Favorites} path="/profile/favorites" />
							</Switch>
						</AuthLayout>
					</Route>

					<Route path="/">
						<UnAuthLayout>
							<Route component={StartPage} path="/" />
						</UnAuthLayout>
					</Route>
				</Switch>
			</BrowserRouter>
		</ThemeProvider>
	);
};
