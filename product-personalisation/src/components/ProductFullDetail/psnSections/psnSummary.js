import React, {Fragment} from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "@bat/product-personalisation/src/components/ProductFullDetail/psnSections/psnSummary.css";
import toolbarClasses from "@bat/product-personalisation/src/components/ProductFullDetail/psnSections/actionToolbar.css";
import { ArrowLeft as BackIcon, X as RemoveIcon } from 'react-feather';
import Icon from "@magento/venia-ui/lib/components/Icon";

const PsnSummary = props => {
    const {
        cancelLink,
        handleTabHeaderClick,
        clearAreaSelection,
        psnState,
        psnConfig,
        product
    } = props;

    const classes = mergeClasses(defaultClasses, toolbarClasses, props.classes);

    const deleteIcon = <Icon src={RemoveIcon} classes={{root: classes.removeIcon}} />

    const errorMessage = 'You have an error in this field, please correct or delete your selection before you ' +
        'can continue with your purchase.'

    return (
        <Fragment>
            <div className={classes.actionToolbar}>
                <a href="#" className={classes.backIcon} onClick={e => handleTabHeaderClick(e, 1)}>
                    <Icon src={BackIcon} />
                    Back
                </a>
                {cancelLink}
            </div>

            <div data-role="title" className={classes.tabContentTitle} tabIndex="0">
                Summary
            </div>

            <div className={classes.psnSummaryContent}>
                <table>
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th colSpan="2">Customisation details</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className={classes.psnSummaryImage}>
                            <div>
                                {/*@todo: get image of swatch*/}
                                <img src={product.small_image} />
                            </div>
                        </td>
                        <td className={classes.psnSummaryDetails}>
                            <p className={classes.psnSummaryRowTitle}>{product.name}</p>
                        </td>
                        <td></td>
                    </tr>
                    {psnState.front.type && psnState.front.value ?
                        <tr id="summary-front">
                            <td className={classes.psnSummaryImage}>
                                <div>
                                    {psnState.front.type === 'text' ?
                                        <span className={psnState.front.fontFamily? psnState.front.fontFamily.toLowerCase().replace(/\s/g, '') : null}>
                                            {psnState.front.value}
                                        </span>
                                        :
                                        <img src={psnState.front.thumbnailImage} />
                                    }
                                </div>
                            </td>
                            <td className={classes.psnSummaryDetails}>
                                <p className={classes.psnSummaryRowTitle}>Front</p>
                                <dl>
                                    {psnState.front.type === 'text' ?
                                        <Fragment>
                                            <dt>Orientation</dt>
                                            <dd>{psnState.front.alignment}</dd>
                                            <dt>Typeface</dt>
                                            <dd>{psnState.front.fontFamily ? psnState.front.fontFamily : <span className={classes.notSelected}>None</span>}</dd>
                                        </Fragment>
                                        : null
                                    }
                                    <dt>{psnState.front.type}</dt>
                                    <dd className={psnState.front.error ? classes.notSelected : null}>{psnState.front.value}</dd>
                                </dl>
                                {psnState.front.error ?
                                <p className={classes.psnSummaryError}>
                                    {errorMessage}
                                </p> : null }

                                <div className={classes.psnSummaryDetailsActions}>
                                    <a href="#" className={classes.psnSummaryEdit} onClick={e => handleTabHeaderClick(e, 0)}>Edit</a>
                                    <a href="#" className={classes.psnSummaryRemove} onClick={e => clearAreaSelection(e, 'front')}>
                                        {deleteIcon}
                                        <span className={classes.hidden}>Remove</span></a>
                                </div>
                            </td>
                            <td className={classes.psnSummaryActions}>
                                <a href="#"
                                   className={classes.psnSummaryEdit}
                                   onClick={e => handleTabHeaderClick(e, 0)}>Edit
                                </a>
                                <a href="#" className={classes.psnSummaryRemove} onClick={e => clearAreaSelection(e, 'front')}>
                                    {deleteIcon}
                                    <span className={classes.hidden}>Remove</span></a>
                            </td>
                        </tr> : null
                    }
                    {psnState.back.value ?
                        <tr id="summary-back">
                            <td className={classes.psnSummaryImage}>
                                <div>
                                    {psnState.back.type === 'text' ?
                                        <span className={psnState.back.fontFamily ? psnState.back.fontFamily.toLowerCase().replace(/\s/g, '') : null}>
                                            {psnState.back.value}
                                        </span>
                                        :
                                        <img src={psnState.back.thumbnailImage} />
                                    }
                                </div>
                            </td>
                            <td className={classes.psnSummaryDetails}>
                                <p className={classes.psnSummaryRowTitle}>Back</p>
                                <dl>
                                    {psnState.back.type === 'text' ?
                                        <Fragment>
                                            <dt>Orientation</dt>
                                            <dd>{psnState.back.alignment}</dd>
                                            <dt>Typeface</dt>
                                            <dd>{psnState.back.fontFamily ? psnState.back.fontFamily : <span className={classes.notSelected}>None</span>}</dd>
                                        </Fragment>
                                        : null
                                    }
                                    <dt>{psnState.back.type}</dt>
                                    <dd className={psnState.back.error ? classes.notSelected : null}>{psnState.back.value}</dd>
                                </dl>

                                {psnState.back.error ?
                                    <p className={classes.psnSummaryError}>
                                        {errorMessage}
                                    </p> : null }

                                <div className={classes.psnSummaryDetailsActions}>
                                    <a href="#" className={classes.psnSummaryEdit} onClick={e => handleTabHeaderClick(e, 1)}>
                                        Edit
                                    </a>
                                    <a href="#" className={classes.psnSummaryRemove} onClick={e => clearAreaSelection(e, 'back')}>
                                        {deleteIcon}
                                        <span className={classes.hidden}>Remove</span></a>
                                </div>
                            </td>
                            <td className={classes.psnSummaryActions}>
                                <a href="#" className={classes.psnSummaryEdit} onClick={e => handleTabHeaderClick(e, 1)}>
                                    Edit
                                </a>
                                <a href="#" className={classes.psnSummaryRemove} onClick={e => clearAreaSelection(e, 'back')}>
                                    {deleteIcon}
                                    <span className={classes.hidden}>Remove</span></a>
                            </td>
                        </tr>
                        : null
                    }
                    </tbody>
                </table>
            </div>
            <p className={classes.psnSummaryPriceNotice}>
                {!psnState.front.value && !psnState.back.value ?
                    <span>
                        Since you haven't selected any personalisation options, you will be charged the default price.
                    </span>
                    : psnConfig.disclaimer
                }
            </p>
        </Fragment>
    )
}

export default PsnSummary;