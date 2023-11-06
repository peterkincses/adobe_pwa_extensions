import { gql } from '@apollo/client';
import { CartPageFragment } from '@magento/venia-ui/lib/components/CartPage/cartPageFragments.gql';

export const UPDATE_CONFIGURABLE_CART_ITEM_MUTATION = gql`
    mutation UpdateConfigurableCartItem(
      $cartId: String!
      $cartItemUid: ID!
      $optionId: Int!
      $optionValueString: String!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId,
                cart_items: [{ cart_item_uid: $cartItemUid, customizable_options: [{ id: $optionId, value_string: $optionValueString }] }]
                # cart_items: [{ cart_item_uid: $cartItemUid, customizable_options: [{ value_string: $optionValueString }] }]
                # cart_items: [{ cart_item_uid: $cartItemUid, customizable_options: [{ value_string: "One Time" }] }]
                # cart_items: [{ cart_item_uid: $cartItemUid, quantity: 10 }]
            }
        ) @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export default {
  updateConfigurableCartItemMutation: UPDATE_CONFIGURABLE_CART_ITEM_MUTATION
};