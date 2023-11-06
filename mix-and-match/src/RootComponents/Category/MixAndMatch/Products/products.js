import React, {useRef, useEffect, Fragment} from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./products.css";
import itemPlaceholderClasses from '@magento/venia-ui/lib/components/Gallery/item.module.css';
import carouselClasses from "./carousel.css";
import SlickSlider from "react-slick";
import MixAndMatchGalleryItem from "./Item/item.js";
import Shimmer from "@magento/venia-ui/lib/components/Shimmer";
import Image from "@magento/venia-ui/lib/components/Image";
import {transparentPlaceholder} from "@magento/peregrine/lib/util/images";

const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const ItemPlaceholder = () => {
    const classes = mergeClasses(itemPlaceholderClasses);

    return (
        <div>
            <Shimmer key="product-image" width="100%">
                <Image
                    alt="Placeholder for gallery item image"
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                    height={165}
                    width={230}
                />
            </Shimmer>
            <Shimmer width="100%" key="item-options" height={3} />
        </div>
    )
}

const MixAndMatchProducts = (props) => {
    const {
        items,
        updateCurrentProduct,
        updateCurrentProductSelectedOptions,
        categoryIndex,
        slideIndex,
        isAddToCartClicked,
        setIsAddToCartClicked
    } = props;

    const classes = mergeClasses(defaultClasses, carouselClasses, props.classes);

    const galleryItems = items.length ? items.map(item => {
        return (
            <MixAndMatchGalleryItem
                key={'mix-match-gallery-item-' + item.uid}
                item={mapGalleryItem(item)}
                categoryIndex={categoryIndex}
                updateCurrentProductSelectedOptions={updateCurrentProductSelectedOptions}
                isAddToCartClicked={isAddToCartClicked}
            />
        )
    }) : null;

    if (!galleryItems) {
        return <ItemPlaceholder />
    }

    const sliderRef = useRef();

    const carouselSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        vertical: false,
        // fade: true,//do not use fade with (infinite scroll + image lazy load)
        cssEase: 'linear',
        waitForAnimate: false,
        initialSlide: slideIndex,
        beforeChange: (currentSlide, nextSlide) => {
            setIsAddToCartClicked(false);
            updateCurrentProduct(categoryIndex, nextSlide);
        },
    };

    return <div className={classes.root}>
        <div className={classes.carousel} id={'mm-product-carousel-'+categoryIndex}>
            <SlickSlider {...carouselSettings} ref={sliderRef}>
                {galleryItems}
            </SlickSlider>
        </div>
    </div>
}

export default MixAndMatchProducts;
