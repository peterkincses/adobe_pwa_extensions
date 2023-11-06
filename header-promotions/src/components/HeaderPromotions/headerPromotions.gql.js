import {gql} from "@apollo/client";

export const GET_HEADER_PROMOTIONS = gql`
    query GetHeaderPromotions (
       $limit: Int = 4
    ) {
        promotionHeaderPromotions(pageSize: $limit currentPage: 1) {
            items {
                promotion_title
                promotion_description
                promotion_bg_color
                promotion_text_color
                promotion_cta_label
                promotion_cta_link
                promotion_position
            }
        }
    }
`;

export default {
    headerPromotionsQuery: GET_HEADER_PROMOTIONS
}
