import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { PNP } from "../Util/util";
import {spfi} from "@pnp/sp";
import MecanismoItem, {Mecanismo} from "../Views/MecanismoItem";
import ModelMecanismo from "../Views/ModelMecanismo";
import { connect } from 'react-redux';


export interface IPilaresProps {
  Titulo: any;
  match: any;
  Webpartcontext: any;
  UserId: any;
  history: any;
  urlSitioPrincipal: any;
  Subsitio: any;
  NombreSubsitio: any;
  currentUser: any;
  Direccion: any;
  SubArea: any;
  Area: any;
  SitioSigla: any;
  IdVisor: any;
  Modelo: any;
  NumeroPilar: any;
  NombreMecanismo: any;
  Seguridad: any;
  Acceso: any;
  numeroPilar:any;
  paramatros:any;
  sitio:any
}

class Pilares extends React.Component<IPilaresProps, any> {
  public pnp: PNP;
  public mecanismo: Mecanismo;

  constructor(props: any) {
    super(props);
    this.mecanismo = {} as Mecanismo;
    this.pnp = new PNP(this.props.Webpartcontext);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      Gestor: [],
      Usuario: "",
      EstadoMenu: false,
      EstadoMenu2: 0,
      InfoModelo: [],
      NumerosPilares: [],
      estadoPilar: false,
      IdPilar: "",
      infoDrivers: [],
      estadoAcordeon: 0,
      estadoModal: false,
      documentosMecanismo: [],
      mecanismos: [],
      MecanismosdelDriver: [],
      OtrosMecanismosOperacional: [],
      btnCrearMecanismo: false,
      NombreMecanismo: "",
      estadoTablaModelo: false,
      Aprobador: false,
      pilar: "",
      driver: "",
      ficha: [],
      gestores: [],
      Lector: [],
      linkMapaMecanismo: "",
      PilaresTotal: [],
      DriversTotal: [],
      urlSitio: "",
      NombreModelo:"",
      AreaNombre:"",
      DireccionNombre:"",
      SubAreaNombre:"",
      Pilar:"",
      NumeroPilar:"",
      urlImgPilar:""
    };
  }

//Funcion para identificar los numeros de los pilares
  public NumeroPilares(IdModeloLocal:number){
    this.pnp.getListItems("Pilares Local",
                          ["No_x0020_Pilar,ID"],  
                          "Habilitado eq  1 and ID_x0020_Modelo_x0020_Local eq " + IdModeloLocal,
                          "",
                          "").then((items)=>{

                            try{
                              this.setState({
                                NumerosPilares:items

                              })

                            }catch(error){

                            }
                            console.log("numeropilares")
                            console.log(items)
                          })

  }



