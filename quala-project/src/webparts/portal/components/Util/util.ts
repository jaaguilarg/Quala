import pnp, {SearchQuery,SearchResults} from 'sp-pnp-js';
import { SPFI,SPFx} from "@pnp/sp";
import { Queryable } from "@pnp/queryable";
import { IItem } from '@pnp/sp/items';

import "@pnp/sp/webs";
import "@pnp/sp/navigation/web";
import "@pnp/sp/lists";
import '@pnp/sp/items';
import "@pnp/sp/site-groups/web";
import "@pnp/sp/site-users/web";
import "@pnp/sp/files";
import "@pnp/sp/files/web";
import "@pnp/sp/attachments";
import "@pnp/sp/folders/web";
import "@pnp/sp/taxonomy";
import { SearchQueryBuilder } from "@pnp/sp/search";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import "@pnp/sp/sputilities";
import "@pnp/sp/webs";
import "@pnp/sp/files/web";
import "@pnp/sp/webs";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files/web";
import { UtilsFunctions } from './UtilsFunctions';
import { AuthUtils } from './AuthUtils';

export interface EmailProperties {
  To: string[];
  CC?: string[];
  BCC?: string[];
  Subject: string;
  Body: string;
  From?: string;
}

export interface IUserDetails {
  rol: string[];
  paises: string[];
  pais: string;
  sigla: string;
  gestor: boolean;
  apros: boolean;  
}

export interface FichaItemTabla {
  NombreDriver: string;
  NombrePilar: string;
  NombreModelo: string;
  NombreMecanismo: string;
}

export class PNP{
  public accessToken: any;
  public context: IWebPartContext;
  public siteRelativeUrl: string;
  public repository: string = "RepositorioTendencias";
  public web: SPFI;
  public utilsFunctions: UtilsFunctions
  
  public rootWeb: SPFI;
  private _observers: Array<(parameter: any) => void> = [];
  
  public fieldsSearch = {
    fields: ["Title", "DMSDocTitle", "ListItemID", "CreatedBy"],
  };

  

  constructor(context: IWebPartContext) {    

    
    
    this.utilsFunctions = new UtilsFunctions();
    this.context = context;
    
   
    this.siteRelativeUrl = this.context.pageContext.web.serverRelativeUrl;                

     this.initializePnPJS();
   
  };

  async initializePnPJS() {

   

    const accessToken = AuthUtils.obtenerAccessTokenAzureFunction();

    

    if (Environment.type === EnvironmentType.Local) {
      this.web = new SPFI(`<span class="math-inline">\{proxyUrl\}</span>{webRelativeUrl}`);
      this.web.web.on
    } else {
      
      this.web = spfi().using(SPFx(this.context)).using(async (options: any) => {
        
        options.headers = options.headers || {};
        options.headers["Authorization"] = `Bearer ${accessToken}`;
      });
      

      this.rootWeb = new SPFI(this.context.pageContext.site.absoluteUrl);     
    }
  

    this.rootWeb.web.on.log(function(this: Queryable, message: string, level: number) {
      if (level > 1) {
          console.log(message);
        }
    });

    this.web.web.on.log(function(this: Queryable, message: string, level: number) {
      if (level > 1) {
          console.log(message);
        }
    });
   
    this.web.using(SPFx(this.context)).using(async (options: any) => {
      options.headers = options.headers || {};
      options.headers["Authorization"] = `Bearer ${accessToken}`;
    });

    this.rootWeb.using(SPFx(this.context)).using(async (options: any) => {
      options.headers = options.headers || {};
      options.headers["Authorization"] = `Bearer ${accessToken}`;
    });
  }

  
    
  public senEmail(emailProps: EmailProperties): Promise<any> {
    return this.web.utility.sendEmail(emailProps);
  };

  public async getItembyId(listname: string, idItem: string, sigla:string): Promise<any> {   
    let url = this.getUrlDetails(this.context.pageContext.web.absoluteUrl, this.context.pageContext.site.absoluteUrl);

    const accessToken = AuthUtils.obtenerAccessTokenAzureFunction();

    if(url.urlLocal.length > 0)
    {
      this.web =  new SPFI(url.urlLocal); 
      
      this.web.web.on.log(function(this: Queryable, message: string, level: number) {
        if (level > 1) {
            console.log(message);
          }
      });
     
      this.web.using(SPFx(this.context)).using(async (options: any) => {
        options.headers = options.headers || {};
        options.headers["Authorization"] = `Bearer ${accessToken}`;
      });
  
      
    }
    
    const itemIdAsNumber = parseInt(idItem, 10);
    
      if (isNaN(itemIdAsNumber) || idItem === null) {       
          return null;
      } else {
        const query = await this.web.web.lists.getByTitle(listname).items.getById(itemIdAsNumber)().catch((err:any) => { return null});
        return query;      
      }
                        
  };

  public getListItemsRootAllFields = async (listName: string, filters: string, expand: string, sortid?: any, topItem?: number) => {
    let top = topItem ? topItem : 9999;
    let sort = sortid ? sortid : { property: "ID", asc: true };
  
    const query = this.web.web.lists.getByTitle(listName)
      .items
      .filter(filters)
      .expand(expand)
      .orderBy(sort.property, sort.asc)
      .top(top);
  
    const results = await query;
  
    return results;
  };

  public getListItemsRoot = async(
    listName: string,
    fields: any,
    filters: string,
    expand: string,
    sortid?: any,
    topItem?: number
  ): Promise<any> => {
    let top = topItem ? topItem : 9999;
    let sort = sortid ? sortid : { property: "ID", asc: true };
    
    let list: any[] = await this.rootWeb.web.lists.getByTitle(listName).items.filter(filters).select(fields).expand(expand).orderBy(sort.property, sort.asc).top(top)();               

    return list;

  };

