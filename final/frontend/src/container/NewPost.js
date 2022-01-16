import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
// custom
import Header from './Header.js';
import MarkdownEditor from '../component/MarkdownEditor.js';
import { useLogin } from '../hooks/useLogin.js';
import { useBoard } from '../hooks/useBoard.js';
// graphql
import { useMutation } from '@apollo/client';
import { CREATE_POST_MUTATION, GET_POST_QUERY } from '../graphql';
import { authHeader } from '../graphql/authHeader.js';

export default function NewPost() {
	const [content, setContent] = useState("**Hello world!!!**");
	const [title, setTitle] = useState("Title");
	const { board, boardList } = useBoard();
	const [curBoard, setCurBoard] = useState(board);
	const { userName, token } = useLogin();
	const navigate = useNavigate();

	const [createPost] = useMutation(CREATE_POST_MUTATION, authHeader(token));
	const handleSubmit = () => {
		createPost({
			variables: {
				Title: title,
				Content: content,
				AuthorName: userName,
				BoardName: curBoard,
			},
			onCompleted: (data) => {
				navigate(`/post/${data.createPost.id}`, { replace: true });
			},
			onError: (e) => {
				alert(e);
			}
		})
	}

	/*useEffect(() => {
		console.log("newPost", userName);
	});*/

	return (
		<div>
			<Header />
			<Box m={2} pt={3} sx={{ height: "50px", width: "70%", margin: "0 auto", display: "block" }}>
				<Grid container spacing={0} mb={2} pt={0}>
					<Grid item xs={12}>
						<Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
				      {"New Post"}
				    </Typography>
					</Grid>
					<Grid item xs={5.5} mb={2}>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
				      {"Title"}
				    </Typography>
				    <TextField 
								sx={{ width: "100%" }} 
								type="search" 
								value={title}
								size="small"
								onChange={(e) => { setTitle(e.target.value); }}
							/>
					</Grid>
					<Grid item xs={0.5} />
					<Grid item xs={5.5} mb={2}>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
				      {"Board"}
				    </Typography>
				    <TextField select
							size="small"
							sx={{ width: "100%" }}
							value={curBoard}
							defaultValue={curBoard}
							onChange={(e) => { setCurBoard(e.target.value); }} 
						>
							{boardList.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
						</TextField>
					</Grid>
					<Grid item xs={1} />
					{/*<Grid item xs={5} mb={2}>
											<Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
									      {"Tags"}
									    </Typography>
									    <TextField 
													sx={{ width: "100%" }} 
													type="search" 
													value={tags}
													onChange={(e) => { setTags(e.target.value); }}
												/>
										</Grid>*/}
					<Grid item xs={12}>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
				      {"Content"}
				    </Typography>
						<MarkdownEditor value={content} setValue={setContent} />
					</Grid>
				</Grid>
				<Box sx={{ flexGrow: 1, textAlign: "right", pt: 2}}>
					<Button variant="contained" onClick={handleSubmit}>Submit</Button>
				</Box>
			</Box>
		</div>
	)
}