export interface TaxResponse {
    amountToCollect: number;
    rate: number;
}

export interface AddressDTO {
    city: string;
    state: string;
    zipCode: string;
    street: string;
    country: 'US';
}

export interface IncomingTaxRequest {
    toAddress: AddressDTO;
    fromAddres: AddressDTO;
    subtotal: number;
    shippingCost: number;
}