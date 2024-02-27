import * as React from 'react';
import { connect } from 'react-redux';
import { PNP } from '../Util/util'
import { Link, withRouter } from 'react-router-dom';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import SelectDocument from './SelectDocument';


export interface IExtenderVigenciaProps {
  webPartContext: any;
  match: any;
  NombreSubsitio: any;
  urlSitioPrincipal: any;
  UserId: any;
  Direcciones: any;
  Areas: any;
  SubAreas: any;
  history: any;
  paises: any;
  userDetail: any;  
  parametros: any;
  niveles: any;
  mecanismoId: any;      
}

class ExtenderVigencia extends React.Component<IExtenderVigenciaProps, any>{

  public pnp: PNP
  public AproArea = false;
  public AproRoles = false;
  public Apro = false;
  public Documentos: any = [];

  constructor(props:any) {

    super(props);
    this.pnp = new PNP(this.props.webPartContext);

    this.state = {
      Pasos: 1,
      Mecanismo: [],
      documentosMecanismo: [],
      NombreMecanismo: "",
      DocumentosAExtender: [],
      NombreModelo: "",
      NombreArea: "",
      NombreDireccion: "",
      TipoMecanismo: "",
      MatrizRol: [],
      PersonaElabora: 0,
      PersonaRevisa: "",
      PersonaAprueba: "",
      cDemasAprobadores: [],
      cAprobadoresArea: [],
      AprobadoresArea: {},
      PersonasAprobadoras: [],
      Cancelar: false,
      Gestor: [],
      Aprobador: [],
      Usuario: "",
      UserName: "",
      descripcionMecanismo: "",
      disabled: false,
      Motivo: "", Motivos: [], DescripcionMotivo: "",
      faqCompromiso: "",
      faqAprobadores: "",
      FaqSeguridad: "",
      SeccionMecanismo: "",
      correosSeguridad: [],
      plantas: "",
      plantasAplica: [],
      AplicaPlanta: false,
      Plantas: [],
      msjFinal: "",
      linkFinal: "",
      CantidadCaracteres: 0,
      direcciones: this.props.Direcciones,
      areasTotal: this.props.Areas,
      subAreasTotal: this.props.SubAreas,
      checked: false,
      falta: false,
      posPaso: 0
    }
  }


  //funcion que ayuda a revisar los cambios en los estados de los elementos html.
  //Revisada CRP
  public inputChange(Pasos:any) {


    if (
      this.state.Pasos == 3 && this.state.PersonaElabora == '' && this.state.PersonaElabora.length > 0
    ) {
      this.setState({

        falta: true,
      })
    } else {
      this.setState({

        falta: false,
      })
    }
  }

  // funcion de mensaje exitoso
  // Revisada CRP
  private consultarMensajeFinal() {

    var msjFinal = (this.props.parametros.filter((elemento: any) => elemento.Llave === "MensajeDeExito")[0] ?? {}).Valor;    
    var linkFinal = (this.props.parametros.filter((elemento: any) => elemento.Llave === "LinkMensajeFinal")[0] ?? {}).Valor;

    this.setState({
      msjFinal: msjFinal,
      linkFinal: linkFinal
    });
  }

  //Funcion que guarda los aproabodres de area para su posterior guardado
  //por Revisar CRP
  private getAprobadoresArea(id:any, index:any) {

    const cAprobadoresArea = [...this.state.cAprobadoresArea]

    var items = this.state.AprobadoresArea.filter((x:{ID:any}) => x.ID == id);

    cAprobadoresArea[index]["AprobadoresArea"] = items[0].AprobadorId;
    cAprobadoresArea[index]["AprobadoresAreaEmail"] = items[0].AprobadorEmail;
    cAprobadoresArea[index]["AprobadoresNombreArea"] = items[0].NombreArea;
    cAprobadoresArea[index]["AprobadoresNombreAreaId"] = items[0].ID;


    this.setState({
      cAprobadoresArea
    });

  }

  // funcion para consultar FAQ de la lista
  // Revisada CRP
  private ConsultarFaq() {
    this.pnp.getListItems(
      "Faq",
      ["*"],
      "",
      ""
    ).then((items) => {
      var faqSeguridad = items.filter((x:{Clave:any}) => x.Clave == 'Seguridad');
      var faqPlantaProduccion = items.filter((x:{Clave:any}) => x.Clave == 'PlantaProduccion');
      var faqCronograma = items.filter((x:{Clave:any}) => x.Clave == 'Cronograma');
      var faqCompromiso = items.filter((x:{Clave:any}) => x.Clave == 'CompromisoDelCronograma');
      var faqAprobadores = items.filter((x:{Clave:any}) => x.Clave == 'Aprobadores');


      if (faqAprobadores.length > 0) {
        this.setState({
          faqAprobadores: faqAprobadores[0].Title
        });

      }



      if (faqSeguridad.length > 0) {
        this.setState({
          FaqSeguridad: faqSeguridad[0].Title
        });

      }
      if (faqCompromiso.length > 0) {
        this.setState({
          faqCompromiso: faqCompromiso[0].Title
        });

      }

      if (faqPlantaProduccion.length > 0) {
        this.setState({
          FaqPlantaProduccion: faqPlantaProduccion[0].Title
        });

      }

      if (faqCronograma.length > 0) {
        this.setState({
          faqCronograma: faqCronograma[0].Title
        });

      }



    })
  }

