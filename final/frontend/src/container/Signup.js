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
import { CREATE_USER_MUTATION } from '../graphql/index';

export default function Signup() {
	const { hasLogin, setLoginStatus, setUserName, setToken } = useLogin();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [createUser] = useMutation(CREATE_USER_MUTATION);
	const navigate = useNavigate();

	const signup = () => {
		if (username === "") {
			alert("Username is empty");
			return;
		}
		if (password === "") {
			alert("Password is empty");
			return;
		}
		if (password !== password2) {
			alert("Two passwords are not the same, please check it.");
			return;
		}
		console.log(username, password, password2)
		createUser({
			variables: {
				UserName: username,
				Password: password
			},
			onCompleted: (data) => {
        const { token, userName } = data.createUser;
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
				      {"Signup"}
				    </Typography>
					</Grid>
					<Grid container spacing={2} m={0} pt={2}>
						<Grid item xs={3.5}>
							<TextField
								sx={{ width: "100%" }} 
								type="" 
								size="small"
								label="username" 
								value={username}
								onChange={(e) => { setUsername(e.target.value); }}
							/>
						</Grid>
						<Grid item xs={3.5}>
							<TextField 
								sx={{ width: "100%" }} 
								type="password" 
								size="small"
								label="password" 
								value={password}
								onChange={(e) => { setPassword(e.target.value); }}
							/>
						</Grid>
						<Grid item xs={3.5}>
							<TextField 
								sx={{ width: "100%" }} 
								type="password" 
								size="small"
								label="retype password" 
								value={password2}
								onChange={(e) => { setPassword2(e.target.value); }}
							/>
						</Grid>
					</Grid>
					<Grid item xs={8.5} />
					<Grid item xs={2}>
						<Button sx={{ textAlign: "right", width: "100%" }} variant="contained" onClick={signup}>Signup</Button>
					</Grid>
					<Box sx={{ m: 6 }} />
				</Grid>
			</Box>
		</div>
	);
}