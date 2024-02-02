import * as React from "react";
import { PNP } from "../Util/util";
import { withRouter } from "react-router-dom";


export interface IModeloMecanismo {
    context: any;
    userId: any;
    funTabla: any;
    estadoTablaModelo: any;
    SetEstadoTablaModelo: any;
    ficha: any;
    match: any;
    
}


class ModeloMecanismo extends React.Component<IModeloMecanismo, any> {
    public pnp: PNP;
    constructor(props: any) {
        super(props);   
        
        this.pnp = new PNP(props.context);
      
        this.state={
          revisionURL: false,
          fichaModelo:[],
          Cambio:false,
      }  
     }


    public revisionURL() {

      console.log("hola mundo")


      if(this.props.estadoTablaModelo){
        this.setState({
          Cambio:true
        })
      }
      if(this.props.estadoTablaModelo || this.props.match.params.IdMecanismo != undefined ){
        
        this.setState({revisionURL:true},()=>{
          if(this.props.ficha){
            this.setState({
              fichaModelo:this.props.ficha
            })
          }else{
            this.pnp.getListItems(
              "Mecanismos Local",
              ["*"],
              "ID eq " + this.props.match.params.IdMecanismo,
              "").then((items)=>{
                this.setState({
                  fichaModelo:items
                })
              })
          }
        })
      }else{
        console.log("False")
      }
     
     }



    public componentWillMount() {
      this.revisionURL()
    } 
     

     public render(): React.ReactElement<IModeloMecanismo> {

        return(<>
             <div className="row">
                  <div className="col-md-8">
                    <p id="TextoModelo">Modelos en los que aplica este mecanismo  </p>
                  </div>

                  <div className="col-md-41 alingR">
                    {!this.props.estadoTablaModelo ? (
                      <a onClick={() => {this.props.funTabla();}}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                          width="16" height="16" fill="currentColor"
                          className="bi bi-plus" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                      </a>
                    ) : (
                      <a
                        onClick={() => {this.props.SetEstadoTablaModelo(!this.props.estadoTablaModelo)}}>
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

                {this.state.revisionURL && this.state.Cambio == true? (
                  <table>
                    <tr id="encabezadoFicha">
                      <th>MODELO</th>
                      <th>PILAR</th>
                      <th>DRIVER</th>
                      <th>MECANISMO</th>
                    </tr>
                    {this.props.ficha.map((e: any, index: number) => (
                      <tr key={index}>
                        <td>{e.NombreModelo}</td>
                        <td>{e.NombrePilar}</td>
                        <td>{e.NombreDriver}</td>
                        <td>{e.NombreMecanismo}</td>
                      </tr>
                    ))}
                  </table>
                ):null}



          {this.state.revisionURL && this.state.Cambio == false?(
                  <table>
                    <tr id="encabezadoFicha">
                      <th>MODELO</th>
                      <th>PILAR</th>
                      <th>DRIVER</th>
                      <th>MECANISMO</th>
                    </tr>
                    {this.state.fichaModelo.map((e: any, index: number) => (
                      <tr>
                        <td>{e.Nombre_x0020_Modelo}</td>
                        <td>{e.Nombre_x0020_Pilar}</td>
                        <td>{e.Nombre_x0020_Driver}</td>
                        <td>{e.Nombre_x0020_Mecanismo_x0020_Bas}</td>
                      </tr>
                    ))}
                  </table>
                ):null}
        </>)
     }
}

export default withRouter(ModeloMecanismo);