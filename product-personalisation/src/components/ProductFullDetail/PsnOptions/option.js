import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "../personalisationPanel.css";
import toolbarClasses from "../psnSections/actionToolbar.css";
import PsnPatterns from "./patterns";
import Button from "@magento/venia-ui/lib/components/Button";
import Icon from "@magento/venia-ui/lib/components/Icon";
import { ArrowLeft as BackIcon } from 'react-feather';
import PsnIcons from "./icons";
import PsnFonts from "./fonts";
import TextDirection from "./textDirection";
import PsnTextInput from "./textInput";

const PsnOption = (props) => {
    const {
        psnState,
        area,
        optionType,
        options,
        handleOptionSelection,
        handleTabHeaderClick,
        handleFrontPsnTypeSelect,
        cancelPersonalisation
    } = props;

    const classes = mergeClasses(defaultClasses, toolbarClasses, props.classes);

    const cancelLink = <a href="#" className={classes.psnCancelLink} onClick={cancelPersonalisation}>Cancel engraving</a>;
    const frontOptionBackLink = <a href="#" className={classes.backIcon}
                                   onClick={e => handleFrontPsnTypeSelect(e, null)}>
        <Icon src={BackIcon} />
        Back
    </a>;

    const backPanelBackLink = <a href="#" className={classes.backIcon}
                                 onClick={e => handleTabHeaderClick(e, 0)}>
        <Icon src={BackIcon} />
        Back
    </a>


    const isButtonDisabled =
        area === 'back' ?
            psnState[area].type === optionType && !psnState[area].value || psnState[area].error
            : psnState[area].type === optionType && !psnState[area].value

    return (
        <div className={psnState[area].type === optionType ? '' : classes.hidden}>
            <div className={classes.actionToolbar}>
                {area === 'front' ? frontOptionBackLink : backPanelBackLink}
                {cancelLink}
            </div>

            <div className={classes.tabContentTitle}>
                {optionType === 'text' ?
                    `Add text to the ${area} of your device` : `Choose the ${optionType} you like`
                }
            </div>

            {optionType === 'text' ?
                <>
                    <TextDirection psnState={psnState}
                                   area={area}
                                   handleOptionSelection={handleOptionSelection}
                    />

                    <PsnTextInput psnState={psnState}
                                  area={area}
                                  handleOptionSelection={handleOptionSelection}
                    />
                </>
                : null
            }


            <div className={classes.personalisationOptions}>
                {optionType === 'pattern' ?
                    <PsnPatterns psnState={psnState}
                                 patterns={options}
                                 handleOptionSelection={handleOptionSelection}
                    /> : null
                }
                {optionType === 'icon' ?
                    <PsnIcons psnState={psnState}
                              icons={options}
                              handleOptionSelection={handleOptionSelection}
                    /> : null
                }
                {optionType === 'text' ?
                    <PsnFonts psnState={psnState}
                              fonts={options}
                              area={area}
                              handleOptionSelection={handleOptionSelection}
                    /> : null
                }
            </div>

            <div className={classes.actionsToolbar}>
                <Button
                    onClick={e => handleTabHeaderClick(e, area === 'front' ? 1 : 2)}
                    priority={"high"}
                    disabled={isButtonDisabled}>
                    Add and continue
                </Button>
            </div>
        </div>
    )
}

export default PsnOption;