  //Funcion que consulta las plantas y devuelve un objeto con la informacion de estas.
  //Revisar lista Planta CRP
  private plantas() {
    this.pnp.getListItems(
      "Planta",
      ["*"],
      "",
      ""
    ).then((items => {
      this.setState({ Plantas: items })
    }))

  }
   
  // funcion para consulta de apropadores por area
  // Fix Aprobadores
  private consultarAprobadoresArea() {
    
    let AprobadoresArea:any = [];

    this.setState({
      AprobadoresArea: AprobadoresArea,
    });

    /*
    var ViewXml = `<FieldRef Name="Direccion"/>
                      <FieldRef Name="Area"/>
                      <FieldRef Name="AprobadorArea"/>`

    this.pnp.getListItemsWithTaxo('', 'AprobadoresPorArea',
      ViewXml).then((items) => {
      
        items.forEach((d:any) => {

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
        });

      });
      */
  }

  //Funcion que filtra los aprobadores por area
  private getAprobadoresPorArea(Direccion:any, Index:any) {
    
    var Areas = this.state.AprobadoresArea.filter((x:{NombreDireccion:any}) => x.NombreDireccion == Direccion);

    const cAprobadoresArea = [...this.state.cAprobadoresArea];

    cAprobadoresArea[Index]["AprobadoresNombreDireccion"] = Direccion;

    //
    this.setState({
      ['AreasDireccion' + Index]: Areas,
      cAprobadoresArea

    })


  }

  //Funcion para añadir mas lineas para agregar aprobadores.
  private addAprobadoresArea(arg0: string): void {

    var c = [];
    const cAprobadoresArea = [...this.state.cAprobadoresArea];
    c = cAprobadoresArea;
    var pos = {
      p: 0
    }
    c.push(pos)
    this.setState({ cAprobadoresArea: c });

  }

  //Funcion que permite añadir a un array los aprobadores del area
  private _getPeoplePickerG(items: any[], index:any) {

    const cAprobadoresArea = [...this.state.cAprobadoresArea];
    cAprobadoresArea[index]["AprobadoresArea"] = items[0].id;
    cAprobadoresArea[index]["AprobadoresAreaEmail"] = items[0].secondaryText;

    this.setState({
      cAprobadoresArea

    });


  }

  //Funcion que asigna datos desde el directorio activo usando el elemento people picker.
  //@autobind
  private getPeoplePickerDemasAprobadores(items: any[], index:any) {

    const cDemasAprobadores = [...this.state.cDemasAprobadores];

    cDemasAprobadores[index]["DemasAprobadores"] = items[0].id;
    cDemasAprobadores[index]["DemasAprobadoresEmail"] = items[0].secondaryText;

    this.setState({
      cDemasAprobadores
    });


  }

  //Funcion que asigna datos desde el directorio activo usando el elemento people picker.
  //@autobind
  private getPeoplePickerOtrosAprobadores(items: any[], index:any, rol:any) {
    const cAprobadores = [...this.state.cAprobadores];

    cAprobadores[index]["AprobadoresConRol"] = items[0].id;
    cAprobadores[index]["Cargo"] = rol;

    this.setState({
      cAprobadores
    });
  }

  private _getPeoplePicker(items: any[], objeto:any) {

    this.setState({
      [objeto]: items[0].id,
      [objeto + 'EMail']: items[0].secondaryText,
    })

  }

  //Funcion que consulta la matriz de consulta
  private ConsultarMatriz(TipoMecanismo:any) {
    
    let nivelesMecanismo = this.props.niveles.filter((x:{Tipo_x0020_Mecanismo:any}) => x.Tipo_x0020_Mecanismo.Label == TipoMecanismo);

    console.log(this.props.niveles)
    if (nivelesMecanismo.length > 0) {

        var items = nivelesMecanismo[0];

        this.setState({
          MatrizRol: items
        }, () => {
          this.consultarAprobadores(TipoMecanismo);
        })
      }

  }
  

  //Funcion que consulta los aprobadores asignados al mecanismo
  private consultarAprobadores(tipoMec:string) {
    console.log(this.state)
    if (this.state.Mecanismo) {

      this.pnp.getMatrizPermisosByTipoM(tipoMec,1).then((Apro) => {
        if (Apro.length > 0) { 
          var AprobadoresConRol:any = [];
          var auxAprobadores:any = [];
          var PersonaRevisa:any = 0;
          var PersonaRevisaEMail:any = '';                              

          
          this.pnp.getByIdUser(Apro[0].Aprobador_x0020_RevisaId).then(u => {
            PersonaRevisa = Apro[0].Aprobador_x0020_RevisaId;
            PersonaRevisaEMail = u.Email;
          })

          Apro.forEach((item:any) => {            
            Object.keys(item).forEach(([campo, valor]:any) => {
              let emailPaso;

                this.pnp.getByIdUser(valor).then(userP => {                 
                  emailPaso = userP.Email;
                })

              
              if(valor) {                
                auxAprobadores.push({
                  rol: campo,
                  claveRol: campo,                  
                  user: emailPaso,
                  idUser: valor, 
                });
              }

              if(campo=="Aprobador_x0020_RevisaId")
              {
                AprobadoresConRol.push({ 
                  AprobadoresCargo: valor, 
                  AprobadoresCargoID: valor, 
                  Cargo: campo,
                  AprobadoresConRolEmail: emailPaso
                })
              }


            });
          });
                                    

          this.setState({
            cAprobadores: AprobadoresConRol,
            PersonasAprobadoras: auxAprobadores,
            PersonaRevisaEMail: PersonaRevisaEMail,
            PersonaRevisa: PersonaRevisa

          },() => {console.log(this.state)})

        }

      })
    }

  }
  
