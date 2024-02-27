import { PNP } from '../Util/util';



export class utilFormulario{
    public pnp: PNP

    constructor(webPartContext:any){
        this.pnp = new PNP(webPartContext);


    }

    actualizaEstado:{}
       
    public mappingRol = {
        Revisor: "Revisor",
        Publicador: "Publicador",
        Aprobador_x0020_Revisa: "Aprobador Revisa",
        Gerente_x0020_de_x0020_Area: "Gerente de rea",
        AuditorId: "Auditor",
        Jefe_x0020_o_x0020_Gerente_x0020: "Jefe o Gerente",
        DirectorGH: "Director GH",
        Director_x0020_area: "Director de rea",
        Director_x0020_General: "Director General",
        Presidente_x0020_Ejecutivo: "Presidente Ejecutivo",
        Lider_x0020_de_x0020_modelo_x002: "Lder de Modelo",        
    };
    

    


    // Consulta los usuarios que aprueban por direccin y rea
    public consultarMatrizApro(paisId: number, tipomecanismo: string, niveles: any) {
        let listadeUsuarios: any[] = [];

        
        this.pnp.getMatrizPermisosByTipoM(tipomecanismo, paisId)
        .then((apro: any) => {
            if (apro.length > 0) {
            apro.forEach((item: any) => {                
                for (const propName in item) {
                    if (item.hasOwnProperty(propName) && this.mappingRol.hasOwnProperty(propName)) {


                      
                     this.pnp.getByIdUser(parseInt(item[propName][0].id,10)).then((user)=>{
                        listadeUsuarios.push({
                            rol: propName,
                            user: user.Id,
                            idUser: item[propName]                        
                          });  

                     });
                      
                    
                    }
                }                                          
            });

            }
        });

        

     /*   const aprobadores = listadeUsuarios.filter((x:any) => x.rol == 'Aprobador_x0020_RevisaId');
        const revisores =  listadeUsuarios.filter((x:any) => x.rol == 'RevisorId');
        const elaboradores = listadeUsuarios.filter((x:any) => x.rol == 'Publicador')
        
        
        let nivelesFilter = niveles.filter((x:any) => x.Tipo_x0020_Mecanismo.Label== tipomecanismo);
        let nivelesAprobadores: any[] = [];

        nivelesFilter.forEach((element:any) => {
            if (element.Elabora) nivelesAprobadores.push({NombreDireccion: "Elabora"});
            if (element.Revisa) nivelesAprobadores.push({NombreDireccion: "Revisa"});
            if (element.Aprueba) nivelesAprobadores.push({NombreDireccion: "Aprueba"});
            if (element.Area_x0020_Involucrada) nivelesAprobadores.push({NombreDireccion: "Area Involucrada"});
            if (element.Director_x0020_GH) nivelesAprobadores.push({NombreDireccion: "Director GH"});
            if (element.Director_x0020_area) nivelesAprobadores.push({NombreDireccion: "Director area"});
            if (element.Director_x0020_General) nivelesAprobadores.push({NombreDireccion: "Director General"});
            if (element.Presidente_x0020_Ejecutivo) nivelesAprobadores.push({NombreDireccion: "Presidente Ejecutivo"});                            
        });


        console.log(listadeUsuarios)
        console.log(aprobadores)    
        console.log(revisores)
        console.log(elaboradores)
        console.log(nivelesAprobadores)    

        return {listaUsuarios: listadeUsuarios, aprobadores: aprobadores, revisores: revisores, elabarador: elaboradores, nivelesAprobadores: nivelesAprobadores}*/
    }
         
    //Guarda usuario seleccionado en el PeoplePicker en la variable state.
    public _getPeoplePicker(items: any[], objeto:any) {
        return{[objeto]: items[0].id,[objeto + 'EMail']: items[0].secondaryText}
    }
    
    //Funcion que asocia al usuario de seguridad  que se colocan en el campo PeoplePicker.
    public _getPeoplePickerSeguridad(items: any[]) {
        let PersonasSeguridad = []
        let PersonaSeguridadEmail = []

        for (let item in items) {
            PersonasSeguridad.push(items[item].id)    
            PersonaSeguridadEmail.push(items[item].secondaryText)
        }
    
        return {PersonaSeguridad: PersonasSeguridad,PersonaSeguridadEmail: PersonaSeguridadEmail,correosSeguridad: PersonaSeguridadEmail}
    }

    //Funcion que permite añadir a un array los demas aprobadores del area  
    public getPeoplePickerDemasAprobadores(items: any[], index:any, cDemasAprobadores: any) {
        
        cDemasAprobadores[index]['DemasAprobadores'] = items[0].id
        cDemasAprobadores[index]['DemasAprobadoresEmail'] = items[0].secondaryText
    
        return{cDemasAprobadores}
    }

    //Funcion que asigna datos desde el directorio activo usando el elemento people picker.
    public getPeoplePickerOtrosAprobadores(items: any[], index:any, rol:any, cAprobadores: any) {        
    
        cAprobadores[index]['AprobadoresConRol'] = items[0].id
        cAprobadores[index]['Cargo'] = rol
    
        return{cAprobadores}
    }

    // funcion para agregar linea a demas aprobadores
    public addDemasAprobadores(arg0: string, cDemasAprobadores: any){
        var c = []        

        c = cDemasAprobadores

        var pos = {
        p: 0,
        }

        c.push(pos)
        return {cDemasAprobadores: c}
    }

    //Funcion que permite añadir a un array los aprobadores del area
    public _getPeoplePickerG(items: any[], index:any, cAprobadoresArea:any) {
        cAprobadoresArea[index]['AprobadoresArea'] = items[0].id
        cAprobadoresArea[index]['AprobadoresAreaEmail'] = items[0].secondaryText
    
        return{cAprobadoresArea,}
    }

    //Funcion que permite añadir a un array los aprobadores
    public getAprobadoresArea(id:any, index:any, cAprobadoresArea: any, AprobadoresArea: any) {
         
    
        var items = AprobadoresArea.filter((x:{ID:any}) => x.ID == id)
    
        cAprobadoresArea[index]['AprobadoresArea'] = items[0].AprobadorId
        cAprobadoresArea[index]['AprobadoresAreaEmail'] = items[0].AprobadorEmail
        cAprobadoresArea[index]['AprobadoresNombreArea'] = items[0].NombreArea
        cAprobadoresArea[index]['AprobadoresNombreAreaId'] = items[0].ID
    
        return{cAprobadoresArea,}
    }

    //FUncion para filtrar los aprobadores de area
    public getAprobadoresPorArea(Direccion:any, Index:any, AprobadoresArea: [], cAprobadoresArea: any) {
        var Areas = AprobadoresArea.filter(
        (x:{NombreDireccion:any}) => x.NombreDireccion == Direccion,
        )
        
        cAprobadoresArea[Index]['AprobadoresNombreDireccion'] = Direccion

        return {['AreasDireccion' + Index]: Areas, cAprobadoresArea,}
    }
}