export interface Client{
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientNumber: string;
    clientRegistrationNr: string;
    addressStreetNumber: string;
    addressStreetName: string;
    cityName?: string;
    postalCode: string;
    region?: string;
    country?: string;   
    cityId: number;
    logoImage?: string;
}

