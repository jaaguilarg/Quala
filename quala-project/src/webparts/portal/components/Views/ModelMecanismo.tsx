import * as React from "react";
import {Link} from "react-router-dom";
import FileModal from "./FileModal";
import ModeloMecanismo from "./ModeloMecanismo";

interface ModalMecanismoProps {
    Context: any;
    UserId: number;
    UrlSitio: string;
    Titulo: string;
    Acceso: number;
    DocumentosMecanismo: any;
    NombreMecanismo: string;
    Direccion: string;
    IdVisor: string;
    EstadoTablaModelo: any;
    SetEstadoTablaModelo: any;
    Ficha: any;
    closeModal: () => void;
    tablaModelo: () => void;
}

const ModelMecanismo: React.FC<ModalMecanismoProps> = ({Context,UserId,UrlSitio,Titulo,Acceso,DocumentosMecanismo,
    NombreMecanismo,Direccion,IdVisor, EstadoTablaModelo,SetEstadoTablaModelo,Ficha,tablaModelo,closeModal}) => {
    return (
        <div className="modal-container overflow-auto">
            <div className="modal-container overflow-auto">
            <div className="modal-window">
              <div>
                <div id="EncabezadoModal">
                  <div className="alignRight alingheader">
                    <p className="ptext">{Titulo}</p>
                    <span
                      onClick={() => {
                        Acceso === 1? window.close() : closeModal();}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16"
                        height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                      </svg>
                    </span>
                  </div>
                  {/* <p className='ptext'>Ficha mecanismo</p> */}
                  <h1>{NombreMecanismo}</h1>
                  <ul className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">
                    <li className="breadcrumb-item text-gray-600">
                      <Link to="/">
                        <a className="text-gray-600 text-hover-primary">Fix Titulo</a>
                      </Link>
                    </li>
                    <li className="breadcrumb-item text-gray-600">
                      <Link to={"/Visor/" + Direccion + "/" + IdVisor}>
                        <a className="text-gray-600 text-hover-primary">
                          {Direccion}
                        </a>
                      </Link>
                    </li>
                    <Link to={IdVisor}>
                      <li className="breadcrumb-item text-gray-600">
                        {IdVisor}
                      </li>
                    </Link>
                  </ul>
                </div>

                <div className="filesModal">
                  <FileModal 
                    context={Context}
                    userId={UserId}
                    urlSite={UrlSitio}
                    documentosMecanismo={DocumentosMecanismo}
                  />                 
                </div>

                <hr />
              </div>

              <div className="mb-2 mt-2 mx-2 my-2">
                <ModeloMecanismo 
                  context={Context}
                  userId={UserId}
                  funTabla={tablaModelo}
                  estadoTablaModelo={EstadoTablaModelo}
                  SetEstadoTablaModelo={SetEstadoTablaModelo}
                  ficha={Ficha}
                  />                
              </div>
            </div>
          </div>                                      
        </div>
    );
}

export default ModelMecanismo;
