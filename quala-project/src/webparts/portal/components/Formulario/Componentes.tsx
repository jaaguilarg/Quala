import * as React from 'react';
import { connect } from 'react-redux';
import { PNP } from '../Util/util';
import 'react-quill/dist/quill.snow.css'; 
import {withRouter} from 'react-router-dom';
import {
  PeoplePicker,
  PrincipalType,} from '@pnp/spfx-controls-react/lib/PeoplePicker';
import '@pnp/sp/taxonomy';
import * as _ from "underscore";
import '@pnp/sp/sites';
import '@pnp/sp/features';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/content-types';
import '@pnp/sp/folders';
import '@pnp/sp/items';



export interface IComponentesProps {

  Titulo: any
  context: any
  Webpartcontext: any
  Subsitio: any
  NombreSubsitio: any
  match: any
  urlSitioPrincipal: any
  currentUser: any
  Direcciones: any
  Areas: any
  SubAreas: any
  history: any
  Id: any
  boton: any
  Desabilitado: any
  closeModal: any
  openModalExitoso: any
  cambioEstadoAprobacion: any
  parametros: any
  accion: any
  

}


class Componentes extends React.Component<IComponentesProps, any>{
  public pnp: PNP
  constructor(props: any) {
    super(props)

    this.pnp = new PNP(this.props.context)
 

    var pasos = [
      { Title: 'Datos del Mecanismo' },
      //{Title: 'Documentos del Mecanismo'},
      { Title: 'Aprobadores' },
      { Title: 'Control de Cambios' },
      //{Title:'Plan de accin de los contenidos'}
    ]

    this.state = {
      boton: this.props.boton,
      mostrarModal: false,
      idMecanismo: this.props.Id,
      NombreDireccion: [],
      lapiz: true,
      direccion: "",
      NombreArea: [],
      Area: "",
      areasTotal: this.props.Areas,
      NombreAreas: [],
      selectedDireccion: '',
      tipo: '',
      seccionesOk: false,
      Aprobadores: [],
      urlSite: '',
      sitio: '',
      paises: [],
      urlSitePrincipal: '',
      sitioPrincipal: '',
      direcciones: this.props.Direcciones,
      areas: [],
      area: '',
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
      NombreMecanismo: "",
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
      NombreMecanismo1: "",
      deshabilitarBotonAuditoria: false,
      driver1: "",
      Areaconsulta: "",
      Planta: [],
      PlantasGuardadas: "",
      DireccionesFilial: [],
      AreasFilial: [],
      SubAreasFilial: [],
      pilarSelected: "",
      idPilarSelected: "",
      NombreMecanismoSelected: "",
      NombreMecanismoLocal: "",
      NameS: "", IdSolicitud: 0,
      MensajeModal: "",
      PieModal: "",
      exitosoEnviarAjustes: false,
      mostrarModalExitoso: false,
      respuestaSolicitudCarga: [],
      item: {  
        Title: "",  
        Description: ""  
    } ,

    NuevosTiposDocu:[]
    }
  }


  public NuevosTiposDocu :any=[]
  
  //Funcion que inserta tipo de documento en lista temporal para el manejo de texto enriquecido 
  public insertarTipo(){

    this.NuevosTiposDocu.forEach((value:any,index:any,)=>{

      let obj:any={
        Title:value.TipoFormato,
        Url:value.Url

      }

      this.pnp.insertItemRoot(
        "TemporalTiposDocumentos",
        obj
      ).then((items:any)=>{
        console.log("Guardado")
      })

    })
  }
  //Funcion para cambiar el tipo de mecanismo 
  public CambioTipoMecanismo(TipoFormato:any,Url:any){


    var auxiliar:any=this.NuevosTiposDocu

    
    var pos:any= auxiliar.map((e:any) => e.Url).indexOf(Url);

    if(pos==-1){
      auxiliar.push({TipoFormato:TipoFormato,Url:Url})
    }else{
      
      auxiliar[pos]={TipoFormato:TipoFormato,Url:Url}
    }

    console.log(pos)
    console.log(auxiliar)

    this.NuevosTiposDocu=auxiliar

  }
  //Funcion de guardado Exitoso
  public finishSave() {
    this.setState({
      Pasos: 'success',
      enviado: true,
      loading: false,
    })
  }

