import * as React from "react";
import SVGIconComponent from "../Util/SVGIcon";
import { PNP } from "../Util/util";

interface ModelComentarProps {
    Context: any;
    UserId: number;
    UrlSitio: string;
    Titulo: string;
    idMecanismo: any;
    nombreMecanismo: string;
    idDocumento: any;
    nombreDocumento: any;
    Direccion: string;
    Area: string;
    Subarea:string;
    closeModal: () => void;
}




const ModelComentar: React.FC<ModelComentarProps> = ({closeModal,Context,UserId,UrlSitio,Titulo, idMecanismo, nombreMecanismo, idDocumento,nombreDocumento, Direccion,Area,Subarea}) => {
    
    const pnp = new PNP(Context);
    const [comentario, setComentario] = React.useState<string>("");    
    const [cantidadCaracteres, setCantidadCaracteres] = React.useState<number>(0);        
    const [botones, setBotones] = React.useState<boolean>(true);
    
    const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const valor = e.target.value;
        setComentario(valor);
        setCantidadCaracteres(valor.length);
    };

    //Funcion que guarda los comentarios de la solicitud
    const GuardarComentarios = () => {
        if(comentario.length > 0){
            let obj={
                Nombre_x0020_Mecanismo_x0020_Loc: nombreMecanismo,
                ID_x0020_Documento: idDocumento,
                Nombre_x0020_Documento: nombreDocumento,
                UsuarioId: UserId,                
                Comentario: comentario,
                ID_x0020_Mecanismo_x0020_Local: idMecanismo,
                Fecha_x0020_Comentario: new Date().toISOString(),
                Direccion: Direccion,
                Area: Area,
                Subarea: Subarea
            }      
            pnp.insertItem("Comentarios",obj).then(() => {
                setBotones(false);
                closeModal();});                                         
        }
    }


    return(
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="card">
            <div className="card-header">
                <h5>Comentar Mecanismo</h5>
            </div>
            <div className="card-body">
                <textarea
                    value={comentario}
                    onChange={handleComentarioChange}
                    className="form-control"
                    name="inputComentario"
                    placeholder="Ingrese el comentario"
                    maxLength={140}
                ></textarea>
    
                <p className="mt-2">{cantidadCaracteres}/140</p>
    
                {botones && (
                    <div className="mt-3">
                        <button 
                            name="enviarComentario"
                            type="button"
                            className="btn btn-primary"
                            onClick={GuardarComentarios}
                        >
                            Enviar <SVGIconComponent iconType='M4' />
                        </button>
                    </div>
                )}
            </div>
                </div>
            </div>
        </div>
    
    )
};

export default ModelComentar;