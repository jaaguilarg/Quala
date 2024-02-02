import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { PNP } from "../Util/util";
import { spfi } from "@pnp/sp";
//import MecanismoItem, {Mecanismo} from "../Views/MecanismoItem";
//import ModelMecanismo from "../Views/ModelMecanismo";
import { connect } from 'react-redux';
//import { ErrorBoundary } from "../Util/ErrorBoundary";
import FichaModal from '../Views/fichaModal'
//import GestoresMenu from "../Views/GestoresMenu";
import SVGIconComponent from "../Util/SVGIcon";

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
  numeroPilar: any;
  parametros: any;
  sitio: any;
  userDetail:any;
  paises:any
}

class Pilares extends React.Component<IPilaresProps, any> {
  public pnp: PNP;
  //public mecanismo: Mecanismo;

  constructor(props: any) {
    super(props);
    //this.mecanismo = {} as Mecanismo;
    this.pnp = new PNP(this.props.Webpartcontext);
    this.closeModal = this.closeModal.bind(this);
    this.TablaModelo = this.TablaModelo.bind(this);
    this.SetEstadoTablaModelo = this.SetEstadoTablaModelo.bind(this);
    this.getMecanismo = this.getMecanismo.bind(this);
    this.openModal = this.openModal.bind(this)

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
      estadoModal: true,
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
      gestores: 0,
      Lector: [],
      linkMapaMecanismo: "",
      PilaresTotal: [],
      DriversTotal: [],
      urlSitio: "",
      NombreModelo: "",
      AreaNombre: "",
      DireccionNombre: "",
      SubAreaNombre: "",
      Pilar: "",
      NumeroPilar: "",
      urlImgPilar: "",
      hasError: false,
      parametros:this.props.parametros,
      descripcionSitio:this.props.sitio,
      usuario:this.props.userDetail,
      paises:this.props.paises,
      BtnMapaMecanismo:"",
      NombrePais:"",
      pilarExiste:true
    

    };
  }

  //Funcion para identificar los numeros de los pilares
  public NumeroPilares(IdModeloLocal: number) {
    this.pnp.getListItems("Pilares Local",
      ["No_x0020_Pilar,ID"],
      "Habilitado eq  1 and ID_x0020_Modelo_x0020_Local eq " + IdModeloLocal,
      "",
      "").then((items) => {

        try {
          this.setState({
            NumerosPilares: items

          })

        } catch (error) {

        }
      })

  }


  //Nueva Funcion que pinta la miga de pan y consulta informacion inicial de los pilares
  public consultapilar(ID?: any) {
    var numeroPilar: 0

    numeroPilar = ID || this.props.match.params.numeroPilar || this.props.numeroPilar || 1


    this.pnp.getListItems(
      "Pilares Local",
      ["*", "ID_x0020_Modelo_x0020_Local/Nombre_x0020_Modelo_x0020_Local"],
      "Habilitado eq 1 and ID eq " + numeroPilar,
      "ID_x0020_Modelo_x0020_Local"
    ).then((items) => {


      if(items.length<=0){
        this.setState({
          pilarExiste :false
        })
      }
      var ViewXml = `<FieldRef Name="Nombre_x0020_Direccion"/>
                        <FieldRef Name="Nombre_x0020_Area"/>
                        <FieldRef Name="Nombre_x0020_Sub_x0020_area"/>
                        <FieldRef Name="Vinculo_x0020_Mapa_x0020_Mecanis"/>
                        <FieldRef Name="Vinculo_x0020_Portada_x0020_Mode"/>
                        `;

      var IDDC = items[0].ID_x0020_Modelo_x0020_LocalId
      this.NumeroPilares(IDDC)
      var FilterXml = `<Query>
                            <Where>
                              <Eq>
                                  <FieldRef Name='ID'></FieldRef>
                                  <Value Type="Number">`+ IDDC + `</Value>
                              </Eq>
                            </Where>                       
                          </Query> `
      this.setState({
        NombreModelo: items[0].ID_x0020_Modelo_x0020_Local.Nombre_x0020_Modelo_x0020_Local,
        Pilar: items[0].Pilar,
        NumeroPilar: items[0].No_x0020_Pilar,
        urlImgPilar: this.props.sitio.urlSitioPrincipal + "/ActivosGC/Root/Pilar" + items[0].No_x0020_Pilar + ".png"

      }, () => {
        this.pnp.getListItemsWithTaxo('', "Modelos Local", ViewXml, FilterXml, "").then((items) => {
          this.setState({
            AreaNombre: items[0].Nombre_x0020_Area.Label,
            DireccionNombre: items[0].Nombre_x0020_Direccion.Label,
            SubAreaNombre: items[0].Nombre_x0020_Sub_x0020_area.Label,
            linkMapaMecanismo:items[0].Vinculo_x0020_Mapa_x0020_Mecanis,
            modeloActual:items[0].ID

          }, () => {
            this.consultarDriver()
          })
        }).catch(() => { this.setState({ hasError: true }) });
      })

    }).catch(() => { this.setState({ hasError: true }) });

  }



  public consultaRoles(){
    
    var paises = this.state.paises.filter(
      (x: { Sigla: any }) => x.Sigla == this.state.descripcionSitio.sitio 
    );


    this.setState({
      NombrePais:paises[0].Nombre_x0020_Pais
    })


    var btnMecanismo=this.state.parametros.filter((x:{Llave:any})=>x.Llave == "BotonMapadeMecanismos")
    var tituloPilar=this.state.parametros.filter((x:{Llave:any})=>x.Llave == "LabelPilares")
    var DriverOPeraciones=this.state.parametros.filter((x:{Llave:any})=>x.Llave == "LabelDriversOperacionales")
    var Mecanismo=this.state.parametros.filter((x:{Llave:any})=>x.Llave == "LabelMECANISMO")
    var OtrosMecanismo=this.state.parametros.filter((x:{Llave:any})=>x.Llave == "TerminoOtrosmecanismosOperacionales")

      this.state.usuario.paises.forEach((element:any)=>{

        if(element == paises[0].ID && this.state.usuario.gestor){
          this.setState({

            gestores: 1,
            BtnMapaMecanismo:btnMecanismo[0].Valor,
            tituloPilares:tituloPilar[0].Valor,
            TituloDriverO:DriverOPeraciones[0].Valor,
            TituloMecanismo:Mecanismo[0].Valor,
            TituloOtrosm:OtrosMecanismo[0].Valor


          },()=>{
            this.consultapilar()

          })
          
        }else{
          this.setState({
            BtnMapaMecanismo:btnMecanismo

          },()=>{
            this.consultapilar()

          })
          
        }

      })

  }


  public componentDidMount() {


    this.consultaRoles()

    if (this.props.NombreMecanismo !== undefined && this.props.Seguridad !== undefined) {
      this.consultarFicha();
      this.setState({ estadoModal: true, });
    }

    if (this.props.match.params.NombreMecanismo !== undefined && this.props.match.params.Seguridad !== undefined) {
      this.consultarFicha();
      this.setState({ estadoModal: true, });
    } else {
      this.setState({ estadoModal: false, });
      this.loadContextSite();
      //this.consultarPilares(this.props.match.params.NumeroPilar);
      this.consultarModelo();
      this.ConsultaTotalDrivers();
      this.ConsultaTotalPilares();
      this.consultarFicha();
    }
  }

  // funcion para consulta de modelos
  private consultarModelo() {

    const _direccion = this.props.match.params.direccion || this.props.Direccion;
    const _idVisor = this.props.match.params.IdVisor || this.props.IdVisor;

    this.pnp.consultarModelo(this.props.SitioSigla, _direccion, this.props.match.params.SubArea, _idVisor).then((items: any[]) => {

      let url: string = "";
      var item = items[0];

      url = item.Vinculo_x0020_Portada_x0020_Mode.split("action")[0] + "action=embedview&amp;wdAr=1.7777777777777777";

      this.setState({
        linkMapaMecanismo: item.Vinculo_x0020_Mapa_x0020_Mecanis,
        VisorOk: this.props.match.params.IdVisor + "/" + this.props.match.params.SubArea,
        UrlPresentacion: '<iframe src="' + url + '" width="100%" height="600px" ></iframe>'
      }, () => { });
    }).catch(() => { this.setState({ hasError: true }) });
  }

  // funcion para consultar ficha
  private consultarFicha() {

    this.pnp.getListItems(
      "Mecanismos Local",
      ["ID", "ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver", "Nombre_x0020_Mecanismo_x0020_Loc", "Mecanismos_x0020_AsociadosId", "Nombre_x0020_Pilar", "Nombre_x0020_Modelo"],
      'ID eq ' + this.state.Idmecanismo,
      "ID_x0020_Driver_x0020_Local"
    )
      .then((items: any) => {
        if (items.length > 0) {
          var ficha = this.state.ficha;

          items.forEach((item: any) => {

            var fichaAux = {
              NombreDriver: item.ID_x0020_Driver_x0020_Local.Nombre_x0020_Driver,
              NombrePilar: item.Nombre_x0020_Pilar,
              NombreModelo: item.Nombre_x0020_Modelo,
              NombreMecanismo: item.Nombre_x0020_Mecanismo_x0020_Loc
            };

            ficha.push(fichaAux);
          });

          console.log(ficha);

          this.setState({ ficha: ficha })

        }
      }).catch(() => { this.setState({ hasError: true }) });
  }

  // funcion para consulta de pilares
  private ConsultaTotalPilares() {
    this.pnp
      .getListItems(
        "Pilares Local",
        ["ID", "Pilar", "ID_x0020_Modelo_x0020_Local/Nombre_x0020_Modelo_x0020_Local"],
        "",
        "ID_x0020_Modelo_x0020_Local", "", 0, this.props.SitioSigla
      )
      .then((items: any) => {
        this.setState({
          PilaresTotal: items,
        });
      }).catch(() => { this.setState({ hasError: true }) });
  }

  // funcion para consultar drivers
  private ConsultaTotalDrivers() {
    this.pnp
      .getListItems("Drivers Local", ["ID", "Nombre_x0020_Driver", "ID_x0020_Pilar_x0020_LocalId"], "", "", "", 0, this.props.SitioSigla)
      .then((items: any) => {
        this.setState({
          DriversTotal: items,
        });
      }).catch(() => { this.setState({ hasError: true }) });
  }
  // funcion del estado de la tabla modelo
  public TablaModelo() {
    this.setState({ estadoTablaModelo: true, });
  }

  public SetEstadoTablaModelo() {
    this.setState({ estadoTablaModelo: !this.state.estadoTablaModelo });
  }

  // Funcion para consultar los archivos del mecanismo
  public ObtenerArchivos(NombreMecanismo: any, Seguridad: any) {


    const _direccion = this.props.Direccion || this.state.DireccionNombre;
    const _idVisor = this.props.IdVisor;

    if (_idVisor == undefined) {

      this.pnp.getFiles("Publicado/" + Seguridad + "/" + _direccion + "/" + NombreMecanismo).then(
        (res) => (
          this.setState(
            {
              documentosMecanismo: res,
            },
            () => {
              if (this.state.documentosMecanismo.length > 0) {
                this.openModal();
                this.setState({ btnCrearMecanismo: false, });
              } else {
                this.setState({ btnCrearMecanismo: true, });
              }
            }
          )
        )
      ).catch(() => { this.setState({ hasError: true }) });
    } else {
      this.pnp
        .getFiles("Publicado/" + Seguridad + "/" + _idVisor + "/" + NombreMecanismo)
        .then((res) => (
          this.setState({ documentosMecanismo: res },
            () => {
              if (this.state.documentosMecanismo.length > 0) {
                this.openModal();
                this.setState({ btnCrearMecanismo: false });
              } else {
                this.setState({ btnCrearMecanismo: true });
              }
            }
          )
        )
        );
    }
  }

  // Funcion para llamar documentos de los mecanismos al modal
  private ConsultarMecanismos(Driver: any,acordeon:any) {
    this.pnp.consultarMecanismosByDriver(Driver)
      .then((res) => {
        
        var filtradoH = res.filter( (x: { Habilitado : any }) => x.Habilitado == "Yes" );

        var MecanismosdelDriver = filtradoH.filter(
          (x: { Mecanismo_x0020_del_x0020_Driver: any }) =>
            x.Mecanismo_x0020_del_x0020_Driver.Label == "Mecanismos del driver"
        );
        var OtrosMecanismosOperacional = filtradoH.filter(
          (x: { Mecanismo_x0020_del_x0020_Driver: any }) => x.Mecanismo_x0020_del_x0020_Driver.Label == "Otros mecanismos Operacionales"
        );
        this.setState(
          {
            mecanismos: res,
            MecanismosdelDriver: MecanismosdelDriver,
            OtrosMecanismosOperacional: OtrosMecanismosOperacional,
          }, () => {
            this.actualizarAcordeon(acordeon)
          }
        );






      }).catch(() => { this.setState({ hasError: true }) });
  }


  // Funcion Abrir Modal
  closeModal = () => {
    this.setState({ estadoModal: false, ficha: [] });
  }

  // Funcion Cerrar Modal
  private openModal(IdMecanismo?: any) {
    if (IdMecanismo) {
      this.setState({
        IdMecanismo: parseInt(IdMecanismo, 10), estadoModal: true, EstadoMenu2: 0
      })
    } else {
      this.setState({ estadoModal: true, EstadoMenu2: 0 });

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
      ).catch(() => { this.setState({ hasError: true }) });
  }


  closeModalMecan = () => {
    this.setState({ showModal: false });
  }



  openModalCrear = (Acceso: any, opcion: any, IdMecanismo: any) => {
    const crearProps = {
      Acceso: Acceso,
      opcion: opcion,
      IdMecanismo: IdMecanismo
    }

    this.setState({
      CrearProps: crearProps,
      showModalCrear: true
    })
  }

  openModalWithProps = (props: any) => {
    this.setState({
      showModal: true,
      pilaresProps: props
    });
  };

  private async getMecanismo(direccion: string, area: string, seguridad: string, id: any) {
    try {
      const res = await this.pnp.getListItems(
        "Mecanismos Local",
        ["Nombre_x0020_Mecanismo_x0020_Loc"],
        `ID eq '${id}'`,
        "", "", 0, this.props.SitioSigla
      );

      if (res && res.length > 0) {
        const { Nombre_x0020_Mecanismo_x0020_Loc } = res[0];

        const documentos = await this.pnp.ObtenerArchivosByMecanismo(Nombre_x0020_Mecanismo_x0020_Loc, seguridad.split(";")[0], direccion, area);

        if (documentos && documentos.length > 0) {
          const ficha = await this.pnp.consultarFichaForTable(Nombre_x0020_Mecanismo_x0020_Loc);

          if (ficha && ficha.length > 0) {
            const pilaresProps = {
              Direccion: direccion,
              IdVisor: area,
              Modelo: `Modelo ${area}`,
              NumeroPilar: "1",
              NombreMecanismo: Nombre_x0020_Mecanismo_x0020_Loc,
              Seguridad: seguridad.split(";")[0],
              Acceso: "1",
              Ficha: ficha,
              DocumentosMecanismo: documentos
            };

         

            this.openModalWithProps(pilaresProps);


          }


        }
      }
      else {
        alert("La ficha no contiene información");
      }

    } catch (error) {
      console.error('Error en getMecanismo:', error);
    }
  }





  public handleEstadoMenuChange(id: string, value: boolean) {
    this.setState({ [id]: value });
  }




  public render(): React.ReactElement<IPilaresProps> {


    return (

      <>
      


      {
        this.state.pilarExiste ? 



        
      <div>
      {this.state.estadoModal == true ? (
        <>

          <FichaModal
            context={this.props.Webpartcontext}
            userId={this.props.UserId}
            urlSite={this.props.NombreSubsitio}
            IdMecanismo={this.state.IdMecanismo}
            CloseModal={this.closeModal.bind(this)}
            Area={this.state.AreaNombre}
            Direccion={this.state.DireccionNombre}
            SubArea={this.state.SubAreaNombre}
            NombrePais={this.state.NombrePais}
          />


        </>


      ) : (<>
        <div className="toolbar py-5 py-lg-7 padding-top" id="kt_toolbar">
          <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
            <div className="page-title d-flexn flex-column me-3">
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

                <Link to={`/Visor/${this.state.modeloActual}`}>
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
                  {this.state.BtnMapaMecanismo}
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
                                   {this.state.tituloPilares}
                                  </h3>
                                </div>
                                <div className="col">
                                  <ul className="nav nav-pills mb-10 fs-6">
                                    {this.state.NumerosPilares.map((e: any) => (
                                      <li className="nav-item">
                                        {this.state.NumeroPilar == e.No_x0020_Pilar ? (
                                          <a className="nav-link nav-pilares " id="PilarSeleccionado" data-bs-toggle="tab"
                                            onClick={() => {
                                              this.actualizarAcordeon(0);
                                              this.changePilar(e.ID);
                                            }}>
                                            {e.No_x0020_Pilar}
                                          </a>
                                        ) : (
                                          <a className="nav-link nav-pilares " data-bs-toggle="tab"
                                            onClick={() => {
                                              this.actualizarAcordeon(e.Id);
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


                                        <img title="." src={this.state.urlImgPilar} width="172" height="172" />

                                      </span>
                                      <h2 className="text-uppercase px-5 mb-5">
                                        {this.state.Pilar}
                                      </h2>

                                    </div>
                                    <h3 className="text-gray-600 fs-6 text-uppercase mb-5">{this.state.TituloDriverO}</h3>

                                    {this.state.infoDrivers.map(
                                      (e: any, i: any) => (
                                        <div className="accordion accordion-flush">
                                          <div className="accordion-header" id="kt_accordion_1_header_1">
                                            {e.Id === this.state.estadoAcordeon ? (
                                              <button className="accordion-button fs-4 fw-bold"
                                                type="button" onClick={() => {
                                                  this.actualizarAcordeon(0),
                                                    this.ConsultarMecanismos(e.ID,0);
                                                }}>
                                                {this.state.NumeroPilar + "." + (i + 1) + ". " + e.Nombre_x0020_Driver}
                                                :
                                              </button>
                                            ) : (
                                              <button className="accordion-button collapsed"
                                                id="textoColapso" type="button"
                                                onClick={() => {
                                                  //this.actualizarAcordeon(e.Id),
                                                    this.ConsultarMecanismos(e.ID,e.Id);
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
                                                    {e.Objetivo_x0020_Driver}
                                                  </div>
                                                 
                                                </div>
                                               
                                                  <br/>
                                                <div className="lineDescription"></div>
                                                <div className="row">
                                                  <div className="col-12">
                                                    <div className="row">
                                                      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12" id="cuerpoMecanismo">
                                                        <h4 className="card-title align-items-start flex-column">
                                                          <span className="text-primary mb-5 fs-5" id="padding-pilares">
                                                            {this.state.TituloMecanismo}
                                                          </span>
                                                        </h4>


                                                        {
                                                          this.state.MecanismosdelDriver.map((f: any) => (

                                                            <div className="row">
                                                              <div className="col-7">
                                                                {
                                                                   

                                                                   
                                                                    f.No_x0020_Mecanismo_x0020_Local >0  && f.URL_x0020_DocumentSet !== "" || f.Mecanismos_x0020_Asociados !=="" ?
                                                                    <a className={f.URL_x0020_DocumentSet !== "" || f.Mecanismos_x0020_Asociados !=="" ? "fw-bold d-block fs-6 text-hover-primary mt-2" : "text-gray-800"} onClick={() => this.openModal(f.ID)}> {f.No_x0020_Mecanismo_x0020_Local}. {f.Nombre_x0020_Mecanismo_x0020_Loc}</a>
                                                                    
                                                                    
                                                                    :

                                                                   
                                                                      <a className={"text-gray-800"} > <a id="sinNumero">0.</a> {f.Nombre_x0020_Mecanismo_x0020_Loc}</a>
                                                                      
                                                                    
                                                                   
                                                            
                                                                

                                                                }
                                                              </div>
                                                              <div className="col">
                                                                {(this.state.gestores > 0) ? (
                                                                  
                                                                    f.Nivel_x0020_Implementacion === "Implementado"?
                                                                                                                                        
                                                                  <div className="my-0 overMenuActualizar">
                                                                  <button title="b" type="button" className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                                                    <span id="trespuntos" className="svg-icon svg-icon-2 svg-icon-primary ">
                                                                      <SVGIconComponent iconType="M6" />
                                                                    </span>
                                                                  </button>

                                                                  <div className="menuActualizar" id="menuGestores">
                                                                    <div className="menu-item">
                                                                      <Link to={`/FormularioActualizacion/${f.Id}`}>
                                                                        <a className="menu-link px-3-1" id="colorMenuPilares">
                                                                          ACTUALIZAR
                                                                        </a>
                                                                      </Link>
                                                                    </div>
                                                                    <div className="menu-item">
                                                                      <Link to={`/FormularioEliminacion/${f.Id}`}>
                                                                        <a className="menu-link px-3-1" id="colorMenuPilares">
                                                                          ELIMINAR
                                                                        </a>
                                                                      </Link>
                                                                    </div>
                                                                    <div className="menu-item">
                                                                      <Link to={`/ComentarDocumentos/${f.Id}`}>
                                                                        <a className="menu-link px-3-1" id="colorMenuPilares">
                                                                          COMENTAR
                                                                        </a>
                                                                      </Link>
                                                                    </div>
                                                                  </div>
                                                                </div>:<div className="my-0 overMenuActualizar">
                                                                    <button title="b" type="button" className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                                                      <span id="trespuntos" className="svg-icon svg-icon-2 svg-icon-primary ">
                                                                        <SVGIconComponent iconType="M6" />
                                                                      </span>
                                                                    </button>

                                                                    <div className="menuActualizar" id="menuGestores">
                                                                      <div className="menu-item">
                                                                        <Link to={`/FormularioCreacion/${f.Id}`}>
                                                                          <a className="menu-link px-3-1" id="colorMenuPilares">
                                                                            CREAR
                                                                          </a>
                                                                        </Link>
                                                                      </div>                                                                       
                                                                    </div>
                                                                  </div>


                                                                ) : (f.Nivel_x0020_Implementacion === "Implementado"?
                                                                <div className="col-lg-2 col-md-2 col-xl-2 col-xxl-2 mt-3">
                                                                  <div className="my-0 overMenuActualizar">
                                                                    <button title="b" type="button"
                                                                      //onClick={() => { this.setState({ ['EstadoMenu' + f.ID]: !this.state['EstadoMenu' + f.ID], },) }}
                                                                      className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                                                                      data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                                                      <span className="svg-icon svg-icon-2 svg-icon-primary ">
                                                                        <SVGIconComponent iconType="M6" />
                                                                      </span>
                                                                    </button>
                                                                    <div className="menuActualizar" id="menuComentar">
                                                                      <div className="menu-item px-3-1">
                                                                        <Link to={"/ComentarDocumentos/" + f.Id}>
                                                                          <a id="colorMenuPilares" className="menu-link px-3-1">
                                                                            COMENTAR
                                                                          </a>
                                                                        </Link>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </div>:null
                                                                )
                                                                }




                                                              </div>

                                                            </div>
                                                          ))
                                                        }

                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="col-12">
                                                    <div className="row">
                                                      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                                        <h4 className="card-title align-items-start flex-column">
                                                          <span className="text-primary mb-5 fs-5" id="padding-pilares">
                                                            {this.state.TituloOtrosm}
                                                          </span>
                                                          <span className="a-buttomder">
                                                            {this.state.gestores > 0 && this.state.Lector.length <= 0 ? (
                                                              <Link to={"/FormularioActualizacion"}>
                                                                <button className="btn-crear1" type="button" name="Crear">
                                                                  Crear
                                                                </button>
                                                              </Link>
                                                            ) : null}
                                                          </span>
                                                        </h4>

                                                        {
                                                          this.state.OtrosMecanismosOperacional.map((f:any)=>(
                                                            <div className="row">
                                                              <div className="col-7">

                                                                {
                                                                 
                                                                   
                                                                    f.No_x0020_Mecanismo_x0020_Local >0  && f.URL_x0020_DocumentSet !== "" || f.Mecanismos_x0020_Asociados !=="" ?

                                                                    <a className={ f.URL_x0020_DocumentSet !== "" || f.Mecanismos_x0020_Asociados !==""  ? "fw-bold d-block fs-6 text-hover-primary mt-2" : "text-gray-800"} onClick={() => this.openModal(f.ID)}> &#8226;  {f.Nombre_x0020_Mecanismo_x0020_Loc}</a>
                                                                    
                                                                    :

                                                                      <a className={"text-gray-800"} > &#8226; {f.Nombre_x0020_Mecanismo_x0020_Loc}</a>
                                                                      
                                                                    
                                                                   
                                                                 
                                                                }

                                                                 
                                                              </div>

                                                              <div className="col">
                                                              {(this.state.gestores > 0) ? (
                                                                  
                                                                  f.Nivel_x0020_Implementacion === "Implementado"?
                                                                                                                                      
                                                                <div className="my-0 overMenuActualizar">
                                                                <button title="b" type="button" className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                                                  <span id="trespuntos" className="svg-icon svg-icon-2 svg-icon-primary ">
                                                                    <SVGIconComponent iconType="M6" />
                                                                  </span>
                                                                </button>

                                                                <div className="menuActualizar" id="menuGestores">
                                                                  <div className="menu-item">
                                                                    <Link to={`/FormularioActualizacion/${f.Id}`}>
                                                                      <a className="menu-link px-3-1" id="colorMenuPilares">
                                                                        ACTUALIZAR
                                                                      </a>
                                                                    </Link>
                                                                  </div>
                                                                  <div className="menu-item">
                                                                    <Link to={`/FormularioEliminacion/${f.Id}`}>
                                                                      <a className="menu-link px-3-1" id="colorMenuPilares">
                                                                        ELIMINAR
                                                                      </a>
                                                                    </Link>
                                                                  </div>
                                                                  <div className="menu-item">
                                                                    <Link to={`/ComentarDocumentos/${f.Id}`}>
                                                                      <a className="menu-link px-3-1" id="colorMenuPilares">
                                                                        COMENTAR
                                                                      </a>
                                                                    </Link>
                                                                  </div>
                                                                </div>
                                                              </div>:<div className="my-0 overMenuActualizar">
                                                                  <button title="b" type="button" className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                                                    <span id="trespuntos" className="svg-icon svg-icon-2 svg-icon-primary ">
                                                                      <SVGIconComponent iconType="M6" />
                                                                    </span>
                                                                  </button>

                                                                  <div className="menuActualizar" id="menuGestores">
                                                                    <div className="menu-item">
                                                                      <Link to={`/FormularioCreacion/${f.Id}`}>
                                                                        <a className="menu-link px-3-1" id="colorMenuPilares">
                                                                          CREAR
                                                                        </a>
                                                                      </Link>
                                                                    </div>                                                                       
                                                                  </div>
                                                                </div>


                                                              ) : (f.Nivel_x0020_Implementacion === "Implementado"?
                                                              <div className="col-lg-2 col-md-2 col-xl-2 col-xxl-2 mt-3">
                                                                <div className="my-0 overMenuActualizar">
                                                                  <button title="b" type="button"
                                                                    //onClick={() => { this.setState({ ['EstadoMenu' + f.ID]: !this.state['EstadoMenu' + f.ID], },) }}
                                                                    className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                                                                    data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                                                    <span className="svg-icon svg-icon-2 svg-icon-primary ">
                                                                      <SVGIconComponent iconType="M6" />
                                                                    </span>
                                                                  </button>
                                                                  <div className="menuActualizar" id="menuComentar">
                                                                    <div className="menu-item px-3-1">
                                                                      <Link to={"/ComentarDocumentos/" + f.Id}>
                                                                        <a id="colorMenuPilares" className="menu-link px-3-1">
                                                                          COMENTAR
                                                                        </a>
                                                                      </Link>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </div>:null
                                                              )
                                                              }
                                                                


                                                              </div>


                                                            </div>
                                                            







                                                          ))
                                                        }


                                                        
                                                        
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>))}
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
        </div>
      </>)
      }
    </div>
        
        
        
        
        
        
        
        
        :

        
        
        
        
        <div>

        <h1>El pilar que estas buscando no se encuentra disponible</h1>
        
        </div>
      }
      </>


    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    parametros: state.parametros.parametros,
    sitio: state.sitio,
    userDetail: state.userDetail.userDetail,
    paises: state.paises.paises,
  };
};

export default connect(mapStateToProps)(withRouter(Pilares));
