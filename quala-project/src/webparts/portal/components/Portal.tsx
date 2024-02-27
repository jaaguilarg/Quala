import * as React from "react";
import { connect } from 'react-redux';
import { loadParametros } from "../actions/parametrosActions";
import { setSiteDetails } from "../actions/siteActions";
import { loadPaises } from "../actions/paisActions";
import * as _ from "underscore";
import { IPortalProps } from "./IPortalProps";
import { Switch, Route, HashRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import '../../css/style.local.css'
import ResultadosBuscador from "./Buscador/ResultadosBuscador";
import Home from "../components/Home/Home";
import { PNP } from "../components/Util/util";
import Visor from "./Modelos/Visor";
import Pilares from "../components/Modelos/Pilares";
import CrearContenido from "../components/Formulario/CrearContenido";
import ComentarDocumentos from "./Formulario/ComentarDocumentos";
import Header from "./Views/Header";
import Aprobaciones from "./Formulario/Aprobaciones";
import Componentes from "./Formulario/Componentes";
//import LoaderComponent from "./Views/LoaderComponent";
import { ErrorBoundary } from "./Util/ErrorBoundary";
import ExtenderVigencia from "./Formulario/ExtenderVigencia";
import { loadUser } from "../actions/userDetailActions";
import { loadNivelAprobacion } from "../actions/nivelAprobacionActions";
import ModeloMecanismo from "./Views/ModeloMecanismo";
import CrearContenidoN from "../components/Formulario/CrearContenidoN"
import { loadterms } from "../actions/termsActios";
import {UtilsFunctions} from "./Util/UtilsFunctions";


interface IState {
  Rol: string;
  UserId: string;
  UserName: string;
  Paises: [];
  SubAreas: { ID: any; Area: string; NombreSubArea: string }[];
  Areas: { ID: any; Direccion: string; NombreArea: string }[];
  Direcciones: {ID: any; NombreDireccion: string }[];
  Apros: boolean;
  sigla: string;
  sitioSigla: string;
  sitio: string;
  Gestor: boolean;
  estadoMenuGC: boolean;
  paisActual: string;
  currentUser: {};
  infoMenus: [];
  fullPages: boolean;
  IsSiteAdmin: boolean;
  show: boolean;
  fullLoad: boolean;
  urlNegocio: string;
  paisA: string;
  filialA: string;
  urlDesarrollo: string;
  Version: any;
  macroProcesos: [];
  isLoading: boolean;   
  hasError: boolean;
}

class Portal extends React.Component<IPortalProps, IState> {
  errorBoundaryRef: any = null;
  public pnp: PNP;
  public store:any;
  public utilsFunction: UtilsFunctions;
  
  constructor(props: any) {
    super(props);

    this.state = {
      Rol: "",
      UserId: "",
      UserName: "",
      SubAreas: [],
      Paises: [],
      Areas: [],
      Direcciones: [],
      Apros: false,
      sigla: "",
      sitioSigla: "",
      sitio: "",
      Gestor: false,
      estadoMenuGC: false,
      paisActual: "",
      currentUser: {},
      infoMenus: [],
      fullPages: true,
      IsSiteAdmin: false,
      show: true,
      fullLoad: false,
      urlNegocio: "",
      paisA: "",
      filialA: "",
      urlDesarrollo: "",
      Version: null,
      macroProcesos: [],
      isLoading: true,      
      hasError: false,
    };

    this.pnp = new PNP(props.context);
    this.utilsFunction = new UtilsFunctions();     
  }


  public componentDidMount() {
    try{                
        this.loadContextSite();
        
        this.props.loadParametros(this.props.context);       
      
        var pkg = require("../../../../config/package-solution.json");

        this.setState({
          Version: pkg["solution"]["version"],
        });
    }
    catch(error)
    {
      this.setState({ hasError: true });
    }
    
  }

  //Funcion que consulta la data del sitio y del usuario
  public async loadContextSite() {
    const observer = (parameter: any) => {};

    this.pnp.addObserver(observer);
    await this.props.loadterms(this.props.context);
       

    await this.pnp.getCurrentUser().then((user) => {
      this.setState(
        {
          currentUser: user,
          UserId: user.Id,
          UserName: user.Title,
          IsSiteAdmin: user.IsSiteAdmin,
        },
        () => {

          this.identificarSitio(
            this.props.context.pageContext.web.absoluteUrl,
            this.props.context.pageContext.site.absoluteUrl,
            user.Id
          );          
          
          this.props.loadUser(this.props.context, user.Id).then(() =>{      
            if (this.props.userDetail)
            {                

              this.setState({
                sigla: this.props.sitio.sitio,
                Rol: this.props.userDetail.rol,
                paisActual: this.props.userDetail.pais,
                Apros: this.props.userDetail.apros,
                Gestor: this.props.userDetail.gestor
              })
            }
            }
          );

                              
        }
      );
    });
  }

  //Funcion que valida si se esta en un subsitio o sitio principal recibe como parametro las url del contexto
  public identificarSitio(url: any, urlPrincipal: any, userId: any) {
    let sitioFormateado = url.split("/");
    let sitioPrincipalFormateado = urlPrincipal.split("/");

    var estadoSitio =
      sitioFormateado[sitioFormateado.length - 1].toLocaleLowerCase() == sitioPrincipalFormateado[
        sitioPrincipalFormateado.length - 1].toLocaleLowerCase()
        ? true
        : false;
    
    let sitiopaso = sitioFormateado[sitioFormateado.length - 1].length > 2 ? "NV" :  sitioFormateado[sitioFormateado.length - 1];
     

    this.props.setSiteDetails({
      urlSite: urlPrincipal,
      urlSiteSubsitio: url,
      urlPrimerSitio: url,
      urlSitioPrincipal: urlPrincipal,
      sitio: sitiopaso,
      sitioPrincipal:sitioPrincipalFormateado[sitioPrincipalFormateado.length - 1].toLocaleLowerCase(),
      estadoSitio: estadoSitio,
    }).then((data:any) => {     
      
      if(this.props.sitio.urlSitioPrincipal != '')
      {
        this.PaisList(url, urlPrincipal, userId);        
       
      }
    });
           
  }

  //Funcion que consulta los paises(Filiales) para darle funcionalidad a los distintos formularios
  private PaisList(sitioActual: any, sitioRoot: any, userId: any) {
    
    this.props.loadPaises(this.props.context, this.state.Rol[0]).then(()=>{
      if(this.props.paises.length > 0)
      {
        var site = sitioActual.split("/");
        
        this.setState(
          {
            Paises: this.props.paises ,
            paisActual: site[site.length - 1],          
          },
          () => {
            if (sitioRoot === sitioActual) {
              var p = this.props.paises.filter((x: { Nombre_x0020_Pais: any }) =>x.Nombre_x0020_Pais === "Nova");
  
              if (p.length > 0) {
                this.setState({
                  paisActual: p[0].Valor,
                  paisA: p[0].Nombre_x0020_Pais,                
                },()=>{this.props.loadNivelesAprobacion(this.props.context,p[0].ID)});
              }
            } else {
              var site = sitioActual.split("/");
              var p = this.props.paises.filter((x: { Sigla: any }) =>x.Sigla === site[5]);
              
              this.setState({paisActual: site[site.length - 1],
                            paisA: p[0].Nombre_x0020_Pais,
              },()=>{this.props.loadNivelesAprobacion(this.props.context,p[0].ID)});
            }
            this.GetEstructura();
            this.GetInformacionGC();
          }
        );
  
      }
    })   
  }

  private esEntero(valor: string): boolean {
    var cadena = String(valor);

    // Verifica si la cadena contiene ',' o '.'
    var contieneComa = cadena.indexOf(",") !== -1;
    var contienePunto = cadena.indexOf(".") !== -1;

    // Si contiene alguno de estos, no es entero
    return !contieneComa && !contienePunto;
  }
 
  //Funcion que consulta la estructura  de areas y direcciones y sub areas de cada filial
  private GetEstructura() {
    var ViewXml =      `<FieldRef Name="Nombre_x0020_Direccion"/>
                        <FieldRef Name="Nombre_x0020_Area"/>
                        <FieldRef Name="Nombre_x0020_Sub_x0020_area"/>
                        <FieldRef Name="Nombre_x0020_Modelo_x0020_Local"/>
                        <FieldRef Name="ID_x0020_Modelo_x0020_Base"/>`
                        ;

    var FilterXml =  `<Query>
                        <OrderBy>
                            <FieldRef Name='Orden_x0020_Home' Ascending='TRUE' />
                        </OrderBy>                       
                      </Query> `

    let sitio = "";

    if (this.props.sitio.urlSiteSubsitio == this.props.sitio.urlSite) {
      sitio = this.props.sitio.urlPrimerSitio + "/" + this.state.sigla;
      this.setState({sitioSigla: sitio});
    } else {
      sitio = this.props.sitio.urlSiteSubsitio;
    }
    

    if (this.props.sitio.urlSiteSubsitio.length > 0) {
      let itemsResultado:any;
      if(this.state.Rol[0] =="Lector")
      {
        this.utilsFunction.GetItems({"SiteName": this.state.sigla, "ListName":"Modelos Local"}).then((items) =>{
          itemsResultado = items;
          this.ProcessEstructura(itemsResultado);
        });
      }
      else
      {
        this.pnp.getListItemsWithTaxo("", "Modelos Local", ViewXml,FilterXml , sitio).then((items) => {      
          itemsResultado =  items;
          this.ProcessEstructura(itemsResultado);      
          
        }).catch((error:any) => {this.setState({hasError:true})});                  
      }    
    }
  }

  private ProcessEstructura(itemsResultado:any){
    
    if(itemsResultado.length >0)
    {
      var vDirecciones: { ID: any; NombreDireccion: string ,NombreDireccion2: string }[] = [];
        var vAreas: { ID: any; Direccion: string; NombreArea: string }[] = [];
        var vSubAreas: { ID: any; Area: string; NombreSubArea: string }[] = [];

        var Direccionesuniq = _.uniq(itemsResultado, (i: { Nombre_x0020_Direccion: any }) => i.Nombre_x0020_Direccion.Label);

        Direccionesuniq.forEach((d: any) => {
          if (d.Nombre_x0020_Direccion.Label) {
            vDirecciones.push({ ID: d.ID_x0020_Modelo_x0020_Base, NombreDireccion: d.Nombre_x0020_Modelo_x0020_Local, NombreDireccion2: d.Nombre_x0020_Direccion.Label});
        
            var AreaAux = itemsResultado.filter(
              (x: { Nombre_x0020_Direccion: any }) => x.Nombre_x0020_Direccion.Label === d.Nombre_x0020_Direccion.Label
            );
            
            var Areasuniq = _.uniq(AreaAux, (i: { Nombre_x0020_Area: any }) => i.Nombre_x0020_Area.Label);            
                                 
            Areasuniq.forEach((a: any) => {                                    
              if (a.Nombre_x0020_Area.Label && !this.esEntero(a.Orden_x0020_Home)) {                                
              
                vAreas.push({
                  ID: a.ID_x0020_Modelo_x0020_Base,
                  Direccion: d.Nombre_x0020_Direccion.Label,
                  NombreArea: a.Nombre_x0020_Area.Label,
                });
                         
                // Aqu comenzamos a procesar las subreas
                var SubAreaAux = itemsResultado.filter((x: { Nombre_x0020_Area: any }) => x.Nombre_x0020_Area.Label === a.Nombre_x0020_Area.Label);
               
                var SubAreasuniq = _.uniq(SubAreaAux, (i: { Nombre_x0020_Sub_x0020_area: any }) => i.Nombre_x0020_Sub_x0020_area?.Label);                
                SubAreasuniq.forEach((sa: any) => {
                  if (sa.Nombre_x0020_Sub_x0020_area?.Label) {
                    vSubAreas.push({
                      ID: sa.ID_x0020_Modelo_x0020_Base,
                      Area: a.Nombre_x0020_Area.Label,
                      NombreSubArea: sa.Nombre_x0020_Sub_x0020_area.Label,
                    });
                  }
                });
              }
            });
          }
        });      

        this.setState(
          {
            Direcciones: vDirecciones,
            Areas: vAreas,
            SubAreas: vSubAreas,
            fullLoad: true,
            
          }
        );
    }
  }
  
  private GetInformacionGC()
  { 
    let pSigla = "";

    
  
   this.state.sitio == this.props.sitio.sitioPrincipal.toUpperCase() ? pSigla="" :  pSigla = this.state.sitio;      

    this.pnp.getMenuInfoFC(pSigla,this.state.Rol[0]).then((items) => { 
     

      items.sort((a:any, b:any) => a.Ordenamiento - b.Ordenamiento);
      let filter = [];

      if(this.props.userDetail.rol.find((x:any) => x === "Lector"))
      {
        filter = items.filter((x:any) => x.Vista_x0020_Publico === true);
      }
      else
      {
        filter = items;
      }
           
      
      this.setState({infoMenus: filter},()=>{this.GetMacroProcesos();});
    });   
  }

  private GetMacroProcesos()
  {
    let pSigla = "";

    this.state.sitio == this.props.sitio.sitioPrincipal.toUpperCase() ? pSigla="" :  pSigla = this.state.sitio;    

    this.pnp.getMacroProcesos(pSigla, this.state.Rol[0]).then((items) => {
      this.setState({macroProcesos: items});      
    });

  }

  public render(): React.ReactElement<IPortalProps> {
    const {parametros, sitio} = this.props;    
    
    if (this.state.hasError) {      
      throw new Error('Error cargando Portal');
    }

    return (     
      <section>
      <ErrorBoundary>                
      {this.state.fullLoad ? (   
            
        <HashRouter basename={"/"}>          
          <div id="kt_body" className={this.state.fullPages
                ? "header-fixed header-tablet-and-mobile-fixed toolbar-enabled fullPages"
                : "header-fixed header-tablet-and-mobile-fixed toolbar-enabled"}>
            
            <div className="d-flex flex-column flex-root">
              <div className="page d-flex flex-row flex-column-fluid">
                <div className="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
                  <ErrorBoundary>
                  <Header
                    titulo = {(parametros.filter((elemento: any) => elemento.Llave === "TituloGestiondelConocimiento")[0] ?? {}).Valor}                    
                    urlSiteSubsitio={sitio.urlSiteSubsitio} 
                    sigla={this.state.sigla}
                    sitioPrincpal={sitio.urlSite}
                    sitio={sitio.sitio}
                    paisA={this.state.paisA}
                    Paises={this.state.Paises}
                    context={this.props.context}
                    UserId={this.state.UserId}
                    Direcciones={this.state.Direcciones}
                    SubAreas={this.state.SubAreas}
                    Areas={this.state.Areas}
                    Gestor={this.state.Gestor}
                    infoMenus={this.state.infoMenus}
                    urlDesarrollo={this.state.urlDesarrollo}
                    urlNegocio={this.state.urlNegocio}
                    macroProcesos={this.state.macroProcesos}
                  />
                  </ErrorBoundary>                             
                    <Switch>
                      <Route exact path="/" component={() => (
                        <ErrorBoundary>
                          <Home
                            webPartContext={this.props.context}
                            paisActual={this.state.paisA}
                            urlSite={sitio.urlSiteSubsitio}
                            userId={this.state.UserId}
                            Direcciones={this.state.Direcciones}
                            Areas={this.state.Areas}
                            SubAreas={this.state.SubAreas}
                            gestores={this.state.Gestor}                            
                            linkIntranet={(parametros.filter((elemento: any) => elemento.Llave === "linkIntranet")[0] ?? {}).Valor} 
                          
                          />
                        </ErrorBoundary>
                        )}
                      ></Route>
                      <Route
                        exact
                        path="/Pilares/:numeroPilar?"
                        component={() => (
                          <ErrorBoundary>
                          <Pilares
                            Titulo="Pilares"
                            Webpartcontext={this.props.context}
                            currentUser={this.state.currentUser}
                            userID={this.state.UserId}
                            urlSitioPrincipal={sitio.urlSiteSubsitio}
                            Subsitio={sitio.estadoSitio}
                            NombreSubsitio={sitio.sitio}
                            Modal = {false}
                          ></Pilares></ErrorBoundary>
                        )}
                      ></Route>
                      <Route
                        exact
                        path="/Visor/:IDModelo?/"
                        component={() => (
                          <ErrorBoundary>
                          <Visor
                            Titulo="Visor"
                            context={this.props.context}
                            gestor={this.state.Gestor}
                            NombreSubsitio={sitio.sitio}
                            SitioSigla={this.state.sitioSigla}
                            paisActual={this.state.sigla}
                          ></Visor>
                          </ErrorBoundary>
                        )}
                      ></Route>
                      <Route
                        exact
                        path="/Resultados/:q?"
                        render={(routeProps) => (
                          <ErrorBoundary>
                          <ResultadosBuscador
                            key={routeProps.match.params.q || 'defaultKey'}
                            {...routeProps}                                    
                            webPartContext={this.props.context}
                            paisActual={this.state.paisA}
                            urlSite={sitio.urlSite}
                            urlPrimerSitio = {sitio.urlPrimerSitio}
                            userId={this.state.UserId}
                            Gestor={this.state.Gestor}
                            Apros={this.state.Apros}
                            show={this.state.show}
                            IsSiteAdmin={this.state.IsSiteAdmin}
                            Sigla={this.state.sigla}
                          />
                          </ErrorBoundary>
                        )}
                      ></Route>
                      <Route
                        exact
                        path={"/FormularioCreacion/:Acceso?/:IdMecanismo?/:opcion?/:IdDriver?"}
                        component={() => (
                          <ErrorBoundary>
                          <CrearContenido
                            Titulo="CrearContenido"
                            currentUser={this.state.currentUser}
                            urlSitioPrincipal={sitio.urlSite}
                            webPartContext={this.props.context}
                            Subsitio={sitio.estadoSitio}
                            NombreSubsitio={sitio.sitio}
                            Direcciones={this.state.Direcciones}
                            Areas={this.state.Areas}
                            SubAreas={this.state.SubAreas}
                            opcion = {undefined}
                          /></ErrorBoundary>
                        )}
                      ></Route>

                      <Route
                        exact path="/Crear"
                        component={() => (
                          <ErrorBoundary>
                          <CrearContenidoN
                            Titulo="CrearContenido"
                            currentUser={this.state.currentUser}
                            urlSitioPrincipal={sitio.urlSite}
                            webPartContext={this.props.context}
                            Subsitio={sitio.estadoSitio}
                            NombreSubsitio={sitio.sitio}
                            Direcciones={this.state.Direcciones}
                            Areas={this.state.Areas}
                            SubAreas={this.state.SubAreas}
                            opcion = {undefined}
                          /></ErrorBoundary>
                        )}
                      ></Route>
                       <Route exact path='/GestionSolicitudes'
                          component={() => (
                            <ErrorBoundary>
                            <Aprobaciones
                              Webpartcontext={this.props.context}
                              currentUser={this.state.UserId}
                              Sigla={this.state.sigla}
                              Direcciones = {this.state.Direcciones}
                              Areas = {this.state.Areas}
                              Modal = {false}                                                       
                              /></ErrorBoundary>
                        )}>
                      </Route>

                      <Route exact path='/Componentes'
                          component={() => (
                            <ErrorBoundary>
                            <Componentes
                              Webpartcontext={this.props.context}
                              currentUser={this.state.UserId}
                              Sigla={this.state.sigla}
                              Direcciones = {this.state.Direcciones}
                              Areas = {this.state.Areas}
                              Modal = {false}                                                       
                              /></ErrorBoundary>
                        )}>
                      </Route>

                      <Route
                        exact
                        path="/Mecanismos/:IdMecanismo?"
                        component={() => (
                          <ErrorBoundary>
                            <ModeloMecanismo 
                             context= {this.props.context}
                             userId= ""
                             funTabla= ""
                             estadoTablaModelo= ""
                             SetEstadoTablaModelo= ""
                             ficha= "" 
                            />
                          </ErrorBoundary>
                        )}
                      ></Route>

                      <Route exact path='/ComentarDocumentos/:IdMecanismo?'
                        component={() => (
                          <ErrorBoundary>
                          <ComentarDocumentos 
                              urlSitioPrincipal={sitio.urlSite} 
                              Titulo='ComentarDocumentos' 
                              context={this.props.context} 
                              Subsitio={sitio.estadoSitio} 
                              NombreSubsitio={sitio.sitio}>
                          </ComentarDocumentos>
                          </ErrorBoundary>
                        )}>

                      </Route>

                      <Route exact path='/ExtenderVigencia/:IdMecanismo?'
                        component={() => (
                          
                          <ExtenderVigencia
                            webPartContext={this.props.context}
                            NombreSubsitio={this.props.sitio.sitio}
                            urlSitioPrincipal={this.props.sitio.urlSitioPrincipal}
                            Direcciones={this.state.Direcciones}
                            Areas={this.state.Areas}
                            SubAreas={this.state.SubAreas}
                          />
                        
                          )}>
                      </Route>
                    </Switch>                  

                  <div
                    className="footer py-4 d-flex flex-lg-column"
                    id="kt_footer"
                  >
                    <div className="container-xxl d-flex flex-column flex-md-row align-items-center justify-content-between">
                      <div className="text-dark order-2 order-md-1">
                        <span className="text-muted fw-bold me-1">
                          Versin {this.state.Version}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HashRouter>       
        ) : null}
        </ErrorBoundary>
      </section>
    );
  }

}

const mapStateToProps = (state:any) => {
  return {
    parametros: state.parametros.parametros,
    sitio: state.sitio,
    paises: state.paises.paises,
    userDetail: state.userDetail.userDetail,
    niveles: state.nivelAprobacion.nivelAprobacion,
    terms: state.terms.terms
  };
};

const mapDispatchToProps = (dispatch:any) => {
  return {
      loadParametros: (context:any) => dispatch(loadParametros(context)),
      setSiteDetails: (data:any) => dispatch(setSiteDetails(data)),
      loadPaises: (context:any, rol:string) => dispatch(loadPaises(context,rol)),
      loadUser: (context:any,id:number) => dispatch(loadUser(context,id)),
      loadNivelesAprobacion: (context:any,id:number) => dispatch(loadNivelAprobacion(context,id)),
      loadterms: (context:any) => dispatch(loadterms(context))     
  };
}




export default connect(mapStateToProps, mapDispatchToProps)(Portal);
