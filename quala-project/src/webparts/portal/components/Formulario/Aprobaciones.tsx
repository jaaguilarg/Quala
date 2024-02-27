import * as React from 'react';
import { PNP } from '../../components/Util/util';
import { withRouter } from 'react-router-dom';
import "@pnp/sp/taxonomy";
import * as _ from "underscore";
import 'react-quill/dist/quill.snow.css';
import Componentes from '../Formulario/Componentes';
import { IoIosArrowForward } from "react-icons/io/";
import { GrClose } from "react-icons/Gr/";
// import { connect } from 'react-redux';


export interface IAprobacionesProps {
   Titulo: any;
   context: any;
   Subsitio: any;
   NombreSubsitio: any;
   Webpartcontext: any;
   match: any;
   urlSitioPrincipal: any;
   currentUser: any;
   Direcciones: any;
   Areas: any;
   SubAreas: any;
   history: any;
   Aprobaciones: any;
   IdMecanismo: any;
   mostrarModalExitoso: any;
   IdSolicitud: any;
   mostrarModal: any;
   NombreMecanismo: any;
   Sigla: string;
   accion: any;

}

class Aprobaciones extends React.Component<IAprobacionesProps, any>{

   public pnp: PNP;
   public AproArea = false;
   public AproRoles = false;
   public Apro = false;
   public estadoTablaModelo = false

   constructor(props: any) {
      super(props)

      this.pnp = new PNP(this.props.Webpartcontext);

      var pasos: any = [
         // {Title: 'Modulo de aprobaciones'},
         // {Title: 'Documentos del Mecanismo'},
         // {Title: 'Aprobadores'},
         // {Title: 'Control de Cambios'},
         // {Title:'Plan de accin de los contenidos'}
      ]

      this.state = {
         IdSolicitud: 0,
         sortOrder: "asc",

         tipo: "",
         seccionesOk: false,
         Aprobadores: [],
         urlSite: "",
         sitio: "",
         paises: [],
         urlSitePrincipal: "",
         sitioPrincipal: "",
         direcciones: this.props.Direcciones,
         areasTotal: this.props.Areas,
         areas: [],
         area: "",
         direccion: "",
         subAreasTotal: this.props.SubAreas,
         subAreas: [],
         subArea: "",
         modelos: [],
         pilares: [],
         estadoAcordeon: 0,
         pilar: "",
         drivers: [],
         driver: "",
         mecanismos: [],
         mecanismo: "",
         tiposMecanismos: [],
         tipoMecanismo: "",
         descripcionMecanismo: "",
         seguridad: "",
         PersonaSeguridad: [],
         dataRevision: [],
         dataAjustes: [],
         Auditoria: false,
         plantas: [],
         AplicaPlanta: false,
         planta: "",
         plantasAplica: [],
         ArchivosAnexos: [],
         Archivos: [],
         AdjuntarUrl: false,
         url: "",
         falta: false,
         PersonaAprueba: '',
         revisa: "",
         PersonaElabora: 0,
         PersonaElaboraEMail: "",
         Area1: "", AprobadorArea1: "",
         Area2: "", AprobadorArea2: "",
         Area3: "", AprobadorArea3: "",
         Area4: "", AprobadorArea4: "",
         Auditor: "", JefeGh: "", GerenteGh: "", DirectorGh: "",
         DirectorArea: "", DirectorGeneral: "", LiderComiteInternacional: "", PresidenteEjecutivo: "",
         AprobadorExtra1: "", AprobadorExtra2: "", AprobadorExtra3: "", AprobadorExtra4: "",
         Motivo: "", Motivos: [], DescripcionMotivo: "",
         CompromisoDelCronograma: false, rolesAprobadores: [], cAprobadores: [], AprobadoresConRol: [],
         cAprobadoresArea: [], AprobadoresArea: [],
         cDemasAprobadores: [],
         secciones: pasos,
         posPaso: 0,
         Pasos: 'Datos del Mecanismo',
         Revisa: "", NombreConvertido: "",
         failedDoc: false,
         allDelete: false,
         enviado: false,
         Cancelar: false,
         Faq: [],
         DatosMecanismo: [],
         disabled: '',
         PersonasAprobadoras: [],
         disabledGerente: false,
         FaqSeguridad: "",
         TituloGestionar:"",
         TituloRevision:"",
         FaqPlantaProduccion: "",
         faqCronograma: "",
         loading: false,
         dataMecanismo: {},
         cargando: false,
         ValorDocumentos: [],
         correosSeguridad: [],
         StatePrueba: "",
         faqCompromiso: "",
         faqAprobadores: "",
         faqDocumentosMecanismo: "",
         msjFinal: "",
         linkFinal: "",
         NombreMecanismo: 0,
         mecanismosBase: [],
         MecanismoNombre: "",
         dataPublicacion: [],
         gestores: [],
         FlujosDeTrabajo: [], DiaActual: "", FechaFinal: "", AprobadoresAreatotal: [],
         estadoTablaModelo: false,
         modal: false,
         dataAprobacion: [],
         MecanismosAprobacion: [],
         IdMecanismo: 0,
         Correo: "", modalAjustes: false, IdMecanismo1: 0, IsAprobador: false, IsPublicador: true, IsGestor: false, IsTotal: true, IsAprobaciones: true,
         Ispublicado: true,
         matrizPublicacion: [],
         consultarAprobador: [],
         estadoModal: false,
         IdMecanismoModal: 0,
         boton: "",
         Aprobador: false, Gestor: false, Publicador: false, Revisor: false, Editar: false,
         countDataPublicacion: 0, Componentes: false,
         dataAprobacionL:[],
         }
      this.closeModal = this.closeModal.bind(this)
      this.openModalExitoso = this.openModalExitoso.bind(this)
      this.cambioEstadoAprobacion = this.cambioEstadoAprobacion.bind(this)
          
   }


