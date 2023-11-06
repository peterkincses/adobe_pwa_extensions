import { mergeClasses } from '@magento/venia-ui/lib/classify';
import React, { Fragment, useState, useEffect } from 'react';
import Slider from 'react-slick';
import componentClasses from './headerPromotions.css';
import {useHeaderPromotions} from "@eshopworld/header-promotions/src/talons/HeaderPromotions/useHeaderPromotions";
import DEFAULT_OPERATIONS from './headerPromotions.gql';
import PromotionHeaderAllPromotionsDialog from "./Modals/allPromotions";
import PromotionHeaderDetailsDialog from "./Modals/promotionDetail";
import HeaderPromotionsModalToggle from "./ModalToggle";
import {headerPromotionsGtmEvents} from "./utils/gtmEvents";

const HeaderPromotions = props => {
    const classes = mergeClasses(componentClasses, props.classes);

    const { headerPromotionsQuery } = DEFAULT_OPERATIONS;
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [backgroundColor, setBackgroundColor] = useState(null);
    const [textColor, setTextColor] = useState(null);
    const [visiblePromotion, setVisiblePromotion] = useState(null);

    const {
        isLoading,
        headerPromotions
    } = useHeaderPromotions({
        headerPromotionsQuery
    });

    useEffect(() => {
        if (headerPromotions && headerPromotions.length && headerPromotions[0].promotion_bg_color) {
            setBackgroundColor(headerPromotions[0].promotion_bg_color);
        }
        if (headerPromotions && headerPromotions.length && headerPromotions[0].promotion_text_color) {
            setTextColor(headerPromotions[0].promotion_text_color);
        }
    }, [headerPromotions]);

    if (!headerPromotions || isLoading) {
        return null;
    }

    const gtmSliderNavigation = (arrow) => {
        if (arrow) {
            headerPromotionsGtmEvents(
                'select_toggle',
                'Header_Promotions_Banner_Slider_Navigation',
                arrow.innerText
            );
        }
    }

    const settings = {
        autoplay: true,
        adaptiveHeight: false,
        autoplaySpeed: 6000,
        cssEase: 'linear',
        dots: false,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 300,
        waitForAnimate: false,
        beforeChange: (currentSlide, nextSlide) => {
            setBackgroundColor(headerPromotions[Number(nextSlide)].promotion_bg_color);
            setTextColor(headerPromotions[Number(nextSlide)].promotion_text_color);
        },
        onInit: () => {
            const promotionsContainer = document.querySelector('.headerPromotions-root-qfa');
            if (promotionsContainer) {
                const arrows = promotionsContainer.querySelectorAll('.slick-arrow');
                if (arrows.length) {
                    Array.from(arrows).map(arrow => {
                        arrow.addEventListener('click', () => gtmSliderNavigation(arrow));
                    })
                }
            }
        }
    };

    const togglePromotionsModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleViewLinkClick = (event, promoTitle, promotionToOpen) => {
        openPromotionsModal(promotionToOpen);
        headerPromotionsGtmEvents(
            'hyperlink_click',
            'Header_Promotions_Banner',
            event.target.innerText,
            promoTitle
        );
    }
    const openPromotionsModal = (promotionToOpen) => {
        if (promotionToOpen) {
            setVisiblePromotion(promotionToOpen);
        } else {
            setIsModalOpen(true)
        }
    }

    const togglePromotionDetailModal = () => {
        setVisiblePromotion(!visiblePromotion)
    }

    const handleDetailsLink = (props) => {
        togglePromotionsModal();//close all promo modal
        setVisiblePromotion(props);
        headerPromotionsGtmEvents(
            'hyperlink_click',
            'Header_Promotions_Banner',
            'Details',
            props.promotion_title
        );
    }

    const dynamicStyles = {
        color: textColor,
        '--sliderBackgroundColor': backgroundColor ? backgroundColor : '#f6f6f6',
        '--sliderTextColor': textColor ? textColor : '#000'
    }

    return (
        <Fragment>
            <div className={classes.root} style={dynamicStyles}>
                {headerPromotions.length > 1 ?
                    <Slider {...settings} className={classes.promoSlider}>
                        {headerPromotions.map((promo, index) => {
                            return (
                                //additional div needed for slider items
                                <div key={'header-promotion-' + index}>
                                    <div className={classes.promotion}>
                                        <div>{promo.promotion_title}</div>
                                        <HeaderPromotionsModalToggle
                                            handleClick={handleViewLinkClick}
                                            promotions={headerPromotions}
                                            promoTitle={promo.promotion_title}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </Slider>
                    :
                    headerPromotions.map((promo) => {
                        return (
                            <div className={classes.promotion}>
                                {promo.promotion_title}
                                <HeaderPromotionsModalToggle
                                    handleClick={handleViewLinkClick}
                                    promotions={headerPromotions}
                                    promoTitle={promo.promotion_title}
                                />
                            </div>
                        )
                    })
                }
            </div>
            <PromotionHeaderAllPromotionsDialog isOpen={isModalOpen}
                                                promotions={headerPromotions}
                                                closeModal={togglePromotionsModal}
                                                handleDetailsLink={handleDetailsLink}
                                                setVisiblePromotion={setVisiblePromotion}
            />
            <PromotionHeaderDetailsDialog promotion={visiblePromotion}
                                          closeModal={togglePromotionDetailModal}
            />
        </Fragment>
    );
};

export default HeaderPromotions;
