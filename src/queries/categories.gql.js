import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories($id: String, $searchString: String) {
    getCategories(ID: $id, search_string: $searchString) {
      ID
      CATEGORIES_NAME
      SLUG
      DESCRIPTION
      CREATE_AT
      UPDATE_AT
      STATE
    }
  }
`;
