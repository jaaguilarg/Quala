import * as React from "react";
import { PNP } from "../Util/util";
import { Link } from "react-router-dom";

export interface IModeloArea {
    context: any;
    userId: any;
    urlSite: any;
    paisActual: any;
    Direcciones: any;
    Areas: any;
    SubAreas: any;
  }
  

export default class ModelosArea extends React.Component<IModeloArea, any> {
    public pnp: PNP;

    constructor(props: any) {
        super(props);        
        
        this.pnp = new PNP(props.context);
    }

    public render(): React.ReactElement<IModeloArea> {
        return (<>
                Modelos de Área
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
                <div className="dropdown-menu navi" style={{ width: "75vw" }}>
                <div className="row">
                    {this.props.Direcciones.map((d: any) => (
                    <div className="nav-item dropdownSubMen col-md-3">
                        <Link to={"/Visor/" + d.NombreDireccion} className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">
                            <div className="ulborder">
                                <h6 id="mrgh6">
                                    {d.NombreDireccion}
                                </h6>
                            </div>
                        </Link>
                        <div className="dropdown-submen" style={{width: "18rem"}}>
                        {this.props.Areas && this.props.Areas.length > 0 ? this.props.Areas.map((e: any) => d.NombreDireccion === e.Direccion ? (
                                <li className="nav-item dropdownSubMen"
                                    style={{listStyle: "none",}} >
                                    <Link to={"/Visor/" + d.NombreDireccion +  "/" + e.NombreArea} className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">
                                         {e.NombreArea}
                                    </Link>
                                    <ul className="dropdown-submen">
                                    {this.props.SubAreas && this.props.SubAreas.length > 0
                                        ? this.props.SubAreas.map(
                                            (s:any) => s.Area === e.NombreArea ? (
                                                <li className="nav-item" style={{listStyle:"none",}}>
                                                <Link to={"/Visor/" + d.NombreDireccion + "/" + e.NombreArea + "/" + s.NombreSubArea}
                                                    className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">
                                                    {s.NombreSubArea}
                                                </Link>
                                                </li>
                                            ) : null
                                        ) : null}
                                    </ul>
                                </li>) : null)
                            : null}
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </>)
    }
}