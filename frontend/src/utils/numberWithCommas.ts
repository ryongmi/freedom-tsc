export const numberWithCommas = (number: string | number) => {
    return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
