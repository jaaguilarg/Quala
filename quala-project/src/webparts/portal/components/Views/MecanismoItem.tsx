import * as React from "react";
import GestoresMenu from "./GestoresMenu";
//import { Modal } from 'office-ui-fabric-react/lib/Modal';
//import ModelMecanismo from "../Views/ModelMecanismo";
export interface Mecanismo {
  Implementado: number;
  Nombre_x0020_Mecanismo_x0020_Loc: string;
  ID: number;
  No_x0020_Mecanismo_x0020_Local:number
 
  

}

export interface MecanismoItemProps {
  mecanismo: Mecanismo;
  gestoresLength: number;
  lectorLength: number;
  obtenerArchivos: (nombre: string, seguridad: string) => void;
  consultarFicha: () => void;
  handleEstadoMenuChange?: ((id: string, value: boolean) => void) | null;
  getMecanismo:(direccion: string, area: string, seguridad: string, id: any)=>void;
  openModal:(IdMecanismo:any)=>void;

}


const MecanismoItem: React.FC<MecanismoItemProps> = ({
  mecanismo,
  gestoresLength,
  lectorLength,
  obtenerArchivos,
  consultarFicha,
  handleEstadoMenuChange,
  openModal,
 

}) => {
    
  const { Implementado, Nombre_x0020_Mecanismo_x0020_Loc, No_x0020_Mecanismo_x0020_Local } = mecanismo;

  const implementadoRaw: 1 | 0 = mecanismo.Implementado === 100 ? 1 : 0;

  const handleClick = () => {
    openModal(mecanismo.ID);    
    (mecanismo.Implementado==1)?
    (handleEstadoMenuChange) ? handleEstadoMenuChange("EstadoMenu" + mecanismo.ID,false): null: null;
  };

  return (

    <>
    <div className="">


      <div className="row listMecanimo">
        <div className="col-lg-8 col-md-10 col-xl-10 col-xxl-10 py-2" id="widthdiv">
          <ul id="listaMecanismo">
            <li >
              <a className={Implementado === 1 ? " fw-bold d-block fs-6 text-gray-800 text-hover-primary mt-2" : ""}onClick={handleClick}>
                {No_x0020_Mecanismo_x0020_Local}.{Nombre_x0020_Mecanismo_x0020_Loc}
              </a>

              
            </li>
          </ul>
        </div>        
          <div className="col-lg-2 col-md-2 col-xl-2 col-xxl-2 mt-3" id="MenuPilares">
      
            <GestoresMenu
                gestoresLength={gestoresLength}
                lectorLength={lectorLength}
                itemId={mecanismo.ID}
                implementado={implementadoRaw}
            />            
          </div>
      </div>
    </div>
    </>

  );
}

export default MecanismoItem;
