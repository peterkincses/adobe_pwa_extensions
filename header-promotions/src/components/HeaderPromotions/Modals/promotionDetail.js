import { mergeClasses } from '@magento/venia-ui/lib/classify';
import React, {Fragment, useState, useEffect} from 'react';
import defaultClasses from './allPromotions.css';
import detailsDialogClasses from './promotionDetail.css';
import Dialog from "@eshopworld/core/src/components/Dialog";
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";
import {useHistory} from "react-router-dom";
import resolveLinkProps from "@magento/pagebuilder/lib/resolveLinkProps";
import RichContent from "@magento/venia-ui/lib/components/RichContent";
import {headerPromotionsGtmEvents} from "../utils/gtmEvents";

const HeaderPromotionsDetailsDialog = props => {
    const classes = mergeClasses(defaultClasses, detailsDialogClasses, props.classes);

    const {
        promotion,
        closeModal
    } = props;

    const history = useHistory();
    const [detailsModalState, setDetailsModalState] = useState({
        bgColor: null,
        textColor: null
    });

    const {
        bgColor,
        textColor
    } = detailsModalState;

    useEffect(() => {
        if (promotion) {
            setDetailsModalState((prevState) => {
                return {
                    ...prevState,
                    bgColor: promotion.promotion_bg_color ? promotion.promotion_bg_color : '#f6f6f6',
                    textColor: promotion.promotion_text_color ? promotion.promotion_text_color : '#000'
                }
            })
        }
    }, [promotion, setDetailsModalState]);

    if (!promotion) {
        return null;
    }

    const {
        promotion_title,
        promotion_description,
        promotion_cta_label,
        promotion_cta_link
    } = promotion;

    const handlePromoCtaClick = () => {
        closeModal();
        const linkProps = resolveLinkProps(promotion_cta_link);
        if (linkProps.to) {
            history.push(promotion_cta_link);
        } else {
            globalThis.location.assign(promotion_cta_link);
        }
        headerPromotionsGtmEvents(
            'hyperlink_click',
            'Header_Promotions_Banner',
            promotion_cta_label,
            promotion_title
        );
    }

    const handleCancel = () => {
        closeModal();
        headerPromotionsGtmEvents(
            'select_toggle',
            'Header_Promotions_Banner_Modal_Close',
            'Close',
            promotion_title
        );
    }

    const dialogStyles =
        `[class^="promotionDetail-promotionDetailDialog"] {
                 background: ${bgColor};
                 color: ${textColor};
         }
         [class^="promotionDetail-promotionDetailDialog"] [class^="action-close"]:before {
                 color: ${textColor};
         }
         [class^="promotionDetail-promotionDetailDialogHeaderButton"] svg {
                 stroke: ${textColor};
         }
         [class^="promotionDetail-promotionDetailDialog"] [class^="promotionDetail-detailsCta"] {
                 color: ${textColor};
         }
         `;

    return (
        <Fragment>
            <Dialog
                classes={{
                    root: classes.root,
                    root_open: classes.root_open,
                    dialog: classes.promotionDetailDialog,
                    headerText: classes.promotionDetailDialogHeaderText
                }}
                isOpen={!!promotion}
                onCancel={handleCancel}
                shouldShowButtons={false}
                title={promotion_title}
            >
                <style>
                    {dialogStyles}
                </style>
                {promotion_description &&
                    <div className={classes.detailsDescription}>
                        <RichContent html={promotion_description} />
                    </div>
                }
                {promotion_cta_link && promotion_cta_label &&
                    <LinkButton className={classes.detailsCta} onClick={handlePromoCtaClick}>
                        {promotion_cta_label}
                    </LinkButton>
                }
            </Dialog>
        </Fragment>
    );
};

export default HeaderPromotionsDetailsDialog;
