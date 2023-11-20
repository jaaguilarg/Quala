import * as React from "react";
import { PNP } from "../Util/util";

export interface IModeloMecanismo {
    context: any;
    userId: any;
    funTabla: any;
    estadoTablaModelo: any;
    SetEstadoTablaModelo: any;
    ficha: any;
}

export default class ModeloMecanismo extends React.Component<IModeloMecanismo, any> {
    public pnp: PNP;
    constructor(props: any) {
        super(props);   
        
        this.pnp = new PNP(props.context);
     }



     public render(): React.ReactElement<IModeloMecanismo> {

        return(<>
             <div className="row">
                  <div className="col-md-8">
                    <p id="TextoModelo">Modelos en los que aplica este mecanismo</p>
                  </div>

                  <div className="col-md-41 alingR">
                    {!this.props.estadoTablaModelo ? (
                      <a onClick={() => {this.props.funTabla;}}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                          width="16" height="16" fill="currentColor"
                          className="bi bi-plus" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                      </a>
                    ) : (
                      <a
                        onClick={() => {this.props.SetEstadoTablaModelo;}}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-dash-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {this.props.estadoTablaModelo ? (
                  <table>
                    <tr id="encabezadoFicha">
                      <th>MODELO</th>
                      <th>PILAR</th>
                      <th>DRIVER</th>
                      <th>MECANISMO</th>
                    </tr>

                    {this.props.ficha.map((e: any) => (
                      <tr>
                        <td>{e.NombreModelo}</td>
                        <td>{e.NombrePilar}</td>
                        <td>{e.NombreDriver}</td>
                        <td>{e.NombreMecanismo}</td>
                      </tr>
                    ))}
                  </table>
                ) : null}
        </>)
     }
}
