import * as React from 'react';
import { PNP } from '../Util/util';
import { Link, withRouter } from 'react-router-dom';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import SVGIconComponent from '../Util/SVGIcon';

export interface IComentarDocumentosProps {
   Titulo: any;
   context: any;
   Subsitio: any;
   NombreSubsitio: any;
   match: any;
   urlSitioPrincipal: any;
   history: any;
   idMecanismo: any;
}

class ComentarDocumentos extends React.Component<IComentarDocumentosProps, any>{

   public pnp: PNP;
   public AproArea = false;
   public AproRoles = false;
   public Apro = false;

   constructor(props:any) {
      super(props)

      this.pnp = new PNP(this.props.context);

      this.state = {
         tipo: "",
         Mecanismo:[],
         Comentario:"",
         Aprobadores: [],
         urlSite: "",
         sitio: "",
         paises: [],
         urlSitePrincipal: "",
         sitioPrincipal: "",
         direcciones: [],
         areas: [],
         area: "",
         Cancelar:false,
         direccion: "",
         subAreas: [],
         subArea: "",
         modelos: [],
         pilares: [],
         pilar: "",
         drivers: [],
         driver: "",
         mecanismos: [],
         mecanismo: "",
         tiposMecanismos: [],
         tipoMecanismo: "",
         descripcionMecanismo: "",
         seguridad: "",
         PersonaSeguridad: "",
         Auditoria: false,
         plantas: [],
         AplicaPlanta: false,
         planta: "",
         ArchivosAnexos: [],
         Archivos: [],
         AdjuntarUrl: false,
         url: "",
         falta: false,
         areasTotal: [],
         PersonaAprueba: "",
         revisa: "",
         PersonaElabora: "",
         Area1: "", AprobadorArea1: "",
         Area2: "", AprobadorArea2: "",
         Area3: "", AprobadorArea3: "",
         Area4: "", AprobadorArea4: "",
         Auditor: "", JefeGh: "", GerenteGh: "", DirectorGh: "",
         DirectorArea: "", DirectorGeneral: "", LiderComiteInternacional: "", PresidenteEjecutivo: "",
         AprobadorExtra1: "", AprobadorExtra2: "", AprobadorExtra3: "", AprobadorExtra4: "",
         Motivo: "", Motivos: [], DescripcionMotivo: "",
         CompromisoDelCronograma: false, rolesAprobadores: [], cAprobadores: [], AprobadoresConRol: {},
         cAprobadoresArea: [], AprobadoresArea: {},
         cDemasAprobadores: [],
         posPaso: 0,
         Pasos: 'Datos del Mecanismo',
         Revisa: "", NombreConvertido: "",loading:false,botones:true,
         FaqSeguridad:"",FaqPlantaProduccion:"",correosSeguridad:[],
         plantasAplica:[],
        
         Plantas:[],dueñoContenido:"",gestores:[],CantidadCaracteres:0,nombreSubsitio:"",Lector:[]
      }
   }


    //Funcion que identifica la cnatidad de caracteres en un cadena de texto
    private longitudcadena(cantidad:any){
        const result=cantidad.length
        this.setState({CantidadCaracteres:result})
        console.log(result)
    }

    //Funcion que asocia al usuario de seguridad  que se colocan en el campo PeoplePicker.
    private _getPeoplePickerSeguridad(items: any[]) {
        this.setState({ PersonaSeguridad: items[0].id });   
    }

    //FUncion que convierte la primera letra en mayuscula
    private convertirPrimeraLetra() {
        if (this.state.nombreSubsitio) {
            let subSitio = this.state.nombreSubsitio;
            subSitio = subSitio[0].toUpperCase() + subSitio.substring(1);
            this.setState({
                NombreConvertido: subSitio
            })
        } else {
            console.log("No se encuentra Nombre")
        }
    }

    //Funcion que valida si se esta en un subsitio o sitio principal recibe como parametro las url del ocntexto
    public identificarSitio(url:any, urlPrincipal:any) {
        let sitioFormateado = url.split('/')
        this.setState({nombreSubsitio: sitioFormateado[sitioFormateado.length - 1],},()=>{
            this.convertirPrimeraLetra()
        })

    }

    //Funcion que guarda los documentos de en la biblioteca segun el modelo.
    private GuardarDocumentos() {
        this.pnp.createdFolder(
            this.state.mecanismo,
            "Biblioteca Colabora/Carpeta Revision"
        ).then(res => {
            var url = "https://qualasa.sharepoint.com" + res.data.ServerRelativeUrl
            this.state.Archivos.forEach((items:any) => {
            let enfile: File = items
            this.pnp.uploadFileFolder(
               enfile.name,
               enfile,
               this.state.mecanismo,
               "Biblioteca Colabora/Carpeta Revision"
            ).then(res => console.log(res))
        })
        
        this.InsertarDatos(url)
      })
    }

