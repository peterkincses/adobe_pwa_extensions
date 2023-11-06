const {Targetables} = require('@magento/pwa-buildpack');
/*
 * We are using the targetable module to add common transforms to React components.
 * With the per project, we should edit the component below.
 * @see https://developer.adobe.com/commerce/pwa-studio/api/buildpack/targetables/TargetableReactComponent
 */
module.exports = targets => {
    const targetables = Targetables.using(targets);

    const categoryDataGQL = targetables.reactComponent(
        '@magento/peregrine/lib/talons/RootComponents/Category/category.gql.js'
    );

    categoryDataGQL.insertAfterSource(
        `...CategoryFragment`,
        `\nmm_related_categories\n`
    )

    const coreCategoryContent = targetables.reactComponent(
        '@eshopworld/core/src/RootComponents/Category/categoryContent.js'
    );

    coreCategoryContent.addImport(
        "MixAndMatch from '@eshopworld/mix-and-match/src/RootComponents/Category/MixAndMatch'"
    );

    coreCategoryContent.insertAfterSource(
        `= props;`,
        `
         const isMixAndMatch = Boolean(data &&
            data.categories &&
            data.categories.items &&
            data.categories.items[0].display_mode &&
            data.categories.items[0].display_mode === 'MIX_AND_MATCH'
            && data.categories.items[0].mm_related_categories
        )

        if (isMixAndMatch) {
            const currentCategory = data.categories.items[0];
            return <MixAndMatch categoryData={currentCategory}
                                isCategoryLoading={isLoading}
                   />
        }
        `
    );
};
