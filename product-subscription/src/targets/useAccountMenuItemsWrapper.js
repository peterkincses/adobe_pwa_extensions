import {useModuleConfig} from 'useModuleConfig';

const wrapUseAccountMenuItems = (original) => {
    return function useAccountMenuItems(props, ...restArgs) {
        const { menuItems, ...defaultReturnData } = original(
            props,
            ...restArgs
        );

        const { moduleConfig } = useModuleConfig({
            modules: ['subscribepro']
        });

        const menuItemsWithSubscription = menuItems.concat({
            name: 'Subscriptions',
            id: 'accountMenu.subscriptionLink',
            url: '/product-subscription'
        });

        return {
            ...defaultReturnData,
            menuItems: moduleConfig && moduleConfig.enabled ? menuItemsWithSubscription : menuItems
        };
    };
};

export default wrapUseAccountMenuItems;