  //Funcion que consulta los mecanismos segun el driver seleccionado.
  private consultarMecanismoFiltro(Driver: string, seccion: string, existente?: boolean) {
    if (existente) {
      this.pnp.getListItemsRoot(
        'Control Solicitudes',
        ['*'],
        `ID_x0020_Mecanismo_x0020_Local eq '${this.state.idMecanismo}'`,
        '',
      )
        .then((res) => {
          if (res.length > 0) {
            this.setState(
              {
                NombreMecanismo: res[0].NombreMecanismo,
              }
            )
          }
        })
    }
    if (this.state.TipoSolicitud === "Creacin" || this.state.TipoSolicitud === "Actualizacin") {
      this.pnp.getListItems(
        'Mecanismos Local',
        ['*', 'Nombre_x0020_Driver/Id', 'Nombre_x0020_Driver/Nombre_x0020_Driver'],
        "Nombre_x0020_Driver/Nombre_x0020_Driver eq '" + Driver + "'" + " and Nombre_x0020_Mecanismo_x0020_Bas eq '" + seccion + "'",
        'Nombre_x0020_Driver',
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
                      // tipoMecanismo: this.state.dataMecanismo.TipoMecanismo
                      // descripcionMecanismo: seccion,
                      //NombreMecanismo: 2,
                      Url: this.state.dataMecanismo.Url,
                      // AdjuntarUrl: this.state.dataMecanismo.Url != '' ? true : false,
                      Areaconsulta: this.state.dataMecanismo.Area,
                    })
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
        'Mecanismos Local',
        ['*', 'Nombre_x0020_Driver/Id', 'Nombre_x0020_Driver/Nombre_x0020_Driver'],
        "Nombre_x0020_Driver/Nombre_x0020_Driver eq '" + Driver + "'" + " and Nombre_x0020_Mecanismo_x0020_Bas eq '" + seccion + "'",
        'Nombre_x0020_Driver',
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
                      // tipoMecanismo: this.state.dataMecanismo.TipoMecanismo,
                      // descripcionMecanismo: seccion,
                      //NombreMecanismo: 2,
                      Url: this.state.dataMecanismo.Url,
                      // AdjuntarUrl: this.state.dataMecanismo.Url != '' ? true : false,
                      Areaconsulta: this.state.dataMecanismo.Area
                    })


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

  // Funcion Abrir Modal
  private openModal() {
    this.setState({ mostrarModal: true })
  }

  // Obtiene una lista de pases de SharePoint y actualiza el estado del componente con los resultados.
  public paises() {
    // Usa la biblioteca PnP JS para obtener elementos de lista de la lista de SharePoint 'Paises'.
    // El segundo parmetro en el mtodo getListItemsRoot especifica qu columnas recuperar.
    // Se pasa una cadena vaca como tercer y cuarto parmetro para recuperar todos los elementos.
    this.pnp.getListItemsRoot('Paises', ['Title'], '', '').then((res) =>
      // Actualiza el estado del componente con la lista de pases recuperada.
      // El parmetro 'res' contiene una matriz de objetos de elementos de lista, donde cada objeto representa un pas.
      this.setState({
        paises: res,
      }),
    );
  }

  // Elimina un archivo de la matriz de archivos y actualiza el estado del componente.
  private deleteArchivo(index: any) {
    // Hace una copia de la matriz de archivos actual del estado del componente.
    const archivos = this.state.Archivos;
    // Elimina el archivo en el ndice especificado de la matriz.
    archivos.splice(index, 1);

    // Actualiza el estado del componente con la matriz de archivos modificada.
    this.setState({
      Archivos: archivos,
    });
  }

  // Maneja el evento onChange del input de archivos y actualiza el estado del componente con los archivos seleccionados.
  private onChangeFile(e: any,) {
    // Crea una copia de la matriz actual de archivos en el estado del componente.
    const Archivos = [...this.state.Archivos];

    // Si se seleccion al menos un archivo...
    if (e) {
      // Itera a travs de los archivos seleccionados y los agrega a la matriz de archivos.
      for (var i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        Archivos.push(file);

        // Actualiza el estado del componente con la nueva matriz de archivos.
        this.setState({ Archivos }, () => {

        });
      }
    }
  }
  //Funcion para construir la url con el nombre del sitio
  public async siteName() {
    /*
    const oContext: IContextInfo = await sp.site.getContextInfo();
    oContext.WebFullUrl
    this.setState({ NameS: oContext.WebFullUrl })
    */
  }

  //Funcion para consultar plantas
  private plantas() {
    this.pnp.getListItems(
      "Planta", // Nombre de la lista
      ["*"], // Columnas que se van a obtener (en este caso, todas las columnas)
      "", // Filtro (en este caso, no se utiliza)
      "", // Orden (en este caso, no se utiliza)
      "",0,'NV'
    ).then((items => {
      // Una vez que se obtienen los elementos, se actualiza el estado de la componente
      this.setState({ plantas: items })
    }))
  }

  //Elimina una planta del arreglo de plantas aplicables y actualiza el estado de la componente
  private deletePlanta(index: number): void {
    // Se obtiene una copia del arreglo de plantas aplicables del estado actual
    const plantasAplica = [...this.state.plantasAplica];

    // Se elimina la planta en el ndice especificado del arreglo de plantas aplicables
    if (!this.props.Desabilitado) {
      plantasAplica.splice(index, 1);
    }

    // Se actualiza el estado de la componente con el nuevo arreglo de plantas aplicables sin la planta eliminada
    this.setState({
      plantasAplica: plantasAplica,
    });
  }

  //Funcion que permite consultar el estado de auditoria del mecanismo
  public inputChange(target: any): void {
    // Obtiene los valores del estado necesarios para la funcin
    const pasos = this.state.Pasos;
    const posPaso = this.state.posPaso;
    const value = target.value;
    const name = target.name;
    console.log(pasos)
    if (name == 'continuar' && !this.props.Desabilitado) {
      if (
        this.state.direccion !== undefined &&
        this.state.area !== undefined &&
        this.state.Driver !== undefined &&
        this.state.NombreMecanismo !== "" &&
        this.state.tipoMecanismo &&
        this.state.tipoMecanismo.length >= 1 && ((this.state.AplicaPlanta == true && this.state.plantasAplica.length > 0) || this.state.AplicaPlanta == false)
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

    if (name === 'Guardar') {
      this.setState({
        Pasos: this.state.secciones[posPaso + 1].Title,
        posPaso: posPaso + 1,
        falta: false,
      })
    }
    if (this.props.Desabilitado) {
      this.setState({
        Pasos: this.state.secciones[posPaso + 1].Title,
        posPaso: posPaso + 1,
        falta: false,
      })

    }

    if (name === 'tipoMecanismo') {

      this.consultarMatrizAprobacion()
    }
    else if (name == 'pilar') {
      this.setState({ pilarSelected: value });
      if (value == 'No aplica') {
        this.setState({
          drivers: [],
        })
      } else {
        this.consultarDriver(value)
      }
    }
    else if (name == 'driver') {
      this.setState({ Driver: value });
    }
    else if (name === "MecanismoDriver") {
      this.setState({
        SeccionMecanismo: 'Mecanismo del Driver', numMecanismoSelected: 2,
        mecanismoLocal: "",
        NombreMecanismoSelected: "",
        NombreMecanismoLocal: "",
      },
        () => {
          this.consultarMecanismoFiltro(this.state.Driver, this.state.SeccionMecanismo)
        });

    }
    else if (name === "OtroMecanismo") {
      this.setState({
        numMecanismoSelected: 1,
        mecanismoLocal: "",
        SeccionMecanismo: 'Otro Mecanismo Operacional',
        NombreMecanismoSelected: "",
        NombreMecanismoLocal: "",
      },
        () => {
          this.consultarMecanismoFiltro(this.state.Driver, this.state.SeccionMecanismo)
        });
    }
    else if (name == "nombreMecanismoPublicar") {
      this.setState({ NombreMecanismoLocal: value });
    }
    else if (name == 'mecanismo') {
      this.setState({ NombreMecanismoSelected: value, NombreMecanismoLocal: value });
    }
    else if (name == 'planta') {
      if (value != 0) {
        var plantasAplica = this.state.plantasAplica

        var p = plantasAplica.filter((x: any) => x == value)

        if (p.length == 0) {
          plantasAplica.push(value)

          this.setState({
            plantasAplica: plantasAplica,
            planta: 0,
          })
        }
      }
    }
    // Actualiza el estado con el valor del campo de formulario que cambi y la direccin seleccionada
    this.setState(
      {
        [name]: value,
        selectedDireccion: target.value,
      },
      // Llama a la funcin consultarAreas despus de que se actualice el estado
      () => {
        this.consultarAreas();
      }
    );
  }

  //Funcion que consulta los motivos de la lista parametrosGenerales y devuelve un objeto con esta informacion.
  private consultarMatrizAprobacion() {
    const parametro = this.props.parametros.find((p:any) => p.Llave === "MatrizAprobacion");

    parametro && parametro.length > 0 ? this.setState({MatrizAprobacion: parametro}, () => {this.ConsultarMatriz(this.state.tipoMecanismo)}) : null;
        
  }

  //Funcion que consulta la matriz por tipo de mecanismo trayendo los roles que interactuan con el tipo de mecanismo
  private ConsultarMatriz(TipoMecanismo: any) {
   /* this.pnp
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

          var auxMatriz: any = []

          aux.forEach((item: any, index: any) => {
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
      })*/
  }

  //Consulta los usuario que aprueban por direccion y area
  /*private consultarMatrizApro() {
    this.pnp
      .getListItems(
        'MatrizAprobacion',
        ['*'],
        "Direccion eq '" + this.state.direccion + "' and Area eq '" + this.state.area + "'",
        '',
      )
      .then((apro) => {
        if (apro.length > 0) {
          var items = apro[0]

          //var disabledGerente = false


          if (items.PermiteCambioGerente === true) {
            this.setState({ disabledGerente: true })
          }

          var auxAprobadores: any = []
          var PersonaRevisa: any = 0
          var PersonaRevisaEMail: any = ''

          var c = 0
          var d = 0
          console.log(c)

          this.state.MatrizRol.forEach((item: any, index: any) => {
            var rolActual = this.state.rolesAprobadores.filter(
              (x: any) => x.Clave == item,
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
                c++
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

  //Funcion que consulta los aprobadores por Rol segun matriz de aprobacion para traer los aprobadores por area.
  /*private consultarAprobadores() {
    var aprueba = ''
    var apruebaId = 0

    var AprobadoresConRol: any = []

    this.state.PersonasAprobadoras.forEach((item: any, index: any) => {

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
            var AprobadoresConRol = []
            var AuxAprobadoresConRol = Apro.filter((x: any) => x.Title == 'Rol')

            AuxAprobadoresConRol.forEach((item: any, index: any) => {
               AprobadoresConRol["AprobadoresCargo" + index] = item.Aprobador.ID
                  AprobadoresConRol["AprobadoresCargoID" + index] = item.ID
                  AprobadoresConRol["Cargo" + index] = item.Cargo
                  AprobadoresConRol["AprobadoresConRolEmail" + index] = item.Aprobador.EMail

              AprobadoresConRol.push({
                AprobadoresCargo: item.Aprobador.ID,
                AprobadoresCargoID: item.ID,
                Cargo: item.Cargo,
                AprobadoresConRolEmail: item.Aprobador.EMail,
              })
            })

            var DemasAprobadores = []
            var AuxDemasAprobadores = Apro.filter((x: any) => x.Title == 'Otros')
            AuxDemasAprobadores.forEach((item: any, index: any) => {
              DemasAprobadores[index]["DemasAprobadores"] = item.Aprobador.ID
                  DemasAprobadores[index]["DemasAprobadoresID"] = item.ID
                  DemasAprobadores[index]["DemasAprobadoresEMail"] = item.Aprobador.EMail

              DemasAprobadores.push({
                DemasAprobadores: item.Aprobador.ID,
                DemasAprobadoresID: item.ID,
                DemasAprobadoresEmail: item.Aprobador.EMail,
              })
            })

            this.setState({
              //cAprobadoresArea: AprobadoresArea,
              //cAprobadores: AprobadoresConRol,
              //cDemasAprobadores: DemasAprobadores
            })
          }
        })
    }
  }*/
  
  //Funcion que asocia al usuario de seguridad  que se colocan en el campo PeoplePicker.
  private getPeoplePickerSeguridad(items: any[]) {
    let PersonasSeguridad = []
    let PersonaSeguridadEmail = []
    for (let item in items) {
      PersonasSeguridad.push(items[item].id)

      PersonaSeguridadEmail.push(items[item].secondaryText)
    }

    this.setState({
      PersonaSeguridad: PersonasSeguridad,
      PersonaSeguridadEmail: PersonaSeguridadEmail,
      correosSeguridad: PersonaSeguridadEmail
    })
  }

  // Convierte la primera letra del NombreSubsitio recibido en mayscula y actualiza el estado de la componente con el valor convertido.
  private convertirPrimeraLetra() {
    // Verifica si el NombreSubsitio existe
    if (this.props.NombreSubsitio) {
      // Obtiene el valor del NombreSubsitio
      const prueba = this.props.NombreSubsitio;
      // Convierte la primera letra del valor en mayscula y lo guarda en una variable
      const prueba2 = prueba[0].toUpperCase() + prueba.substring(1);
      // Actualiza el estado de la componente con el valor convertido
      this.setState(
        {
          NombreConvertido: prueba2,
        },
        // Ejecuta el mtodo getGroups() de la biblioteca PnP
        () => {
          this.pnp.getGroups();
        },
      );
    } else {
      // Si el NombreSubsitio no existe, muestra un mensaje de error en la consola
      // console.log("No se encuentra Nombre");
    }
  }

  //Funcion que consulta los distintos roles de la lista RolesAprobadores y devuelve un objeto con la informacion de esta.
  private consultarRoles() {
    this.pnp.getListItems('RolesAprobadores', ['*'], '', '').then((res) => {
      this.setState({
        rolesAprobadores: res,
      })
    })
  }

  //Funcion que consulta los motivos de la lista parametrosGenerales y devuelve un objeto con esta informacion.
  private consultarMotivos() {
    this.pnp
      .getListItemsRoot(
        'Parametros Tecnicos',
        ['*'],
        "Llave eq 'Motivo'",
        '',
      )
      .then((res) =>
        this.setState({
          Motivos: res,
        }),
      )
  }
  
  // Funcion que consulta las direcciones desde el sitio principal y retorna un objeto con esta informacion.
  public consultarSubarea() {
    
    const ViewXml = `

      <FieldRef Name="Direccion"/>
      <FieldRef Name="Area"/>
      <FieldRef Name="SubArea"/>

    `;
    const filterXml = `
      <Query>
        <Where>
          <Eq>
            <FieldRef Name="Area" />
            <Value Type="TaxonomyFieldType">${this.state.area}</Value>
          </Eq>
        </Where>
      </Query>
    `;

    this.pnp.getListItemsWithTaxo('', 'EstructuraOrganizacional', ViewXml, filterXml)
      .then((respuesta) => {
        const SubAreasFilial: any = [];
        const SubAreasuniq = _.uniq(respuesta, e => e.SubArea.Label);

        SubAreasuniq.forEach((e) => {
          if (e.Area && e.SubArea) {
            SubAreasFilial.push({
              ID: e.ID,
              SubAreas: e.SubArea.Label,
            });
          }
        });

        this.setState({
          SubAreasFilial: SubAreasFilial,
        });
      })
  }

  // Funcion consultat tipo de mecanismo
  public ConsultarTipoMecanismo(ID: any){
    var ViewXml = `<FieldRef Name="ID"/>
                   <FieldRef Name="Pais"/>
                   <FieldRef Name="Direccion_x0020_Solicitud"/>
                   <FieldRef Name="Area_x0020_Solicitud"/>
                   <FieldRef Name="Tipomecanismo"/>
                   <FieldRef Name="Requiere_x0020_Auditoria"/>
                   <FieldRef Name="Seguridad"/>
                   <FieldRef Name="Subarea_x0020_Solicitud"/>
                   <FieldRef Name="Driver"/>
                   <FieldRef Name="Pilar"/>
                   <FieldRef Name="Tipo_x0020_de_x0020_Mecanismo"/>
                   <FieldRef Name="Nombre_x0020_del_x0020_mecanismo"/>
                   <FieldRef Name="Aplica_x0020_a_x0020_planta"/>
                   <FieldRef Name="Planta"/>
                   <FieldRef Name="Proceso"/>
                   <FieldRef Name="ID_x0020_Mecanismo_x0020_Local"/>
                   <FieldRef Name="Nombre_x0020_del_x0020_mecanismo"/>
                   <FieldRef Name="Nombre_x0020_actual_x0020_del_x0020_mecanismo"/>
                   <FieldRef Name="Nombre_x0020_Solicitante"/>
                   <FieldRef Name="Motivo_x0020_del_x0020_Cambio"/>
                   <FieldRef Name="Descripcion_x0020_del_x0020_cambio"/>
                   <FieldRef Name="Fecha_x0020_Inicio_x0020_Solicitud"/>
                   <FieldRef Name="Fecha_x0020_Finalizacion_x0020_Solicitud"/>`
    
    var FilterXml = `<Query>
                        <Where>
                          <Eq>
                              <FieldRef Name='ID'></FieldRef>
                              <Value Type="Number">`+ID+`</Value>
                          </Eq>
                        </Where>                       
                      </Query> `
                      
    this.pnp.getListItemsWithTaxo('',"Control Solicitudes",ViewXml,FilterXml,"").then((respuesta)=>{
      
      console.log(respuesta[0].Tipomecanismo.Label)

      this.setState({
        IdSolicitud: respuesta[0].ID,
        Pais: respuesta[0].Pais,
        direccion: respuesta[0].Direccion_x0020_Solicitud,
        area: respuesta[0].Area_x0020_Solicitud,
        tipoMecanismo: respuesta[0].Tipomecanismo.Label,
        Auditoria: respuesta[0].Requiere_x0020_Auditoria,
        seguridad: respuesta[0].Seguridad,
        SubArea: respuesta[0].Subarea_x0020_Solicitud,
        Driver: respuesta[0].Driver,
        Pilar: respuesta[0].Pilar,
        SeccionMecanismo: respuesta[0].Tipo_x0020_de_x0020_Mecanismo,
        NombreMecanismo: respuesta[0].Nombre_x0020_del_x0020_mecanismo,
        //PersonaSeguridad: respuesta[0].PersonaSeguridadId,
        AplicaPlanta: respuesta[0].Planta ? true : false,
        PlantasGuardadas: respuesta[0].Planta,
        IDMecanismo: respuesta[0].ID_x0020_Mecanismo_x0020_Local,
        pilarSelected: respuesta[0].Pilar,
        //TipoSolicitud: respuesta[0].TipoSolicitud,
        NombreMecanismoSelected: respuesta[0].Nombre_x0020_del_x0020_mecanismo,
        NombreMecanismoLocal: respuesta[0].Nombre_x0020_actual_x0020_del_x0,
        PersonaElabora: respuesta[0].NombreId,
        Motivo: respuesta[0].Motivo_x0020_del_x0020_Cambio,
        DescripcionMotivo: respuesta[0].Descripcion_x0020_del_x0020_camb,
        FechaInicioSolicitud: respuesta[0].Fecha_x0020_Inicio_x0020_Solicit,
        FechaFinSolicitud: respuesta[0].Fecha_x0020_Finalizacion_x0020_S,
      })
    })                  
   
  }

  // Funcion para consultar los modelos encontrados en la biblioteca modelos
  public ConsultarModelos(NombreCorrespondencia: any) {
    var filter = NombreCorrespondencia

    this.pnp
      .getListItems(
        'Modelos Local',
        ['*'],
        "Correspondencia eq '" + filter + "'",
        '',
      )
      .then((res) => {
        if (res.length > 0) {
          this.setState(
            {
              modelos: res,
              pilares: [],
            },
            () => {
              this.ConsultarPilares()
            },
          )
        }
      })
  }

  // Funcion para consultar los archivos del mecanismo
  public ObtenerArchivos(NombreMecanismo: any) {

    this.pnp.getFiles('Colabora/Revision' + '/' + NombreMecanismo)
      .then(
        (res) => (
          this.setState({
            documentosMecanismo: res,
          })
        ),
      )
  }

  //Funcion que consulta los driver de cada pilar recibe como parametro el id del pilar al que se le va consultar.
  private consultarDriver(IdPilar: any) {
    this.pnp
      .getListItems(
        'Drivers Local',
        ['*', 'ID_x0020_Pilar_x0020_Local/ID'],
        'No_x0020_Pilar/ID eq ' + IdPilar,
        ['No_x0020_Pilar','ID_x0020_Pilar_x0020_Local'],
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
                // this.consultarMecanismo(this.state.dataMecanismo.NombreDriverId)
              }
            }
          },
        ),
      )
  }

  //Funcion que consulta los tipos de mecanismos.
  public consultarTipoMecanismo() {
    this.pnp
      .getListItemsRoot(
        'Parametros Tecnicos',
        ['*'],
        "Llave eq 'tipoMecanismo'",
        '',
        '',
      )
      .then((res) => {
        if (res.length > 0) {
          this.setState({
            tiposMecanismos: res,
          })
        }
      })
  }

  //Funcion que realiza la carga inicial para consultas las solicitudes
  public CargaInicial() {
    var secciones: any = []

    if (!this.state.seccionesOk) {
      this.state.secciones.forEach((item: any, index: any) => {
        if (index == 1 && this.props.match.params.opcion == 2) {
          secciones.push({ Title: 'Documentos del Mecanismo' })
        } else if (index == 1 && this.props.match.params.opcion == 3) {
          secciones.push({ Title: 'Plan de accin de los contenidos' })
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

    this.pnp.getAllUserGroupName('Aprobadores').then((res) => {
      this.setState({
        Aprobadores: res,
      })
    })
  }

  // Funcion que permite consultar los datos de un mecanismo del mecanismo
  private contenidoForm() {

    this.pnp.getListItemsRoot(
      'Control Solicitudes',
      ["*"],
      "ID eq '" + this.state.idMecanismo + "'",
      '',
    )
      .then(respuesta => {
        console.log(respuesta);

        this.consulta(respuesta[0].ID)

        this.setState({
          IdSolicitud: respuesta[0].ID,
          Pais: respuesta[0].Pais,
          direccion: respuesta[0].Direccion_x0020_Solicitud,
          area: respuesta[0].Area_x0020_Solicitud,
          tipoMecanismo: respuesta[0].Tipomecanismo,
          Auditoria: respuesta[0].Requiere_x0020_Auditoria,
          seguridad: respuesta[0].Seguridad,
          SubArea: respuesta[0].Subarea_x0020_Solicitud,
          Driver: respuesta[0].Driver,
          Pilar: respuesta[0].Pilar,
          SeccionMecanismo: respuesta[0].Tipo_x0020_de_x0020_Mecanismo,
          NombreMecanismo: respuesta[0].Nombre_x0020_del_x0020_mecanismo,
          //PersonaSeguridad: respuesta[0].PersonaSeguridadId,
          AplicaPlanta: respuesta[0].Planta ? true : false,
          PlantasGuardadas: respuesta[0].Planta,
          IDMecanismo: respuesta[0].ID_x0020_Mecanismo_x0020_Local,
          pilarSelected: respuesta[0].Pilar,
          //TipoSolicitud: respuesta[0].TipoSolicitud,
          NombreMecanismoSelected: respuesta[0].Nombre_x0020_del_x0020_mecanismo,
          NombreMecanismoLocal: respuesta[0].Nombre_x0020_actual_x0020_del_x0,
          PersonaElabora: respuesta[0].NombreId,
          Motivo: respuesta[0].Motivo_x0020_del_x0020_Cambio,
          DescripcionMotivo: respuesta[0].Descripcion_x0020_del_x0020_camb,
          FechaInicioSolicitud: respuesta[0].Fecha_x0020_Inicio_x0020_Solicit,
          FechaFinSolicitud: respuesta[0].Fecha_x0020_Finalizacion_x0020_S,


        }, () => {
          this.pnp.getByIdUser(this.state.PersonaSeguridad).then((user) => {
            this.setState({
              PersonaSeguridad: user.Title,
            })
          })
          this.pnp.getByIdUser(this.state.PersonaElabora).then((user) => {
            this.setState({
              PersonaElaboraEmail: user.Email,
            })
          })
          this.consultarAreas();
          this.TraerPilaresPorModelos(respuesta[0].Direccion_x0020_Solicitud, respuesta[0].Area_x0020_Solicitud, respuesta[0].Subarea_x0020_Solicitud)
          this.consultarDriver(respuesta[0].IdPilar);
          if(this.state.boton == "asignarmetadata"){
            this.sendDataToControlList()
          }
          else{
            this.ConsultarMatriz(respuesta[0].Tipomecanismo);
          }
          this.consultarMecanismoFiltro(respuesta[0].Mecanismo_x0020_del_x0020_Driver, respuesta[0].Tipo_x0020_de_x0020_Mecanismo, true)
          this.plantas()
          this.ObtenerArchivos(respuesta[0].Nombre_x0020_del_x0020_mecanismo)
          if (this.state.PlantasGuardadas && this.state.PlantasGuardadas.length > 0) {
            this.setState({
              plantasAplica: this.state.PlantasGuardadas != "" ? this.state.PlantasGuardadas.split(';') : "",
              AplicaPlanta: true,
            })
          }
          else {
            this.setState({
              plantasAplica: [],
              AplicaPlanta: false,
            })
          }
          
          
        })

      })


  }

  // Consulta general a la lista del root de las solicitudes enviadas a ajustes
  public consulta(Id: any) {
    this.pnp.getListItemsRoot("Control Solicitudes",
      ["*"],
      "ID eq " + Id,

      "").then((res) => {
        this.setState({ item: { Description: res[0].Ajustes } })
      })

  }

  // funcion para la construccion de los mensajes modal 
  public mensajesModal(Estado: String) {
    this.pnp.getListItemsRoot(
      "MensajesModal",
      ["*"],
      "Estado eq '" + Estado + "'",
      ""
    ).then((items: any) => {
      var msjModal = items[0].Title.replace('#', this.state.IdSolicitud)

      var msjModalFinal = msjModal.replace("$", this.state.NombreMecanismo)


      this.setState({
        MensajeModal: msjModalFinal,
        PieModal: items[0].PieModal
      })



    })
  }

  //Mensaje modal Guardar ajustes
  public GuardarAjustes(estado: String) {

    this.pnp.getListItemsRoot(
      "MensajesModal",
      ["*"],
      "Estado eq '" + estado + "'",
      ""
    ).then((items: any) => {
      var msjModal = items[0].Title.replace('#', this.state.IdSolicitud)

      var msjModalFinal = msjModal.replace("$", this.state.NombreMecanismo)


      this.setState({
        MensajeModal: msjModalFinal,
        PieModal: items[0].PieModal
      })



    })
    let obj: {} = {
      EstadoSolicitud: estado,
      Ajustes: this.state.item.Description
    }


    let objG: {} = {
      Descripcion: this.state.item.Description,
      NombreMecanismo: this.state.NombreMecanismo,
      IDMecanismo: this.state.IdSolicitud,



    }
    this.pnp.updateByIdRoot(
      "Control Solicitudes",
      this.state.IdSolicitud,
      obj
    ).then((items: any) => {
      this.pnp.insertItemRoot(
        "ListaComentarios",
        objG
      ).then((items: any) => {
        alert("Resgitrado con exito en la ista ")
      })
    })
  }

  // Funcion para guardar los cambios del texto enriquecido
  public saveClick = () => {
    /*sp.web.lists.getByTitle('Custom RichText').items.add(this.state.item).then((val) => {

    }).catch((err) => {
      console.error(err);
    });*/
  }

  // Funcion para enviar texto enriquecido a la lista temporal  
  public EnvioTextoEnriquecido(){
   let obj:any={
      Descripcion:this.state.item.Description,
      IdMecanismo:String(this.props.Id)
    }

    this.pnp.insertItemRoot(
      "HistoricoTextoEnriquecido",
      obj

    ).then((items:any)=>{
      console.log("hecho")
      this.insertarTipo()
    })
  }

  //Funcion para consultar las direcciones de las solicitudes abiertas
  private consultarDirecciones() {
    
    var ViewXml = `<FieldRef Name="Direccion"/>`

    this.pnp.getListItemsWithTaxo('', 'EstructuraOrganizacional', ViewXml)

    
      .then((respuesta) => {
        var DireccionesFilial: any = []
        var Direccionesuniq = _.uniq(respuesta, e => e.Direccion.Label);

        Direccionesuniq.forEach((e) => {
          DireccionesFilial.push({
            ID: e.ID,
            Direcciones: e.Direccion.Label,
          })
        })
        this.setState({
          DireccionesFilial: DireccionesFilial,
        })
      })
    

    this.consultarTipoMecanismo();
    this.consultarMotivos()
  }

  //Funcion para consultar las areas de las solicitudes abiertas
  private consultarAreas() {
    /*
    const ViewXml = `
      <FieldRef Name="Area"/>
      <FieldRef Name="Direccion"/>
    `;
    const filterXml = `
      <Query>
        <Where>
          <Eq>
            <FieldRef Name="Direccion" />
            <Value Type="TaxonomyFieldType">${this.state.direccion}</Value>
          </Eq>
        </Where>
      </Query>
    `;
    
    this.pnp.getListItemsWithTaxo('', 'EstructuraOrganizacional', ViewXml, filterXml)
      .then((respuesta) => {
        const AreasFilial: any = [];
        const Areasuniq = _.uniq(respuesta, e => e.Area.Label);

        Areasuniq.forEach((e) => {
          if (e.Direccion && e.Area.Label) {
            AreasFilial.push({
              ID: e.ID,
              Areas: e.Area.Label,
              Direccion: e.Direccion.Label
            });
          }
        });

        this.setState({
          AreasFilial: AreasFilial,
        }); this.consultarSubarea()
      });*/
  }

  //Funcion para consultar los pilares por modelos de las solicitudes abiertas
  private TraerPilaresPorModelos(direccion: string, area: string, subArea: string) {

    if (subArea && subArea.length > 0) {

      this.pnp.getListItems('Modelos Local',
        ['*'],
        "Correspondencia eq '" + subArea + "'",
        '')
        .then(informacion => {
          if (informacion && informacion.length > 0) {
            informacion.forEach((element: any) => {
              this.pnp.getListItems(
                'Pilares Local',
                ['*', 'Nombre Modelo/Nombre Modelo'],
                "Nombre Modelo/Nombre Modelo eq '" + element.Title + "'",
                'Nombre Modelo',
              )
                .then(Arraypilares => {
                  if (Arraypilares && Arraypilares.length > 0) {
                    this.setState({
                      pilares: [],
                    }, () => {
                      this.setState({
                        pilares: Arraypilares,
                      })
                    })
                  }
                })
            });
          }
        })
    }

    else if (area && area.length > 0) {
      this.pnp.getListItems('Modelos Local',
        ['*'],
        "Correspondencia eq '" + area + "'",
        '')
        .then(informacion => {
          if (informacion && informacion.length > 0) {
            informacion.forEach((element: any) => {
              this.pnp.getListItems(
                'Pilares Local',
                ['*', 'Nombre Modelo/Nombre Modelo'],
                "Nombre Modelo/Nombre Modelo eq '" + element.Title + "'",
                'Nombre Modelo',
              )
                .then(Arraypilares => {
                  if (Arraypilares && Arraypilares.length > 0) {
                    this.setState({
                      pilares: [],
                    }, () => {
                      this.setState({
                        pilares: Arraypilares,
                      })
                    })
                  }
                })

            });
          }

        })

    }
    else if (direccion && direccion.length > 0) {
      this.pnp.getListItems('Modelos Local',
        ['*'],
        "Correspondencia eq '" + direccion + "'",
        '')
        .then(informacion => {
          if (informacion && informacion.length > 0) {
            informacion.forEach((element: any) => {
              this.pnp.getListItems(
                'Pilares Local',
                ['*', 'Nombre Modelo/Nombre Modelo'],
                "Nombre Modelo/Nombre Modelo eq '" + element.Title + "'",
                'Nombre Modelo',
              )
                .then(Arraypilares => {
                  if (Arraypilares && Arraypilares.length > 0) {
                    this.setState({
                      pilares: [],
                    }, () => {
                      this.setState({
                        pilares: Arraypilares,
                      })
                    })
                  }
                })

            });
          }
        })

    }
    else {
      this.setState({
        pilares: [],
      })
    }

  }

  //Funcion que consulta los pilares filtrando por el nombre del modelo recibe como parametro el nombre del modelo.
  public ConsultarPilares() {
    this.pnp
      .getListItems(
        'Pilares Local',
        ['*', 'Nombre Modelo/Nombre Modelo'],
        "",
        'Nombre Modelo',
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
                  (x: any) => x.Pilar == this.state.dataMecanismo.Pilar,
                )

                if (pilar.length > 0) {
                  this.setState({
                    pilar: pilar[0].ID,
                    IdPilar: pilar[0].ID,
                  })
                  this.consultarDriver(this.state.pilarSelected)
                }
              }
            },
          )
        }
      })
  }

  //Funcion que guarda los documentos de en la biblioteca segun el modelo.
  private GuardarDocumentos() {
    if (
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
          //var url = 'https://qualasa.sharepoint.com' + res.data.ServerRelativeUrl

          this.state.Archivos.forEach((items: any) => {
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

        })
      },
    )
  }

  // funcion para eliminar aprobadores del formulario
  private elimindarAprobadores(index: any, NombreArray: any) {
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
    )
  }

  //Funcion que permite aadir a un array los demas aprobadores del area
  private getPeoplePickerDemasAprobadores(items: any[], index: any) {
    const cDemasAprobadores = [...this.state.cDemasAprobadores]

    cDemasAprobadores[index]['DemasAprobadores'] = items[0].id
    cDemasAprobadores[index]['DemasAprobadoresEmail'] = items[0].secondaryText

    this.setState({
      cDemasAprobadores,
    })
  }

  // funcion para agregar aprobadores
  private addDemasAprobadores(arg0: string): void {
    var c = []
    const cDemasAprobadores = [...this.state.cDemasAprobadores]

    c = cDemasAprobadores

    var pos = {
      p: 0,
    }

    c.push(pos)
    this.setState({ cDemasAprobadores: c })
  }

  //Funcion que asigna datos desde el directorio activo usando el elemento people picker.
  private getPeoplePickerOtrosAprobadores(items: any[], index: any, rol: any) {
    const cAprobadores = [...this.state.cAprobadores]

    cAprobadores[index]['AprobadoresConRol'] = items[0].id
    cAprobadores[index]['Cargo'] = rol

    this.setState({
      cAprobadores,
    })
  }

  //Funcion que permite aadir a un array los aprobadores del area
  private _getPeoplePickerG(items: any[], index: any) {
    const cAprobadoresArea = [...this.state.cAprobadoresArea]
    cAprobadoresArea[index]['AprobadoresArea'] = items[0].id
    cAprobadoresArea[index]['AprobadoresAreaEmail'] = items[0].secondaryText

    this.setState({
      cAprobadoresArea,
    })
  }

  //Funcion para obtener los aprobadores relacionados a la solicitud
  private getAprobadoresArea(id: any, index: any) {
    const cAprobadoresArea = [...this.state.cAprobadoresArea]

    var items = this.state.AprobadoresArea.filter((x: any) => x.ID == id)

    cAprobadoresArea[index]['AprobadoresArea'] = items[0].AprobadorId
    cAprobadoresArea[index]['AprobadoresAreaEmail'] = items[0].AprobadorEmail
    cAprobadoresArea[index]['AprobadoresNombreArea'] = items[0].NombreArea
    cAprobadoresArea[index]['AprobadoresNombreAreaId'] = items[0].ID

    this.setState({
      cAprobadoresArea,
    })
  }

  //Funcion que permite aadir a un array los aprobadores 
  private _getPeoplePicker(items: any[], objeto: any) {
    this.setState({
      [objeto]: items[0].id,
      [objeto + 'EMail']: items[0].secondaryText,
    })
  }

  //Funcion para consultar texto enriquecido
  public consultaRichtext() {
    this.pnp.getListItems("Custom RichText", ["*"], "ID eq 8", "").then((res) => {
      this.setState({ item: { Description: res[0].Description } })
    })

  }

  //Funcion para obtener los aprobadores por Area
  private getAprobadoresPorArea(Direccion: any, Index: any) {
    var Areas = this.state.AprobadoresArea.filter(
      (x: any) => x.NombreDireccion == Direccion,
    )

    const cAprobadoresArea = [...this.state.cAprobadoresArea]

    cAprobadoresArea[Index]['AprobadoresNombreDireccion'] = Direccion

    this.setState({
      ['AreasDireccion' + Index]: Areas,
      cAprobadoresArea,
    })
  }

  //Funcion para agregar aprobadores por area
  private addAprobadoresArea(arg0: string): void {
    var c = []
    const cAprobadoresArea = [...this.state.cAprobadoresArea]
    c = cAprobadoresArea
    var pos = {
      p: 0,
    }
    c.push(pos)
    this.setState({ cAprobadoresArea: c })
  }

