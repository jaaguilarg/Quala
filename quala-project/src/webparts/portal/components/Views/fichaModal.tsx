import * as React from "react";
import { PNP } from "../Util/util";
import {
  Link,
   withRouter
} from 'react-router-dom'
import { connect } from 'react-redux';




export interface IPilaresProps {
IdMecanismo:any,
CloseModal:()=>void,
Area:any,
Direccion:any,
SubArea:any,
nombrePais:any,
}



export interface IFichaModal {
    context: any;
    userId: any;
    urlSite: any;    
    IdMecanismo:any;
    CloseModal:any;
    Area:any;
    Direccion:any;
    SubArea:any;
    paramatros:any;
    sitio:any,
    paises: any;
    NombrePais:any;
}

class FichaModal extends React.Component<IFichaModal, any> {
    public pnp: PNP;
    constructor(props: any) {
        super(props);   
        
        this.pnp = new PNP(props.context);
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
          urlImgPilar:"",
          hasError: false,
         url:""
        };

     }

     private AbrirNuevaVentana(link:string) {
      window.open(link, '_blank')
    }



    private TablaModelo() {
        this.pnp.getListItems("Mecanismos Local",["*"],
          "ID eq " + this.props.IdMecanismo,
          "").then((items)=>{
            if(items[0].URL_x0020_DocumentSet !== null){

              this.pnp.getListItems(
                "Mecanismos Local",
                ["*","ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver","ID_x0020_Driver_x0020_Local/No_x0020_Driver"],
                "Habilitado eq 1 and Mecanismos_x0020_AsociadosId eq " + this.props.IdMecanismo , 
                "ID_x0020_Driver_x0020_Local").then((items)=>{
                console.log(items)
        
                this.setState({
                  ficha:items,
                  estadoTablaModelo:true
                  
                })
              })
        

            }else{

              this.pnp.getListItems(
                "Mecanismos Local",
                ["*","ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver","ID_x0020_Driver_x0020_Local/No_x0020_Driver"],
                "Habilitado eq 1 and Mecanismos_x0020_AsociadosId eq " + items[0].Mecanismos_x0020_AsociadosId, 
                "ID_x0020_Driver_x0020_Local").then((items)=>{
                console.log(items)
        
                this.setState({
                  ficha:items,
                  estadoTablaModelo:true
                  
                })
              })

              
            }
          })


      this.pnp.getListItems(
        "Mecanismos Local",
        ["*","ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver","ID_x0020_Driver_x0020_Local/No_x0020_Driver"],
        "Habilitado eq 1 and Mecanismos_x0020_AsociadosId eq " + this.props.IdMecanismo , 
        "ID_x0020_Driver_x0020_Local").then((items)=>{
        console.log(items)

        this.setState({
          ficha:items,
          estadoTablaModelo:true
          
        })
      })

    }

    private consultarFicha(NombreMecanismo:any) {
      this.pnp.getListItems("Mecanismos Local",["*","Mecanismos_x0020_AsociadosId/Nombre_x0020_Mecanismo_x0020_Loc"],
      "ID eq " + this.props.IdMecanismo,
      "Mecanismos_x0020_AsociadosId").then((items)=>{
        if(items[0].URL_x0020_DocumentSet !== null){
          this.pnp.consultarFichaForTable(NombreMecanismo).then((res)=>{
            this.setState({
              ficha:res,
              url:items[0].URL_x0020_DocumentSet
    
            })
          })


        }else{

          this.pnp.consultarFichaForTable(items[0].Mecanismos_x0020_AsociadosId.Nombre_x0020_Mecanismo_x0020_Loc).then((res)=>{
            this.setState({ficha:res,url:items[0].URL_x0020_DocumentSet})
          })
          
        }
      })

    }


    public ObtenerArchivos(NombreMecanismo:any, Seguridad:any,Modelo:any,Url: any) {

      this.setState({
        NombreMecanismo: NombreMecanismo,
      })






      try{

        this.pnp.getFilesLink(Url,this.props.urlSite).then((res)=>{
          this.setState(
            {
              documentosMecanismo: res,
            },
            () => {
              if (this.state.documentosMecanismo.length > 0) {
                this.openModal()
                this.setState({
                  btnCrearMecanismo: false,
                })
              } else {
                this.setState({
                  btnCrearMecanismo: true,
                })
              }
            },
          )
        
         
        })
        this.consultarFicha(NombreMecanismo)



      }catch(error){
        this.pnp.getFiles('Publicado/' + Seguridad + '/' +  Modelo + '/' + NombreMecanismo).then((res) => (
          console.log(res),
          this.setState(
            {
              documentosMecanismo: res,
            },
            () => {
              if (this.state.documentosMecanismo.length > 0) {
                this.openModal()
                this.setState({
                  btnCrearMecanismo: false,
                })
              } else {
                this.setState({
                  btnCrearMecanismo: true,
                })
              }
            },
          )
        ),
        )
  
        this.consultarFicha(NombreMecanismo)

      }

  
  
  
    }
    private openModal() {
      this.setState({ estadoModal: true, EstadoMenu2: 0 })
    }

    private consultaMecanismo(){


      this.pnp.getListItems("Mecanismos Local",["*"],
      "ID eq " + this.props.IdMecanismo,
      "").then((items)=>{
        if(items[0].URL_x0020_DocumentSet !== null){
          this.pnp.consultarMecanismosById(this.props.IdMecanismo).then((items)=>{
      
            this.ObtenerArchivos(items[0].Nombre_x0020_Mecanismo_x0020_Loc,items[0].Seguridad.Label,items[0].Nombre_x0020_Modelo,items[0].URL_x0020_DocumentSet)
          })

        }else{
          this.pnp.consultarMecanismosById(items[0].Mecanismos_x0020_AsociadosId).then((items)=>{
        

            this.ObtenerArchivos(items[0].Nombre_x0020_Mecanismo_x0020_Loc,items[0].Seguridad.Label,items[0].Nombre_x0020_Modelo,items[0].URL_x0020_DocumentSet)
          })

        }
      })






    }

    public componentDidMount(){
      this.consultaMecanismo()
    }


   


 



     public render(): React.ReactElement<IFichaModal> {
      return(<>
                  <div className="modal-container overflow-auto">
                    <div className="modal-window">

                      <div>
                        <div id="EncabezadoModal">
                          <div className="alignRight alingheader">
                            <p className='ptext'>Ficha mecanismo</p>
                            <span
                              onClick={() => { this.props.CloseModal() }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                              </svg>
                            </span>

                          </div>
                          {/* <p className='ptext'>Ficha mecanismo</p> */}
                          <h1>{this.state.NombreMecanismo}</h1>
                          <ul className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">
                            <li className="breadcrumb-item text-gray-600">
                              <Link to="">
                                <a className="text-gray-600 text-hover-primary">
                                  {this.props.NombrePais}
                                </a>
                              </Link>
                            </li>
                            <li className="breadcrumb-item text-gray-600">
                              <Link to={''}>
                                {
                                  this.props.Direccion != undefined ?
                                  <a className="text-gray-600 text-hover-primary">
                                   {this.props.Direccion}
                                 </a>:<a className="text-gray-600 text-hover-primary"></a>
                                }
 
                              </Link>
                            </li>
                            <li className="breadcrumb-item text-gray-600">
                            <Link to="">
                            {
                                  this.props.Area != undefined ?
                                  <a className="text-gray-600 text-hover-primary">
                                   {this.props.Area}
                                 </a>:<a className="text-gray-600 text-hover-primary"></a>
                            }
                            </Link>

                            </li>

                            <li className="breadcrumb-item text-gray-600">
                            <Link to="">
                            {
                                  this.props.SubArea != undefined ?
                                  <a className="text-gray-600 text-hover-primary">
                                   {this.props.SubArea}
                                 </a>:<a className="text-gray-600 text-hover-primary"></a>
                            }
                            </Link>

                            </li>

                          </ul>

                        </div>

                        <div className="filesModal">
                          {this.state.documentosMecanismo.map((e:any) => (
                            <div className="row">
                              <div className="col">
                                <img title="."
                                  className="IconoArchivo"
                                  src={this.pnp.getImageFile(e.Name)}
                                />
                                <a onClick={() => this.AbrirNuevaVentana(`${this.state.urlSitio}${e.ServerRelativeUrl}?web=1`)} >{e.Name}</a>
                              </div>
                            </div>
                          ))}
                        </div>

                        <hr />
                      </div>

                      <div className="mb-2 mt-2 mx-2 my-2">
                        <div className="row">
                          <div className='col-md-8'>
                            <p id="TextoModelo">Modelos en los que aplica este mecanismo</p>

                          </div>

                          <div className='col-md-41 alingR'>
                            {
                              !this.state.estadoTablaModelo ?
                                <a onClick={() => { this.TablaModelo() }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                  </svg>
                                </a> :
                                <a onClick={() => { this.setState({ estadoTablaModelo: false }) }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
                                  </svg>
                                </a>



                            }

                          </div>

                        </div>

                        {this.state.estadoTablaModelo ? (
                          <table>
                            <tr id="encabezadoFicha">
                              <th>MODELO</th>
                              <th>PILAR</th>
                              <th>DRIVER</th>
                              <th>MECANISMO</th>
                            </tr>

                            {
                              this.state.ficha.map((e:any) => (
                                <tr>
                                  <td>{e.Nombre_x0020_Modelo}</td>
                                  <td>{e.No_x0020_Pilar}.{e.Nombre_x0020_Pilar}</td>
                                  <td>{e.No_x0020_Pilar}.{e.ID_x0020_Driver_x0020_Local.No_x0020_Driver}.{e.ID_x0020_Driver_x0020_Local.Nombre_x0020_Driver}</td>
                                  <td>{e.Nombre_x0020_Mecanismo_x0020_Loc}</td>

                                </tr>




                              ))
                            }
                          </table>
                        ) : null}
                      </div>

                    </div>
                  </div>
                </>)
            }

}


const mapStateToProps = (state:any) => {
  return {
    parametros: state.parametros.parametros,
    sitio:state.sitio,
    paises: state.paises,
  };
};

export default connect(mapStateToProps) (withRouter(FichaModal));
