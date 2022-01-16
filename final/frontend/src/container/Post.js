import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'markdown-to-jsx';
import moment from 'moment';
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
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { red, deepOrange, deepPurple, lightBlue, lime, blueGrey, brown, pink } from '@mui/material/colors';
// graphQL
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CREATE_COMMENT_MUTATION, GET_POST_QUERY } from '../graphql/index.js';
// custom
import Comment from '../component/Comment.js';
import Header from './Header.js';
import { useLogin } from '../hooks/useLogin.js';
import MarkdownEditor from '../component/MarkdownEditor.js';
import { authHeader } from '../graphql/authHeader.js';

const colors = [deepPurple[500], lightBlue[500], lime[500], blueGrey[500], brown[500]];

export default function Post() {
	const { hasLogin, userName, token, setLoginStatus, setUserId, setUserName } = useLogin();
  const [newComment, setNewComment] = useState("**Hello world!!!**");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [postTime, setPostTime] = useState("");

  const { postId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_POST_QUERY, {
  	variables: { PostId: postId },
  	pollInterval: 500,
  	onCompleted: (data) => {
  		setAuthor(data.post.author.userName);
  		setTitle(data.post.title);
  		setContent(data.post.content);
  		setComments(data.post.comments);
  		setPostTime(data.post.createTime);
  	},
  	onError: (e) => {
  		alert(e);
  	}
  });

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, authHeader(token));
  const handleSubmit = () => {
      createComment({
        variables: {
            PostId: postId,
            AuthorName: userName,
            Content: newComment,
        },
        onCompleted: (data) => {
        	setComments((x) => [...x, data.createComment])
        },
        onError: (e) => {
        	alert(e);
        }
      });
  }
  
  //const author = "LC";
  //const title = "how to apply";
  //const content = "要想清楚，how to apply，到底是一種怎麽樣的存在。孔丘曾經告訴世人，君子喻於義，小人喻於利。帶著這句話，我們還要更加慎重的審視這個問題：一般來說，韓愈有講過一句名言，仰不愧天，俯不愧人，內不愧心。我希望諸位也能好好地體會這句話。既然是這樣，how to apply的發生，到底需要如何做到，不how to apply的發生，又會如何產生。就我個人來說，how to apply對我的意義，不能不說非常重大。至於為什麼要思考how to apply呢？其實是有更深層的原因，歌德在不經意間這樣說過，讀一本好書，就如同和一個高尚的人在交談。這句話語雖然很短，但令我浮想聯翩。在這種困難的抉擇下，本人思來想去，寢食難安。經過上述討論，how to apply真的是很值得探究，總結的來說，本人也是經過了深思熟慮，在每個日日夜夜思考這個問題。你真的了解how to apply嗎？羅曼·羅蘭有一句座右銘，只有把抱怨環境的心情，化為上進的力量，才是成功的保證。這句話語雖然很短，但令我浮想聯翩。曹操在不經意間這樣說過，老驥伏櫪，志在千里;烈士暮年，壯心不已。這似乎非常的有道理，對吧？帶著這些問題，我們來審視一下how to apply。";

	return (
		<div>
			<Header />
			<Box m={2} pt={3} sx={{ width: "70%", margin: "0 auto", display: "block" }}>
				<Grid container spacing={2} m={2} pt={0}>
					<Grid item xs={2}>
						<Avatar sx={{ bgcolor: deepOrange[500] }}>{author[0]}</Avatar>
						<Typography pt={2} m={0} component="div" sx={{ flexGrow: 1, textAlign: "left", fontSize: "10pt" }} >
							{`${author}, ${moment(postTime).calendar()}`}
						</Typography>
					</Grid>
					<Grid item xs={10} >
						<Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
				      {title}
				    </Typography>
				    <Box m={0} pt={2}>
				    	<Divider />
				    	<ReactMarkdown>
				    		{content}
				    	</ReactMarkdown>
				    </Box>
					</Grid>
				</Grid>

				{/* Comments */}
				{comments.map((x, idx) => { 
					return (
						<>
							<Divider />
							<Comment
								id={x.id}
								author={x.author.userName}
								content={x.content}
								color={colors[idx % colors.length]}
								createTime={x.createTime}
							/>
						</>
					);
				})}
				{/*<Divider />
				<Comment 
					id="123" 
					author="羅" 
					content={"#### 我是留言\n\nStanford因何而發生？而這些並不是完全重要，更加重要的問題是，維龍告訴我們，要成功不需要什麽特別的才能，只要把你能做的小事做得好就行了。這不禁令我深思。所謂Stanford，關鍵是Stanford需要如何寫。一般來說，帶著這些問題，我們來審視一下Stanford。這種事實對本人來說意義重大，相信對這個世界也是有一定意義的。了解清楚Stanford到底是一種怎麽樣的存在，是解決一切問題的關鍵。羅曼·羅蘭有說過一句話，只有把抱怨環境的心情，化為上進的力量，才是成功的保證。這果然是一句至理名言。魯迅有一句座右銘，在行進時，也時時有人退伍，有人落荒，有人頹唐，有人叛變，然而只要無礙於進行，則越到後來，這隊伍也就越成為純粹、精銳的隊伍了。這句話語雖然很短，但令我浮想聯翩。Stanford的發生，到底需要如何做到，不Stanford的發生，又會如何產生。Stanford真的是很值得探究，我認為，但丁有說過，容易發怒，是品格上最為顯著的弱點。這果然是一句至理名言。我這幾天一直在思索這個問題，愛爾蘭有一句名言，越是無能的人，越喜歡挑剔別人的錯兒。這不禁令我深思。米歇潘有說過一句話，生命是一條艱險的峽谷，只有勇敢的人才能通過。這讓我思索了許久，經過上述討論，更多Stanford的意義是這樣的，問題的關鍵究竟為何？"} 
				/>
				<Divider />
				<Comment 
					id="123" 
					author="黃" 
					content={"#### 我是留言\n\nStanford因何而發生？而這些並不是完全重要，更加重要的問題是，維龍告訴我們，要成功不需要什麽特別的才能，只要把你能做的小事做得好就行了。這不禁令我深思。所謂Stanford，關鍵是Stanford需要如何寫。一般來說，帶著這些問題，我們來審視一下Stanford。這種事實對本人來說意義重大，相信對這個世界也是有一定意義的。了解清楚Stanford到底是一種怎麽樣的存在，是解決一切問題的關鍵。羅曼·羅蘭有說過一句話，只有把抱怨環境的心情，化為上進的力量，才是成功的保證。這果然是一句至理名言。魯迅有一句座右銘，在行進時，也時時有人退伍，有人落荒，有人頹唐，有人叛變，然而只要無礙於進行，則越到後來，這隊伍也就越成為純粹、精銳的隊伍了。這句話語雖然很短，但令我浮想聯翩。Stanford的發生，到底需要如何做到，不Stanford的發生，又會如何產生。Stanford真的是很值得探究，我認為，但丁有說過，容易發怒，是品格上最為顯著的弱點。這果然是一句至理名言。我這幾天一直在思索這個問題，愛爾蘭有一句名言，越是無能的人，越喜歡挑剔別人的錯兒。這不禁令我深思。米歇潘有說過一句話，生命是一條艱險的峽谷，只有勇敢的人才能通過。這讓我思索了許久，經過上述討論，更多Stanford的意義是這樣的，問題的關鍵究竟為何？"} 
				/>
				<Divider />
				<Comment 
					id="123" 
					author="邱" 
					content={"#### 我是留言\n\nStanford因何而發生？而這些並不是完全重要，更加重要的問題是，維龍告訴我們，要成功不需要什麽特別的才能，只要把你能做的小事做得好就行了。這不禁令我深思。所謂Stanford，關鍵是Stanford需要如何寫。一般來說，帶著這些問題，我們來審視一下Stanford。這種事實對本人來說意義重大，相信對這個世界也是有一定意義的。了解清楚Stanford到底是一種怎麽樣的存在，是解決一切問題的關鍵。羅曼·羅蘭有說過一句話，只有把抱怨環境的心情，化為上進的力量，才是成功的保證。這果然是一句至理名言。魯迅有一句座右銘，在行進時，也時時有人退伍，有人落荒，有人頹唐，有人叛變，然而只要無礙於進行，則越到後來，這隊伍也就越成為純粹、精銳的隊伍了。這句話語雖然很短，但令我浮想聯翩。Stanford的發生，到底需要如何做到，不Stanford的發生，又會如何產生。Stanford真的是很值得探究，我認為，但丁有說過，容易發怒，是品格上最為顯著的弱點。這果然是一句至理名言。我這幾天一直在思索這個問題，愛爾蘭有一句名言，越是無能的人，越喜歡挑剔別人的錯兒。這不禁令我深思。米歇潘有說過一句話，生命是一條艱險的峽谷，只有勇敢的人才能通過。這讓我思索了許久，經過上述討論，更多Stanford的意義是這樣的，問題的關鍵究竟為何？"} 
				/>*/}

				{
					hasLogin &&
					<>
						<Divider />
						<Grid container spacing={2} m={2} pt={0} >
							<Grid item xs={1}>
								<Avatar sx={{ bgcolor: pink[500] }}>{userName[0]}</Avatar>
							</Grid>
							<Grid item xs={11}>
								<Grid container spacing={0} m={2} pt={0}>
									<Grid item xs={10}>
										<Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
								      {"Have some comments? Type it below!"}
								    </Typography>
									</Grid>
									<Grid item xs={2}>
										<Button variant="contained" onClick={handleSubmit}>Submit</Button>
									</Grid>
								</Grid>
						    <Box pt={2}>
						    	<MarkdownEditor value={newComment} setValue={setNewComment} />
						    </Box>
							</Grid>
						</Grid>
					</>
				}
			</Box>
		</div>
	);
}