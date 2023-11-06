import { gql } from '@apollo/client';

import { ProductDetailsFragment } from '@magento/peregrine/lib/talons/RootComponents/Product/productDetailFragment.gql';

export const SubscriptionOptionsFragment = gql`
    fragment SubscriptionOptionsFragment on SubscriptionOption {
        value {
          uid
          title
          price
          sort_order
        }
    }
`;

export const GET_PRODUCT_COLLECTION_SUBSCRIPTION_DATA = gql`
    query getCategories(
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput)
    {
        products (
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
          items {
            id
            ... on CustomizableProductInterface {
                options {
                  uid
                  title
                  required
                  sort_order
                  ... SubscriptionOptionsFragment
                }
            }
          }
        }
    }${SubscriptionOptionsFragment}
`;

export const SKIP_NEXT_SUBSCRIPTION_DELIVERY = gql`
    mutation subsSkipNextDelivery($original_order_number: ID!) {
      subsSkipNextDelivery (
        original_order_number: $original_order_number
      ) {
        original_order_number
        status
        recurring_order_count
        subscription_dates {
          creation_date
          last_order_date
          next_order_date
          user_editable_by_date
          last_updated_date
          interval
          cancelled_date
        }
      }
    }
`;

export const PAUSE_PRODUCT_SUBSCRIPTION = gql`
    mutation subsPauseSubscription($original_order_number: ID!) {
      subsPauseSubscription (
        original_order_number: $original_order_number
      ) {
        original_order_number
        status
        recurring_order_count
        subscription_dates {
          creation_date
          last_order_date
          next_order_date
          user_editable_by_date
          last_updated_date
          interval
          cancelled_date
        }
      }
    }
`;

export const RESUME_PRODUCT_SUBSCRIPTION = gql`
    mutation subsResumeSubscription($original_order_number: ID!) {
      subsResumeSubscription (
        original_order_number: $original_order_number
      ) {
        original_order_number
        status
        recurring_order_count
        subscription_dates {
          creation_date
          last_order_date
          next_order_date
          user_editable_by_date
          last_updated_date
          interval
          cancelled_date
        }
      }
    }
`;

export const UPDATE_SUBS_DELIVERY_ADDRESS = gql`
    mutation subsUpdateDeliveryAddress(
        $original_order_number: ID!
        $first_name: String!
        $middle_name: String
        $last_name: String!
        $company: String
        $street: [String!]
        $city: String!
        $region: String!
        $postcode: String!
        $country: String!
        $phone: String!
     ) {
      subsUpdateDeliveryAddress (
        original_order_number: $original_order_number
        address: {
           firstname: $first_name,
           middlename: $middle_name,
           lastname: $last_name,
           company: $company,
           street: $street,
           city: $city,
           region: $region,
           postcode: $postcode,
           country_id: $country,
           telephone: $phone
        }
      ) {
        original_order_number
        status
        delivery_address {
          customer_id
          address_id
          first_name
          middle_name
          last_name
          company
          street1
          street2
          street3
          city
          region
          postcode
          country
          phone
          created
          updated
        }
      }
    }
`;

export const CANCEL_PRODUCT_SUBSCRIPTION = gql`
    mutation subsCancelSubscription($original_order_number: ID!) {
      subsCancelSubscription (
        original_order_number: $original_order_number
      ) {
        original_order_number
        status
      }
    }
`;

export const UPDATE_PRODUCT_SUBSCRIPTION_NEXT_ORDER_DATE = gql`
    mutation productSubscriptionsUpdateNextOrderData(
        $original_order_number: ID!
        $date: String!
    ) {
      subsUpdateNextOrderDate (
        original_order_number: $original_order_number
        date: $date
      ) {
        original_order_number
        status
        subscription_dates {
          next_order_date
        }
      }
   }
`;

export const UPDATE_PRODUCT_SUBSCRIPTION_ITEMS = gql`
   mutation updateProductSubscriptionItems (
      $original_order_number: ID!
      $items: [SubscriptionItemInput]!
   ) {
      subsUpdateItems(
        original_order_number: $original_order_number
        items: $items
      ) {
        # Subscription Order Group
        original_order_number
        tier {
          tier_name
          min_qty
          max_qty
          discount
        }
        items {
          uid
          subscription_id
          error {
            error_class
            message
          }
          qty
          prices {
            # CartPrices type
            row_total {
              value
            }
            row_total_including_tax {
                value
            }
            discounts {
              label
              amount {
                value
              }
            }
          }
          product {
            # ProductInterface
            name
            thumbnail {
                url
            }
            sku
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
        }
      }
    }
`;