  //Funcion que elimina linea de array de aprobadores
  private elimindarAprobadores(index:any, NombreArray:any) {

    const cAprobadoresArea = this.state[NombreArray];

    cAprobadoresArea.splice(index, 1);

    this.setState({
      [NombreArray]: []

    }, () => {
      this.setState({
        [NombreArray]: cAprobadoresArea

      })
    })

  }

  //Funcion que consulta el mecanismo dependiendo el id que se le pasa.
  private consultarMecanismo() {

    this.pnp.consultarMecanismosById(this.props.match.params.IdMecanismo).then(res => {

      if (res.length > 0) {
        
        var item = res[0];      

        this.setState({
          Mecanismo: res,
          NombreMecanismo: item.Nombre_x0020_Mecanismo_x0020_Loc,
          NombreModelo: item.Nombre_x0020_Modelo,
          NombreArea: item.Area,
          NombreDireccion: item.Direccion,
          TipoMecanismo: item.Tipo_x0020_de_x0020_mecanismo,
          SeccionMecanismo: item.Mecanismo_x0020_del_x0020_Driver.Label,
          PersonaElabora: item.Persona_x0020_ElaboraId,
          PersonaRevisa: item.Persona_x0020_RevisaId,
          PersonaAprueba: item.Persona_x0020_ApruebaId,
          disabled: true,
          seguridad: item.Seguridad.Label,
          plantas: item.Planta,
          plantasAplica: [],
          AplicaPlanta: (item.Planta ? true : false),


        }, () => {
          this.CargaInicial();
          this.ObtenerArchivos(item.Nombre_x0020_Mecanismo_x0020_Loc,item.Nombre_x0020_Modelo,item.Seguridad.Label);
          this.ConsultarMatriz(item.Nombre_x0020_Mecanismo_x0020_Loc);
          //this.consultarMatrizAprobacion();
        })

        if (item.Seguridad == "Confidencial") {
          var i = 0
          var ArrayAuxSeguridad:any = []
          item.PersonaSeguridadId.forEach((val:any, index:any) => {

            this.pnp.getByIdUser(val)
              .then((user) => {
                ArrayAuxSeguridad.push(user.Email)
                var leng = item.PersonaSeguridadId.length - 1

                if (leng == i) {

                  this.setState({
                    correosSeguridad: []
                  }, () => {
                    this.setState({
                      correosSeguridad: ArrayAuxSeguridad, StatePrueba: ArrayAuxSeguridad.join(';')
                    })

                  })



                }
                i++




              })
          })
        }
      }
    })

  }

  //Funcion que guarda los documentos de en la biblioteca segun el modelo.
  private GuardarDocumentos() {
    this.setState({
      mecanismo: this.state.NombreMecanismo,
    })


    this.setState(
      {
        loading: true,
      },
      () => {
        this.pnp.createdFolder(
          this.state.NombreMecanismo,
          'Biblioteca Colabora/Carpeta Revision',
        ).then((res) => {
          this.state.Archivos.forEach((items:any) => {
            let enfile: File = items
            this.pnp.uploadFileFolder(
              enfile.name,
              enfile,
              this.state.NombreMecanismo,
              'Biblioteca Colabora/Carpeta Revision',
            ).then((res) => console.log)
          })

          this.pnp.createdDocumentSet(
            "Biblioteca Colabora",
            "Carpeta Revision",
            this.state.NombreMecanismo
          )


        })
      },
    )
  }

  // Funcion para consultar los archivos del mecanismo
  public ObtenerArchivos(NombreMecanismo:any,NombreModelo:any, seguridad?:any) {
    
   let documentos:any = [];
    this.pnp.getFiles('/' + this.props.NombreSubsitio + '/Publicado/' + seguridad + '/' +  NombreModelo + '/' + NombreMecanismo).then((res) => (
      res.map((doc:any) => {
        documentos.push({
          name: doc.Name,
          check: false,
          file: doc
        })
      })

    ))
    this.setState({
      documentosMecanismo: documentos,
    })
  }

  private addDemasAprobadores(arg0: string): void {
    var c = [];

    const cDemasAprobadores = [...this.state.cDemasAprobadores]
    c = cDemasAprobadores;

    var pos = {
      p: 0
    }

    c.push(pos);
    this.setState({ cDemasAprobadores: c });
  }

  private ActualizarPlanAccion() {
    this.setState(
      {
        loading: true,
      },
      () => {

        this.pnp.createdFolder(
          this.state.NombreMecanismo,
          'Biblioteca Colabora/Carpeta Revision',
        ).then((res) => {
          this.state.Archivos.forEach((items:any) => {
            let enfile: File = items
            this.pnp.uploadFileFolder(
              enfile.name,
              enfile,
              this.state.NombreMecanismo,
              'Biblioteca Colabora/Carpeta Revision',
            ).then((res) => console.log)
          })

          this.pnp.createdDocumentSet(
            "Biblioteca Colabora",
            "Carpeta Revision",
            this.state.NombreMecanismo
          )
          this.GuardarDocumentos()

        }
        )
      },
    )

    this.setState({

      loading: true

    }, () => {

      this.state.DocumentosAExtender.forEach((items:any, i:any) => {
        if (items.file) {

          let enfile: File = items.file;

          var data = { Accion: 'Extender vigencia' };

          this.pnp.updateFileFolder(
            items.file.Name,
            enfile,
            this.state.NombreMecanismo,
            "Biblioteca Colabora/Carpeta Revision",
            data
          ).then(res => console.log(res));

          if (this.state.DocumentosAExtender.length - 1 == i) {
            this.updateMotivos("Extender")
          }

        }
        else {
          let enfile: File = items.file;

          var data = { Accion: 'Extender vigencia' };

          this.pnp.updateFileFolder(
            items.Name,
            enfile,
            this.state.NombreMecanismo,
            "Biblioteca Colabora/Carpeta Revision",
            data
          ).then(res => console.log(res));

          if (this.state.DocumentosAExtender.length - 1 == i) {
            this.updateMotivos("Extender")
          }
        }
      })
    })

  }

