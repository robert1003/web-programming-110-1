import { useState } from 'react';
import moment from 'moment';
import './Home.css';
// mui
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Link from '@mui/material/Link';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
// react router
import { Routes, Route, NavLink } from "react-router-dom";
// graphQL
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_BOARD_QUERY } from '../graphql/index.js';
// component
import Post from './Post.js';
import Header from './Header.js';
import { useBoard } from '../hooks/useBoard.js';


const columns = [
  { id: 'topic', label: 'Topic', minWidth: 300 },
  { id: 'author', label: 'Author', minWidth: 50, align: 'center', 
    format: (v) => v.toLocaleString('en-US') },
  { id: 'replies', label: 'Replies', minWidth: 50, align: 'center' },
  { id: 'activity', label: 'Activity', minWidth: 50, align: 'center'},
];

export default function Home() {
  const { board, boardList, setBoard } = useBoard();
  const [postList, setPostList] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_BOARD_QUERY, {
    variables: { BoardName: board },
    pollInterval: 500,
    onCompleted: (data) => {
      setPostList(data.board.posts);
    },
    onError: (e) => {
      alert(e);
    }
  });

  return (
    <div>
      <Header />
      <Box sx={{ width: "80%", margin: "0 auto", display: "block" }}>

        <Box sx={{ m: 2, width: "100%" }}>
          <Grid container spacing={0} mb={2} pt={0}>
            <Grid item xs={3}>
              <Typography sx={{ width: "100%", height: "100%" }}>請選擇討論版：</Typography>
            </Grid>
            <Grid item xs={9} sx={{ width: "100%", height: "100%" }}>
              <Select 
                size="small"
                value={board}
                onChange={(e) => { setBoard(e.target.value); }}
              >
                {boardList.map((e) => <MenuItem key={e} value={e}>{e}</MenuItem>)}
              </Select>
            </Grid>
          </Grid>
        </Box>
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
    </div>
  );
}