   // Funcion que cambia el estado de la solicitud para la implementacion del modal
   cambioEstadoAprobacion(estado: string, Id: any, IdSolicitud: any, NombreMecanismo: any) {

      let obj: {} = {
         EstadoAprobacion: estado
      }
      this.pnp.updateByIdRoot(
         "Control Solicitudes",
         Id,
         obj
      ).then((items: any) => {
         this.mensajesModal(estado, IdSolicitud, NombreMecanismo)
      })
   }

   // public consultaRoles(){
    
   //    var paises = this.state.paises.filter(
   //      (x: { Sigla: any }) => x.Sigla == this.state.descripcionSitio.sitio 
   //    );
  
  
   //    this.setState({
   //      NombrePais:paises[0].Nombre_x0020_Pais
   //    })
  
  
   //    var btnMecanismo=this.state.parametros.filter((x:{Llave:any})=>x.Llave == "BotonMapadeMecanismos")
  
   //      this.state.usuario.paises.forEach((element:any)=>{
  
   //        if(element == paises[0].ID && this.state.usuario.gestor){
   //          this.setState({
  
   //            gestores: 1,
   //            BtnMapaMecanismo:btnMecanismo[0].Valor
  
   //          })
            
   //        }
  
   //      })
  
   //  }

   // Funcion para cerrar Modal
   closeModal() {
      this.setState({
         dataAprobacion: [],
         dataRevision: [],
         dataPublicacion: [],
         dataAjustes: [],
      },
         () => {
            if(this.state.boton == "Aprobar" || this.state.boton == "Rechazar" ){
               this.cambioEstadoAprobacion(this.state.estado, this.state.IdListaAprobadores, this.state.IdMecanismoModal, this.state.NombreMecanismo)
               
            }
            this.mensajesModal(this.state.estado, this.state.IdSolicitud, this.state.NombreMecanismo)
            this.consultarTodasSolicitudes(this.state.UserId)
            this.consultarRevisor(this.state.UserId)
            this.consultarPublicador (this.state.UserId)
            this.consultarDatosAprobacion(this.state.UserId)

         })
      this.setState({ mostrarModal: false })
   }

   // Funcion para abrir Modal
   openModalExitoso() {
      this.setState({ mostrarModalExitoso: true })

   }