    //Funcion que guarda los comentarios de la solicitud
    private GuardarComentarios(){
        if(this.state.Comentario.length>0){
            let obj={               
                Comentario:this.state.Comentario,
                IdMecanismoId: this.props.match.params.IdMecanismo,
            }
      
            this.pnp.insertItem(
                "Comentarios",obj).then((items)=>{
                this.setState({Pasos:'success',loading:false})
            });
       
            this.setState({loading:true,botones:false})
        }else{
            this.setState({falta:true})
      }      
    }

    //Funcion que guarda el registro de los aprobadores asignados al mecanismo
    private GuardarAprobadores(IdRegistro:any) {
        const AprobadoresConRol = { ...this.state.AprobadoresConRol }
        const AprobadoresArea = { ...this.state.AprobadoresArea }
        const DemasAprobadores = { ...this.state.DemasAprobadores }
      
        this.state.cAprobadores.forEach((index:any, i:any) => {
            let obj = {
                AprobadorId: AprobadoresConRol["AprobadoresConRol" + i],
                Cargo: AprobadoresConRol["Cargo" + i],
                MecanismoId: IdRegistro
            }

            this.pnp.insertItem("Aprobadores",obj).then(items => {
                if (this.state.cAprobadores.length - 1 == i) {
                    console.log("Registrado con ese usuario " + AprobadoresConRol["AprobadoresConRol" + i])
                    this.AproRoles = true
                    this.finishSave()
                }                
            })
        })

        this.state.cAprobadoresArea.forEach((item:any, j:any) => {
            let obj1 = {
                AprobadorId: AprobadoresArea["AprobadoresArea" + j],
                Cargo: AprobadoresArea["Area" + j],
                MecanismoId: IdRegistro
            }

            this.pnp.insertItem("Aprobadores",obj1).then(items => {

                if (this.state.cAprobadoresArea.length - 1 == j) {
                    console.log("Registro con usuario de area " + AprobadoresArea["AprobadoresArea" + j])
                    this.AproArea = true
                    this.finishSave()
                }
            })
        })


        let k = 0

        this.state.cDemasAprobadores.forEach((index:any, k:any) => {
            let obj2 = {
                AprobadorId: DemasAprobadores["DemasAprobadores" + k],
                MecanismoId: IdRegistro
            }
            
            this.pnp.insertItem("Aprobadores",obj2).then(items => {

                if (this.state.cDemasAprobadores.length - 1 == k) {
                    console.log("Registro con usuario de area " + AprobadoresArea["AprobadoresArea" + k])
                    this.Apro = true
                    this.finishSave()
                }
            })

        })

        k = k + 1;
   }

    //Funcion que gidentifica cuando ya se realizo los proceso de guardado
    public finishSave() {
      if (this.AproRoles && this.Apro && this.AproArea) {
         this.setState({
            Pasos: 'success'
         })
      }
    }

    //Funcion que consulta los FAQ  para los formularios
    private ConsultarFaq(){
        this.pnp.getListItems(
            "Faq",
            ["*"],
            "",
            ""
        ).then((items)=>{
            var faqSeguridad = items.filter((x:{Clave:any}) => x.Clave == 'Seguridad')
            var faqPlantaProduccion=items.filter((x:{Clave:any}) => x.Clave == 'PlantaProduccion')
         
            if(faqSeguridad.length>0){
                this.setState({FaqSeguridad:faqSeguridad[0].Title})
            }
         
            if(faqPlantaProduccion.length>0){
                this.setState({FaqPlantaProduccion:faqPlantaProduccion[0].Title})

            }        
        })
    }

    //Funcion que actualiza los planes de accion de los documentos del mecanismo
    private ActualizarPlanAccion() {

        this.state.Archivos.forEach((items:any) => {
            let enfile: File = items.file
            var data = { Accion: items.Accion }

            this.pnp.updateFileFolder(
                items.file.Name,
                enfile,
                this.state.mecanismo,
                "Biblioteca Colabora/Carpeta Revision",
                data
            ).then(res => console.log(res))

        })
    }

    /*Funcion que consulta los distintos roles de la lista RolesAprobadores y devuelve un objeto con la informacion de esta.
    private consultarRoles() {
        this.pnp.getListItems(
            "RolesAprobadores",
            ["*"],
            "",
            ""
        ).then(res => {
            this.setState({rolesAprobadores: res})
      })
    }*/

