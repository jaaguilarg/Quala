import * as React from "react";
import SVGIconComponent from "../Util/SVGIcon";
import ModelosArea from "./ModelosArea";
import InformacionGC from "./InformacionGC";
import MacroProcesos from "./MacroProcesos";



interface Props {
    titulo: string;
    urlSiteSubsitio: string;
    sigla: string;
    sitioPrincpal: string;
    sitio: string;
    paisA: string;
    Paises: [];
    context: any;
    UserId: string;
    Direcciones: {ID: any; NombreDireccion: string }[];
    SubAreas: { ID: any; Area: string; NombreSubArea: string }[];
    Areas: { ID: any; Direccion: string; NombreArea: string }[];
    Gestor: boolean;
    infoMenus: [];
    urlDesarrollo: string;
    urlNegocio: string;
    macroProcesos: [];
 }


const Header: React.FC<Props> = ({ titulo, urlSiteSubsitio, sigla,sitioPrincpal,sitio, paisA, Paises,context,UserId,Direcciones,SubAreas,Areas,Gestor,infoMenus, urlDesarrollo, urlNegocio, macroProcesos }) => {    
   return <div id="kt_header" className="header"        
    style={{backgroundImage: `url(${sitioPrincpal + "/SiteAssets/" + sigla + "/Header.png"})`,}}
    data-kt-sticky="true" data-kt-sticky-name="header" data-kt-sticky-offset="{default: '200px', lg: '300px'}">
    
    <div className="container-xxl d-flex flex-grow-1 flex-stack" style={{ marginTop: "-20px" }}>
      <div className="d-flex align-items-center me-5">
        <div className="d-lg-none btn btn-icon btn-active-color-primary w-30px h-30px ms-n2 me-3" id="kt_header_menu_toggle">
          <span className="svg-icon svg-icon-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24"
              height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
                fill="currentColor"></path>
              <path
                opacity="0.3"
                d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>

        <div style={{ marginTop: "10px" }}>        
            <a href={urlSiteSubsitio}>            
              <span>
                <img
                  alt="Logo"
                  src= {sitioPrincpal + "/SiteAssets/Root/Quala_Logo_Home.png"}
                  className="h-45px h-lg-60px" title="."/>
              </span>   
            </a>
     
        </div>

        <div id="alingTittle" className="col">
          <div className="ms-5 ms-md-10 me-3">
            <h1 className="d-flex text-dark fw-bolder my-1 fs-1 ffspecial">
              {titulo}
            </h1>
          </div>
        
          <nav className="navbar navbar-expand-lg">
            <ul className="navbar-nav">
              <li className="nav-item dropdown text-decoration1">
                {paisA}
                <ul className="dropdown-menu">
                  {Paises.map((e: any) => (
                    <li className="nav-item">{e.Nombre_x0020_Pais}</li>
                  ))}
                </ul>
                
                <SVGIconComponent iconType="M1" />
                
                <ul className="dropdown-menu">
                  {Paises.map((e: any) => (
                    <li className="nav-item dropdownSubMenu">
                      <a href={e.Url_x0020_Sitio.Url}
                        className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">
                        {e.Nombre_x0020_Pais}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item dropdown text-decoration1">
                <ModelosArea 
                   context={context}
                   paisActual={paisA}
                   urlSite={urlSiteSubsitio}
                   userId={UserId}
                   Direcciones={Direcciones}
                   Areas={Areas}
                   SubAreas={SubAreas}
                />                               
              </li>
              <li className="nav-item dropdown text-decoration1">
                <MacroProcesos 
                  macroProcesos={macroProcesos}
                  context={context}
                />               
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div className="header-menu-container d-flex align-items-stretch w-100" id="kt_header_nav">
      <div data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start" className="infoGC menu-item menu-lg-down-accordion me-lg-1">
        <InformacionGC 
          context={context}
          userId={urlSiteSubsitio}
          urlSite={urlSiteSubsitio}
          Gestor = {Gestor}
          infoMenus = {infoMenus}
        />
      </div>
    </div>
  </div> 
}

export default Header;