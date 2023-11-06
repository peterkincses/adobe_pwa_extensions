import React, { Suspense, Fragment } from 'react';
import { number, shape, string } from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Image from '@magento/venia-ui/lib/components/Image';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/item.module.css';
import mixAndMatchGalleryItemClasses from "./item.css";
import { useMixAndMatchGalleryItem } from '@eshopworld/mix-and-match/src/talons/MixAndMatch/useMixAndMatchGalleryItem';
import {isProductConfigurable} from "@magento/peregrine/lib/util/isProductConfigurable";
import {fullPageLoadingIndicator} from "@magento/venia-ui/lib/components/LoadingIndicator";

const Options = React.lazy(() =>
    import('@eshopworld/core/src/components/ProductOptions')
);

const IMAGE_WIDTH = 180;
const IMAGE_HEIGHT = 225;

export const CUSTOM_TYPES = {
    ConfigurableProduct: {
        fields: {
            configurable_options: {
                merge(existing, incoming, { mergeObjects }) {
                    if (existing && existing.length > 0 && incoming.length == 0){
                        return existing;
                    } else
                    if (existing && existing.length == 0 && incoming.length > 0){
                        return incoming;
                    } else {
                        return incoming;
                    }
                },
            }
        }
    }
};

const MixAndMatchGalleryItem = props => {
    const {
        item,
        isCategoryPage,
        categoryIndex,
        updateCurrentProductSelectedOptions,
        isAddToCartClicked
    } = props;

    const classes = mergeClasses(defaultClasses, mixAndMatchGalleryItemClasses, props.classes);

    const {
        handleSelectionChange
    } = useMixAndMatchGalleryItem({
        product: item,
        typePolicies: CUSTOM_TYPES,
        categoryIndex: categoryIndex,
        updateCurrentProductSelectedOptions: updateCurrentProductSelectedOptions
    });

    const { pathname } = useLocation();

    const {
        name,
        url_key,
        url_suffix,
        url_rewrites,
        id,
        small_image
    } = item;

    let productLink;
    if (url_rewrites && url_rewrites.length > 0) {
        const singleLink = `/${url_key}${url_suffix || ''}`;
        if (isCategoryPage) {
            const finalLink = `${pathname}/${url_key}${url_suffix || ''}`;
            const selectedUrl = url_rewrites.find(
                rewrite => finalLink == `/${rewrite.url}`
            );
            if (selectedUrl) {
                productLink = `/${selectedUrl.url}`;
            } else {
                const singleUrl = url_rewrites.find(
                    rewrite => singleLink == `/${rewrite.url}`
                );
                if (singleUrl) {
                    productLink = `/${singleUrl.url}`;
                }
            }
        } else {
            const selectedUrl = url_rewrites.find(
                rewrite => singleLink == `/${rewrite.url}`
            );
            if (selectedUrl) {
                productLink = `/${selectedUrl.url}`;
            }
        }
    }
    if (!productLink) {
        productLink = `/catalog/product/view/id/${id}`;
    }
    productLink = resourceUrl(productLink);

    const options = isProductConfigurable(item) ? (
            <Suspense fallback={fullPageLoadingIndicator}>
                <div className={classes.options}>
                    <Options
                        key={'mix-and-match-options-'+ item.uid}
                        product={item}
                        onSelectionChange={handleSelectionChange}
                        options={item.configurable_options}
                        isClickAddToCart={isAddToCartClicked}
                    />
                </div>
            </Suspense>
        )
        : null;

    return (
        <div className={classes.root}>
            <Link
                to={productLink}
                className={classes.images}
                onFocus={() => {}}
                onBlur={() => {}}
            >
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    src={small_image}
                    height={IMAGE_HEIGHT}
                    width={IMAGE_WIDTH}
                    page={'plp'}
                />
            </Link>
            {options}
        </div>
    );
};

MixAndMatchGalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageContainer: string,
        imagePlaceholder: string,
        image_pending: string,
        images: string,
        images_pending: string,
        name: string,
        name_pending: string,
        price: string,
        price_pending: string,
        root: string,
        root_pending: string
    }),
    item: shape({
        id: number.isRequired,
        name: string.isRequired,
        small_image: string.isRequired,
        url_key: string.isRequired,
        price: shape({
            minimalPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                })
            }).isRequired,
            regularPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                })
            }).isRequired,
        }).isRequired
    })
};

export default MixAndMatchGalleryItem;