    //Funcion que permite guardar los datos en el mecanismo Filial 
    private InsertarDatos(urlDocumento:any) {

        if (this.state.planta == "" && this.state.PersonaSeguridad == "") {
         let obj = {
            Title: this.state.mecanismo,
            NombreMecanismo: this.state.mecanismo,
            RequiereAuditoria: this.state.Auditoria,
            MecanismoDriver: this.state.driver,
            MecanismoAsociados: this.state.mecanismo,
            Seguridad: this.state.seguridad,
            NombreDriverId: this.state.driver,
            NombreDocumentSet: this.state.mecanismo,
            UrlDocumentSet: urlDocumento,
            Motivo: this.state.Motivo,
            DescripcionMotivo: this.state.DescripcionMotivo,
            ElaboraId: this.state.PersonaElabora,
            Revisa: this.state.Revisa,
            ApruebaId: this.state.PersonaAprueba


         }
         this.pnp.insertItem(
            "MecanismoFilial",
            obj
         ).then(items => { console.log("Registrado con exito"), this.GuardarAprobadores(items.Id) })

        } else if (this.state.planta == "" && this.state.PersonaSeguridad != "") {
            let obj = {
                Title: this.state.mecanismo,
                NombreMecanismo: this.state.mecanismo,
                RequiereAuditoria: this.state.Auditoria,
                MecanismoDriver: this.state.driver,
                MecanismoAsociados: this.state.mecanismo,
                Seguridad: this.state.seguridad,
                NombreDriverId: this.state.driver,
                NombreDocumentSet: this.state.mecanismo,
                PersonaSeguridadId: this.state.PersonaSeguridad,
                TipoMecanismo: this.state.tipoMecanismo,
                UrlDocumentSet: urlDocumento,
                Motivo: this.state.Motivo,
                DescripcionMotivo: this.state.DescripcionMotivo,
                ElaboraId: this.state.PersonaElabora,
                Revisa: this.state.Revisa,
                ApruebaId: this.state.PersonaAprueba
            }
        
            this.pnp.insertItem("MecanismoFilial",obj).then(items => {
                (items:any) => { console.log("Registrado con exito"), this.GuardarAprobadores(items.Id) }
            })

        } else if (this.state.planta != "" && this.state.PersonaSeguridad == "") {
            let obj = {
                Title: this.state.mecanismo,
                NombreMecanismo: this.state.mecanismo,
                RequiereAuditoria: this.state.Auditoria,
                MecanismoDriver: this.state.driver,
                MecanismoAsociados: this.state.mecanismo,
                Seguridad: this.state.seguridad,
                Planta: this.state.planta,
                NombreDriverId: this.state.driver,
                NombreDocumentSet: this.state.mecanismo,
                TipoMecanismo: this.state.tipoMecanismo,
                UrlDocumentSet: urlDocumento,
                Motivo: this.state.Motivo,
                DescripcionMotivo: this.state.DescripcionMotivo,
                ElaboraId: this.state.PersonaElabora,
                Revisa: this.state.Revisa,
                ApruebaId: this.state.PersonaAprueba,
        }
        
        this.pnp.insertItem("MecanismoFilial",obj).then(items => {
             console.log("Registrado con exito"), this.GuardarAprobadores(items.Id) 
        })
      } else {
         let obj = {
            Title: this.state.mecanismo,
            NombreMecanismo: this.state.mecanismo,
            RequiereAuditoria: this.state.Auditoria,
            MecanismoDriver: this.state.driver,
            MecanismoAsociados: this.state.mecanismo,
            Seguridad: this.state.seguridad,
            Planta: this.state.planta,
            NombreDriverId: this.state.driver,
            NombreDocumentSet: this.state.mecanismo,
            PersonaSeguridadId: this.state.PersonaSeguridad,
            TipoMecanismo: this.state.tipoMecanismo,
            UrlDocumentSet: urlDocumento,
            Motivo: this.state.Motivo,
            DescripcionMotivo: this.state.DescripcionMotivo,
            ElaboraId: this.state.PersonaElabora,
            Revisa: this.state.Revisa,
            ApruebaId: this.state.PersonaAprueba

         }

         this.pnp.insertItem("MecanismoFilial",obj
         ).then(items => { console.log("Registrado con exito"), this.GuardarAprobadores(items.Id) })
      }
    }

   //Funcion que consulta los motivos de la lista parametrosGenerales y devuelve un objeto con esta informacion.
   private consultarMotivos() {
      this.pnp.getListItemsRoot(
         "Motivos",
         ["*"],
         "",
         ""
      ).then(res => (
         this.setState({
            Motivos: res
         })
      ))
   }

   //Funcion que consulta las plantas y devuelve un objeto con la informacion de estas.
   private plantas() {
      this.pnp.getListItems(
         "Planta",
         ["*"],
         "",
         ""
      ).then((items => {

         this.setState({ plantas: items })
      }))

   }
   
   // Funion que consulta los paises desde el sitio principal y retorna un objeto con esta informacion.
   public paises() {
      this.pnp.getListItemsRoot(
         "Paises",
         ["Title"],
         "",
         ""
      ).then(res => (
         this.setState({
            paises: res

         })
      ))
   }
   

   //Funcion que consulta las areas por direcciones.
   public consultarAreas(nombreDireccion:any) {

      this.pnp.getListItemsRoot(
         "Area",
         ["*", "NombreDireccion/NombreDireccion"],
         "NombreDireccion/NombreDireccion eq '" + nombreDireccion + "'",
         "NombreDireccion"


      ).then(res => {

         console.log(res)

         this.setState({
            areas: res

         })


      })

   }

   //Funcion que consulta los driver de cada pilar recibe como parametro el id del pilar al que se le va consultar.
   private consultarDriver(IdPilar:any) {
      this.pnp.getListItems(
         "DriverFilial",
         ["*", "Pilar/ID"],
         "Pilar/ID eq " + IdPilar,
         "Pilar"

      ).then(res => (
         console.log("Info drivers"),
         console.log(res),
         this.setState({
            drivers: res

         })
      ))

   }
   
