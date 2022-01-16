import { useState } from "react";
import { useNavigate } from "react-router-dom";
// mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
// custom
import Header from './Header';
import { useLogin } from '../hooks/useLogin.js';
// graphQL
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LOGIN_MUTATION } from '../graphql/index.js';

export default function Signin() {
	const { hasLogin, setLoginStatus, setUserName, setToken } = useLogin();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [login] = useMutation(LOGIN_MUTATION);
	const navigate = useNavigate();

	const signin = () => {
		if (username === "") {
			alert("Username is empty");
			return;
		}
		if (password === "") {
			alert("Password is empty");
			return;
		}

		login({
			variables: {
				UserName: username,
				Password: password
			},
			onCompleted: (data) => {
        const { token, userName } = data.login;
        setUserName(userName);
        setToken(token);
        setLoginStatus(true);
        navigate("../", { replace: true });
      },
      onError: (error) => {
       	alert(error);
      }
		});
	}

	return (
		<div>
			<Header />
			<Box sx={{ m: 10 }} />
			<Box m={50} pt={2} sx={{ width: "70%", margin: "0 auto", display: "block", backgroundColor: grey[100]}}>
				<Grid container spacing={2} m={4} pt={2}>
					<Grid item xs={12}>
						<Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
				      {"Login"}
				    </Typography>
					</Grid>
					<Grid container spacing={2} m={0} pt={2}>
						<Grid item xs={5}>
							<TextField 
								sx={{ width: "100%" }}
								size="small" 
								type="" 
								label="username" 
								value={username}
								onChange={(e) => { setUsername(e.target.value); }}
							/>
						</Grid>
						<Grid item xs={5}>
							<TextField 
								sx={{ width: "100%" }} 
								size="small"
								type="password" 
								label="password" 
								value={password}
								onChange={(e) => { setPassword(e.target.value); }}
							/>
						</Grid>
					</Grid>
					<Grid item xs={8} />
					<Grid item xs={2}>
						<Button sx={{ textAlign: "right", width: "100%" }} variant="contained" onClick={signin}>Login</Button>
					</Grid>
					<Box sx={{ m: 6 }} />
				</Grid>
			</Box>
		</div>
	);
}