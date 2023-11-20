import * as React from "react";


export interface IMacroProcesos {
    context: any;
    macroProcesos: any;
  }

  const MacroProcesos: React.FC<IMacroProcesos> = ({
    macroProcesos
  }) => {

   
    const groupedByMenu = macroProcesos.reduce((acc:any, item:any) => {
        if (!acc[item.Orden_x0020_Menu]) {
            acc[item.Orden_x0020_Menu] = [];
        }
        acc[item.Orden_x0020_Menu].push(item);
        return acc;

    }, {});
    console.log(groupedByMenu);

    
    return <>  Macroprocesos
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
    </svg>
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
                    <h6 id='mrgh6'>{headerItem.Nombre_x0020_Menu}</h6>
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
    </div></>
 }

 export default MacroProcesos;