  // Funcion que selecciona el documento de la extencion de vigencia
  public setCheck(check: boolean, doc: any) {

    let documentos = this.state.documentosMecanismo;

    documentos.forEach((item:any, index:any) => {
      if (item.name == doc.name) {
        item.check = !check;
      }
    });

    if (!check) {
      this.Documentos.push(doc.file);
    } else {
      let index = this.Documentos.findIndex((x:{name:any}) => x.name === doc.name);
      this.Documentos.splice(index, 1);
    }

    this.setState({
      documentosMecanismo: documentos,
      DocumentosAExtender: this.Documentos
    });
  }

  //funcion que agrega a un array los datos de los archivos a actualizar.
  public ExtenderVigencias(target:any, index:any) {

    let DocumentosAExtender = this.state.DocumentosAExtender;
    let indexAux = DocumentosAExtender.findIndex((x:{pos:any}) => x.pos === index);

    if (indexAux > -1) {
      DocumentosAExtender.splice(indexAux, 1);

    } else {
      var extender = {
        Accion: "Extender vigencia",
        file: this.state.documentosMecanismo[index],
        pos: index
      }
      DocumentosAExtender.push(extender);
    }

    this.setState({
      DocumentosAExtender: DocumentosAExtender
    });
  }

//Funcion que convierte eb mayuscula la primera letra del nombre del filial
  private convertirPrimeraLetra() {    
  }

  //Funcion para cerrar modales
  private closeModal() {
    this.setState({ Cancelar: false });
  }
  
  //Funcion para dirgir al home sin recarga la pagina
  private redirect() {
    this.setState({ Pasos: 'Datos del Mecanismo' });
    this.props.history.push('/');
  }
  

  public componentWillMount(): void {

    this.consultarAprobadoresArea();

    this.pnp.getCurrentUser().then((user) => {
      this.setState({
        Usuario: user.Id,
        UserName: user.Title,
      })
    })



    this.ConsultarFaq();
    this.plantas();
    this.consultarMensajeFinal();


    if (this.props.match.params.IdMecanismo) {
      this.consultarMecanismo();
    } else {
      this.CargaInicial();
    }

    this.ConsultaReqAuditoria(this.props.match.params.IdMecanismo)

  }
//Funcion que carga las consultas iniciales  para el funcionamiento del formualario
  public CargaInicial() {
    
    this.convertirPrimeraLetra();
    this.consultarMotivos();
    this.consultarMatrizAprobacion();

  }

//Funcion que actualiza los campos de motivos enlas diferentes listas
  private updateMotivos(tiposolicitud:any) {

    let obj = {
      Motivo: this.state.Motivo,
      DescripcionMotivo: this.state.DescripcionMotivo,
      ElaboraId: this.state.PersonaElabora,
      TipoSolicitud: tiposolicitud

    }

    this.pnp.updateById(
      "Mecanismos Local",
      parseInt(this.props.match.params.IdMecanismo),
      obj
    ).then(res => {
      this.ActualizarAprobadores();
    })
  }
//Funcion que consulta si un mecanismo requiere auditoria
  private ConsultaReqAuditoria(IDMecanismo:any) {
    this.pnp.getListItems("Mecanismos Local",
      ["Requiere_x0020_Auditoria", 'ID_x0020_Driver_x0020_Local/Id', "ID"],
      'ID eq ' + IDMecanismo,
      'ID_x0020_Driver_x0020_Local',
    )
      .then((estado) => {
        if (estado.length > 0) {
          this.setState({ Auditoria: estado[0].Requiere_x0020_Auditoria })
        }
      })

  }

