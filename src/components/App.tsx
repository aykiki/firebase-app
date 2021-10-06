import React, { useEffect } from 'react';
import { getAuth } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase.config';
import { getDatabase, set, ref, query, push } from 'firebase/database';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { UnAuthLayout } from './Layouts/UnAuthLayout';
import { AuthLayout } from './Layouts/AuthLayout';
import { Login } from './Login';
import { Registration } from './Registration';
import { StartPage } from './StartPage';
import { ProfileInfo } from './ProfileInfo';
import { ProfileChangePassword } from './ProfileChangePassword';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AddPost } from './AddPost';
import { Feed } from './Feed'
import { Favorites } from './Favorits';

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const appAuth = getAuth();
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
                <Route component={ProfileInfo} path="/profile/info" />
                <Route
                  component={ProfileChangePassword}
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