//Nueva Funcion que pinta la miga de pan y consulta informacion inicial de los pilares
  public consultapilar(ID?:any){
    var numeroPilar:0

    if(ID>0){
      numeroPilar=ID
    }else{
      numeroPilar=this.props.match.params.numeroPilar
 
    }
    this.pnp.getListItems(
      "Pilares Local",
      ["*","ID_x0020_Modelo_x0020_Local/Nombre_x0020_Modelo_x0020_Local"],
      "Habilitado eq  1 and ID eq " + numeroPilar,
      "ID_x0020_Modelo_x0020_Local"
    ).then((items)=>{


      try{

        var ViewXml =      `<FieldRef Name="Nombre_x0020_Direccion"/>
                            <FieldRef Name="Nombre_x0020_Area"/>
                            <FieldRef Name="Nombre_x0020_Sub_x0020_area"/>`;

        var IDDC=items[0].ID_x0020_Modelo_x0020_LocalId
        this.NumeroPilares(IDDC)
        var FilterXml =  `<Query>
                            <Where>

                              <Eq>
                                  <FieldRef Name='ID'></FieldRef>
                                  <Value Type="Number">`+IDDC+`</Value>
                              </Eq>
                            </Where>                       
                          </Query> `
      this.setState({
        NombreModelo: items[0].ID_x0020_Modelo_x0020_Local.Nombre_x0020_Modelo_x0020_Local,
        Pilar:items[0].Pilar,
        NumeroPilar:items[0].No_x0020_Pilar,
        urlImgPilar:this.props.sitio.urlSitioPrincipal+"/SiteAssets/Root/Pilar"+items[0].No_x0020_Pilar+".png"

      },()=>{
       this.pnp.getListItemsWithTaxo('',"Modelos Local",ViewXml,FilterXml,"").then((items)=>{
        this.setState({
          AreaNombre:items[0].Nombre_x0020_Area.Label,
          DireccionNombre:items[0].Nombre_x0020_Direccion.Label,
          SubAreaNombre:items[0].Nombre_x0020_Sub_x0020_area.Label

        },()=>{
          this.consultarDriver()
        })
       })
      })

      }catch(error){

      }

    })

  }


  public componentDidMount() {
    this.consultapilar()
  

    if(this.props.NombreMecanismo !== undefined && this.props.Seguridad !== undefined)
    {
      this.ObtenerArchivos(this.props.match.params.NombreMecanismo,this.props.match.params.Seguridad),
      this.consultarFicha();
      this.setState({estadoModal: true,});
    }

    if (this.props.match.params.NombreMecanismo !== undefined && this.props.match.params.Seguridad !== undefined) 
    {
      this.ObtenerArchivos(this.props.match.params.NombreMecanismo,this.props.match.params.Seguridad),
      this.consultarFicha();
      this.setState({estadoModal: true,});
    } else {
      this.loadContextSite();
      this.consultarPilares(this.props.match.params.NumeroPilar);
      this.consultarModelo();
      this.ConsultaTotalDrivers();
      this.ConsultaTotalPilares();
    }




  }

  // funcion para consulta de modelos
  private consultarModelo() {   
    this.pnp.consultarModelo(this.props.SitioSigla,this.props.match.params.direccion,this.props.match.params.SubArea,this.props.match.params.IdVisor).then((items: any[]) =>{
                     
      let url: string = "";
      var item = items[0];
      
      url = item.Vinculo_x0020_Portada_x0020_Mode.split("action")[0] + "action=embedview&amp;wdAr=1.7777777777777777";
                     
        this.setState({
          linkMapaMecanismo: item.Vinculo_x0020_Mapa_x0020_Mecanis,
          VisorOk: this.props.match.params.IdVisor + "/" + this.props.match.params.SubArea,
          UrlPresentacion: '<iframe src="' + url + '" width="100%" height="600px" ></iframe>'
        }, () => {  });                           
    });   
  }

  // funcion para consultar ficha
  private consultarFicha() {
    this.pnp
      .getListItems(
        "Mecanismos Local",
        ["Nombre_x0020_Mecanismo_x0020_Loc", "Mecanismos_x0020_AsociadosId"],
        "Nombre_x0020_Mecanismo_x0020_Loc eq '" + this.state.NombreMecanismo + "'",
        ""
      )
      .then((items: any) => {
        if (items.length > 0) {
          items[0].Mecanismos_x0020_AsociadosId.forEach((val: any) => {this.consultarFicha2(val);});
        }
      });
  }

  // funcion para consulta de ficha completa por pilares
  private consultarFicha2(IdMecanismo: any) {
    var thisCurrent = this;

    this.pnp
      .getListItems("Mecanismos Local",
        ["ID", "Pilar", "Nombre_x0020_Mecanismo_x0020_Loc", "ID_x0020_Driver_Local"],
        "ID eq '" + IdMecanismo + "'",
        "")
      .then((items: any) => {
        if (items.length > 0) {

          var ficha = thisCurrent.state.ficha;

          if (items.length > 0) {
            var fichaAux = {NombreDriver: "",NombrePilar: "",NombreModelo: "",NombreMecanismo: items[0].NombreMecanismo,};

            var driver = thisCurrent.state.DriversTotal.filter(
              (x: { ID: any }) => x.ID == items[0].NombreDriverId
            );

            if (driver.length > 0) {
              if (driver[0].NombreDriver != "No aplica") {
                fichaAux["NombreDriver"] = driver[0].NombreDriver;

                var pilard = thisCurrent.state.PilaresTotal.filter((x: { ID: any }) => x.ID == driver[0].PilarId);
                if (pilard.length > 0) {
                  fichaAux["NombrePilar"] = pilard[0].Pilar;
                  fichaAux["NombreModelo"] = pilard[0].NombreModelo.NombreModelo;
                  ficha.push(fichaAux);
                }
              }
            }
          }

          thisCurrent.setState({ficha: ficha,});
        }
      });
  }

  // funcion para consulta de pilares
  private ConsultaTotalPilares() {
    this.pnp
      .getListItems(
        "Pilares Local",
        ["ID", "Pilar", "ID_x0020_Modelo_x0020_Local/Nombre_x0020_Modelo_x0020_Local"],
        "",
        "ID_x0020_Modelo_x0020_Local","",0,this.props.SitioSigla
      )
      .then((items: any) => {
        this.setState({
          PilaresTotal: items,
        });
      });
  }

  // funcion para consultar drivers
  private ConsultaTotalDrivers() {
    this.pnp
      .getListItems("Drivers Local", ["ID", "Nombre_x0020_Driver", "ID_x0020_Pilar_x0020_LocalId"], "","","",0,this.props.SitioSigla)
      .then((items: any) => {
        this.setState({
          DriversTotal: items,
        });
      });
  }
  // funcion del estado de la tabla modelo
  public TablaModelo() {
    this.consultarFicha();
    this.setState({estadoTablaModelo: true,});
  }
  // Funcion para consultar los archivos del mecanismo
  public ObtenerArchivos(NombreMecanismo: any, Seguridad: any) {
    this.setState({
      NombreMecanismo: NombreMecanismo,
    });

    if (
      this.props.match.params.direccion !== undefined &&
      this.props.match.params.IdVisor == undefined
    ) {
      var direccion = this.props.match.params.direccion;
      this.pnp
        .getFiles("Publicado/" + Seguridad + "/" + direccion + "/" + NombreMecanismo)
        .then(
          (res) => (            
            this.setState(
              {
                documentosMecanismo: res,
              },
              () => {
                if (this.state.documentosMecanismo.length > 0) {
                  this.openModal();
                  this.setState({btnCrearMecanismo: false,
                  });
                } else {
                  this.setState({
                    btnCrearMecanismo: true,
                  });
                }
              }
            )
          )
        );
    } else {

      // var UbicacionArchivos = this.props.match.params.IdVisor.replace(' ', '_')
      this.pnp
        .getFiles("Publicado/" + Seguridad + "/" +  this.props.match.params.IdVisor + "/" + NombreMecanismo)
        .then((res) => (            
            this.setState({documentosMecanismo: res},
              () => {
                if (this.state.documentosMecanismo.length > 0) {
                  this.openModal();
                  this.setState({btnCrearMecanismo: false});
                } else {
                  this.setState({btnCrearMecanismo: true});
                }
              }
            )
            )
        );
    }
  }

  // Funcion para llamar documentos de los mecanismos al modal
  private ConsultarMecanismos(Driver: any) {
    this.pnp
      .consultarMecanismosByDriver(Driver)
      .then((res) => {
        
        var MecanismosdelDriver = res.filter(
          (x: { Mecanismo_x0020_del_x0020_Driver: any }) =>
            x.Mecanismo_x0020_del_x0020_Driver.Label == "Mecanismos del driver"
        );
        var OtrosMecanismosOperacional = res.filter(
          (x: { Mecanismo_x0020_del_x0020_Driver: any }) =>
            x.Mecanismo_x0020_del_x0020_Driver.Label == "Otro Mecanismo Operacional"
        );
        this.setState(
          {
            mecanismos: res,
            MecanismosdelDriver: MecanismosdelDriver,
            OtrosMecanismosOperacional: OtrosMecanismosOperacional,
          }
        );
      });
  }

  public SetEstadoTablaModelo()
  {
    this.setState({ estadoTablaModelo: false });
  }

  // Funcion Abrir Modal
  closeModal = () => {
    this.setState({ estadoModal: false, ficha: [] });
  }

  // Funcion Cerrar Modal
  private openModal() {
    this.setState({ estadoModal: true, EstadoMenu2: 0 });
  }

  // funcion validacion de roles
  private getGroups(Id: any) {
    if (this.props.NombreSubsitio) {
      const prueba = this.props.NombreSubsitio;
      const prueba2 = prueba[0].toUpperCase() + prueba.substring(1);
      this.setState(
        {
          NombreConvertido: prueba2,
        },
        () => {
          var nombreGrupo = "Gestores_" + prueba2;

          this.pnp.getUserInGroup(nombreGrupo, Id).then((resUser: any) => {           
          });

          this.pnp.getGroupsByUserId(Id).then((resGroups: any) => {           
            var gesto = resGroups.filter(
              (x: { LoginName: any }) => x.LoginName == "Gestores_" + prueba2
            );
    
            this.setState({
              gestores: gesto,
            });
          });

          var nombreGrupo = "Lector_todo_Corporativo";

          this.pnp.getUserInGroup(nombreGrupo, Id).then((resUser: any) => {           
          });

          this.pnp.getGroupsByUserId(Id).then((resGroups: any) => {            
            var Lecto = resGroups.filter(
              (x: { LoginName: any }) =>
                x.LoginName == "Lector_todo_Corporativo"
            );          

            this.setState({
              Lector: Lecto,
            });
          });
        }
      );
    } else {
      //console.log("No se encuentra Nombre");
    }
  }

  // funcion para iniciar variables globales para las funcionalidades
  public async loadContextSite() {
    try {
      const sp = spfi();
      
      const oContext = await sp.web.getContextInfo();

      this.setState({
        urlSitio: oContext.SiteFullUrl?.split("/").slice(0, 2).join("/"),
      });
      
    } catch (error) {
      
    }
  
    

    this.pnp.getCurrentUser().then((user: any) => {
      this.setState(
        {
          Usuario: user.Id,
          UserName: user.Title,
        },
        () => {
          this.getGroups(user.Id);
        }
      );
    });
  }

  // Funcion para actualizar acorden
  private actualizarAcordeon(id: any) {
    this.setState({
      estadoAcordeon: id,
    });
  }

  // funcion para guardar pilares
  private changePilar(NumeroPilar: any) {
    this.props.history.push(
      "/Pilares/" + NumeroPilar
    );
    this.consultapilar(NumeroPilar);
    console.log("cambio de pilar")
  }

  // funcion para consultar Drivers
  private consultarDriver() {
    this.pnp
      .getListItems(
        "Drivers Local",
        ["*"],
        "ID_x0020_Pilar_x0020_Local eq " + this.props.match.params.numeroPilar,
        "",
        ""
      )
      .then(
        (res: any) => (     
          this.setState({
            infoDrivers: res,
          })
        )
      );
  }

  // funcion para consultar pilares
  private consultarPilares(NumeroPilar: any) {
    
    this.pnp.getListItems(
        "Pilares Local",
        ["*", "ID_x0020_Modelo_x0020_Local/Nombre_x0020_Modelo_x0020_Local"],
        "No_x0020_Pilar ne 0 and ID_x0020_Modelo_x0020_Local/Nombre_x0020_Modelo_x0020_Local eq '" +
          this.props.match.params.Modelo +
          "'",
        "ID_x0020_Modelo_x0020_Local","",0,this.props.SitioSigla
      ).then((items: any) => {
        var pilar = items.filter(
          (x: { No_x0020_Pilar: any }) => x.No_x0020_Pilar == NumeroPilar
        );

        this.setState(
          {
            NumerosPilares: items,
            estadoPilar: true,
            InfoModelo: pilar,
          },
          () => {
            if (pilar.length > 0) {
              this.consultarDriver();
            }
          }
        );
      });
  }

  public handleEstadoMenuChange(id: string, value: boolean)
  {
    this.setState({[id]: value});
  }



  public render(): React.ReactElement<IPilaresProps> {
    return (
      <div>
        {/* Modal */}        
        {this.state.estadoModal == true ? (          
          <ModelMecanismo 
            Context={this.props.Webpartcontext}
            UserId={this.props.UserId}
            UrlSitio={this.state.urlSitio}
            Titulo="Ficha mecanismo"
            Acceso={this.props.match.params.Acceso}
            DocumentosMecanismo={this.state.documentosMecanismo}
            NombreMecanismo={this.state.NombreMecanismo}
            Direccion = {this.props.match.params.direccion}
            IdVisor = {this.props.match.params.IdVisor}
            EstadoTablaModelo = {this.state.estadoTablaModelo}
            SetEstadoTablaModelo = {this.state.estadoTablaModelo}
            Ficha = {this.state.ficha}
            closeModal = {this.closeModal}
            tablaModelo = {this.TablaModelo}
          />) : (<>
          <div className="toolbar py-5 py-lg-7 padding-top" id="kt_toolbar">
          <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
            <div className="page-title d-flex flex-column me-3">
              <h1 id="contentn" className="d-flex text-dark fw-bolder my-1 fs-2">
                {this.props.match.params.Modelo}
              </h1>
              <ul id="contentb" className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">

                <li className="breadcrumb-item text-gray-600">
                  <Link to={""}>
                    <a className="text-gray-600 text-hover-primary">
                      {this.state.DireccionNombre}
                    </a>
                  </Link>
                </li>

                <li className="breadcrumb-item text-gray-600">
                  <Link to={""}>
                    <a className="text-gray-600 text-hover-primary">
                      {this.state.AreaNombre}
                    </a>
                  </Link>
                </li>

                <li className="breadcrumb-item text-gray-600">
                  <Link to={""}>
                    <a className="text-gray-600 text-hover-primary">
                      {this.state.SubAreaNombre}
                    </a>
                  </Link>
                </li>


               
              </ul>
            </div>

            <div className="d-flex align-items-center py-1-1">
              <div className="d-flex my-4 me-3">
                <Link to={"/Visor/" + this.props.match.params.direccion + "/" + this.props.match.params.IdVisor}>
                  <a className="md-rg btn-regresa1">
                    <svg xmlns="http://www.w3.org/2000/svg"
                      width="16" height="16" fill="currentColor"
                      className="bi bi-chevron-left" viewBox="0 0 16 16">
                      <path fill-rule="evenodd"
                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                      />
                    </svg>
                    Regresar
                  </a>
                </Link>
              </div>

              {/*boton Mapa de Mecanismocs */}
              <div className="d-flex my-4 me-3">
                <a href={this.state.linkMapaMecanismo} className="btn btn-outline btn-outline-primary btn-active-primary">
                  Mapa de Mecanismos
                </a>
              </div>

              <h1>{this.props.UserId}</h1>
            
            </div>
          </div>
          </div>
       
          <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start padding-cero">
          <div className="content flex-row-fluid" id="kt_content">
            <div className="d-flex flex-column flex-root">
              <div className="page d-flex flex-row flex-column-fluid">
                <div className="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
                  <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
                    <div className="content flex-row-fluid" id="kt_content">
                      <div className="d-flex flex-column flex-lg-row">
                        <div className="flex-lg-row-fluid">
                          <div className="">
                            <h1>Modelo de {this.state.NombreModelo}</h1>  
                            <div className="card-body-pilar">
                              <div className="row">
                                <div className="col-md-1-1">
                                  <h3 id="TituloPilar" className="text-gray-600 fs-6 text-uppercase mb-5">
                                    Pilares
                                  </h3>
                                </div>
                                <div className="col">
                                  <ul className="nav nav-pills mb-10 fs-6">
                                    {this.state.NumerosPilares.map((e: any) => (
                                      <li className="nav-item">
                                        {this.state.NumeroPilar == e.No_x0020_Pilar ? (
                                          <a className="nav-link nav-pilares "  id="PilarSeleccionado" data-bs-toggle="tab"
                                            onClick={() => {
                                              this.actualizarAcordeon(0);
                                              this.changePilar(e.ID);
                                            }}>
                                            {e.No_x0020_Pilar}
                                          </a>
                                        ) : (
                                          <a className="nav-link nav-pilares " data-bs-toggle="tab"
                                            onClick={() => {
                                              this.actualizarAcordeon(0);
                                              this.changePilar(e.ID);
                                            }}>
                                            {e.No_x0020_Pilar}
                                          </a>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <hr />
                              </div>

                              <div className="tab-content" id="myTabContent">
                                {/* Pilar 1 */}
                              <div className="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel">
                                  <div className="mt-5 mb-5 pb-0">
                                    <div className="d-flex align-items-center mb-10">
                                      <span className="svg-icon svg-icon-primary">


                                        <img src={this.state.urlImgPilar} width="172" height="172"/>

                                      </span>
                                        <h2 className="text-uppercase px-5 mb-5">
                                          {this.state.Pilar}
                                        </h2>
                                 
                                    </div>
                                    <h3 className="text-gray-600 fs-6 text-uppercase mb-5">Drivers Operacionales</h3>
                                    
                                    {this.state.infoDrivers.map(
                                      (e: any, i: any) => (
                                        <div className="accordion accordion-flush">
                                          <div className="accordion-header" id="kt_accordion_1_header_1">
                                            {e.Id ===this.state.estadoAcordeon ? (
                                              <button className="accordion-button fs-4 fw-bold"
                                                type="button" onClick={() => {
                                                  this.actualizarAcordeon(0),
                                                  this.ConsultarMecanismos(e.ID);
                                                }}>
                                                {this.state.NumeroPilar + "." + (i + 1) + ". " + e.Nombre_x0020_Driver}
                                                :
                                              </button>
                                              ) : (
                                              <button className="accordion-button collapsed"
                                                id="textoColapso" type="button"
                                                onClick={() => {
                                                  this.actualizarAcordeon(e.Id),
                                                    this.ConsultarMecanismos(e.ID);
                                                }}>

                                                {this.state.NumeroPilar + "." + (i + 1) + ". " + e.Nombre_x0020_Driver}
                                                :
                                              </button>
                                            )}
                                          </div>

                                          {this.state.estadoAcordeon == e.Id ? (
                                            <div className="accordion-body">
                                              <div className="pb-0">
                                                <div className="d-flex align-items-center mb-5-1 padding-top" id="padding-pilares1">
                                                  <div className="text-gray-600">
                                                    {e.ObjetivoDriver}
                                                  </div>
                                                </div>
                                                <div className="lineDescription"></div>
                                                <div className="row">
                                                  <div className="col-12">
                                                    <div className="row">
                                                      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                                        <h4 className="card-title align-items-start flex-column">
                                                          <span className="text-primary mb-5 fs-5" id="padding-pilares">
                                                            Mecanismos del driver
                                                          </span>
                                                        </h4>
                                                        <div className="row d-flex">
                                                          {this.state.MecanismosdelDriver.map(
                                                            (f: any, contador: any) => {
                                                               this.mecanismo.Nombre_x0020_Mecanismo_x0020_Loc = f.Nombre_x0020_Mecanismo_x0020_Loc; 
                                                               this.mecanismo.ID = f.ID; 
                                                               let strValue = f.Porcentaje_x0020_Implementacion.replace(/\D/g,'');                                                               
                                                               this.mecanismo.Implementado = parseInt(strValue, 10); // fix por test
                                                               this.mecanismo.Seguridad = f.Seguridad
                                                               
                                                              
                                                               let numeroFilas = this.state.MecanismosdelDriver.length > 1 && this.state.MecanismosdelDriver.length / 2;
                                                               let maxNumeroFilas = Math.round(Number(numeroFilas));
                                                              

                                                              if (maxNumeroFilas > 1 && contador + 1 <=maxNumeroFilas)
                                                               {
                                                                return(                                                                                                                  
                                                                  <MecanismoItem 
                                                                    mecanismo={this.mecanismo}
                                                                    gestoresLength={this.state.gestores.length}
                                                                    lectorLength={this.state.Lector.length}
                                                                    obtenerArchivos={this.ObtenerArchivos}
                                                                    consultarFicha={this.consultarFicha}                                                                   
                                                                  /> )

                                                              } else if (maxNumeroFilas > 1 && contador + 1 > maxNumeroFilas &&
                                                                contador + 1 <= this.state.MecanismosdelDriver.length
                                                              ) {
                                                                return(
                                                                <MecanismoItem 
                                                                  mecanismo={this.mecanismo}
                                                                  gestoresLength={this.state.gestores.length}
                                                                  lectorLength={this.state.Lector.length}
                                                                  obtenerArchivos={this.ObtenerArchivos}
                                                                  consultarFicha={this.consultarFicha}
                                                                  handleEstadoMenuChange={this.handleEstadoMenuChange}                                                                  
                                                                />)                                                                                                                         
                                                            }else{
                                                              return(
                                                                <MecanismoItem 
                                                                mecanismo={this.mecanismo}
                                                                gestoresLength={this.state.gestores.length}
                                                                lectorLength={this.state.Lector.length}
                                                                obtenerArchivos={this.ObtenerArchivos}
                                                                consultarFicha={this.consultarFicha}                                                                   
                                                              /> 
                                                              )
                                                            }
                                                            
                                                          })}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="col-12">
                                                    <div className="row">
                                                      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                                        <h4 className="card-title align-items-start flex-column">
                                                          <span className="text-primary mb-5 fs-5" id="padding-pilares">
                                                            Otros mecanismos operacionales
                                                          </span>
                                                          <span className="a-buttomder">
                                                            {this.state.gestores .length > 0 &&
                                                            this.state.Lector.length <= 0 ? (
                                                              <Link to={"/CrearContenido/1/1"}>
                                                                <button className="btn-crear1" type="button" name="Crear">
                                                                  Crear
                                                                </button>
                                                              </Link>
                                                            ) : null}
                                                          </span>
                                                        </h4>
                                                        <div className="row d-flex">
                                                          {
                                                          this.state.OtrosMecanismosOperacional.map(                                                            
                                                            (f: any,contador: any) => {
                                                              this.mecanismo.Nombre_x0020_Mecanismo_x0020_Loc = f.Nombre_x0020_Mecanismo_x0020_Loc; 
                                                              this.mecanismo.ID = f.ID; 
                                                              this.mecanismo.Implementado = f.Implementado;
                                                              this.mecanismo.Seguridad = f.Seguridad;

                                                              let numeroFilas = this.state.OtrosMecanismosOperacional.length > 1 &&
                                                              this.state.OtrosMecanismosOperacional.length / 2;
                                                              
                                                              let maxNumeroFilas = Math.round(Number(numeroFilas));

                                                              (maxNumeroFilas > 1 && contador + 1 <= maxNumeroFilas) ?
                                                                <MecanismoItem 
                                                                  mecanismo={this.mecanismo}
                                                                  gestoresLength={this.state.gestores.length}
                                                                  lectorLength={this.state.Lector.length}
                                                                  obtenerArchivos={this.ObtenerArchivos}
                                                                  consultarFicha={this.consultarFicha}
                                                                  handleEstadoMenuChange={this.handleEstadoMenuChange}/>                                                                          
                                                                :                                                                                                                                  
                                                                <MecanismoItem 
                                                                  mecanismo={this.mecanismo}
                                                                  gestoresLength={this.state.gestores.length}
                                                                  lectorLength={this.state.Lector.length}
                                                                  obtenerArchivos={this.ObtenerArchivos}
                                                                  consultarFicha={this.consultarFicha}/> 

                                                               (maxNumeroFilas > 1 && contador + 1 > maxNumeroFilas &&
                                                                contador + 1 <= this.state.OtrosMecanismosOperacional.length) ?
                                                                <MecanismoItem 
                                                                  mecanismo={this.mecanismo}
                                                                  gestoresLength={this.state.gestores.length}
                                                                  lectorLength={this.state.Lector.length}
                                                                  obtenerArchivos={this.ObtenerArchivos}
                                                                  consultarFicha={this.consultarFicha}
                                                                  handleEstadoMenuChange={this.handleEstadoMenuChange}/> 
                                                                  :                                                                  
                                                                <MecanismoItem 
                                                                  mecanismo={this.mecanismo}
                                                                  gestoresLength={this.state.gestores.length}
                                                                  lectorLength={this.state.Lector.length}
                                                                  obtenerArchivos={this.ObtenerArchivos}
                                                                  consultarFicha={this.consultarFicha}/> 
                                                                
                                                              }
                                                           )}
                                                        </div>
                                                  </div>
                                                </div>
                                                  </div>
                                            </div>
                                          </div>
                                        </div>
                                        ): null}  
                                  </div> )) }
                </div>
                              </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div></>)
        }
    </div>
    )
  }


}

const mapStateToProps = (state:any) => {
  return {
    parametros: state.parametros.parametros,
    sitio:state.sitio
  };
};

export default connect(mapStateToProps) (withRouter(Pilares));
