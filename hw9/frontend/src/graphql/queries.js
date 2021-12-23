import { gql } from '@apollo/client';

export const CHATBOX_QUERY = gql`
  query chatbox(
    $name1: String!
    $name2: String!
  ) {
    chatbox(name1: $name1, name2: $name2) {
      messages {
        sender {
          name
        }
        body
      }
    }
  }
`;