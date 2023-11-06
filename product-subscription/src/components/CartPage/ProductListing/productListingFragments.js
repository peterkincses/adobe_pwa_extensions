import { gql } from '@apollo/client';

import {SubscriptionOptionsFragment} from '@bat/product-subscription/src/components/ProductSubscription/productSubscription.gql';

const CustomizableCartItemFragment = gql`
  fragment CustomizableCartItemFragment on SelectedCustomizableOption {
        # the following are inside customizable_options
        customizable_option_uid
        type
        is_required
        label
        values {
            id
            customizable_option_value_uid
            label
            value
        }
  }
`

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            uid
            product {
                id
                name
                sku
                url_key
                url_suffix
                thumbnail {
                    url
                }
                small_image {
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
                            small_image {
                                url
                            }
                        }
                    }
                }
                ... on CustomizableProductInterface {
                    options {
                      uid
                      title
                      required
                      sort_order
                      ... SubscriptionOptionsFragment
                    }
                }
                price_range {
                    minimum_price {
                        regular_price {
                           currency
                           value
                        }
                        final_price {
                            currency
                            value
                        }
                    }
                }
            }
            subscription_data {
                is_subscription_item
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
                    configurable_product_option_uid
                    option_label
                    configurable_product_option_value_uid
                    value_label
                }
            }
            ... on SimpleCartItem {
                customizable_options_simple: customizable_options {
                    ...CustomizableCartItemFragment
                }
              }
            ... on ConfigurableCartItem {
                customizable_options_configurable: customizable_options {
                    ...CustomizableCartItemFragment
                }
            }
            ... on BundleCartItem {
                customizable_options_bundle: customizable_options {
                    ...CustomizableCartItemFragment
                }
            }
        }
    }
    ${SubscriptionOptionsFragment}
    ${CustomizableCartItemFragment}
`;
/* eslint-enable graphql/template-strings */
