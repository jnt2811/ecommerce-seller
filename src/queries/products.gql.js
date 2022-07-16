import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($id: String, $searchString: String, $categoriesId: String, $sellerId: String) {
    getProducts(
      ID: $id
      search_string: $searchString
      categoriesID: $categoriesId
      sellerID: $sellerId
    ) {
      ID
      PRODUCT_NAME
      SELLER {
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
      CATEGORIES {
        ID
        CATEGORIES_NAME
        SLUG
        DESCRIPTION
        CREATE_AT
        UPDATE_AT
        STATE
      }
      DETAILS
      DESCRIPTION
      VOUCHER {
        ID
        VOUCHER_NAME
        VOUCHER_CODE
        DISCOUNT_PRICE
        CREATE_AT
        UPDATE_AT
        VALID_UNTIL
        STATE
      }
      PRICE
      CREATE_AT
      UPDATE_AT
      STATE
      PRODUCT_LOCK
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddNewProduct($products: [ProductInsertInput!]) {
    addNewProduct(products: $products) {
      status
      message
      error
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($product: ProductUpdateInput!) {
    updateProduct(product: $product) {
      status
      message
      error
    }
  }
`;