export const GET_CUSTOMER_PRODUCT_SUBSCRIPTIONS = gql`
   query getCustomerProductSubscriptions ($isCompact: Boolean!) {
      customer {
         subscriptions {
            original_order_number
            tier {
              tier_name
              min_qty
              max_qty
            }
            status
            subscription_price
            recurring_order_count
            shipping_method_code @skip(if: $isCompact)
            subscription_dates {
              creation_date
              last_order_date
              next_order_date
              user_editable_by_date
              last_updated_date
              interval
              cancelled_date
            }
            payment_method @skip(if: $isCompact) {
              id
              card_type
              card_number
              expiry
            }
            delivery_address @skip(if: $isCompact) {
              customer_id
              address_id
              first_name
              middle_name
              last_name
              company
              street1
              street2
              street3
              city
              region
              postcode
              country
              phone
              created
              updated
            }
            items {
              uid
              subscription_id
              error {
                error_class
                message
              }
              qty
              prices {# CartPrices type
                row_total {
                  value
                }
                row_total_including_tax {
                    value
                }
                discounts {
                  label
                  amount {
                    value
                  }
                }
              }
              product {# ProductInterface
                name
                thumbnail {
                    url
                }
                sku
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
            }
          }
      }
  }
`;

export const GET_STORE_CONFIG = gql`
    query storeConfigData {
        storeConfig {
          base_currency_code
        }
    }
`;

export const GET_ALL_SUBSCRIPTION_PRODUCTS = gql`
   query getAllSubscriptionProducts {
      products(
        filter: {
           subscription_enabled: { eq: "Subscription Enabled" }
        }
      ) {
          items {
            id
            __typename
            name
            display_name
            sku
            url_key
            url_rewrites {
              parameters {
                name
                value
              }
              url
            }
            small_image {
              url
              label
            }
            media_gallery_entries {
                id
                label
                position
                disabled
                file
            }
            special_price
            price_range {
              minimum_price {
                regular_price {
                  currency
                  value
                }
                discount {
                  amount_off
                  percent_off
                }
                final_price {
                  currency
                  value
                }
              }
            }
            ... on ConfigurableProduct {
                configurable_options {
                    attribute_code
                    attribute_id
                    id
                    label
                    values {
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index
                        swatch_data {
                            ... on ImageSwatchData {
                                thumbnail
                            }
                            value
                        }
                    }
                }
                variants {
                    attributes {
                        code
                        value_index
                    }
                    product {
                        id
                        media_gallery_entries {
                            id
                            disabled
                            file
                            label
                            position
                        }
                        sku
                        stock_status
                        price {
                            regularPrice {
                                amount {
                                    currency
                                    value
                                }
                            }
                        }
                    }
                }
            }
          }
      }
   }
`;

export const GET_ALL_SUBSCRIPTION_PRODUCTS_ = gql`
   query getAllSubscriptionProducts {
      categoryList(
        filters: {
            category_uid: { eq: "Mjk5" }
            name: { match: "Flavours"}
        }
      )
      {
        products (
          pageSize: 20
          currentPage: 1
          sort: { price: DESC }
        ) {
          items {
            id
            __typename
            name
            display_name
            sku
            subscription {
                is_subscription_enabled
            }
            url_key
            url_rewrites {
              parameters {
                name
                value
              }
              url
            }
            small_image {
              url
              label
            }
            media_gallery_entries {
                id
                label
                position
                disabled
                file
            }
            special_price
            price_range {
              minimum_price {
                regular_price {
                  currency
                  value
                }
                discount {
                  amount_off
                  percent_off
                }
                final_price {
                  currency
                  value
                }
              }
            }
            ... on ConfigurableProduct {
                configurable_options {
                    attribute_code
                    attribute_id
                    id
                    label
                    values {
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index
                        swatch_data {
                            ... on ImageSwatchData {
                                thumbnail
                            }
                            value
                        }
                    }
                }
                variants {
                    attributes {
                        code
                        value_index
                    }
                    product {
                        id
                        media_gallery_entries {
                            id
                            disabled
                            file
                            label
                            position
                        }
                        sku
                        stock_status
                        price {
                            regularPrice {
                                amount {
                                    currency
                                    value
                                }
                            }
                        }
                    }
                }
            }
          }
        }
      }
   }
`;


