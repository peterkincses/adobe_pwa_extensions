import React from "react";
import defaultClasses from "./filters.css";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import Image from "@magento/venia-ui/lib/components/Image";
import {number, shape, string, func, array, arrayOf} from "prop-types";
import MixAndMatchGalleryItem from "../Products/Item";

const MixAndMatchFilters = (props) => {
    const {
        filters,
        appliedFilters,
        handleFilterClick,
        type,
        categoryIndex
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (!filters || !filters.length) return null;

    return <div className={classes.root}>
        {filters.map((filter, index) => {
            let filterClassName = classes.filter;
            if (appliedFilters.find(af => af.id === filter.id && af.type === type)) {
                filterClassName = classes.filterActive;
            }
            return (
                <div className={filterClassName}
                        onClick={() => handleFilterClick(filter, categoryIndex)}
                        key={'mixAndMatchFilter'+index}
                >
                    <div className={classes.filterIcon}>
                        <Image
                            classes={{ root: classes.imageRoot }}
                            src={filter.icon}
                            alt={filter.name + ' filter icon'}
                            width={28}
                            height={28}
                        />
                    </div>
                    <div className={classes.filterName}>
                        {filter.name}
                    </div>
                </div>
            )
        })}
    </div>
}

MixAndMatchFilters.propTypes = {
    filters: array.isRequired,
    appliedFilters: array,
    handleFilterClick: func.isRequired,
    type: string,
    categoryIndex: number.isRequired,
    items: arrayOf(shape({
        item: shape({
            id: number.isRequired,
            name: string.isRequired,
            icon: string.isRequired
        })
    }))
};

export default MixAndMatchFilters;
