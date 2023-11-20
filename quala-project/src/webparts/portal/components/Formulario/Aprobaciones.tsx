import * as React from 'react';
import { PNP } from '../../components/Util/util';
import { withRouter } from 'react-router-dom';
import "@pnp/sp/taxonomy";
import * as _ from "underscore";
import 'react-quill/dist/quill.snow.css';
import Componentes from '../Formulario/Componentes';
import { IoIosArrowForward } from "react-icons/io/";
import { GrClose } from "react-icons/Gr/";


export interface IAprobacionesProps {
   Titulo: any;
   context: any;
   Subsitio: any;
   NombreSubsitio: any;
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
}

class Aprobaciones extends React.Component<IAprobacionesProps, any>{

   public pnp: PNP;
   public AproArea = false;
   public AproRoles = false;
   public Apro = false;
   public estadoTablaModelo = false

   constructor(props: any) {
      super(props)

      this.pnp = new PNP(this.props.context);


      var pasos: any = [
         //{Title: 'Modulo de aprobaciones'},
         //{Title: 'Documentos del Mecanismo'},
         //{Title: 'Aprobadores'},
         //{Title: 'Control de Cambios'},
         //{Title:'Plan de acción de los contenidos'}
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
      console.log(this.props);
   }


   // Funcion que cambia el estado de la solicitud para la implementacion del modal
   cambioEstadoAprobacion(estado: string, Id: any, IdSolicitud: any, NombreMecanismo: any) {

      let obj: {} = {
         EstadoAprobacion: estado
      }
      this.pnp.updateByIdRoot(
         "Aprobadores",
         Id,
         obj
      ).then((items: any) => {
         this.mensajesModal(estado, IdSolicitud, NombreMecanismo)
      })
   }

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
      this.pnp.getListItems(
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

      this.consultarAprobadoresArea()
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
                  countEnAjustes++; // aumentar el contador si la solicitud está en ajustes
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
                  countEnRevision++; // aumentar el contador si la solicitud está en Revision
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
                     countEnAprobacion++; // aumentar el contador si la solicitud está en Aprobacion
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
         "MensajesModal",
         ["*"],
         "Estado eq '" + Estado + "'",
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

   public render(): React.ReactElement<IAprobacionesProps> {

      return (
         <>
            <div>
               <div className="toolbar py-5 py-lg-7" id="kt_toolbar">
                  <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
                     <div className="page-titlo d-flex flex-column me-3">
                        <h1 id='contentn' className="solicitudestitle d-flex">
                           Solicitudes por gestionar {(this.state.dataAprobacion + this.state.dataAjustes + this.state.dataRevision + this.state.dataPublicacion)<1? <h1>(0)</h1>: <h1>({this.state.dataAprobacion.length + this.state.dataAjustes.length + this.state.dataRevision.length + this.state.dataPublicacion.length })</h1> }
                        </h1>
                     </div>
                  </div>
               </div>
               <div id='cardaprob' className="card">
                  <div className="card-body">
                     <div className="stepper stepper-pills first" id="kt_stepper_example_clickable" data-kt-stepper="true">
                        <form className="form mx-auto" id="kt_stepper_example_basic_form">
                           <div className="container-xxl d-flex flex-stack flex-wrap" id="kt_toolbar_container">
                              {this.state.Pasos == 'Datos del Mecanismo' ?
                                 <div id="contenidoSolicitudes" className="page-title d-flex flex-column me-3 solicitudestitle" style={{ width: '1150px', overflowX: 'auto' }} >

                                    {/* Menu en revisión */}
                                    <button
                                       className={this.state.estadoAcordeon ? "menuEstados fs-4 fw-bold" : "menuEstados collapsed"}
                                       id={this.state.estadoAcordeon ? "text-Expanded" : "textoColapso"}
                                       type='button'
                                       onClick={
                                          () => {
                                             this.setState({
                                                IsTotal: !this.state.IsTotal,
                                             })
                                             if (this.state.estadoAcordeon) {
                                                this.actualizarAcordeon(0)
                                             }
                                             else {
                                                this.consultarTodasSolicitudes(this.state.UserId)
                                                this.consultarRevisor(this.state.UserId)
                                             }
                                             this.setState({
                                                IsTotal: !this.state.IsTotal,
                                                IsAprobaciones: false,
                                                Ispublicado: false,
                                             })
                                          }
                                       }>
                                       <IoIosArrowForward className={this.state.IsTotal ? "arrowExpanded" : "arrowCollapsed"} style={{ marginRight: 5 }} /> En revision ({this.state.dataAprobacion.length + this.state.dataRevision.length})
                                    </button>

                                    {/* En revisión */}
                                    {this.state.IsTotal > 0 ?
                                    
                                       <div className="mt-8 mb-5 mx-8 table-container" style={{ overflowX: 'auto' }}>
                                         
                                          <table className="table-all-borders table-striped" style={{ width: '1500px' }}>
                                                <thead>
                                                   <tr id='contentn'>
                                                      <th><b>País</b><button title='.' className="botonTabla" onClick={() => this.sortByColumn("Pais")}><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("DIreccion")}><b>Dirección</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("Area")}><b>Área</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("SubArea")}><b>Subárea</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("TipoSolicitud")}><b>Plan de acción</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("NombreMecanismo")}><b>Nombre mecanismo</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("TipoMecanismo")}><b>Tipo de Mecanismo</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("FechaInicio")}><b>Fecha inicio de revisión</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("FechaFin")}><b>Fecha límite</b></button><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("nombreSolicitante")}><b>Solicitante</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("FechaInicio")}><b>Fecha de solicitud</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("Planta")}><b>Aplica a planta</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><button title='.' className="botonTabla" onClick={() => this.sortByColumn("Proceso")}><b>Proceso</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                         <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                            <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                         </g>
                                                      </svg></button></th>
                                                      <th><b>Ver más</b></th>
                                                      <th><b>Ver documentos</b></th>
                                                      <th><b>Responder ajustes</b></th>
                                                   </tr>
                                                </thead>

                                                {this.state.dataAjustes && this.state.dataAjustes.map((e: any) => {
                                                   return (
                                                      <tr>
                                                         <td>{e.Pais}</td>
                                                         <td>{e.Direccion_x0020_Solicitud}</td>
                                                         <td>{e.Area_x0020_Solicitud}</td>
                                                         <td>{e.Subarea_x0020_Solicitud}</td>
                                                         <td>{e.Motivo_x0020_del_x0020_Cambio}</td>
                                                         <td>{e.Nombre_x0020_del_x0020_mecanismo}</td>
                                                         <td>{e.Tipo_x0020_de_x0020_Mecanismo}</td>
                                                         <td>{e.Fecha_x0020_Inicio_x0020_Solicit.split("T")[0]}</td>
                                                         <td>{e.Fecha_x0020_Finalizacion_x0020_S.split("T")[0]}</td>
                                                         <td>{e.Nombre_x0020_Solicitante}</td>
                                                         <td>{e.Fecha_x0020_Inicio_x0020_Solicit.split("T")[0]}</td>
                                                         <td>{e.Planta == null ? <p>No</p> : <p>Si</p>}</td>
                                                         <td>{e.Proceso}</td>
                                                         <td>
                                                            {/* boton ver màs */}
                                                            <button className='btn-crear' onClick={() => { this.setState({ IdMecanismoModal: e.ID, boton: "vermas" }, () => { this.setState({ mostrarModal: true, Editar: true }, () => { this.setState({ boton: "vermas" }) }) }) }}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="25" height="25" viewBox="0 0 32 32">
                                                                  <path d="M9,17h6v6a1,1,0,0,0,2,0V17h6a1,1,0,0,0,0-2H17V9a1,1,0,0,0-2,0v6H9a1,1,0,0,0,0,2Z" />
                                                               </svg>
                                                            </button>
                                                         </td>
                                                         <td>
                                                            {/* boton ver documentos */}
                                                            <button className='btn-documentos' onClick={() => { this.setState({ IdMecanismoModal: e.ID }, () => { this.setState({ mostrarModal: true, boton: "verdoc" }) }) }}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                                                  <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
                                                               </svg>
                                                            </button>
                                                         </td>
                                                         {
                                                            e.EstadoSolicitud === "En ajustes" ?
                                                               <td>
                                                                  {/* boton responder ajustes */}
                                                                  <button className="btn-documentos" onClick={() => { this.setState({ IdMecanismoModal: e.ID, estado: "En ajustes", IdSolicitud: e.ID, NombreMecanismo: e.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "resajustes" }) }) }}>
                                                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                        <path d="M22 11.2603V7.608L12.348 12.6644C12.13 12.7785 11.87 12.7785 11.652 12.6644L2 7.608V15.75L2.00514 15.9344C2.10075 17.6435 3.51697 19 5.25 19H11.717C11.9006 18.5781 12.1624 18.1927 12.4903 17.8648L18.3927 11.9624C19.3679 10.9871 20.8037 10.7531 22 11.2603ZM18.75 3H5.25L5.06409 3.00523C3.46432 3.09545 2.17386 4.34271 2.01619 5.92355L12 11.1533L21.9838 5.92355C21.8201 4.28191 20.4347 3 18.75 3ZM19.0999 12.6695L13.1974 18.5719C12.8533 18.916 12.6092 19.3472 12.4911 19.8194L12.0334 21.6501C11.8344 22.4462 12.5556 23.1674 13.3517 22.9683L15.1824 22.5106C15.6545 22.3926 16.0857 22.1485 16.4299 21.8043L22.3323 15.9019C23.2249 15.0093 23.2249 13.5621 22.3323 12.6695C21.4397 11.7768 19.9925 11.7768 19.0999 12.6695Z" fill="#345E9E" />
                                                                     </svg>
                                                                  </button>
                                                               </td>
                                                               : null
                                                         }
                                                      </tr>
                                                   )
                                                })
                                                }
                                          </table>
                                          
                                          <br />
                                                                                                                                                                 
                                          <table className="table-all-borders" style={{ width: '1500px' }}>
                                             <thead>
                                                <tr id='contentn'>
                                                   <th><b>País</b><button title='.' className="botonTabla" onClick={() => this.sortByColumn("Pais")}><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("DIreccion")}><b>Dirección</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("Area")}><b>Área</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("SubArea")}><b>Subárea</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("TipoSolicitud")}><b>Plan de acción</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("NombreMecanismo")}><b>Nombre mecanismo</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("TipoMecanismo")}><b>Tipo de Mecanismo</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("FechaInicio")}><b>Fecha inicio</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("FechaFin")}><b>Fecha límite</b></button><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("nombreSolicitante")}><b>Solicitante</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("FechaInicio")}><b>Fecha de solicitud</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("Planta")}><b>Aplica a planta</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("Proceso")}><b>Proceso</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><b>Ver más</b></th>
                                                   <th><b>Ver documentos</b></th>
                                                   <th><b>Enviar ajustes</b></th>
                                                   <th><b>Enviar a publicacion</b></th>
                                                   <th><b>Cancelar solicitud</b></th>
                                                </tr>
                                             </thead>
                                             {this.state.dataRevision && this.state.dataRevision.map((e: any) => {

                                                return (
                                                   <tr>
                                                      <td>{e.Pais}</td>
                                                      <td>{e.Direccion_x0020_Solicitud}</td>
                                                      <td>{e.Area_x0020_Solicitud}</td>
                                                      <td>{e.Subarea_x0020_Solicitud}</td>
                                                      <td>{e.Motivo_x0020_del_x0020_Cambio}</td>
                                                      <td>{e.Nombre_x0020_del_x0020_mecanismo}</td>
                                                      <td>{e.Tipo_x0020_de_x0020_Mecanismo}</td>
                                                      <td>{e.Fecha_x0020_Inicio_x0020_Solicit.split("T")[0]}</td>
                                                      <td>{e.Fecha_x0020_Finalizacion_x0020_S.split("T")[0]}</td>
                                                      <td>{e.Nombre_x0020_Solicitante}</td>
                                                      <td>{e.Fecha_x0020_Inicio_x0020_Solicit.split("T")[0]}</td>
                                                      <td>{e.Planta == null ? <p>No</p> : <p>Si</p>}</td>
                                                      <td>{e.Proceso}</td>
                                                      <td>
                                                         {/* boton ver màs */}
                                                         <button className='btn-crear' onClick={() => { this.setState({ IdMecanismoModal: e.ID, boton: "vermas" }, () => { this.setState({ mostrarModal: true, Editar: false, boton: "vermas" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="25" height="25" viewBox="0 0 32 32">
                                                               <path d="M9,17h6v6a1,1,0,0,0,2,0V17h6a1,1,0,0,0,0-2H17V9a1,1,0,0,0-2,0v6H9a1,1,0,0,0,0,2Z" />
                                                            </svg>
                                                         </button>
                                                      </td>
                                                      <td>
                                                         {/* boton ver documentos */}
                                                         <button className='btn-documentos' onClick={() => { this.setState({ IdMecanismoModal: e.ID }, () => { this.setState({ mostrarModal: true, boton: "verdoc" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                                               <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
                                                            </svg>
                                                         </button>
                                                      </td>
                                                      <td>
                                                         {/* boton enviar ajustes */}
                                                         <button className='btn-documentos' onClick={() => { this.setState({ IdMecanismoModal: e.ID, estado: "En revision", IdSolicitud: e.ID, NombreMecanismo: e.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "enviarajustes" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                               <path d="M22 11.2603V7.608L12.348 12.6644C12.13 12.7785 11.87 12.7785 11.652 12.6644L2 7.608V15.75L2.00514 15.9344C2.10075 17.6435 3.51697 19 5.25 19H11.717C11.9006 18.5781 12.1624 18.1927 12.4903 17.8648L18.3927 11.9624C19.3679 10.9871 20.8037 10.7531 22 11.2603ZM18.75 3H5.25L5.06409 3.00523C3.46432 3.09545 2.17386 4.34271 2.01619 5.92355L12 11.1533L21.9838 5.92355C21.8201 4.28191 20.4347 3 18.75 3ZM19.0999 12.6695L13.1974 18.5719C12.8533 18.916 12.6092 19.3472 12.4911 19.8194L12.0334 21.6501C11.8344 22.4462 12.5556 23.1674 13.3517 22.9683L15.1824 22.5106C15.6545 22.3926 16.0857 22.1485 16.4299 21.8043L22.3323 15.9019C23.2249 15.0093 23.2249 13.5621 22.3323 12.6695C21.4397 11.7768 19.9925 11.7768 19.0999 12.6695Z" fill="#345E9E" />
                                                            </svg>
                                                         </button>
                                                      </td>
                                                      <td>
                                                         {/* boton enviar a publicacion */}
                                                         <button title='.' className='btn-documentos' onClick={() => { this.setState({ IdMecanismoModal: e.ID, estado: "En publicacion", IdSolicitud: e.ID, NombreMecanismo: e.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "publicacion" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                                               <path d="M3.78963 2.77272L24.8609 12.8503C25.4837 13.1482 25.7471 13.8945 25.4493 14.5173C25.3261 14.7748 25.1185 14.9825 24.8609 15.1056L3.78963 25.1832C3.16684 25.4811 2.4205 25.2177 2.12265 24.5949C1.99321 24.3242 1.96543 24.0161 2.04436 23.7267L4.15191 15.9987C4.20471 15.8051 4.36814 15.6618 4.56699 15.6348L14.7776 14.2479C14.8656 14.2353 14.9385 14.1775 14.9722 14.0985L14.9897 14.0357C15.0065 13.9186 14.9391 13.8088 14.8334 13.7675L14.7776 13.7529L4.57894 12.366C4.38012 12.339 4.21672 12.1957 4.16393 12.0021L2.04436 4.22929C1.86271 3.56326 2.25539 2.87608 2.92142 2.69444C3.21084 2.6155 3.519 2.64329 3.78963 2.77272Z" fill="#00AE5A" />
                                                            </svg>
                                                         </button>
                                                      </td>
                                                      <td>
                                                         {/* boton cancelar solicitud */}
                                                         <button title='.' className='btn-documentos' onClick={() => { this.setState({ IdMecanismoModal: e.ID, estado: "cancelada", IdSolicitud: e.ID, NombreMecanismo: e.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "cancelar" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                                               <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#FF0000" stroke="none">
                                                                  <path d="M2341 5110 c-618 -60 -1150 -309 -1582 -740 -207 -207 -340 -385 -465 -624 -435 -834 -382 -1822 141 -2606 408 -613 1045 -1010 1790 -1116 147 -21 481 -24 640 -6 314 37 657 147 928 298 727 407 1214 1129 1309 1939 18 159 15 493 -6 640 -65 456 -223 842 -494 1205 -99 132 -337 376 -462 472 -375 289 -771 456 -1240 523 -131 19 -434 27 -559 15z m-643 -1389 c20 -11 226 -209 457 -440 l420 -421 425 424 c234 233 439 431 457 440 18 9 57 16 91 16 112 0 192 -82 192 -199 0 -32 -7 -66 -19 -89 -11 -20 -209 -226 -440 -457 l-421 -420 424 -425 c233 -234 431 -439 440 -457 9 -18 16 -57 16 -91 0 -131 -118 -222 -246 -191 -46 11 -72 35 -484 445 l-435 434 -425 -425 c-235 -235 -441 -433 -460 -442 -78 -38 -191 -10 -243 59 -50 66 -56 142 -16 218 10 19 207 224 438 455 l421 420 -434 435 c-410 412 -434 438 -445 484 -14 58 -8 96 25 153 49 86 172 120 262 74z" />
                                                               </g>
                                                            </svg>
                                                         </button>
                                                      </td>
                                                   </tr>
                                                )
                                             })
                                             }
                                          </table>
                                          
                                       </div>
                                       : null
                                    }

                                    {/* Menu en publicación */}
                                    <button
                                       className={this.state.estadoAcordeon ? "menuEstados fs-4 fw-bold" : "menuEstados collapsed"}
                                       id={this.state.estadoAcordeon ? "" : "textoColapso"}
                                       type='button'
                                       onClick={
                                          () => {
                                             this.setState({
                                                Ispublicado: !this.state.Ispublicado,
                                             })
                                             if (this.state.estadoAcordeon) {
                                                this.actualizarAcordeon(0)
                                             }
                                             else {

                                                this.consultarPublicador(this.state.UserId)
                                             }
                                             this.setState({
                                                IsTotal: false,
                                                IsAprobaciones: false,
                                                Ispublicado: !this.state.Ispublicado,
                                             })

                                          }

                                       }>
                                       <IoIosArrowForward className={this.state.Ispublicado ? "arrowExpanded" : "arrowCollapsed"} />En publicación ({this.state.dataPublicacion.length})
                                    </button>

                                    {/* En publicación */}
                                    {this.state.Ispublicado > 0 ?
                                       <div className="mt-8 mb-5 mx-8 table-container" style={{ overflowX: 'auto' }}>
                                          <table className="table-all-borders" style={{ width: '1500px' }}>
                                             <thead>
                                                <tr id='contentn'>
                                                   <th><b>País</b><button title='.' className="botonTabla" onClick={() => this.sortByColumn("Pais")}><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("DIreccion")}><b>Dirección</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("Area")}><b>Área</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("SubArea")}><b>Subárea</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("TipoSolicitud")}><b>Plan de acción</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("NombreMecanismo")}><b>Nombre mecanismo</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("TipoMecanismo")}><b>Tipo de Mecanismo</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("FechaInicio")}><b>Fecha inicio</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("FechaFin")}><b>Fecha límite</b></button><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("nombreSolicitante")}><b>Solicitante</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("FechaInicio")}><b>Fecha de solicitud</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("Planta")}><b>Aplica a planta</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("Proceso")}><b>Seguridad</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><b>Ver más</b></th>
                                                   <th><b>Ver documentos</b></th>
                                                   <th><b>Asignar metadata</b></th>
                                                   <th><b>Activar flujo de aprobación</b></th>
                                                   <th><b>Cancelar solicitud</b></th>
                                                </tr>
                                             </thead>
                                             {this.state.dataPublicacion && this.state.dataPublicacion.map((e: any) => {

                                                return (
                                                   <tr>
                                                      <td>{e.Pais}</td>
                                                      <td>{e.Direccion_x0020_Solicitud}</td>
                                                      <td>{e.Area_x0020_Solicitud}</td>
                                                      <td>{e.Subarea_x0020_Solicitud}</td>
                                                      <td>{e.Motivo_x0020_del_x0020_Cambio}</td>
                                                      <td>{e.Nombre_x0020_del_x0020_mecanismo}</td>
                                                      <td>{e.Tipo_x0020_de_x0020_Mecanismo}</td>
                                                      <td>{e.Fecha_x0020_Inicio_x0020_Solicit.split("T")[0]}</td>
                                                      <td>{e.Fecha_x0020_Finalizacion_x0020_S.split("T")[0]}</td>
                                                      <td>{e.Nombre_x0020_Solicitante}</td>
                                                      <td>{e.Fecha_x0020_Inicio_x0020_Solicit.split("T")[0]}</td>
                                                      <td>{e.Planta == null ? <p>No</p> : <p>Si</p>}</td>
                                                      <td>{e.Seguridad}</td>                                                     
                                                      <td>
                                                         {/* boton ver màs */}
                                                         <button className='btn-crear' onClick={() => {this.setState({ IdMecanismoModal: e.ID, boton: "" }, () => { this.setState({ mostrarModal: true, Editar: true, boton: "vermas" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="25" height="25" viewBox="0 0 32 32">
                                                               <path d="M9,17h6v6a1,1,0,0,0,2,0V17h6a1,1,0,0,0,0-2H17V9a1,1,0,0,0-2,0v6H9a1,1,0,0,0,0,2Z" />
                                                            </svg>
                                                         </button>
                                                      </td>
                                                      <td>
                                                         {/* boton ver documentos */}
                                                         <button className='btn-documentos' onClick={() => { this.setState({ IdMecanismoModal: e.ID }, () => { this.setState({ mostrarModal: true, boton: "verdoc" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                                               <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
                                                            </svg>
                                                         </button>
                                                      </td>
                                                      <td>
                                                         {/* boton asignar metadata */}
                                                         <button title='.' className='btn-crear' onClick={() => { this.setState({ IdMecanismoModal: e.ID, estado: "Asignar metadata", IdSolicitud: e.ID, NombreMecanismo: e.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "asignarmetadata" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20" height="20" viewBox="0 0 211.000000 224.000000" preserveAspectRatio="xMidYMid meet">
                                                               <g transform="translate(0.000000,224.000000) scale(0.100000,-0.100000)" fill="#345E9E" stroke="none">
                                                                  <path d="M197 2194 c-53 -27 -102 -88 -117 -145 -7 -25 -9 -341 -8 -912 l3 -874 30 -49 c21 -33 48 -60 85 -81 l54 -33 676 0 676 0 54 33 c37 21 64 48 85 81 l30 49 3 321 3 321 -158 -156 c-87 -86 -176 -166 -198 -177 -68 -33 -316 -104 -367 -104 -57 1 -95 19 -136 66 l-31 36 -160 0 c-171 0 -202 6 -220 47 -17 36 -13 59 13 90 l24 28 173 5 173 5 21 70 c12 39 25 82 28 97 l7 26 -201 4 -201 3 -24 28 c-32 38 -31 72 5 108 l29 29 249 0 248 0 130 130 130 130 -95 0 c-78 0 -104 4 -145 24 -61 28 -120 91 -134 143 -7 23 -11 164 -11 361 l0 322 -337 0 -338 -1 -48 -25z" />
                                                                  <path d="M1080 1899 c0 -285 5 -330 40 -349 10 -6 94 -10 187 -10 l169 0 59 60 60 60 -258 258 -257 257 0 -276z" /><path d="M1934 1671 c-18 -11 -35 -24 -38 -29 -3 -6 -35 -10 -69 -10 -45 0 -75 -6 -103 -20 -22 -12 -172 -154 -346 -329 l-306 -308 -37 -120 c-20 -66 -40 -133 -46 -149 -15 -48 -11 -84 14 -106 29 -29 66 -24 237 29 l135 43 308 306 c178 177 317 324 329 347 14 27 21 60 22 102 1 49 5 66 23 85 47 50 38 135 -18 163 -38 20 -68 19 -105 -4z" />
                                                               </g>
                                                            </svg>
                                                         </button>
                                                      </td>
                                                      <td>
                                                         {/* boton activar flujo de aprobacion */}
                                                         <button title='.' className='btn-crear' onClick={() => { this.setState({ IdMecanismoModal: e.ID, estado: "En aprobacion", IdSolicitud: e.ID, NombreMecanismo: e.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "flujoaprobacion" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                               <path d="M17 2C18.6569 2 20 3.34315 20 5V11.3368C19.5454 11.1208 19.0368 11 18.5 11C16.567 11 15 12.567 15 14.5C15 15.4793 15.4022 16.3647 16.0505 17H15.7727C14.2419 17 13 18.2401 13 19.772V19.875C13 19.9167 13.0007 19.9583 13.002 20H5C3.34315 20 2 18.6569 2 17V5C2 3.34315 3.34315 2 5 2H17ZM15.4697 6.96967L9 13.4393L6.53033 10.9697C6.23744 10.6768 5.76256 10.6768 5.46967 10.9697C5.17678 11.2626 5.17678 11.7374 5.46967 12.0303L8.46967 15.0303C8.76256 15.3232 9.23744 15.3232 9.53033 15.0303L16.5303 8.03033C16.8232 7.73744 16.8232 7.26256 16.5303 6.96967C16.2374 6.67678 15.7626 6.67678 15.4697 6.96967ZM21 14.5C21 15.8807 19.8807 17 18.5 17C17.1193 17 16 15.8807 16 14.5C16 13.1193 17.1193 12 18.5 12C19.8807 12 21 13.1193 21 14.5ZM23 19.875C23 21.4315 21.7143 23 18.5 23C15.2857 23 14 21.4374 14 19.875V19.772C14 18.7929 14.7937 18 15.7727 18H21.2273C22.2063 18 23 18.793 23 19.772V19.875Z" fill="#00AE5A" />
                                                            </svg>
                                                         </button>
                                                      </td>
                                                      <td>
                                                         {/* boton cancelar solicitud*/}
                                                         <button title='.' className='btn-crear' onClick={() => { this.setState({ IdMecanismoModal: e.ID, estado: "cancelada", IdSolicitud: e.ID, NombreMecanismo: e.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "cancelarsolicitud" }) }) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                                               <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#FF0000" stroke="none">
                                                                  <path d="M2341 5110 c-618 -60 -1150 -309 -1582 -740 -207 -207 -340 -385 -465 -624 -435 -834 -382 -1822 141 -2606 408 -613 1045 -1010 1790 -1116 147 -21 481 -24 640 -6 314 37 657 147 928 298 727 407 1214 1129 1309 1939 18 159 15 493 -6 640 -65 456 -223 842 -494 1205 -99 132 -337 376 -462 472 -375 289 -771 456 -1240 523 -131 19 -434 27 -559 15z m-643 -1389 c20 -11 226 -209 457 -440 l420 -421 425 424 c234 233 439 431 457 440 18 9 57 16 91 16 112 0 192 -82 192 -199 0 -32 -7 -66 -19 -89 -11 -20 -209 -226 -440 -457 l-421 -420 424 -425 c233 -234 431 -439 440 -457 9 -18 16 -57 16 -91 0 -131 -118 -222 -246 -191 -46 11 -72 35 -484 445 l-435 434 -425 -425 c-235 -235 -441 -433 -460 -442 -78 -38 -191 -10 -243 59 -50 66 -56 142 -16 218 10 19 207 224 438 455 l421 420 -434 435 c-410 412 -434 438 -445 484 -14 58 -8 96 25 153 49 86 172 120 262 74z" />
                                                               </g>
                                                            </svg>
                                                         </button>
                                                      </td>
                                                   </tr>
                                                )
                                             })
                                             }
                                          </table>
                                       </div>
                                       : null
                                    }

                                    {/* Menu en aprobación */}
                                    {this.state.IsAprobaciones > 0?
                                    <div>
                                    <button
                                       className={this.state.estadoAcordeon ? "menuEstados fs-4 fw-bold" : "menuEstados collapsed"}
                                       id={this.state.estadoAcordeon ? "" : "textoColapso"}
                                       type='button'
                                       onClick={
                                          () => {
                                             this.setState({
                                                IsAprobaciones: !this.state.IsAprobaciones,
                                             })

                                             if (this.state.estadoAcordeon) {
                                                this.actualizarAcordeon(0)
                                             }
                                             else {

                                                this.consultarDatosAprobacion(this.state.idUser)
                                             }
                                             this.setState({
                                                IsTotal: false,
                                                IsAprobaciones: !this.state.IsAprobaciones,
                                                Ispublicado: false,
                                             })
                                          }
                                       }>
                                       <IoIosArrowForward className={this.state.IsAprobaciones ? "arrowExpanded" : "arrowCollapsed"} />En aprobación ({this.state.dataAprobacion && this.state.dataAprobacion.length})
                                    </button>

                                    {/* En aprobación */}
                                    
                                       <div className="mt-8 mb-5 mx-8 table-container" style={{ overflowX: 'auto' }}>
                                          <table className="table-all-borders" style={{ width: '1500px' }}>
                                             <thead>
                                                <tr id='contentn'>
                                                   <th><b>País</b><button title='.' className="botonTabla" onClick={() => this.sortByColumn("Pais")}><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("DIreccion")}><b>Dirección</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("Area")}><b>Área</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("SubArea")}><b>Subárea</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("TipoSolicitud")}><b>Plan de acción</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("NombreMecanismo")}><b>Nombre mecanismo</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("FechaInicio")}><b>Fecha inicio</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("FechaFin")}><b>Fecha límite</b></button><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("nombreSolicitante")}><b>Solicitante</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><button className="botonTabla" onClick={() => this.sortByColumn("Planta")}><b>Aplica a planta</b><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="10.000000pt" height="10.000000pt" viewBox="0 0 195.000000 114.000000" preserveAspectRatio="xMidYMid meet">
                                                      <g transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                         <path d="M135 995 c-17 -16 -25 -35 -25 -57 0 -30 37 -70 423 -455 394 -395 425 -423 457 -423 32 0 63 28 457 423 386 385 423 425 423 455 0 44 -38 82 -82 82 -29 0 -68 -35 -415 -382 l-383 -383 -383 383 c-347 347 -386 382 -415 382 -22 0 -41 -9 -57 -25z" />
                                                      </g>
                                                   </svg></button></th>
                                                   <th><b>Proceso</b></th>
                                                   <th><b>Ver más</b></th>
                                                   <th><b>Ver documentos</b></th>
                                                   <th><b>Aprobar</b></th>
                                                   <th><b>Rechazar</b></th>
                                                </tr>
                                             </thead>
                                             {
                                             this.state.dataAprobacion && this.state.dataAprobacion.map((e: any, idx: any) => {

                                                   return (
                                                      
                                                      <tr key={idx}>
                                                         
                                                         <td>{e.Pais}</td>
                                                         <td>{e.Direccion_x0020_Solicitud}</td>
                                                         <td>{e.Area_x0020_Solicitud}</td>
                                                         <td>{e.Subarea_x0020_Solicitud}</td>
                                                         <td>{e.Tipo_x0020_de_x0020_Mecanismo}</td>
                                                         <td>{e.Nombre_x0020_del_x0020_mecanismo}</td>
                                                         <td>{e.Fecha_x0020_Inicio_x0020_Solicit.split("T")[0]}</td>
                                                         <td>{e.Fecha_x0020_Finalizacion_x0020_S.split("T")[0]}</td>
                                                         <td></td>
                                                         <td>{e.Nombre_x0020_Solicitante}</td>
                                                         <td>{e.Planta == null ? <p>No</p> : <p>Si</p>}</td>
                                                      
                                                         <td>
                                                            <button title='.' className='btn-crear' onClick={() => { this.setState({ IdMecanismoModal: e.IdSolicitud.ID, Componentes: true, boton: "vermas"}, () => { this.setState({ mostrarModal: true, Editar: true }, () => { this.setState({ boton: "vermas" }) }) }) }}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="25" height="25" viewBox="0 0 32 32">
                                                                  <path d="M9,17h6v6a1,1,0,0,0,2,0V17h6a1,1,0,0,0,0-2H17V9a1,1,0,0,0-2,0v6H9a1,1,0,0,0,0,2Z" />
                                                               </svg>
                                                            </button>
                                                         </td>
                                                         <td>
                                                            <button title='.' className='btn-documentos' onClick={() => { this.setState({ IdMecanismoModal: e.IdSolicitud.ID }, () => { this.setState({ mostrarModal: true, boton: "verdoc" }) }) }}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                                                  <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
                                                               </svg>
                                                            </button>
                                                         </td>
                                                         <td>
                                                            <button title='.' className='btn-publicacion' /*onClick={() => { this.cambioEstadoAprobacion("Aprobado", e.ID, e.IdSolicitud.ID, e.IdSolicitud.NombreMecanismo) }}*/
                                                            onClick={() => { this.setState({ IdListaAprobadores: e.ID, IdMecanismoModal: e.IdSolicitud.ID, estado: "Aprobado", NombreMecanismo: e.IdSolicitud.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "Aprobar" }) }) }}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-check-fill" viewBox="0 0 16 16">
                                                                  <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                                                  <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                               </svg>
                                                            </button>
                                                         </td>
                                                         <td>
                                                            <button title='.' className='btn-publicacion' /*onClick={() => { this.cambioEstadoAprobacion("Rechazado", e.ID, e.IdSolicitud.ID, e.IdSolicitud.NombreMecanismo) }}*/
                                                            onClick={() => { this.setState({ IdListaAprobadores: e.ID, IdMecanismoModal: e.IdSolicitud.ID, estado: "Rechazado", NombreMecanismo: e.IdSolicitud.NombreMecanismo }, () => { this.setState({ mostrarModal: true, boton: "Rechazar" }) }) }}>
                                                               <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                                                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#FF0000" stroke="none">
                                                                     <path d="M2341 5110 c-618 -60 -1150 -309 -1582 -740 -207 -207 -340 -385 -465 -624 -435 -834 -382 -1822 141 -2606 408 -613 1045 -1010 1790 -1116 147 -21 481 -24 640 -6 314 37 657 147 928 298 727 407 1214 1129 1309 1939 18 159 15 493 -6 640 -65 456 -223 842 -494 1205 -99 132 -337 376 -462 472 -375 289 -771 456 -1240 523 -131 19 -434 27 -559 15z m-643 -1389 c20 -11 226 -209 457 -440 l420 -421 425 424 c234 233 439 431 457 440 18 9 57 16 91 16 112 0 192 -82 192 -199 0 -32 -7 -66 -19 -89 -11 -20 -209 -226 -440 -457 l-421 -420 424 -425 c233 -234 431 -439 440 -457 9 -18 16 -57 16 -91 0 -131 -118 -222 -246 -191 -46 11 -72 35 -484 445 l-435 434 -425 -425 c-235 -235 -441 -433 -460 -442 -78 -38 -191 -10 -243 59 -50 66 -56 142 -16 218 10 19 207 224 438 455 l421 420 -434 435 c-410 412 -434 438 -445 484 -14 58 -8 96 25 153 49 86 172 120 262 74z" />
                                                                  </g>
                                                               </svg>
                                                            </button>
                                                         </td>
                                                      </tr>
                                                      
                                                      
                                                   )
                                                })
                                             }
                                             <tr>
                                             </tr>
                                          </table>
                                       </div>
                                       </div>
                                       : null
                                    }

                                 </div>
                                 :null}
                           </div>

                        </form>

                        <div className="d-flex flex-stack">
                        </div>
                     </div>
                  </div>
               </div>

               {this.state.mostrarModal && this.state.boton == "vermas"?
                  <div className="modal-container overflow-auto">
                     <div className="modal-window">
                        <div>
                           <div id="EncabezadoComponente">
                              {this.state.boton === "vermas" ?
                                 <div className="d-flex justify-content-between">
                                    <div><p className='ptext'>Formulario de solicitud</p></div>
                                    <div>
                                       <span className='CerrarModal'
                                          onClick={() => this.setState({ mostrarModal: false })}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                             <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                          </svg>
                                       </span>
                                    </div>
                                 </div>
                                 :
                                 <div>
                                    <span className='CerrarModalsintitulo'
                                       onClick={() => this.setState({ mostrarModal: false })}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                       </svg>
                                    </span>
                                 </div>
                              }
                           </div>

                           <div> <Componentes openModalExitoso={this.openModalExitoso} closeModal={this.closeModal} boton={this.state.boton} Id={this.state.IdMecanismoModal} Areas={this.props.SubAreas} Direcciones={this.props.Direcciones} currentUser={this.props.currentUser} NombreSubsitio="" Subsitio="" Titulo="Titulo" context={this.props.context} Desabilitado={this.state.Editar} />

                           </div>
                        </div>
                     </div>
                  </div>
                  :
                  this.state.mostrarModal && this.state.boton !== "vermas"?
                  <div className="modal-container overflow-auto">
                  <div className="modal-window-Sintitutlo">
                     <div>
                        <div id="EncabezadoComponente">
                              <div>
                                 <span className='CerrarModalsintitulo'
                                    onClick={() => this.setState({ mostrarModal: false })}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                       <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                    </svg>
                                 </span>
                              </div>
                           
                        </div>

                        <div> <Componentes openModalExitoso={this.openModalExitoso} closeModal={this.closeModal} boton={this.state.boton} Id={this.state.IdMecanismoModal} Areas={this.props.SubAreas} Direcciones={this.props.Direcciones} currentUser={this.props.currentUser} NombreSubsitio="" Subsitio="" Titulo="Titulo" context={this.props.context} Desabilitado={this.state.Editar} />

                        </div>
                     </div>
                  </div>
               </div>
               :null
               }

               {this.state.mostrarModalExitoso ?
                  <div id='ModalExitoso'>
                     <div className='ventanaExitoso'>
                        <div className='cerrarVentanaExitoso'>
                           <button title='.' className='closeButton'
                              onClick={() => this.setState({ mostrarModal: false }, () => { this.setState({ mostrarModalExitoso: false }) })}><GrClose /></button>

                        </div>
                        <div className='textoVentanaExitoso'>
                           <p>{this.state.MensajeModal}</p>
                        </div>
                        {this.state.estado === "En ajustes" || this.state.estado === "En revision" || this.state.estado === "En pubicacion" || this.state.estado === "Asignar metadata" || this.state.estado === "En aprobacion" || this.state.estado === "Aprobado" ?
                           <div className='svgVentanaExitoso'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                                 <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM17.0607 10.5607L11.5607 16.0607C10.9749 16.6464 10.0251 16.6464 9.43934 16.0607L7.43934 14.0607C6.85355 13.4749 6.85355 12.5251 7.43934 11.9393C8.02513 11.3536 8.97487 11.3536 9.56066 11.9393L10.5 12.8787L14.9393 8.43934C15.5251 7.85355 16.4749 7.85355 17.0607 8.43934C17.6464 9.02513 17.6464 9.97487 17.0607 10.5607Z" fill="#00AE5A" />
                              </svg>
                           </div>
                           :
                           this.state.estado === "cancelada" ||  this.state.estado === "Rechazado" ?
                              <div className='svgVentanaExitoso'>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 45 45" fill="none">
                                    <path d="M24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4ZM32.6339 17.6161C32.1783 17.1605 31.4585 17.1301 30.9676 17.525L30.8661 17.6161L20.75 27.7322L17.1339 24.1161C16.6457 23.628 15.8543 23.628 15.3661 24.1161C14.9105 24.5717 14.8801 25.2915 15.275 25.7824L15.3661 25.8839L19.8661 30.3839C20.3217 30.8395 21.0416 30.8699 21.5324 30.475L21.6339 30.3839L32.6339 19.3839C33.122 18.8957 33.122 18.1043 32.6339 17.6161Z" fill="#B3B3B3" />
                                 </svg>                                 
                              </div>
                              : null
                        }

                        <div className='textoVentanaExitoso'>
                           {this.state.PieModal}
                        </div>
                     </div>
                  </div>
                  : null
               }
            </div>

         </>
      )
   }
}

export default withRouter(Aprobaciones)