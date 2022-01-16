import { gql } from "@apollo/client";

export const GET_USER_QUERY = gql`
  query GetUserQuery($UserName: String!) {
    user(UserName: $UserName) {
      id
      username
    }
  }
`;

export const GET_BOARD_QUERY = gql`
  query GetBoardQuery($BoardName: String!) {
    board(BoardName: $BoardName) {
      id
      boardName
      posts {
        id
        title
        createTime
        lastReviseTime
        content
        author {
          userName
        }
        comments {
          id
        }
      }
    }
  }
`

export const GET_POST_QUERY = gql`
  query GetPostQuery($PostId: ID!) {
    post(PostId: $PostId) {
      createTime
      content
      author {
        userName
      }
      comments {
        author {
          userName
        }
        content
        id
      }
      title
    }
  }
`

export const GET_COMMENT_QUERY = gql`
  query GetCommentQuery($CommentId: ID!) {
    comment(CommentId: $CommentId) {
      id
      author
      createTime
      content
      post
    }
  }
`
