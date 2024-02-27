import * as React from 'react';
import { connect } from 'react-redux';
import { PNP } from '../Util/util';
import SVGIconComponent from '../Util/SVGIcon';
import {
    PeoplePicker,
    PrincipalType,
  } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import {withRouter} from 'react-router-dom'
import { utilFormulario } from '../Util/utilFormulario';

export interface ICrearContenidoProps {
    webPartContext: any
    Subsitio: any
    NombreSubsitio: any
    urlSitioPrincipal: any
    currentUser: any
    Direcciones: any
    Areas: any
    SubAreas: any
    opcion: any
    Acceso: any    
    location: any
    userDetail: any;  
    parametros: any;
    niveles: any;
    paises: any;
  }


  class CrearContenidoN extends React.Component<ICrearContenidoProps, any> {
    public pnp: PNP
    public utilFormulario: utilFormulario
    public AproArea = false
    public AproRoles = false
    public Apro = false
    
  
    constructor(props:any) {
      super(props)
        
      this.utilFormulario = new utilFormulario(this.props.webPartContext);
      this.pnp = new PNP(this.props.webPartContext)
  
      var pasos = [
        { Title: 'Datos del Mecanismo' },
        { Title: 'Aprobadores' },
        { Title: 'Control de Cambios' },
      ]
            
      this.state = {
        pasos: pasos,
        opcion: 1,
        listaUsuarios: [],
        pais: this.props.paises.paises.filter((x:any) => x.Nombre_x0020_Pais == this.props.NombreSubsitio),
        aprobadores: [],
        revisores: [],
        elabarador: [],
        PersonaElabora: '',
        PersonaAprueba: '',
        PersonaRevisa: '',
        nivelesAprobadores: [],
        UserId: '',
        UserName: '',
        msjFinal: '',
        linkFinal: '',
        Plantas: [],
        secciones:pasos,
        Pasos: 'Datos del Mecanismo'


      }
    }

    //Okey 1611
    public componentDidMount (): void {  
      this.pnp.getCurrentUser().then((user) => {
        this.setState(
          {
            UserId: user.Id,
            UserName: user.Title,
          },
          () => {

          },
        )
      })
      
      this.consultarMensajeFinal()

      this.setState(
        {
          VisorOk: this.state.opcion,
        },
        () => {
          this.CargaInicial()
        },
      )

    }

    //Funcion que valida si el mecanismo existe, y traer la informacion del mecanismo de lo contrario no trae ningun mecanismo
     //Okey 1611
    public CargaInicial() { 
      var secciones:any = []

      if (!this.state.seccionesOk) {
        this.state.secciones.forEach((item:any, index:any) => {
          if (index == 1 && this.state.opcion == 2) {
            secciones.push({ Title: 'Documentos del Mecanismo' })
          } else if (index == 1 && this.state.opcion == 3) {
            secciones.push({ Title: 'Plan de accin de los contenidos' })
          }
          secciones.push(item)
        })

        this.setState({
          secciones: secciones,
          seccionesOk: true,
        })
      }

      this.plantas()
      
      this.consultarMotivos()       
    }

    //Funcion que consulta las plantas y devuelve un objeto con la informacion de estas.
     //Okey 1611
    private plantas() {
       this.pnp.getListItems('Planta', ['*'], '', '').then((items) => {
        this.setState({ plantas: items })
      }).catch()
    }

    //Funcion que consulta los motivos de la lista parametrosGenerales y devuelve un objeto con esta informacion.
    //Okey 1611
    private consultarMotivos() {
      this.pnp.getListItemsRoot('Motivos',['*'],
          "PaisId eq" +  this.state.pais[0].ID,
          '',
        ).then((res:any) =>
          this.setState({
            Motivos: res,
          }),
        )
    }



    //funcion para consultar los mensajes desde parametros
    //Okey 1611
    private consultarMensajeFinal() {

      var msjFinal = (this.props.parametros.filter((elemento: any) => elemento.Llave === "MensajeDeExito")[0] ?? {}).Valor;    
      var linkFinal = (this.props.parametros.filter((elemento: any) => elemento.Llave === "LinkMensajeFinal")[0] ?? {}).Valor;
  
      this.setState({
        msjFinal: msjFinal,
        linkFinal: linkFinal
      });
   
    }
  

   
    //Funcion que consulta las subareas recibe como parametro el nombre del area.
    //Okey 1611
    private consultarSubarea(nombreArea:any) {
        this.setState(
        {
            subAreas: this.state.subAreasTotal.filter((x:any) => x.Area == nombreArea),
        }
        )
    }    

    //Funcion que consulta las areas por direcciones.
    //Okey 1611
    private consultarAreas(nombreDireccion:any) {   
        this.setState(
            {
            areas: this.state.areasTotal.filter(
                (x:{Direccion:any}) => x.Direccion == nombreDireccion,
            ),
            
            },
            () => {        
                this.ConsultarModelos(nombreDireccion, 'Direccion');        
            },
        )
    }

    // Funcion que consulta los modelos recibe como parametro el nombre del area o direccion o sub area al cual consultar.
    //Okey 1611
    private ConsultarModelos(busqueda:string, tipo: string) {
        
        let filter;

        tipo=='Direccion' ? filter = this.props.Direcciones.filter((x:any) => x.NombreDireccion == busqueda) : 
        filter = this.props.Areas.filter((x:any) => x.NombreArea == busqueda);
        
        this.pnp.getListItems('Modelos Local',['*'],"ID eq '" + filter[0].ID + "'",'',"",0,this.props.NombreSubsitio)
        .then((res) => {
            if (res.length > 0) {            
            this.setState(
                {modelos: res,pilares: []},
                () => {
                this.ConsultarPilares(res[0].Nombre_x0020_Modelo_x0020_Local)},);
            }
        })
    }

    private handleOtroMecanismo(value: any) {
        this.setState(
          {
            NombreMecanismo: 2,
            mecanismo: '',
            descripcionMecanismo: 'Otro Mecanismo Operacional',
          },
          () => {
            
            this.consultarMecanismoFiltro(this.state.driver,'Otro Mecanismo Operacional',)
            
            if (this.state.opcion == "1"){
              this.setState({NombreMecanismo:1})
            }
            else {
              if (this.state.opcion !== "1") {
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
        }
      )
    }

    private handleDriverChange(value: any) {      
      this.consultarMecanismo(value);
      this.consultaMecanismoLocal(value);
    }

    private handleContinuar() {
      const { pasos, posPaso } = this.state;      
        if (pasos == 'Datos del Mecanismo') {
          if (this.state.opcion === '1') {

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

          if (this.state.opcion !== '1' && this.state.seguridad !== "" &&
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
        } else if (pasos == 'Plan de accin de los contenidos') {
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
            if (this.state.opcion == 3) {
              this.ActualizarPlanAccion()
            } else if (this.state.opcion == 2) {
              this.BorrarArchivos()
            } else {
              this.GuardarDocumentos()
            }
          }
        } else if (this.state.opcion == 3 && this.state.seguridad !== "" &&
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
        else if (this.state.opcion == 2 && this.state.seguridad !== "" &&
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

    //Funcion que consulta los mecanismos segun el driver seleccionado.
    public consultarMecanismo(Driver:any) {

    if (this.state.opcion !== "1") {
       this.pnp.getListItems(
         'Mecanismos Local',
         ['*', 'ID_x0020_Driver_x0020_Local/Id'],
         'ID_x0020_Driver_x0020_Local/Id eq ' + Driver,
         'ID_x0020_Driver_x0020_Local',
       )
         .then((res) => {
 
           if (res.length > 0) {          
             this.setState(
               {
                 mecanismos: res,
               },
               () => {
                 if (this.state.dataMecanismo.ID != undefined) {
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
    }

    //Funcion que consulta los datos por medio de un IDmecanismo y trae un array con los datos guardados
    private consultardatos(IdMecanismo:any) {
      /* this.props.history.push('/CrearContenido/' + this.props.match.params.Acceso + '/' + this.state.opcion + '/' + IdMecanismo,)
      
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

    //Funcion que consulta los driver de cada pilar recibe como parametro el id del pilar al que se le va consultar.
    private consultarDriver(IdPilar:any) {
        
      this.pnp
        .getListItems('Drivers Local',['*', 'ID_x0020_Pilar_x0020_Local/ID'],
          'ID_x0020_Pilar_x0020_Local/ID eq ' + IdPilar,'ID_x0020_Pilar_x0020_Local',)
        .then((res) =>
          this.setState(
            {
              drivers: res,
            }                
          ),
        )
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

      if (this.state.opcion == 1) {

        this.pnp.getListItems(
          "Mecanismos Local",
          ["*", "ID_x0020_Driver_x0020_Local/Id", "ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver"],
          `ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver eq '${NombreDriver}' and Porcentaje_x0020_Implementacion lt 1`,
          "ID_x0020_Driver_x0020_Local"
        ).then((items) => {       
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
          "Mecanismos Local",
          ["*", "ID_x0020_Driver_x0020_Local/Id", "ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver"],    
          `ID_x0020_Driver_x0020_Local/Nombre_x0020_Driver eq '${NombreDriver}' and Porcentaje_x0020_Implementacion eq 1.0`,
          "ID_x0020_Driver_x0020_Local"
        ).then((items) => {        
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

    //Funcion que consulta los mecanismos segun el driver seleccionado.
    private consultarMecanismoFiltro(Driver:any, seccion:any) {
        if (this.state.opcion == 1) {
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

    //Funcion que consulta los pilares filtrando por el nombre del modelo recibe como parametro el nombre del modelo.
    private ConsultarPilares(NombreModelo:any) {
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
   
    //Funcion para eliminar linea del campo plantas
    private deletePlanta(index:any) {
        /*const plantasAplica = this.state.plantasAplica
        plantasAplica.splice(index, 1)



        this.setState({
        plantasAplica: plantasAplica,
        })*/
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
    
     //funcion que ayuda a revisar los cambios en los estados de los elementos html.
    //Okey 1611
    private inputChange(target: any) {
    const { name, value } = target;

    this.setState({ [name]: value });

    switch (name) {
        case 'direccion':
            this.consultarAreas(value);
            break;
        case 'area':
            this.consultarSubarea(value);
            break;
        case 'subArea':
            this.ConsultarModelos(value,'Area');
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
            this.setState(this.utilFormulario.consultarMatrizApro(this.state.pais[0].ID, value, this.props.niveles));            
            break;
        default:
            break;
        }
    }

    //Funcion que identifica la cantidad de caracteres 
    //Okey 1611
    private longitudcadena(cantidad:any) {
        
        const result = cantidad.length
        this.setState({CantidadCaracteres: result})                
    }   

    // Funcion para consultar los archivos del mecanismo
    private ObtenerArchivos(NombreMecanismo:any, Seguridad?:any) {
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

    //Funcion que guarda los documentos de en la biblioteca segun el modelo.
    private GuardarDocumentos() {
        /*if (
        this.state.opcion == 1 &&
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
                ).then((res) =>)
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

    //Funcion para eliminar archivos graficamente
    private deleteArchivo(index:any) {
        const archivos = this.state.Archivos
        archivos.splice(index, 1)



        this.setState({
        Archivos: archivos,
        })
    }

    // FUncion para actualizar el plan de accion de los documentos
    private ActualizarPlanAccion() {
    /*this.setState(
        {
        loading: true,
        },
        () => {
        if (
            this.state.opcion !== 1 &&
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
                ).then((res) => )
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
                this.updateMotivos('Actualizacin')
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
                this.updateMotivos('Actualizacin')
                })
            }
        })
        },
    )*/
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

    // funcion para agregar linea a demas aprobadores
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

    public finishSave() {
        this.setState({
          Pasos: 'success',
          enviado: true,
          loading: false,
        })
    }

            


    public render(): React.ReactElement<ICrearContenidoProps> {
        if (this.state.opcion != this.state.VisorOk) 
        {
          //this.props.opcion != undefined ? null: window.location.reload()
        }
    
        return (
          <>
          
              <div>
                {this.state.Cancelar ? (
                  <div className="modal-container overflow-auto">
                    <div className="modal-window" id="crearContenido">
                      <div>
                        <div id="EncabezadoModal">
                          <h3 id="tituloCancelar">¿Estas seguro que deseas cancelar la solicitud?</h3>
                          <br />
    
                          <div className="row">
                            <div className="col">
                              <input type="button"
                                id="bton" value="Si" className="btn btn-danger"/>
                            </div>
                            <div className="col">
                              <input type="button" value="No" className="btn btn-primary"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
    
                <div className="toolbar py-5 py-lg-7" id="kt_toolbar">
                  <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
                    <div className="page-title d-flex flex-column me-3">
                        <h1 id="contentn" className="d-flex text-dark fw-bolder my-1 fs-2"> Creacin de Contenido </h1>                                            
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
                    <div className="stepper stepper-pills first" id="kt_stepper_example_clickable" data-kt-stepper="true">
                      <div className="separator mt-4 mb-4"></div>                      
                        <div className="stepper-nav flex-center flex-wrap mb-10">
                          {this.state.secciones.map((s:any, index:any) => (
                            <div className={this.state.Pasos == s.Title? 'stepper-item mx-2 my-4 current': 'stepper-item mx-2 my-4 pending'}>
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
                    </div>
    
                    <div className="card">
                      <div className="card-body">
                        <div className="stepper stepper-pills first" id="kt_stepper_example_clickable" data-kt-stepper="true">                    
                          <form className="form mx-auto" id="kt_stepper_example_basic_form">
                            <div className="mb-5">
                              <div>
                                {/* Pantalla 1 del formulario */}
                                {this.state.Pasos == 'Datos del Mecanismo' ? (
                                  <div className="flex-column current">
                                    <div className="row mb-5 ">
                                      <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                        <h3 className="text-primary">Datos del Mecanismo</h3>
                                      </div>
                                    </div>
                                    <div className="row mb-5 contenform">                                  
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label required">Pas</label>
                                            <input style={{ height:'56%'}}
                                            type="text" className="form-control"
                                            name="input2" placeholder="."
                                            value={this.state.NombreConvertido} disabled/>
                                        </div>                                  
    
                                      <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                        <label className="form-label required">Direccin</label>
    
                                        {this.state.direcciones && this.state.direcciones.length > 0 ? (
                                          <select name="direccion"
                                            value={this.state.direccion} className="form-select select2-hidden-accessible"
                                            onChange={(e) => {this.inputChange(e.target)}} data-control="select2"
                                            data-placeholder="Seleccione una opcin" data-select2-id="select2-data-1-k7cj"
                                            disabled={this.state.disabled} aria-hidden="true">
                                                
                                            <option data-select2-id="select2-data-3-efwm"></option>
                                            {this.state.direcciones.map((e:any) => (
                                              <option value={e.NombreDireccion}>{' '}{e.NombreDireccion}</option>
                                            ))}
                                          </select>
                                        ) : null}
                                      </div>
    
                                      {this.state.areas && this.state.areas.length > 0 ? (
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label required">rea</label>
    
                                          <select name="area"
                                            value={this.state.area} className="form-select select2-hidden-accessible"
                                            onChange={(e) => {this.inputChange(e.target)}}
                                            data-control="select2" data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs" disabled={this.state.disabled}
                                            aria-hidden="true">

                                            <option data-select2-id="select2-data-3-efwm"></option>
                                            {this.state.areas.map((e:any) => (
                                              <option value={e.NombreArea}>{e.NombreArea}</option>
                                            ))}
                                          </select>
                                        </div>
                                      ) : null}
    
                                      {this.state.subAreas && this.state.subAreas.length > 0 ? (
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label">Sub rea (opcional)</label>
    
                                          <select name="subArea"
                                            value={this.state.subArea}
                                            onChange={(e) => {this.inputChange(e.target)}}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2" data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={this.state.disabled} aria-hidden="true">

                                            <option data-select2-id="select2-data-9-da1c">Seleccionar</option>
    
                                            {this.state.subAreas.map((e:any) => (<option value={e.NombreSubArea}>{e.NombreSubArea}</option>))}

                                          </select>
                                        </div>) : null}
    
                                      {this.state.pilares && this.state.pilares.length > 0 ? (
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label required">Pilar</label>
    
                                          <select name="pilar" value={this.state.pilar}
                                            onChange={(e) => {this.inputChange(e.target)}}
                                            className="form-select select2-hidden-accessible"
                                            data-control="select2"
                                            data-placeholder="Select an option"
                                            data-select2-id="select2-data-7-njhs"
                                            disabled={this.state.disabled}
                                            aria-hidden="true">

                                            <option data-select2-id="select2-data-9-da1c" value="0">seleccionar...</option>
    
                                            {this.state.pilares.map((e:any) => (<option value={e.Id}>{e.Pilar}</option>))}
                                          </select>
                                        </div>
                                      ) : null}
    
                                      {this.state.drivers && this.state.drivers.length > 0 ? (
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label required">Driver</label>
                                          {    
                                            <select name="driver"
                                                value={this.state.driver}
                                                onChange={(e) => {this.inputChange(e.target)}}                                                
                                                className="form-select select2-hidden-accessible"
                                                data-control="select2" data-placeholder="Select an option"
                                                data-select2-id="select2-data-7-njhs"
                                                disabled={this.state.disabled}
                                                aria-hidden="true">

                                                <option data-select2-id="select2-data-9-da1c" value="0">seleccionar...</option>                                                                                                                                                    
                                            
                                            </select>                                                                                            
                                          }    
                                        </div>
                                      ) : null}
                                                                        
                                      {this.state.opcion == "1" ? (
                                          
                                        <div className="row">
                                          <div className="col-lg-6 col-md-4 col-xl-6 col-xxl-6 marginBottom">                                      
                                            <label className="form-label required">Nombre del Mecanismo Local</label>
                                              <input disabled
                                                  type="text"name="mecanismo"
                                                  value={this.state.NombreMecanismo}
                                                  className="form-select select2-hidden-accessible"
                                                  placeholder="."
                                                  onChange={(e) => {
                                                    this.setState({
                                                      mecanismoNombre1: e.target.value,
                                                      mecanismo: e.target.value
                                                    })
                                                  }}/>                                                                                                                                     
                                          </div>
    
                                          <div className="col-lg-6 col-md-4 col-xl-6 col-xxl-6 marginBottom">
                                            <label className="form-label required">
                                              Tipo de Mecanismo
                                            </label>
                                            {this.state.tiposMecanismos && this.state.tiposMecanismos.length > 0 ? (
                                              <select
                                                name="tipoMecanismo"
                                                value={this.state.tipoMecanismo}
                                                onChange={(e) => {this.inputChange(e.target)}}
                                                className="form-select select2-hidden-accessible"
                                                data-control="select2"
                                                data-placeholder="Select an option"
                                                data-select2-id="select2-data-7-njhs"
                                                aria-hidden="true"
                                                disabled>

                                                <option data-select2-id="select2-data-9-da1c" value="0">
                                                  seleccionar...
                                                </option>
    
                                                {this.state.tiposMecanismos.map((e:any) => (
                                                    <option value={e.Title}>{e.Title}</option>),
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
                                          <span className="form-label required" id="labelSeguridad">
                                            Seguridad
                                          </span>
                                          <span className="FAQ">
                                            <SVGIconComponent iconType='M8' />
                                            <span className="modalFAQ">{this.state.FaqSeguridad}</span>
                                          </span>
                                        </label>
                                         <br />                                       
                                          <div className="d-flex">
                                            <span className="form-check">
                                              <input
                                                placeholder='.' className="form-check-input"
                                                type="radio" name="seguridad"
                                                value="Pblico"
                                                checked={this.state.seguridad === 'Pblico'}
                                                onChange={(e) => {
                                                  this.setState({
                                                    PersonaSeguridadEmail: [],
                                                    correosSeguridad: [],
                                                    seguridad: e.target.value,
                                                  })
                                                }}
                                              />
                                            </span>
                                            <label className="form-check-label pe-10" htmlFor="flexRadioDefault">
                                              Pblico
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
                                      </div>
    
                                      {this.state.seguridad == 'Confidencial' ? (
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label  required">
                                            Asignado a:
                                          </label>
    
                                          <PeoplePicker
                                            context={this.props.webPartContext}
                                            titleText=""
                                            personSelectionLimit={100}
                                            groupName={''}
                                            showtooltip={true}
                                            required={true}
                                            disabled={this.state.opcion !== '1'? true: false}
                                            onChange={(items) => this.setState(this.utilFormulario._getPeoplePickerSeguridad(items))}
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
                                            <input
                                              disabled
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
                                          <span className="form-check-label mx-15">
                                            Requiere revisin de auditora
                                          </span>
                                        </label>
                                      </div>
    
                                      <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 mt-4">
                                        <label className="form-check form-switch form-check-custom">                                        
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
                                          <span
                                            className="form-check-label"
                                            id="fcl1"
                                          >
                                            Aplica a planta de produccin
                                          </span>
    
                                          <span className="FAQ">
                                            <SVGIconComponent iconType='M8' />
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
                                              disabled={this.state.opcion !== "2" ? false : true}
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
                                            {this.state.plantasAplica && this.state.plantasAplica.map((p:any, i:any) => (
                                                <tr>
                                                  <td>- {p}</td>
                                                  {
                                                    this.state.opcion !== "2" ?
    
                                                      <td>
                                                        <span
                                                          onClick={() => {
                                                            this.deletePlanta(i)
                                                          }}
                                                        >
                                                          <SVGIconComponent iconType='M5' />
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
                                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 mt-1">
                                          <label htmlFor="files">
                                            <h4>
                                              <span>Adjuntar contenidos a publicar</span>
                                              <SVGIconComponent iconType='M8.2' />
                                            </h4>
                                          </label>
                                        </div>                                     
    
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
                                              <SVGIconComponent iconType='M5' />
                                            </span>
                                          </div>
                                        ))
    
                                          : null}
    
    
                                      </div>
                                    </div>                                      
                                       
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
                                              Selecciona esta opcin si vas a adjuntar
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
                                    
    
                                    <br />
    
                                    <br />
                                    {this.state.falta == true ? (
                                      <div className="alert alert-danger" role="alert">
                                        <SVGIconComponent iconType='M5' />
                                        Debe diligenciar todos los campos obligatorios
                                        para continuar.
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}    
                              </div>
    
                              {/* Pantalla 2 del formulario */}
                              {this.state.Pasos == 'Documentos del Mecanismo' && !this.state.enviado ? (
                                <div className="flex-column current">
                                  <div className="row mb-5">
                                    <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                      <h3 className="text-primary">Documentos del mecanismo</h3>
                                    </div>
                                  </div>
    
                                  <div className="row mb-5 contenform">
                                    {this.state.documentosMecanismo && this.state.documentosMecanismo.length > 0 ? (
                                      <div>
                                        {this.state.documentosMecanismo.map((e:any) => (
                                          <div className="mt-1">
                                            <img title='.' className="IconoArchivo" src={this.pnp.getImageFile(e.Name)}/>
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
                                        <SVGIconComponent iconType='M7' />
    
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
    
                              {this.state.Pasos == 'Plan de accin de los contenidos' ? (
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
                                        <h4>Documentos actuales del mecanismo </h4>
                                      </span>
    
                                      <span className="FAQ">
                                        <SVGIconComponent iconType='M8' />
    
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
                                          (e:any, i:any) => (
                                            <div className="row">
                                              <div className="col-lg-7 col-md-7 col-xl-7 col-xxl-7">
                                                <img title='-'
                                                  className="IconoArchivo"
                                                  src={this.pnp.getImageFile(e.Name,)}/>                                                
                                                <span className="titleDoc">
                                                  {e.Name}
                                                </span>
                                              </div>
    
                                              <div className="col-lg-5 col-md-5 col-xl-5 col-xxl-5">
                                                <select title='.'
                                                  name={'PlanAccion' + i}
                                                  className="form-select select2-hidden-accessible"
                                                  id="tabla-Actualizar"
                                                  value={
                                                    this.state.ValorDocumentos['PlanAccion' + i]
                                                    ? this.state.ValorDocumentos['PlanAccion' + i]
                                                      : 0
                                                  }
                                                  onChange={(e) =>
                                                    this.selectPlanAccion(e.target,i,)
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
                                      <div className="alert alert-danger" role="alert">
    
                                        <SVGIconComponent iconType='M8' />
    
                                        Debe diligenciar todos los campos
                                        obligatorios para continuar.
                                      </div>
                                    ) : null}
    
                                    {this.state.allDelete ? (
                                      <div id="allDelete" className="alert alert-warning">
                                       <SVGIconComponent iconType='M7' />
    
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
                                          context={this.props.webPartContext}                                          
                                          titleText=""
                                          personSelectionLimit={1}
                                          groupName={''}
                                          showtooltip={true}
                                          required={true}
                                          onChange={(items) => this.setState(this.utilFormulario._getPeoplePicker(items,'PersonaElabora'))}
                                          showHiddenInUI={false}
                                          ensureUser={true}
                                          principalTypes={[PrincipalType.User]}
                                          resolveDelay={1000}
                                          defaultSelectedUsers={[
                                            this.state.elabarador.length > 0 ? this.state.elabarador[0].user.Email : '',
                                          ]}
                                        />
                                      </div>
                                      <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                        <label className="form-label required">
                                          Revisa
                                        </label>
                                        <PeoplePicker
                                          context={this.props.webPartContext}
                                          titleText=""
                                          personSelectionLimit={1}
                                          groupName={''}
                                          showtooltip={true}
                                          required={true}
                                          disabled
                                          onChange={(items) => this.setState(this.utilFormulario._getPeoplePicker(items,'PersonaRevisa'))}
                                          showHiddenInUI={false}
                                          ensureUser={true}
                                          principalTypes={[PrincipalType.User]}
                                          resolveDelay={1000}
                                          defaultSelectedUsers={[
                                            this.state.revisores.length > 0 ? this.state.revisores[0].user.Email: '',
                                          ]}
                                        />
                                      </div>
                                      <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                        <label className="form-label required">
                                          Aprueba
                                        </label>
                                        <PeoplePicker
                                          context={this.props.webPartContext}
                                          titleText=""
                                          personSelectionLimit={1}
                                          groupName={''}
                                          showtooltip={true}
                                          required={true}
                                          onChange={(items) =>
                                            this.setState(this.utilFormulario._getPeoplePicker(items,'PersonaAprueba'))
                                          }
                                          disabled={this.state.disabledGerente ? false : true}
                                          showHiddenInUI={false}
                                          ensureUser={true}
                                          principalTypes={[PrincipalType.User]}
                                          resolveDelay={1000}
                                          defaultSelectedUsers={[
                                            this.state.aprobadores.length > 0? this.state.aprobadores[0].user.Email : '',
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
                                          Seleccione las reas que tienen responsabilidad en el documento
                                        </small>
                                        <br />
                                        <br />
                                        {this.state.cAprobadoresArea.length < 4 ? (
                                          <input
                                            type="button"
                                            className="btn btn-secondary"
                                            value="Agregar Aprobadores"
                                            /*onClick={() =>
                                              //this.addAprobadoresArea('Add')
                                            }*/
                                          />
                                        ) : null}
                                        <br />
                                        <br />
                                      </div>
    
                                      {this.state.nivelAprobacion.length > 0 &&
                                        this.state.nivelAprobacion.map(
                                          (e:any, index:any) => (
                                            <div className="row">
                                              <div className="col-lg-4 col-md-4 col-xl-4 marginBottom">
                                                <label>Direccin {index + 1} </label>
                                                <select
                                                  onChange={(event) => this.utilFormulario.getAprobadoresPorArea(
                                                      event.target.value,
                                                      index, [], ""
                                                    )
                                                  }
                                                  className="form-select select2-hidden-accessible"
                                                  data-control="select2"
                                                  data-placeholder="Select an option"
                                                  data-select2-id="select2-data-22-noy6"
                                                  //value={}
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
    
                                              {this.state['AreasDireccion' + index] && this.state['AreasDireccion' + index]
                                                  .length > 0 ? (
                                                <div className="col-lg-4 col-md-4 col-xl-4 marginBottom">
                                                  <label>rea {index + 1} </label>
                                                  <select
                                                    onChange={(eventA) =>
                                                      this.utilFormulario.getAprobadoresArea(eventA.target.value,index,this.state.cAprobadores,[])
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
                                                  this.state.listaUsuarios[index].Rol
                                                }
                                                <PeoplePicker
                                                  disabled
                                                  context={this.props.webPartContext}
                                                  titleText=""
                                                  personSelectionLimit={1}
                                                  groupName={''}
                                                  showtooltip={true}
                                                  required={true}
                                                  onChange={(items) =>
                                                    this.utilFormulario._getPeoplePickerG(items,index,this.state.listaUsuarios)
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
                                                    <SVGIconComponent iconType='M5' />
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
                                              context={this.props.webPartContext}
                                              personSelectionLimit={1}
                                              groupName={''}
                                              showtooltip={true}
                                              required={true}
                                              onChange={(items) =>
                                                this.setState(this.utilFormulario.getPeoplePickerOtrosAprobadores(
                                                  items,i,p.Cargo,this.state.cAprobadores))
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
                                          p.Cargo !== 'Auditor' && p.Cargo !== 'Lder GDC' ? (
                                            <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                              <label className="form-label">
                                                {p.Cargo}
                                              </label>
    
                                              <PeoplePicker
                                                context={this.props.webPartContext}
                                                personSelectionLimit={1}
                                                groupName={''}
                                                showtooltip={true}
                                                required={true}
                                                onChange={(items) =>
                                                 this.setState(this.utilFormulario.getPeoplePickerOtrosAprobadores(
                                                    items,i,p.Cargo,this.state.cAprobadores))
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
                                           <SVGIconComponent iconType='M8' />
    
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
                                                  context={this.props.webPartContext}
                                                  titleText=""
                                                  personSelectionLimit={1}
                                                  groupName={''}
                                                  showtooltip={true}
                                                  required={true}
                                                  //disabled={this.state.disabled == 'disabled' ? true : false}
                                                  onChange={(items) =>
                                                    this.setState(this.utilFormulario.getPeoplePickerDemasAprobadores(
                                                      items,
                                                      index,this.state.cDemasAprobadores
                                                    ))
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
                                                    <SVGIconComponent iconType='M5' />
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
                                          <SVGIconComponent iconType='M6.9' />
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
                                        <SVGIconComponent iconType='M8' />
                                        {' '}
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
    
                                    {this.state.opcion == 2 ? null : (
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
                                        ></textarea>
                                      </div>
    
                                    )}
                                    {this.state.opcion == 2 ? null : (
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
                                          <SVGIconComponent iconType='M8' />
    
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
                                          Solicitud enviada con xito.
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
                                          est pgina.
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
                                  <SVGIconComponent iconType='M11' />
    
                                  Regresar
                                </button>
                              ) : null}
                            </div>
    
                            {/* Boton Cancelar */}
                            <div>
                              {this.state.posPaso >= 0 && !this.state.enviado ? (
                                <button type="button" onClick={() => this.setState({ Cancelar: true })} className="btn btn-cancelar">
                                  Cancelar
                                </button>
                              ) : null}
                              {/* Boton Continuar */}
    
                              {this.state.posPaso < this.state.secciones.length - 1 ? (
                                <button
                                  type="button" className="btn btn-primary"
                                  onClick={(e) => {this.inputChange(e.target)}}
                                  value="Continuar"
                                  name="continuar">
                                  Continuar
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-chevron-right"
                                    viewBox="0 0 16 16">
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
                                this.state.opcion == 1 &&
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
                                this.state.opcion == 2 &&
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
                                this.state.opcion == 3 &&
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

  const mapStateToProps = (state:any) => {
    return {
      parametros: state.parametros.parametros,
      paises: state.paises,
      userDetail: state.userDetail.userDetail,
      niveles: state.nivelAprobacion.nivelAprobacion,
    };
  };
  
  
  export default connect(mapStateToProps)(withRouter(CrearContenidoN))