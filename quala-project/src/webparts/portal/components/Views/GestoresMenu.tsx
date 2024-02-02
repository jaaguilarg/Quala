import * as React from "react";
import { Link } from 'react-router-dom';
import SVGIconComponent from "../Util/SVGIcon";

interface Props {
    gestoresLength: number;
    lectorLength: number;
    itemId: string | number;
    implementado: 1 | 0;
 }

const GestoresMenu: React.FC<Props> = ({ itemId, gestoresLength, lectorLength, implementado }) => {        
    switch(implementado){
        case 1:
            return (
                (gestoresLength > 0) ? (
                <div className="my-0 overMenuActualizar">
                    <button
                        title="b"
                        type="button"
                        className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                        >
                        <span id="trespuntos" className="svg-icon svg-icon-2 svg-icon-primary ">
                            <SVGIconComponent iconType="M6" />  
                        </span>
                    </button>

                <div className="menuActualizar" id="menuGestores">
                    <div className="menu-item">
                        <Link to={`/FormularioActualizacion/${itemId}`}>
                            <a className="menu-link px-3-1" id="colorMenuPilares">
                                ACTUALIZAR
                            </a>
                        </Link>
                    </div>
                    <div className="menu-item">
                        <Link to={`/FormularioEliminacion/${itemId}`}>
                            <a className="menu-link px-3-1" id="colorMenuPilares">
                                ELIMINAR
                            </a>
                        </Link>
                    </div>
                    <div className="menu-item">
                        <Link to={`/ExtenderVigencia/${itemId}`}>
                            <a className="menu-link px-3-1" id="colorMenuPilares">
                                EXTENDER VIGENCIA
                            </a>
                        </Link>
                    </div>
                    <div className="menu-item">
                        <Link to={`/ComentarDocumentos/${itemId}`}>
                            <a className="menu-link px-3-1" id="colorMenuPilares">
                                COMENTAR
                            </a>
                        </Link>
                    </div>
                </div>
                </div>
                ) : (<div className="col-lg-2 col-md-2 col-xl-2 col-xxl-2 mt-3">
                <div className="my-0 overMenuActualizar">
                <button title="b" type="button"
                    //onClick={() => { this.setState({ ['EstadoMenu' + f.ID]: !this.state['EstadoMenu' + f.ID], },) }}
                    className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                    data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                    <span className="svg-icon svg-icon-2 svg-icon-primary ">
                    <SVGIconComponent iconType="M6" /> 
                    </span>
                </button>
                <div className="menuActualizar" id="menuComentar">
                    <div className="menu-item px-3-1">
                    <Link to={"/ComentarDocumentos/" + itemId}>
                        <a id="colorMenuPilares" className="menu-link px-3-1">
                        COMENTAR
                        </a>
                    </Link>
                    </div>
                </div>
                </div>
                </div>));
        case 0:
            return(
                (gestoresLength > 0) ? (
                    <div className="col-lg-2 col-md-2 col-xl-2 col-xxl-2 mt-3">
                        <div className="my-0 overMenuActualizar">
                            <button title="b" type="button"
                            className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                            data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                <span className="svg-icon svg-icon-2 svg-icon-primary ">
                                    <SVGIconComponent iconType="M6" /> 
                                </span>
                            </button>                            
                            <div className="menuActualizar" id="menuCrear">
                            <div className="menu-item px-3-1">
                                <Link to={ "/FormularioCreacion/" + itemId}>
                                        <a id="colorMenuPilares" className="menu-link px-3-1"> CREAR</a>
                                </Link>
                            </div>
                            </div>
                        </div>
                    </div>) : null
                );
        default:
            return(
                <h1>hola</h1>
            )         
    }
}

export default GestoresMenu;
