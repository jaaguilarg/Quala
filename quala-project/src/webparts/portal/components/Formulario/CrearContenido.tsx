import * as React from 'react';
import { PNP } from '../Util/util';
import {withRouter } from 'react-router-dom'
import {
  PeoplePicker,
  PrincipalType,
} from '@pnp/spfx-controls-react/lib/PeoplePicker';
import '@pnp/sp/taxonomy';
import * as _ from "underscore";
import '@pnp/sp/sites';
import '@pnp/sp/features';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/content-types';
import '@pnp/sp/folders';
import '@pnp/sp/items';



export interface ICrearContenidoProps {
  Titulo: any
  context: any
  Subsitio: any
  NombreSubsitio: any
  match: any
  urlSitioPrincipal: any
  currentUser: any
  Direcciones: any
  Areas: any
  SubAreas: any
  history: any
  nombreMecanismo:any
  Seguridad:any

}



class CrearContenido extends React.Component<ICrearContenidoProps, any> {
  public pnp: PNP
  public AproArea = false
  public AproRoles = false
  public Apro = false

  constructor(props:any) {
    super(props)

    this.pnp = new PNP(this.props.context)

    var pasos = [
      { Title: 'Datos del Mecanismo' },
      { Title: 'Aprobadores' },
      { Title: 'Control de Cambios' },
    ]
    
    this.state = {
      tipo: '',
      seccionesOk: false,
      Aprobadores: [],
      urlSite: '',
      sitio: '',
      paises: [],
      urlSitePrincipal: '',
      sitioPrincipal: '',
      direcciones: this.props.Direcciones,
      areasTotal: this.props.Areas,
      areas: [],
      area: '',
      direccion: '',
      subAreasTotal: this.props.SubAreas,
      subAreas: [],
      subArea: '',
      modelos: [],
      pilares: [],
      pilar: '',
      drivers: [],
      driver: '',
      mecanismos: [],
      mecanismo: '',
      IdMecanismo: this.props.match.params.IdMecanismo ? this.props.match.params.IdMecanismo : 0,
      tiposMecanismos: [],
      tipoMecanismo: '',
      descripcionMecanismo: '',
      seguridad: '',
      PersonaSeguridad: [],
      Auditoria: false,
      plantas: [],
      AplicaPlanta: false,
      planta: '',
      plantasAplica: [],
      ArchivosAnexos: [],
      Archivos: [],
      AdjuntarUrl: false,
      url: '',
      falta: false,
      vacio: false,
      PersonaAprueba: '',
      revisa: '',
      PersonaElabora: 0,
      PersonaElaboraEMail: '',
      Area1: '',
      AprobadorArea1: '',
      Area2: '',
      AprobadorArea2: '',
      Area3: '',
      AprobadorArea3: '',
      Area4: '',
      AprobadorArea4: '',
      Auditor: '',
      JefeGh: '',
      GerenteGh: '',
      DirectorGh: '',
      DirectorArea: '',
      DirectorGeneral: '',
      LiderComiteInternacional: '',
      PresidenteEjecutivo: '',
      AprobadorExtra1: '',
      AprobadorExtra2: '',
      AprobadorExtra3: '',
      AprobadorExtra4: '',
      Motivo: '',
      Motivos: [],
      DescripcionMotivo: '',
      CompromisoDelCronograma: false,
      rolesAprobadores: [],
      cAprobadores: [],
      AprobadoresConRol: [],
      cAprobadoresArea: [],
      AprobadoresArea: [],
      cDemasAprobadores: [],
      secciones: pasos,
      posPaso: 0,
      Pasos: 'Datos del Mecanismo',
      Revisa: '',
      NombreConvertido: '',
      failedDoc: false,
      allDelete: false,
      enviado: false,
      Cancelar: false,
      Faq: [],
      DatosMecanismo: [],
      disabled: '',
      PersonasAprobadoras: [],
      disabledGerente: false,
      FaqSeguridad: '',
      FaqPlantaProduccion: '',
      faqCronograma: '',
      loading: false,
      dataMecanismo: {},
      cargando: false,
      ValorDocumentos: [],
      correosSeguridad: [],
      StatePrueba: '',
      faqCompromiso: '',
      faqAprobadores: '',
      faqDocumentosMecanismo: '',
      msjFinal: '',
      linkFinal: '',
      NombreMecanismo: 0,
      mecanismosBase: [],
      MecanismoNombre: '',
      gestores: [],
      FlujosDeTrabajo: [],
      DiaActual: '',
      FechaFinal: '',
      AprobadoresAreatotal: [],
      CantidadCaracteres: 0,
      MecanismosDelDriverLocal: true,
      OtroMecanismoOperacionalDriver: true,
      idMecanismo:"",
      NombreMecanismo1:"",
      deshabilitarBotonAuditoria:false,
      driver1: "",
      Areaconsulta: ""

    }
  }

  public componentWillMount(): void {
    
    let nombreMecanismo = this.props.match.params.NombreMecanismo || this.props.nombreMecanismo;
    let Seguridad = this.props.match.params.Seguridad || this.props.Seguridad
    
    if (nombreMecanismo !== undefined && Seguridad !== undefined) {
      this.ObtenerArchivos(nombreMecanismo, Seguridad)
        
      this.setState({
        estadoModal: true
      })

    }

    this.consultarAprobadoresArea()

    this.sumarDias()

    this.pnp.getCurrentUser().then((user) => {
      this.setState(
        {
          UserId: user.Id,
          UserName: user.Title,
        },
        () => {
          this.getGroups(user.Id)
        },
      )
    })

    this.consultarMensajeFinal()


    this.ConsultarFaq()

    if (this.state.IdMecanismo && this.state.IdMecanismo > 0) {
      this.setState(
        {
          VisorOk:
            this.props.match.params.Acceso +
            '/' +
            this.props.match.params.opcion,
        },
        () => {
          this.consultardatos(this.state.IdMecanismo)
        },
      )
    } else if (this.state.IdMecanismo && this.state.IdMecanismo == 0 && this.props.match.params.IdDriver && this.props.match.params.IdDriver > 0
    ) {
      this.setState(
        {
          VisorOk:
            this.props.match.params.Acceso +
            '/' +
            this.props.match.params.opcion,
        },
        () => {
          this.consultarMecanismoDriver(this.props.match.params.IdDriver)
        },
      )
    } else {
      this.setState(
        {
          VisorOk:
            this.props.match.params.Acceso +
            '/' +
            this.props.match.params.opcion,
        },
        () => {
          this.CargaInicial()
        },
      )
    }
  }

  //Funcion que valida si el mecanismo existe, y traer la informacion del mecanismo de lo contrario no trae ningun mecanismo
  public CargaInicial() { 
    var secciones:any = []

    if (!this.state.seccionesOk) {
      this.state.secciones.forEach((item:any, index:any) => {
        if (index == 1 && this.props.match.params.opcion == 2) {
          secciones.push({ Title: 'Documentos del Mecanismo' })
        } else if (index == 1 && this.props.match.params.opcion == 3) {
          secciones.push({ Title: 'Plan de acción de los contenidos' })
        }
        secciones.push(item)
      })

      this.setState({
        secciones: secciones,
        seccionesOk: true,
      })
    }

    this.consultarMatrizAprobacion()

    this.convertirPrimeraLetra()

    this.consultarRoles()

    this.plantas()
    this.consultarMotivos()

    this.paises()
    this.consultarDirecciones()
  }


//FUncion para filtrar los aprobadores de area
  private getAprobadoresPorArea(Direccion:any, Index:any) {
    var Areas = this.state.AprobadoresArea.filter(
      (x:{NombreDireccion:any}) => x.NombreDireccion == Direccion,
    )

    const cAprobadoresArea = [...this.state.cAprobadoresArea]

    cAprobadoresArea[Index]['AprobadoresNombreDireccion'] = Direccion

    this.setState({
      ['AreasDireccion' + Index]: Areas,
      cAprobadoresArea,
    })
  }

  // funcion para consulta de apropadores por area
  private consultarAprobadoresArea() {
    
    let users:any = [];

    this.pnp.getUsersByCountry('Nova').then((items) => {

      users = items;

    })
   

    var ViewXml =      `<FieldRef Name="Nombre_x0020_Direccion"/>
                        <FieldRef Name="Nombre_x0020_Area"/>`;    


    this.pnp.getListItemsWithTaxo('', 'Modelos Local', ViewXml,"",this.props.NombreSubsitio)
      .then((items) => {
        var AprobadoresArea:any = []

        items.forEach((d:any) => {
          users.forEach((u:any) => {
            if (d.AprobadorArea.length > 0) {
              AprobadoresArea.push({
                ID: d.ID,
                NombreDireccion: d.Direccion.Label,
                NombreArea: d.Area.Label,
                Aprobador: u.userName,
                AprobadorId: u.userId,
                AprobadorEmail: u.userEmail,
              })
            }
          })          
        })

        console.log(AprobadoresArea);

        this.setState({
          AprobadoresArea: AprobadoresArea,
        })
      })
  }

  // funcion para consultar FAQ de la lista
  private ConsultarFaq() {
    /*
    this.pnp.getListItemsRoot('Faq', ['*'], '', '').then((items) => {
      var faqSeguridad = items.filter((x:{Clave:any}) => x.Clave == 'Seguridad')
      var faqPlantaProduccion = items.filter(
        (x:{Clave:any}) => x.Clave == 'PlantaProduccion',
      )
      var faqCronograma = items.filter((x:{Clave:any}) => x.Clave == 'Cronograma')
      var faqCompromiso = items.filter(
        (x:{Clave:any}) => x.Clave == 'CompromisoDelCronograma',
      )
      var faqAprobadores = items.filter((x:{Clave:any}) => x.Clave == 'Aprobadores')
      var faqDocumentosActuales = items.filter(
        (x:{Clave:any}) => x.Clave == 'SeccionControlDeCambios',
      )

      if (faqAprobadores.length > 0) {
        this.setState({
          faqAprobadores: faqAprobadores[0].Title,
        })
      }

      if (faqDocumentosActuales.length > 0) {
        this.setState({
          faqDocumentosMecanismo: faqDocumentosActuales[0].Title,
        })
      }

      if (faqSeguridad.length > 0) {
        this.setState({
          FaqSeguridad: faqSeguridad[0].Title,
        })
      }

      if (faqCompromiso.length > 0) {
        this.setState({
          faqCompromiso: faqCompromiso[0].Title,
        })
      }

      if (faqPlantaProduccion.length > 0) {
        this.setState({
          FaqPlantaProduccion: faqPlantaProduccion[0].Title,
        })
      }

      if (faqCronograma.length > 0) {
        this.setState({
          faqCronograma: faqCronograma[0].Title,
        })
      }
    })*/
  }
  // funcion para eliminar aprobadores del formulario
  private elimindarAprobadores(index:any, NombreArray:any) {
    /*
    const cAprobadoresArea = this.state[NombreArray]

    cAprobadoresArea.splice(index, 1)

    this.setState(
      {
        [NombreArray]: [],
      },
      () => {
        this.setState({
          [NombreArray]: cAprobadoresArea,
        })
      },
    )*/
  }

  private convertirPrimeraLetra() {
    if (this.props.NombreSubsitio) {   
      this.setState(
        {
          NombreConvertido: this.props.NombreSubsitio,
        },
        () => {
          //this.pnp.getGroups
        },
      )
    } else {
    }
  }

  //funcion para consultar mecanismo
  private consultaMecanismoLocal(NombreDriver:any) {
    
    this.setState({
      descripcionMecanismo: "",
      NombreMecanismo: 0,
      mecanismosBase: [],
      OtroMecanismoOperacionalDriver: true,
      MecanismosDelDriverLocal: true

    })

    if (this.props.match.params.opcion == 1) {

      this.pnp.getListItems(

        "MecanismoFilial",
        ["*", "NombreDriver/Id", "NombreDriver/NombreDriver"],
        `NombreDriver/NombreDriver eq '${NombreDriver}' and Implementado eq 0`,
        "NombreDriver"
      ).then((items) => {
        console.log(items);

        if (items.length > 0) {
          this.setState({
            mecanismosBase: items,
            OtroMecanismoOperacionalDriver: false
          })

          items.forEach((item:any) => {
            if (item.SeccionMecanismo == "Otro Mecanismo Operacional") {
              this.setState({ OtroMecanismoOperacionalDriver: false })
            }

          })

          items.forEach((item:any) => {

            if (item.SeccionMecanismo == "Mecanismo del Driver") {

              this.setState({ MecanismosDelDriverLocal: false })

            }

          })



        } else {
          this.setState({
            NombreMecanismo: 0,
            mecanismosBase: [],
            OtroMecanismoOperacionalDriver: false,
            MecanismosDelDriverLocal: true

          })

        }



      })

    }
    else {
      this.pnp.getListItems(

        "MecanismoFilial",

        ["*", "NombreDriver/Id", "NombreDriver/NombreDriver"],

        `NombreDriver/NombreDriver eq '${NombreDriver}' and Implementado eq 1`,

        "NombreDriver"

      ).then((items) => {

        console.log(items);


        if (items.length > 0) {

          this.setState({

            mecanismosBase: items

          })



          items.forEach((item:any) => {

            if (item.SeccionMecanismo == "Otro Mecanismo Operacional") {

              this.setState({ OtroMecanismoOperacionalDriver: false })

            }

          })

          items.forEach((item:any) => {

            if (item.SeccionMecanismo == "Mecanismo del Driver") {

              this.setState({ MecanismosDelDriverLocal: false })

            }

          })



        } else {

          this.setState({

            NombreMecanismo: 0,

            mecanismosBase: [],

            OtroMecanismoOperacionalDriver: true,

            MecanismosDelDriverLocal: true

          })

        }



      })
    }

  

  } 

  //Funcion que guarda los documentos de en la biblioteca segun el modelo.
  private GuardarDocumentos() {
    /*if (
      this.props.match.params.opcion == 1 &&
      this.props.match.params.IdMecanismo !== undefined
    ) {
      this.setState({
        mecanismo: this.state.mecanismoNombre1,
      })
    }

    this.setState(
      {
        loading: true,
      },
      () => {
        this.pnp.createdFolder(
          this.state.mecanismo,
          'Biblioteca Colabora/Carpeta Revision',
        ).then((res) => {
          var url = 'https://qualasa.sharepoint.com' + res.data.ServerRelativeUrl

          this.state.Archivos.forEach((items:any) => {
            let enfile: File = items
            this.pnp.uploadFileFolder(
              enfile.name,
              enfile,
              this.state.mecanismo,
              'Biblioteca Colabora/Carpeta Revision',
            ).then((res) => console.log)
          })

          this.pnp.createdDocumentSet(
            "Biblioteca Colabora",
            "Carpeta Revision",
            this.state.mecanismo
          )

          this.InsertarDatos(url)
        })
      },
    )*/
  }

  //Funcion que guarda el registro de los aprobadores asignados al mecanismo
  private GuardarAprobadores(IdRegistro:any) {
    this.AproRoles = true
    this.AproArea = true
    this.Apro = true

    this.state.cAprobadores.forEach((item:any, i:any) => {
      this.AproRoles = false

      let obj = {
        Title: 'Rol',
        AprobadorId: item.AprobadoresConRol,
        Cargo: item.Cargo,
        MecanismoId: IdRegistro,
        IdSolicitudId: IdRegistro
      }

      this.pnp.insertItemRoot('Aprobadores', obj).then((items) => {
        if (this.state.cAprobadores.length - 1 == i) {
          //console.log("Registrado con ese usuario " + item.AprobadoresConRol)
          this.AproRoles = true
          if (this.AproRoles && this.AproArea && this.Apro) {
            this.finishSave()
          }
        }
      })
    })

    this.state.cAprobadoresArea.forEach((item:any, j:any) => {
      this.AproArea = false

      let obj1 = {
        Title: 'Area',
        AprobadorId: item.AprobadoresArea,
        Cargo: item.Area,
        Area: item.AprobadoresNombreArea,
        MecanismoId: IdRegistro,
      }

      this.pnp.insertItemRoot('Aprobadores', obj1).then((items) => {
        if (this.state.cAprobadoresArea.length - 1 == j) {
          //console.log("Registro con usuario de area " + item.AprobadoresArea)
          this.AproArea = true
          if (this.AproRoles && this.AproArea && this.Apro) {
            this.finishSave()
          }
        }
      })
      //j=j+1
    })

    this.state.cDemasAprobadores.forEach((item:any, k:any) => {
      this.Apro = false

      let obj2 = {
        Title: 'Otros',
        AprobadorId: item.DemasAprobadores,
        MecanismoId: IdRegistro,
      }
      this.pnp.insertItem('Aprobadores', obj2).then((items) => {
        if (this.state.cDemasAprobadores.length - 1 == k) {

          this.Apro = true
          if (this.AproRoles && this.AproArea && this.Apro) {
            this.finishSave()
          }
        }
      })
    })

    if (
      this.state.cAprobadores.length <= 0 &&
      this.state.cAprobadoresArea <= 0 &&
      this.state.cDemasAprobadores.length <= 0
    ) {
      this.finishSave()
    }
  } 