  //Funcion que guarda el registro de los aprobadores asignados al mecanismo
  private ActualizarAprobadores() {

    this.AproRoles = true;
    this.AproArea = true;
    this.Apro = true;

    this.state.cAprobadores.forEach((item:any, i:any) => {

      var id = parseInt(item.AprobadoresCargoID);

      let obj = {
        Title: 'Rol',
        AprobadorId: item.AprobadoresConRol,
        Cargo: item.Cargo
      }

      if (id > 0) {
        this.pnp.updateById(
          "Aprobadores",
          id,
          obj
        ).then(items => {
          if (this.state.cAprobadores.length - 1 == i) {
            this.AproRoles = true
            this.finishSave();
          }
        })

      } else {
        this.pnp.insertItem(
          "Aprobadores",
          obj
        ).then(items => {
          if (this.state.cAprobadores.length - 1 == i) {
            this.AproRoles = true
            this.finishSave();
          }

        })

      }


    })

    this.state.cAprobadoresArea.forEach((item:any, j:any) => {

      var id = parseInt(item.AprobadoresAreaID);

      let obj1 = {
        Title: 'Area',
        AprobadorId: item.AprobadoresArea,
        Cargo: item.Area
      }

      if (id) {

        this.pnp.updateById(
          "Aprobadores",
          id,
          obj1
        ).then(items => {

          if (this.state.cAprobadoresArea.length - 1 == j) {
            console.log("Registro con usuario de area " + item.AprobadoresArea)
            this.AproArea = true
            this.finishSave()
          }

        })

      } else {

        this.pnp.insertItem(
          "Aprobadores",
          obj1
        ).then(items => {

          if (this.state.cAprobadoresArea.length - 1 == j) {
            console.log("Registro con usuario de area " + item.AprobadoresArea);
            this.AproArea = true
            this.finishSave();
          }

        })

      }

    })

    this.state.cDemasAprobadores.forEach((item:any, k:any) => {

      var id = parseInt(item.DemasAprobadoresID);

      let obj2 = {
        Title: 'Otros',
        AprobadorId: item.DemasAprobadores
      }

      if (id) {

        this.pnp.updateById(
          "Aprobadores",
          id,
          obj2
        ).then(items => {

          if (this.state.cDemasAprobadores.length - 1 == k) {
            console.log("Registro con usuario de area " + item.AprobadoresArea)
            this.Apro = true
            this.finishSave()
          }
        })

      } else {

        this.pnp.insertItem(
          "Aprobadores",
          obj2
        ).then(items => {

          if (this.state.cDemasAprobadores.length - 1 == k) {
            console.log("Registro con usuario de area " + item.AprobadoresArea)
            this.Apro = true
            this.finishSave()
          }
        })

      }



    })

    if (this.state.cAprobadores.length <= 0 && this.state.cAprobadoresArea <= 0 && this.state.cDemasAprobadores.length <= 0) {
      this.finishSave();
    }
  }
  
  //Funcion que identifica si ya se termino un proceso
  public finishSave() {
    this.setState({
      Pasos: 5,
      enviado: true,
      loading: false
    })
  }

  //Funcion que consulta los motivos de la lista parametrosGenerales y devuelve un objeto con esta informacion.
  //Arreglar lista de motivos
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

  //Funcion que consulta los motivos de la lista parametrosGenerales y devuelve un objeto con esta informacion.
  //falta matriz de aprobacion
  private consultarMatrizAprobacion() {
   /* this.pnp.getListItems(
      "ParametrosGenerales",
      ["*"],
      "Clave eq 'MatrizAprobacion' and Activo eq 1",
      ""
    ).then(res => (
      this.setState({
        MatrizAprobacion: res
      }, () => {
        this.ObtenerArchivos(this.state.NombreMecanismo, this.state.seguridad),
          this.ConsultarMatriz(this.state.TipoMecanismo)
      })
    ))*/
  }

  private longitudcadena(cantidad:any) {
    const result = cantidad.length;
    this.setState({
      CantidadCaracteres: result
    });

    console.log(result);
  }

