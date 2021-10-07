import React, { useEffect } from 'react';
import { AuthNavigationBar } from '../AuthNavigationBar';

import { $currentUser } from '../../currentUserStore';
import { useStore } from 'effector-react';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import { VpnKey } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { onAuthStateChanged } from '@firebase/auth';
import { appAuth } from '../App';
import { useHistory } from 'react-router';
import { pushCurrentUser } from '../../currentUserStore';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FeedIcon from '@mui/icons-material/Feed';
import BookmarkIcon from '@mui/icons-material/Bookmark';
interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const user = useStore($currentUser);
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(appAuth, (user) => {
      if (!user) {
        history.push('/');
        unsubscribe();
      } else {
        pushCurrentUser(user);
      }
    });
  }, [history]);


  return (
    <>
      <AuthNavigationBar />
      <Drawer variant="persistent" open={true}>
        <Box marginTop="10vh">
          <List sx={{ width: '56px' }}>
            <ListItem button key="Profile-info" disabled >
              <ListItemIcon>
                {user === null || user.photoURL === null ? (
                  <FaceIcon />
                ) : (
                  <Avatar src={user!.photoURL} style={{marginLeft: "-6px"}}/>
                )}
              </ListItemIcon>
            </ListItem>
            <ListItem
              button
              key="Profile-info"
              onClick={() => history.push('/profile/info')}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
            </ListItem>
            <ListItem
              button
              key="Change password"
              onClick={() => history.push('/profile/password')}
            >
              <ListItemIcon>
                <VpnKey />
              </ListItemIcon>
            </ListItem>
            <ListItem
              button
              key="Add Post"
              onClick={() => history.push('/profile/addPost')}
            >
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
            </ListItem>
            <ListItem
              button
              key="Feed"
              onClick={() => history.push('/profile/feed')}
            >
              <ListItemIcon>
                <FeedIcon />
              </ListItemIcon>
            </ListItem>
             <ListItem
              button
              key="Favorites"
              onClick={() => history.push('/profile/favorites')}
            >
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
            </ListItem>
          </List>
        </Box>
      </Drawer>
        {!user && <Skeleton />}
        {user && <div>{children}</div>}
    </>
  );
};