  public getListItems = async(
    listName: string,
    fields: any,
    filters: string,
    expand: any,   
    sortid?: string,
    topItem?: number,
    sigla?: string
  ): Promise<any> => {

    const accessToken = AuthUtils.obtenerAccessTokenAzureFunction();

    let url = this.getUrlDetails(this.context.pageContext.web.absoluteUrl, this.context.pageContext.site.absoluteUrl, sigla);

    if(url.urlLocal.length > 0)
    {
      this.web =  new SPFI(url.urlLocal); 
      
      this.web.web.on.log(function(this: Queryable, message: string, level: number) {
        if (level > 1) {
            console.log(message);
          }
      });
     
      this.web.using(SPFx(this.context)).using(async (options: any) => {
        options.headers = options.headers || {};
        options.headers["Authorization"] = `Bearer ${accessToken}`;
      });
  
      
    }
    
    let top = topItem ? topItem : 9999;
    let sort = sortid ? sortid.length > 0 ? {property: sortid, asc: true} : { property: "ID", asc: true } :  { property: "ID", asc: true };



    let list: any[] = await this.web.web.lists.getByTitle(listName).items.filter(filters)
    .select(fields)
    .expand(expand)
    .orderBy(sort.property, sort.asc)
    .top(top)();
    
    return list;
  };

  public getListItemAttachments = async (listName: string, itemId: number) => {
    const list = this.web.web.lists.getByTitle(listName);

    const item = await list.items.getById(itemId);

    const attachments =  item.attachmentFiles();

    return attachments;
  };

