export interface Theme {
    themeId?: string;
    themeName: string;
    fontSize: number;
    clientId: string;
    fontId: number;
    logos: Logo[];
    colourSchemes: ColourScheme[];
  }
  
  export interface Logo {
    logoId?: string;
    logoImage: string;
    themeId: string;
  }
  
  export interface ColourScheme {
    colourSchemeId?: string;
    colour: string;
    themeId: string;
  }
  
  export interface Font {
    fontId: number;
    fontName: string;
  }

  export interface ThemeDetails {
    theme: Theme;
    themeLogos: Logo[];
    themeColourSchemes: ColourScheme[];
  }
  
  export interface ThemeDto {
    themeId: string;
    themeName: string;
    fontSize: number;
    clientId: string;
    fontId: number;
  }

  //excludes the themeId as it is sent via the route/header of the request
  export interface UpdateThemeDto {
    themeName: string;
    fontSize: number;
    clientId: string;
    fontId: number;
  }