  public finishSave() {
    /*this.setState({
      Pasos: 'success',
      enviado: true,
      loading: false,
    })*/
  }

  private _getPeoplePicker(items: any[], objeto:any) {
    /*this.setState({
      [objeto]: items[0].id,
      [objeto + 'EMail']: items[0].secondaryText,
    })*/
  }
  // funcion para agregar linea a demas aprobadores
  private addDemasAprobadores(arg0: string): void {
    /*var c = []
    const cDemasAprobadores = [...this.state.cDemasAprobadores]

    c = cDemasAprobadores

    var pos = {
      p: 0,
    }

    c.push(pos)
    this.setState({ cDemasAprobadores: c })*/
  }

  //Funcion para añadir mas lineas para agregar aprobadores.
  private addAprobadoresArea(arg0: string): void {
   /* var c = []
    const cAprobadoresArea = [...this.state.cAprobadoresArea]
    c = cAprobadoresArea
    var pos = {
      p: 0,
    }
    c.push(pos)
    this.setState({ cAprobadoresArea: c })*/
  }

  private selectPlanAccion(target:any, index:any) {
   /* let Archivos = this.state.Archivos
    let ValorDocumentos = this.state.ValorDocumentos

    let indexAux = Archivos.findIndex((x:{pos:any}) => x.pos === index)

    if (indexAux > -1) {
      Archivos.splice(indexAux, 1)
    }

    var plan = {
      Accion: target.value,
      file: this.state.documentosMecanismo[index],
      pos: index,
    }

    ValorDocumentos['PlanAccion' + index] = target.value

    Archivos.push(plan)

    this.setState({
      Archivos: Archivos,
      failedDoc: false,
      allDelete: false,
      ValorDocumentos: ValorDocumentos,
    })*/
  }
// FUncion para actualizar el plan de accion de los documentos
  private ActualizarPlanAccion() {
    /*this.setState(
      {
        loading: true,
      },
      () => {
        if (
          this.props.match.params.opcion !== 1 &&
          this.props.match.params.IdMecanismo !== undefined
        ) {
          this.setState({
            mecanismo: this.state.mecanismoNombre1,
          })
        }
    
        this.setState(
          {
            loading: true,
          },
          () => {
            this.pnp.createdFolder(
              this.state.mecanismo,
              'Biblioteca Colabora/Carpeta Revision',
            ).then((res) => {
              var url = 'https://qualasa.sharepoint.com' + res.data.ServerRelativeUrl
    
              this.state.Archivos.forEach((items:any) => {
                let enfile: File = items
                this.pnp.uploadFileFolder(
                  enfile.name,
                  enfile,
                  this.state.mecanismo,
                  'Biblioteca Colabora/Carpeta Revision',
                ).then((res) => console.log)
              })
    
              this.pnp.createdDocumentSet(
                "Biblioteca Colabora",
                "Carpeta Revision",
                this.state.mecanismo
              )
    
              this.InsertarDatos(url)
            })
          },
        )



        this.state.Archivos.forEach((items:any, i:any) => {
          if (items.file) {
            let enfile: File = items.file

            var data = { Accion: items.Accion }

            

            this.pnp
              .updateFileFolder(
               
                items.file.Name,
                enfile,
                this.state.dataMecanismo.NombreMecanismo,
                'Biblioteca Colabora/Carpeta Revision',
                data,
              )
              .then((res) => {
                this.updateMotivos('Actualización')
              })
          }
          else {
            let enfile: File = items

            var data = { Accion: items.Accion }

            this.pnp
              .updateFileFolder(
                items.name,
                enfile,
                this.state.dataMecanismo.NombreMecanismo,
                'Biblioteca Colabora/Carpeta Revision',
                data,
              )
              .then((res) => {
                //console.log("Actualizado con exito")
                this.updateMotivos('Actualización')
              })
          }
        })
      },
    )*/
  }

  //Funcion que consulta los distintos roles de la lista RolesAprobadores y devuelve un objeto con la informacion de esta.
  private consultarRoles() {
    /*this.pnp.getListItems('RolesAprobadores', ['*'], '', '').then((res) => {
      this.setState({
        rolesAprobadores: res,
      })
    })*/
  }

  private consultarMensajeFinal() {
    this.pnp
      .getListItemsRoot('ParametrosGenerales', ['*'], '', '')
      .then((items) => {
        var msjFinal = items.filter((x:{Llave:any}) => x.Llave == 'MensajeDeExito')
        var linkFinal = items.filter((x:{Clave:any}) => x.Clave == 'LinkMensajeFinal')
        if (msjFinal.length > 0) {
          this.setState({
            msjFinal: msjFinal[0].Title,
          })
        }

        if (linkFinal.length > 0) {
          this.setState({
            linkFinal: linkFinal[0].Title,
          })
        }
      })
  }

  //Funcion que suma los dias habiles a la fecha de inicio de la labor.
  private sumarDias() {
    let hoy = new Date()
    let hoy1 = new Date()

    this.setState({
      DiaActual: hoy1,
    })

    this.pnp.getListItems('FlujosDeTrabajo', ['*'], "Clave eq 'Enrevision'", '').then((items) => {
      this.setState(
        {
          FlujosDeTrabajo: items[0],
        },
        () => {
          var i = 1

          //hoy.setDate(hoy.getDate()+1)
          var diasSumar = this.state.FlujosDeTrabajo.Dias

          while (i <= diasSumar) {
            if (hoy.getDay() == 0 || hoy.getDay() == 6) {
              hoy.setDate(hoy.getDate() + 1)
            } else {
              hoy.setDate(hoy.getDate() + 1)

              this.setState({
                FechaFinal: hoy,
              })

              i = i + 1
            }
          }
        },
      )
    })
  } 

  /*Funcion que permite guardar los datos en el mecanismo Filial
  private InsertarDatos(urlDocumento:any) {
    let pilar


    if (this.state.pilar !== 'No aplica') {
      pilar = this.state.pilares.filter((x:{ID:any}) => x.ID == this.state.pilar)[0].Pilar
    } else {
      pilar = 'No aplica'
      this.setState({ driver: 'No aplica' })
    }

    if (this.props.match.params.IdMecanismo !== undefined) {
      this.setState({
        driver: this.state.driver1
      })
    }

    if (
      this.props.match.params.opcion == 1 &&
      this.props.match.params.IdMecanismo !== undefined
    ) {
      this.setState({
        mecanismo: this.state.mecanismoNombre1,
      })
    }

    if (this.state.plantasAplica == '' && this.state.PersonaSeguridad == '') {
      let obj = {
        Title: this.state.mecanismo,
        Pais:this.state.NombreConvertido,
        NombreMecanismo: this.state.mecanismo,
        RequiereAuditoria: this.state.Auditoria,
        Seguridad: this.state.seguridad,
        NombreDriver: this.state.driver,
        NombreDocumentSet: this.state.mecanismo,
        UrlDocumentSet: urlDocumento,
        Motivo: this.state.Motivo,
        DescripcionMotivo: this.state.DescripcionMotivo,
        ElaboraId: this.state.PersonaElabora,
        RevisaId: this.state.PersonaRevisa,
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En revisión',
        DIreccion: this.state.direccion,
        Area: this.state.area,
        Pilar: pilar,
        IdPilar:this.state.pilar,
        ID_Mecanismo: this.state.idMecanismo,
        TipoMecanismo: this.state.tipoMecanismo,
        SeccionMecanismo: this.state.descripcionMecanismo,
        SubArea: this.state.subArea,
        // Url: this.state.Url,
        TipoSolicitud: 'Creación',
        FechaInicio: new Date(this.state.DiaActual).toISOString(),
        FechaFin: new Date(this.state.FechaFinal).toISOString(),
      }
      this.pnp.insertItemRoot('ListaDeControl', obj).then((items) => {
        this.GuardarAprobadores(items.ID)
      })
    } else if (
      this.state.plantasAplica == '' && this.state.PersonaSeguridad != ''
    ) {
      let obj = {
        Title: this.state.mecanismo,
        Pais:this.state.NombreConvertido,
        NombreMecanismo: this.state.mecanismo,
        RequiereAuditoria: this.state.Auditoria,
        Seguridad: this.state.seguridad,
        NombreDriver: this.state.driver,
        NombreDocumentSet: this.state.mecanismo,
        PersonaSeguridadId: {
          results: this.state.PersonaSeguridad,
        },
        TipoMecanismo: this.state.tipoMecanismo,
        SeccionMecanismo: this.state.descripcionMecanismo,
        UrlDocumentSet: urlDocumento,
        Motivo: this.state.Motivo,
        DescripcionMotivo: this.state.DescripcionMotivo,
        ElaboraId: this.state.PersonaElabora,
        RevisaId: this.state.PersonaRevisa,
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En revisión',
        DIreccion: this.state.direccion,
        Area: this.state.area,
        Pilar: pilar,
        ID_Mecanismo: this.state.idMecanismo,
        IdPilar:this.state.pilar,
        SubArea: this.state.subArea,
        // Url: this.state.Url,
        TipoSolicitud: 'Creación',
        FechaInicio: new Date(this.state.DiaActual).toISOString(),
        FechaFin: new Date(this.state.FechaFinal).toISOString(),
      }
      this.pnp.insertItemRoot('ListaDeControl', obj).then((items) => {


        this.GuardarAprobadores(items.ID)
      })
    } else if (
      this.state.plantasAplica != '' &&
      this.state.PersonaSeguridad == ''
    ) {
      let obj = {
        Title: this.state.mecanismo,
        Pais:this.state.NombreConvertido,
        NombreMecanismo: this.state.mecanismo,
        RequiereAuditoria: this.state.Auditoria,
        Seguridad: this.state.seguridad,
        Planta: this.state.plantasAplica.join(';'),
        NombreDriver: this.state.driver,
        NombreDocumentSet: this.state.mecanismo,
        TipoMecanismo: this.state.tipoMecanismo,
        SeccionMecanismo: this.state.descripcionMecanismo,
        UrlDocumentSet: urlDocumento,
        Motivo: this.state.Motivo,
        DescripcionMotivo: this.state.DescripcionMotivo,
         ElaboraId: this.state.PersonaElabora,
         RevisaId: this.state.PersonaRevisa,
         ApruebaId: this.state.PersonaAprueba,
          EstadoSolicitud: 'En revision',
         DIreccion: this.state.direccion,
         Area: this.state.area,
         Pilar: pilar,
         IdPilar:this.state.pilar,
         ID_Mecanismo: this.state.idMecanismo,
        // SubArea: this.state.subArea,
        // Url: this.state.Url,
         TipoSolicitud: 'Creación',
         FechaInicio: new Date(this.state.DiaActual).toISOString(),
         FechaFin: new Date(this.state.FechaFinal).toISOString(),
      }
      this.pnp.insertItemRoot('ListaDeControl', obj).then((items) => {
        this.GuardarAprobadores(items.ID)
      })
    } else {
      let obj = {
        Title: this.state.mecanismo,
        Pais:this.state.NombreConvertido,
        NombreMecanismo: this.state.mecanismo,
        RequiereAuditoria: this.state.Auditoria,
        Seguridad: this.state.seguridad,
        Planta: this.state.plantasAplica.join(';'),
        NombreDriver: this.state.driver,
        NombreDocumentSet: this.state.mecanismo,
        PersonaSeguridadId: this.state.PersonaSeguridad,
        TipoMecanismo: this.state.tipoMecanismo,
        SeccionMecanismo: this.state.descripcionMecanismo,
        UrlDocumentSet: urlDocumento,
        Motivo: this.state.Motivo,
        DescripcionMotivo: this.state.DescripcionMotivo,
        ElaboraId: this.state.PersonaElabora,
        RevisaId: this.state.PersonaRevisa,
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En revision',
        DIreccion: this.state.direccion,
        Area: this.state.area,
        Pilar: pilar,
        IdPilar:this.state.pilar,
        ID_Mecanismo: this.state.idMecanismo,
        // Url: this.state.Url,
        TipoSolicitud: 'Creación',
        FechaInicio: new Date(this.state.DiaActual).toISOString(),
        FechaFin: new Date(this.state.FechaFinal).toISOString(),
      }

      this.pnp.insertItemRoot('ListaDeControl', obj).then((items) => {
        this.GuardarAprobadores(items.ID)
      })
    }
  }*/

  //Funcion que consulta los motivos de la lista parametrosGenerales y devuelve un objeto con esta informacion.
  private consultarMotivos() {
   /* this.pnp
      .getListItems(
        'ParametrosGenerales',
        ['*'],
        "Clave eq 'Motivo' and Activo eq 1",
        '',
      )
      .then((res) =>
        this.setState({
          Motivos: res,
        }),
      )*/
  }

  // Funcion que valida si se adjuntado un archivo al elemnto de tipo file.
  private onChangeFile(e:any) {
   /* const Archivos = [...this.state.Archivos]

    if (e) {

      for (var i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i]
        Archivos.push(file)
        this.setState({ Archivos }, () => {

        })

      }






    }*/
  }

  //Funcion que consulta las plantas y devuelve un objeto con la informacion de estas.
  private plantas() {
   /* this.pnp.getListItems('Plantas', ['*'], '', '').then((items) => {
      this.setState({ plantas: items })
    })*/
  }

  //Funcion que asocia al usuario de seguridad  que se colocan en el campo PeoplePicker.
  private _getPeoplePickerSeguridad(items: any[]) {
   /* let PersonasSeguridad = []
    let PersonaSeguridadEmail = []
    for (let item in items) {
      PersonasSeguridad.push(items[item].id)

      PersonaSeguridadEmail.push(items[item].secondaryText)
    }

    this.setState({
      PersonaSeguridad: PersonasSeguridad,
      PersonaSeguridadEmail: PersonaSeguridadEmail,
      correosSeguridad: PersonaSeguridadEmail
    })*/
  }

  //Funcion que permite añadir a un array los aprobadores del area
  private _getPeoplePickerG(items: any[], index:any) {
   /* const cAprobadoresArea = [...this.state.cAprobadoresArea]
    cAprobadoresArea[index]['AprobadoresArea'] = items[0].id
    cAprobadoresArea[index]['AprobadoresAreaEmail'] = items[0].secondaryText

    this.setState({
      cAprobadoresArea,
    })*/
  }

//Funcion que permite añadir a un array los aprobadores
  private getAprobadoresArea(id:any, index:any) {
   /* const cAprobadoresArea = [...this.state.cAprobadoresArea]

    var items = this.state.AprobadoresArea.filter((x:{ID:any}) => x.ID == id)

    cAprobadoresArea[index]['AprobadoresArea'] = items[0].AprobadorId
    cAprobadoresArea[index]['AprobadoresAreaEmail'] = items[0].AprobadorEmail
    cAprobadoresArea[index]['AprobadoresNombreArea'] = items[0].NombreArea
    cAprobadoresArea[index]['AprobadoresNombreAreaId'] = items[0].ID

    this.setState({
      cAprobadoresArea,
    })*/
  }

