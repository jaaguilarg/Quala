import * as React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PNP } from "../Util/util";
import { Link } from 'react-router-dom';


export interface IHomeProps {
  webPartContext: any;
  userId: any;
  urlSite: any;
  paisActual: any;
  Direcciones: any;
  Areas: any;
  SubAreas: any;
  gestores: any;
  linkIntranet: string
  parametros: {ID: any; Llave: string; Valor: string; Descripcion: string; } [];
}

class Home extends React.Component<IHomeProps, any> {
  public pnp: PNP;
  public nombreDireccion: "";

  
  constructor(props: any) {
    super(props);
    this.pnp = new PNP(this.props.webPartContext);

    this.state = {
      Direcciones: this.props.Direcciones,
      Areas: this.props.Areas,
      SubAreas: this.props.SubAreas,
      ModeloLocal: [],
      Apros: [],
      gestores: [],
    };
  }

  componentWillMount() {
    //this.consultaParametrosGenerales()

    //this.getHomeBySigla(this.props.paisActual);
  
  }
  
  /*Funcion que consulta los link para funcion del boton intranet en la lista de parametros generales
    private consultaParametrosGenerales(){
        this.pnp.getListItems(
            "ParametrosGenerales",
            ["*"],
            "Clave eq 'Intranet'",
            ""
        ).then((items)=>{

            if(items.length>0){
               let  item=items[0]

               this.setState({
                linkIntranet:item.Descripcion
               })
            }

        })
    }
    */

 
  public render(): React.ReactElement<IHomeProps> {
    return (
      <div id="ContenedorInicio">
        {/*Botones de Inicio*/}
        <div
          id="kt_toolbar_container"
          className="container-xxl d-flex flex-stack flex-wrap"
        >
          <div className="page-title d-flex flex-column me-3"></div>
        </div>
        {/*Pagina de inicio vista de usuario*/}

        <div
          id="kt_content_container"
          className="d-flex flex-column-fluid align-items-start container-xxl"
        >
          <div className="content flex-row-fluid" id="kt_content">
            <div className="no-shadow">
              <div className="card-body">
              <div className="row mb-6">
                  {this.props.urlSite ? this.state.Direcciones && this.state.Direcciones.length > 0 
                      ? this.state.Direcciones.map((d: any) => (
                          <div className="col-lg-6 col-md-6 col-xl-3 col-xxl-3 mb-6" key={d.ID}>
                            <h4 className="card-title align-items-start flex-column">
                              <Link to={"/Visor/" + d.ID }> {d.NombreDireccion} </Link>
                              <div className="separator mt-4 mb-4"></div>
                              {this.state.Areas && this.state.Areas.length > 0 
                                ? this.state.Areas.map((e: any) => {
                                    if(d.NombreDireccion2 === e.Direccion) {
                                      // Verificar si el área tiene subáreas
                                      
                                      return (
                                        <div key={e.ID}>
                                          {                                          
                                            <Link to={"/Visor/" + e.ID} className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">{e.NombreArea}</Link>
                                          }
                                          {
                                            this.state.SubAreas && this.state.SubAreas.length > 0 
                                              ? this.state.SubAreas.map((s: any) => {
                                                  if(s.Area === e.NombreArea) {
                                                    return (
                                                      <Link to={"/Visor/" + s.ID} className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2 mx-4" key={s.ID}>
                                                        {s.NombreSubArea}
                                                      </Link>
                                                    );
                                                  }
                                                  return null;
                                                }) 
                                              : null
                                          }
                                        </div>
                                      );
                                    }
                                    return null;
                                  })
                                : null
                              }
                            </h4>
                          </div>
                        ))
                      : null
                    : null
                  }
                </div>
              </div>
            </div>
          </div>
          <br />
        </div>

        <div className="columbtn">
          <div
            id="kt_toolbar_container"
            className="container-xxl d-flex flex-stack flex-wrap"
          >
            <div className="page-title d-flex flex-column me-3"></div>

            <div className="d-flex align-items-center">
            {this.props.gestores ?
              <div className="col-md-12 my-41 me-3">
                   <Link to={"/CrearModelo"}>                                                           
                      <span className="btn btn-sm btn-outline btn-outline-primary btn-active-primary">{(this.props.parametros.filter((elemento: any) => elemento.Llave === "BotonCrearModelodearea")[0] ?? {}).Valor}</span>
                  </Link>
                 </div>
                                        
                : null}
                               
            </div>
          </div>
          <div
            id="kt_toolbar_container"
            className="container-xxl d-flex flex-stack flex-wrap"
          >
            <div className="d-flex flex-column"></div>

            <div className="d-flex align-items-center me-3">
              <div className="col-md-12 textAlign">
                <a href={this.props.linkIntranet} className="btn-ajs">                
                {(this.props.parametros.filter((elemento: any) => elemento.Llave === "linkCrearModelodearea")[0] ?? {}).Valor}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state:any) => {
  return {
  parametros: state.parametros.parametros,
  };
};

export default connect(mapStateToProps)(withRouter(Home));