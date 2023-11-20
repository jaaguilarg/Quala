import * as React from "react";
import { PNP } from "../Util/util";

export interface IFileModal {
    context: any;
    userId: any;
    urlSite: any;    
    documentosMecanismo: any;   
}

export default class FileModal extends React.Component<IFileModal, any> {
    public pnp: PNP;
    constructor(props: any) {
        super(props);   
        
        this.pnp = new PNP(props.context);
     }

     public render(): React.ReactElement<IFileModal> {

        return(<>
        {this.props.documentosMecanismo.map((file: any) => (
           <div className="row">
                <div className="col">
                    <img alt="" className="IconoArchivo"src={this.pnp.getImageFile(file.Name)}/>
                    <a onClick={() =>
                        this.pnp.AbrirNuevaVentana(`${this.props.urlSite}${file.ServerRelativeUrl}?web=1`)}>
                        {file.Name}
                    </a>
                </div>
            </div>
            ))}
        </>)
     }

}