// mui
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { pink } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// react router
import { Routes, Route, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// custom
import { useLogin } from '../hooks/useLogin.js';
import { useBoard } from '../hooks/useBoard.js';

export default function Header() {
	const { hasLogin, userName, setLoginStatus, setUserName, setToken } = useLogin();
	const { board, boardList, setBoard } = useBoard();
	const navigate = useNavigate();

	const logout = () => {
		setLoginStatus(null);
		setUserName("");
		setToken("");
		navigate("../", { replace: true });
	}

	return (
		<AppBar position="sticky">
		  <Toolbar>
		    <Typography variant="h6" component="div" sx={{ margin: "0 auto", flexGrow: 1 }}>
		      <NavLink to="/" style={{ textDecoration: 'none', color: 'unset' }}>國外留學申請交流版</NavLink>
		    </Typography>
		    {/*
		    <Box sx={{ m: 2, flexGrow: 1 }}>
		    	<Select 
			    	value={board}
	          onChange={(e) => { setBoard(e.target.value); }}
	          sx={{ color: "white" }}
	        >
	      		{boardList.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
	        </Select>
		    </Box>
		  	*/}
		    {
		    	hasLogin ? (
		    		<>
			    		<Box m={2} pt={0}>
			    			<Avatar sx={{ bgcolor: pink[500] }}>{userName[0]}</Avatar>
			    		</Box>
			    		<Box m={2} pt={0}>
			    			<Button href="/newpost" variant="outlined" color="inherit">New Post</Button>
			    		</Box>
			    		<Box m={2} pt={0}>
			    			<Button variant="outlined" color="inherit" onClick={logout}>Logout</Button>
			    		</Box>
		    		</>
		    	) : (
		    		<>
		    			<Box m={2} pt={0}>
			    			<Button href="/signup" variant="outlined" color="inherit">Signup</Button>
			    		</Box>
			    		<Box m={2} pt={0}>
			    			<Button href="/signin" variant="outlined" color="inherit">Login</Button>
			    		</Box>
		    		</>
		    	)
		    }
		    <IconButton href="/search" size="large" edge="start" color="inherit" aria-label="open drawer">
		      <SearchIcon />
		    </IconButton>
		  </Toolbar>
		</AppBar>
	);
}