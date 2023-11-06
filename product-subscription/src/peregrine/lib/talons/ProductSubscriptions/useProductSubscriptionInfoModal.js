export const useProductSubscriptionInfoModal = () => {

    const toggleSubscriptionModal = (e) => {
        e.preventDefault();
        // @todo: this is a bit rubbish, replace with redux
        const button = document.getElementById('productInfoModal-trigger');
        if (!!button) {
            button.click();
        }
    }

    return {
        toggleSubscriptionModal
    };
};
