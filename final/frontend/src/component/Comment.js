import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import moment from 'moment';
// mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function Comment({ id, author, content, createTime, color }) {
	return (
		<Grid container spacing={2} m={2} pt={0} >
			<Grid item xs={2}>
				<Avatar sx={{ bgcolor: color }}>{author[0]}</Avatar>
				<Typography pt={2} m={0} component="div" sx={{ flexGrow: 1, textAlign: "left", fontSize: "10pt" }} >
					{`${author}, ${moment(createTime).calendar()}`}
				</Typography>
			</Grid>
			<Grid item xs={10}>
		    <Box>
		    	<ReactMarkdown>
		    		{content}
		    	</ReactMarkdown>
		    </Box>
			</Grid>
		</Grid>
	);
}