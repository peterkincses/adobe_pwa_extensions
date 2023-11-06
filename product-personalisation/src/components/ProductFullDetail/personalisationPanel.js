import React from "react";
import {useIntl} from "react-intl";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./personalisationPanel.css";
import toolbarClasses from "./psnSections/actionToolbar.css";
import PsnSummary from "./psnSections/psnSummary";
import PsnTabHeaders from "./psnSections/psnTabHeaders";
import PsnOptionGroupSelectors from "./psnSections/optionGroupSelectors";
import PsnOption from "./PsnOptions/option";

const PersonalisationPanel = props => {
    const {
        cancelPersonalisation,
        handleTabHeaderClick,
        handleFrontPsnTypeSelect,
        handleOptionSelection,
        skipAreaCustomisation,
        clearAreaSelection,
        psnState,
        psnConfig,
        psnOptions,
        product
    } = props;

    const classes = mergeClasses(defaultClasses, toolbarClasses, props.classes);

    const { formatMessage } = useIntl();

    const cancelLink = <a href="#" className={classes.psnCancelLink} onClick={cancelPersonalisation}>Cancel engraving</a>;

    const skipAreaLink = (area) => (
        <a href="#" className="tab-toggle clear-selection"
           onClick={e => skipAreaCustomisation(e, area)}>
            Don't customise the {area}
        </a>
    )

    const fonts = psnOptions && psnOptions.fonts ? psnOptions.fonts : null;
    const icons = psnOptions && psnOptions.icons ? psnOptions.icons : null;
    const patterns = psnOptions && psnOptions.patterns ? psnOptions.patterns : null;

    const frontOptions = [
        {type: 'pattern', options: patterns, label: 'Patterns'},
        {type: 'icon', options: icons, label: 'Mini Icons'},
        {type: 'text', options: fonts, label: 'Text'},
    ]

    return (
        <div id="pdp-personalisation-tabs" className={classes.root}>
            <PsnTabHeaders psnState={psnState} handleTabHeaderClick={handleTabHeaderClick} />
            <div className={classes.tabsContent} data-element="content">
                <div id="tab-front" key="0" className={psnState.activePanel === 0 ? '' : classes.hidden}>
                    <PsnOptionGroupSelectors
                        psnState={psnState}
                        cancelLink={cancelLink}
                        area="front"
                        frontOptions={frontOptions}
                        handleFrontPsnTypeSelect={handleFrontPsnTypeSelect}
                    />

                    {frontOptions.map((o, index) => {
                        return <PsnOption psnState={psnState}
                                          area="front"
                                          optionType={o.type}
                                          options={o.options}
                                          handleOptionSelection={handleOptionSelection}
                                          handleTabHeaderClick={handleTabHeaderClick}
                                          handleFrontPsnTypeSelect={handleFrontPsnTypeSelect}
                                          cancelPersonalisation={cancelPersonalisation}
                                          key={index}
                        />
                    })}

                    <div className={classes.actionsToolbar}>
                        <p>
                            {skipAreaLink('front')}
                        </p>
                    </div>
                </div>

                <div id="tab-back" key="1" className={psnState.activePanel === 1 ? '' : classes.hidden}>
                    <PsnOption psnState={psnState}
                               area="back"
                               optionType="text"
                               options={fonts}
                               handleOptionSelection={handleOptionSelection}
                               handleTabHeaderClick={handleTabHeaderClick}
                               handleFrontPsnTypeSelect={handleFrontPsnTypeSelect}
                               cancelPersonalisation={cancelPersonalisation}
                    />

                    <div className={classes.actionsToolbar}>
                        <p>
                            {skipAreaLink('back')}
                        </p>
                    </div>
                </div>

                <div id="tab-summary" role="tabpanel" key="2" className={psnState.activePanel === 2 ? '' : classes.hidden}>
                    <PsnSummary cancelLink={cancelLink}
                                handleTabHeaderClick={handleTabHeaderClick}
                                clearAreaSelection={clearAreaSelection}
                                psnState={psnState}
                                psnConfig={psnConfig}
                                product={product}
                    />
                </div>
            </div>
        </div>
    )
}

export default PersonalisationPanel;
