import * as React from "react";
import { Link } from "react-router-dom";

export interface IInformacionGC {
    context: any;
    userId: any;
    urlSite: any;
    Gestor: any;
    infoMenus: any;   
}

export default class InformacionGC extends React.Component<IInformacionGC, any> {
    constructor(props: any) {
        super(props);          
     }
              
    public render(): React.ReactElement<IInformacionGC> {
    
        return(<>
        {this.props.Gestor ? (
                          <nav id="AlingInfoGC" className="navbar navbar-expand-lg" >
                            <ul className="navbar-nav">
                              <li className="nav-item dropdown text-decoration1">
                                Información GC
                                <svg
                                  xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                  fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                  <path
                                    fill-rule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                  />
                                </svg>
                                <ul className="dropdown-menu">
                                  {this.props.infoMenus.map((d: any)=>(
                                  <li className="nav-item" >           
                                     {d.Enlace.startsWith("/") ? (
                                      <Link to={d.Enlace} title={d.Nombre_x0020_Menu} className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">
                                        {d.Nombre_x0020_Menu}
                                      </Link>
                                    ) : (
                                      <a href={d.Enlace} target="_blank" rel="noopener noreferrer" title={d.Nombre_x0020_Menu} className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">
                                        {d.Nombre_x0020_Menu}
                                      </a>
                                    )}
                                  </li>))
                                  }                                                                 
                                </ul>
                              </li>
                            </ul>
                          </nav>
                          ) : (
                            <nav id="AlingInfoGC" className="navbar navbar-expand-lg">
                              <ul className="navbar-nav">
                                <li className="nav-item dropdown text-decoration1">
                                  Información GC
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-chevron-down"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                    />
                                  </svg>
                                  <ul className="dropdown-menu">
                                    {this.props.infoMenus &&
                                    this.props.infoMenus.length > 0
                                      ? this.props.infoMenus.map((e: any) => (
                                          <li className="nav-item dropdownSubMenu">
                                            {" "}
                                            <a
                                              id="grayc"
                                              href={e.Link}
                                              target="_blank"
                                              rel="noreferrer noopener"
                                            >
                                              {e.Title}
                                            </a>
                                          </li>
                                        ))
                                      : null}
                                  </ul>
                                </li>
                              </ul>
                            </nav>
                          )}
        </>)

    }
    


}