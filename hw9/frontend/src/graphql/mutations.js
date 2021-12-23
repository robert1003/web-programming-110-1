import { gql } from '@apollo/client';

export const CREATE_CHATBOX_MUTATION = gql`
  mutation createChatBox(
    $name1: String!
    $name2: String!
  ) {
    createChatBox(name1: $name1, name2: $name2) {
      id
    }
  }
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage(
    $sender: String!
    $receiver: String!
    $message: String!
  ) {
    createMessage(sender: $sender, receiver: $receiver, message: $message) {
      id
    }
  }
`;