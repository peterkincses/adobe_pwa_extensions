import React, {Fragment} from "react";
import {useProductPersonalisation} from "../../peregrine/lib/talons/ProductPersonalisation/useProductPersonalisation";
import PdpPersonalisationDialog from "./pdpPersonalisationDialog";

const PdpPersonalisation = props => {
    const {
        togglePsnVisibility,
        isPsnOpen,
        product
    } = props;

    const talonProps = useProductPersonalisation({
        urlKey: product.url_key,
        isPsnOpen: isPsnOpen
    });

    const {
        isPsnEnabled,
        psnConfig,
        psnOptions,
        psnProductDetails,
        psnState,
        handleTabHeaderClick,
        handleFrontPsnTypeSelect,
        handleOptionSelection,
        skipAreaCustomisation,
        clearAreaSelection
    } = talonProps;

    const shouldShow = isPsnEnabled && psnConfig && psnOptions &&
        psnProductDetails && psnProductDetails.psn_is_personalisable === true && isPsnOpen;

    return (
        <Fragment>
            {shouldShow ?
                <PdpPersonalisationDialog
                    psnState={psnState}
                    togglePsnVisibility={togglePsnVisibility}
                    handleTabHeaderClick={handleTabHeaderClick}
                    handleFrontPsnTypeSelect={handleFrontPsnTypeSelect}
                    handleOptionSelection={handleOptionSelection}
                    skipAreaCustomisation={skipAreaCustomisation}
                    clearAreaSelection={clearAreaSelection}
                    psnConfig={psnConfig}
                    psnOptions={psnOptions}
                    psnProductDetails={psnProductDetails}
                    product={product}
                /> : null
            }
        </Fragment>
    )
}

export default PdpPersonalisation;