   //Funcion que consulta las subareas recibe como parametro el nombre del area.
   public consultarSubarea(nombreArea:any) {
      this.pnp.getListItemsRoot(
         "SubArea",
         ["*", "NombreArea/NombreArea"],
         "NombreArea/NombreArea eq '" + nombreArea + "'",
         "NombreArea"
      ).then(res => {

         this.setState({
            subAreas: res

         })
      })
   }

   //Funcion que consulta los pilares filtrando por el nombre del modelo recibe como parametro el nombre del modelo.
   public ConsultarPilares(NombreModelo:any) {
      this.pnp.getListItems(
         "PilaresFilial",
         ["*", "NombreModelo/Title"],
         "NombreModelo/Title eq '" + NombreModelo + "'",
         "NombreModelo"
      ).then(res => {

         if (res.length > 0) {
            this.setState({
               pilares: res,


            })

         }

      })


   }

   // Funcion que consulta los modelos recibe como parametro el nombre del area o direccion o sub area al cual consultar.
   public ConsultarModelos(NombreCorrespondencia:any) {

      var filter = NombreCorrespondencia.trim();

      this.pnp.getListItems(
         "BibliotecaModelos",
         ["*"],
         "Correspondencia eq '" + filter + "'",
         ""
      ).then(res => {

         if (res.length > 0) {

            this.setState({
               modelos: res,
               pilares: []

            }, () => {
               this.ConsultarPilares(res[0].Title)
            })
         }



      })
   }

   // Funcion que consulta el mecanismo dependiento su ID
   private consultarMecanismo(){

      let idMecanismo = this.props.match.params.IdMecanismo || this.props.idMecanismo;


      this.pnp.consultarMecanismosById(idMecanismo).then(res=>{
         var item = res[0]         
         this.setState({
            Mecanismo:res,
            SeccionMecanismo: item.Mecanismo_x0020_del_x0020_Driver.Label,
            seguridad:item.Seguridad,
            plantas:item.Planta,
            //plantasAplica: item.Planta != null ? item.Planta.split(';') : [],
            AplicaPlanta: (item.Planta ? true : false),
            Auditoria:item.Requiere_x0020_Auditoria,
            dueñoContenido:item.Elabora
         },()=>{
            this.pnp.getByIdUser(item.ElaboraId).then((user)=>{
               this.setState({
                  dueñoContenido:user.Title
               })
            })
            if(item.Seguridad=="Confidencial"){
               var i=0
               var ArrayAuxSeguridad:any=[]
               item.PersonaSeguridadId.forEach((val:any,index:any)=>{
                               
                 this.pnp.getByIdUser(val)
                 .then((user)=>{
                    ArrayAuxSeguridad.push(user.Email)
                    var leng=item.PersonaSeguridadId.length-1
                  
                    if(leng == i){
                      
                       console.log(ArrayAuxSeguridad)
                       this.setState({
                          correosSeguridad : []
                       },()=>{
                          this.setState({
                             correosSeguridad : ArrayAuxSeguridad,StatePrueba:ArrayAuxSeguridad.join(';')
                          })
       
                       })                     
                    }
                    i++                            
                 })
              })
            }
         })
      })
   }

    //Funcion para cerrar modales
    private closeModal() {
      this.setState({
        Cancelar: false
      })
    }

    //Funcion para dirigir al home sin recargar la pagina
    private redirect() {
      this.props.history.push('/');
    }

   //funcion que ayuda a revisar los cambios en los estados de los elementos html.
   public inputChange(target:any) {

      var pasos = this.state.Pasos;
      var value = target.value;
      var name = target.name;


      if (name == "direccion") {

         this.consultarAreas(value)
         this.ConsultarModelos(value)

      } else if (name == "area") {
         this.consultarSubarea(value)
         this.ConsultarModelos(value)

      } else if (name == " subArea") {
         this.ConsultarModelos(value)

      }
      else if (name == "pilar") {

         this.consultarDriver(value)

      }
      else if (name == "driver") {
          this.consultarMecanismo()
      }
      else if (name == "continuar") {



         if (pasos == 'Datos del Mecanismo') {

            if (this.state.direccion == "" || this.state.area == "" || this.state.pilar == "" || this.state.driver == "" || this.state.mecanismo == "" || this.state.TipoMecanismo == "" || this.state.descripcionMecanismo == "" || this.state.seguridad == "" || this.state.Archivos.length < 0) {
               this.setState({
                  falta: true
               })
            } else if (this.state.seguridad == "Confidencial" && this.state.PersonaSeguridad == "") {
               this.setState({
                  falta: true
               })
            } else {

               if (this.props.match.params.opcion == 3) {
                  this.ActualizarPlanAccion();
               } else if (this.props.match.params.opcion == 2) {
                  this.BorrarArchivos();
               } else {
                  this.GuardarDocumentos();
                  //this.InsertarDatos()
               }

            }

         }
      } else
         if (name == "mecanismo") {
            this.ObtenerArchivos(value)
         }




      this.setState({
         [name]: value
      })

   }