  public deleteAttachment(listname: string, nameItem: string, idItem: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let item = this.web.web.lists.getByTitle(listname).items.getById(idItem);

      item.attachmentFiles
        .getByName(nameItem)
        .delete()
        .then((att:any) => {
          resolve(att);
        });
    });
  };

  public getListItemsPagedFeaturedTwo(
    listname: any,
    fields: any,
    filters: string,
    expand: string,
    topItem: number = 9999
  ): Promise<any> {
    return this.web.web.lists
      .getByTitle(listname)
      .items.filter(filters)
      .select(fields)
      .expand(expand)
      .top(topItem)
      .getPaged();
  };

  public getListItemsPaged(
    listname: any,
    fields: any,
    filters: string,
    expand: string,
    sort: any,
    topItem: number = 9999
  ): Promise<any> {
    return this.web.web.lists
      .getByTitle(listname)
      .items.filter(filters)
      .select(fields)
      .expand(expand)
      .orderBy(sort.property, sort.asc)
      .top(topItem)
      .getPaged();
  };

  public insertItem(
    listName: string,
    properties: any,
    attachment?: File
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let list = this.web.web.lists.getByTitle(listName);
      list.items
        .add(properties)
        .then((res:any) => {
          if (attachment) {
            res.item.attachmentFiles
              .add(attachment.name, attachment)
              .then((_:any) => {
                resolve(res.data);
              });
          } else {
            resolve(res.data);
          }
        })
        .catch((err:any) => {
          reject(err);
        });
    });
  };

  public insertItemRoot(
    listName: string,
    properties: any,
    attachment?: File
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const list = this.rootWeb.web.lists.getByTitle(listName);
      list.items
        .add(properties)
        .then((res:any) => {
          if (attachment) {
            res.item.attachmentFiles
              .add(attachment.name, attachment)
              .then((_:any) => {
                resolve(res.data);
              });
          } else {
            resolve(res.data);
          }
        })
        .catch((err:any) => {
          reject(err);
        });
    });
  };

  public deleteItem(listName: string, id: number): Promise<any> {
    let list = this.web.web.lists.getByTitle(listName);
    return list.items.getById(id).delete();
  };

  public getFiles(listName: string,sigla?:string): Promise<any> {
    let url = this.getUrlDetails(this.context.pageContext.web.absoluteUrl, this.context.pageContext.site.absoluteUrl, sigla);
    const accessToken =  AuthUtils.obtenerAccessTokenAzureFunction();
    
    if(url.urlLocal.length > 0)
    {
      this.web =  new SPFI(url.urlLocal); 
      
      this.web.web.on.log(function(this: Queryable, message: string, level: number) {
        if (level > 1) {
            console.log(message);
          }
      });
     
      this.web.using(SPFx(this.context)).using(async (options: any) => {
        options.headers = options.headers || {};
        options.headers["Authorization"] = `Bearer ${accessToken}`;
      });
  
      
    }      
    
    return this.web.web.getFolderByServerRelativePath(`${this.siteRelativeUrl}${listName}`).files();
  };

  public getFilesRoot(listName: string): Promise<any> {
    return this.rootWeb.web.getFolderByServerRelativePath(`${this.siteRelativeUrl}${listName}`).files();
  };

  public updateById(
    listname: string,
    id: number,
    properties: any,
    attachment?: File
  ): Promise<any> {

    let list = this.web.web.lists.getByTitle(listname);
    return list.items
      .getById(id)
      .update(properties)
      .then((res:any) => {
        if (attachment) {
          return this.finishSave(res.item, attachment, attachment.name).then(item => {
            return item;
          });
        } else {
          return res;
        }
      });
  };

  public updateByIdRoot(
    listname: string,
    id: number,
    properties: any,
    attachment?: File
  ): Promise<any> {

    let list = this.rootWeb.web.lists.getByTitle(listname);
    return list.items
      .getById(id)
      .update(properties)
      .then((res:any) => {
        if (attachment) {
         /* return this.finishSave(res.item, attachment, attachment.name).then(item => {
            return item;
          }); */
        } else {
          return res;
        }
      });
  };

  public uploadFileFolder(
    name: string,
    file: File,
    folder: string,
    biblioteca: string
  ): Promise<any> {
    return this.web.web
      .getFolderByServerRelativePath(
        `${this.siteRelativeUrl}/${biblioteca}/${folder}/`
      )
      .files.addChunked(name, file);
  };

  public uploadFile(
    repository: string,
    file: File,
    name: string
  ): Promise<any> {
    return this.web.web.getFolderByServerRelativePath(repository).files.addChunked(name,file,(data:any) => {
      console.log(`progress`);
      console.log(data)
      }, true)
  };
 
  public uploadFileWithFields(
    repository: string,
    file: File,
    name: string,
    fields?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let fileobject = this.web.web.getFolderByServerRelativePath(
        `${this.siteRelativeUrl}/${repository}/`
      );
      fileobject.files
        .addChunked(name, file)
        .then((res:any) => {
          if (fields) {
            res.file.getItem().then((item:any) => {
              item.update(fields).then((myupdate:any) => {
                resolve(myupdate);
              });
            });
          }
        })
        .catch((err:any) => {
          reject(err);
        });
    });
  };

  public deleteFileByPath(url: string): Promise<any> {
    return this.web.web.getFileByServerRelativePath(url).delete();
  };

  public getFileByName(listName: string, fileName: string): Promise<any> {
    return this.web
      .web.getFileByServerRelativePath(
        `${this.siteRelativeUrl}/${listName}/${fileName}`
      )
      .getText();
  }

  public getAdjunt(listname: string, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let item = this.web.web.lists.getByTitle(listname).items.getById(id);
      item.attachmentFiles().then((v:any) => {
        resolve(v);
      });
    });
  }

  public deleteAdjunt(
    listname: string,
    id: number,
    name: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let item = this.web.web.lists.getByTitle(listname).items.getById(id);
      item.attachmentFiles
        .getByName(name)
        .delete()
        .then((v:any) => {
          resolve(v);
        });
    });
  }

  public addObserver(observer: (parameter: any) => void) {
    this._observers.push(observer);
  }

  public async finishSave(
    item: IItem,
    attachment: File,
    attachmentName: string
  ) {
    if (attachment) {
      await item.attachmentFiles.add(attachmentName, attachment);
      const itemUpdated = await item;
      return itemUpdated;
    } else {
      const itemUpdated = await item;
      return itemUpdated;
    }
  }

  public getCurrentUser(): Promise<any> {        
   
     return this.web.web.currentUser();
  }

  public getUserInfoOffice(): Promise<any> {
    return pnp.graph.v1.get();
  }

  public getGroups(): Promise<any> {    
    return this.web.web.siteGroups();
  }

  public getGroupsByUser(id: number): Promise<any> {
    return this.web.web.siteUsers.getById(id).groups();
  }

  public getByIdUser(id: number): Promise<any> {
    return this.web.web.getUserById(id)();
  }

  public getByUser(Title: string): Promise<any> {
    return this.web.web.siteUsers.filter(`Title eq '${Title}'`)();
  }

  public async getParameters(): Promise<any> {          
    try
    {
      return await this.getListItemsRoot("Parametros Tecnicos", "", "", "", "");
    }
    catch
    {
      return this.utilsFunctions.GetItems({"SiteName":"PRGCDEV", "ListName":"Parametros Tecnicos"})
    }        
  
  }

  public async getPaises(): Promise<any>
  {
    try
    {
      return await this.getListItemsRoot("Paises",["*"],"","",{property: "Orden", asc: true});
    }
    catch
    {
      return this.utilsFunctions.GetItems({"SiteName":"PRGCDEV", "ListName":"Paises"})
    } 
  }

  // Obtener los elementos de la lista "Seguridad por usuario" donde el campo "Usuario" coincide con el ID proporcionado.  
  public async getRolByUser(id: number): Promise<IUserDetails> {
    
    const sViewlXml = `<View>
                        <ViewFields>
                          <FieldRef Name="Pais"/>                       
                          <FieldRef Name="Rol"/>
                          <FieldRef Name="Usuario"/>
                        </ViewFields>
                        <Query>
                          <Where>
                              <Eq>
                                  <FieldRef Name="Usuario" LookupId="TRUE"/>
                                  <Value Type="Lookup">${id}</Value>
                              </Eq>                
                          </Where>
                        </Query>  
                      </View>`;
    
                      
    let results:any;

    let userDetail: IUserDetails = {
      rol: ["Lector"],
      paises:["Nova"],
      pais: "Nova",
      sigla: "NV",
      gestor: false,
      apros: false
    };
    
    try
    {
      results = await this.rootWeb.web.lists.getByTitle('Seguridad por usuario').getItemsByCAMLQuery({ViewXml: sViewlXml});
      
    } 
    catch
    {
      return userDetail;
    } 
            
    if (results.length === 0) {       
      return userDetail;           
    }   
                  
    const paisId = results[0].PaisId;
    
    const paises = results.map((item:any)=> item.PaisId);
                  
    const paisItem = await this.rootWeb.web.lists.getByTitle('Paises').items.getById(paisId)();
    
    
    const nombrePais = paisItem.Nombre_x0020_Pais;
    const sigla = paisItem.Sigla;
                  
    const bGestor = !!results[0].Rol.find((x: any) => x.Label === "Gestor" || x.Label === "Administrador");;
    const bApros = !!results[0].Rol.find((x: any) => x.Label === "Aprobador");
                  
    userDetail = {
      rol:  results[0].Rol?.map((x: any) => x.Label) || [],
      paises: paises,
      pais: nombrePais,
      sigla: sigla,
      gestor: bGestor,
      apros: bApros
    };    
                  
    return userDetail;

  }

  public async getUsersByCountry(countryName: string): Promise<IUserDetails[]> {
  
    // Primero, obtenemos el ID del pas basado en el nombre del pas
    const countryItems = await this.rootWeb.web.lists.getByTitle('Paises').items.filter(`Nombre_x0020_Pais eq '${countryName}'`).select('Id, Sigla')();
    if (countryItems.length === 0) {
      throw new Error(`No se encontr el pas con nombre ${countryName}`);
    }
    
    const countryId = countryItems[0].Id;
    const countrySigla = countryItems[0].Sigla;
  
    // Ahora, recuperamos todos los usuarios con ese ID de pas
    const sViewlXml = `<View>
                        <ViewFields>
                          <FieldRef Name="Pais"/>                       
                          <FieldRef Name="Rol"/>
                          <FieldRef Name="Usuario"/>                                                    
                        </ViewFields>
                        <Query>
                          <Where>
                              <Eq>
                                  <FieldRef Name="Pais" LookupId="TRUE"/>
                                  <Value Type="Lookup">${countryId}</Value>
                              </Eq>                
                          </Where>
                        </Query>  
                      </View>`;
  
    const results = await this.rootWeb.web.lists.getByTitle('Seguridad por usuario').getItemsByCAMLQuery({ViewXml: sViewlXml});
    

    const userDetailsPromises: Promise<IUserDetails>[] = results.map(async (result:any) => {
      const bGestor = (result.Rol.Label == "Gestor" || result.Rol.Label == "Administrador") ? true : false;
      const bApros = (result.Rol.Label == "Aprobador") ? true : false;
      
      const user = await this.web.web.getUserById(result.UsuarioId)();
      
      return {
        rol: result.Rol.Label,
        pais: countryName,
        sigla: countrySigla,
        gestor: bGestor,
        apros: bApros,
        userName: user.Title,  
        userEmail: user.Email, 
        userId: user.Id
      };
    });
  
    const userDetailsList = await Promise.all(userDetailsPromises);


    return userDetailsList;
  }
  
  public async getMenuInfoFC(sigla: string, rol: string): Promise<any> {
    
    sigla =="" ? sigla = "NV" : sigla=sigla;   
       
    if(rol=="Lector")
    {
      return this.utilsFunctions.GetItems({"SiteName": sigla, "ListName": "Menu Informacion GC"})
      
    }else
    {
      return this.getListItems("Menu Informacion GC",["*"],"","","",0,sigla); 
    }              
  
  } 

  public async getMacroProcesos(sigla: string, rol: string): Promise<any>{
    
    sigla =="" ? sigla = "NV" : sigla="";

    if(rol=="Lector")
    {
      return this.utilsFunctions.GetItems({"SiteName": sigla, "ListName": "Macroprocesos"});
      
    }else{
      return this.getListItems("Macroprocesos",["*"],"","","Orden_x0020_Menu",0,sigla); 
    }

    
       

  }

  public getGroupsByUserId(Id: number): Promise<any> {
    return this.web.web.siteUsers.getById(Id).groups();
  }

  public getUserInGroup(groupName: string, userID: number): Promise<any> {
    return this.web.web.siteGroups.getByName(groupName).users.getById(userID)();
  }

  public getAllUserGroup(groupId: number): Promise<any> {
    return this.web.web.siteGroups.getById(groupId).users();
  }

  public getImageFile(name: string) {
    if (name !== undefined && name !== "") {
      const val = name.split(".");
      var ext = val[val.length - 1].toLocaleLowerCase();

      var ico = "exe.svg";

      if (ext === "txt") {
        ico = "txt.svg";
      } else if (ext === "xls" || ext === "xlsx" || ext === "csv" || ext === "xlsm" || ext === "xlsb")
      {
        ico = "xlsx.svg";
      } else if (ext === "doc" || ext === "docx") {
        ico = "docx.svg";
      } else if (ext === "pdf") {
        ico = "pdf.svg";
      } else if (ext === "ppt" || ext === "pptm" || ext === "pptx") {
        ico = "pptx.svg";
      } else if (ext === "png" || ext === "jpg" || ext === "gif" || ext === "jpeg" || ext === "svg") 
      {
        ico = "photo.svg";
        // } else if (ext == 'zip' || ext == 'rar') {
        //   ico = "photo.svg";
      } else if (ext === "js" || ext === "css") {
        ico = "code.svg";
      } else if (ext === "TTF") {
        ico = "font.svg";
      } else if (ext === "mp4" || ext === "mov" || ext === "mpg") {
        ico = "video.svg";
      } else if (ext === "html") {
        ico = "html.svg";
      } else if (ext === "one") {
        ico = "one.svg";
      } else if (ext === "vsdx") {
        ico = "vsdx.svg";
      } else if (ext === "aspx") {
        ico = "spo.svg";
      } else if (ext === "msg") {
        ico = "email.svg";
      } else if (ext === "fig") {
        ico = "vector.svg";
      } else if (ext === "url") {
        ico = "link.svg";
      } else if (ext === "zip" || ext === "rar") {
        ico = "zip.svg";
      } else if (ext === "bpm" || ext === "bpmx" || ext === "bpmn") {
        ico = "bpm.svg";
      } else {
        ico = "genericfile.svg";
      }

      return (
        "https://res-1.cdn.office.net/files/fabric-cdn-prod_20220628.003/assets/item-types/20/" +
        ico
      );
    }
  }
 
  public validarURL(url:string) {
    try {
        new URL(url); 
        let response:any;

        fetch(url, {method: 'GET',}).then((item) => {
          response = item;
          
          if(response.status === 200){
            console.log(response.status);
            return true
          } else{
            console.log(response.status);
            return false
          }  
        });                
    } catch (err) {
        return false;
    }
  }

  public genericFile() {
    return "https://res-1.cdn.office.net/files/fabric-cdn-prod_20220628.003/assets/item-types/20/genericfile.svg";
  }

  public getAllUserGroupName(groupName: string): Promise<any> {
    return this.web.web.siteGroups.getByName(groupName).users();
  }

  public async searchInLib(
    siteUrl: string,
    refiners: any,
    // rows: number,
    listName: string,
    sort: any,
    text: string = ""
  ): Promise<any> {
    try {
      let filters: any = [];
      if (refiners) {
        filters = [`${refiners}`];
      }
      let query: string = `path:${siteUrl}/${listName}/ (ListItemID:${text}) OR ${text}*`;

      const searchQuery: SearchQuery = {
        EnableInterleaving: true,
        Querytext: query,
        RefinementFilters: filters,
        RowLimit: 20,
        SelectProperties: this.fieldsSearch.fields,
        SortList: sort,
        TrimDuplicates: false,
      };

      const data: SearchResults = await pnp.sp.search(searchQuery);
      return data.PrimarySearchResults;
    } catch (error) {
      console.log(`Error consultando Señales: ${error}`);
      return null;
    }
  }

  public async getQueryStringParam(field: string, url: string): Promise<any> {
    try {
      const href = url ? url : decodeURIComponent(window.location.href);
      const reg = new RegExp("[?&#]" + field + "=([^&#]*)", "i");
      const qs = reg.exec(href);
      return qs ? qs[1] : null;
    } catch (error) {
      console.log(`Error: ${error}`);
      return null;
    }
  }

  async searchInLibrary(urlSite: string, text: string, sigla:string,llammada:string, refiners?: any): Promise<any> {
    try {
      let query = "";
      const ext = [
        'IsContainer:equals("false")',
        'FileType:not("aspx")',
        'not(FileName:or("DispForm.aspx","AllItems.aspx","ByAuthor.aspx"))',
      ];

      let refi = refiners ? [...ext, ...refiners] : ext;
  
      if (text.length >0) {
        query = `path:${urlSite}/ (FileName:${text}*) OR (${text}*)`;
      } else {
        query = `path:${urlSite}/ *`;
      }       
            
      const searchQuery =  SearchQueryBuilder(query, {
        RefinementFilters: refi,          
        SelectProperties: [
          "ListItemID",
          "IsContainer",
          "FileName",
          "FileType",
          "FileExtension",
          "LinkingUrl",
          "ModifiedOWSDATE",
          "ParentLink",
          "Path",
          "PictureThumbnailURL",
          "ServerRedirectedEmbedURL",
          "PictureURL",
          "Preview",
          "Title",
          "Proceso",
          "Planta",
          "Seguridad",
          "Pais",
          "Direccion",
          "Area",
          "Subarea",  
          "Tipomecanismo",
          "Categoria",
          "IDMecanismoLocal"
        ],
      }).rowLimit(5000)
      ;

      const accessToken = AuthUtils.obtenerAccessTokenAzureFunction();
      
      this.web =  new SPFI(urlSite); 
      
      this.web.web.on.log(function(this: Queryable, message: string, level: number) {
        if (level > 1) {
            console.log(message);
          }
      });

      
     
      this.web.using(SPFx(this.context)).using(async (options: any) => {
        options.headers = options.headers || {};
        options.headers["Authorization"] = `Bearer ${accessToken}`;
      });
  
            
      const results = await this.web.search(searchQuery);                 
      

      return {
        data: results.PrimarySearchResults,
        count: results.TotalRows
      };  
      
         
    } catch (error) {
      console.log(`Error consultando Query: ${error}`);
      return null;
    }
  }

 
  async searchInLibraryII(urlSite: string, text: string, sigla: string, llammada: string, refiners?: any): Promise<any> {
    try {
        const accessToken = AuthUtils.obtenerAccessTokenAzureFunction();
        let query = "";
        const pageSize = 50; // Tamaño de pgina
        let startRow = 0; // Inicio de fila
        let allPrimaryResults:any[] = []; // Para almacenar todos los resultados primarios
        let totalRows = 0; // Total de filas
        let moreResults = true; // Bandera para continuar la paginacin

        const ext = [
            'IsContainer:equals("false")',
            'FileType:not("aspx")',
            'not(FileName:or("DispForm.aspx","AllItems.aspx","ByAuthor.aspx"))',
        ];

        let refi = refiners ? [...ext, ...refiners] : ext;

        if (text.length > 0) {
            query = `path:${urlSite + "Publicado/Publico"} (FileName:${text}*) OR (${text}*)`;
        } else {
            query = `path:${urlSite + "Publicado/Publico"}  *`;
        }

        this.web = new SPFI(urlSite);
        this.web.using(SPFx(this.context)).using(async (options: any) => {
          options.headers = options.headers || {};
          options.headers["Authorization"] = `Bearer ${accessToken}`;
        });
                

        while (moreResults) {
            const searchQuery = SearchQueryBuilder(query, {
                RefinementFilters: refi,
                SelectProperties: ["ListItemID", "IsContainer", "FileType","FileName",
                "FileExtension","LinkingUrl","ModifiedOWSDATE","ParentLink",
                "Path","PictureThumbnailURL","ServerRedirectedEmbedURL","PictureURL",
                "Preview","Title","Proceso","Planta","Seguridad","Pais","Direccion",
                "Area","Subarea","Tipomecanismo","Categoria","IDMecanismoLocal"],
            }).rowLimit(pageSize).startRow(startRow);

            const results = await this.web.search(searchQuery);

            if (results.PrimarySearchResults.length > 0) {
                allPrimaryResults = allPrimaryResults.concat(results.PrimarySearchResults);
                totalRows = results.TotalRows; // Actualizar el total de filas

                // Si se reciben menos resultados de los solicitados, se ha llegado al final
                if (results.PrimarySearchResults.length < pageSize) {
                    moreResults = false;
                }

                startRow += results.PrimarySearchResults.length;
            } else {
                moreResults = false; // No hay ms resultados
            }
        }

        return {
          data: allPrimaryResults,
          count: totalRows
        };         

    } catch (error) {
        console.log(`Error consultando Query: ${error}`);
        return null;
    }
  }

  async searchInLibraryIII(urlSite: string, text: string, sigla: string, llamada: string, currentPage: number, refiners?: any): Promise<any> {
    try {
      const accessToken = AuthUtils.obtenerAccessTokenAzureFunction();
        const pageSize = 10;
        let query = "";

        const ext = [
          'IsContainer:equals("false")',
          'FileType:not("aspx")',
          'not(FileName:or("DispForm.aspx","AllItems.aspx","ByAuthor.aspx"))',
        ];

        let refi = refiners ? [...ext, ...refiners] : ext;

        if (text.length > 0) {
            query = `path:${urlSite}/ (FileName:${text}*) OR (${text}*)`;
        } else {
            query = `path:${urlSite}/ *`;
        }

        const startRow = currentPage * pageSize; 

        this.web = new SPFI(urlSite);
        this.web.using(SPFx(this.context)).using(async (options: any) => {
          options.headers = options.headers || {};
          options.headers["Authorization"] = `Bearer ${accessToken}`;
        });
    

        const searchQuery = SearchQueryBuilder(query, {
            RefinementFilters: refi,
            SelectProperties: ["ListItemID", "IsContainer", "FileType","FileName",
            "FileExtension","LinkingUrl","ModifiedOWSDATE","ParentLink",
            "Path","PictureThumbnailURL","ServerRedirectedEmbedURL","PictureURL",
            "Preview","Title","Proceso","Planta","Seguridad","Pais","Direccion",
            "Area","Subarea","Tipomecanismo","Categoria","IDMecanismoLocal"],
        }).rowLimit(pageSize).startRow(startRow);

        const results = await this.web.search(searchQuery);

        return {
            data: results.PrimarySearchResults, 
            count: results.TotalRows, 
            pageSize: pageSize, 
            currentPage: currentPage 
        };

    } catch (error) {
        console.log(`Error consultando Query: ${error}`);
        return null;
    }
  }

  public getListItemsWithTaxo(
      type: any,
      listName: string,
      ViewXml: string,
      filterXml?: string,
      urlSub?: string
    ): Promise<any> {
      return new Promise((resolve, reject) => {
        var url = "";
        
        if (type === "root") {
          url = this.context.pageContext.site.absoluteUrl;
        } else {
          url = this.getUrlDetails(this.context.pageContext.web.absoluteUrl, this.context.pageContext.site.absoluteUrl).urlLocal;
        }
       

        const restAPI = `${url}/_api/web/Lists/getByTitle('${listName}')/RenderListDataAsStream`;

        this.context.spHttpClient
          .post(restAPI, SPHttpClient.configurations.v1, {
            body: JSON.stringify({
              parameters: {
                RenderOptions: 2,
                ViewXml: `<View>
                              <ViewFields>
                              ${ViewXml}
                              </ViewFields>
                              ${filterXml || ""}
                            </View>`,
              },
            }),
          })
          .then((data: SPHttpClientResponse) =>{
            if (!data.ok) {
              throw new Error(`HTTP error! Status: ${data.status}`);
            } 
            return data.json()}
           )
          .then((data: any) => {
            if (data && data.Row && data.Row.length > 0) {
              resolve(data.Row);
            }
          }).catch((error) => {            
            reject(error); 
        });
      });
  }


  public getListItemsWithTaxoRoot(
    type: any,
    listName: string,
    ViewXml: string,
    filterXml?: string,
    urlSub?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      var url = "";
      url = this.context.pageContext.site.absoluteUrl

     

      const restAPI = `${url}/_api/web/Lists/getByTitle('${listName}')/RenderListDataAsStream`;

    

      this.context.spHttpClient.post(restAPI, SPHttpClient.configurations.v1, {
          headers: {
            'Content-Type': 'application/json',
         },
          body: JSON.stringify({
            parameters: {
              RenderOptions: 2,
              ViewXml: `<View>
                            <ViewFields>
                            ${ViewXml}
                            </ViewFields>
                            ${filterXml || ""}
                          </View>`,
            },
          }),
        })
        .then((data: SPHttpClientResponse) =>{
          if (!data.ok) {
            console.error(`Error HTTP! Estado: ${data.status}`);
            console.error(`Detalles del error: ${data.statusText}`);
            throw new Error(`Error HTTP! Estado: ${data.status}`);
          } 
          return data.json()}
         )
        .then((data: any) => {
          if (data && data.Row && data.Row.length > 0) {
            return(data.Row);
          }
        }).catch((error) => {            
          reject(error); 
      });
    });
}
  
  public deleteFilesByPath(
    deletedocs: any,
    NombreCarpeta: any,
    Biblioteca: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (deletedocs.length > 0) {
        deletedocs.forEach((key: any) => {
          const Nombre = key.Name;

          this.web.web
            .getFileByServerRelativePath(
              `${this.siteRelativeUrl}/${Biblioteca}/${NombreCarpeta}/${Nombre}`
            )
            .recycle();
        });
        resolve(true);
      } else {
        reject(false);
      }
    });
  }

  public createdFolder(folder: string, biblioteca: string): Promise<any> {
    //return this.web.lists.getByTitle(biblioteca).rootFolder.folders.add(folder);
    return this.web.web.getFolderByServerRelativePath(biblioteca).folders.addUsingPath(folder);
  }

  public async createdDocumentSet(listName:any, folder:any, folderName:any) {
  
    //const lib = this.web.web.lists.getByTitle(listName);
    /*const fldObj = await lib.rootFolder.folders.g getByName(folder).folders.getByName(folderName).listItemAllFields.get();
    await lib.items.getById(fldObj.Id).update({
      ContentTypeId: "0x0120D520"
    });*/

  }

  public updateFileFolder(name: string, file: File, folder: string, biblioteca: string, fields: any): Promise<any> {
  
    return this.web.web.getFolderByServerRelativePath(biblioteca).folders.addUsingPath(folder);

  }
  
  public async consultarModelo(sitioSigla: string, direccion: string, subArea?: string, idVisor?: string): Promise<any> {
  
   const ViewXml = `
    <FieldRef Name="Nombre_x0020_Direccion"/>
    <FieldRef Name="Nombre_x0020_Area"/>      
    <FieldRef Name="Vinculo_x0020_Portada_x0020_Mode"/>
    <FieldRef Name="Vinculo_x0020_Mapa_x0020_Mecanis"/>
    `;
    
    let filterXml = "";

    if (subArea !== undefined) {
        filterXml = `
        <Query>
            <Where>
                <Eq>
                    <FieldRef Name="Nombre_x0020_Modelo_x0020_Base" />
                    <Value Type="TaxonomyFieldType">${direccion}</Value>
                </Eq>
                <Eq>
                    <FieldRef Name="Nombre_x0020_Area" />
                    <Value Type="TaxonomyFieldType">${idVisor}</Value>
                </Eq>
                <Eq>
                    <FieldRef Name="Nombre_x0020_Sub_x0020_area" />
                    <Value Type="TaxonomyFieldType">${subArea}</Value>
                </Eq>
            </Where>
        </Query>
        `;
    } else if (idVisor !== undefined) {

       filterXml = `
        <Query>
            <Where>
                <Eq>
                    <FieldRef Name="Nombre_x0020_Area" />
                    <Value Type="TaxonomyFieldType">${idVisor.split("_").join(" ")}</Value>
                </Eq>
            </Where>
        </Query>
        `;
    } else {
        filterXml = `
        <Query>
            <Where>
                <Eq>
                    <FieldRef Name="Nombre_x0020_Modelo_x0020_Base" />
                    <Value Type="TaxonomyFieldType">${direccion}</Value>
                </Eq>
            </Where>
        </Query>
        `;
    }
      
    return new Promise((resolve, reject) => {
      this.getListItemsWithTaxo('', 'Modelos%20Local', ViewXml, filterXml, sitioSigla).then(items =>  {        
        resolve(items)
      }
      );
    });
  }

  public async consultarMecanismosByDriver(driver:string): Promise<any>{
    const ViewXml = `
    <FieldRef Name="ID"/>
    <FieldRef Name="ID_x0020_Driver_x0020_Local"/>
    <FieldRef Name="Nombre_x0020_Driver"/>
    <FieldRef Name="Mecanismo_x0020_del_x0020_Driver"/>      
    <FieldRef Name="Nombre_x0020_Pilar"/>
    <FieldRef Name="Vinculo_x0020_Mapa_x0020_Mecanis"/>
    <FieldRef Name="Nombre_x0020_Mecanismo_x0020_Loc"/>
    <FieldRef Name="Proceso"/>
    <FieldRef Name="Porcentaje_x0020_Implementacion"/>
    <FieldRef Name="No_x0020_Mecanismo_x0020_Local"/>
    <FieldRef Name="Nivel_x0020_Implementacion"/>
    <FieldRef Name="Habilitado"/>
    <FieldRef Name="URL_x0020_DocumentSet"/>
    <FieldRef Name="Mecanismos_x0020_Asociados"/>
    

    `;

    const filterXml = `
        <Query>
            <Where>
                <Eq>
                    <FieldRef Name="ID_x0020_Driver_x0020_Local" />
                    <Value Type="TaxonomyFieldType">${driver}</Value>
                </Eq>
                <Eq>
                    <FieldRef Name="Habilitado" />
                    <Value Type="Boolean">1</Value>
                </Eq>

                       
            </Where>
        </Query>
        `;
      
    return new Promise((resolve, reject) => {
          this.getListItemsWithTaxo('', 'Mecanismos%20Local', ViewXml, filterXml).then(items =>  {        
            resolve(items);          
          }
      );
    });

  }

  public async consultarMecanismosById(id: number): Promise<any>{
    const ViewXml = `
    <FieldRef Name="ID"/>
    <FieldRef Name="ID_x0020_Driver_x0020_Local"/>
    <FieldRef Name="Nombre_x0020_Driver"/>
    <FieldRef Name="Mecanismo_x0020_del_x0020_Driver"/>
    <FieldRef Name="No_x0020_Pilar"/>      
    <FieldRef Name="Nombre_x0020_Pilar"/>
    <FieldRef Name="Vinculo_x0020_Mapa_x0020_Mecanis"/>
    <FieldRef Name="Nombre_x0020_Mecanismo_x0020_Loc"/>
    <FieldRef Name="Proceso"/>
    <FieldRef Name="Planta"/>
    <FieldRef Name="Elabora"/>
    <FieldRef Name="Direccion"/>
    <FieldRef Name="Area"/>
    <FieldRef Name="Sub_x0020_Area"/>
    <FieldRef Name="Tipo_x0020_de_x0020_mecanismo"/>
    <FieldRef Name="Persona_x0020_ElaboraId"/>
    <FieldRef Name="Persona_x0020_RevisaId"/>
    <FieldRef Name="Persona_x0020_ApruebaId"/>
    <FieldRef Name="Nombre_x0020_Modelo"/>
    <FieldRef Name="Seguridad"/>
    <FieldRef Name="URL_x0020_DocumentSet"/>

    `;

    const filterXml = `
        <Query>
            <Where>
                <Eq>
                    <FieldRef Name="ID" />
                    <Value Type='Number'>${id}</Value>
                </Eq>                
            </Where>
        </Query>`;
      
    return new Promise((resolve, reject) => {
          this.getListItemsWithTaxo('', 'Mecanismos Local', ViewXml, filterXml).then(items =>  {        
            resolve(items);
            
          }
      );
    });
  }

  public async getMatrizPermisosByTipoM(tipoMecanismo: string, paisId:number): Promise<any>{

    const ViewXml = `
    <FieldRef Name="ID"/>
    <FieldRef Name="PaisId"/>
    <FieldRef Name="Tipo_x0020_Mecanismo"/>
    <FieldRef Name="Revisor"/>
    <FieldRef Name="PublicadorId"/>
    <FieldRef Name="Aprobador_x0020_Revisa"/>
    <FieldRef Name="Gerente_x0020_de_x0020_Area"/>
    <FieldRef Name="Auditor"/>
    <FieldRef Name="Jefe_x0020_o_x0020_Gerente_x0020"/>
    <FieldRef Name="DirectorGH"/>
    <FieldRef Name="Director_x0020_area"/>
    <FieldRef Name="Director_x0020_General"/>
    <FieldRef Name="Presidente_x0020_Ejecutivo"/>
    <FieldRef Name="Lider_x0020_de_x0020_modelo_x002"/>
    <FieldRef Name="IdModeloLocal"/>
    `;

    const filterXml = `
    <Query>
        <Where>
            <Eq>
                <FieldRef Name="Tipo_x0020_Mecanismo" />
                <Value Type='tipoMecanismo'>${tipoMecanismo}</Value>
            </Eq>
            <Eq>
                <FieldRef Name="PaisId" />
                <Value Type='Number'>${paisId}</Value>
            </Eq>                       
        </Where>
    </Query>`;

    return new Promise((resolve, reject) => {
      this.getListItemsWithTaxo('root', 'Matriz de revision publicacion y aprobacion', ViewXml, filterXml).then(items =>  {        
        resolve(items);
        
          }
      );
    });

  }

  public async getNivelesByPais(paisId:number): Promise<any>{

    const ViewXml = `
    <FieldRef Name="ID"/>
    <FieldRef Name="Pais"/>
    <FieldRef Name="Tipo_x0020_Mecanismo"/>
    <FieldRef Name="Elabora"/>
    <FieldRef Name="Revisa"/>      
    <FieldRef Name="Aprueba"/>
    <FieldRef Name="Area_x0020_Involucrada"/>
    <FieldRef Name="Director_x0020_GH"/>
    <FieldRef Name="Director_x0020_area"/>
    <FieldRef Name="Director_x0020_General"/>
    <FieldRef Name="Presidente_x0020_Ejecutivo"/> 
    `;

    const filterXml = `
    <Query>
        <Where>           
            <Eq>
                <FieldRef Name="Pais" />
                <Value Type='Number'>${paisId}</Value>
            </Eq>                       
        </Where>
    </Query>`;

    return new Promise((resolve, reject) => {
      this.getListItemsWithTaxo('root', 'Niveles de aprobacion', ViewXml, filterXml).then(items =>  {        
       resolve(items);
        
          }
      );
    });
  }

  public async getTerms(): Promise<any> {

    return await this.web.termStore.groups.getById("c7265500-76f2-40c8-9835-c0a332b66135").sets.getById("5f486236-a2bb-4256-93d7-cf6172bb3dbb").children();
  }

  public async getAllsTermsWithGroups(): Promise<any>{
    try {
      
      const store = this.web.termStore;
      const groups = await store.groups();
      
      let todosLosTerminos:any[] = [];
  
      for (let grupo of groups) {
        const termSets = await store.groups.getById(grupo.id).sets();

        for (let termSet of termSets) {
          const terms = await store.groups.getById(grupo.id).sets.getById(termSet.id).terms();
            
          const termsWithGroupAndSetName = terms.map(term => ({
            label: term.labels[0].name,
            groupName: grupo.name,  // Agregar el nombre del grupo aqu
            termSetName: termSet.localizedNames[0].name // Agregar el nombre del term set aqu
          }));
  
          todosLosTerminos = [...todosLosTerminos, ...termsWithGroupAndSetName];
        }        
      }
  
      return todosLosTerminos;    
  
    } catch (error) {
      console.error("Error al obtener los trminos:", error);
    }
  }
  
  public async getTerms1(idGroup:string,idset:string): Promise<any> {

    return await this.web.termStore.groups.getById(idGroup).sets.getById(idset).children();
  }

  public AbrirNuevaVentana(link: string) {
    window.open(link, "_blank");
  }

  /*
  private async updateSearchDataWithMecanismoLocal(data: any[], sigla: string, url:string): Promise<any[]> {
    let updatedData = [];
    
    try
    {
      const updatedDataPromises = data.map(async item => {      
        const listItem = await this.getItembyId("Publicado", item.ListItemID, sigla);
        
        return {...item,IDMecanismoLocal: listItem?.MecanismoLocalIDId || null};
      });

      updatedData = await Promise.all(updatedDataPromises);
   }
   catch{
    updatedData = data;
   }  
    return updatedData;
  }*/

  public getUrlDetails(url: string, urlPrincipal: string, sigla?: string): {urlLocal: string} {
    

    if(sigla==undefined)
    {
      let urlLocal = url == urlPrincipal ? url + "/NV" :  url;
      return {urlLocal}
    }
    else
    {
      let urlLocal = urlPrincipal + "/" + sigla ;
      return {urlLocal}
    }
               
  }

  public getLibraryimages(){
    return   this.rootWeb.web.getFolderByServerRelativePath("ActivosGC/Root").files();
  }

  // Funcion para consultar los archivos del mecanismo
  public async ObtenerArchivosByMecanismo(NombreMecanismo: string, Seguridad: string, Direccion?:string, IdVisor?:string): Promise<any> {
           
    let sigla = ""
    
    this.context.pageContext.web.absoluteUrl == this.context.pageContext.site.absoluteUrl ? sigla="/NV" : "";

    if (IdVisor == undefined) {           
      return await this.getFiles(sigla + "/Publicado/" + Seguridad + "/" + Direccion + "/" + NombreMecanismo)       
    } else {      
      return await this.getFiles(sigla + "/Publicado/" + Seguridad + "/" +  IdVisor + "/" + NombreMecanismo)        
    }
  }

  // Funcion para consultar los archivos del mecanismo
  public async ObtenerArchivosByMecanismoSigla(NombreMecanismo: string, Seguridad: string, Direccion:string, IdVisor:string, sigla:string): Promise<any> {              
    if (IdVisor == undefined) {           
      return await this.getFiles("/" + sigla + "/Publicado/" + Seguridad + "/" + Direccion + "/" + NombreMecanismo, sigla)       
    } else {      
      return await this.getFiles("/" + sigla + "/Publicado/" + Seguridad + "/" +  IdVisor + "/" + NombreMecanismo, sigla)        
    }
  }

  // funcion para consultar ficha
  public async consultarFichaForTable(NombreMecanismo:string): Promise<FichaItemTabla[]> {
    let _ficha: FichaItemTabla[] = [];


    try {
      const items: any[] = await this.getListItems(
        "Mecanismos Local",
        ["ID","ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver","Nombre_x0020_Mecanismo_x0020_Loc", "Mecanismos_x0020_AsociadosId","Nombre_x0020_Pilar","Nombre_x0020_Modelo,No_x0020_Pilar,ID_x0020_Driver_x0020_Local/No_x0020_Driver"],
        `Nombre_x0020_Mecanismo_x0020_Loc eq '${NombreMecanismo}'`,
        "ID_x0020_Driver_x0020_Local"
      );
  
      if (items.length > 0) {
        items.forEach((item: any) => {
          const fichaAux: FichaItemTabla = {
            NombreDriver:item.No_x0020_Pilar+"."+item.ID_x0020_Driver_x0020_Local.No_x0020_Driver+"."+item.ID_x0020_Driver_x0020_Local.Nombre_x0020_Driver,
            NombrePilar: item.No_x0020_Pilar+"."+item.Nombre_x0020_Pilar,
            NombreModelo: item.Nombre_x0020_Modelo,
            NombreMecanismo: item.Nombre_x0020_Mecanismo_x0020_Loc
          };
          
          _ficha.push(fichaAux);
        });
      }
    } catch {     
      return [];
    }
      
    return _ficha;
   
  }

   // funcion para consultar ficha
   public async consultarFichaForTableSigla(NombreMecanismo:string, sigla:string): Promise<FichaItemTabla[]> {
    let _ficha: FichaItemTabla[] = [];


    try {
      const items: any[] = await this.getListItems(
        "Mecanismos Local",
        ["ID","ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver","Nombre_x0020_Mecanismo_x0020_Loc", "Mecanismos_x0020_AsociadosId","Nombre_x0020_Pilar","Nombre_x0020_Modelo,No_x0020_Pilar,ID_x0020_Driver_x0020_Local/No_x0020_Driver"],
        `Nombre_x0020_Mecanismo_x0020_Loc eq '${NombreMecanismo}'`,
        "ID_x0020_Driver_x0020_Local",undefined,undefined,sigla
      );
  
      if (items.length > 0) {
        items.forEach((item: any) => {
          const fichaAux: FichaItemTabla = {
            NombreDriver:item.No_x0020_Pilar+"."+item.ID_x0020_Driver_x0020_Local.No_x0020_Driver+"."+item.ID_x0020_Driver_x0020_Local.Nombre_x0020_Driver,
            NombrePilar: item.No_x0020_Pilar+"."+item.Nombre_x0020_Pilar,
            NombreModelo: item.Nombre_x0020_Modelo,
            NombreMecanismo: item.Nombre_x0020_Mecanismo_x0020_Loc
          };
          
          _ficha.push(fichaAux);
        });
      }
    } catch {     
      return [];
    }
      
    return _ficha;
   
  }


  public getFilesLink(Url: any,SiglaPais:any): Promise<any> {


    let urlUno= Url.split(SiglaPais+"/")


    let url = this.getUrlDetails(this.context.pageContext.web.absoluteUrl, this.context.pageContext.site.absoluteUrl);

    if(url.urlLocal.length > 0)
    {
      this.web =  new SPFI(url.urlLocal); 
      
      this.web.web.on.log(function(this: Queryable, message: string, level: number) {
        if (level > 1) {
            console.log(message);
          }
      });
     
      this.web.using(SPFx(this.context));
      
    }
    
    
    return this.web.web.getFolderByServerRelativePath(`${this.siteRelativeUrl}${urlUno[1]}`).files();
  };



}