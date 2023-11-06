import React from 'react';
import {FormattedMessage} from "react-intl";
import Shimmer from "@magento/venia-ui/lib/components/Shimmer";
import defaultClasses from "./shimmer.css";
import Image from "@magento/venia-ui/lib/components/Image";
import {transparentPlaceholder} from "@magento/peregrine/lib/util/images";
import {mergeClasses} from "@magento/venia-ui/lib/classify";

const MixAndMatchShimmer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <div className={classes.titleWrap}>
                <div className={classes.title}>
                    <FormattedMessage id={'mixAndMatch.title'}
                                      defaultMessage={'Mix & Match'}
                    />
                </div>
                <div className={classes.switcher}>
                    <Shimmer width="100%" key="item-switcher" height={3}/>
                </div>
            </div>
            {[1, 2].map((subCategoryShimmer, index) => {
                return (
                    <div key={'mixAndMatchSubCategoryShimmer-'+ index} className={classes.subCategory}>
                        <div className={classes.filterRoot}>
                            <Shimmer key="top-filters" width="100%"/>
                        </div>
                        <div>
                            <div className={classes.itemRoot}>
                                <Shimmer key="product-image" width="100%" height="100%">
                                    <Image
                                        alt="Placeholder for gallery item image"
                                        src={transparentPlaceholder}
                                        height={165}
                                        width={230}
                                    />
                                </Shimmer>
                                <Shimmer width="100%" key="item-options" height={3}/>
                            </div>
                        </div>
                        <div className={classes.filterRoot}>
                            <Shimmer key="top-filters" width="100%"/>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

MixAndMatchShimmer.defaultProps = {
    classes: {}
};


export default MixAndMatchShimmer;
