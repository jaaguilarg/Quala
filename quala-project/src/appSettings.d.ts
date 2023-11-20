declare interface IAppSettings {
    FunctionUrl: string;
    FunctionAppID: string;
  }
  
  declare module 'appSettings' {
    const appSettings: IAppSettings;
    export = appSettings;
  }