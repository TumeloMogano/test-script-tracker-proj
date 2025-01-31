export interface Client {
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientNumber: string;
    clientRegistrationNr: string;
    addressStreetNumber: string;
    addressStreetName: string;
    postalCode: string;
    cityId: number;
    city: any; // You can define a separate City interface if needed
    clientRepresentatives?: any[]; // You can define a separate ClientRepresentative interface if needed
    themes?: any[]; // You can define a separate Theme interface if needed
    projects?: any[]; // This can be a list of project interfaces or any type
  }
  