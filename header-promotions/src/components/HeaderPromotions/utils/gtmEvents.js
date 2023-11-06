import dataLayer from "@eshopworld/google-tag-manager/src/util/GTM/dataLayer";

export const headerPromotionsGtmEvents = (event, id, name, promotion_name) => {
    if (window.dataLayer && event && id && name) {
        const data = {
            event: event,
            ecommerce: {
                id: id,
                name: name
            }
        }
        if (promotion_name) {
            data.ecommerce.promotion_name = promotion_name;
        }
        dataLayer({ ecommerce: null });
        dataLayer(data);
    }
}
