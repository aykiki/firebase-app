import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AnimationIcon from '@mui/icons-material/Animation';
import { useHistory } from 'react-router';

export const UnAuthNavigationBar: React.FC = () => {
	const history = useHistory();
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<AnimationIcon onClick={() => history.push('/')} sx={{ cursor: 'pointer',}}/>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, cursor: 'default'}}
						onClick={() => history.push('/')}

					>
            Private Cab
					</Typography>

					<Button color="inherit" onClick={() => history.push('/login')}>
            Sign in
					</Button>
					<Button color="inherit" onClick={() => history.push('/registration')}>
            Sign up
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
