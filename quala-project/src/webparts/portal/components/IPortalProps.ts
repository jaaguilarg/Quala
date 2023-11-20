import { IWebPartContext } from "@microsoft/sp-webpart-base";


export interface IPortalProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: IWebPartContext;
  loadParametros: (context: any) => void;
  setSiteDetails: (data: any) => Promise<any>;
  loadPaises: (context: any) => Promise<any>;
  loadUser: (context: any,id:number) => Promise<any>;
  loadNivelesAprobacion: (context: any,id:number) => Promise<any>;
  parametros: any;
  sitio: any;
  paises: any;
  userDetail: any;
  niveles: any;
}


