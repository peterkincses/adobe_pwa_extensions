import React, { useMemo } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { useProductImageCarousel } from '@magento/peregrine/lib/talons/ProductImageCarousel/useProductImageCarousel';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from '@magento/venia-ui/lib/components/ProductImageCarousel/carousel.css';
import psnPlaceHolder from "../images/png/psnPlaceHolder.png";
import PsnImageMessages from "./psnImageMessages";
const IMAGE_WIDTH = 640;

const ProductImageCarousel = props => {
    const { images, psnState, isMissingOptions } = props;

    const talonProps = useProductImageCarousel({
        images,
        imageWidth: IMAGE_WIDTH
    });

    const {
        altText,
        sortedImages
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    let psnImage;

    if (psnState && psnState.activePanel === 0) {
        psnImage = sortedImages[0];
    } else if (psnState && psnState.activePanel === 1) {
        psnImage = sortedImages[1];
    } else if (psnState && psnState.activePanel === 2) {
        if (psnState.previewView === 'back' && psnState.back.value) {
            psnImage = sortedImages[1];
        } else {
            psnImage = sortedImages[0];
        }
    }

    let image;
    if (psnImage && psnImage.file) {
        image = (
            <Image
                alt={altText}
                classes={{
                    image: classes.currentImage,
                    root: classes.imageContainer
                }}
                resource={psnImage.file}
                width={IMAGE_WIDTH}
            />
        );
    } else {
        image = (
            <Image
                alt={altText}
                classes={{
                    image: classes.currentImage,
                    root: classes.imageContainer
                }}
                src={psnPlaceHolder}
            />
        );
    }

    return (
        <div className={classes.carouselContainer}>
            {image}
            <PsnImageMessages psnState={psnState}
                              isMissingOptions={isMissingOptions}
                              images={images}
            />
        </div>
    );
};

/**
 * Props for {@link ProductImageCarousel}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * ProductImageCarousel component
 * @property {string} classes.currentImage classes for visible image
 * @property {string} classes.imageContainer classes for image container
 * @property {string} classes.nextButton classes for next button
 * @property {string} classes.previousButton classes for previous button
 * @property {string} classes.root classes for root container
 * @property {Object[]} images Product images input for Carousel
 * @property {string} images.label label for image
 * @property {string} image.position Position of image in Carousel
 * @property {bool} image.disabled Is image disabled
 * @property {string} image.file filePath of image
 */
ProductImageCarousel.propTypes = {
    classes: shape({
        carouselContainer: string,
        currentImage: string,
        currentImage_placeholder: string,
        imageContainer: string,
        root: string
    }),
    images: arrayOf(
        shape({
            label: string,
            position: number,
            disabled: bool,
            file: string.isRequired
        })
    ).isRequired
};

export default ProductImageCarousel;