   // funcion para consulta de apropadores por area
   private consultarAprobadoresArea() {
      /*
      var ViewXml = `<FieldRef Name="Direccion"/>
                     <FieldRef Name="Area"/>
                     <FieldRef Name="AprobadorArea"/>`

      this.pnp.getListItemsWithTaxo('', 'AprobadoresPorArea',
         ViewXml).then((items) => {

            var AprobadoresArea: any = [];

            items.forEach((d: any) => {

               if (d.AprobadorArea.length > 0) {
                  AprobadoresArea.push({
                     ID: d.ID,
                     NombreDireccion: d.Direccion.Label,
                     NombreArea: d.Area.Label,
                     Aprobador: d.AprobadorArea[0].title,
                     AprobadorId: d.AprobadorArea[0].id,
                     AprobadorEmail: d.AprobadorArea[0].email,
                  })
               }
            })

            this.setState({
               AprobadoresArea: AprobadoresArea,
            })

         });
         */
   }

   // funcion para consultar FAQ de la lista
   private ConsultarFaq() {
      this.pnp.getListItemsRoot(
         "Faq",
         ["*"],
         "",
         ""
      ).then((items) => {
         var faqSeguridad = items.filter((x: any) => x.Clave == 'Seguridad')
         var faqPlantaProduccion = items.filter((x: any) => x.Clave == 'PlantaProduccion')
         var faqCronograma = items.filter((x: any) => x.Clave == 'Cronograma')
         var faqCompromiso = items.filter((x: any) => x.Clave == 'CompromisoDelCronograma')
         var faqAprobadores = items.filter((x: any) => x.Clave == 'Aprobadores')
         var faqDocumentosActuales = items.filter((x: any) => x.Clave == 'SeccionControlDeCambios')

         if (faqAprobadores.length > 0) {
            this.setState({
               faqAprobadores: faqAprobadores[0].Title
            })

         }

         if (faqDocumentosActuales.length > 0) {
            this.setState({
               faqDocumentosMecanismo: faqDocumentosActuales[0].Title
            })

         }

         if (faqSeguridad.length > 0) {
            this.setState({
               FaqSeguridad: faqSeguridad[0].Title
            })

         }

         if (faqCompromiso.length > 0) {
            this.setState({
               faqCompromiso: faqCompromiso[0].Title
            })

         }



         if (faqPlantaProduccion.length > 0) {
            this.setState({
               FaqPlantaProduccion: faqPlantaProduccion[0].Title
            })

         }

         if (faqCronograma.length > 0) {
            this.setState({
               faqCronograma: faqCronograma[0].Title
            })

         }



      })
   }

   // funcion para consultar mecanismo
   private consultaMecanismoLocal() {
      this.pnp.getListItemsRoot(
         "Mecanismos Base",
         ["*"],
         "",
         ""

      ).then(items => {
         this.setState({
            mecanismosBase: items
         })

      })

   }

   // Funcion para actualizar acorden 
   private actualizarAcordeon(index: any) {
      this.setState({
         estadoAcordeon: index,
      })
   }
   // Funcion de guardado
   public finishSave() {
      this.setState({
         Pasos: 'success',
         enviado: true,
         loading: false
      })
   }
   // Funcion que consulta mensaje a mostrar 
   private consultarMensajeFinal() {
      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "",
         ""
      ).then((items) => {

         var msjFinal = items.filter((x: any) => x.Clave == 'MensajeDeExito')
         var linkFinal = items.filter((x: any) => x.Clave == 'LinkMensajeFinal')
         if (msjFinal.length > 0) {
            this.setState({
               msjFinal: msjFinal[0].Title
            })

         }

         if (linkFinal.length > 0) {
            this.setState({
               linkFinal: linkFinal[0].Title
            })

         }

      })

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

   //Funcion que consulta los driver de cada pilar recibe como parametro el id del pilar al que se le va consultar.
   private consultarDriver(IdPilar: any) {
      this.pnp.getListItems(
         "DriverFilial",
         ["*", "Pilar/ID"],
         "Pilar/ID eq " + IdPilar,
         "Pilar"
      ).then(res => (
         this.setState({
            drivers: res
         }, () => {
            if (this.state.dataMecanismo) {

               if (res.length > 0) {
                  this.setState({
                     driver: this.state.dataMecanismo.NombreDriverId
                  })

                  this.consultarMecanismo(this.state.dataMecanismo.NombreDriverId)
               }

            }
         })
      ))

   }
   //Funcion que consulta los tipos de mecanismo.
   public consultarTipoMecanismo() {

      this.pnp.getListItems(
         "Parametros Tecnicos",
         ["*"],
         "Clave eq 'Tipodemecanismo'",
         "",
         ""
      ).then(res => {

         if (res.length > 0) {
            this.setState({
               tiposMecanismos: res
            })
         }

      })

   }

