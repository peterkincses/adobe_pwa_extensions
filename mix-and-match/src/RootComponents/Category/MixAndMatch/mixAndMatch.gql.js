import { gql } from '@apollo/client';
import { CartTriggerFragment } from '@magento/venia-ui/lib/components/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/venia-ui/lib/components/MiniCart/miniCart.gql';
import {CartPageFragment} from "@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql";

const MIX_AND_MATCH_CHILD_CATEGORY_PRODUCT_LIMIT = 50;

export const ADD_MIX_AND_MATCH_ITEM_TO_CART = gql`
    mutation addMixAndMatchItemToCart(
        $cartId: String!
        $cartItem: CartItemInput!
    ) {
        addProductsToCart(
            cartId: $cartId
            cartItems: [$cartItem]
        ) {
            cart {
              id
              ...CartTriggerFragment
              ...MiniCartFragment
            }
            user_errors {
              code
              message
              path
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;


export const MixAndMatchProductsFragment = gql`
    fragment MixAndMatchProductsFragment on CategoryProducts {
       items {
          uid
          id
          name
          sku
          url_key
          url_suffix
          price {
            minimalPrice {
                amount {
                    currency
                    value
                }
            }
            regularPrice {
                amount {
                    currency
                    value
                }
            }
          }
          small_image {
            url
          }
          color_family_name
          family_products {
                id
                uid
                sku
                color_family_name
          }
       }
    }
`;

//Configurable options and variants will be loaded in two separate calls to reduce response size
export const GET_MIX_AND_MATCH_CATEGORIES = gql`
    query getMixAndMatchCategories($categories: [String]) {
      categoryList(
        filters: {
          ids: {
            in: $categories
          }
        }
      ) {
        id
        uid
        name
        children {
          id
          uid
          name
          mm_style_icon
          products (pageSize: ${MIX_AND_MATCH_CHILD_CATEGORY_PRODUCT_LIMIT}) {
            total_count
            ...MixAndMatchProductsFragment
          }
        }
      }
    }
    ${MixAndMatchProductsFragment}

`;
export const GET_MIX_AND_MATCH_CONFIGURABLE_OPTIONS = gql`
    query getMixAndMatchConfigurableOptions($categories: [String]) {
      categoryList(
        filters: {
          ids: {
            in: $categories
          }
        }
      ) {
        uid
        children {
          uid
          products (pageSize: ${MIX_AND_MATCH_CHILD_CATEGORY_PRODUCT_LIMIT}) {
             items {
                uid
                ... on ConfigurableProduct {
                  configurable_options {
                    attribute_code
                    attribute_id
                    id
                    uid
                    label
                    values {
                        uid
                        label
                        store_label
                        value_index
                    }
                  }
                }
             }
          }
        }
      }
    }
`;

export const GET_MIX_AND_MATCH_VARIANTS = gql`
    query getMixAndMatchVariants($categories: [String]) {
      categoryList(
        filters: {
          ids: {
            in: $categories
          }
        }
      ) {
        uid
        children {
          uid
          products (pageSize: ${MIX_AND_MATCH_CHILD_CATEGORY_PRODUCT_LIMIT}) {
             items {
                uid
                ... on ConfigurableProduct {
                  variants {
                        attributes {
                            code
                            value_index
                        }
                        product {
                            uid
                            sku
                            stock_status
                            only_x_left_in_stock
                        }
                  }
                }
             }
          }
        }
      }
    }
`;

export const REMOVE_ITEM_MUTATION = gql`
    mutation RemoveItemForMiniCart($cartId: String!, $itemId: ID!) {
        removeItemFromCart(
            input: { cart_id: $cartId, cart_item_uid: $itemId }
        ) {
            cart {
                id
                ...MiniCartFragment
                ...CartPageFragment
            }
        }
    }
    ${MiniCartFragment}
    ${CartPageFragment}
`;

export default {
    addMixAndMatchItemToCartMutation: ADD_MIX_AND_MATCH_ITEM_TO_CART,
    removeItemMutation: REMOVE_ITEM_MUTATION
}

