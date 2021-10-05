import React, { useEffect } from 'react';
import { UnAuthNavigationBar } from '../UnAuthNavigationBar';
import { onAuthStateChanged } from '@firebase/auth';
import { appAuth } from '../App';
import { useHistory } from 'react-router';
interface UnAuthLayoutProps {
  children: React.ReactNode;
}

export const UnAuthLayout = ({ children }: UnAuthLayoutProps) => {
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(appAuth, (user) => {
      if (user) {
        history.push('/profile/info');
        unsubscribe();
      }
    });
  }, [history]);

  return (
    <>
      <UnAuthNavigationBar />
      <div>{children}</div>
    </>
  );
};