  //Funcion que permite añadir a un array los demas aprobadores del area  
  private getPeoplePickerDemasAprobadores(items: any[], index:any) {
   /* const cDemasAprobadores = [...this.state.cDemasAprobadores]

    cDemasAprobadores[index]['DemasAprobadores'] = items[0].id
    cDemasAprobadores[index]['DemasAprobadoresEmail'] = items[0].secondaryText

    this.setState({
      cDemasAprobadores,
    })*/
  }

  //Funcion que asigna datos desde el directorio activo usando el elemento people picker.
  private getPeoplePickerOtrosAprobadores(items: any[], index:any, rol:any) {
   /* const cAprobadores = [...this.state.cAprobadores]

    cAprobadores[index]['AprobadoresConRol'] = items[0].id
    cAprobadores[index]['Cargo'] = rol

    this.setState({
      cAprobadores,
    })*/
  }

  // Funion que consulta los paises desde el sitio principal y retorna un objeto con esta informacion.
  public paises() {
   /* this.pnp.getListItemsRoot('Paises', ['Title'], '', '').then((res) =>
      this.setState({
        paises: res,
      }),
    )*/
  }

  // Funcion que consulta las direcciones desde el sitio principal y retorna un objeto con esta informacion.
  public consultarDirecciones() {
   /* if (this.state.dataMecanismo) {
      this.setState({
        direccion: this.state.dataMecanismo.DIreccion,
      })

      this.consultarAreas(this.state.dataMecanismo.DIreccion)
    }
    this.consultarTipoMecanismo()*/
  }

  //Funcion que consulta las areas por direcciones.
  public consultarAreas(nombreDireccion:any) {   
      this.setState(
      {
        areas: this.state.areasTotal.filter(
          (x:{Direccion:any}) => x.Direccion == nombreDireccion,
        ),
      },
      () => {
        if (this.state.dataMecanismo) {
          this.setState({
            area: this.state.dataMecanismo.Area,
          })
          this.consultarSubarea(this.state.dataMecanismo.Area)
          this.ConsultarModelos(this.state.dataMecanismo.Area)
        }
      },
    )
  }

  //Funcion que consulta los driver de cada pilar recibe como parametro el id del pilar al que se le va consultar.
  private consultarDriver(IdPilar:any) {
   this.pnp
      .getListItems(
        'DriverFilial',
        ['*', 'Pilar/ID'],
        'Pilar/ID eq ' + IdPilar,
        'Pilar',
      )
      .then((res) =>
        this.setState(
          {
            drivers: res,
          },
          () => {
            if (this.state.dataMecanismo) {
              if (res.length > 0) {
                this.setState({
                  driver: this.state.dataMecanismo.NombreDriverId,
                })

                this.consultarMecanismo(this.state.dataMecanismo.NombreDriverId)
              }
            }
          },
        ),
      )
  }

  //Funcion que consulta los tipos de mecanismo.
  public consultarTipoMecanismo() {
   /* this.pnp
      .getListItems(
        'ParametrosGenerales',
        ['*'],
        "Clave eq 'tipoMecanismo'",
        '',
        '',
      )
      .then((res) => {
        if (res.length > 0) {
          this.setState({
            tiposMecanismos: res,
          })
        }
      })*/
  }

  //Funcion que consulta los mecanismos segun el driver seleccionado.
  public consultarMecanismo(Driver:any) {

   /* if (this.props.match.params.opcion !== "1") {
      this.pnp.getListItems(
        'MecanismoFilial',
        ['*', 'NombreDriver/Id'],
        'NombreDriver/Id eq ' + Driver,
        'NombreDriver',
      )
        .then((res) => {

          if (res.length > 0) {
            this.setState(
              {
                mecanismos: res,
              },
              () => {
                if (this.state.dataMecanismo) {
                  if (res.length > 0) {


                    this.setState({
                      mecanismo: this.state.dataMecanismo.ID,
                      tipoMecanismo: this.state.dataMecanismo.TipoMecanismo,
                      seguridad: this.state.dataMecanismo.Seguridad,
                      descripcionMecanismo: this.state.dataMecanismo
                        .SeccionMecanismo,
                      NombreMecanismo: 2,
                      Auditoria: this.state.dataMecanismo.RequiereAuditoria,
                      AplicaPlanta: this.state.dataMecanismo.Planta
                        ? true
                        : false,
                      plantasAplica:
                        this.state.dataMecanismo.Planta != null
                          ? this.state.dataMecanismo.Planta.split(';')
                          : [],
                      Url: this.state.dataMecanismo.Url,
                      AdjuntarUrl:
                        this.state.dataMecanismo.Url != '' ? true : false,
                        Areaconsulta: this.state.dataMecanismo.Area
                    })

                    this.ObtenerArchivos(this.state.dataMecanismo.NombreMecanismo, this.state.dataMecanismo.Seguridad)
                  }
                }
              },
            )
          }
        })
    }
    */
  }

  //Funcion que consulta los mecanismos segun el driver seleccionado.
  public consultarMecanismoFiltro(Driver:any, seccion:any) {
    if (this.props.match.params.opcion == 1) {
      this.pnp.getListItems(
        'MecanismoFilial',
        ['*', 'NombreDriver/Id', 'NombreDriver/NombreDriver'],
        "Implementado eq 0 and NombreDriver/NombreDriver eq '" + Driver + "'" + " and SeccionMecanismo eq '" + seccion + "'",
        'NombreDriver',
      )
      .then((res) => {
        if (res.length > 0) {
          this.setState(
            {
              mecanismos: res,
            },
            () => {
              if (this.state.dataMecanismo) {
                if (res.length > 0) {
                  console.log(res)

                  this.setState({
                    mecanismo: this.state.dataMecanismo.ID,
                    tipoMecanismo: this.state.dataMecanismo.TipoMecanismo,
                    seguridad: this.state.dataMecanismo.Seguridad,
                    descripcionMecanismo: seccion,
                    NombreMecanismo: 2,
                    Auditoria: this.state.dataMecanismo.RequiereAuditoria,
                    AplicaPlanta: this.state.dataMecanismo.Planta ? true : false,
                    plantasAplica: this.state.dataMecanismo.Planta != null ? this.state.dataMecanismo.Planta.split(';') : [],
                    Url: this.state.dataMecanismo.Url,
                    AdjuntarUrl: this.state.dataMecanismo.Url != '' ? true : false,
                    Areaconsulta: this.state.dataMecanismo.Area
                  })

                  this.ObtenerArchivos(this.state.dataMecanismo.NombreMecanismo, this.state.dataMecanismo.Seguridad)
                }
              }
            },
          )
        } else {

          this.setState({
            mecanismos: []
          })

        }
      })
    }
    else {
      this.pnp.getListItems(
        'MecanismoFilial',
        ['*', 'NombreDriver/Id', 'NombreDriver/NombreDriver'],
        "Implementado eq 1 and NombreDriver/NombreDriver eq '" + Driver + "'" + " and SeccionMecanismo eq '" + seccion + "'",
        'NombreDriver',
      )
        .then((res) => {
          if (res.length > 0) {
            this.setState(
              {
                mecanismos: res,
              },
              () => {
                if (this.state.dataMecanismo) {
                  if (res.length > 0) {
                    console.log(res)

                    this.setState({
                      mecanismo: this.state.dataMecanismo.ID,
                      tipoMecanismo: this.state.dataMecanismo.TipoMecanismo,
                      seguridad: this.state.dataMecanismo.Seguridad,
                      descripcionMecanismo: seccion,
                      NombreMecanismo: 2,
                      Auditoria: this.state.dataMecanismo.RequiereAuditoria,
                      AplicaPlanta: this.state.dataMecanismo.Planta ? true : false,
                      plantasAplica: this.state.dataMecanismo.Planta != null ? this.state.dataMecanismo.Planta.split(';') : [],
                      Url: this.state.dataMecanismo.Url,
                      AdjuntarUrl: this.state.dataMecanismo.Url != '' ? true : false,
                      Areaconsulta: this.state.dataMecanismo.Area
                    })

                    this.ObtenerArchivos(this.state.dataMecanismo.NombreMecanismo, this.state.dataMecanismo.Seguridad)
                  }
                }
              },
            )
          } else {

            this.setState({
              mecanismos: []
            })

          }
        })

    }

  }

  //FUncion que cosnulta la persona de seguridad asignado al mecanismo
  public consultarPersonaSeguridad() {
    /*this.pnp
      .getListItems(
        'MecanismoFilial',
        ['*', ''],
        'ID eq 71', '').then((items) => {
          console.log('Email aprobadores'), console.log(items)
        })*/
  }

  //Funcion que consulta las subareas recibe como parametro el nombre del area.
  public consultarSubarea(nombreArea:any) {
    this.setState(
      {
        subAreas: this.state.subAreasTotal.filter((x:any) => x.Area == nombreArea),
      },
      () => {
        if (this.state.dataMecanismo) {
          this.setState({
            subArea: this.state.dataMecanismo.SubArea,
          })
          this.ConsultarModelos(this.state.dataMecanismo.subArea)
        }
      },
    )
  }

  //Funcion que consulta los pilares filtrando por el nombre del modelo recibe como parametro el nombre del modelo.
  public ConsultarPilares(NombreModelo:any) {
    this.pnp
      .getListItems(
        'Pilares Local',
        ['*', 'ID_x0020_Modelo_x0020_Local/Nombre_x0020_Modelo_x0020_Local'],
        "No_x0020_Pilar ne 0 and ID_x0020_Modelo_x0020_Local/Nombre_x0020_Modelo_x0020_Local eq '" + NombreModelo + "'",
        'ID_x0020_Modelo_x0020_Local',
      )
      .then((res) => {
        if (res.length > 0) {
          this.setState(
            {
              pilares: res,
            },
            () => {
              if (this.state.dataMecanismo) {
                var pilar = res.filter(
                  (x:{Pilar:any}) => x.Pilar == this.state.dataMecanismo.Pilar,
                )

                if (pilar.length > 0) {
                  this.setState({
                    pilar: pilar[0].ID,
                  })

                  this.consultarDriver(pilar[0].ID)
                }
              }
            },
          )
        }
      })
  }

  // Funcion que consulta los modelos recibe como parametro el nombre del area o direccion o sub area al cual consultar.
  public ConsultarModelos(NombreCorrespondencia:any) {
    var filter = NombreCorrespondencia

    this.pnp
      .getListItems(
        'Modelos',
        ['*'],
        "Correspondencia eq '" + filter + "'",
        '',"",0,this.props.NombreSubsitio
      )
      .then((res) => {
        if (res.length > 0) {
          this.setState(
            {
              modelos: res,
              pilares: [],
            },
            () => {
              this.ConsultarPilares(res[0].Title)
            },
          )
        }
      })
  }

  //funcion que ayuda a revisar los cambios en los estados de los elementos html.
  public inputChange(target: any) {
    const { name, value } = target;

    console.log(name);
    this.setState({ [name]: value });

    switch (name) {
        case 'direccion':
            this.consultarAreas(value);
            break;
        case 'area':
            this.handleAreaChange(value);
            break;
        case 'subArea':
            this.ConsultarModelos(value);
            break;
        case 'OtroMecanismo':
            this.handleOtroMecanismo(value);
            break;
        case 'pilar':
            this.handlePilarChange(value);
            break;
        case 'MecanismoDriver':
            this.handleMecanismoDriver(value);
            break;
        case 'driver':
            this.handleDriverChange(value);
            break;
        case 'continuar':
            this.handleContinuar();
            break;
        case 'mecanismo':
            this.handleMecanismoChange(value);
            break;
        case 'planta':
            this.handlePlantaChange(value);
            break;
        case 'tipoMecanismo':
            this.consultarMatrizAprobacion();
            break;
        default:
            break;
    }
  }

  private handleAreaChange(value: any) {
      
      this.consultarSubarea(value);
      this.ConsultarModelos(value);
  }

  private handleOtroMecanismo(value: any) {
    this.setState(
      {
        NombreMecanismo: 2,
        mecanismo: '',
        descripcionMecanismo: 'Otro Mecanismo Operacional',
      },
      () => {
        if (this.props.match.params.Acceso == 2) {
          this.consultarMecanismoFiltro(this.state.driver,'Otro Mecanismo Operacional',)
        } 
        else if (this.props.match.params.opcion == "1"){
          this.setState({NombreMecanismo:1})
        }
        else {
          if (this.props.match.params.opcion !== "1") {
            this.consultarMecanismo(this.state.driver)
          } else {
            this.setState({
              descripcionMecanismo: 'Otro Mecanismo Operacional',
            })
          }

        }
      },
    )
  }

  private handlePilarChange(value: any) {
      if (value === 'No aplica') {
          this.setState({ drivers: [] });
      } else {
          this.consultarDriver(value);
      }
  }

  private handleMecanismoDriver(value: any) {
    this.setState(
      {
        Auditoria:false,
        NombreMecanismo: 1,
        descripcionMecanismo: 'Mecanismo del Driver',
        mecanismo: '',
      },
      () => {
        if (this.props.match.params.Acceso == 2) {
          this.consultarMecanismoFiltro(
            this.state.driver,
            'Mecanismo del Driver',
          )
        } else {
        }
      },
    )
  }

  private handleDriverChange(value: any) {
      this.consultarMecanismo(value);
      this.consultaMecanismoLocal(value);
  }

  private handleContinuar() {
    const { pasos, posPaso } = this.state;
      console.log(pasos +"--"+posPaso);
      if (pasos == 'Datos del Mecanismo') {
        if (this.props.match.params.opcion === '1') {

          if (this.state.seguridad === 'Confidencial' && this.state.PersonaSeguridadEmail.length == "") {
            this.setState({falta: true,})
          } else {
            if (
              this.state.seguridad !== "" &&
              this.state.direccion !== undefined &&
              this.state.area !== undefined &&
              this.state.pilar !== "" &&
              this.state.driver !== undefined &&
              this.state.mecanismo !== "" &&
              this.state.tipoMecanismo && this.state.tipoMecanismo.length >= 1 &&
              this.state.AplicaPlanta == false && (this.state.Archivos &&
              this.state.Archivos.length >= 1  || this.state.Url && this.state.Url.length >12)

            ) {
              this.setState({
                Pasos: this.state.secciones[posPaso + 1].Title,
                posPaso: posPaso + 1,
                falta: false,
              })
            } else {

              if (
                this.state.AplicaPlanta == true &&
                this.state.plantasAplica.length > 0 &&
                this.state.seguridad !== undefined &&
                this.state.direccion !== undefined &&
                this.state.area !== undefined &&
                this.state.pilar !== undefined &&
                this.state.driver !== undefined &&
                this.state.mecanismo !== undefined
              ) {
                this.setState({
                  Pasos: this.state.secciones[posPaso + 1].Title,
                  posPaso: posPaso + 1,
                  falta: false,
                })
              } else {
                this.setState({
                  falta: true,
                })
              }
            }
          }
        }

        if (this.props.match.params.opcion !== '1' && this.state.seguridad !== "" &&
        this.state.direccion !== undefined &&
        this.state.area !== undefined &&
        this.state.pilar !== "" &&
        this.state.driver !== undefined &&
        this.state.mecanismo !== "" &&
        this.state.tipoMecanismo && this.state.tipoMecanismo.length >= 1 &&
        this.state.AplicaPlanta == false && (this.state.Archivos &&
        this.state.Archivos.length >= 1  || this.state.Url && this.state.Url.length >12)) {
          
          this.setState({
            Pasos: this.state.secciones[posPaso + 1].Title,
            posPaso: posPaso + 1,
            falta: false,
          })
        }
        else{
          this.setState({
            falta: true,
          })

        }
      }
       if (pasos == 'Aprobadores') {
        if (this.state.PersonaElabora == '' || this.state.PersonaAprueba == '') {
          this.setState({
            falta: true,
          })
        } else {
          this.setState({
            Pasos: this.state.secciones[posPaso + 1].Title,
            posPaso: posPaso + 1,
            falta: false,
          })
        }
      } else if (pasos == 'Documentos del Mecanismo') {
        this.setState({
          Pasos: this.state.secciones[posPaso + 1].Title,
          posPaso: posPaso + 1,
          falta: false,
        })
      } else if (pasos == 'Plan de acción de los contenidos') {
        var all = true
        var allDelete = 0

        if (
          this.state.documentosMecanismo &&
          this.state.documentosMecanismo.length > 0
        ) {
          this.state.documentosMecanismo.forEach((item:any, index:any) => {
            var existe = this.state.Archivos.filter((x:any) => x.pos == index)

            if (existe.length == 0) {
              all = false
            } else {
              if (existe[0].Accion == 'Eliminar') {
                allDelete++
              }
            }
          })

          if (all) {
            if (allDelete == this.state.documentosMecanismo.length) {
              this.setState({
                allDelete: true,
              })
            } else {
              this.setState({
                Pasos: this.state.secciones[posPaso + 1].Title,
                posPaso: posPaso + 1,
                falta: false,
              })
            }
          } else {
            this.setState({
              failedDoc: true,
            })
          }
        } else {
          this.setState({
            Pasos: this.state.secciones[posPaso + 1].Title,
            posPaso: posPaso + 1,
            falta: false,
          })
        }
      } else if (pasos == 'Control de Cambios') {
        if (this.state.Motivo == '') {
          this.setState({
            falta: true,
          })
        } else {
          if (this.props.match.params.opcion == 3) {
            this.ActualizarPlanAccion()
          } else if (this.props.match.params.opcion == 2) {
            this.BorrarArchivos()
          } else {
            this.GuardarDocumentos()
          }
        }
      } else if (this.props.match.params.opcion == 3 && this.state.seguridad !== "" &&
      this.state.direccion !== undefined &&
      this.state.area !== undefined &&
      this.state.pilar !== "" &&
      this.state.driver !== undefined &&
      this.state.mecanismo !== "" &&
      this.state.tipoMecanismo && this.state.tipoMecanismo.length >= 1 &&
      this.state.AplicaPlanta == false && (this.state.Archivos &&
      this.state.Archivos.length >= 1  || this.state.Url && this.state.Url.length >12)) {
        this.setState({
          Pasos: this.state.secciones[posPaso + 1].Title,
          posPaso: posPaso + 1,
          falta: false,
        })
      }
      else if (this.props.match.params.opcion == 2 && this.state.seguridad !== "" &&
      this.state.direccion !== undefined &&
      this.state.area !== undefined &&
      this.state.pilar !== "" &&
      this.state.driver !== undefined &&
      this.state.mecanismo !== "" &&
      this.state.tipoMecanismo && this.state.tipoMecanismo.length >= 1 &&
      this.state.AplicaPlanta == false) {
        this.setState({
          Pasos: this.state.secciones[posPaso + 1].Title,
          posPaso: posPaso + 1,
          falta: false,
        })
      }    
  }