   // Funcion para borrar archivos del mecanismo
   public BorrarArchivos() {

      this.pnp.deleteFilesByPath(
         this.state.documentosMecanismo,
         this.state.mecanismo,
         'Biblioteca Colabora/Carpeta Revision'
      ).then(res => {

         this.AproRoles = true;
         this.Apro = true;
         this.AproArea = true;

         this.finishSave();

         this.setState({
            borrardocumentosMecanismo: res
         })

      })

   }

   // Funcion para consultar los archivos del mecanismo 
   public ObtenerArchivos(NombreMecanismo:any) {

      this.pnp.getFiles(
         "Biblioteca Colabora/Carpeta Revision/" + NombreMecanismo,
      ).then(res => (

         console.log(res),
         this.setState({
            documentosMecanismo: res
         })
      ))

   }

   public componentWillMount(): void {
    
      this.pnp.getCurrentUser().then(user => {

            this.setState({
               UserId: user.Id,
               UserName: user.Title
            }, () => { this.getGroups(user.Id) });

      });

      this.ConsultarFaq()
      this.convertirPrimeraLetra()
      this.consultarMecanismo()

      //this.consultarRoles()

      this.plantas()
      this.consultarMotivos()

      console.log(this.props.Subsitio)
      
      this.paises()      

      this.pnp.getAllUserGroupName("Aprobadores")
        .then(res => {
            this.setState({
                rolesAprobadores: res
            })

         })

   }

    //Funcion que identifica los grupos a los que pertenece el usuario
     private getGroups(Id:any) {

      if (this.props.NombreSubsitio) {
         const prueba = this.props.NombreSubsitio;
         const prueba2 = prueba[0].toUpperCase() + prueba.substring(1);
         this.setState({
            NombreConvertido: prueba2
         },()=>{

            var nombreGrupo = "Gestores_"+prueba2;
            
               this.pnp.getUserInGroup(nombreGrupo, Id)
               .then(resUser => {
                  console.log(resUser);
               })

         this.pnp.getGroupsByUserId(Id)
               .then(resGroups => {
                  console.log(resGroups);
                  var gesto = resGroups.filter((x:{LoginName:any}) => x.LoginName == "Gestores_"+prueba2)
                  var lecto = resGroups.filter((y:{LoginName:any})=>y.LoginName== "Lector_todo_Corporativo")

                  console.log('gesto')
                  console.log(gesto)

                  this.setState({
                     gestores: gesto,Lector:lecto
                  })

               })


         })


      } else {
         console.log("No se encuentra Nombre")
      }


    }


