import * as React from "react";
import { connect } from 'react-redux';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';

export interface IMacroProcesos {
    context: any;
    macroProcesos: any;
    parametros: {ID: any; Llave: string; Valor: string; Descripcion: string; } [];
  }

  const MacroProcesos: React.FC<IMacroProcesos> = ({macroProcesos,parametros}) => {
   

    const groupedByMenu = macroProcesos.reduce((acc:any, item:any) => {
        if (!acc[item.Orden_x0020_Menu]) {
            acc[item.Orden_x0020_Menu] = [];
        }
        acc[item.Orden_x0020_Menu].push(item);

        
        return acc;

    }, {});  

   
    return <> <div> {(parametros.filter((elemento: any) => elemento.Llave === "TituloMacroprocesos")[0] ?? {}).Valor}
                <ArrowDropDown />
              </div>  
            <div  className="dropdown-menu navi" style={{ width: "40vw" }}>
            <div className="row">
            
            
            {Object.keys(groupedByMenu).map((key) => {
                const order = Number(key);
                const itemsForMenu = groupedByMenu[order];               
            
                const headerItem = itemsForMenu.find((item:any) => item.Orden_x0020_Submenu === 0);
                const submenuItems = itemsForMenu.filter((item:any) => item.Orden_x0020_Submenu > 0);
            
            return(
            <>
            <div className="nav-item dropdownSubMen" style={{width: "20rem"}}>                   
                <div className='ulborder'>
                    
                        <a target="_blank" href={headerItem.Enlace.Description} >
                        <h6 id='mrgh6'>{headerItem.Nombre_x0020_Menu ? headerItem.Nombre_x0020_Menu : "" } </h6>
                        </a>
                   
                </div>

                <div className="dropdown-submen" style={{ width: "20rem" }}>
                    {submenuItems.map((subItem:any) => (
                        <li className="nav-item dropdownSubMen" style={{ listStyle: "none" }}>
                            <a target="_blank" href={subItem.Enlace.Description}  
                            className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">
                                {subItem.Nombre_x0020_Menu}
                            </a>
                        </li>
                    ))}
                </div>
            </div>
            </>)
            })}                 
        </div>
        </div>
        </>
 }

 const mapStateToProps = (state:any) => {
    return {
    parametros: state.parametros.parametros,
    };
};

 export default connect(mapStateToProps)(MacroProcesos);