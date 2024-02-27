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
      Area: "",
      SubArea: "",
      gestores: [],
      Modelo:""
    };
  }

  public componentDidMount() {
    console.log(this.props.match.params.IDModelo);
    this.loadContextSite();   
    this.consultaModeloLocal()    
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
            }, () => {});
          });
        }
      );
    } else {
      console.log("No se encuentra Nombre");
    }
  }

  public consultaModeloLocal(){

   
    var ViewXml =  `<FieldRef Name="Nombre_x0020_Direccion"/>
                    <FieldRef Name="Nombre_x0020_Area"/>
                    <FieldRef Name="Vinculo_x0020_Portada_x0020_Mode"/>
                    <FieldRef Name="Vinculo_x0020_Mapa_x0020_Mecanis"/>
                    <FieldRef Name="Nombre_x0020_Sub_x0020_area"/>
                    <FieldRef Name="Nombre_x0020_Modelo_x0020_Local"/>
                    `;

    var FilterXml =  `<Query>
                      <Where>
                        <Eq>
                            <FieldRef Name='ID'></FieldRef>
                            <Value Type="Number">${this.props.match.params.IDModelo}</Value>
                        </Eq>
                      </Where>                       
                    </Query> `

    this.pnp.getListItemsWithTaxo('',"Modelos Local",ViewXml,FilterXml).then((res)=>{
      console.log(res)

      this.setState({        
        linkMapaMecanismo: res[0].Vinculo_x0020_Mapa_x0020_Mecanis,
        VisorOk: this.props.match.params.IdVisor + "/" + this.props.match.params.SubArea,
        Modelo:res[0].Nombre_x0020_Direccion.Label,
        Area: res[0].Nombre_x0020_Area.Label,
        SubArea: res[0].Nombre_x0020_Sub_x0020_area.Label,
        UrlPresentacion: '<iframe src="' + res[0].Vinculo_x0020_Portada_x0020_Mode.split('action')[0] + 'action=embedview&amp;wdAr=1.7777777777777777' + '" width="100%" height="600px" ></iframe>'
      });


    });

  }

  public render(): React.ReactElement<IVisorProps> {    
    return (
      <div>
        <div className="toolbar py-5 py-lg-7" id="kt_toolbar">
          <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
            <div className="page-title d-flex flex-column me-3">
              <ul className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">                           
                  <li className="breadcrumb-item text-gray-600">
                    <Link to="/">
                      <a className="text-gray-600 text-hover-primary">
                       {this.state.Modelo}
                      </a>
                    </Link>
                  </li>
                
                  <li className="breadcrumb-item text-gray-600">
                    <a className="text-gray-600 text-hover-primary">
                     {this.state.Area}
                    </a>
                  </li>

                  <li className="breadcrumb-item text-gray-600">
                    <Link to="/">
                      <a className="text-gray-600 text-hover-primary">
                        {this.state.SubArea}
                      </a>
                    
                    </Link>

                  </li>
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
																	this.state.UrlPresentacion != "" ? <div dangerouslySetInnerHTML={{ __html: this.state.UrlPresentacion }} />: null

																}

															</figure>
														</div>
													</div>
												</div>
												<div className='aligend'>
												
												{/*
													this.state.gestores && this.state.gestores.length > 0? //
														<div className="d-flex my-4 me-3">
															<Link to="/FormularioActualizacion">
																<a className="sizebutton nonecolor btn btn-sm btn-outline btn-outline-primary btn-active-primary">Gestionar Modelo de Area</a>
															</Link>

														</div>

														: null
                              */}
												<div className="d-flex my-4 me-3">
													<a href={this.state.linkMapaMecanismo} className="sizebutton btn btn-sm btn-outline btn-outline-primary btn-active-primary">Mapa
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
