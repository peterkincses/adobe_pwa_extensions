import React from 'react';
import {FormattedMessage} from "react-intl";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import componentClasses from "../headerPromotions.css";
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";

const HeaderPromotionsModalToggle = (props) => {
    const classes = mergeClasses(componentClasses, props.classes);

    const {
        promotions,
        handleClick,
        promoTitle
    } = props;

    return promotions.length > 1 ?
        <LinkButton className={classes.modalToggle}
             onClick={(event) => handleClick(event, promoTitle)}
        >
            <FormattedMessage id={'headerPromotions.viewAllLinkText'}
                              defaultMessage={'View all promotions'}
            />
        </LinkButton>
        :
        <LinkButton className={classes.modalToggle}
             onClick={(event) => handleClick(event, promoTitle, promotions[0])}
        >
            <FormattedMessage id={'headerPromotions.viewDetailsLinkText'}
                              defaultMessage={'View details'}
            />
        </LinkButton>
}

export default HeaderPromotionsModalToggle;
