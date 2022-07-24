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

export const GET_SELLER = gql`
  query Query($id: String, $searchString: String) {
    getSeller(ID: $id, search_string: $searchString) {
      ID
      EMAIL
      PHONE_NUMBER
      MAIN_CATEGORIES
      SELLER_NAME
      RATING
      LOCATION
      FOLLOWER
      CREATE_AT
      UPDATE_AT
      STATE
    }
  }
`;

export const UPDATE_SELLER = gql`
  mutation UpdateSeller($seller: SellerUpdateInput!) {
    updateSeller(seller: $seller) {
      status
      message
      error
    }
  }
`;
