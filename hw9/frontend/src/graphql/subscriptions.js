import { gql } from '@apollo/client';

export const MESSAGE_SUBSCRIPTION = gql`
  subscription message(
    $name1: String!
    $name2: String!
  ) {
    message(name1: $name1, name2: $name2) {
      sender {
        name
      }
      body
    }
  }
`;