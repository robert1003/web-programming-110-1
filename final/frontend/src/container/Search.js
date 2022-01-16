import { useState } from "react";
import moment from 'moment';
import { Routes, Route, NavLink } from "react-router-dom";
// mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// custom
import Header from './Header.js';
import { useBoard } from '../hooks/useBoard.js';
// graphql
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_BOARD_QUERY } from '../graphql/index.js';

const columns = [
  { id: 'topic', label: 'Topic', minWidth: 300 },
  { id: 'author', label: 'Author', minWidth: 50, align: 'center', 
    format: (v) => v.toLocaleString('en-US') },
  { id: 'replies', label: 'Replies', minWidth: 50, align: 'center' },
  { id: 'activity', label: 'Activity', minWidth: 50, align: 'center'},
];

export default function Search() {
	const [keyword, setKeyword] = useState("");
	const [category, setCategory] = useState("");
	const { board, boardList } = useBoard();
	const [submitted, setSubmitted] = useState(null);
	const [postList, setPostList] = useState([]);

	const { loading, error, data, refetch } = useQuery(GET_BOARD_QUERY, {
    variables: { BoardName: category },
    pollInterval: 500,
    onCompleted: (data) => {
    	const res = data.board.posts.filter(x => {
      	console.log(x.title, x.title.includes(keyword))
      	console.log(x.content, x.content.includes(keyword))
      	return x.title.includes(keyword) || x.content.includes(keyword);
      });
    	if (res.length === 0) {
    		alert("Empty result");
    		setSubmitted(false);
    	}
      setPostList(res);
    },
    onError: (e) => {
    	if (submitted) alert(e);
    	setSubmitted(false);
    }
  });
	const HandleSearch = () => {
		if (keyword === "") {
			alert("Empty keyword");
			return;
		}
		if (category === "") {
			alert("Empty board");
			return;
		}
		setSubmitted(true);
	}
  

	return (
		<div>
			<Header />
			{
				submitted ?
				(
					<>
  <Box sx={{ width: "80%", margin: "0 auto", display: "block" }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            postList.map((x) => {
            return (
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell align="left">
                    <NavLink to={`/post/${x.id}`} style={{ textDecoration: 'none', color: 'unset' }}>
                      {x.title}
                    </NavLink>
                  </TableCell>
                  <TableCell align="center">{x.author.userName}</TableCell>
                  <TableCell align="center">{x.comments.length}</TableCell>
                  <TableCell align="center">{moment(x.lastReviseTime).fromNow()}</TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
  </>)
				:
				(
					<>
					<Box sx={{ m: 10 }} />
			<Box m={50} pt={2} sx={{ width: "70%", margin: "0 auto", display: "block", backgroundColor: grey[100]}}>
				<Grid container spacing={2} m={4} pt={2}>
					<Grid item xs={12}>
						<Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
				      {"Search"}
				    </Typography>
					</Grid>
					<Grid container spacing={2} m={0} pt={2}>
						<Grid item xs={6}>
							<TextField 
								size="small"
								sx={{ width: "100%" }} 
								type="search" 
								label="Search" 
								value={keyword}
								onChange={(e) => { setKeyword(e.target.value); }}
							/>
						</Grid>
						<Grid item xs={3}>
							<TextField select
								label="Board"
								size="small"
								sx={{ width: "100%" }}
								value={category}
								default={"Topics/posts"} 
								onChange={(e) => { setCategory(e.target.value); }} 
							>
								{boardList.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
							</TextField>
						</Grid>
						<Grid item xs={1.8}>
							<Button sx={{ height: "100%", width: "100%" }} variant="contained" onClick={HandleSearch}>Submit</Button>
						</Grid>
					</Grid>
					<Box sx={{ m: 5 }} />
				</Grid>
			</Box>
			</>)
			}			
		</div>
	)	
};