  private handleMecanismoChange(value: any) {
      this.consultardatos(value);
      this.ObtenerArchivos(value);
  }

  private handlePlantaChange(value: any) {
    if (value != 0) {
      var plantasAplica = this.state.plantasAplica

      var p = plantasAplica.filter((x:any) => x == value)

      if (p.length == 0) {
        plantasAplica.push(value)

        this.setState({
          plantasAplica: plantasAplica,
          planta: 0,
        })
      }
    }
  }



  //Funcion para eliminar linea del campo plantas
  private deletePlanta(index:any) {
    /*const plantasAplica = this.state.plantasAplica
    plantasAplica.splice(index, 1)



    this.setState({
      plantasAplica: plantasAplica,
    })*/
  }

//Funcion para eliminar archivos graficamente
  private deleteArchivo(index:any) {
    const archivos = this.state.Archivos
    archivos.splice(index, 1)



    this.setState({
      Archivos: archivos,
    })
  }

//Funcion para actualizar lo smotivos de la solicitud
  private updateMotivos(tiposolicitud:any) {
    let obj:any = {
      Motivo: this.state.Motivo,
      DescripcionMotivo: this.state.DescripcionMotivo,
      ElaboraId: this.state.PersonaElabora,
      TipoSolicitud: tiposolicitud,
    }

    if (this.state.plantasAplica != '') {
      obj['Planta'] = this.state.plantasAplica.join(';')
    }

    this.pnp
      .updateById('MecanismoFilial', parseInt(this.state.IdMecanismo), obj)
      .then((res) => {
        this.GuardarAprobadores(parseInt(this.state.IdMecanismo))
      })
  }

  // Funcion para borrar archivos del mecanismo
  public BorrarArchivos() {
   this.setState(
      {
        loading: true,
      },
      () => {
        this.pnp
          .deleteFilesByPath(
            this.state.documentosMecanismo,
            this.state.dataMecanismo.NombreMecanismo,
            'Colabora/Revision',
          )
          .then((res) => {
            this.AproRoles = true
            this.Apro = true
            this.AproArea = true

            this.updateMotivos('Eliminacion')

            this.setState({
              borrardocumentosMecanismo: res,
            })
          })
      },
    )
  }

  // Funcion para consultar los archivos del mecanismo
  public ObtenerArchivos(NombreMecanismo:any, Seguridad?:any) {
   if (this.state.dataMecanismo && this.state.dataMecanismo.Area && this.state.dataMecanismo.Area.length > 0){
      let UbicacionArchivos = this.state.dataMecanismo.Area.split(' ').join('_');
     this.pnp.getFiles('Publicado/' + Seguridad + '/' + 'Modelo_de_' + UbicacionArchivos + '/' + NombreMecanismo)
      .then(
        (res) => (

          this.setState({
            documentosMecanismo: res,
          })
        ),
      )

    }    
  }

//Funcion para identificar los grupos a los que pertenece el usuario 
  private getGroups(Id:any) {
   /* if (this.props.NombreSubsitio) {
      const prueba = this.props.NombreSubsitio
      const prueba2 = prueba[0].toUpperCase() + prueba.substring(1)
      this.setState(
        {
          NombreConvertido: prueba2,
        },
        () => {
          var nombreGrupo = 'Gestores_' + prueba2

          this.pnp.getUserInGroup(nombreGrupo, Id).then((resUser) => {
          })

          this.pnp.getGroupsByUserId(Id).then((resGroups) => {
            var gesto = resGroups.filter(
              (x:{LoginName:any}) => x.LoginName == 'Gestores_' + prueba2,
            )

            this.setState({
              gestores: gesto,
              VisorOk:
                this.props.match.params.Acceso +
                '/' +
                this.props.match.params.opcion,
            })
          })
        },
      )
    } else {

    }*/
  }

  //Funcion para cerrar modales
  private closeModal() {
    this.setState({
      Cancelar: false
    })
  }

//FUncion que redirige al home sin recraga la pagina
  private redirect() {
    this.props.history.push('/');
  }

 
  //Función que permite consultar los mecanismos según el driver seleccionado
  consultarMecanismoDriver(IdDriver:any) {
    /*var dataMecanismo = this.state.dataMecanismo

    this.pnp
      .getListItems('DriverFilial', ['*'], 'ID eq ' + IdDriver, '')
      .then((itemsD) => {
        if (itemsD.length > 0) {
          dataMecanismo['NombreDriverId'] = parseInt(IdDriver)

          this.pnp
            .getListItems(
              'PilaresFilial',
              ['*'],
              'ID eq ' + itemsD[0].PilarId,
              '',
            )
            .then((itemsP) => {
              if (itemsP.length > 0) {
                dataMecanismo['Pilar'] = itemsP[0].Pilar

                this.pnp
                  .getListItems(
                    'BibliotecaModelos',
                    ['*'],
                    'ID eq ' + itemsP[0].NombreModeloId,
                    '',
                  )
                  .then((itemsM) => {
                    if (itemsM.length > 0) {
                      dataMecanismo['Area'] = itemsM[0].Correspondencia

                      this.pnp
                        .getListItemsRoot(
                          'Area',
                          ['*', 'NombreDireccion/NombreDireccion'],
                          "NombreArea eq '" + itemsM[0].Correspondencia + "'",
                          'NombreDireccion',
                        )
                        .then((itemsA) => {
                          if (itemsA.length > 0) {
                            dataMecanismo['DIreccion'] =
                              itemsA[0].NombreDireccion.NombreDireccion

                            this.setState(
                              {
                                dataMecanismo: dataMecanismo,
                              },
                              () => {
                                this.CargaInicial()
                              },
                            )
                          }
                        })
                    }
                  })
              }
            })

          
        }
      })*/
  }

  //Funcion que consulta los datos por medio de un IDmecanismo y trae un array con los datos guardados
  private consultardatos(IdMecanismo:any) {
   /* this.props.history.push('/CrearContenido/' + this.props.match.params.Acceso + '/' + this.props.match.params.opcion + '/' + IdMecanismo,)
    
    this.pnp.getListItems(
      'MecanismoFilial',
      ['*', 'NombreDriver/NombreDriver'],
      'ID eq ' + IdMecanismo,
      'NombreDriver',
    )
      .then((items) => {
        if (items.length > 0) {
          var item = items[0]

          this.setState({
            mecanismoNombre1: items[0].NombreMecanismo,
            IdMecanismo: IdMecanismo,
            tipoMecanismo: items[0].TipoMecanismo,
            driver: items[0].NombreDriver.NombreDriver,
            driver1: items[0].NombreDriver.NombreDriver,
            descripcionMecanismo: items[0].SeccionMecanismo,
            mecanismo: "Pormodelo",
            NombreMecanismo1: items[0].NombreMecanismo,
            NombreMecanismo: 2,
            Auditoria: items[0].RequiereAuditoria,
            Seguridad: items[0].Seguridad
          })

          this.consultarMatrizAprobacion()



          var i = 0

          var ArrayAuxSeguridad:any = []

          if (item.Seguridad == 'Confidencial') {
            var i = 0
            var ArrayAuxSeguridad:any = []
            item.PersonaSeguridadId.forEach((val:any, index:any) => {
              this.pnp.getByIdUser(val).then((user) => {
                ArrayAuxSeguridad.push(user.Email)
                var leng = item.PersonaSeguridadId.length - 1

                if (leng == i) {

                  this.setState(
                    {
                      correosSeguridad: [],
                    },
                    () => {
                      this.setState({
                        correosSeguridad: ArrayAuxSeguridad,
                        StatePrueba: ArrayAuxSeguridad.join(';'),
                      })
                    },
                  )
                }
                i++
              })
            })
          }



          this.pnp.getByIdUser(item.ApruebaId).then((user) => {
            this.setState({
              PersonaApruebaEMail: user.Email,
            })
          })

          this.pnp.getByIdUser(item.RevisaId).then((user) => {
            this.setState({
              PersonaRevisaEMail: user.Email,
            })
          })

          this.setState(
            {
              dataMecanismo: item,
              disabled: 'disabled',
            },
            () => {
              this.CargaInicial()
            },
          )
        }
      })*/
  }

  //Funcion que consulta los aprobadores por Rol segun matriz de aprobacion para traer los aprobadores por area.
  /*Revisada 09102023
  private consultarAprobadores() {
    var aprueba = ''
    var apruebaId = 0

    var AprobadoresConRol:any = []

    this.state.PersonasAprobadoras.forEach((item:any, index:any) => {

      console.log("Aprobador con rol")
      console.log(this.state.cAprobadores)


      AprobadoresConRol.push({
        AprobadoresConRol: item.idUser,
        Cargo: item.rol,
        AprobadoresConRolEmail: item.user,
      })

      if (item.claveRol == 'GerenteArea' && this.state.PersonaAprueba == '') {
        aprueba = item.user
        apruebaId = item.idUser
        this.setState({
          PersonaApruebaEMail: aprueba,
          PersonaAprueba: apruebaId,
        })
      }

      this.setState({
        cAprobadores: AprobadoresConRol,
      })
    })

    if (this.state.dataMecanismo) {
      this.pnp
        .getListItems(
          'Aprobadores',
          ['*', 'Mecanismo/ID', 'Aprobador/ID', 'Aprobador/EMail'],
          'Mecanismo/ID eq ' + this.state.IdMecanismo,
          'Mecanismo,Aprobador',
        )
        .then((Apro) => {
          if (Apro.length > 0) {
            console.log(Apro)

            var AprobadoresConRol:any = []
            var AuxAprobadoresConRol = Apro.filter((x:{Title:any}) => x.Title == 'Rol')

            AuxAprobadoresConRol.forEach((item:any, index:any) => {

              AprobadoresConRol.push({
                AprobadoresCargo: item.Aprobador.ID,
                AprobadoresCargoID: item.ID,
                Cargo: item.Cargo,
                AprobadoresConRolEmail: item.Aprobador.EMail,
              })
            })

            var DemasAprobadores = []
            var AuxDemasAprobadores = Apro.filter((x:{Title:any}) => x.Title == 'Otros')
            AuxDemasAprobadores.forEach((item:any, index:any) => {

              DemasAprobadores.push({
                DemasAprobadores: item.Aprobador.ID,
                DemasAprobadoresID: item.ID,
                DemasAprobadoresEmail: item.Aprobador.EMail,
              })
            })

          }
        })
    }
  }*/

  //Funcion que consulta los motivos de la lista parametrosGenerales y devuelve un objeto con esta informacion.
  private consultarMatrizAprobacion() {
    /*this.pnp
      .getListItems(
        'ParametrosGenerales',
        ['*'],
        "Clave eq 'MatrizAprobacion' and Activo eq 1",
        '',
      )
      .then((res) =>
        this.setState(
          {
            MatrizAprobacion: res,
          },
          () => {
            this.ConsultarMatriz(this.state.tipoMecanismo)
          },
        ),
      )*/
  }

  /*Funcion que consulta la matriz por tipo de mecanismo trayendo los roles que interactuan con el tipo de mecanismo
  private ConsultarMatriz(TipoMecanismo:any) {
    this.pnp
      .getListItems(
        'AprobadoresTipoMecanismo',
        ['*'],
        "TipoMecanismo eq '" + TipoMecanismo + "'",
        '',
      )
      .then((matri) => {
        if (matri.length > 0) {
          var items = matri[0]
          var aux = this.state.MatrizAprobacion

          var auxMatriz:any = []

          aux.forEach((item:any, index:any) => {
            var valor = items[item.Title]

            if (valor == true) {
              auxMatriz.push(item.Title)
            }
          })

          this.setState(
           
            {
              MatrizRol: auxMatriz,
            },
            () => {
              this.consultarMatrizApro()
              console.log(this.state.MatrizRol)
            },
          )
        }
      })
  }*/  
  
  
  /*Consulta los usuario que aprueban por direccion y area
  private consultarMatrizApro() {
   
   
   this.pnp
      .getListItems(
        'MatrizAprobacion',
        ['*'],
        "Direccion eq '" + this.state.direccion + "' and Area eq '" + this.state.area + "'",
        '',)
      .then((apro) => {
        if (apro.length > 0) {
          var items = apro[0]

          if (items.PermiteCambioGerente === true) {
            this.setState({ disabledGerente: true })
          }

          var auxAprobadores:any = []
          var PersonaRevisa = 0
          var PersonaRevisaEMail = ''
          var d = 0
        
      
          this.state.MatrizRol.forEach((item:any, index:any) => {
            var rolActual = this.state.rolesAprobadores.filter(
              (x:{Clave:any}) => x.Clave == item,
            )

            this.pnp
              .getByIdUser(items[item + 'Id'])
              .then((u) => {
                if (item == 'LiderGDC' || item == 'ConsultorGH') {
                  PersonaRevisa = items[item + 'Id']
                  PersonaRevisaEMail = u.Email
                }



                auxAprobadores.push({
                  rol: rolActual.length > 0 ? rolActual[0].Title : item,
                  claveRol: item,
                  user: u.Email,
                  idUser: items[item + 'Id'],
                })
              
                d++

                if (this.state.MatrizRol.length == d) {
                  this.setState(
                    {
                      PersonasAprobadoras: auxAprobadores,

                      PersonaRevisa: PersonaRevisa,
                      PersonaRevisaEMail: PersonaRevisaEMail,
                    },
                    () => {

                      this.consultarAprobadores()
                    },
                  )
                }
              }).catch((error) => {
                if (this.state.MatrizRol.length - 1 == index) {
                  this.setState(
                    {
                      PersonasAprobadoras: auxAprobadores,

                      PersonaRevisa: PersonaRevisa,
                      PersonaRevisaEMail: PersonaRevisaEMail,
                    },
                    () => {
                      this.consultarAprobadores()
                    },
                  )
                }
                this.consultarAprobadores()
              })
          })
        }
      })
  }*/