  public render(): React.ReactElement<IExtenderVigenciaProps> {
    return (
      <>
        {
          this.props.userDetail.gestor ?
            <div>

              {this.state.Cancelar ?
                <div className="modal-container overflow-auto">
                  <div className="modal-window" id="crearContenido">


                    <div>
                      <div id="EncabezadoModal">
                        <h3 id="tituloCancelar">
                          ¿Estas seguro que deseas cancelar la solictud?
                        </h3>
                        <br />

                        <div className="row">
                          <div className="col">
                            <Link to="/">
                              <input
                                type="button"
                                id="bton"
                                value="Si"
                                className="btn btn-danger"
                                onClick={() => (this.redirect())}

                              />
                            </Link>
                          </div>
                          <div className="col">
                            <input
                              type="button"

                              value="No"
                              className="btn btn-primary"
                              onClick={() => (this.closeModal())}

                            />

                          </div>

                        </div>

                      </div>
                    </div>

                  </div>

                </div>
                : null}


              <div>
                <div className="toolbar py-5 py-lg-7" id="kt_toolbar">
                  <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
                    <div className="page-title d-flex flex-column me-3">
                      <h1 className="d-flex text-dark fw-bolder my-1 fs-2">Extender Vigencia</h1>
                      <ul className="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-7 my-1">
                        <li className="breadcrumb-item text-gray-600">
                          <a href="index.html" className="text-gray-600 text-hover-primary">Inicio</a>
                        </li>
                        <li className="breadcrumb-item text-gray-600">Formulario de Solicitud</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/*Body*/}
                <div id="kt_content_container" className="d-flex flex-column-fluid align-items-start container-xxl">
                  <div className="content flex-row-fluid" id="kt_content">

                    <div className="stepper stepper-pills first" id="kt_stepper_example_clickable" data-kt-stepper="true">
                      <div className="separator mt-4 mb-4"></div>

                      {
                        this.state.Pasos !== 5 ?
                          <div className="stepper-nav flex-center flex-wrap mb-10">
                            <div className={this.state.Pasos == 1 ? "stepper-item mx-2 my-4  current" : "stepper-item mx-2 my-4 pending"} >
                              <div className="stepper-line w-40px"></div>
                              <div className="stepper-icon w-40px h-40px">
                                <i className="stepper-check fas fa-check"></i>
                                <span className="stepper-number">1</span>
                              </div>
                              <div className="stepper-label">
                                <h3 className="stepper-title"> Datos Del Mecanismo </h3>
                              </div>
                            </div>
                            <div className={this.state.Pasos == 2 ? "stepper-item mx-2 my-4  current"
                              : "stepper-item mx-2 my-4 pending"}  >
                              <div className="stepper-line w-40px"></div>
                              <div className="stepper-icon w-40px h-40px">
                                <i className="stepper-check fas fa-check"></i>
                                <span className="stepper-number">2</span>
                              </div>
                              <div className="stepper-label">
                                <h3 className="stepper-title"> Documentos Del Mecanismo </h3>
                              </div>
                            </div>
                            <div className={this.state.Pasos == 3 ? "stepper-item mx-2 my-4  current"
                              : "stepper-item mx-2 my-4 pending"}  >
                              <div className="stepper-line w-40px"></div>
                              <div className="stepper-icon w-40px h-40px">
                                <i className="stepper-check fas fa-check"></i>
                                <span className="stepper-number">3</span>
                              </div>
                              <div className="stepper-label">
                                <h3 className="stepper-title"> Aprobadores </h3>
                              </div>
                            </div>
                            <div className={this.state.Pasos == 4 ? "stepper-item mx-2 my-4  current"
                              : "stepper-item mx-2 my-4 pending"}  >
                              <div className="stepper-line w-40px"></div>
                              <div className="stepper-icon w-40px h-40px">
                                <i className="stepper-check fas fa-check"></i>
                                <span className="stepper-number">4</span>
                              </div>
                              <div className="stepper-label">
                                <h3 className="stepper-title"> Control de Cambios </h3>
                              </div>
                            </div>
                            <div className={this.state.Pasos == 5 ? " mx-2 my-4  current"
                              : " mx-2 my-4 pending"}  >
                            </div>
                          </div>

                          : null
                      }

                      <div className="card">
                        <div className="card-body">
                          <div className="stepper stepper-pills first" id="kt_stepper_example_clickable" data-kt-stepper="true">

                            <form className="form mx-auto" id="kt_stepper_example_basic_form">
                              <div className="mb-5">
                                {/* Pantalla 1 del formulario */}
                                {this.state.Pasos == 1 ?
                                  <div className="flex-column current style-datmec">
                                    <div className="row mb-5">
                                      <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                        <h3 className="text-primary">Datos del Mecanismo</h3>
                                      </div>
                                      <div className="row mb-5 contenform">
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label">Pas</label>
                                          <input type="text" className="form-control" name="input2" placeholder="." disabled
                                            value={this.props.userDetail.pais} />
                                        </div>                                                                                                                   

                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label">Pilar</label>
                                          {
                                            this.state.Mecanismo && this.state.Mecanismo.length > 0 ?
                                              this.state.Mecanismo.map((e:any) => (
                                                <input type="text" placeholder='.' className="form-control" name="input2" disabled value={e.Nombre_x0020_Pilar} />

                                              ))
                                              : null
                                          }

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label">Driver</label>
                                          {
                                            this.state.Mecanismo && this.state.Mecanismo.length > 0 ?
                                              this.state.Mecanismo.map((e:any) => (
                                                <input placeholder='.' type="text" className="form-control" name="input2" disabled
                                                  value={e.Nombre_x0020_Driver} />

                                              ))
                                              : null
                                          }

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label">Nombre del Mecanismo</label>
                                          {
                                            this.state.Mecanismo && this.state.Mecanismo.length > 0 ?
                                              this.state.Mecanismo.map((e:any) => (

                                                <input type="text" className="form-control" name="input2" disabled value={e.Nombre_x0020_Mecanismo_x0020_Loc}
                                                  onFocus={(i) => this.ObtenerArchivos(i.target.value,e.Nombre_x0020_Modelo)} />

                                              ))
                                              : null
                                          }

                                        </div>
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-label">Tipo de Mecanismo</label>
                                          {
                                            this.state.Mecanismo && this.state.Mecanismo.length > 0 ?
                                              this.state.Mecanismo.map((e:any) => (
                                                <input placeholder='.' type="text" className="form-control" name="input2" disabled
                                                  value={e.Tipo_x0020_de_x0020_mecanismo.Label} />

                                              ))
                                              : null
                                          }

                                        </div>
                                      </div>

                                      <div className="row mb-5 contenform">

                                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                                          <div className="d-flex">
                                            <span className="form-check">

                                              <input
                                                disabled
                                                className="form-check-input"
                                                type="radio"
                                                checked={this.state.SeccionMecanismo == "Mecanismos del driver"}
                                                name="mecanismo"
                                                value="Mecanismo del Driver" placeholder='.'

                                                onChange={(e) => { this.setState({ descripcionMecanismo: e.target.value }) }} />

                                            </span>
                                            <label className="form-check-label pe-10 fs-5" htmlFor="flexRadioDefault">
                                              Mecanismo del Driver
                                            </label>
                                            <span className="form-check">

                                              <input
                                              placeholder='.'
                                                disabled
                                                className="form-check-input"
                                                type="radio" name="mecanismo"
                                                value="Otro Mecanismo Operacional"
                                                checked={this.state.SeccionMecanismo == "Otros mecanismos Operacionales"}
                                                onChange={(e) => { this.setState({ descripcionMecanismo: e.target.value }) }} />


                                            </span>
                                            <label className="form-check-label pe-10 fs-5" htmlFor="flexRadioDefault">
                                              Otro Mecanismo Operacional
                                            </label>
                                          </div>
                                        </div>

                                      </div>
                                      <div className="row mb-5 contenform">
                                        <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                          <label className="form-check form-switch form-check-custom">
                                            <span className="form-label" id="labelSeguridad">Seguridad</span>
                                            <span className="FAQ">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
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
                                              <input
                                                placeholder='.'
                                                disabled
                                                className="form-check-input"
                                                type="radio"
                                                name="seguridad"
                                                value="Publico"
                                                checked={this.state.seguridad === "Publico"}
                                                onChange={(e) => { this.setState({ seguridad: e.target.value }) }} />
                                            </span>
                                            <label className="form-check-label pe-10" htmlFor="flexRadioDefault">
                                              Pblico
                                            </label>
                                            <span className="form-check">
                                              <input
                                                placeholder='.'
                                                disabled
                                                className="form-check-input"
                                                type="radio"
                                                name="seguridad"
                                                value="Privado"
                                                checked={this.state.seguridad === "Privado"}
                                                onChange={(e) => { this.setState({ seguridad: e.target.value }) }} />
                                            </span>
                                            <label className="form-check-label pe-10" htmlFor="flexRadioDefault">
                                              Privado
                                            </label>
                                            <span className="form-check">
                                              <input
                                                placeholder='.'
                                                className="form-check-input"
                                                disabled
                                                type="radio"
                                                name="seguridad"
                                                value="Confidencial"
                                                checked={this.state.seguridad === "Confidencial"}
                                                onChange={(e) => { this.setState({ seguridad: e.target.value }) }} />
                                            </span>
                                            <label className="form-check-label pe-10" htmlFor="flexRadioDefault">
                                              Confidencial
                                            </label>
                                          </div>
                                        </div>

                                        {this.state.seguridad == "Confidencial" ?
                                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom">
                                            <label className="form-label  required">Asignado a:</label>
                                            <PeoplePicker
                                              context={this.props.webPartContext}
                                              titleText=""
                                              personSelectionLimit={1}
                                              groupName={""}
                                              showtooltip={true}
                                              required={true}
                                              disabled
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

                                      <div className="row mb-5 contenform">

                                        <div className="mt-4">
                                          <label className="form-check form-switch form-check-custom">

                                            <input
                                              disabled
                                              className="form-check-input"
                                              type="checkbox"
                                              value="1"
                                              checked={this.state.Auditoria}
                                              onChange={(e) => {
                                                this.setState({
                                                  Auditoria: this.state.Auditoria,
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
                                              disabled

                                              className="form-check-input"
                                              type="checkbox"
                                              checked={this.state.plantas}
                                              value="2"
                                              onChange={(e) => { this.setState({ AplicaPlanta: !this.state.AplicaPlanta }) }} />

                                            <span className="form-check-label mx-15">
                                              Aplica a planta de produccin
                                            </span>



                                            <span className="FAQ">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                              </svg>

                                              <span className="modalFAQ">
                                                {this.state.FaqPlantaProduccion}
                                              </span>
                                            </span>
                                          </label>


                                        </div>
                                        {this.state.AplicaPlanta == true ?
                                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6">
                                            <label className="form-label">Plantas</label>

                                            <table>
                                              {this.state.plantasAplica && this.state.plantasAplica.map((p:any, i:any) => (
                                                <tr>
                                                  <td>- {p}</td>

                                                </tr>
                                              ))}
                                            </table>

                                          </div>
                                          : null}

                                      </div>
                                    </div>
                                  </div>
                                  : null}
                                {/* Pantalla 2 del formulario */}
                                {this.state.Pasos == 2 ?
                                  <div className="flex-column current">
                                    <div className="row mb-5">
                                      <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                        <h3 className="text-primary">Documentos del Mecanismo</h3>
                                      </div>
                                    </div>
                                    <span className='Span1'>Seleccione los documentos para los cuales desea <strong>extender la vigencia:</strong></span>
                                    <table className="table table-borderless" id="extenderVigencia">

                                      {
                                        this.state.documentosMecanismo.map((e:any, index:any) => (
                                          <tr>
                                            <td id="celdaIcono"><img title='.' src={this.pnp.getImageFile(e.name)} className="typeDoc" /></td>
                                            <td id="celdaNombre">
                                              <p>{e.name}</p>
                                            </td>
                                            <td>
                                              <SelectDocument
                                                check={e.check}
                                                doc={e}
                                                setCheck={(check: boolean, doc: any) => this.setCheck(check, doc)}
                                              />
                                            </td>
                                          </tr>

                                        ))
                                      }

                                    </table>


                                    <div className="row mt-5">
                                      <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                        <div className="alert alert-warning d-flex align-items-center p-5">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                            className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                            <path
                                              d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                                            <path
                                              d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                                          </svg>
                                          <span className="svg-icon svg-icon-2hx svg-icon-warning me-4">
                                            <i className="fa fa-exclamation-triangle fs-4 text-warning"></i>
                                          </span>
                                          <div className="d-flex flex-column">
                                            <span>Con esta solicitud usted va extender la vigencia de los documentos seleccionados por
                                              <strong>  5 años </strong> ms, asegurando que el documento actual est vigente y
                                              corresponde a la forma de operar actual del rea.</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  : null}
                                {/* Pantalla 3 del formulario */}
                                {this.state.Pasos == 3 ?
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
                                          context={this.props.webPartContext}
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
                                          context={this.props.webPartContext}
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
                                                <label>Direccin {index + 1} </label>
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
                                                  <label>Area {index + 1} </label>
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
                                                  context={this.props.webPartContext}
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
                                              context={this.props.webPartContext}
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
                                                  context={this.props.webPartContext}
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
                                  : null}
                                {/* Pantalla 4 del formulario */}
                                {this.state.Pasos == 4 ?
                                  <div className="flex-column current">
                                    <div className="row mb-5">
                                      <div>

                                        <div className="row">
                                          <div className="card-title flex-column header-title-stepper rounded-top p-4 mb-5">
                                            <h3 className="text-primary">Control de Cambios</h3>
                                          </div>
                                        </div>

                                        <div className="row">

                                          <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                                            <label className="form-label required">Motivo</label>

                                            <select
                                              onChange={(e) => { (this.setState({ Motivo: e.target.value })) }}
                                              className="form-select select2-hidden-accessible"
                                              value={this.state.Motivo}
                                              data-control="select2"
                                              data-placeholder="Select an option"
                                              data-select2-id="select2-data-34-x4p4"
                                              aria-hidden="true">
                                              <option data-select2-id="select2-data-36-v336" value="">Seleccionar..</option>
                                              {
                                                this.state.Motivos.map((e:any) => (
                                                  <option>{e.Title}</option>
                                                ))
                                              }


                                            </select>
                                          </div>

                                          {
                                            this.props.match.params.opcion == 2 ? null :


                                              <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12 marginBottom">
                                                <label className="form-label required">Descripcin:</label>


                                                <textarea maxLength={300} value={this.state.DescripcionMotivo} onChange={(e) => { (this.longitudcadena(e.target.value), this.setState({ DescripcionMotivo: e.target.value })) }} className="form-control" name="input2" placeholder="Ingrese la Descripcin"></textarea>
                                              </div>
                                          }
                                          <p id="Contadordesextend">{this.state.CantidadCaracteres}/300</p>
                                          <br />

                                        </div>

                                        <div className="row mb-5">

                                          <div className="col-lg-6 col-md-6 col-xl-6 col-xxl-6 marginBottom mt-5">

                                            <label className="form-check form-switch form-check-custom">
                                              {
                                                this.state.CompromisoDelPrograma == false ?
                                                  <input className="form-check-input" type="checkbox" value={this.state.CompromisoDelPrograma} onChange={(e) => { this.setState({ CompromisoDelPrograma: true }) }} />
                                                  :
                                                  <input className="form-check-input" type="checkbox" value={this.state.CompromisoDelPrograma} onChange={(e) => { this.setState({ CompromisoDelPrograma: false }) }} />
                                              }

                                              <span className="form-check-label mx-15">Compromiso del Cronograma </span>

                                              <span className="FAQ">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
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


                                    </div>

                                  </div>
                                  : null}
                                <div>
                                  {/* Pantalla 5 del formulario */}
                                  {this.state.Pasos == 5 ?
                                    <div className="flex-column centerContent current" >
                                      <div className="row mb-5">
                                        <div className="card-title flex-column p-4 mb-5">
                                          <h2 className="text-primary fs-1">
                                            Solicitud enviada con xito.
                                          </h2>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-xl-12 col-xxl-12">
                                          <figure>
                                            <img title='.' src={this.props.urlSitioPrincipal + "/ActivosGC/Root/Quala_Logo_GC.png"} width="35%" height="auto" />
                                          </figure>
                                        </div>
                                        <h3 className="text-gray-600 fs-5">
                                          Puedes consultar el estado de tu solicitud en  <a href={this.state.linkFinal} target="_blank">est pgina</a>
                                        </h3>

                                        <small className="text-gray-600 fs-5">
                                          {this.state.msjFinal}

                                        </small>


                                      </div>
                                    </div>
                                    : null}
                                </div>
                              </div>
                            </form>
                            <div className="d-flex flex-stack">
                              {/* Boton Volver */}
                              <div className="me-2">
                                {this.state.Pasos > 1 && this.state.Pasos <= 4 ?
                                  <button
                                    type="button"
                                    onClick={() => this.setState({ Pasos: this.state.Pasos - 1 })}
                                    className="btn-regresar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      className="bi bi-chevron-left" viewBox="0 0 16 16">
                                      <path fill-rule="evenodd"
                                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                    </svg>
                                    Regresar
                                  </button>
                                  : null}
                              </div>
                              {/* Boton Cancelar */}
                              <div>
                                {this.state.Pasos > 0 && this.state.Pasos <= 4 ?
                                  <button
                                    type="button"
                                    onClick={() => this.setState({ Cancelar: true })}
                                    className="btn btn-cancelar"
                                  >
                                    Cancelar
                                  </button>
                                  : null}

                                {/* Boton Continuar */}
                                {this.state.Pasos !== 2 && this.state.Pasos < 4 || (this.state.Pasos == 2 && this.state.DocumentosAExtender && this.state.DocumentosAExtender.length > 0) ?
                                  <button
                                    type="button"
                                    onClick={() => this.setState({ Pasos: this.state.Pasos + 1 }, () => this.inputChange(this.state.Pasos))}
                                    className="btn btn-primary">
                                    Continuar
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      className="bi bi-chevron-right" viewBox="0 0 16 16">
                                      <path fill-rule="evenodd"
                                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                  </button>
                                  : null}
                                {/* Boton Enviar */}
                                {this.state.Pasos == 4 && this.state.Motivo.length > 0 && this.state.CantidadCaracteres > 0 ?


                                  <button type="button" className="btn btn-primary" onClick={() => { this.ActualizarPlanAccion(), this.GuardarDocumentos() }}   >
                                    <span className="indicator-label"> Enviar </span>
                                    <span className="indicator-progress">
                                      Please wait...
                                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                    </span>
                                  </button>
                                  : null}

                              </div>
                              {/* comentario de Prueba para sincronizacin */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                {this.state.loading ?
                  <div className="contentModal">

                    <div className="modalLoading">
                      Trabajando en ello...
                    </div>

                  </div>
                  : null}

              </div>


            </div>

            : null
        }

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

export default connect(mapStateToProps)(withRouter(ExtenderVigencia))
