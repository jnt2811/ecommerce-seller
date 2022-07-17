import { gql } from "@apollo/client";

export const GET_VOUCHERS = gql`
  query GetVouchers($id: String, $searchString: String, $applyAll: Boolean, $sellerId: String) {
    getVouchers(ID: $id, search_string: $searchString, apply_all: $applyAll, sellerID: $sellerId) {
      ID
      VOUCHER_NAME
      VOUCHER_CODE
      DISCOUNT_PRICE
      APPLY_ALL
      SELLER_ID
      CREATE_AT
      UPDATE_AT
      VALID_UNTIL
      STATE
    }
  }
`;

export const ADD_VOUCHER = gql`
  mutation AddNewVouchers($vouchers: [VoucherInsertInput]!) {
    addNewVouchers(vouchers: $vouchers) {
      status
      message
      error
    }
  }
`;

export const UPDATE_VOUCHER = gql`
  mutation UpdateVoucher($voucher: VoucherUpdateInput!) {
    updateVoucher(voucher: $voucher) {
      status
      message
      error
    }
  }
`;