  //Funcion que identifica la cantidad de caracteres 
  private longitudcadena(cantidad:any) {
    /*
    const result = cantidad.length
    this.setState({

      CantidadCaracteres: result

    })

    console.log(result)
    */
  }

  // Funcion que permite consultar el estado de auditoria del mecanismo
  private verificarAuditoria (idMecanismo:any){
    /*this.pnp
      .getListItems(
        'MecanismoFilial',
        ['RequiereAuditoria',"ID","NombreMecanismo","TipoMecanismo"],
        "ID eq '" + idMecanismo + "' ",
        '',
      )
      .then(respuesta=>{
        console.log(respuesta);
        this.setState({
          tipoMecanismo:respuesta[0].TipoMecanismo,
          Auditoria:respuesta[0].RequiereAuditoria,
          Seguridad:respuesta[0].Seguridad
        })
      })*/

  }

  public render(): React.ReactElement<ICrearContenidoProps> {
    if (
      this.props.match.params.Acceso + '/' + this.props.match.params.opcion !=
      this.state.VisorOk
    ) {
      window.location.reload()
    }

    return (
      <>
      
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

            <div className="toolbar py-5 py-lg-7" id="kt_toolbar">
              <div
                id="kt_toolbar_container"
                className="container-xxl d-flex flex-stack flex-wrap"
              >
                <div className="page-title d-flex flex-column me-3">
                  {this.props.match.params.opcion == 1 ? (
                    <h1 id="contentn" className="d-flex text-dark fw-bolder my-1 fs-2">
                      Creación de Contenido
                    </h1>
                  ) : null}
                  {this.props.match.params.opcion == 2 ? (
                    <h1
                      id="contentn"
                      className="d-flex text-dark fw-bolder my-1 fs-2"
                    >
                      Eliminación de Contenido
                    </h1>
                  ) : null}

                  {this.props.match.params.opcion == 3 ? (
                    <h1
                      id="contentn"
                      className="d-flex text-dark fw-bolder my-1 fs-2"
                    >
                      Actualización de Contenido
                    </h1>
                  ) : null}

                  <ul className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">
                    <li className="breadcrumb-item text-gray-600">
                      <a href="#" className="text-gray-600 text-hover-primary">
                        Inicio
                      </a>
                    </li>
                    <li className="breadcrumb-item text-gray-600">
                      Formulario de Solicitud
                    </li>
                  </ul>
                </div>                
              </div>
            </div>
            {/* Body */}

            <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
              <div className="content flex-row-fluid" id="kt_content">
                <div className="stepper stepper-pills first"
                  id="kt_stepper_example_clickable" data-kt-stepper="true">
                  <div className="separator mt-4 mb-4"></div>
                  {!this.state.enviado ? (
                    <div className="stepper-nav flex-center flex-wrap mb-10">
                      {this.state.secciones.map((s:any, index:any) => (
                        <div className={this.state.Pasos == s.Title
                              ? 'stepper-item mx-2 my-4 current'
                              : 'stepper-item mx-2 my-4 pending'
                          }>
                          <div className="stepper-line w-40px"></div>
                          <div className="stepper-icon w-40px h-40px">
                            <i className="stepper-check fas fa-check"></i>
                            <span className="stepper-number">{index + 1}</span>
                          </div>
                          <div className="stepper-label">
                            <h3 className="stepper-title">{s.Title}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="card">
                  <div className="card-body">
                    <div
                      className="stepper stepper-pills first"
                      id="kt_stepper_example_clickable"
                      data-kt-stepper="true"
                    >                    
                      <form className="form mx-auto" id="kt_stepper_example_basic_form">
                        <div className="mb-5">
                          <div>
                            {/* Pantalla 1 del formulario */}

                            {this.state.Pasos == 'Datos del Mecanismo' ? (
                              <div className="flex-column current">
                                <div className="row mb-5 ">
                                  <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                    <h3 className="text-primary">
                                      Datos del Mecanismo
                                    </h3>
                                  </div>
                                </div>
                                <div className="row mb-5 contenform">
                                  {this.props.Subsitio == false ? (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                      <label className="form-label required">
                                        País
                                      </label>
                                      <input 
                                        style={{ height: '56%' }}
                                        type="text"
                                        className="form-control"
                                        name="input2"
                                        placeholder="."
                                        value={this.state.NombreConvertido}
                                        disabled
                                      />
                                    </div>
                                  ) : (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                      <label className="form-label required">
                                        País
                                      </label>
                                      <input
                                        style={{ height: '56%' }}
                                        type="text"
                                        className="form-control"
                                        name="input2"
                                        placeholder="."
                                        value={this.state.NombreConvertido}
                                        disabled
                                      />
                                    </div>
                                  )}

                                  <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                    <label className="form-label required">
                                      Dirección
                                    </label>

                                    {this.state.direcciones &&
                                      this.state.direcciones.length > 0 ? (
                                      <select
                                        name="direccion"
                                        value={this.state.direccion}
                                        className="form-select select2-hidden-accessible"
                                        onChange={(e) => {
                                          this.inputChange(e.target)
                                        }}
                                        data-control="select2"
                                        data-placeholder="Select an option"
                                        data-select2-id="select2-data-1-k7cj"
                                        disabled={this.state.disabled}
                                        aria-hidden="true"
                                      >
                                        <option data-select2-id="select2-data-3-efwm"></option>
                                        {this.state.direcciones.map((e:any) => (
                                          <option value={e.NombreDireccion}>
                                            {' '}
                                            {e.NombreDireccion}
                                          </option>
                                        ))}
                                      </select>
                                    ) : null}
                                  </div>

                                  {this.state.areas &&
                                    this.state.areas.length > 0 ? (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                      <label className="form-label required">
                                        Área
                                      </label>

                                      <select
                                        name="area"
                                        value={this.state.area}
                                        className="form-select select2-hidden-accessible"
                                        onChange={(e) => {this.inputChange(e.target)}}
                                        data-control="select2"
                                        data-placeholder="Select an option"
                                        data-select2-id="select2-data-7-njhs"
                                        disabled={this.state.disabled}
                                        aria-hidden="true"
                                      >
                                        <option data-select2-id="select2-data-3-efwm"></option>
                                        {this.state.areas.map((e:any) => (
                                          <option value={e.NombreArea}>
                                            {e.NombreArea}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  ) : null}

                                  {this.state.subAreas &&
                                    this.state.subAreas.length > 0 ? (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                      <label className="form-label">
                                        Sub Área (opcional)
                                      </label>

                                      <select
                                        name="subArea"
                                        value={this.state.subArea}
                                        onChange={(e) => {
                                          this.inputChange(e.target)
                                        }}
                                        className="form-select select2-hidden-accessible"
                                        data-control="select2"
                                        data-placeholder="Select an option"
                                        data-select2-id="select2-data-7-njhs"
                                        disabled={this.state.disabled}
                                        aria-hidden="true"
                                      >
                                        <option data-select2-id="select2-data-9-da1c">
                                          Seleccionar
                                        </option>

                                        {this.state.subAreas.map((e:any) => (
                                          <option value={e.NombreSubArea}>
                                            {e.NombreSubArea}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  ) : null}

                                  {this.state.pilares &&
                                    this.state.pilares.length > 0 ? (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                      <label className="form-label required">
                                        Pilar
                                      </label>

                                      <select
                                        name="pilar"
                                        value={this.state.pilar}
                                        onChange={(e) => {
                                          this.inputChange(e.target)
                                        }}
                                        className="form-select select2-hidden-accessible"
                                        data-control="select2"
                                        data-placeholder="Select an option"
                                        data-select2-id="select2-data-7-njhs"
                                        disabled={this.state.disabled}
                                        aria-hidden="true"
                                      >
                                        <option
                                          data-select2-id="select2-data-9-da1c"
                                          value="0"
                                        >
                                          seleccionar...
                                        </option>

                                        {this.state.pilares.map((e:any) => (
                                          <option value={e.Id}>{e.Title}</option>
                                        ))}
                                      </select>
                                    </div>
                                  ) : null}

                                  {this.state.drivers && this.state.drivers.length > 0 ? (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                      <label className="form-label required">
                                        Driver
                                      </label>
                                      {
                                        this.props.match.params.IdMecanismo === undefined ?

                                          <select
                                            name="driver"
                                            value={this.state.driver}
                                            onChange={(e) => {
                                              this.inputChange(e.target)
                                            }}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2"
                                            data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={this.state.disabled}
                                            aria-hidden="true"
                                          >
                                            <option data-select2-id="select2-data-9-da1c" value="0">
                                              seleccionar...
                                            </option>
                                            {this.state.pilar == "No Aplica" ?
                                              <option
                                                data-select2-id="select2-data-9-da1c"
                                                value="10"
                                              >
                                                No aplica
                                              </option> : null}

                                            {this.state.pilar != "No Aplica" ?
                                              this.state.drivers.map((e:any) => (
                                                <option value={e.Title}>{e.Title}</option>
                                              )) : null}
                                          </select>
                                          :
                                          <input
                                            value={this.state.driver1}
                                            className="form-control"
                                            disabled
                                            type="text"
                                            placeholder='.'

                                          />
                                      }


                                    </div>
                                  ) : null}

                                  {this.state.pilar == 'No aplica' ? (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                      <label className="form-label required">
                                        Driver
                                      </label>

                                      <select name="driver" value={this.state.driver}
                                        onChange={(e) => {
                                          this.inputChange(e.target)
                                        }}
                                        className="form-select select2-hidden-accessible"
                                        data-control="select2"
                                        data-placeholder="Select an option"
                                        data-select2-id="select2-data-7-njhs"
                                        disabled={this.state.disabled}
                                        aria-hidden="true"
                                      >
                                        <option
                                          data-select2-id="select2-data-9-da1c"
                                          value="0"
                                        >
                                          seleccionar...
                                        </option>
                                        <option
                                          data-select2-id="select2-data-9-da1c"
                                          value="No aplica"
                                        >
                                          No aplica
                                        </option>
                                      </select>
                                    </div>
                                  ) : null}

                                  <div className="row mb-5 contenform" id="btnMecanismos" >
                                    <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                                      <div className="d-flex">
                                        <span className="form-check">
                                          {this.props.match.params.opcion !== '1' && this.props.match.params.Acceso !== '2' || this.props.match.params.IdMecanismo !== undefined ? (
                                            <input
                                              disabled
                                              placeholder='.'
                                              className="form-check-input"
                                              type="radio"
                                              checked={
                                                this.state.descripcionMecanismo === 'Mecanismo del Driver'
                                              }
                                              name="MecanismoDriver"
                                              value="Mecanismo del Driver"
                                              onChange={(e) => {
                                                this.inputChange(e.target)
                                              }}
                                            />
                                          ) : (
                                            <input
                                              disabled={this.state.MecanismosDelDriverLocal}
                                              placeholder='.'
                                              className="form-check-input"
                                              type="radio"
                                              checked={
                                                this.state.descripcionMecanismo === 'Mecanismo del Driver'
                                              }
                                              name="MecanismoDriver"
                                              value="Mecanismo del Driver"
                                              onChange={(e) => {
                                                this.setState({NombreMecanismo:0},()=>{this.setState({NombreMecanismo:2,mecanismoLocal:"",tipoMecanismo:""})})
                                                this.inputChange(e.target)
                                              }}
                                            />
                                          )}
                                        </span>




                                        <label className="form-check-label pe-10 fs-5" htmlFor="flexRadioDefault">
                                          Mecanismo del driver
                                        </label>

                                        <span className="form-check">
                                          {this.props.match.params.opcion !== '1' && this.props.match.params.Acceso !== '2' || this.props.match.params.IdMecanismo !== undefined ? (
                                            <input disabled placeholder='.' className="form-check-input"
                                              type="radio" name="OtroMecanismo"
                                              value="Otro Mecanismo Operacional"
                                              checked={
                                                this.state.descripcionMecanismo === 'Otro Mecanismo Operacional'
                                              }
                                            />
                                          ) : (
                                            <input
                                              disabled={this.state.OtroMecanismoOperacionalDriver}
                                              placeholder='.'
                                              className="form-check-input"
                                              type="radio"
                                              name="OtroMecanismo"
                                              value="Otro Mecanismo Operacional"
                                              checked={
                                                  this.state.descripcionMecanismo === 'Otro Mecanismo Operacional'
                                              }
                                              onChange={(e) => {
                                                this.setState({NombreMecanismo:0},()=>{this.setState({NombreMecanismo:1,Auditoria:false,mecanismoLocal:"",tipoMecanismo:""})} )
                                                this.inputChange(e.target)
                                              
                                              }}
                                            />
                                          )}
                                        </span>
                                        <label className="form-check-label pe-10 fs-5" htmlFor="flexRadioDefault">
                                          Otro Mecanismo Operacional
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  
                                    {this.props.match.params.opcion == "1" && this.props.match.params.IdMecanismo ? (
                                      
                                    <div className="row">
                                      <div className="col-lg-6 col-md-4 col-xl-6 col-xxl-6 marginBottom">
                                      
                                              <label className="form-label required">
                                                Nombre del Mecanismo Local
                                              </label>
                                              {this.props.match.params.opcion == 1 ? (
                                          <input
                                            disabled
                                            type="text"
                                            name="mecanismo"
                                            value={this.state.NombreMecanismo1}
                                            className="form-select select2-hidden-accessible"
                                            placeholder="."
                                            //disabled={this.state.disabled && this.props.match.params.opcion !=="1"}
                                            onChange={(e) => {
                                              this.setState({
                                                mecanismoNombre1: e.target.value,
                                                mecanismo: e.target.value
                                              })
                                            }}
                                          />
                                        ) : this.state.mecanismos &&
                                          this.state.mecanismos.length > 0 ? (
                                          <select
                                            name="mecanismo"
                                            value={this.state.NombreMecanismo1}
                                            onChange={(e) => {
                                              this.inputChange(e.target)
                                            }}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2"
                                            data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={this.state.disabled}
                                            aria-hidden="true"
                                          >
                                            <option
                                              data-select2-id="select2-data-9-da1c"
                                              value="0"
                                            >
                                              seleccionar...
                                            </option>

                                            {this.state.mecanismos.map((e:any) => (
                                              <option value={e.ID}>
                                                {e.NombreMecanismo}
                                              </option>
                                            ))}
                                          </select>
                                        ) : null}
                                      
                                        <label className="form-label required">
                                          Nombre del Mecanismo 
                                        </label>
                                        <span className="FAQ">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-info-circle"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                          </svg>
                                          <span className="modalFAQ">
                                            {this.state.FaqSeguridad}
                                          </span>
                                        </span>

                                        {this.props.match.params.opcion == 1 ? (
                                          <input
                                            type="text"
                                            name="mecanismo"
                                            value={this.state.mecanismoNombre1}
                                            className="form-control"
                                            placeholder="."
                                            //disabled={this.state.disabled && this.props.match.params.opcion !=="1"}
                                            onChange={(e) => {
                                              this.setState({
                                                mecanismoNombre1: e.target.value,
                                                mecanismo: e.target.value
                                              })
                                            }}
                                          />
                                        ) : this.state.mecanismos &&
                                          this.state.mecanismos.length > 0 ? (
                                          <select
                                            name="mecanismo"
                                            value={this.state.mecanismo}
                                            onChange={(e) => {
                                              this.inputChange(e.target)
                                            }}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2"
                                            data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={this.state.disabled}
                                            aria-hidden="true"
                                          >
                                            <option
                                              data-select2-id="select2-data-9-da1c"
                                              value="0"
                                            >
                                              seleccionar...
                                            </option>

                                            {this.state.mecanismos.map((e:any) => (
                                              <option value={e.ID}>
                                                {e.NombreMecanismo}
                                              </option>
                                            ))}
                                          </select>
                                        ) : null}
                                      </div>

                                      <div className="col-lg-6 col-md-4 col-xl-6 col-xxl-6 marginBottom">
                                        <label className="form-label required">
                                          Tipo de Mecanismo
                                        </label>
                                        {this.state.tiposMecanismos && this.state.tiposMecanismos.length > 0 ? (
                                          <select
                                            name="tipoMecanismo"
                                            value={this.state.tipoMecanismo}
                                            onChange={(e) => {
                                              this.inputChange(e.target)
                                            }}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2"
                                            data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={
                                              this.state.disabled &&
                                              this.props.match.params.opcion !==
                                              '1'
                                            }
                                            aria-hidden="true"
                                          >
                                            <option
                                              data-select2-id="select2-data-9-da1c"
                                              value="0"
                                            >
                                              seleccionar...
                                            </option>

                                            {this.state.tiposMecanismos.map(
                                              (e:any) => (
                                                <option value={e.Title}>
                                                  {e.Title}
                                                </option>
                                              ),
                                            )}
                                          </select>
                                        ) : null}
                                      </div>
                                    </div>
                                  ) : null} 

                                  {this.props.match.params.opcion == 1 && this.props.match.params.IdMecanismo ==undefined? (
                                    <div className="row">
                                      <div className="col-4">
                                        {
                                          this.state.NombreMecanismo==2?
                                            <>
                                              <label className="form-label required">
                                                Nombre del Mecanismo Local
                                              </label>
                                              <select
                                                title='.'
                                                className="form-select select2-hidden-accessible"
                                                onChange={(e) => {
                                                  this.setState({

                                                    Auditoria:false,
                                                    mecanismo: e.target.value.split("|")[0],
                                                    mecanismoLocal: e.target.value,
                                                    idMecanismo: e.target.value.split("|")[1]
                                                  })
                                                  
                                                  this.verificarAuditoria(e.target.value.split("|")[1]);
                                                  this.consultarMatrizAprobacion()
                                                  
                                                }}
                                                value={this.state.mecanismoLocal}
                                              >
                                                <option>Seleccionar...</option>

                                          
                                                {this.state.mecanismosBase.map((e:any) => {
                                                  
                                                  if (e.SeccionMecanismo == "Mecanismo del Driver"){
                                                    
                                                    return(
                                                      <option value={`${e.NombreMecanismo}|${e.ID}`}>
                                                        {' '}
                                                        {e.NombreMecanismo}
                                                      </option>
                                                      )
                                                  }
                                                 
                                                })}
                                              </select>
                                            </>
                                            :
                                            this.state.NombreMecanismo==1?
                                            <>
                                              <label className="form-label required">
                                                Nombre de Otros Mecanismos
                                              </label>
                                              <select
                                                title='.'
                                                className="form-select select2-hidden-accessible"
                                                value={this.state.mecanismoLocal}
                                                onChange={(e) => {
                                                  if(e.target.value=="NuevoMecanismoOperacional" || e.target.value==""){
                                                    this.setState({
                                                      deshabilitarBotonAuditoria:false,
                                                      Auditoria:false,
                                                      mecanismo: e.target.value.split("|")[0],
                                                      mecanismoLocal: e.target.value,
                                                    })
                                                  }
                                                  else{
                                                    this.setState({
                                                      deshabilitarBotonAuditoria:true,
                                                      Auditoria:false,
                                                      mecanismo: e.target.value.split("|")[0],
                                                      mecanismoLocal: e.target.value,
                                                      idMecanismo: e.target.value.split("|")[1]
                                                    })
                                                    this.verificarAuditoria(e.target.value.split("|")[1])
                                                  }
                                                  
                                                }}
                                              >
                                            <option value="">Seleccionar...</option>

                                          {this.state.NombreMecanismo==1?
                                          <option value="NuevoMecanismoOperacional">Nuevo Mecanismo Operacional</option>:null}
                                                
                                                {this.state.mecanismosBase.map((e:any) => {
                                                  if(e.SeccionMecanismo == "Otro Mecanismo Operacional"){
                                                    return(
                                                      
                                                    <option value={`${e.NombreMecanismo}|${e.ID}`}>
                                                      {' '}
                                                      {e.NombreMecanismo}
                                                    </option>
                                                    )
                                                  }
                                                                                                   
                                                })}
                                              </select>
                                            </>
                                            : null}

                                      </div>
                                      {this.state.mecanismoLocal && this.state.mecanismoLocal.length > 0 ? (
                                        <>
                                          <div className="col-4 marginBottom">
                                            {this.props.match.params.opcion == 1 || this.state.descripcionMecanismo === 'Otro Mecanismo Operacional' ||  this.state.mecanismoLocal=="NuevoMecanismoOperacional" ? (
                                              <>
                                              
                                                <label className="form-label required">
                                                  Nombre del Mecanismo
                                                </label>
                                                <span className="FAQ">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-info-circle"
                                                    viewBox="0 0 16 16"
                                                  >
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                  </svg>
                                                  <span className="modalFAQ">
                                                    {this.state.FaqSeguridad}
                                                  </span>
                                                </span>

                                                <input                                                
                                                  name="mecanismo"
                                                  value={this.state.mecanismo}
                                                  className="form-control"
                                                  placeholder="."
                                                  disabled={
                                                    this.props.match.params.opcion !== '1'
                                                  }
                                                  onChange={(e) => {
                                                    this.setState({
                                                      mecanismo: e.target.value,
                                                    })
                                                  }}
                                                />
                                              </>
                                            ) : this.state.mecanismos || this.state.NombreMecanismo==1 && this.state.mecanismos.length > 0 ? (
                                              <select
                                                name="mecanismo"
                                                value={this.state.tipoMecanismo}
                                                onChange={(e) => {
                                                  this.inputChange(e.target)
                                                }}
                                                className="form-select select2-hidden-accessible"
                                                data-control="select2"
                                                data-placeholder="Select an option"
                                                data-select2-id="select2-data-7-njhs"
                                                disabled={
                                                  this.state.disabled &&
                                                  this.props.match.params
                                                    .opcion !== '1'
                                                }
                                                aria-hidden="true"
                                              >
                                                <option
                                                  data-select2-id="select2-data-9-da1c"
                                                  value="0"
                                                >
                                                  seleccionar...
                                                </option>

                                                {this.state.mecanismos.map(
                                                  (e:any) => (
                                                    <option value={e.ID}>
                                                      {e.NombreMecanismo}
                                                    </option>
                                                  ),
                                                )}
                                              </select>
                                            ) : null}
                                          </div>
                                          <div className="col-lg-6 col-md-4 col-xl-6 col-xxl-6 marginBottom">
                                        <label className="form-label required">
                                          Tipo de Mecanismo
                                        </label>
                                        {this.state.tiposMecanismos && this.state.tiposMecanismos.length > 0 ? (
                                          <select
                                            name="tipoMecanismo"
                                            value={this.state.tipoMecanismo}
                                            onChange={(e) => {
                                              this.inputChange(e.target)
                                            }}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2"
                                            data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={
                                              this.state.disabled &&
                                              this.props.match.params.opcion !==
                                              '1'
                                            }
                                            aria-hidden="true"
                                          >
                                            <option
                                              data-select2-id="select2-data-9-da1c"
                                              value="0"
                                            >
                                              seleccionar...
                                            </option>

                                            {this.state.tiposMecanismos.map(
                                              (e:any) => (
                                                <option value={e.Title}>
                                                  {e.Title}
                                                </option>
                                              ),
                                            )}
                                          </select>
                                        ) : null}
                                      </div>
                                        </>
                                      ) : null}
                                    </div>
                                  ) : null}

                                  {this.state.NombreMecanismo == 2 && this.props.match.params.opcion !== "1" ? (
                                    <div className="row">
                                      <div className="col-lg-6 col-md-4 col-xl-6 col-xxl-6 marginBottom">
                                        
                                        <label className="form-label required">
                                          Nombre del Mecanismo Local
                                        </label>
                                        <span className="FAQ">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-info-circle"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                          </svg>
                                          <span className="modalFAQ">
                                            {this.state.FaqSeguridad}
                                          </span>
                                        </span>

                                        {this.props.match.params.opcion == 1 ? (
                                          <input
                                            type="text"
                                            name="mecanismo"
                                            value={this.state.mecanismoNombre1}
                                            className="form-control"
                                            placeholder="."
                                            //disabled={this.state.disabled && this.props.match.params.opcion !=="1"}
                                            onChange={(e) => {
                                              this.setState({
                                                mecanismoNombre1: e.target.value,
                                                mecanismo: e.target.value
                                              })
                                            }}
                                          />
                                        ) : this.state.mecanismos &&
                                          this.state.mecanismos.length > 0 ? (
                                          <select
                                            name="mecanismo"
                                            value={this.state.mecanismo}
                                            onChange={(e) => {
                                              this.inputChange(e.target)
                                            }}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2"
                                            data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={this.state.disabled}
                                            aria-hidden="true"
                                          >
                                            <option
                                              data-select2-id="select2-data-9-da1c"
                                              value="0"
                                            >
                                              seleccionar...
                                            </option>

                                            {this.state.mecanismos.map((e:any) => (
                                              <option value={e.ID}>
                                                {e.NombreMecanismo}
                                              </option>
                                            ))}
                                          </select>
                                        ) : null}
                                      </div>

                                      <div className="col-lg-6 col-md-4 col-xl-6 col-xxl-6 marginBottom">
                                        <label className="form-label required">
                                          Tipo de Mecanismo
                                        </label>

                                        {this.state.tiposMecanismos && this.state.tiposMecanismos.length > 0 ? (
                                          <select
                                            name="tipoMecanismo"
                                            value={this.state.tipoMecanismo}
                                            onChange={(e) => {
                                              this.inputChange(e.target)
                                            }}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2"
                                            data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={
                                              this.state.disabled &&
                                              this.props.match.params.opcion !==
                                              '1'
                                            }
                                            aria-hidden="true"
                                          >
                                            <option
                                              data-select2-id="select2-data-9-da1c"
                                              value="0"
                                            >
                                              seleccionar...
                                            </option>

                                            {this.state.tiposMecanismos.map(
                                              (e:any) => (
                                                <option value={e.Title}>
                                                  {e.Title}
                                                </option>
                                              ),
                                            )}
                                          </select>
                                        ) : null}
                                      </div>
                                    </div>
                                    
                                  ) : null}
                                </div>

                                <div className="row mb-5 contenform">
                                  <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                    <label className="form-check1">
                                      <span
                                        className="form-label required"
                                        id="labelSeguridad"
                                      >
                                        Seguridad
                                      </span>
                                      <span className="FAQ">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-info-circle"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                        </svg>
                                        <span className="modalFAQ">
                                          {this.state.FaqSeguridad}
                                        </span>
                                      </span>
                                    </label>
                                    <br />
                                    {this.props.match.params.opcion != 1 ? (
                                      <div className="d-flex">
                                        <span className="form-check">
                                          <input
                                            disabled
                                            placeholder='.'
                                            className="form-check-input"
                                            type="radio"
                                            name="seguridad"
                                            value="Público"
                                            checked={
                                              this.state.seguridad === 'Público'
                                            }
                                            onChange={(e) => {
                                              this.setState({
                                                PersonaSeguridadEmail: [],
                                                correosSeguridad: [],
                                                seguridad: e.target.value,
                                              })
                                            }}
                                          />
                                        </span>
                                        <label
                                          className="form-check-label pe-10"
                                          htmlFor="flexRadioDefault"
                                        >
                                          Público
                                        </label>
                                        <span className="form-check">
                                          <input
                                            disabled
                                            placeholder='.'
                                            className="form-check-input"
                                            type="radio"
                                            name="seguridad"
                                            value="Privado"
                                            checked={
                                              this.state.seguridad === 'Privado'

                                            }
                                            onChange={(e) => {
                                              this.setState({
                                                PersonaSeguridadEmail: [],
                                                correosSeguridad: [],
                                                seguridad: e.target.value,
                                              })

                                            }}
                                          />
                                        </span>
                                        <label
                                          className="form-check-label pe-10"
                                          htmlFor="flexRadioDefault"
                                        >
                                          Privado
                                        </label>
                                        <span className="form-check">
                                          <input
                                            placeholder='.'
                                            disabled
                                            className="form-check-input"
                                            type="radio"
                                            name="seguridad"
                                            value="Confidencial"
                                            checked={
                                              this.state.seguridad ===
                                              'Confidencial'
                                            }
                                            onChange={(e) => {
                                              this.setState({
                                                seguridad: e.target.value,

                                              })
                                            }}

                                          />
                                        </span>
                                        <label
                                          className="form-check-label pe-10"
                                          htmlFor="flexRadioDefault"
                                        >
                                          Confidencial
                                        </label>
                                      </div>
                                    ) : (
                                      <div className="d-flex">

                                        <span className="form-check">
                                          <input
                                            placeholder='.'
                                            className="form-check-input"
                                            type="radio"
                                            name="seguridad"
                                            value="Público"
                                            checked={
                                              this.state.seguridad === 'Público'
                                            }
                                            onChange={(e) => {
                                              this.setState({
                                                PersonaSeguridadEmail: [],
                                                correosSeguridad: [],
                                                seguridad: e.target.value,
                                              })
                                            }}
                                          />
                                        </span>
                                        <label
                                          className="form-check-label pe-10"
                                          htmlFor="flexRadioDefault"
                                        >
                                          Público
                                        </label>
                                        <span className="form-check">
                                          <input
                                            placeholder='.'
                                            className="form-check-input"
                                            type="radio"
                                            name="seguridad"
                                            value="Privado"
                                            checked={
                                              this.state.seguridad === 'Privado'

                                            }
                                            onChange={(e) => {
                                              this.setState({
                                                PersonaSeguridadEmail: [],
                                                correosSeguridad: [],
                                                seguridad: e.target.value,
                                              })
                                            }}
                                          />
                                        </span>
                                        <label
                                          className="form-check-label pe-10"
                                          htmlFor="flexRadioDefault"
                                        >
                                          Privado
                                        </label>
                                        <span className="form-check">
                                          <input
                                            placeholder='.'
                                            className="form-check-input"
                                            type="radio"
                                            name="seguridad"
                                            value="Confidencial"
                                            checked={
                                              this.state.seguridad ===
                                              'Confidencial'
                                            }
                                            onChange={(e) => {
                                              this.setState({
                                                seguridad: e.target.value,
                                              })
                                            }}
                                          />
                                        </span>
                                        <label
                                          className="form-check-label pe-10"
                                          htmlFor="flexRadioDefault"
                                        >
                                          Confidencial
                                        </label>
                                      </div>
                                    )}
                                  </div>

                                  {this.state.seguridad == 'Confidencial' ? (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                      <label className="form-label  required">
                                        Asignado a:

                                      </label>

                                      <PeoplePicker
                                        context={this.props.context}
                                        titleText=""
                                        personSelectionLimit={100}
                                        groupName={''}
                                        showtooltip={true}
                                        required={true}
                                        disabled={
                                          this.props.match.params.opcion !== '1'
                                            ? true
                                            : false
                                        }
                                        onChange={this._getPeoplePickerSeguridad}
                                        showHiddenInUI={false}
                                        ensureUser={true}
                                        principalTypes={[PrincipalType.User]}
                                        resolveDelay={1000}
                                        defaultSelectedUsers={
                                        this.state.PersonaSeguridadEmail ? this.state.correosSeguridad : ''
                                        }
                                      />
                                    </div>
                                  ) : null}
                                </div>

                                <div className="row mb-5 contenform">
                                  <div className="mt-4">
                                    <label className="form-check form-switch form-check-custom">
                                      {this.props.match.params.opcion != 1 /*|| this.state.NombreMecanismo == 1*/ || this.props.match.params.IdMecanismo !== undefined ? (
                                        <input
                                          disabled
                                          className="form-check-input"
                                          type="checkbox"
                                          value="1"
                                          checked={this.state.Auditoria}
                                          onChange={(e) => {
                                            this.setState({
                                              Auditoria: false,

                                            })
                                          }}
                                        />
                                      ) : (
                                        <input
                                        disabled={this.state.NombreMecanismo==2? true:false || this.state.deshabilitarBotonAuditoria}
                                          className="form-check-input"
                                          type="checkbox"
                                          value= "1"
                                          checked={
                                            // this.state.NombreMecanismo==2? false:
                                            this.state.Auditoria}
                                          onChange={(e) => {
                                            this.setState({
                                              Auditoria: !this.state.Auditoria,
                                            })
                                          }}
                                        />
                                      )}

                                      <span className="form-check-label mx-15">
                                        Requiere revisión de auditoría
                                      </span>
                                    </label>
                                  </div>

                                  <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 mt-4">
                                    <label className="form-check form-switch form-check-custom">
                                      {this.props.match.params.opcion != 1 ? (
                                        <input
                                          disabled
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={this.state.AplicaPlanta}
                                          value="2"
                                          onChange={(e) => {
                                            this.setState({
                                              AplicaPlanta: !this.state
                                                .AplicaPlanta,
                                            })
                                          }}
                                        />
                                      ) : (
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={this.state.AplicaPlanta}
                                          value="2"
                                          onChange={(e) => {
                                            this.setState({
                                              AplicaPlanta: !this.state.AplicaPlanta,
                                            })
                                          }}
                                        />
                                      )}
                                      <span
                                        className="form-check-label"
                                        id="fcl1"
                                      >
                                        Aplica a planta de producción
                                      </span>

                                      <span className="FAQ">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-info-circle"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                        </svg>

                                        <span className="modalFAQ">
                                          {this.state.FaqPlantaProduccion}
                                        </span>
                                      </span>
                                    </label>
                                  </div>

                                  {this.state.AplicaPlanta == true ? (
                                    <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                      <label className="form-label required">
                                        Plantas
                                      </label>

                                      {this.state.AplicaPlanta && this.state.plantas.length > 0 ? (
                                        <select
                                          //onChange={(e) => { this.setState({ planta: e.target.value }) }}
                                          onChange={(e) =>
                                            this.inputChange(e.target)
                                          }
                                          value={0}
                                          className="form-select select2-hidden-accessible"
                                          data-control="select2"
                                          name="planta"
                                          data-placeholder="Select an option"
                                          data-select2-id="select2-data-19-5jji"
                                          disabled={this.props.match.params.opcion !== "2" ? false : true}
                                          aria-hidden="true"
                                        >
                                          <option
                                            data-select2-id="select2-data-21-znkb"
                                            value="0"
                                          >
                                            Seleccionar...
                                          </option>
                                          {this.state.plantas.map((e:any) => (
                                            <option value={e.Title}>
                                              {e.Title}
                                            </option>
                                          ))}
                                        </select>
                                      ) : null}

                                      <table>
                                        {this.state.plantasAplica &&
                                          this.state.plantasAplica.map((p:any, i:any) => (
                                            <tr>
                                              <td>- {p}</td>
                                              {
                                                this.props.match.params.opcion !== "2" ?

                                                  <td>
                                                    <span
                                                      onClick={() => {
                                                        this.deletePlanta(i)
                                                      }}
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-trash"
                                                        viewBox="0 0 16 16"
                                                      >
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path
                                                          fill-rule="evenodd"
                                                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                        />
                                                      </svg>
                                                    </span>
                                                  </td>

                                                  : null
                                              }

                                            </tr>
                                          ))}
                                      </table>
                                    </div>
                                  ) : null}
                                </div>

                                <div className="separator mt-4 mb-4"></div>

                                <div className="row mb-5 pl">
                                  {this.props.match.params.opcion == 1 || this.props.match.params.opcion == 3 ? (
                                    <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 mt-1">
                                      <label htmlFor="files">
                                        <h4>
                                          <span>
                                            Adjuntar contenidos a publicar
                                          </span>

                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            fill="currentColor"
                                            className="bi bi-plus-lg"
                                            viewBox="0 0 16 16"
                                          >
                                            <path
                                              fill-rule="evenodd"
                                              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                                            />
                                          </svg>
                                        </h4>
                                      </label>
                                    </div>
                                  ) : null}

                                  <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                    <div style={{ display: 'none' }}>
                                      <input
                                        disabled={!this.state.AdjuntarUrl ? false : true}
                                        multiple
                                        type="file"
                                        id="files"
                                        className="form-control-file"
                                        onChange={(e) => this.onChangeFile(e)}
                                      />
                                    </div>

                                    {this.state.Archivos && this.state.Archivos.length >= 0 ? this.state.Archivos.map((e:any, index:any) => (
                                      <div className="mt-1">
                                        <img
                                          title='.'
                                          className="IconoArchivo"
                                          src={this.pnp.getImageFile(e.name)}
                                        />
                                        <span className="titleDoc">
                                          {e.name}
                                        </span>

                                        <span
                                          onClick={() => {
                                            this.deleteArchivo(index)
                                          }} >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-trash"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path
                                              fill-rule="evenodd"
                                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                            />
                                          </svg>
                                        </span>
                                      </div>
                                    ))

                                      : null}


                                  </div>
                                </div>

                                {this.props.match.params.opcion == 3 ? (
                                  <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom mb-2">
                                    <div className="d-flex">
                                      <span className="form-check">
                                        {this.state.AdjuntarUrl == false ? (
                                          <input
                                            placeholder='.'
                                            className="form-check-input"
                                            type="radio"
                                            name="addUrl"
                                            id="RadioSeleccionado"
                                            value="1"
                                            onClick={(e) =>
                                              this.setState({ AdjuntarUrl: true })
                                            }
                                          />
                                        ) : (
                                          <input
                                            placeholder='.'
                                            className="form-check-input"
                                            type="radio"
                                            name="addUrl"
                                            value="1"
                                            onClick={(e) =>
                                              this.setState({
                                                AdjuntarUrl: false,
                                              })
                                            }
                                          />
                                        )}
                                      </span>

                                      <div>
                                        <label
                                          className="form-check-label pe-10 fs-5"
                                          htmlFor="flexRadioDefault"
                                        >
                                          Selecciona esta opción si vas a adjuntar
                                          una URL
                                        </label>
                                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                          {this.state.AdjuntarUrl == true ? (
                                            <input
                                              type="text"
                                              onChange={(e) => {
                                                this.setState({
                                                  Url: e.target.value,
                                                })
                                              }}
                                              className="form-control"
                                              name="input2"
                                              placeholder="Ingrese la URL"
                                              value={this.state.Url}
                                            />
                                          ) : null}
                                        </div>
                                      </div>



                                    </div>
                                  </div>
                                ) : null}

                                {this.props.match.params.opcion == 1 ? (
                                  <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom mb-2">
                                    <div className="d-flex">
                                      <span className="form-check">
                                        {this.state.AdjuntarUrl == false ? (
                                          <input
                                            placeholder='.'
                                            disabled={this.state.Archivos.length > 0 ? true : false}
                                            className="form-check-input"
                                            type="radio"
                                            name="addUrl"
                                            id="RadioSeleccionado"
                                            value="1"
                                            onClick={(e) =>
                                              this.setState({ AdjuntarUrl: true, Url:"" })
                                            }
                                          />
                                        ) : (
                                          <input
                                            placeholder='.'
                                            className="form-check-input"
                                            type="radio"
                                            name="addUrl"
                                            value="1"
                                            onClick={(e) =>
                                              this.setState({
                                                AdjuntarUrl: false, Url:""
                                              })
                                            }
                                          />
                                        )}
                                      </span>

                                      <div>
                                        <label
                                          className="form-check-label pe-10 fs-5"
                                          htmlFor="flexRadioDefault"
                                        >
                                          Selecciona esta opción si vas a adjuntar
                                          una URL
                                        </label>
                                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                          {this.state.AdjuntarUrl == true ? (
                                            <input
                                              type="text"
                                              onChange={(e) => {
                                                this.setState({
                                                  Url: e.target.value,
                                                })
                                              }}
                                              className="form-control"
                                              name="input2"
                                              placeholder="Ingrese la URL"
                                              value={this.state.Url}

                                            />
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}

                                <br />

                                <br />
                                {this.state.falta == true ? (
                                  <div className="alert alert-danger" role="alert">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-info-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>
                                    Debe diligenciar todos los campos obligatorios
                                    para continuar.
                                  </div>
                                ) : null}
                              </div>
                            ) : null}


                          </div>

                          {/* Pantalla 2 del formulario */}

                          {this.state.Pasos == 'Documentos del Mecanismo' &&
                            !this.state.enviado ? (
                            <div className="flex-column current">
                              <div className="row mb-5">
                                <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                  <h3 className="text-primary">
                                    Documentos del mecanismo
                                  </h3>
                                </div>
                              </div>

                              <div className="row mb-5 contenform">
                                {this.state.documentosMecanismo &&
                                  this.state.documentosMecanismo.length > 0 ? (
                                  <div>
                                    {this.state.documentosMecanismo.map((e:any) => (
                                      <div className="mt-1">
                                        <img
                                          title='.'
                                          className="IconoArchivo"
                                          src={this.pnp.getImageFile(e.Name)}
                                        />

                                        <span className="titleDoc">
                                          {e.Name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                              <div className="row mt-5">
                                <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                  <div className="alert alert-warning d-flex align-items-center p-5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      fill="currentColor"
                                      className="bi bi-exclamation-triangle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                                      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                                    </svg>
                                    <span className="svg-icon svg-icon-2hx svg-icon-warning me-4">
                                      <i className="fa fa-exclamation-triangle fs-4 text-warning"></i>
                                    </span>
                                    <div className="d-flex flex-column">
                                      <span>
                                        Con esta solicitud usted está
                                        solicitando eliminar la totalidad de
                                        documentos que componen el mecanismo.
                                        Para eliminar sólo uno o algunos de los
                                        anexos del mecanismo cancele esta
                                        solicitud y solicite una actualización
                                        del mecanismo
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {this.state.Pasos ==
                            'Plan de acción de los contenidos' ? (
                            <div className="flex-column current">
                              <div className="row mb-5">
                                <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                  <h3 className="text-primary">
                                    Plan de acción de los contenidos
                                  </h3>
                                </div>
                              </div>
                              <div className="row mb-5">
                                <label className="form-check form-switch form-check-custom">
                                  <span>
                                    <h4>Documentos actuales del mecanismo </h4>
                                  </span>

                                  <span className="FAQ">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-info-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>

                                    <span className="modalFAQ">
                                      {this.state.faqDocumentosMecanismo}
                                    </span>
                                  </span>
                                </label>

                                <small className="text-gray-600 fs-7">
                                  Indique a continuación el plan de acción a
                                  ejecutar para cada documento del mecanismo
                                </small>
                                <br />
                                <br />
                                {this.state.documentosMecanismo &&
                                  this.state.documentosMecanismo.length > 0 ? (
                                  <div className="tabla-Actualizar">
                                    {this.state.documentosMecanismo.map(
                                      (e:any, i:any) => (
                                        <div className="row">
                                          <div className="col-lg-7 col-md-7 col-xl-7 col-xxl-7">
                                            <img
                                              title='-'
                                              className="IconoArchivo"
                                              src={this.pnp.getImageFile(
                                                e.Name,
                                              )}
                                            />
                                            <span className="titleDoc">
                                              {e.Name}
                                            </span>
                                          </div>

                                          <div className="col-lg-5 col-md-5 col-xl-5 col-xxl-5">
                                            <select
                                              title='.'
                                              name={'PlanAccion' + i}
                                              className="form-select select2-hidden-accessible"
                                              id="tabla-Actualizar"
                                              value={
                                                this.state.ValorDocumentos[
                                                  'PlanAccion' + i
                                                ]
                                                  ? this.state.ValorDocumentos[
                                                  'PlanAccion' + i
                                                  ]
                                                  : 0
                                              }
                                              onChange={(e) =>
                                                this.selectPlanAccion(
                                                  e.target,
                                                  i,
                                                )
                                              }
                                            >
                                              <option value="0">
                                                Seleccionar...
                                              </option>
                                              <option value="Actualizar">
                                                Actualizar
                                              </option>
                                              <option value="Eliminar">
                                                Eliminar
                                              </option>
                                              <option value="Mantener">
                                                Mantener
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ) : null}

                                {this.state.failedDoc ? (
                                  <div
                                    className="alert alert-danger"
                                    role="alert">

                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-info-circle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>
                                    Debe diligenciar todos los campos
                                    obligatorios para continuar.
                                  </div>
                                ) : null}

                                {this.state.allDelete ? (
                                  <div
                                    id="allDelete"
                                    className="alert alert-warning"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      fill="currentColor"
                                      className="bi bi-exclamation-triangle"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                                      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                                    </svg>

                                    <span>
                                      Esta solicitud aplica un formulario de
                                      eliminación, más no de actualización.
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                          <div>
                            {this.state.Pasos == 'Aprobadores' ? (
                              <div className="flex-column current">
                                <div className="row mb-5">
                                  <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                    <h3 className="text-primary">Aprobadores</h3>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="mg-a">Aprobadores del área</h4>
                                </div>
                                <div className="row mb-5 contenform">
                                  <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                    <label className="form-label required">
                                      Elabora
                                    </label>
                                    <PeoplePicker
                                      context={this.props.context}
                                      titleText=""
                                      personSelectionLimit={1}
                                      groupName={''}
                                      showtooltip={true}
                                      required={true}
                                      onChange={(items) =>
                                        this._getPeoplePicker(
                                          items,
                                          'PersonaElabora',
                                        )
                                      }
                                      showHiddenInUI={false}
                                      ensureUser={true}
                                      principalTypes={[PrincipalType.User]}
                                      resolveDelay={1000}
                                      defaultSelectedUsers={[
                                        this.state.PersonaElaboraEMail
                                          ? this.state.PersonaElaboraEMail
                                          : '',
                                      ]}
                                    />
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                    <label className="form-label required">
                                      Revisa
                                    </label>
                                    <PeoplePicker
                                      context={this.props.context}
                                      titleText=""
                                      personSelectionLimit={1}
                                      groupName={''}
                                      showtooltip={true}
                                      required={true}
                                      disabled
                                      onChange={(items) =>
                                        this._getPeoplePicker(
                                          items,
                                          'PersonaRevisa',
                                        )
                                      }
                                      showHiddenInUI={false}
                                      ensureUser={true}
                                      principalTypes={[PrincipalType.User]}
                                      resolveDelay={1000}
                                      defaultSelectedUsers={[
                                        this.state.PersonaRevisaEMail
                                          ? this.state.PersonaRevisaEMail
                                          : '',
                                      ]}
                                    />
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                    <label className="form-label required">
                                      Aprueba
                                    </label>
                                    <PeoplePicker
                                      context={this.props.context}
                                      titleText=""
                                      personSelectionLimit={1}
                                      groupName={''}
                                      showtooltip={true}
                                      required={true}
                                      onChange={(items) =>
                                        this._getPeoplePicker(
                                          items,
                                          'PersonaAprueba',
                                        )
                                      }
                                      disabled={this.state.disabledGerente ? false : true}
                                      showHiddenInUI={false}
                                      ensureUser={true}
                                      principalTypes={[PrincipalType.User]}
                                      resolveDelay={1000}
                                      defaultSelectedUsers={[
                                        this.state.PersonaApruebaEMail
                                          ? this.state.PersonaApruebaEMail
                                          : '',
                                      ]}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <h4 className="mg-a">
                                    Aprobadores de áreas involucradas
                                  </h4>
                                </div>
                                <div className="row mb-5 contenform">
                                  <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 mt-6">
                                    <small className="text-gray-600 fs-7">
                                      Seleccione las áreas que tienen
                                      responsabilidad en el documento
                                    </small>
                                    <br />
                                    <br />
                                    {this.state.cAprobadoresArea.length < 4 ? (
                                      <input
                                        type="button"
                                        className="btn btn-secondary"
                                        value="Agregar Aprobadores"
                                        onClick={() =>
                                          this.addAprobadoresArea('Add')
                                        }
                                      />
                                    ) : null}
                                    <br />
                                    <br />
                                  </div>

                                  {this.state.cAprobadoresArea.length > 0 &&
                                    this.state.cAprobadoresArea.map(
                                      (e:any, index:any) => (
                                        <div className="row">
                                          <div className="col-lg-4 col-md-4 col-xl-4 marginBottom">
                                            <label>Dirección {index + 1} </label>
                                            <select
                                              onChange={(event) =>
                                                this.getAprobadoresPorArea(
                                                  event.target.value,
                                                  index,
                                                )
                                              }
                                              className="form-select select2-hidden-accessible"
                                              data-control="select2"
                                              data-placeholder="Select an option"
                                              data-select2-id="select2-data-22-noy6"
                                              value={e.AprobadoresNombreDireccion}
                                              aria-hidden="true"
                                            >
                                              <option data-select2-id="select2-data-24-qr8d">
                                                Selecciona...
                                              </option>
                                              {this.state.direcciones.map((a:any) => (
                                                <option value={a.NombreDireccion}>
                                                  {a.NombreDireccion}
                                                </option>
                                              ))}
                                            </select>
                                          </div>

                                          {this.state['AreasDireccion' + index] &&
                                            this.state['AreasDireccion' + index]
                                              .length > 0 ? (
                                            <div className="col-lg-4 col-md-4 col-xl-4 marginBottom">
                                              <label>área {index + 1} </label>
                                              <select
                                                onChange={(eventA) =>
                                                  this.getAprobadoresArea(
                                                    eventA.target.value,
                                                    index,
                                                  )
                                                }
                                                className="form-select select2-hidden-accessible"
                                                data-control="select2"
                                                data-placeholder="Select an option"
                                                data-select2-id="select2-data-22-noy6"
                                                value={e.AprobadoresNombreAreaId}
                                                aria-hidden="true"
                                              >
                                                <option data-select2-id="select2-data-24-qr8d">
                                                  Selecciona...
                                                </option>
                                                {this.state[
                                                  'AreasDireccion' + index
                                                ].map((a:any) => (
                                                  <option value={a.ID}>
                                                    {a.NombreArea}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          ) : null}

                                          <div className="col-lg-3 col-md-3 col-xl-3 marginBottom">
                                            <label>Aprobador</label>{' '}
                                            {
                                              this.state.cAprobadoresArea[index]
                                                .Area
                                            }
                                            <PeoplePicker
                                              disabled
                                              context={this.props.context}
                                              titleText=""
                                              personSelectionLimit={1}
                                              groupName={''}
                                              showtooltip={true}
                                              required={true}
                                              onChange={(items) =>
                                                this._getPeoplePickerG(
                                                  items,
                                                  index,
                                                )
                                              }
                                              showHiddenInUI={false}
                                              ensureUser={true}
                                              principalTypes={[
                                                PrincipalType.User,
                                              ]}
                                              resolveDelay={1000}
                                              defaultSelectedUsers={[
                                                e.AprobadoresAreaEmail
                                                  ? e.AprobadoresAreaEmail
                                                  : '',
                                              ]}
                                            />
                                          </div>

                                          {index ==
                                            this.state.cAprobadoresArea.length -
                                            1 ? (
                                            <div className="col-lg-1 col-md-1 col-xl-1 marginBottom">
                                              <span
                                                onClick={() =>
                                                  this.elimindarAprobadores(
                                                    index,
                                                    'cAprobadoresArea',
                                                  )
                                                }
                                              >
                                                <svg
                                                  id="Scrap"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  fill="currentColor"
                                                  className="bi bi-trash"
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                  <path
                                                    fill-rule="evenodd"
                                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                  />
                                                </svg>
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                      ),
                                    )}
                                </div>
                                <div className="mg-a">
                                  <h4>Otros aprobadores</h4>
                                </div>
                                <div className="row mb-5 contenform">
                                  {this.state.cAprobadores && this.state.cAprobadores.length > 0 ? this.state.cAprobadores.map((p:any, i:any) =>
                                    p.Cargo === 'Auditor' && this.state.Auditoria ? (
                                      <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                        <label className="form-label">
                                          {p.Cargo}
                                        </label>

                                        <PeoplePicker
                                          context={this.props.context}
                                          personSelectionLimit={1}
                                          groupName={''}
                                          showtooltip={true}
                                          required={true}
                                          onChange={(items) =>
                                            this.getPeoplePickerOtrosAprobadores(
                                              items,
                                              i,
                                              p.Cargo,
                                            )
                                          }
                                          showHiddenInUI={false}
                                          ensureUser={true}
                                          principalTypes={[
                                            PrincipalType.User,
                                          ]}
                                          resolveDelay={1000}
                                          disabled={true}
                                          defaultSelectedUsers={[
                                            p.AprobadoresConRolEmail
                                              ? p.AprobadoresConRolEmail
                                              : '',
                                          ]}
                                        />
                                      </div>
                                    ) : null,
                                  )
                                    : null}

                                  { }

                                  {this.state.cAprobadores && this.state.cAprobadores.length > 0
                                    ? this.state.cAprobadores.map((p:any, i:any) =>
                                      p.Cargo !== 'Auditor' && p.Cargo !== 'Líder GDC' ? (
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label">
                                            {p.Cargo}
                                          </label>

                                          <PeoplePicker
                                            context={this.props.context}
                                            personSelectionLimit={1}
                                            groupName={''}
                                            showtooltip={true}
                                            required={true}
                                            onChange={(items) =>
                                              this.getPeoplePickerOtrosAprobadores(
                                                items,
                                                i,
                                                p.Cargo,
                                              )
                                            }
                                            showHiddenInUI={false}
                                            ensureUser={true}
                                            principalTypes={[
                                              PrincipalType.User,
                                            ]}
                                            resolveDelay={1000}
                                            disabled={true}
                                            defaultSelectedUsers={[
                                              p.AprobadoresConRolEmail
                                                ? p.AprobadoresConRolEmail
                                                : '',
                                            ]}
                                          />
                                        </div>
                                      ) : null,
                                    )
                                    : null}
                                </div>

                                <div className="row mb-5 contenform">
                                  <div>
                                    <label className="form-check form-switch form-check-custom1">
                                      <h4>Agregar Aprobadores</h4>

                                      <span className="FAQ">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-info-circle"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                        </svg>

                                        <span className="modalFAQ">
                                          {this.state.faqAprobadores}
                                        </span>
                                      </span>
                                    </label>
                                  </div>
                                  <div>
                                    {this.state.cDemasAprobadores.length < 4 ? (
                                      <input
                                        type="button"
                                        className="btn btn-secondary"
                                        value="Agregar Aprobadores"
                                        onClick={() =>
                                          this.addDemasAprobadores('Add')
                                        }
                                      />
                                    ) : null}
                                    <br />
                                    <br />
                                  </div>

                                  {this.state.cDemasAprobadores.length > 0 &&
                                    this.state.cDemasAprobadores.map(
                                      (e:any, index:any) => (
                                        <div className="row">
                                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                            <h4>Aprobador {index + 1}</h4>
                                          </div>
                                          <div className="col-lg-5 col-md-5 col-xl-5 col-xxl-5 marginBottom">
                                            <PeoplePicker
                                              context={this.props.context}
                                              titleText=""
                                              personSelectionLimit={1}
                                              groupName={''}
                                              showtooltip={true}
                                              required={true}
                                              //disabled={this.state.disabled == 'disabled' ? true : false}
                                              onChange={(items) =>
                                                this.getPeoplePickerDemasAprobadores(
                                                  items,
                                                  index,
                                                )
                                              }
                                              showHiddenInUI={false}
                                              ensureUser={true}
                                              principalTypes={[
                                                PrincipalType.User,
                                              ]}
                                              resolveDelay={1000}
                                              defaultSelectedUsers={[
                                                e.DemasAprobadoresEmail
                                                  ? e.DemasAprobadoresEmail
                                                  : '',
                                              ]}
                                            />
                                          </div>

                                          {index ==
                                            this.state.cDemasAprobadores.length -
                                            1 ? (
                                            <div className="col-lg-1 col-md-1 col-xl-1 col-xxl-1 marginBottom">
                                              <span
                                                onClick={() =>
                                                  this.elimindarAprobadores(
                                                    index,
                                                    'cDemasAprobadores',
                                                  )
                                                }
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  fill="currentColor"
                                                  className="bi bi-trash"
                                                  viewBox="0 0 16 16"
                                                >
                                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                  <path
                                                    fill-rule="evenodd"
                                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                  />
                                                </svg>
                                              </span>
                                            </div>
                                          ) : null}
                                        </div>
                                      ),
                                    )}
                                </div>

                                <div className="ro mb-5 contenform">
                                  <div className="d-flex align-items-center mb-3 alitem">
                                    <a
                                      target="_blank"
                                      href={
                                        this.props.urlSitioPrincipal +
                                        '/' +
                                        this.props.NombreSubsitio +
                                        '/Biblioteca General/MATRIZ DE REVISION Y APROBACION.xlsx?web=1'
                                      }
                                      className="text-primary text-hover-primary fs-3"
                                    >
                                      <i className="fas fa-link text-primary"></i>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        fill="currentColor"
                                        className="bi bi-link"
                                        viewBox="0 0 17 18"
                                      >
                                        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                                        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                                      </svg>
                                      Consultar matriz de aprobación de gestión
                                      del conocimiento
                                    </a>
                                  </div>
                                </div>

                                {this.state.falta == true && this.state.Pasos == "Aprobadores" ? (
                                  <div
                                    className="alert alert-danger"
                                    role="alert"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-info-circle"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>{' '}
                                    Debe diligenciar todos los campos obligatorios
                                    para continuar.
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>

                          {/* Pantalla 3 del formulario */}
                          {this.state.Pasos == 'Control de Cambios' ? (
                            <div className="flex-column current">
                              <div className="row mb-5">
                                <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                  <h3 className="text-primary">
                                    Control de Cambios
                                  </h3>
                                </div>
                              </div>

                              <div className="row mb-5 contenform">
                                <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                                  <label className="form-label required">
                                    Motivo
                                  </label>

                                  <select
                                    onChange={(e) => {
                                      this.setState({ Motivo: e.target.value })
                                    }}
                                    className="form-select select2-hidden-accessible"
                                    value={this.state.Motivo}
                                    data-control="select2"
                                    data-placeholder="Select an option"
                                    data-select2-id="select2-data-34-x4p4"
                                    aria-hidden="true"
                                  >
                                    <option
                                      data-select2-id="select2-data-36-v336"
                                      value=""
                                    >
                                      Seleccionar..
                                    </option>
                                    {this.state.Motivos.map((e:any) => (
                                      <option>{e.Title}</option>
                                    ))}
                                  </select>
                                </div>

                                {this.props.match.params.opcion == 2 ? null : (
                                  <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                                    <label className="form-label required " >
                                      Descripción:
                                    </label>

                                    <textarea

                                      value={this.state.DescripcionMotivo}
                                      onChange={(e) => { this.longitudcadena(e.target.value), this.setState({ DescripcionMotivo: e.target.value }) }}
                                      className="form-control"
                                      name="input2"
                                      placeholder="Ingrese la Descripción"
                                      maxLength={300}
                                    ></textarea>
                                  </div>

                                )}
                                {this.props.match.params.opcion == 2 ? null : (
                                  <p id="Contadordescrip">{this.state.CantidadCaracteres}/300</p>
                                )}
                                <br />
                              </div>

                              <div className="row mb-5 contenform">
                                <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom mt-5">
                                  <label className="form-check form-switch form-check-custom">
                                    {this.state.CompromisoDelPrograma ==
                                      false ? (
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={this.state.CompromisoDelPrograma}
                                        onChange={(e) => {
                                          this.setState({
                                            CompromisoDelPrograma: true,
                                          })
                                        }}
                                      />
                                    ) : (
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={this.state.CompromisoDelPrograma}
                                        onChange={(e) => {
                                          this.setState({
                                            CompromisoDelPrograma: false,
                                          })
                                        }}
                                      />
                                    )}

                                    <span className="form-check-label mx-15">
                                      Compromiso del Cronograma{' '}
                                    </span>

                                    <span className="FAQ">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-info-circle"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                      </svg>

                                      <span className="modalFAQ">
                                        {this.state.faqCompromiso}
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          <div>
                            {/* Pantalla 4 del formulario */}
                            {this.state.Pasos == 'success' ? (
                              <div className="flex-column centerContent current">
                                <div className="row mb-5">
                                  <div className="card-title flex-column p-4 mb-5">
                                    <h2 className="text-primary fs-1">
                                      Solicitud enviada con éxito.
                                    </h2>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                    <figure>
                                      <img
                                        title='.'
                                        src={
                                          this.props.urlSitioPrincipal +
                                          '/Style%20Library/Root/Quala_Logo_GC.png'
                                        }
                                        width="35%"
                                        height="auto"
                                      />
                                    </figure>
                                  </div>
                                  <h3 className="text-gray-600 fs-5">
                                    Puedes consultar el estado de tu solicitud
                                    en{' '}
                                    <a
                                      href={this.state.linkFinal}
                                      target="_blank"
                                    >
                                      está página.
                                    </a>
                                  </h3>
                                  <small className="text-gray-600 fs-5">
                                    {this.state.msjFinal}
                                  </small>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </form>

                      <div className="d-flex flex-stack">
                        <div className="me-2">
                          {/* Boton Regresar */}
                          {this.state.posPaso > 0 && !this.state.enviado ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                this.setState({
                                  Pasos: this.state.secciones[
                                    this.state.posPaso - 1
                                  ].Title,
                                  posPaso: this.state.posPaso - 1,
                                })
                              }}
                              className="btn-regresar"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-chevron-left"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                                />
                              </svg>
                              Regresar
                            </button>
                          ) : null}
                        </div>

                        {/* Boton Cancelar */}
                        <div>
                          {this.state.posPaso >= 0 && !this.state.enviado ? (
                            <button
                              type="button"
                              onClick={() => this.setState({ Cancelar: true })}
                              className="btn btn-cancelar"
                            >
                              Cancelar
                            </button>
                          ) : null}
                          {/* Boton Continuar */}

                          {this.state.posPaso < this.state.secciones.length - 1 ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={(e) => {
                                this.inputChange(e.target)
                              }}
                              value="Continuar"
                              name="continuar"
                            >
                              Continuar
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-chevron-right"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                />
                              </svg>
                            </button>
                          ) : null}

                          {/* Boton Enviar */}
                          {this.state.posPaso == this.state.secciones.length - 1 &&
                            !this.state.enviado &&
                            this.props.match.params.opcion == 1 &&
                            this.state.DescripcionMotivo.length > 0 &&
                            this.state.Motivo.length > 0 ? (
                            <button
                              name="continuar"
                              onClick={() => this.GuardarDocumentos()}
                              type="button"
                              className="btn btn-primary"
                            >
                              <span className="indicator-label"> Enviar </span>
                              <span className="indicator-progress">
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                              </span>
                            </button>
                          ) : null}

                          {this.state.posPaso ==
                            this.state.secciones.length - 1 &&
                            !this.state.enviado &&
                            this.props.match.params.opcion == 2 &&
                            this.state.Motivo.length > 0 ? (
                            <button
                              name="continuar"
                              onClick={() => this.BorrarArchivos()}
                              type="button"
                              className="btn btn-primary"
                            >
                              <span className="indicator-label"> Enviar </span>
                              <span className="indicator-progress">
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                              </span>
                            </button>
                          ) : null}

                          {this.state.posPaso == this.state.secciones.length - 1 && !this.state.enviado &&
                            this.props.match.params.opcion == 3 &&
                            this.state.Motivo.length > 0 && this.state.CantidadCaracteres > 0 ? (
                            <button
                              name="continuar"
                              type="button"
                              onClick={() => this.ActualizarPlanAccion()}
                              className="btn btn-primary"
                            >
                              <span className="indicator-label"> Enviar </span>
                              <span className="indicator-progress">
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                              </span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {this.state.loading ? (
              <div className="contentModal">
                <div className="modalLoading">Trabajando en ello...</div>
              </div>
            ) : null}
          </div>
        
      </>
    )
  }
}

export default withRouter(CrearContenido)