   public render(): React.ReactElement<IComentarDocumentosProps> {
      return (
         <div>
         {this.state.gestores.length > 0 || this.state.Lector.length>0 ?
            <div>
               {this.state.Cancelar ? (
                  <div className="modal-container overflow-auto">
                     <div className="modal-window" id="crearContenido">
                        <div>
                        <div id="EncabezadoModal">
                           <h3 id="tituloCancelar">
                              ¿Estas seguro que deseas cancelar la solicitud?
                           </h3>
                           <br />

                           <div className="row">
                              <div className="col">
                              <input
                                 type="button"
                                 id="bton"
                                 value="Si"
                                 className="btn btn-danger"
                                 onClick={() => (this.redirect())}

                              />
                              </div>
                              <div className="col">
                              <input
                                 type="button"
                                 value="No"
                                 className="btn btn-primary"
                                 onClick={() => this.closeModal()}
                              />
                              </div>
                           </div>
                        </div>
                        </div>
                     </div>
                  </div>
               ) : null}

            {this.state.loading ?
               <div className="contentModal">

                  <div className="modalLoading">
                        Trabajando en ello...
                  </div>

               </div> 
            :null}
            
            <div className="toolbar py-5 py-lg-7" id="kt_toolbar">
               <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
                  <div className="page-title d-flex flex-column me-3">
                     <h1 className="d-flex text-dark fw-bolder my-1 fs-2">
                        Comentar Mecanismo
                     </h1>
                     <ul className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">
                        <li className="breadcrumb-item text-gray-600">
                           <Link to={"/"}>
                              <a  className="text-gray-600 text-hover-primary">Inicio</a>
                           </Link>
                           
                        </li>
                        <li className="breadcrumb-item text-gray-600">
                           Formulario de Solicitud
                        </li>
                     </ul>
                  </div>
                  {/* <div className="d-flex align-items-center py-1">
                     <div className="d-flex my-4 me-3">
                        <a href="#" className="btn btn-sm btn-outline btn-outline-primary btn-active-primary">Mapa de
                           Mecanismos</a>
                     </div>
                     <div className="d-flex my-4 me-3">
                        <a href="#" className="btn btn-sm btn-primary btn-default">Gestionar Modelo de �rea</a>
                     </div>
                  </div> */}
               </div>
            </div>
            {/* Body */}
            <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
               <div className="content flex-row-fluid" id="kt_content">
                  <div className="card">
                     <div className="card-body">
                        <div className="stepper stepper-pills first" id="kt_stepper_example_clickable" data-kt-stepper="true">
                           <form className="form mx-auto" id="kt_stepper_example_basic_form">
                              <div className="mb-5">
                                 {/* Pantalla 1 del formulario */}
                                 {this.state.Pasos == 'Datos del Mecanismo' ?
                                    <div className="flex-column current" >
                                       <div className="row mb-5">
                                          <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                             <h3 className="text-primary">Datos del Mecanismo</h3>
                                          </div>
                                          {this.props.Subsitio  ?
                                                <div className="col-lg-3 col-md-6 col-xl-3 col-xxl-4 contenform">
                                                   <label className="form-label">País</label>
                                                   <select title='.' className="form-select select2-hidden-accessible"  placeholder="" value={this.state.NombreConvertido} disabled>                                                      
                                                      {
                                                         this.state.paises.map((e:any) => (
                                                            <option>{e.Title}</option>
                                                         ))
                                                      }
                                                   </select>
                                                </div>
                                                :
                                                <div className="col-lg-6 col-md-6 col-xl-3 col-xxl-4 contenform">
                                                   <label className="form-label">País</label>
                                                   <input title='.' type="text" className="form-control" name="input2" placeholder="" value={this.state.NombreConvertido} disabled />
                                                </div>
                                          }

                                          <div className="col-lg-6 col-md-6 col-xl-3 col-xxl-4">
                                             <label className="form-label">Dirección</label>                                           
                                             {this.state.Mecanismo && this.state.Mecanismo.length > 0 ?
                                                
                                                

                                                this.state.Mecanismo.map((e:any)=>(
                                                   <input title='.' type="text" className="form-control" name="input3" value={e.Direccion.Label} disabled />
                                                )) 

                                                : <input title='.' type="text" className="form-control" name="input3" value="" disabled />
                                             }

                                          </div>
                                          <div className="col-lg-3 col-md-6 col-xl-3 col-xxl-4 contenform">
                                             <label className="form-label">Área</label>
                                             {
                                                this.state.Mecanismo && this.state.Mecanismo.length > 0 ?
                                                   
                                                this.state.Mecanismo.map((e:any)=>(
                                                   <input title='.' type="text" className="form-control" name="input4" value={e.Area.Label} disabled />
                                                )) 
                                                
                                                : <input title='.' type="text" className="form-control" name="input4" value="" disabled />
                                             }

                                          </div>
                                          <div className="col-lg-3 col-md-6 col-xl-3 col-xxl-4">
                                             <label className="form-label">Sub Área</label>
                                             {
                                                this.state.Mecanismo && this.state.Mecanismo.length > 0 ?
                                                   
                                                this.state.Mecanismo.map((e:any)=>(
                                                   <input title='.' type="text" className="form-control" name="input5" value={e.Sub_x0020_Area.Label} disabled />
                                                ))

                                                : <input title='.' type="text" className="form-control" name="input5" value="" disabled />
                                             }

                                          </div>

                                          <div className="col-lg-3 col-md-6 col-xl-3 col-xxl-4 contenform">
                                             <label className="form-label">Pilar</label>
                                             {
                                                this.state.Mecanismo && this.state.Mecanismo.length > 0 ?

                                                this.state.Mecanismo.map((e:any)=>(
                                                   <input title='.' type="text" className="form-control" name="input2" value={e.Nombre_x0020_Pilar} disabled />
                                                ))

                                                : <input title='.' type="text" className="form-control" name="input5" value="" disabled />
                                             }

                                          </div>
                                          <div className="col-lg-3 col-md-6 col-xl-3 col-xxl-4">
                                             <label className="form-label">Driver</label>
                                             {
                                                this.state.Mecanismo && this.state.Mecanismo.length > 0 ?

                                                this.state.Mecanismo.map((e:any)=>(
                                                   <input title='.' type="text" className="form-control" name="input6" value={e.Nombre_x0020_Driver} disabled />
                                                ))

                                                : <input title='.' type="text" className="form-control" name="input6" value="" disabled />                                                  
                                             }

                                          </div>
                                          <div className="col-lg-3 col-md-6 col-xl-3 col-xxl-4 contenform">
                                             <label className="form-label">Nombre del Mecanismo</label>
                                             {
                                                this.state.Mecanismo && this.state.Mecanismo.length > 0 ?

                                                this.state.Mecanismo.map((e:any)=>(
                                                   <input title='.' type="text" className="form-control" name="input7" value={e.Nombre_x0020_Mecanismo_x0020_Loc} disabled />
                                                ))
                                                
                                                : <input title='.' type="text" className="form-control" name="input7" value="" disabled />  
                                             }

                                          </div>
                                          <div className="col-lg-3 col-md-6 col-xl-3 col-xxl-4">
                                             <label className="form-label">Tipo de Mecanismo</label>

                                             {
                                                this.state.Mecanismo && this.state.Mecanismo.length > 0 ?

                                                this.state.Mecanismo.map((e:any)=>(
                                                   <input title='.' type="text" className="form-control" name="input8" value={e.Tipo_x0020_de_x0020_Mecanismo} disabled />
                                                ))

                                                : <input title='.' type="text" className="form-control" name="input8" value="" disabled />  
                                             }

                                          </div>
                                       </div>
                                       <div className='contenform-cd'>
                                       <div className="mb-5">
                                 
                                          <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom" id='padleft'>
                                             <div className="d-flex">
                                                <span className="form-check">
                                                   <input title='.' 
                                                      className="form-check-input" 
                                                      type="radio" 
                                                      checked={this.state.SeccionMecanismo === "Mecanismos del driver"}
                                                      name="mecanismo" 
                                                      value="Mecanismo del Driver"
                                                      disabled
                                                      onChange={(e) => { this.setState({ descripcionMecanismo: e.target.value }) }} />
                                                </span>
                                                <label className="form-check-label pe-10 fs-5" htmlFor="flexRadioDefault" id='fs-30'>
                                                   Mecanismo del Driver
                                                </label>
                                                <span className="form-check">
                                                   <input title='.'
                                                      disabled
                                                      className="form-check-input" 
                                                      type="radio" name="mecanismo" 
                                                      value="Otro Mecanismo Operacional" 
                                                      checked={this.state.SeccionMecanismo === "Otros mecanismos Operacionales"}
                                                      onChange={(e) => { this.setState({ descripcionMecanismo: e.target.value }) }} />
                                                </span>
                                                <label className="form-check-label pe-10 fs-5 contentform-cde" htmlFor="flexRadioDefault" id='fs-30'>
                                                   Otro Mecanismo Operacional
                                                </label>
                                             </div>
                                          </div>
                                       
                                       <div className="row mb-5">
                                    
                                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">

                                             <label className="form-check form-switch form-check-custom">

                                                <span className="form-label" id="labelSeguridad fs-30">Seguridad</span>
                                                   <span className="FAQ">
                                                      <SVGIconComponent iconType='M8' />                                                     
                                                      <span className="modalFAQ">
                                                         {this.state.FaqSeguridad}
                                                      </span>
                                                   </span>
                                             </label>
                                             <br/>
                                             <div className="d-flex">
                                                <span className="form-check">
                                                   <input title='.'
                                                   disabled
                                                      className="form-check-input" 
                                                      type="radio" 
                                                      name="seguridad" 
                                                      value="Publico"
                                                      checked={this.state.seguridad === "P�blico"}
                                                      onChange={(e) => { this.setState({ seguridad: e.target.value }) }} />
                                                </span>
                                                <label className="form-check-label pe-10" htmlFor="flexRadioDefault" id='fs-30'>
                                                   Publico
                                                </label>
                                                <span className="form-check">
                                                   <input title='.' 
                                                      disabled
                                                      className="form-check-input" 
                                                      type="radio" 
                                                      name="seguridad" 
                                                      value="Privado" 
                                                      checked={this.state.seguridad === "Privado"}
                                                      onChange={(e) => { this.setState({ seguridad: e.target.value }) }} />
                                                </span>
                                                <label className="form-check-label pe-10" htmlFor="flexRadioDefault" id='fs-30'>
                                                   Privado
                                                </label>
                                                <span className="form-check">
                                                   <input title='.'
                                                      disabled
                                                      className="form-check-input" 
                                                      type="radio" 
                                                      name="seguridad" 
                                                      value="Confidencial" 
                                                      checked={this.state.seguridad === "Confidencial"}
                                                      onChange={(e) => { this.setState({ seguridad: e.target.value }) }} />
                                                </span>
                                                <label className="form-check-label pe-10" htmlFor="flexRadioDefault" id='fs-30'>
                                                   Confidencial
                                                </label>
                                             </div>
                                          </div>

                                          {this.state.seguridad == "Confidencial" ?
                                             <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                                <label className="form-label  required">Asignado a:</label>
                                                <PeoplePicker
                                                disabled
                                                   context={this.props.context}
                                                   titleText=""
                                                   personSelectionLimit={1}
                                                   groupName={""}
                                                   showtooltip={true}
                                                   required={true}
                                             
                                                   onChange={this._getPeoplePickerSeguridad}
                                                   showHiddenInUI={false}
                                                   ensureUser={true}
                                                   principalTypes={[PrincipalType.User]}
                                                   resolveDelay={1000}
                                                   defaultSelectedUsers={this.state.correosSeguridad ? this.state.correosSeguridad : ''}
                                                />
                                             </div>
                                             : null
                                          }
                                          
                                       </div>
                                       <div className="row mb-5">
                                          <div className="mt-4">
                                             <label className="form-check form-switch form-check-custom">

                                                <input
                                                   disabled
                                                   className="form-check-input" 
                                                   type="checkbox" 
                                                   value="1"
                                                   checked={this.state.Auditoria}
                                                   onChange={(e) => { this.setState({ Auditoria: !this.state.Auditoria }) }} />
                                                <span className="form-check-label mx-15" id='fs-30'>
                                                   Requiere revisión de auditoría
                                                </span>

                                             </label>
                                          </div>
                                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 mt-4">
                                             <label className="form-check form-switch form-check-custom">
                  
                                                <input
                                                disabled
                                                   className="form-check-input" 
                                                   type="checkbox" 
                                                   checked={this.state.AplicaPlanta}
                                                   value="2" 
                                                   onChange={(e) => { this.setState({ AplicaPlanta: !this.state.AplicaPlanta }) }} />

                                                <span className="form-check-label mx-15" id='fs-30'>
                                                   Aplica a planta de producción
                                                </span>

                                                <span className="FAQ">
                                                      <SVGIconComponent iconType='M8' />                                                     
                                                      <span className="modalFAQ">
                                                         {this.state.FaqPlantaProduccion}
                                                      </span>
                                                </span>
                                             </label>
                                             
                                          </div>
                                         
                                             <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                                <label className="form-label">Plantas</label>                                        
                                                <table>
                                                   {this.state.plantasAplica && this.state.plantasAplica.map((p:any, i:any)=>(
                                                      <tr>
                                                         <td>- {p}</td>
                                                      
                                                      </tr>
                                                   ))}
                                                </table>
                                            </div>                                    
                                          </div>
                                       </div>
                                       </div>
                              
                                       <div className="separator mt-10 mb-4"></div>
                                       <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                          <h3 className="text-primary">Comentarios</h3>
                                       </div>
                                          <div>
                                                <textarea
                                                value={this.state.Comentario}
                                                onChange={(e)=>{this.longitudcadena(e.target.value),this.setState({Comentario:e.target.value})}}
                                           
                                                   className="form-control"
                                                   name="input2"
                                                   placeholder="Ingrese el comentario"


                                                   
                                                   maxLength={140} ></textarea>    
                                                
                                          </div>

                                          <p id="Contador">{this.state.CantidadCaracteres}/140</p>
                                          <br />
                                          
                                          <div className="row mt-5">
                                                <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                                   <div className="alert alert-warning d-flex align-items-center p-5">
                                                      <SVGIconComponent iconType='M7' />                                                     
                                                      <span className="svg-icon svg-icon-2hx svg-icon-warning me-4">
                                                            <i className="fa fa-exclamation-triangle fs-4 text-warning"></i>
                                                      </span>                                                        
                                                      <div className="d-flex flex-column">
                                                            <span>Este comentario será enviado al due+ño del documento.</span>
                                                      </div>
                                                   </div>
                                                </div>
                                          </div>                                    
                                       {
                                          this.state.falta == true ?
                                          <div className="row mt-5">
                                          <  div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                             <div className="alert alert-danger d-flex align-items-center p-5">
                                                <SVGIconComponent iconType='M8' />                                               
                                                <span className="svg-icon svg-icon-2hx svg-icon-warning me-4">
                                                      <i className="fa fa-exclamation-triangle fs-4 text-warning"></i>
                                                </span>                                                        
                                                <div className="d-flex flex-column">
                                                      <span>Este comentario será enviado al dueño del documento.</span>
                                                </div>
                                             </div>
                                          </div>
                                 </div>
                                 :null
                                       }
                                    </div>
                                    : null}

                                 {/* Pantalla 2 del formulario */}
                                 {this.state.Pasos == 'success' ?
                                    <div className="flex-column centerContent current" >
                                       <div className="row mb-5">
                                          <div className="card-title flex-column p-4 mb-5">
                                             <h2 className="text-primary fs-1">
                                                Solicitud enviada con �xito
                                             </h2>
                                          
                                          </div>
                                          <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                             <figure>
                                                <img title='.' id="imagenfinal" src={this.props.urlSitioPrincipal + "/Style%20Library/Root/Quala_Logo_Home.png"} width="35%" height="auto" />
                                             </figure>
                                             <span className="text-gray-600 fs-5">Su comentario ha sido enviado exitosamente a {this.state.dueñoContenido} dueño de contenido.</span>
                                          </div>
                                       </div>

                                    </div>
                                    : null}


                              </div>
                           </form>
                           <div className="d-flex flex-stack">
                              <div className="me-2">
                              </div>

                              {/* Boton Cancelar */}
                              <div>
                                 {this.state.botones  ?
                                    <div>
                                       <button type="button" onClick={() => this.setState({ Cancelar: true })} className="btn btn-cancelar">
                                       Cancelar 
                                       </button>

                                       {/* Boton Enviar */}
                                       <button 
                                          name="continuar" 
                                          type="button" 
                                          className="btn btn-primary" 
                                          onClick={(e) => { this.GuardarComentarios() }} >
                                          <span className="indicator-label"> Enviar
                                             <SVGIconComponent iconType='M4' />                                             
                                          </span>
                                          <span className="indicator-progress">
                                             Espere por favor...
                                             <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                          </span>
                                       </button>

                                    </div>

                                    
                                    :null
                                 }

                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            </div>                                    
            
            :null
         }

         </div>


      )
   }


}

export default withRouter(ComentarDocumentos)