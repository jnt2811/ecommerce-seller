import { gql } from "@apollo/client";

export const ADD_SELLER = gql`
  mutation AddNewSeller($sellers: [SellerInsertInput]!) {
    addNewSeller(sellers: $sellers) {
      status
      message
      error
      token
    }
  }
`;

export const LOGIN_SELLER = gql`
  mutation SellerLogin($username: String!, $password: String!) {
    sellerLogin(username: $username, password: $password) {
      status
      message
      error
      token
      refreshToken
      seller {
        ID
        EMAIL
        PHONE_NUMBER
        MAIN_CATEGORIES
        SELLER_NAME
        RATING
        FOLLOWER
        CREATE_AT
        UPDATE_AT
        STATE
      }
    }
  }
`;
