export function formatCurrencyDynamicFractions(inputValue: number, options = {}): string {
    let displayValue: string = '-';
    if (inputValue === 0) return displayValue;

    let maxFractionDigits = 2;
    if (inputValue < 0.01) maxFractionDigits = 4;
    if (inputValue < 0.0001) maxFractionDigits = 6;
    if (inputValue < 0.000001) maxFractionDigits = 8;
    displayValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: maxFractionDigits,
        ...options
    }).format(inputValue);

    return displayValue;
}

export function formatNumber(inputValue: number): string {
    let displayValue: string = '-';
    if (inputValue === 0) return displayValue;

    displayValue = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 2,
        notation: "compact"
    }).format(inputValue);

    return displayValue;
}

export function formatPercentage(inputValue: number): string {
    let displayValue: string = '-';
    if (inputValue === 0) return displayValue;

    displayValue = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
    }).format(inputValue / 100);

    return displayValue;
}