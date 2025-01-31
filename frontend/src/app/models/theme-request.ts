import { Theme, Logo, ColourScheme } from './theme';

export interface ThemeRequest {
  theme: ThemeViewModel;
  logo: LogoViewModel;
  colourScheme: ColourSchemeViewModel;
}

export interface ThemeViewModel {
  themeName: string;
  fontSize: number;
  clientId: string;
  fontId: number;
}

export interface LogoViewModel {
  logoImage: string;
}

export interface ColourSchemeViewModel {
  colour: string;
}
