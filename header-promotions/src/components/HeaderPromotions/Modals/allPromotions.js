import { mergeClasses } from '@magento/venia-ui/lib/classify';
import React from 'react';
import {useIntl} from 'react-intl';
import defaultClasses from './allPromotions.css';
import Dialog from "@eshopworld/core/src/components/Dialog";
import {headerPromotionsGtmEvents} from "../utils/gtmEvents";
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";

const HeaderPromotionsAllPromotionsDialog = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const {
        handleDetailsLink,
        isOpen,
        promotions,
        closeModal
    } = props;

    const handleCancel = () => {
        closeModal();
        headerPromotionsGtmEvents(
            'select_toggle',
            'Header_Promotions_Banner_Modal_Close',
            'Close',
            'All promotions'
        );
    }

    const modalTitle = formatMessage({
        id: 'headerPromotionsModal.title',
        defaultMessage: 'All promotions'
    });

    const detailsLink = formatMessage({
        id: 'headerPromotionsModal.detailsLinkText',
        defaultMessage: 'Details'
    });

    return (
            <Dialog
                classes={{
                    root: classes.root,
                    root_open: classes.root_open,
                    dialog: classes.dialog,
                    dialogInner: classes.dialogInner
                }}
                isOpen={isOpen}
                onCancel={handleCancel}
                shouldShowButtons={false}
                title={modalTitle}
            >
                <div className={classes.promotionsWrap}>
                    {promotions.map((promo, index) => {
                        const promoStyle = {
                            backgroundColor: promo.promotion_bg_color,
                            color: promo.promotion_text_color,
                            '--promotion-text-color': promo.promotion_text_color
                        }
                        return (
                            <div style={promoStyle} className={classes.promotion} key={'header-promotion-'+index}>
                                <div className={classes.promotionTitle}>
                                    {promo.promotion_title}
                                </div>
                                <LinkButton className={classes.detailsToggle}
                                     onClick={() => handleDetailsLink(promo)}
                                >
                                    {detailsLink}
                                </LinkButton>
                            </div>
                        )
                    })}
                </div>
            </Dialog>
    );
};

export default HeaderPromotionsAllPromotionsDialog;