   //Funcion que consulta los mecanismos segun el driver seleccionado.
   public consultarMecanismo(Driver: any) {

      this.pnp.getListItems(
         "MecanismoFilial",
         ["*", "NombreDriver/Id"],
         "NombreDriver/Id eq " + Driver,
         "NombreDriver"
      ).then(res => {

         if (res.length > 0) {
            this.setState({
               mecanismos: res
            }, () => {
               if (this.state.dataMecanismo) {

                  if (res.length > 0) {

                     console.log(res)

                     this.setState({

                        mecanismo: this.state.dataMecanismo.ID,
                        tipoMecanismo: this.state.dataMecanismo.TipoMecanismo,
                        seguridad: this.state.dataMecanismo.Seguridad,
                        descripcionMecanismo: this.state.dataMecanismo.SeccionMecanismo,
                        NombreMecanismo: 2,
                        Auditoria: this.state.dataMecanismo.RequiereAuditoria,
                        AplicaPlanta: (this.state.dataMecanismo.Planta ? true : false),
                        plantasAplica: this.state.dataMecanismo.Planta != null ? this.state.dataMecanismo.Planta.split(';') : [],
                        Url: this.state.dataMecanismo.Url,
                        AdjuntarUrl: this.state.dataMecanismo.Url != '' ? true : false


                     })

                  }

               }
            })
         }
      })
   }

   // Funcion para consultar la persona asignada a la seguridad
   public consultarPersonaSeguridad() {
      this.pnp.getListItems(
         "MecanismoFilial",
         ["*", ""],
         "ID eq 71",
         ""
      ).then(items => {
         console.log("Email aprobadores"),
            console.log(items)
      }
      )
   }

   //Funcion que consulta los pilares filtrando por el nombre del modelo recibe como parametro el nombre del modelo.
   public ConsultarPilares(NombreModelo: any) {

      this.pnp.getListItems(
         "PilaresFilial",
         ["*", "NombreModelo/NombreModelo"],
         "NombreModelo/NombreModelo eq '" + NombreModelo + "'",
         "NombreModelo"
      ).then(res => {

         if (res.length > 0) {
            this.setState({
               pilares: res
            }, () => {
               if (this.state.dataMecanismo) {

                  var pilar = res.filter((x: any) => x.Pilar == this.state.dataMecanismo.Pilar)

                  if (pilar.length > 0) {
                     this.setState({
                        pilar: pilar[0].ID
                     })

                     this.consultarDriver(pilar[0].ID)
                  }
               }
            })
         }
      })
   }

