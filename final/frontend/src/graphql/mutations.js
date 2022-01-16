import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($UserName: String!, $Password: String!) {
    login(UserName: $UserName, Password: $Password) {
      userName
      token
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($UserName: String!, $Password: String!) {
    createUser(UserName: $UserName, Password: $Password) {
      userName
      token
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($Title: String!, $AuthorName: String!, $Content: String!, $BoardName: String!) {
    createPost(
      Title: $Title,
      AuthorName: $AuthorName,
      Content: $Content,
      BoardName: $BoardName
    ) {
      id
    }
  }
`

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($PostId: ID!, $AuthorName: String!, $Content: String!) {
    createComment(
      PostId: $PostId,
      AuthorName: $AuthorName,
      Content: $Content
    ) {
      id
      author {
        userName
      }
      createTime
      content
    }
  }
`