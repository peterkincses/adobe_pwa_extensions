import { gql } from '@apollo/client';
import { ProductDetailsFragment } from '@magento/peregrine/lib/talons/RootComponents/Product/productDetailFragment.gql';
import {CartTriggerFragment} from "@magento/venia-ui/lib/components/Header/cartTriggerFragments.gql";

export const GET_PRODUCT_PERSONALISATION_DETAILS = gql`
  query getProductPersonalisationDetails($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
          id
          ...ProductDetailsFragment
          psn_is_personalisable
          psn_text_back_top_coord
          psn_text_back_left_coord
          psn_text_front_top_coord
          psn_text_front_left_coord
          ... on ConfigurableProduct {
              variants {
                  product {
                      uid
                      name
                      sku
                      psn_front_image {
                          url
                      }
                      psn_background_image {
                          url
                      }
                      swatch_image
                  }
              }
          }
      }
    }
  }${ProductDetailsFragment}
`;

export const GET_PRODUCT_PERSONALISATION_OPTIONS = gql`
    query GetProductPersonalisationOptions {
        psnOptions {
            fonts {
                font
                font_name
                font_size
                preview_text
            }
            patterns {
                pattern_name
                thumbnail_image
                pattern_image
            }
            icons {
                icon_name
                thumbnail_image
                icon_image
            }
        }
    }
`;

export const MiniCartPsnFragment = gql`
    fragment MiniCartPsnFragment on Cart {
        id
        total_quantity
        prices {
            subtotal_excluding_tax {
                currency
                value
            }
        }
        items {
            id
            product {
                id
                name
                url_key
                url_suffix
                thumbnail {
                    url
                }
                stock_status
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            thumbnail {
                                url
                            }
                        }
                    }
                }
            }
            prices {
                price {
                    currency
                    value
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;

export const ADD_PSN_PRODUCT_MUTATION = gql`
    mutation addConfigurablePsnProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
        $parentSku: String!
        $frontText: String,
        $frontOrientation: String,
        $frontFont: String,
        $backText: String,
        $backOrientation: String,
        $backFont: String,
        $icon: String,
        $pattern: String
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: {
                            quantity: $quantity
                            sku: $sku
                            personalisation: {
                                front_text: $frontText
                                front_font: $frontFont
                                front_orientation: $frontOrientation
                                back_text: $backText
                                back_font: $backFont
                                back_orientation: $backOrientation
                                icon: $icon
                                pattern: $pattern
                            }
                        }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartPsnFragment
                items {
                    id
                    personalisation {
                        front_text
                        front_font
                        front_orientation
                        back_text
                        back_font
                        back_orientation
                        icon
                        pattern
                    }
                }
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartPsnFragment}
`;

export const GET_CART_ITEM_PRODUCT_PERSONALISATION_DATA = gql`
    query getCartItemProductPersonalisationDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                id
                personalisation {
                    front_text
                    front_font
                    front_orientation
                    back_text
                    back_font
                    back_orientation
                    icon
                    pattern
                }
            }
        }
    }
`;