   // Funcion que consulta los modelos recibe como parametro el nombre del area o direccion o sub area al cual consultar.
   public ConsultarModelos(NombreCorrespondencia: any) {

      var filter = NombreCorrespondencia;

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
   // Funcion para consultar los roles de los usuarios
   private getGroups(Id: any) {

      if (this.props.NombreSubsitio) {
         const prueba = this.props.NombreSubsitio;
         const prueba2 = prueba[0].toUpperCase() + prueba.substring(1);
         this.setState({
            NombreConvertido: prueba2
         }, () => {

            var nombreGrupo = "Gestores_" + prueba2

            this.pnp.getUserInGroup(nombreGrupo, Id)
               .then(resUser => {
                  //console.log(resUser);
               })

            this.pnp.getGroupsByUserId(Id)
               .then(resGroups => {

                  var gesto = resGroups.filter((x: any) => x.LoginName == "Gestores_" + prueba2)

                  this.setState({
                     gestores: gesto,
                     VisorOk: this.props.match.params.Acceso + "/" + this.props.match.params.opcion
                  })

               })


         })


      } else {
         console.log("No se encuentra Nombre")
      }


   }

   public componentWillMount(): void {
      this.setState({
         estadoModal: true
      })
      this.ConsultarLlavesTitulos()
      this.ConsultarTituloRevision()
      this.ConsultarTituloPublicacion()
      this.ConsultarTituloAprobacion()
      this.consultarAprobadoresArea()
      this.ConsultarBotonVerMas()
      this.ConsultarBotonVerDocumentos()
      this.ConsultarBotonResponderAjustes()
      this.ConsultarBotonEnviarAPublicacion()
      this.ConsultarBotonCancelarsolicitud()
      this.ConsultarBotonAsignarMetadata()
      this.ConsultarBotonActivarAprobacin()
      this.ConsultarBotonEnviarAjustes()
      this.ConsultarBotonAprobar()
      this.ConsultarBotonRechazar()
      this.pnp.getCurrentUser().then(user => {
         this.setState({
            UserId: user.Id,
            UserName: user.Title
         }, () => { this.getGroups(user.Id) });
         this.consultarTodasSolicitudes(user.Id);
         this.consultarPublicador(user.Id);
         this.consultarRevisor(user.Id);
         this.consultarDatosAprobacion(user.Id)

      });      
      this.consultarMensajeFinal()
      this.consultaMecanismoLocal()
      this.ConsultarFaq()
   }

   // Funcion para consultar las solicitudes que estan en estado "En Publicacion"
   private consultarPublicador(Id: any) {
      let data: any = []
      let dataD: any = []
      let countData = 0;
      
      this.pnp.getListItemsRoot(
                     "Control Solicitudes",
                     ["*"],
                     "Estado_x0020_de_x0020_la_x0020_s eq 'En publicacion' ",
                     ""
                  ).then((items) => {
                     console.log(items)
                     data.push(items)

                     dataD = data.slice(0)
                     countData += items.length;
                     this.setState({
                        dataPublicacion: dataD[0],
                        countDataPublicacion: countData
                  
                  })
               })

               this.setState({
                  dataPublicacion: this.state.dataPublicacion,

               }, () => {
                  console.log("State data aprobacion")
                  console.log(this.state.dataPublicacion)
               })                           
   }
   
   // Funcion para consultar todas las solicitudes asignadas al usuario
   private consultarTodasSolicitudes(Id: any) {
      let arraySolicitudes: any = [];
      let enAjustes = "En ajustes";
      let countEnAjustes = 0;
      
      this.pnp.getListItemsRoot(
         "Control Solicitudes",
         ["*"],
         "(Estado_x0020_de_x0020_la_x0020_s eq 'En ajustes') and NombreId eq " + Id,
         ""
      ).then((items) => {
         console.log(items);
         if (items.length > 0) {
            items.forEach((solicitud: any, indice: any) => {
               if (solicitud.Estado_x0020_de_x0020_la_x0020_s === enAjustes) {
                  countEnAjustes++; // aumentar el contador si la solicitud est en ajustes
               }
               this.pnp.getByIdUser(solicitud.NombreId).then(elabora => {
                  items[indice].Nombre_x0020_Solicitante = elabora.Title
                  solicitud.Nombre_x0020_Solicitante = elabora.Title
                  arraySolicitudes.push(solicitud);

                  this.setState({
                     dataAjustes: [],
                     IdMecanismo: items[0].ID
                  },
                     () => {
                        this.setState({
                           dataAprobacion: arraySolicitudes,
                           IdMecanismo: items[0].ID,
                           enAjustes: enAjustes,
                           countEnAjustes: countEnAjustes,
                        })
                     })
               })
            });
         } else {
         }
      })
      
   }
   
   // Funcion para consultar las solicitudes que estan en estado "En Revision"
   private consultarRevisor(Id: any) {
      let arraySolicitudes: any = [];
      let enRevision = "En revision";
      let countEnRevision = 0;
      
      this.pnp.getListItemsRoot(
         "Control Solicitudes",
         ["*"],
         "(Estado_x0020_de_x0020_la_x0020_s eq 'En revision') and NombreId eq " + Id,
         ""
      ).then((items) => {
         if (items.length > 0) {
            items.forEach((solicitud: any, indice: any) => {
               if (solicitud.Estado_x0020_de_x0020_la_x0020_s === enRevision) {
                  countEnRevision++; // aumentar el contador si la solicitud est en Revision
               }
               this.pnp.getByIdUser(solicitud.NombreId)
                  .then(elabora => {
                     items[indice].Nombre_x0020_Solicitante = elabora.Title
                     solicitud.Nombre_x0020_Solicitante = elabora.Title
                     arraySolicitudes.push(solicitud);

                     this.setState({
                        dataRevision: [],
                        IdMecanismo: items[0].ID
                     },
                        () => {
                           this.setState({
                              dataRevision: arraySolicitudes,
                              IdMecanismo: items[0].ID,
                              enRevision: enRevision,
                              countEnRevision: countEnRevision,
                           })
                        })
                  })
            });
         } else {
            
         }
      })
      
   }
   
   // Funcion para consultar las solicitudes que estan en estado "En Aprobacion"
   private consultarDatosAprobacion(Id: any) {
      let arraySolicitudes: any = [];
      let enAprobacion = "En aprobacion";
      let countEnAprobacion = 0;

      this.pnp.getListItemsRoot(
         "Control Solicitudes",
         ["*"],
         "(Estado_x0020_de_x0020_la_x0020_s eq 'En aprobacion') and NombreId eq " + Id,
         ""
         ).then((items) => {
            if (items.length > 0) {
               items.forEach((solicitud: any, indice: any) => {
                  if (solicitud.Estado_x0020_de_x0020_la_x0020_s === enAprobacion) {
                     countEnAprobacion++; // aumentar el contador si la solicitud est en Aprobacion
                  }
                  this.pnp.getByIdUser(solicitud.NombreId)
                     .then(elabora => {
                        items[indice].Nombre_x0020_Solicitante = elabora.Title
                        solicitud.Nombre_x0020_Solicitante = elabora.Title
                        arraySolicitudes.push(solicitud);
   
                        this.setState({
                           dataRevision: [],
                           IdMecanismo: items[0].ID
                        },
                           () => {
                              this.setState({
                                 dataAprobacion: arraySolicitudes,
                                 IdMecanismo: items[0].ID,
                                 enAprobacion: enAprobacion,
                                 countEnAprobacion: countEnAprobacion,
                              })
                           })
                     })
               });
            } else {
               
            }
         })
      

   }
   
   // Funcion para la contruccion de los mensajes modal
   public mensajesModal(Estado: string, IdSolicitud: any, NombreMecanismo: any) {
      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq '" + Estado + "'",
         ""
      ).then((items: any) => {
         var msjModal = items[0].Title.replace('#', IdSolicitud)

         var msjModalFinal = msjModal.replace("$", NombreMecanismo)


         this.setState({
            MensajeModal: msjModalFinal,
            PieModal: items[0].PieModal
         }, () => {
            this.setState({ mostrarModalExitoso: true })
         })
      })
   }

