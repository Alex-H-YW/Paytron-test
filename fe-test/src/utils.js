export const markupResultCalculator = (exchangeRate, input) => {
    const markupRate = 0.005;
    const result = (exchangeRate*input- exchangeRate*input*markupRate).toFixed(4);
    return result;
};

export const trueResultCalculator = (exchangeRate, input) => {
    const result = (exchangeRate*input).toFixed(4);
    return result;
};