import * as React from "react";
import { PNP } from "../Util/util";
import { Link, withRouter } from "react-router-dom";

export interface IVisorProps {
  Titulo: any;
  match: any;
  context: any;
  gestor: any;
  NombreSubsitio: any;
  paisActual: any;
  gestores: any;
  SitioSigla: any;
}

class Visor extends React.Component<IVisorProps, any> {
  public pnp: PNP;

  constructor(props: any) {
    super(props);
    console.log(props.paisActual);

    this.pnp = new PNP(this.props.context);
    this.context = this.props.context;

    this.state = {
      UserId: "",
      UserName: "",
      urlSite: "",
      UrlPresentacion: "",
      Gestor: [],
      linkMapaMecanismo: "",
      DuenoModelo: [],
      gestores: [],
    };
  }

  // funcion para iniciar variables globales para las funcionalidades
  public async loadContextSite() {
    this.pnp.getCurrentUser().then((user) => {
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

  // funcion validacion de roles
  private getGroups(Id: any) {
    if (this.props.NombreSubsitio) {
      
      this.setState(
        {
          NombreConvertido: this.props.paisActual,
        },
        () => {
          var nombreGrupo = "Gestores_" + this.props.paisActual;

          this.pnp.getUserInGroup(nombreGrupo, Id).then((resUser) => {
            
          });

          this.pnp.getGroupsByUserId(Id).then((resGroups) => {
           
            var gesto = resGroups.filter(
              (x: { LoginName: any }) => x.LoginName == "Gestores_" + this.props.paisActual
            );
           

            this.setState({
              gestores: gesto,
            });
          });

          var nombreGrupo = "Lector_todo_Corporativo";

          this.pnp.getUserInGroup(nombreGrupo, Id).then((resUser) => {
            
          });

          this.pnp.getGroupsByUserId(Id).then((resGroups) => {
            
            var Lecto = resGroups.filter(
              (x: { LoginName: any }) =>
                x.LoginName == "Lector_todo_Corporativo"
            );
           

            this.setState({
              Lector: Lecto,
            }, () => {this.consultarModelo();});
          });
        }
      );
    } else {
      console.log("No se encuentra Nombre");
    }
  }

  public consultarModelo()
  {
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

  public componentDidMount() {
    this.loadContextSite();       
  }


  public render(): React.ReactElement<IVisorProps> {    
    return (
      <div>
        <div className="toolbar py-5 py-lg-7" id="kt_toolbar">
          <div
            id="kt_toolbar_container"
            className="container-xxl d-flex flex-stack flex-wrap"
          >
            <div className="page-title d-flex flex-column me-3">
              {this.props.match.params.SubArea &&
              this.props.match.params.IdVisor &&
              this.props.match.params.direccion ? (
                <h1 className="ffspecial d-flex text-dark fw-bolder my-1 fs-2">
                  Modelo de {this.props.match.params.SubArea}
                </h1>
              ) : null}

              {!this.props.match.params.SubArea &&
              this.props.match.params.IdVisor &&
              this.props.match.params.direccion ? (
                <h1 className="ffspecial d-flex text-dark fw-bolder my-1 fs-2">
                  Modelo de {this.props.match.params.IdVisor}
                </h1>
              ) : null}
              {!this.props.match.params.SubArea &&
              !this.props.match.params.IdVisor &&
              this.props.match.params.direccion ? (
                <h1 className="ffspecial d-flex text-dark fw-bolder my-1 fs-2">
                  Modelo de {this.props.match.params.direccion}
                </h1>
              ) : null}

              <ul className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">
                <li className="breadcrumb-item text-gray-600">
                  <Link to="/">
                    <a className="text-gray-600 text-hover-primary">Inicio</a>
                  </Link>
                </li>
                {this.props.match.params.direccion ? (
                  <li className="breadcrumb-item text-gray-600">
                    <Link to="/">
                      <a className="text-gray-600 text-hover-primary">
                        {this.props.match.params.direccion}
                      </a>
                    </Link>
                  </li>
                ) : null}

                {this.props.match.params.IdVisor ? (
                  <li className="breadcrumb-item text-gray-600">
                    <a className="text-gray-600 text-hover-primary">
                      {this.props.match.params.IdVisor}
                    </a>
                  </li>
                ) : null}
                {this.props.match.params.SubArea ? (
                  <li className="breadcrumb-item text-gray-600">
                    <a className="text-gray-600 text-hover-primary">
                      {this.props.match.params.SubArea}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
            {/* boton regresar aqui */}
          </div>
          <div className="colorf d-flex align-items-center py-1">
            <div className="d-flex my-4 colorf">
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  color="#7E8299"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-left"
                  viewBox="2 1 10 14"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                </svg>
                <a className="md-rg btn-regresa1">Regresar</a>
              </Link>
            </div>
          </div>
        </div>

        <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
					<div className="content flex-row-fluid" id="kt_content">
						<div className="d-flex flex-column flex-root">
							<div className="page d-flex flex-row flex-column-fluid">
								<div className="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
									<div>
										
									</div>

									<div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
										<div className="content flex-row-fluid" id="kt_content">
											<div className="card card1">
												<div className="card-body">
													<div className="row mb-6">
														<div  style={{width:"100%"}}>
															<figure>
																{
																	this.state.UrlPresentacion != "" ? <div dangerouslySetInnerHTML={{ __html: this.state.UrlPresentacion }} />

																		: null

																}

															</figure>
														</div>
													</div>
												</div>
												<div className='aligend'>
												
												{
													this.state.gestores && this.state.gestores.length > 0? //
														<div className="d-flex my-4 me-3">
															<Link to="/CrearContenido/3">
																<a className="sizebutton nonecolor btn btn-sm btn-outline btn-outline-primary btn-active-primary">Gestionar Modelo de Área</a>
															</Link>

														</div>

														: null
												}
												<div className="d-flex my-4 me-3">
													<a href={this.state.linkMapaMecanismo} className=" sizebutton btn btn-sm btn-outline btn-outline-primary btn-active-primary">Mapa
														de Mecanismos</a>
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
    );
  }
}
export default withRouter(Visor);