   // Funcion para consultar llaves en los parametros tecnicos
   private ConsultarLlavesTitulos() {

      
         this.pnp.getListItemsRoot(
            "Parametros Tecnicos",
            ["*"],
            "Llave eq 'TituloModuloSolicitudes'",
            ""
          ).then((items) => {
             
             
            if (items.length > 0) {
              // Actualiza el estado con el valor obtenido
              this.setState({ TituloGestionar: items[0].Valor });
            } else {
              console.log("No se encontr la llave buscada.");
              this.setState({ TituloGestionar: '' }); // O puedes establecer un valor por defecto
            }
          }).catch((error) => {
            console.error("Error al consultar la lista:", error);
            this.setState({ TituloGestionar: '' }); // Manejo del estado en caso de error
           });      
           
    }

    private ConsultarTituloRevision(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'TituloMenuRevision'",
         ""
       ).then((items) => {
          
          
         if (items.length > 0) {
           // Actualiza el estado con el valor obtenido
           this.setState({ TituloRevision: items[0].Valor });
         } else {
           console.log("No se encontr la llave buscada.");
           this.setState({ TituloRevision: '' }); // O puedes establecer un valor por defecto
         }
       }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ TituloRevision: '' }); // Manejo del estado en caso de error
        });      
      
    }

    private ConsultarTituloPublicacion(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'TituloMenuPublicacion'",
         ""
       ).then((items) => {
          
          
         if (items.length > 0) {
           // Actualiza el estado con el valor obtenido
           this.setState({ TituloPublicacion: items[0].Valor });
         } else {
           console.log("No se encontr la llave buscada.");
           this.setState({ TituloPublicacion: '' }); // O puedes establecer un valor por defecto
         }
       }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ TituloPublicacion: '' }); // Manejo del estado en caso de error
        });      
      
    } 

    private ConsultarTituloAprobacion(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'TituloMenuAprobacion'",
         ""
       ).then((items) => {
          
          
         if (items.length > 0) {
           // Actualiza el estado con el valor obtenido
           this.setState({ TituloAprobacion: items[0].Valor });
         } else {
           console.log("No se encontr la llave buscada.");
           this.setState({ TituloAprobacion: '' }); // O puedes establecer un valor por defecto
         }
       }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ TituloAprobacion: '' }); // Manejo del estado en caso de error
        });      
      
    } 

    
   // Funcion para consultar el titulo "ver ms" en parametros tecnicos
    private ConsultarBotonVerMas(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'BotonVerMas'",
         ""
       ).then((items) => {
         console.log(items);
         
          
         if (items.length > 0) {
           // Actualiza el estado con el valor obtenido
           this.setState({ BotonVerMas: items[0].Valor });
         } else {
           console.log("No se encontr la llave buscada.");
           this.setState({ BotonVerMas: '' }); // O puedes establecer un valor por defecto
         }
       }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ BotonVerMas: '' }); // Manejo del estado en caso de error
        });      
      
    } 

   // Funcion para consultar el titulo "ver documentos" en parametros tecnicos
   private ConsultarBotonVerDocumentos(){

   this.pnp.getListItemsRoot(
      "Parametros Tecnicos",
      ["*"],
      "Llave eq 'BotonVerDocumentos'",
      ""
      ).then((items) => {
         
         
      if (items.length > 0) {
         // Actualiza el estado con el valor obtenido
         this.setState({ BotonVerDocumentos: items[0].Valor });
      } else {
         console.log("No se encontr la llave buscada.");
         this.setState({ BotonVerDocumentos: '' }); // O puedes establecer un valor por defecto
      }
      }).catch((error) => {
      console.error("Error al consultar la lista:", error);
      this.setState({ BotonVerDocumentos: '' }); // Manejo del estado en caso de error
      });      
   
   } 

   // Funcion para consultar el titulo "Boton Responder Ajustes" en parametros tecnicos
   private ConsultarBotonResponderAjustes(){

   this.pnp.getListItemsRoot(
      "Parametros Tecnicos",
      ["*"],
      "Llave eq 'BotonResponderAjustes'",
      ""
      ).then((items) => {
         
         
      if (items.length > 0) {
         // Actualiza el estado con el valor obtenido
         this.setState({ BotonResponderAjustes: items[0].Valor });
      } else {
         console.log("No se encontr la llave buscada.");
         this.setState({ BotonResponderAjustes: '' }); // O puedes establecer un valor por defecto
      }
      }).catch((error) => {
      console.error("Error al consultar la lista:", error);
      this.setState({ BotonResponderAjustes: '' }); // Manejo del estado en caso de error
      });      
   
   }

   // Funcion para consultar el titulo "Boton Enviar Ajustes" en parametros tecnicos
   private ConsultarBotonEnviarAjustes(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'BotonEnviarAjustes'",
         ""
         ).then((items) => {
            
            
         if (items.length > 0) {
            // Actualiza el estado con el valor obtenido
            this.setState({ BotonEnviarAjustes: items[0].Valor });
         } else {
            console.log("No se encontr la llave buscada.");
            this.setState({ BotonEnviarAjustes: '' }); // O puedes establecer un valor por defecto
         }
         }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ BotonEnviarAjustes: '' }); // Manejo del estado en caso de error
         });      
      
      }  
      
   // Funcion para consultar el titulo "Boton Enviar a publicacion" en parametros tecnicos
   private ConsultarBotonEnviarAPublicacion(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'BotonEnviarAPublicacion'",
         ""
         ).then((items) => {
            
            
         if (items.length > 0) {
            // Actualiza el estado con el valor obtenido
            this.setState({ BotonEnviarAPublicacion: items[0].Valor });
         } else {
            console.log("No se encontr la llave buscada.");
            this.setState({ BotonEnviarAPublicacion: '' }); // O puedes establecer un valor por defecto
         }
         }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ BotonEnviarAPublicacion: '' }); // Manejo del estado en caso de error
         });      
      
   }

   // Funcion para consultar el titulo "Boton cancelar solicitud" en parametros tecnicos
   private ConsultarBotonCancelarsolicitud(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'BotonCancelarsolicitud'",
         ""
      ).then((items) => {
         console.log(items);
         
         
         if (items.length > 0) {
            // Actualiza el estado con el valor obtenido
            this.setState({ BotonCancelarsolicitud: items[0].Valor });
         } else {
            console.log("No se encontr la llave buscada.");
            this.setState({ BotonCancelarsolicitud: '' }); // O puedes establecer un valor por defecto
         }
      }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ BotonCancelarsolicitud: '' }); // Manejo del estado en caso de error
      });      
      
   }
   
   // Funcion para consultar el titulo "Boton asignar metadata" en parametros tecnicos
   private ConsultarBotonAsignarMetadata(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'BotonAsignarMetadata'",
         ""
      ).then((items) => {
         console.log(items);
         
         
         if (items.length > 0) {
            // Actualiza el estado con el valor obtenido
            this.setState({ BotonAsignarMetadata: items[0].Valor });
         } else {
            console.log("No se encontr la llave buscada.");
            this.setState({ BotonAsignarMetadata: '' }); // O puedes establecer un valor por defecto
         }
      }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ BotonAsignarMetadata: '' }); // Manejo del estado en caso de error
      });      
      
   }
   
   // Funcion para consultar el titulo "Boton activar aprobacion" en parametros tecnicos
   private ConsultarBotonActivarAprobacin(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'BotonActivarAprobacin'",
         ""
      ).then((items) => {
         console.log(items);
         
         
         if (items.length > 0) {
            // Actualiza el estado con el valor obtenido
            this.setState({ BotonActivarAprobacin: items[0].Valor });
         } else {
            console.log("No se encontr la llave buscada.");
            this.setState({ BotonActivarAprobacin: '' }); // O puedes establecer un valor por defecto
         }
      }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ BotonActivarAprobacin: '' }); // Manejo del estado en caso de error
      });      
      
   }
   
   // Funcion para consultar el titulo "Boton Aprobar" en parametros tecnicos
   private ConsultarBotonAprobar(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'BotonAprobar'",
         ""
      ).then((items) => {
         console.log(items);
         
         
         if (items.length > 0) {
            // Actualiza el estado con el valor obtenido
            this.setState({ BotonAprobar: items[0].Valor });
         } else {
            console.log("No se encontr la llave buscada.");
            this.setState({ BotonAprobar: '' }); // O puedes establecer un valor por defecto
         }
      }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ BotonAprobar: '' }); // Manejo del estado en caso de error
      });      
      
   }
         
   // Funcion para consultar el titulo "Boton Aprobar" en parametros tecnicos
   private ConsultarBotonRechazar(){

      this.pnp.getListItemsRoot(
         "Parametros Tecnicos",
         ["*"],
         "Llave eq 'BotonRechazar'",
         ""
      ).then((items) => {
         console.log(items);
         
         
         if (items.length > 0) {
            // Actualiza el estado con el valor obtenido
            this.setState({ BotonRechazar: items[0].Valor });
         } else {
            console.log("No se encontr la llave buscada.");
            this.setState({ BotonRechazar: '' }); // O puedes establecer un valor por defecto
         }
      }).catch((error) => {
         console.error("Error al consultar la lista:", error);
         this.setState({ BotonRechazar: '' }); // Manejo del estado en caso de error
      });      
      
   }
   // Funcion para guardar la aprobacion o rechazo
   private sortByColumn(columnName: any) {
      let sortedData = this.state.dataAprobacion.sort((a: any, b: any) => {
         if (a[columnName] < b[columnName]) {
            return -1;
         }
         if (a[columnName] > b[columnName]) {
            return 1;
         }
         return 0;
      });

      this.setState({
         dataAprobacion: sortedData
      });
   }
}


 
 export default(withRouter(Aprobaciones));