//Funcion que identifica cuantos caracteres tiene las cadenas de texto para el contador del mismo
  private longitudcadena(cantidad: any) {

    const result = cantidad.length
    this.setState({

      CantidadCaracteres: result

    })

    console.log(result)

  }

  //Funcion para obtener los drivers de los pilares 
  protected getDriversByPilar(pilarSelected: string) {

    // this.setState({
    //   Pilar:""
    // },()=> {Pilar:pilarSelected.split("`")[1]})
    this.pnp.getListItems("Driver Local",
      ["*"], `PilarId eq ${pilarSelected.split("`")[0]}`, ""
    )
      .then(respuesta => {
        console.log(respuesta)
      })
      .catch(error => {
        console.error(error)
      })
  }

  componentWillMount(): void {
    this.siteName

    this.openModal();
    this.contenidoForm();
    this.consultarDirecciones();
    this.plantas();
    this.consultarAreas();
    this.consultarTipoMecanismo();
    this.consultarMatrizAprobacion();
    this.ConsultarTituloResponderAjustes();
    this.ConsultarTextoResponderAjustes();
    this.ConsultarTextoComentariosRevisor();
    this.ConsultarTituloEnviarAjustes();
    this.ConsultarTextoEnviarAjustes();
    this.ConsultarTextoObservaciones();
    this.ConsultarTituloEnviarAPublicacion();
    this.ConsultarTextoEnviarAPublicacionCreacion1();
    this.ConsultarTextoEnviarAPublicacionCreacion2();
    this.ConsultarTituloCancelarsolicitud();
    this.ConsultarTextoCancelarsolicitud();
    this.ConsultarTextoComentarios();
    this.ConsultarTituloActivarAprobacin();
    this.ConsultarTextoActivarAprobacin();
    

    switch(this.props.accion){
      case 'vermas':this.ConsultarTipoMecanismo(this.props.Id)
    }

  }

  //Funcion que permite actualizar los datos en la lista de control
  private sendDataToControlList() {
    let pilar

     if (
      this.state.boton == "asignarmetadata") {
      
      let obj = {
        Metadata: true
      }

      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.props.closeModal()
        })

    }

    if (
      this.state.boton == "flujoaprobacion") {
      
      let obj = {
        EstadoSolicitud: 'En aprobacion',
      }

      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.props.closeModal()
        })

    }

    if (this.state.pilarSelected !== 'No aplica' && this.state.boton !== "asignarmetadata" ) {
      pilar = this.state.pilares.filter((x: { ID: any; }) => x.ID == this.state.pilarSelected)[0].Pilar

    } else {
      pilar = 'No aplica'
      this.setState({ driver: 'No aplica' })
    }


    if (this.state.plantasAplica == '' && this.state.PersonaSeguridad == '') {
      let obj = {
        Title: this.state.NombreMecanismo,
        NombreMecanismo: this.state.NombreMecanismo,
        NombreMecanismoLocal: this.state.NombreMecanismoLocal,
        RequiereAuditoria: this.state.Auditoria,
        Seguridad: this.state.seguridad,
        NombreDriver: this.state.Driver,
        NombreDocumentSet: this.state.NombreMecanismo,
        //UrlDocumentSet: urlDocumento,
        Motivo: this.state.Motivo,
        DescripcionMotivo: this.state.DescripcionMotivo,
        ElaboraId: this.state.PersonaElabora,
        RevisaId: this.state.PersonaRevisa,
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En revision',
        DIreccion: this.state.direccion,
        Area: this.state.area,
        Pilar: pilar,
        IdPilar: this.state.pilarSelected,
        TipoMecanismo: this.state.tipoMecanismo,
        SeccionMecanismo: this.state.descripcionMecanismo,
        SubArea: this.state.subArea,
        Ajustes:this.state.item.Description


      }
      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          console.log(items)
          this.EnvioTextoEnriquecido()
        })
    } else if (
      this.state.plantasAplica == '' && this.state.boton === ""
    ) {
      let obj = {
        Title: this.state.NombreMecanismoSelected,
        NombreMecanismo: this.state.NombreMecanismoSelected,
        NombreMecanismoLocal: this.state.NombreMecanismoLocal,
        RequiereAuditoria: this.state.Auditoria,
        Seguridad: this.state.seguridad,
        NombreDriver: this.state.Driver,
        NombreDocumentSet: this.state.NombreMecanismoSelected,
        //UrlDocumentSet: urlDocumento,
        Motivo: this.state.Motivo,
        DescripcionMotivo: this.state.DescripcionMotivo,
        ElaboraId: this.state.PersonaElabora,
        RevisaId: this.state.PersonaRevisa,
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En revision',
        DIreccion: this.state.direccion,
        Area: this.state.area,
        Pilar: pilar,
        IdPilar: this.state.pilarSelected,
        TipoMecanismo: this.state.tipoMecanismo,
        SeccionMecanismo: this.state.descripcionMecanismo,
        SubArea: this.state.subArea,
        Ajustes:this.state.item.Description
      }
      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.EnvioTextoEnriquecido()
        })
    } else if (
      this.state.plantasAplica != '' && this.state.boton === ""
    ) {
      let obj = {
        Title: this.state.NombreMecanismoSelected,
        NombreMecanismo: this.state.NombreMecanismoSelected,
        NombreMecanismoLocal: this.state.NombreMecanismoLocal,
        RequiereAuditoria: this.state.Auditoria,
        Seguridad: this.state.seguridad,
        NombreDriver: this.state.Driver,
        Planta: this.state.plantasAplica.join(';'),
        NombreDocumentSet: this.state.NombreMecanismoSelected,
        //UrlDocumentSet: urlDocumento,
        Motivo: this.state.Motivo,
        DescripcionMotivo: this.state.DescripcionMotivo,
        ElaboraId: this.state.PersonaElabora,
        RevisaId: this.state.PersonaRevisa,
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En revision',
        DIreccion: this.state.direccion,
        Area: this.state.area,
        Pilar: pilar,
        IdPilar: this.state.pilarSelected,
        TipoMecanismo: this.state.tipoMecanismo,
        SeccionMecanismo: this.state.descripcionMecanismo,
        SubArea: this.state.subArea,
        Ajustes:this.state.item.Description
      }
      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.EnvioTextoEnriquecido()
        })
    }
    
    else if (
      this.state.boton === "cancelar"
    ) {
      let object = {
        Title: this.state.NombreMecanismoSelected,
        IDMecanismo: this.state.IDMecanismo,
        IDSolicitud: this.state.IdSolicitud,
        Pais: this.state.Pais,
        Direccion: this.state.direccion,
        Area: this.state.area,
        //SubArea: this.state.subArea,
        Pilar: pilar,
        Driver: this.state.Driver,
        Seguridad: this.state.seguridad,
        Mecanismodeldriver: this.state.SeccionMecanismo,
        Plandeaccion: this.state.TipoSolicitud,
        Tipodemecanismo: this.state.tipoMecanismo,
        Nombreactualdelmecanismo: this.state.NombreMecanismoSelected,
        AsignadoAId: this.state.PersonaElabora,
        RequiereAuditoria: this.state.Auditoria,
        Nombredelmecanismo: this.state.NombreMecanismo,
        AplicaPlanta: this.state.AplicaPlanta,
        Planta: this.state.PlantasGuardadas,
        NombreSolicitanteId: this.state.PersonaElabora,
        DescripciondelCambio: this.state.DescripcionMotivo,
        EstadodelaSolicitud: 'Cancelada',
        MotivodelCambio: this.state.Motivo,
        FechaInicioSolicitud: this.state.FechaInicioSolicitud,
        FechaFinalizacionSolicitud: this.state.FechaFinSolicitud,
        Ajustes:this.state.item.Description
                }
      this.pnp.insertItemRoot('RolesPorEtapas', object,)
        .then((items) => {

          this.props.closeModal()

        })
      // .catch((error)=> {
      //   this.setState({ mostrarModal: true, mostrarModalExitoso: false })
      // } ) 

      let obj = {
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'Cancelada',
        DescripcionMotivo: this.state.DescripcionMotivo,
        Ajustes:this.state.item.Description
      }

      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.EnvioTextoEnriquecido()

          this.props.closeModal()


        })

    }
    else if (
      this.state.boton === "resajustes"
    ) {
      let object = {
        Title: this.state.NombreMecanismoSelected,
        IDMecanismo: this.state.IDMecanismo,
        IDSolicitud: this.state.IdSolicitud,
        Pais: this.state.Pais,
        Direccion: this.state.direccion,
        Area: this.state.area,
        //SubArea: this.state.subArea,
        Pilar: pilar,
        Driver: this.state.Driver,
        Seguridad: this.state.seguridad,
        Mecanismodeldriver: this.state.SeccionMecanismo,
        Plandeaccion: this.state.TipoSolicitud,
        Tipodemecanismo: this.state.tipoMecanismo,
        Nombreactualdelmecanismo: this.state.NombreMecanismoSelected,
        AsignadoAId: this.state.PersonaRevisa,
        RequiereAuditoria: this.state.Auditoria,
        Nombredelmecanismo: this.state.NombreMecanismo,
        AplicaPlanta: this.state.AplicaPlanta,
        Planta: this.state.PlantasGuardadas,
        NombreSolicitanteId: this.state.PersonaElabora,
        DescripciondelCambio: this.state.DescripcionMotivo,
        EstadodelaSolicitud: 'En revision',
        MotivodelCambio: this.state.Motivo,
        FechaInicioSolicitud: this.state.FechaInicioSolicitud,
        FechaFinalizacionSolicitud: this.state.FechaFinSolicitud,       
        Ajustes:this.state.item.Description 


      }
      this.pnp.insertItemRoot('RolesPorEtapas', object,)
        .then((items) => {
          this.EnvioTextoEnriquecido()

          this.props.closeModal()


        })

      let obj = {
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En revision',
        DescripcionMotivo: this.state.DescripcionMotivo,
        Ajustes:this.state.item.Description
      }

      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.EnvioTextoEnriquecido()

          this.props.closeModal()


        })

    }
    else if (
      this.state.boton === "publicacion"
    ) {
      let object = {
        Title: this.state.NombreMecanismoSelected,
        IDMecanismo: this.state.IDMecanismo,
        IDSolicitud: this.state.IdSolicitud,
        Pais: this.state.Pais,
        Direccion: this.state.direccion,
        Area: this.state.area,
        //SubArea: this.state.subArea,
        Pilar: pilar,
        Driver: this.state.Driver,
        Seguridad: this.state.seguridad,
        Mecanismodeldriver: this.state.SeccionMecanismo,
        Plandeaccion: this.state.TipoSolicitud,
        Tipodemecanismo: this.state.tipoMecanismo,
        Nombreactualdelmecanismo: this.state.NombreMecanismoSelected,
        AsignadoAId: this.state.Personarevisa,
        RequiereAuditoria: this.state.Auditoria,
        Nombredelmecanismo: this.state.NombreMecanismo,
        AplicaPlanta: this.state.AplicaPlanta,
        Planta: this.state.PlantasGuardadas,
        NombreSolicitanteId: this.state.PersonaElabora,
        DescripciondelCambio: this.state.DescripcionMotivo,
        EstadodelaSolicitud: 'En publicacion',
        MotivodelCambio: this.state.Motivo,
        FechaInicioSolicitud: this.state.FechaInicioSolicitud,
        FechaFinalizacionSolicitud: this.state.FechaFinSolicitud,

        Ajustes:this.state.item.Description
        
      }
      this.pnp.insertItemRoot('RolesPorEtapas', object,)
        .then((items) => {
          this.EnvioTextoEnriquecido()

          this.props.closeModal()


        })

      let obj = {
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En publicacion',
        DescripcionMotivo: this.state.DescripcionMotivo,
        Ajustes:this.state.item.Description
      }

      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.EnvioTextoEnriquecido()

          this.props.closeModal()


        })

    }
    else if (
      this.state.boton === "enviarajustes"
    ) {
      let object = {
        Title: this.state.NombreMecanismoSelected,
        IDMecanismo: this.state.IDMecanismo,
        IDSolicitud: this.state.IdSolicitud,
        Pais: this.state.Pais,
        Direccion: this.state.direccion,
        Area: this.state.area,
        //SubArea: this.state.subArea,
        Pilar: pilar,
        Driver: this.state.Driver,
        Seguridad: this.state.seguridad,
        Mecanismodeldriver: this.state.SeccionMecanismo,
        Plandeaccion: this.state.TipoSolicitud,
        Tipodemecanismo: this.state.tipoMecanismo,
        Nombreactualdelmecanismo: this.state.NombreMecanismoSelected,
        AsignadoAId: this.state.PersonaElabora,
        RequiereAuditoria: this.state.Auditoria,
        Nombredelmecanismo: this.state.NombreMecanismo,
        AplicaPlanta: this.state.AplicaPlanta,
        Planta: this.state.PlantasGuardadas,
        NombreSolicitanteId: this.state.PersonaElabora,
        DescripciondelCambio: this.state.DescripcionMotivo,
        EstadodelaSolicitud: 'En ajustes',
        MotivodelCambio: this.state.Motivo,
        FechaInicioSolicitud: this.state.FechaInicioSolicitud,
        FechaFinalizacionSolicitud: this.state.FechaFinSolicitud,
      }
      this.pnp.insertItemRoot('RolesPorEtapas', object,)
        .then((items) => {
          this.EnvioTextoEnriquecido()

          this.props.closeModal()

        })

      let obj = {
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En ajustes',
        DescripcionMotivo: this.state.DescripcionMotivo,
        Ajustes:this.state.item.Description
      }

      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.EnvioTextoEnriquecido()

          this.props.closeModal()

        })

    }
    else {
      let obj = {
        Title: this.state.NombreMecanismoSelected,
        NombreMecanismo: this.state.NombreMecanismoSelected,
        NombreMecanismoLocal: this.state.NombreMecanismoLocal,
        RequiereAuditoria: this.state.Auditoria,
        Seguridad: this.state.seguridad,
        NombreDriver: this.state.Driver,
        NombreDocumentSet: this.state.NombreMecanismoSelected,
        //UrlDocumentSet: urlDocumento,
        Motivo: this.state.Motivo,
        DescripcionMotivo: this.state.DescripcionMotivo,
        ElaboraId: this.state.PersonaElabora,
        RevisaId: this.state.PersonaRevisa,
        ApruebaId: this.state.PersonaAprueba,
        EstadoSolicitud: 'En revision',
        Dreccion: this.state.direccion,
        Area: this.state.area,
        Pilar: pilar,
        IdPilar: this.state.pilarSelected,
        TipoMecanismo: this.state.tipoMecanismo,
        SeccionMecanismo: this.state.descripcionMecanismo,
        SubArea: this.state.subArea,
        Ajustes:this.state.item.Description
      }

      this.pnp.updateByIdRoot('Control Solicitudes', this.state.idMecanismo, obj,)
        .then((items) => {
          this.EnvioTextoEnriquecido()

          console.log(items)
        })
    }

  }

  // Funcion para consultar el titulo "Titulo responder ajustes" en parametros tecnicos
  private ConsultarTituloResponderAjustes(){

  this.pnp.getListItemsRoot(
      "Parametros Tecnicos",
      ["*"],
      "Llave eq 'TituloResponderAjustes'",
      ""
    ).then((items) => {
      console.log(items);
      
      
      if (items.length > 0) {
        // Actualiza el estado con el valor obtenido
        this.setState({ TituloResponderAjustes: items[0].Valor });
      } else {
        console.log("No se encontr la llave buscada.");
        this.setState({ TituloResponderAjustes: '' }); // O puedes establecer un valor por defecto
      }
    }).catch((error) => {
      console.error("Error al consultar la lista:", error);
      this.setState({ TituloResponderAjustes: '' }); // Manejo del estado en caso de error
    });      
  
} 

  // Funcion para consultar el titulo "Texto responder ajustes" en parametros tecnicos
  private ConsultarTextoResponderAjustes(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TextoResponderAjustes'",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TextoResponderAjustes: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TextoResponderAjustes: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TextoResponderAjustes: '' }); // Manejo del estado en caso de error
      });      
    
  } 

  // Funcion para consultar el titulo "Texto Comentarios revisor" en parametros tecnicos
  private ConsultarTextoComentariosRevisor(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TextoComentariosRevisor'",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TextoComentariosRevisor: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TextoComentariosRevisor: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TextoComentariosRevisor: '' }); // Manejo del estado en caso de error
      });      
    
  } 
  
  // Funcion para consultar el titulo "Titulo Enviar Ajustes" en parametros tecnicos
  private ConsultarTituloEnviarAjustes(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TituloEnviarAjustes'",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TituloEnviarAjustes: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TituloEnviarAjustes: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TituloEnviarAjustes: '' }); // Manejo del estado en caso de error
      });      
    
  }
  
  // Funcion para consultar el titulo "Texto Enviar Ajustes" en parametros tecnicos
  private ConsultarTextoEnviarAjustes(){

  this.pnp.getListItemsRoot(
      "Parametros Tecnicos",
      ["*"],
      "Llave eq 'TextoEnviarAjustes'",
      ""
    ).then((items) => {
      console.log(items);
      
      
      if (items.length > 0) {
        // Actualiza el estado con el valor obtenido
        this.setState({ TextoEnviarAjustes: items[0].Valor });
      } else {
        console.log("No se encontr la llave buscada.");
        this.setState({ TextoEnviarAjustes: '' }); // O puedes establecer un valor por defecto
      }
    }).catch((error) => {
      console.error("Error al consultar la lista:", error);
      this.setState({ TextoEnviarAjustes: '' }); // Manejo del estado en caso de error
    });      
  
  } 

  // Funcion para consultar el titulo "Texto Enviar Ajustes" en parametros tecnicos
  private ConsultarTextoObservaciones(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TextoObservaciones'",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TextoObservaciones: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TextoObservaciones: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TextoObservaciones: '' }); // Manejo del estado en caso de error
      });      
    
  } 
  
  // Funcion para consultar el titulo "Titulo Enviar a publiacion" en parametros tecnicos
  private ConsultarTituloEnviarAPublicacion(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TituloEnviarAPublicacion'",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TituloEnviarAPublicacion: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TituloEnviarAPublicacion: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TituloEnviarAPublicacion: '' }); // Manejo del estado en caso de error
      });      
    
  } 
  
  // Funcion para consultar el titulo "Texto Enviar a publicacion creacion 1" en parametros tecnicos
  private ConsultarTextoEnviarAPublicacionCreacion1(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TextoEnviarAPublicacionCreacion1'",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TextoEnviarAPublicacionCreacion1: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TextoEnviarAPublicacionCreacion1: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TextoEnviarAPublicacionCreacion1: '' }); // Manejo del estado en caso de error
      });      
    
  }
  
  // Funcion para consultar el titulo "Texto Enviar a publicacion creacion 2" en parametros tecnicos
  private ConsultarTextoEnviarAPublicacionCreacion2(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TextoEnviarAPublicacionCreacion2'",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TextoEnviarAPublicacionCreacion2: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TextoEnviarAPublicacionCreacion2: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TextoEnviarAPublicacionCreacion2: '' }); // Manejo del estado en caso de error
      });      
    
  }

  // Funcion para consultar el titulo "Titulo Cancelar Solicitud" en parametros tecnicos
  private ConsultarTituloCancelarsolicitud(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TituloCancelarsolicitud'",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TituloCancelarsolicitud: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TituloCancelarsolicitud: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TituloCancelarsolicitud: '' }); // Manejo del estado en caso de error
      });      
    
  }
       
  // Funcion para consultar el titulo "Texto Cancelar Solicitud" en parametros tecnicos
  private ConsultarTextoCancelarsolicitud(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TextoCancelarsolicitud '",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TextoCancelarsolicitud: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TextoCancelarsolicitud: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TextoCancelarsolicitud: '' }); // Manejo del estado en caso de error
      });      
    
  }
  
  // Funcion para consultar el titulo "Texto comentarios" en parametros tecnicos
  private ConsultarTextoComentarios(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TextoComentarios '",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TextoComentarios: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TextoComentarios: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TextoComentarios: '' }); // Manejo del estado en caso de error
      });      
    
  }  
  
  // Funcion para consultar el titulo "Titulo Activar aprobacion" en parametros tecnicos
  private ConsultarTituloActivarAprobacin(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TituloActivarAprobacin '",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TituloActivarAprobacin: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TituloActivarAprobacin: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TituloActivarAprobacin: '' }); // Manejo del estado en caso de error
      });      
    
  }
  
  // Funcion para consultar el titulo "Texto Activar aprobacion" en parametros tecnicos
  private ConsultarTextoActivarAprobacin(){

    this.pnp.getListItemsRoot(
        "Parametros Tecnicos",
        ["*"],
        "Llave eq 'TextoActivarAprobacin '",
        ""
      ).then((items) => {
        console.log(items);
        
        
        if (items.length > 0) {
          // Actualiza el estado con el valor obtenido
          this.setState({ TextoActivarAprobacin: items[0].Valor });
        } else {
          console.log("No se encontr la llave buscada.");
          this.setState({ TextoActivarAprobacin: '' }); // O puedes establecer un valor por defecto
        }
      }).catch((error) => {
        console.error("Error al consultar la lista:", error);
        this.setState({ TextoActivarAprobacin: '' }); // Manejo del estado en caso de error
      });      
    
  }


  public render(): React.ReactElement<IComponentesProps> {

    return (
      <>


        {this.state.boton == "vermas" ?
          <div>
            <div
              className="stepper stepper-pills first"
              id="kt_stepper_example_clickable"
              data-kt-stepper="true"
            >
              <div className="separator mt-4 mb-4"></div>
              {!this.state.enviado ? (
                <div className="stepper-nav flex-center flex-wrap mb-10">
                  {this.state.secciones.map((s: any, index: any) => (
                    <div
                      className={
                        this.state.Pasos == s.Title
                          ? 'stepper-item mx-2 my-4 current'
                          : 'stepper-item mx-2 my-4 pending'
                      }
                    >
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
            <div>
              <h2 id='positiontitle'>Creacion de contenido</h2>

            </div>
            <form className="form mx-auto" id="kt_stepper_example_basic_form">
              <div className="mb-5">
                <div className='bordernone'>
                  {/* Pantalla 1 del formulario */}

                  {this.state.Pasos == 'Datos del Mecanismo' ? (
                    <div className="flex-column current bordernone">
                      <div className="row mb-5 ">
                        <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                          <h3 className="text-primary">
                            Datos del Mecanismo
                          </h3>
                        </div>
                      </div>
                      <div className="row mb-5 contenform">

                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                          <label className="form-label required">
                            Pas
                          </label>
                          <input  
                            style={{ height: '56%' }}
                            type="text"
                            className="form-control"
                            name="input2"
                            placeholder="."
                            value={this.state.Pais}
                            disabled={this.props.Desabilitado}
                          />
                        </div>


                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                          <label className="form-label required">
                            Direccin
                          </label>
                                            
                          <select
                            disabled={this.props.Desabilitado}
                            name="direccion"
                            value={this.state.direccion}
                            className="form-select select2-hidden-accessible"
                            onChange={(e) => {
                              this.TraerPilaresPorModelos(e.target.value, "", "")
                              this.inputChange(e.target)
                            }}
                            data-control="select2"
                            data-placeholder="Select an option"
                            data-select2-id="select2-data-1-k7cj"
                            
                            aria-hidden="true">

                            <option hidden selected>{this.state.direccion}</option>
                            <option data-select2-id="select2-data-3-efwm"></option>
                            {this.state.DireccionesFilial.map((e: any, i: any) => (
                              <option key={i} value={e.Direcciones}>
                                {e.Direcciones}
                              </option>
                            ))}
                          </select>

                        </div>

                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                          <label className="form-label required">
                            Area
                          </label>

                          <select
                            disabled={this.props.Desabilitado}
                            name="area"
                            value={this.state.area}
                            className="form-select select2-hidden-accessible"
                            onChange={(e) => {
                              this.TraerPilaresPorModelos("", this.state.area, "")
                              this.inputChange(e.target)
                            }}
                            data-control="select2"
                            data-placeholder="Select an option"
                            data-select2-id="select2-data-7-njhs"

                            aria-hidden="true"
                          >
                            <option hidden selected>{this.state.area}</option>
                            <option data-select2-id="select2-data-3-efwm"></option>
                            {this.state.AreasFilial.map((e: any, i: any) => (
                              <option key={i} value={e.Areas}>
                                {e.Areas}
                              </option>
                            ))}

                          </select>
                        </div>


                        
                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                            <label className="form-label">
                              Sub Area (opcional)
                            </label>
                            
                        {this.state.SubArea &&
                          this.state.SubArea.length > 0 ? (

                            <select
                              disabled={this.props.Desabilitado}
                              name="SubArea"
                              value={this.state.SubArea}
                              className="form-select select2-hidden-accessible"
                              onChange={(e) => {
                                this.TraerPilaresPorModelos("", this.state.SubArea, "")
                                this.inputChange(e.target)
                              }}                              
                              data-control="select2"
                              data-placeholder="Select an option"
                              data-select2-id="select2-data-7-njhs"

                              aria-hidden="true"
                            >
                              <option hidden selected>{this.state.SubArea}</option>
                              <option data-select2-id="select2-data-9-da1c">
                                Seleccionar
                              </option>
               
                            </select>
                          
                        ) : null}
                        </div>

                        
                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                            <label className="form-label required">
                              Pilar
                            </label>

                            <select
                              disabled={this.props.Desabilitado}
                              name="Pilar"
                              value={this.state.Pilar}
                              className="form-select select2-hidden-accessible"
                              onChange={(e) => {
                                this.TraerPilaresPorModelos("", this.state.Pilar, "")
                                this.inputChange(e.target)
                              }}
                              data-control="select2"
                              data-placeholder="Select an option"
                              data-select2-id="select2-data-7-njhs"

                              aria-hidden="true"
                            >
                              <option hidden selected>{this.state.Pilar}</option>
                              <option data-select2-id="select2-data-3-efwm"></option>
                              {/* {this.state.pilares.map((e: any, i: any) => (
                                <option key={i} value={e.Pilar}>
                                  {e.Pilar}
                                </option>

                              ))} */}
                            </select>
                          </div>
                      

                        
                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                            <label className="form-label required">
                              Driver
                            </label>
                            
                                <select
                                  disabled={this.props.Desabilitado}
                                  name="driver"
                                  value={this.state.Driver}
                                  className="form-select select2-hidden-accessible"
                                  onChange={(e) => {
                                    this.TraerPilaresPorModelos("", this.state.Driver, "")
                                    this.inputChange(e.target)
                                    // this.consultarDriver(e.target.value)
                                  }}
                                  data-control="select2"
                                  data-placeholder="Select an option"
                                  data-select2-id="select2-data-1-k7cj"

                                  aria-hidden="true">

                                  <option hidden selected>{this.state.Driver}</option>
                                  <option data-select2-id="select2-data-3-efwm"></option>
                                  {this.state.drivers.map((e: any, i: any) => (
                                    <option key={i} value={e.Driver}>
                                      {e.Driver}
                                    </option>
                                  ))}
                                  {/* {this.state.pilar == "No Aplica" ?
                                    <option
                                      data-select2-id="select2-data-9-da1c"
                                      value="10"
                                    >
                                      No aplica
                                    </option> : null}

                                  {this.state.drivers.map((e: any, i: any) => (
                                    <option key={i} value={e.Driver}>
                                      {e.Driver}
                                      </option>
                                  ))} */}
                                </select>
                                
                          </div>
                       

                        {this.state.pilar == 'No aplica' ? (
                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                            <label className="form-label required">
                              Driver
                            </label>

                            <select 
                              name="driver" 
                              value={this.state.Driver}
                              onChange={(e) => {
                                this.inputChange(e.target)
                              }}
                              className="form-select select2-hidden-accessible"
                              data-control="select2"
                              data-placeholder="Select an option"
                              data-select2-id="select2-data-7-njhs"
                              disabled={this.props.Desabilitado}

                              aria-hidden="true"
                            >
                              <option
                                data-select2-id="select2-data-9-da1c" value="0">
                                seleccionar...
                              </option>
                              <option selected>{this.state.Driver}</option>
                              <option
                                data-select2-id="select2-data-9-da1c"
                                value="No aplica"
                              >
                                No aplica
                              </option>
                            </select>
                          </div>
                        ) : null}

                        {/* <div className="row mb-5 contenform" id="btnMecanismos" > */}
                          {/* <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom"> */}
                            <br />
                            <br />
                            <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                              <span className="form-check">

                                <input placeholder='.'
                                  disabled={this.props.Desabilitado}
                                  className="form-check-input"
                                  type="radio"
                                  name="MecanismoDriver"
                                  value={this.state.SeccionMecanismo}
                                  checked={this.state.SeccionMecanismo === 'Mecanismo del Driver'}
                                  onChange={(e) => {

                                    this.inputChange(e.target)
                                  }}
                                />

                                <label className="form-check-label pe-10 fs-5" htmlFor="flexRadioDefault">
                                  Mecanismo del driver
                                </label>
                              </span>
                              <br />
                              <span className="form-check">

                                <input placeholder='.'
                                  disabled={this.props.Desabilitado}
                                  className="form-check-input"
                                  type="radio"
                                  name="OtroMecanismo"
                                  value={this.state.SeccionMecanismo}
                                  checked={this.state.SeccionMecanismo === 'Otro Mecanismo Operacional'}
                                  onChange={(e) => {

                                    this.inputChange(e.target)
                                  }}
                                />

                                <label className="form-check-label pe-10 fs-5" htmlFor="flexRadioDefault">
                                  Otro Mecanismo Operacional
                                </label>
                              </span>
                            </div>
                          {/* </div> */}
                        {/* </div> */}

                        
                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                            <label className="form-label required">
                              Nombre actual del Mecanismo
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

                            <select
                              disabled={this.props.Desabilitado}
                              name="mecanismoLocal"
                              value={this.state.NombreMecanismoLocal}
                              className="form-select select2-hidden-accessible"
                              onChange={(e) => {
                                this.inputChange(e.target)
                              }}
                              data-control="select2"
                              data-placeholder="Select an option"
                              data-select2-id="select2-data-7-njhs"
                              aria-hidden="true"
                            >
                              <option value="">Seleccionar...</option>
                              <option value={this.state.NombreMecanismo}>{this.state.NombreMecanismo}</option>
                              {this.state.mecanismos && this.state.mecanismos.length > 0 ?
                                this.state.mecanismos.map((mecanismo: any, index: any) => {
                                  return (
                                    <option key={index} value={mecanismo.NombreMecanismo}>
                                      {mecanismo.NombreMecanismo}
                                    </option>
                                  )
                                }) : null
                              }
                            </select>
                          </div>

                        
                        <div className='row mt-2'>
                          <h3>Informacin del mecanismo a publicar</h3>
                          <div className="col-6">
                            <label className="form-label required">
                              Nombre del Mecanismo
                            </label>
                            <select
                              disabled={this.props.Desabilitado}
                              name="mecanismo"
                              value={this.state.NombreMecanismoSelected}
                              onChange={(e) => {
                                this.inputChange(e.target)
                              }}
                              className="form-select select2-hidden-accessible"
                              data-control="select2"
                              data-placeholder="Select an option"
                              data-select2-id="select2-data-1-k7cj"
                              aria-hidden="true"
                            >
                              <option value="">Seleccionar...</option>
                              <option value={this.state.NombreMecanismo}>{this.state.NombreMecanismo}</option>
                              {this.state.mecanismos && this.state.mecanismos.length > 0 ?
                                this.state.mecanismos.map((mecanismo: any, index: any) => {
                                  return (
                                    <option key={index} value={mecanismo.NombreMecanismo}>
                                      {mecanismo.NombreMecanismo}
                                    </option>
                                  )
                                }) : null
                              }
                            </select>

                          </div>

                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                            <label className="form-label required">
                              Tipo de Mecanismo
                            </label>

                            <select title='.'
                              name="tipoMecanismo"
                              disabled={this.props.Desabilitado}
                              value={this.state.tipoMecanismo}
                              // onChange={(e) => {
                              //   this.CambioTipoMecanismo(e.target,"Solucion")
                              // }}
                              className="form-select select2-hidden-accessible" 
                              data-control="select2" 
                              data-placeholder="Select an option"  
                              data-select2-id="select2-data-7-njhs"

                            >
                              <option
                                data-select2-id="select2-data-9-da1c"
                                value="0"
                              >
                                seleccionar...
                              </option>

                              {this.state.tiposMecanismos.map(
                                (e: any) => (
                                  <option value={e.Title}>
                                    {e.Title}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>

                        </div>
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
                          <div className="d-flex">
                            <span className="form-check">
                              <input placeholder='.'
                                disabled={this.props.Desabilitado}
                                className="form-check-input"
                                type="radio"
                                name="seguridad"
                                value="Publico"
                                checked={this.state.seguridad === 'Publico'}
                                onChange={(e) => {
                                  this.setState({
                                    PersonaSeguridadEmail: [],
                                    correosSeguridad: [],
                                    seguridad: e.target.value,
                                  });
                                }}
                              />
                            </span>
                            <label
                              className="form-check-label pe-10"
                              htmlFor="flexRadioDefault"
                            >
                              Pblico
                            </label>
                            <span className="form-check">
                              <input placeholder='.'
                                disabled={this.props.Desabilitado}
                                className="form-check-input"
                                type="radio"
                                name="seguridad"
                                value="Privado"
                                checked={this.state.seguridad === 'Privado'}
                                onChange={(e) => {
                                  this.setState({
                                    PersonaSeguridadEmail: [],
                                    correosSeguridad: [],
                                    seguridad: e.target.value,
                                  });
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
                              <input placeholder='.'
                                disabled={this.props.Desabilitado}
                                className="form-check-input"
                                type="radio"
                                name="seguridad"
                                value="Confidencial"
                                checked={this.state.seguridad === 'Confidencial'}
                                onChange={(e) => this.setState({ seguridad: e.target.value })}
                              />
                            </span>
                            <label
                              className="form-check-label pe-10"
                              htmlFor="flexRadioDefault"
                            >
                              Confidencial
                            </label>
                          </div>

                        </div>

                        {this.state.seguridad == 'Confidencial' ? (
                          <div className="col-lg-3 col-md-3 col-xl-3 col-xxl-3 marginBottom">
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
                              onChange={(user) => this.getPeoplePickerSeguridad(user)}
                              showHiddenInUI={false}
                              ensureUser={true}
                              principalTypes={[PrincipalType.User]}
                              resolveDelay={1000}
                              defaultSelectedUsers={this.state.PersonaSeguridadEmail ? this.state.correosSeguridad : ''}
                              disabled={this.props.Desabilitado}
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="row mb-5 contenform">
                        <div className="mt-4">
                          <label className="form-check form-switch form-check-custom">
                            {this.props.match.params.opcion != 1 /*|| this.state.NombreMecanismo == 1*/ || this.props.match.params.IdMecanismo !== undefined ? (
                              <input
                                disabled={this.props.Desabilitado}

                                className="form-check-input"
                                type="checkbox"
                                value="1"
                                checked={this.state.Auditoria}
                                onChange={(e) => {
                                  this.setState({
                                    Auditoria: !this.state.Auditoria,

                                  })
                                }}
                              />
                            ) : (
                              <input
                                disabled={this.props.Desabilitado}

                                className="form-check-input"
                                type="checkbox"
                                value="1"
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
                              Requiere revisin de auditora
                            </span>
                          </label>
                        </div>

                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 mt-4">
                          <label className="form-check form-switch form-check-custom">
                            {this.props.match.params.opcion != 1 ? (
                              <input
                                disabled={this.props.Desabilitado}

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
                              Aplica a planta de produccin
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

                            {this.state.AplicaPlanta && this.state.AplicaPlanta.length > 0 ? (
                              <select
                                disabled={this.props.Desabilitado}
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
                                aria-hidden="true"
                              >
                                <option
                                  data-select2-id="select2-data-21-znkb"
                                  value="0"
                                >
                                  Seleccionar...
                                </option>
                                {this.state.plantas.map((e: any) => (
                                  <option value={e.Title}>
                                    {e.Title}
                                  </option>
                                ))}
                              </select>
                            ) : null}

                            <table>
                              {this.state.plantasAplica &&
                                this.state.plantasAplica.map((p: any, i: any) => (
                                  <tr>
                                    <td>- {p}</td>
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



                                  </tr>
                                ))}
                            </table>
                          </div>
                        ) : null}
                      </div>

                      <div className="separator mt-4 mb-4"></div>

                      <div className="row mb-5 pl">

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

                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                          <div style={{ display: 'none' }}>
                            <input
                              disabled={this.props.Desabilitado}
                              multiple
                              type="file"
                              id="files"
                              className="form-control-file"
                              onChange={(e) => this.onChangeFile(e)}
                            />
                          </div>
                          {this.state.documentosMecanismo &&
                            this.state.documentosMecanismo.length > 0 ? (
                            <div>
                              {this.state.documentosMecanismo.map((e: any) => (
                                <div className="mt-1">
                                  <a href={this.state.NameS + e.ServerRelativeUrl} target="_blank" rel="noopener noreferrer">
                                    <img title='.'
                                      className="IconoArchivo"
                                      src={this.pnp.getImageFile(e.Name)}
                                    />
                                    <span className="titleDoc">
                                      {e.Name}
                                    </span>
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {this.state.Archivos && this.state.Archivos.length >= 0 ? this.state.Archivos.map((e: any, index: any) => (
                            <div className="mt-1">
                              <img title='.'
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
                                <input title='.'
                                  disabled={this.props.Desabilitado}
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
                                <input title='.'
                                  disabled={this.props.Desabilitado}
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
                                Selecciona esta opcin si vas a adjuntar una URL
                              </label>
                              <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                {this.state.AdjuntarUrl == true ? (
                                  <input
                                    disabled={this.props.Desabilitado}
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


                      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom mb-2">
                        <div className="d-flex">
                          <span className="form-check">
                            {this.state.AdjuntarUrl == false ? (
                              <input title='.'
                                disabled={this.props.Desabilitado}
                                className="form-check-input"
                                type="radio"
                                name="addUrl"
                                id="RadioSeleccionado"
                                value="1"
                                onClick={(e) =>
                                  this.setState({ AdjuntarUrl: true, Url: "" })
                                }
                              />
                            ) : (
                              <input title='.'
                                className="form-check-input"
                                type="radio"
                                name="addUrl"
                                value="1"
                                onClick={(e) =>
                                  this.setState({
                                    AdjuntarUrl: false, Url: ""
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
                              Selecciona esta opcin si vas a adjuntar
                              una URL
                            </label>
                            <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                              {this.state.AdjuntarUrl == true ? (
                                <input
                                  disabled={this.props.Desabilitado}
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
                  !this.state.enviado && this.state.posPaso == 1 ? (
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
                          {this.state.documentosMecanismo.map((e: any) => (
                            <div className="mt-1">
                              <img title='.'
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
                              Con esta solicitud usted est
                              solicitando eliminar la totalidad de
                              documentos que componen el mecanismo.
                              Para eliminar slo uno o algunos de los
                              anexos del mecanismo cancele esta
                              solicitud y solicite una actualizacin
                              del mecanismo
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {this.state.Pasos ==
                  'Plan de accin de los contenidos' ? (
                  <div className="flex-column current">
                    <div className="row mb-5">
                      <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                        <h3 className="text-primary">
                          Plan de accin de los contenidos
                        </h3>
                      </div>
                    </div>
                    <div className="row mb-5">
                      <label className="form-check form-switch form-check-custom">
                        <span>
                          <h4>Documentos actuales del mecanismo</h4>
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
                        Indique a continuacin el plan de accin a
                        ejecutar para cada documento del mecanismo
                      </small>
                      <br />
                      <br />
                      {this.state.documentosMecanismo &&
                        this.state.documentosMecanismo.length > 0 ? (
                        <div className="tabla-Actualizar">
                          {this.state.documentosMecanismo.map(
                            (e: any, i: any) => (
                              <div className="row">
                                <div className="col-lg-7 col-md-7 col-xl-7 col-xxl-7">
                                  <img title='.'
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
                                  <select title='.'
                                    disabled={this.props.Desabilitado}
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
                            eliminacin, ms no de actualizacin.
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
                        <h4 className="mg-a">Aprobadores del rea</h4>
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
                            defaultSelectedUsers={[this.state.PersonaElaboraEmail ?
                              this.state.PersonaElaboraEmail : "",

                            ]}
                            disabled={this.props.Desabilitado}
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
                            disabled={this.props.Desabilitado}
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
                            disabled={!this.state.disabledGerente || this.props.Desabilitado}
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
                          Aprobadores de reas involucradas
                        </h4>
                      </div>
                      <div className="row mb-5 contenform">
                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 mt-6">
                          <small className="text-gray-600 fs-7">
                            Seleccione las reas que tienen
                            responsabilidad en el documento
                          </small>
                          <br />
                          <br />
                          {this.state.cAprobadoresArea.length < 4 ? (
                            <input
                              disabled={this.props.Desabilitado}
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
                            (e: any, index: any) => (
                              <div className="row">
                                <div className="col-lg-4 col-md-4 col-xl-4 marginBottom">
                                  <label>Direccin {index + 1} </label>
                                  <select
                                    disabled={this.props.Desabilitado}
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
                                    {this.state.direcciones.map((a: any) => (
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
                                    <label>rea {index + 1} </label>
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
                                      ].map((a: any) => (
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
                                    disabled={this.props.Desabilitado}
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
                        {this.state.cAprobadores && this.state.cAprobadores.length > 0 ? this.state.cAprobadores.map((p: any, i: any) =>
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
                          ? this.state.cAprobadores.map((p: any, i: any) =>
                            p.Cargo !== 'Auditor' && p.Cargo !== 'Lder GDC' ? (
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
                              disabled={this.props.Desabilitado}
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
                            (e: any, index: any) => (
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                  <h4>Aprobador {index + 1}</h4>
                                </div>
                                <div className="col-lg-5 col-md-5 col-xl-5 col-xxl-5 marginBottom">
                                  <PeoplePicker
                                    disabled={this.props.Desabilitado}
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
                            Consultar matriz de aprobacin de gestin
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
                          disabled={this.props.Desabilitado}
                        >
                          <option
                            data-select2-id="select2-data-36-v336"
                            value=""
                          >
                            Seleccionar..
                          </option>
                          {this.state.Motivos.map((e: any) => (
                            <option>{e.Title}</option>
                          ))}
                        </select>
                      </div>

                      {this.props.match.params.opcion == 2 ? null : (
                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                          <label className="form-label required " >
                            Descripcin:
                          </label>

                          <textarea
                            value={this.state.DescripcionMotivo}
                            onChange={(e) => { this.longitudcadena(e.target.value), this.setState({ DescripcionMotivo: e.target.value }) }}
                            className="form-control"
                            name="input2"
                            placeholder="Ingrese la Descripcin"
                            maxLength={300}
                            disabled={this.props.Desabilitado}
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
                              disabled={this.props.Desabilitado}
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
                              disabled={this.props.Desabilitado}
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
                {/* Pantalla Exitoso */}
                {this.state.Pasos == 'success' ? (
                  <div className="flex-column centerContent current">
                    <div className="row mb-5">
                      <div className="card-title flex-column p-4 mb-5">
                        <h2 className="text-primary fs-1">
                          Solicitud enviada con xito.
                        </h2>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                        <figure>
                          <img title='.'
                            src={
                              this.props.urlSitioPrincipal +
                              '/Style%20Library/Root/Quala_Logo_GC.png'
                            }
                            width="35%"
                            height="auto"
                          />
                        </figure>
                      </div>
                    </div>
                  </div>
                ) : null}

              </div>
              <div className="d-flex flex-stack Componentes">
                {/* Boton Cancelar */}

                {/* {this.state.posPaso >= 0 && !this.state.enviado ? (
              <button
                type="button"
                onClick={() => this.setState({ Cancelar: true })}
                className="btn btn-cancelar"
              >
                Cancelar
              </button>
            ) : null} */}


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
                      className="btn-regresarComponente"
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

                {/* Boton Continuar */}

                {this.state.posPaso <
                  this.state.secciones.length - 1 ? (
                  <button
                    value="Continuar"
                    name="continuar"
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      this.inputChange(e.target)
                    }}

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


                {/* Boton Guardar cambios */}
                {this.state.posPaso == this.state.secciones.length - 1 &&
                  !this.state.enviado &&
                  this.state.DescripcionMotivo.length > 0 &&
                  this.state.Motivo.length > 0 ? (
                  <button
                    disabled={this.props.Desabilitado}
                    value="Guardar"
                    name="Guardar"
                    onClick={() => { this.sendDataToControlList(); this.finishSave(); }}
                    type="button"
                    className="btn btn-primary"
                  >
                    <span className="indicator-label"> Guardar cambios </span>
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
                    // onClick={() => this.ActualizarPlanAccion()}
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

            </form>
          </div> :

          /* Pantalla ver documentos */
          this.state.boton == "verdoc" ?
            <div className="flex-column current">
              <div className="row mb-5">
                <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                  <h3 className="text-primary">
                    Documentos del formulario
                  </h3>
                </div>

              </div>
              <div className="row mb-5 contenformajustes">
                <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                  {this.state.documentosMecanismo &&
                    this.state.documentosMecanismo.length > 0 ? (
                    <div>
                      {this.state.documentosMecanismo.map((e: any) => (
                        <div className="mt-1">
                          <a href={this.state.NameS + e.ServerRelativeUrl} target="_blank" rel="noopener noreferrer">
                            <img title='.'
                              className="IconoArchivo"
                              src={this.pnp.getImageFile(e.Name)}
                            />
                            <span className="titleDoc">
                              {e.Name}
                            </span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <br />
              </div>
            </div>
            :

            /* Pantalla enviar ajustes del formulario */
            this.state.boton == "enviarajustes" ?
              <div className="flex-column current bordernone">
                <div className="row mb-5">
                  <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                    <h3 className="text-primary">
                      {this.state.TituloEnviarAjustes}
                    </h3>
                  </div>
                  <p className='ptextajustes'>{this.state.TextoEnviarAjustes}</p>
                </div>

                <div className="row mb-5 contenformajustes">

                  <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                    <label className="form-label required " >
                      {this.state.TextoObservaciones}
                    </label>
                    <br />
                  
                    <textarea
                      className= "textarea1" 
                      name="Envarajustes" 
                      id=""
                      placeholder='ingrese sus comentarios aqu'
                      >
                        

                    </textarea>
                        {/* <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M24.8497 3.14974C23.3141 1.61414 20.8244 1.61415 19.2889 3.14976L4.5025 17.9367C4.06211 18.3771 3.74255 18.9235 3.57462 19.5233L2.02779 25.0477C1.95474 25.3086 2.02809 25.5886 2.21968 25.7802C2.41127 25.9718 2.69131 26.0452 2.95223 25.9721L8.47647 24.4254C9.07632 24.2575 9.62281 23.9379 10.0633 23.4974L24.8497 8.71037C26.3852 7.17482 26.3852 4.68527 24.8497 3.14974ZM20.3496 4.2104C21.2993 3.2606 22.8392 3.26059 23.789 4.21039C24.7387 5.16014 24.7387 6.69997 23.789 7.64973L22.2498 9.18905L18.8104 5.74965L20.3496 4.2104ZM17.7497 6.81034L21.1891 10.2497L9.00259 22.4367C8.74429 22.6951 8.42382 22.8825 8.07205 22.981L3.83174 24.1682L5.01906 19.9277C5.11754 19.576 5.30493 19.2556 5.56318 18.9974L17.7497 6.81034Z" fill="#345E9E"/>
                        </svg> */}
                    <div>
                      <p id="Contadordescripajustes">{this.state.CantidadCaracteres}/5000</p>
                    </div>
                    <div className='d-flex flex-stack Componentesajustes'>

                      {/* Boton Cancelar */}
                      <button
                        type="button"
                        onClick={() => this.setState({ Cancelar: true })}
                        className="btn btn-cancelar"
                      >
                        Cancelar
                      </button>

                      {/* Boton Enviar ajustes */}
                      <button
                        name="continuar"
                        onClick={() => {

                          this.sendDataToControlList()
                        }
                        }
                        type="button"
                        className="btn btn-primary"
                      >
                        <span className="indicator-label"> Enviar ajustes</span>
                        <span className="indicator-progress">
                          Please wait...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      </button>

                    </div>

                  </div>

                  <br />
                </div>



              </div>
              :
              /* Pantalla responder ajustes del formulario */
              this.state.boton == "resajustes" ?
                <div className="flex-column current">
                  <div className="row mb-5">
                    <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                      <h3 className="text-primary">
                        {this.state.TituloResponderAjustes}
                      </h3>
                    </div>
                    <p className='ptextajustes'>{this.state.TextoResponderAjustes}</p>
                  </div>

                  <div className="row mb-5 contenformajustes">

                    <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                      <label className="form-label required " >
                        {this.state.TextoComentariosRevisor}
                      </label>
                      <textarea
                      className= "textarea1" 
                      name="Envarajustes" 
                      id=""
                      placeholder='ingrese sus comentarios aqu'
                      >
                        

                    </textarea>
                     
                      <div>
                        <p id="Contadordescripajustes">{this.state.CantidadCaracteres}/5000</p>
                      </div>
                      <div className='d-flex flex-stack Componentesajustes'>
                        {/* Boton Cancelar */}
                        <button
                          type="button"
                          onClick={() => this.setState({ Cancelar: true })}
                          className="btn btn-cancelar"
                        >
                          Cancelar
                        </button>

                        {/* Responder ajustes */}
                        <button
                          name="continuar"
                          onClick={() => this.sendDataToControlList()}
                          type="button"
                          className="btn btn-primary"
                        >
                          <span className="indicator-label"> Responder ajustes</span>
                          <span className="indicator-progress">
                            Please wait...
                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                          </span>
                        </button>

                      </div>
                    </div>
                    <br />
                  </div>
                </div>

                : /* Pantalla cancelar solicitud del formulario */
                this.state.boton == "cancelar" ?

                  <div className="flex-column current">
                    <div className="row mb-5">
                      <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                        <h3 className="text-primary">
                          {this.state.TituloCancelarsolicitud}
                        </h3>
                      </div>
                      <p className='ptextajustes'>{this.state.TextoCancelarsolicitud}</p>
                    </div>

                    <div className="row mb-5 contenformajustes">

                      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                        <label className="form-label required " >
                          {this.state.TextoComentarios}
                        </label>
                        <textarea
                          className= "textarea1" 
                          name="Envarajustes" 
                          id=""
                          placeholder='ingrese sus comentarios aqu'
                          >
                            
                        </textarea>
                        <div>
                          <p id="Contadordescripajustes">{this.state.CantidadCaracteres}/1000</p>
                        </div>

                        <div className='d-flex flex-stack Componentesajustes'>
                          {/* Boton Cancelar */}
                          <button
                            disabled={this.props.Desabilitado}
                            type="button"
                            onClick={() => this.sendDataToControlList()}
                            className="btn btn-cancelar"
                          >
                            Cancelar solicitud
                          </button>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                  :/* Pantalla enviar a publicacion del formulario */
                    this.state.boton == "publicacion" ?

                      <div className="flex-column current">
                        <div className="row mb-5">
                          <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                            <h3 className="text-primary">
                              {this.state.TituloEnviarAPublicacion}
                            </h3>
                          </div>
                          <label className="form-label required " >
                           {this.state.TextoEnviarAPublicacionCreacion1}
                          </label>

                        <p className='ptextajustes'>{this.state.TextoEnviarAPublicacionCreacion2}</p>
                      </div>
                      <div>
                        {this.state.documentosMecanismo &&
                          this.state.documentosMecanismo.length > 0 ? (
                          <div className="tabla-Actualizar">
                            {this.state.documentosMecanismo.map(
                              (documento:any, i:any) => (
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                    <img title='.'
                                      className="IconoArchivo"
                                      src={this.pnp.getImageFile(
                                        documento.Name,
                                      )}
                                    />
                                    <span className="titleDoc">
                                      {documento.Name}
                                    </span>
                                  </div>

                                  <div className="col-lg-3 col-md-3 col-xl-3 col-xxl-3">
                                    {this.state.tiposMecanismos && this.state.tiposMecanismos.length > 0 ? (
                                      <select
                                        name="tipoMecanismo"
                                        onChange={(e) => {
                                          this.CambioTipoMecanismo(e.target.value,documento.ServerRelativeUrl)                                          
                                        }}
                                        className="form-select-modulo select2-hidden-accessible"
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
                                        <option data-select2-id="select2-data-9-da1c"
                                          value="0"
                                        >
                                          seleccionar...
                                        </option>

                                        {this.state.tiposMecanismos.map(
                                          (TipoMecanismo:any,index:any) => (
                                            <option value={TipoMecanismo.Title} >
                                              {TipoMecanismo.Title}
                                            </option>
                                          ),
                                        )}
                                      </select>
                                    ) : null}

                                  </div>
                                </div>
                              ),
                            )}


                          </div>
                        ) : null}

                        </div>
                        <div className="row mb-5 contenformajustes">

                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                          <label className="form-label required " >
                            Comentarios
                          </label>
                          <textarea
                            className= "textarea1" 
                            name="Envarajustes" 
                            id=""
                            placeholder='ingrese sus comentarios aqu'
                            >
                              
                          </textarea>                          
                          <div>
                            <p id="Contadordescripajustes">{this.state.CantidadCaracteres}/1000</p>
                          </div>

                            <div className='d-flex flex-stack Componentesajustes'>
                              {/* Boton Cancelar */}
                              <button
                                type="button"
                                onClick={() => this.setState({ Cancelar: true })}
                                className="btn btn-cancelar"
                              >
                                Cancelar
                              </button>

                              {/* Enviar a publicaicon */}
                              <button

                                name="continuar"
                                onClick={() => {
                                  this.GuardarDocumentos(),
                                    this.sendDataToControlList()
                                }}
                                type="button"
                                className="btn btn-primary"
                              ><span className="indicator-label"> Enviar a publicacin</span>
                                <span className="indicator-progress">
                                  Please wait...
                                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                </span>
                              </button>
                            </div>
                          </div>
                          <br />
                        </div>
                        {this.state.loading ? (
                          <div className="contentModal">
                            <div className="modalLoading">Trabajando en ello...</div>
                          </div>
                        ) : null}
                      </div>
                      : /* Pantalla enviar a aprobacion */
                        
                      this.state.boton == "flujoaprobacion"?
                      <div className="flex-column current">
                      <div className="row mb-5">
                        <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                          <h3 className="text-primary">
                            {this.state.TituloActivarAprobacin}
                          </h3>
                        </div>
                      </div>    
                      <div className="row mb-5 contenformajustes">
    
                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                          <input placeholder='.' type="checkbox"
                          checked={this.state.botonAprocacion}
                          onChange={()=>
                            this.setState({
                              botonAprocacion: !this.state.botonAprocacion,
                            })
                          }/>
                          <label className="form-label" style={{ marginLeft: "7px" }}>
                          {this.state.TextoActivarAprobacin}
                          </label> 

                          <div className='d-flex flex-stack Componentesajustes'>
    
                            {/* Enviar a Aprobacion */}
                            <button style={{ marginTop: "30px" }}
                              name="Aprobadores"
                              onClick={() => this.sendDataToControlList()}
                              type="button"
                              className="btn btn-primary"
                              disabled={!this.state.botonAprocacion}
                            >
                              <span className="indicator-label"> Enviar a aprobadores</span>

                            </button>
    
                          </div>
                        </div>
                        <br />
                      </div>
                    </div>
                      :
                      /* Pantalla enviar aprobar solicitud */
                      this.state.boton == "Aprobar" ?
                      <div className="flex-column current">
                        <div className="row mb-5">
                          <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                            <h3 className="text-primary">
                              Aprobar solicitud
                            </h3>
                          </div>
                          <p className='ptextajustes'>Con esta aprobacin usted confirma que revis y est de acuerdo con el contenido de los documentos</p>
                        </div>
    
                        <div className="row mb-5 contenformajustes">
    
                          <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                            <label className="form-label required " >
                              Comentarios
                            </label>
                            <textarea
                              className= "textarea1" 
                              name="Envarajustes" 
                              id=""
                              placeholder='ingrese sus comentarios aqu'
                              >
                                
                            </textarea>                            
                            <div>
                              <p id="Contadordescripajustes">{this.state.CantidadCaracteres}/1000</p>
                            </div>
    
                            <div className='d-flex flex-stack Componentesajustes'>
                              {/* Boton Aprobar */}
                              <button
                                disabled={this.props.Desabilitado}
                                type="button"
                                onClick={() => this.props.closeModal()}
                                className="btn btn-cancelar"
                              >
                                Aprobar
                              </button>
                            </div>
                          </div>
                          <br />
                        </div>
                      </div>
                      :
                      /* Pantalla enviar aprobar solicitud */
                      this.state.boton == "Rechazar" ?
                      <div className="flex-column current">
                        <div className="row mb-5">
                          <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                            <h3 className="text-primary">
                              Rechazar solicitud
                            </h3>
                          </div>
                          <p className='ptextajustes'>Al rechazar esta solicitud se finaliza por completo el proceso de prublicacin. En caso de querer retomar la solicitud, el ususario solicitante deber iniciarla nuevamente.</p>
                        </div>
    
                        <div className="row mb-5 contenformajustes">
    
                          <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                            <label className="form-label required " >
                              Comentarios
                            </label>
                            <textarea
                              className= "textarea1" 
                              name="Envarajustes" 
                              id=""
                              placeholder='ingrese sus comentarios aqu'
                              >
                                
                            </textarea>
                            
                            <div>
                              <p id="Contadordescripajustes">{this.state.CantidadCaracteres}/1000</p>
                            </div>
    
                            <div className='d-flex flex-stack Componentesajustes'>
                              {/* Boton Rechazar */}
                              <button
                                disabled={this.props.Desabilitado}
                                type="button"
                                onClick={() => this.props.closeModal()}
                                className="btn btn-cancelar"
                                >
                                Rechazar
                              </button>
                            </div>
                          </div>
                          <br />
                        </div>
                      </div>

                      :null}
      </>
    );
  }
}

const mapStateToProps = (state:any) => {
  return {
    parametros: state.parametros.parametros
  };
};

export default connect(mapStateToProps)(withRouter(Componentes));
