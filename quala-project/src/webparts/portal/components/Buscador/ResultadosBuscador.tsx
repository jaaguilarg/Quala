import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PNP } from '../Util/util';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import FilterProcesos from './FilterProceso';
import FilterTodos from './FilterTodos';
import 'animate.css';
import LoaderComponent from '../Views/LoaderComponent';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import ModelMecanismo from '../Views/ModelMecanismo';
import ModelComentar from '../Views/ModelComentar';
import ExtenderVigencia from '../Formulario/ExtenderVigencia';
import CrearContenido from '../Formulario/CrearContenido';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';



const slice: any = require('lodash/slice');

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '##EEF2F3' : '#EEF2F3',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '5px'
}));

interface IChecksInicial {
    [key: string]: boolean;
}

export interface IResultadosBuscadorProps {
    location: any;
    match:any;
    webPartContext: any;
    userId: any;
    urlSite: any;
    urlPrimerSitio: any;
    paisActual: any;
    Gestor: any;
    Apros: any;
    show: boolean;
    IsSiteAdmin: any;
    Sigla: string;
    paises: [];
    parametros: {ID: any; Llave: string; Valor: string; Descripcion: string; } [];
    Direcciones: any;
    Areas: any;
    SubAreas: any;
    terms: [];
}

class ResultadosBuscador extends React.Component<IResultadosBuscadorProps, any> {

    //#region Lista de variables
    public pnp: PNP;
    public urlSite: '';
    public iconPath: any;    
    public todos: any[] = [];
    public procesos: any[] = [];
    public plantas: any[] = [];


    public filtroItem: string[] = [];
    public filtroPais: string[] = [];
    public filtroDireccion: string[] = [];
    public filtroArea: string[] = [];
    public filtroSubArea: string[] = [];
    public filtroTipoMecanismo: string[] = [];
    public filtroCategoria: string[] = [];
    public filtroPlanta: string[] = [];
    public filtroProceso: string[] = [];

    public queryPais: string = '';
    public queryDireccion: string = '';
    public queryArea: string = '';
    public querySubArea: string = '';
    public queryTipoMecanismo: string = '';
    public queryCategoria: string = '';
    public queryPlanta: string = '';
    public queryProceso: string = '';

    public filtros: string[] = [];
    public filterPlantas: string[] = [];

    public mapeoCampos = [
        { jsonParam: "Direccion", todosTitle: "Dirección" },
        { jsonParam: "Area", todosTitle: "Área" },
        { jsonParam: "Subarea", todosTitle: "Subárea" },
        { jsonParam: "Tipomecanismo", todosTitle: "Tipo de mecanismo" },
        { jsonParam: "Planta", todosTitle: "Planta" },
        { jsonParam: "Proceso", todosTitle: "Proceso" },
        { jsonParam: "Categoria", todosTitle: "Categoría" },]
       
    //#endregion


    constructor(props: any) {
        super(props);
        this.pnp = new PNP(this.props.webPartContext);  
        
        this.TablaModelo = this.TablaModelo.bind(this);
        this.SetEstadoTablaModelo = this.SetEstadoTablaModelo.bind(this);
        this.closeModalMecan = this.closeModalMecan.bind(this); 
        this.procesarBusquedasSecuenciales = this.procesarBusquedasSecuenciales.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputPress = this.onInputPress.bind(this);
        this.getDataFiltered = this.getDataFiltered.bind(this);       

        const checksInicialPaises:IChecksInicial = {};
               
        this.props.paises.forEach((pais:any) => {
           if(this.props.Sigla == pais.Sigla)
           {
            checksInicialPaises[pais.Sigla] = true;
           }else{
            checksInicialPaises[pais.Sigla] = false;
           }
        });

        this.state = {
            filters: [],
            checkSeguridad: false,
            checkPaises:checksInicialPaises,
            nivelCarpeta: 'Publico',
            search: '',
            totalRow: 0,
            expanded: false,
            urlSite: '',
            urlSubSite: '',
            paisActual: '',
            showTab: true,
            count: false,
            clean: false,
            loading: false,
            IsApros: false,
            Plantas: [],
            Refiners: [],
            searchData: [],
            filterSearchData:[],
            todosGrupo: [],          
            procesosGrupo: [],            
            partialSearchingResults: [],
            NombreMecanismo: '',
            pagedItems: [],
            pageSize: 10,
            currentPage: 1,
            selectPaises: [],
            isLoading: true,
            showModal: false,
            showModalDocument: false,
            showModalExtender: false,
            showModalCrear: false,
            idMecanismo: null,
            estadoTablaModelo: false,
            pilaresProps: {
                direccion: "",
                IdVisor: "",
                Modelo: "",
                NumeroPilar: "",
                NombreMecanismo: "",
                Seguridad: "",
                Acceso: "",
                Modal: true,                                
              },
            CommentProps: {
                idMecanismo: "",
                nombreMecanismo: "",
                idDocumento: "",
                nombreDocumento: "",
                Direccion: "",
                Area: "",
                Subarea: "",
            },
            ExtenderProps: { mecanismoId: ""},
            CrearProps:{
                Acceso: "",
                opcion: "",
                IdMecanismo: ""
            },
              sitioLibrary: this.props.urlSite == this.props.urlPrimerSitio ? this.props.urlSite + "/" + this.props.Sigla + "/" : this.props.urlPrimerSitio + "/",
              sitioLocal: this.props.urlSite == this.props.urlPrimerSitio ? this.props.urlSite + "/" + this.props.Sigla : this.props.urlPrimerSitio 

        }

        this.toggleExpanded = this.toggleExpanded.bind(this);
    }
          
    toggleExpanded() {
        this.setState((prevState:any) => ({ expanded: !prevState.expanded }));
    }
    
    public TablaModelo()
    {
        this.setState({estadoTablaModelo: true});
    }

    public SetEstadoTablaModelo()
    {
        this.setState({estadoTablaModelo: !this.state.estadoTablaModelo});
    }

    public componentDidMount(): void {                

        this.setState({ paisActual: this.props.paisActual}, () => {                        
            this.getQueryUrl();

        });
        
        this.setState((state: any, props: any) => {
            state.showTab = props.show;           
        });
    }

    public componentDidUpdate(prevProps:any, prevState: Readonly<any>, snapshot?: any): void {                

        if (this.props.location !== prevProps.location) {            
            this.getQueryUrl();
        }
        
        if (this.state.searchData != prevState.searchData) {
            this._onPageUpdate();            
            this.setState({ currentPage: 1 });
        }       


    }
   
    // Función que consulta el contexto del sitio y realiza la busqueda general
    public async loadContextSite() {             
        this.getDataFiltered()                 
    }
    
    //Función para abrir modal de pilares
    openModalWithProps = (props:any) => {
        this.setState({
          showModal: true,
          pilaresProps: props
        });
    };

    //funcion para abrir modal de Comentarios
    openModalComment = (_idMecanismo:any,nombremeca:any,direccion:any,area:any,subarea:any,iddocumento:any,nombredocumento:any) => {
        
        const commentprops = {
            idMecanismo: _idMecanismo,
            nombreMecanismo: nombremeca,
            idDocumento: iddocumento,
            nombreDocumento: nombredocumento,
            Direccion: direccion,
            Area: area,
            Subarea: subarea,
        }
        
        this.setState({
            showModalDocument: true,
            CommentProps: commentprops
          });
    };

    //funcion para abrir modal de Extender Vigencia
    openModalExtender =( _idMecanismo:any) => {
        const mecanismoProp = {
            mecanismoId: _idMecanismo
        };
        
        this.setState({
            ExtenderProps: mecanismoProp,
            showModalExtender: true 
        });
    }

    //funcion para abrir modal de crear contenido
    openModalCrear =(Acceso:any, opcion:any, IdMecanismo:any) => {
        const crearProps = {
            Acceso: Acceso,
            opcion: opcion,
            IdMecanismo: IdMecanismo
        }

        this.setState({
            CrearProps: crearProps,
            showModalCrear: true
        })
    }

    
    closeModalComment = () => {
        this.setState({
            showModalDocument: false
        });
    }

    closeModalMecan = () => 
    {
        this.setState({showModal: false});
    }

    handleCheckboxChange = (pais:any) => {      
        
        this.setState((prevState:any) => ({
            checkPaises: {
                ...prevState.checkPaises,
                [pais]: !prevState.checkPaises[pais]
            }
        }), () => {
            this.getDataFiltered();
        }
        );        
        
    }

    async procesarBusquedasSecuenciales(refiners:any) {

        const busquedas = Object.keys(this.state.checkPaises)        
        .filter(key => this.state.checkPaises[key]) 
        .map(key => {
            console.log(key);                      
            const terminoBusqueda = this.props.urlPrimerSitio + "/" + key + "/"; 
            return this.pnp.searchInLibraryII(terminoBusqueda, this.state.search, this.props.Sigla, "getdatafilter",refiners);
        });

        const resultados = await Promise.all(busquedas);
                     
        const dataAcumulada:[] = resultados.reduce((acumulado, res) => acumulado.concat(res.data), []);

        dataAcumulada.sort((a:any,b:any) => parseFloat(b.Rank) - parseFloat(a.Rank));       

        this.setState({
            searchData: dataAcumulada,
            filterSearchData: dataAcumulada,
            count: true,
            currentPage: 1,
            isLoading: false,
            totalRow: dataAcumulada.length
        }, () => {
            this._onPageUpdate();  
            this.onFiltersUpdate(dataAcumulada);            
        });
        
    }

    contarPropiedades(arr:any, propiedad:any) {
        return arr.reduce((acumulador:any, item:any) => {            
            let valor = item[propiedad];
    
            if (!valor) {
                valor = 'Indefinido';
            }
                
            if (acumulador[valor]) {
                acumulador[valor] += 1;
            } else {
                acumulador[valor] = 1;
            }
    
            return acumulador;
        }, {});
    }

    obtenerCorrespondencia(titulo:any, parametro:any) {
        const mapeo = this.mapeoCampos.find(m => m.todosTitle === titulo || m.jsonParam === parametro);
    
        if (mapeo) {
            if (titulo) {
                return mapeo.jsonParam;
            } else if (parametro) {
                return mapeo.todosTitle;
            }
        } else {
            return 'No se encontró correspondencia';
        }


    }
          
    private async getMecanismo(direccion: string, area: string, seguridad: string, id: any,pais: string) {
        try {                                               

            const vPais:any = this.props.paises.filter((x:any)=> x.Nombre_x0020_Pais == pais);


            const res = await this.pnp.getListItems(
                "Mecanismos Local",
                ["Nombre_x0020_Mecanismo_x0020_Loc"],
                `ID eq '${id}'`,
                "","",0,vPais[0].Sigla
            );
                                        
            if (res && res.length > 0) {
                const { Nombre_x0020_Mecanismo_x0020_Loc } = res[0];               
              
                const documentos = await this.pnp.ObtenerArchivosByMecanismoSigla(Nombre_x0020_Mecanismo_x0020_Loc, seguridad.split(";")[0], direccion, area, vPais[0].Sigla);

                if(documentos && documentos.length >0){
                    const ficha = await this.pnp.consultarFichaForTableSigla(Nombre_x0020_Mecanismo_x0020_Loc,vPais[0].Sigla);

                    if(ficha && ficha.length > 0)
                    {
                        
                        const pilaresProps = {
                            Direccion: direccion,
                            IdVisor: area,
                            Modelo: `Modelo ${area}`,
                            NumeroPilar: "1",
                            NombreMecanismo: Nombre_x0020_Mecanismo_x0020_Loc,
                            Seguridad: seguridad.split(";")[0],
                            Acceso: "1",                           
                            Ficha: ficha,
                            DocumentosMecanismo: documentos,
                            UrlSitio: this.state.urlSitio,
                            Subsitio: this.state.estadoSitio,
                            NombreSubsitio: this.state.sitio,
                            SitioSigla: this.props.Sigla                          
                        };

                        this.openModalWithProps(pilaresProps);
                    }
                    else
                    {
                        alert("La ficha no contiene Documentos");
                    }

                    
                }
                else
                {
                    alert("La ficha no contiene Documentos");
                }
            }
            else
            {
                alert("La ficha no contiene información");
            }                                              

        } catch (error) {
            console.error('Error en getMecanismo:', error);
        }
    }
        
    // Función que recibe el texto de búsqueda por medio de la URL
    public getQueryUrl(): void {

        this.pnp.getQueryStringParam('q', decodeURIComponent(window.location.href)).then(res => {
            this.setState({ search: res },  () => {this.loadContextSite();});
        });
    }

    // Función que limpia los filtros al cambiar de pestaña
    public onClickTab(): void {

        this.filtroPais = [];
        this.queryPais = '';
    

        this.filtroDireccion = [];
        this.queryDireccion = '';

        this.filtroArea = [];
        this.queryArea = '';

        this.filtroSubArea = [];
        this.querySubArea = '';

        this.filtroTipoMecanismo = [];
        this.queryTipoMecanismo = '';

        this.filtroCategoria = [];
        this.queryCategoria = '';

        this.filtroPlanta = [];
        this.queryPlanta = '';

        this.filtroProceso = [];
        this.queryProceso = '';

        this.plantas = [];
        // this.filtros = [];
    }

    // Función que cambia las pestañas de la búsqueda
    public onTabChange(key: string): void {

        if (key == 'procesos') {
            this.onClickTab();
            this.setState({
                showTab: false,
                count: false
            }, () => {
                this.loadContextSite();
            });

        } else {
            this.onClickTab();
            this.setState({
                showTab: true,
                count: false
            }, () => {
                this.loadContextSite();
            });
        }
    }

    // Función que envía el texto de búsqueda
    public onSubmitSearch(e: any) {
        e.preventDefault();
        this.onCleanPanel();
        this.getDataFiltered();
    }

    // Función que asigna el texto de búsqueda
    public onInputChange(e: any): void {                           
            this.setState({search: e.target.value});          
    }
         

    public onInputPress(e: any): void {
        if (e.key === 'Enter') {           
            this.getDataFiltered();
        }
                  
    }

    /*Funcion para buscar coincidencias al ingresar texto en el buscador
    private async filterResultsOnChange(refi?: String) {        
        await this.pnp.searchInLibraryII(this.state.sitioLibrary, this.state.search,this.props.Sigla,"filterresult")
            .then(res => {
               

                let data = res.data.filter((f: any) => {
                    return f.FileName.replace(/ /g, '').toLowerCase().startsWith(this.state.search.toLowerCase()) || f.FileName.toLowerCase().includes(this.state.search.toLowerCase());
                });

                data = res.data.slice(0, 7);

                if (res.count > 0) {
                    this.setState({
                        partialSearchingResults: data,
                    });
                }
            });
    }*/

    // Función que limpia el panel de previsualización de resultados
    public onCleanPanel() {
        this.setState({
            clean: false,
            partialSearchingResults: []
        });
    }
  
    // Función que establece los filtros resultados de la búsqueda
    public onFiltersUpdate(items: any) {

        this.plantas = [];
        this.filterPlantas = [];                  
                
        let direcciones = this.props.terms.filter((x:any) => x.termSetName == "Dirección");
        const conteoDirecciones = this.contarPropiedades(items, "Direccion");
        
        let areas = this.props.terms.filter((x:any) => x.termSetName == "Área");
        const conteoAreas = this.contarPropiedades(items, "Area");        

        let subareas = this.props.terms.filter((x:any) => x.termSetName == "Subárea");
        const conteoSubarea = this.contarPropiedades(items, "Subarea");     
                
        let categorias = this.props.terms.filter((x:any) => x.termSetName == "Categoría");
        const conteoCategoria = this.contarPropiedades(items, "Categoria");   
        
        let tipoMecanismos = this.props.terms.filter((x:any) => x.termSetName == "Tipo de mecanismo");
        const conteoTipomecanismo = this.contarPropiedades(items, "Tipomecanismo");   

        let plantas = this.props.terms.filter((x:any) => x.termSetName == "Planta");
        const conteoPlantas = this.contarPropiedades(items, "Planta");
        
        let procesos = this.props.terms.filter((x:any) => x.termSetName == "Proceso");
        const conteoProcesos = this.contarPropiedades(items, "Proceso");               
                
        this.todos[0] = { name: 'Dirección', items: direcciones.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoDirecciones[i.label] || 0})) };
        this.todos[1] = { name: 'Área', items: areas.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoAreas[i.label] || 0 })).filter(item => item.Count > 0) };
        this.todos[2] = { name: 'Subárea', items: subareas.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoSubarea[i.label] || 0})).filter(item => item.Count > 0) };                      
        this.todos[3] = {name: 'Tipo de mecanismo',items: tipoMecanismos.map((i:any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoTipomecanismo[i.label] || 0 })).filter(item => item.Count > 0) };                        
        this.todos[4] = {name: 'Planta', items: plantas.map((i:any) => ({ Title: i.label,  Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoPlantas[i.label] || 0 })).filter(item => item.Count > 0) };                  
        this.todos[5] = { name: 'Proceso', items: procesos.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoProcesos[i.label] || 0})).filter(item => item.Count > 0) };
        this.todos[6] = { name: 'Categoría', items: categorias.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoCategoria[i.label] || 0})).filter(item => item.Count > 0) };       

        this.procesos[0] = { name: 'Área', items: areas.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoAreas[i.label] || 0 })).filter(item => item.Count > 0) };
        this.procesos[1] = { name: 'Proceso', items: procesos.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoProcesos[i.label] || 0})).filter(item => item.Count > 0) };
        this.procesos[2] = {name: 'Planta', items: plantas.map((i:any) => ({ Title: i.label,  Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoPlantas[i.label] || 0 })).filter(item => item.Count > 0) };                  
        this.procesos[3] = { name: 'Tipo de mecanismo', items: tipoMecanismos.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i}"`) > -1? true: false, Count: conteoTipomecanismo[i.label] || 0})).filter(item => item.Count > 0) };
        this.procesos[4] = { name: 'Dirección', items: direcciones.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true:  false, Count: conteoDirecciones[i.label] || 0})) };
        this.procesos[5] = { name: 'Subárea', items: subareas.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoSubarea[i.label] || 0})).filter(item => item.Count > 0) };
        this.procesos[6] = { name: 'Categoría', items: categorias.map((i: any) => ({ Title: i.label, Check: this.filtroItem.indexOf(`"${i.label}"`) > -1? true: false, Count: conteoCategoria[i.label] || 0})).filter(item => item.Count > 0) };   

        if (this.plantas.length > 1) {
            this.filterPlantas.push(`(RefinableString06:or(${this.plantas}))`);
        } else {
            this.filterPlantas.push(`(RefinableString06:equals(${this.plantas}))`);
        }
                
        this.setState({
            todosGrupo: this.todos,
            procesosGrupo: this.procesos,
            Plantas: this.filterPlantas,
            isLoading: false           
        });


    }

    // Función que asigna los filtros y crea la query para enviarla al servicio de búsqueda
    public setFilter(group: string, label: string, checked: boolean, index: number): void {
      
        if(typeof label === "string"){
            label.replace(" ","+");
        }
        
        // Asignación de filtro País
        if (group == 'País') {
            if (checked == false) {
                this.filtroPais.push(label);
                this.queryPais = this.filtroPais.length > 1 ? `(RefinableString00:or(${this.filtroPais.toString()}))` : `(RefinableString00:equals(${this.filtroPais.toString()}))`;                                                                          
            } else {
                this.filtroPais = this.filtroPais.filter(x => x != `"${label}"`);
                this.queryPais = this.filtroPais.length > 1 ? `(RefinableString00:or(${this.filtroPais.toString()}))` : '';
            }
        }

        // Asignación de filtro Dirección
        if (group == 'Dirección') {                     
            if (checked == false) {                
                this.filtroDireccion.push(`"${label}"`);
                this.queryDireccion = this.filtroDireccion.length > 1 ? `(RefinableString01:or(${this.filtroDireccion.toString()}))` : `(RefinableString01:equals(${this.filtroDireccion.toString()}))`;
            } else {
                this.filtroDireccion = this.filtroDireccion.filter(x => x != `"${label}"`);
                this.queryDireccion = this.filtroDireccion.length > 1 ? `(RefinableString01:or(${this.filtroDireccion.toString()}))` : '';                
            }
        }
        

        // Asignación de filtro Área
        if (group == 'Área') {         
            if (checked == false) {
                this.filtroArea.push(`"${label}"`);
                this.queryArea = this.filtroArea.length > 1 ? `(RefinableString02:or(${this.filtroArea.toString()}))` : `(RefinableString02:equals(${this.filtroArea.toString()}))`;
            } else {
                this.filtroArea = this.filtroArea.filter(x => x != `"${label}"`);
                this.queryArea = this.filtroArea.length > 1 ? `(RefinableString02:or(${this.filtroArea.toString()}))` : '';               
            }
        }

        // Asignación de filtro Suárea
        if (group == 'Subárea') {

            if (checked == false) {
                this.filtroSubArea.push(`"${label}"`);
                this.querySubArea = this.filtroSubArea.length > 1 ? `(RefinableString03:or(${this.filtroSubArea.toString()}))` : `(RefinableString03:equals(${this.filtroSubArea.toString()}))`;
            } else {
                this.filtroSubArea = this.filtroSubArea.filter(x => x != `"${label}"`);
                this.querySubArea = this.filtroSubArea.length > 1 ? `(RefinableString03:or(${this.filtroSubArea.toString()}))` : '';                
            }
        }

        // Asignación de filtro Tipo de mecanismo
        if (group == 'Tipo de mecanismo') {

            if (checked == false) {
                this.filtroTipoMecanismo.push(`"${label}"`);
                this.queryTipoMecanismo = this.filtroTipoMecanismo.length > 1 ? `(RefinableString04:or(${this.filtroTipoMecanismo.toString()}))` : `(RefinableString04:equals(${this.filtroTipoMecanismo.toString()}))`;
            } else {
                this.filtroTipoMecanismo = this.filtroTipoMecanismo.filter(x => x != `"${label}"`);
                this.queryTipoMecanismo = this.filtroTipoMecanismo.length > 1 ? `(RefinableString04:or(${this.filtroTipoMecanismo.toString()}))` : `(RefinableString04:equals(${this.filtroTipoMecanismo.toString()}))`;
                this.queryTipoMecanismo = this.queryTipoMecanismo == `(RefinableString04:equals())` ? '' : this.queryTipoMecanismo;
            }
        }

        // Asignación de filtro Categoría
        if (group == 'Categoría') {

            if (checked == false) {
                this.filtroCategoria.push(`"${label}"`);
                this.queryCategoria = this.filtroCategoria.length > 1 ? `(RefinableString05:or(${this.filtroCategoria.toString()}))` : `(RefinableString05:equals(${this.filtroCategoria.toString()}))`;
            } else {
                this.filtroCategoria = this.filtroCategoria.filter(x => x != `"${label}"`);
                this.queryCategoria = this.filtroCategoria.length > 1 ? `(RefinableString05:or(${this.filtroCategoria.toString()}))` : `(RefinableString05:equals(${this.filtroCategoria.toString()}))`;
                this.queryCategoria = this.queryCategoria == `(RefinableString05:equals())` ? '' : this.queryCategoria;
            }
        }

        // Asignación de filtro Planta
        if (group == 'Planta') {

            if (checked == false) {
                this.filtroPlanta.push(`"${label}"`);
                this.queryPlanta = this.filtroPlanta.length > 1 ? `(RefinableString06:or(${this.filtroPlanta.toString()}))` : `(RefinableString06:equals(${this.filtroPlanta.toString()}))`;
            } else {
                this.filtroPlanta = this.filtroPlanta.filter(x => x != `"${label}"`);
                this.queryPlanta = this.filtroPlanta.length > 1 ? `(RefinableString06:or(${this.filtroPlanta.toString()}))` : `(RefinableString06:equals(${this.filtroPlanta.toString()}))`;
                this.queryPlanta = this.queryPlanta == `(RefinableString06:equals())` ? '' : this.queryPlanta;
            }
        }

        // RefinableString07:Seguridad

        // Asignación de filtro Proceso
        if (group == 'Proceso') {

            if (checked == false) {
                this.filtroProceso.push(`"${label}"`);
                this.queryProceso = this.filtroProceso.length > 1 ? `(RefinableString08:or(${this.filtroProceso.toString()}))` : `(RefinableString08:equals(${this.filtroProceso.toString()}))`;
            } else {
                this.filtroProceso = this.filtroProceso.filter(x => x != `"${label}"`);
                this.queryProceso = this.filtroProceso.length > 1 ? `(RefinableString08:or(${this.filtroProceso.toString()}))` : `(RefinableString08:equals(${this.filtroProceso.toString()}))`;
                this.queryProceso = this.queryProceso == `(RefinableString08:equals())` ? '' : this.queryProceso;
            }
        }

        this.getDataFiltered();
       
    }

    public setFilterCheck(group: string, label: string, checked: boolean): void {       
        let newFilters = { ...this.state.filters };
        
        let groupss = this.obtenerCorrespondencia(group,null) || ""
                        
        let allGroupsEmpty = true;        

        if (!newFilters[groupss]) {
            newFilters[groupss] = new Set();
        }
    
        if (checked) {
            newFilters[groupss].add(label);
            this.filtroItem.push(label);
        } else {
            newFilters[groupss].delete(label);
            
            let index = this.filtroItem.indexOf(label);          
            if (index > -1) {
                this.filtroItem.splice(index, 1);
            }
        }
        
        for (const group in newFilters) {
            if (newFilters[group].size > 0) {
                allGroupsEmpty = false;
                break;
            }
        }               
    
        let filteredData:any[] = []

        this.state.filterSearchData.forEach((item:any) => {
            let isMatch = true;           
        
            for (let filterGroup in newFilters) {                          

                if (newFilters.hasOwnProperty(filterGroup) && newFilters[filterGroup].size > 0) {                    
                    let groupMatch = false;                                        

                    let foundMatch = false;
                    newFilters[filterGroup].forEach((filter:any) => {                        
                        if (!foundMatch && (item[filterGroup] === filter || (Array.isArray(item[filterGroup]) && item[filterGroup].includes(filter)))) {
                            groupMatch = true;
                            foundMatch = true; 
                        }
                    })
                           
                    if (!groupMatch) {
                        isMatch = false;
                        break;
                    }
                }
            }
        
            if (isMatch) {               
                filteredData.push(item);
            }
        });                                            
        
    
        this.setState({
            filters: newFilters,
            searchData: allGroupsEmpty ? this.state.filterSearchData : filteredData,
            count: true,
            currentPage: 1,
            isLoading: false,
            totalRow: filteredData.length
        }, () => {
            this._onPageUpdate();
            this.onFiltersUpdate(allGroupsEmpty ? this.state.filterSearchData : filteredData);
        });                              
    }
    
    // Función que realiza la búsqueda con los filtros asignados, y retorna los resultados
    public getDataFiltered(){

        this.filtros = [];
        let refiners: any;
       
        if (this.queryDireccion != '') {
            this.filtros.push(this.queryDireccion);
        }
        if (this.queryArea != '') {
            this.filtros.push(this.queryArea);
        }
        if (this.querySubArea != '') {
            this.filtros.push(this.querySubArea);
        }
        if (this.queryTipoMecanismo != '') {
            this.filtros.push(this.queryTipoMecanismo);
        }
        if (this.queryCategoria != '') {
            this.filtros.push(this.queryCategoria);
        }
        if (this.queryPlanta != '') {
            this.filtros.push(this.queryPlanta);
        }
        if (this.queryProceso != '') {
            this.filtros.push(this.queryProceso);
        }

        let todos = this.filtros;
        let procesos = this.filtros.concat(this.state.Plantas);

        this.state.showTab ? refiners = todos : refiners = procesos;
               
        if (this.state.search.length > 1) {                   
            this.procesarBusquedasSecuenciales(refiners)                                             
        } 
    }
    
    // Función que renderiza el componente
    public render(): React.ReactElement<IResultadosBuscadorProps> {
        
        {if(this.state.isLoading)
        {
            return <LoaderComponent sitioPrincpal={this.state.urlSite} />
        }}

        return (
            <>
             <style>{`
                #sbcId {
                display: none !important;
                }
            `}</style>
            <Modal
                isOpen={this.state.showModal}
                onDismiss={() => this.setState({showModal: false})}
                isBlocking={false}
                className='modalOverlay'>
                <div style={{textAlign: 'right'}}>
                    <button onClick={() => this.setState({showModal: false})}>X</button>
                </div>
                <ModelMecanismo
                    Titulo="Ficha mecanismo"
                    Context={this.props.webPartContext}                   
                    userID={this.state.UserId}
                    EstadoTablaModelo={this.state.estadoTablaModelo}
                    {...this.state.pilaresProps}                                                                               
                    SetEstadoTablaModelo = {this.SetEstadoTablaModelo.bind(this)}                                      
                    tablaModelo = {this.TablaModelo.bind(this)}
                    closeModal={this.closeModalMecan.bind(this)}
                />
            </Modal>

            <Modal                
            isOpen={this.state.showModalDocument}
            onDismiss={() => this.setState({showModalDocument: false})}
            isBlocking={false}
            className='modalOverlay'>
                
                <div style={{textAlign: 'right'}}>
                    <button onClick={() => this.setState({showModalDocument: false})}>X</button>
                </div>

            <ModelComentar 
                UserId={this.state.userId}
                UrlSitio={this.state.urlSite} 
                Titulo='ComentarDocumentos' 
                Context={this.props.webPartContext}
                closeModal={this.closeModalComment} 
                {...this.state.CommentProps}   
                />
            </Modal>
            
            <Modal                
            isOpen={this.state.showModalExtender}
            onDismiss={() => this.setState({showModalExtender: false})}
            isBlocking={false}
            className='modalOverlay'>
                <ExtenderVigencia
                 webPartContext ={this.props.webPartContext} 
                 NombreSubsitio ={this.state.urlSite}
                 urlSitioPrincipal={this.state.urlSite}
                 UserId ={this.props.userId}
                 {...this.state.ExtenderProps}>
                </ExtenderVigencia>

            </Modal>

            <Modal isOpen={this.state.showModalCrear}
            onDismiss={() => this.setState({showModalCrear: false})}
            isBlocking={false}
            className='modalOverlay'>
                <CrearContenido
                    Titulo="CrearContenido"
                    currentUser={this.state.userId}
                    urlSitioPrincipal={this.state.urlSite}
                    context={this.props.webPartContext}
                    Subsitio={this.state.sitioLocal}
                    NombreSubsitio={this.state.sitio}
                    Direcciones ={this.props.Direcciones}
                    Areas={this.props.Areas}
                    SubAreas={this.props.SubAreas}
                    {...this.state.CrearProps}
                    >                    
                </CrearContenido>
            </Modal>

            <Box sx={{ flexGrow: 1 }}>                         
            <Grid container spacing={2}>
                <Grid sx={{backgroundColor: '#EEF2F3'}} xs={2}>                                        
                    <FormLabel sx={{ fontWeight: 'bold' }} component="legend">Filtrar por:</FormLabel>     
                        {this.state.showTab == true ?
                            <>
                                    <Item>
                                        <FormLabel sx={{ fontWeight: 'bold' }} component="legend">Paises</FormLabel>
                                        <FormGroup>
                                            {this.props.paises.map((item:any) => (                                            
                                                <FormControlLabel value={item.Sigla} sx={{ justifyContent: 'start' }} control={<Checkbox checked={this.state.checkPaises[item.Sigla]} onChange={() => this.handleCheckboxChange(item.Sigla)} />} label={item.Nombre_x0020_Pais} />                                             
                                            ))}
                                        </FormGroup>
                                    </Item>

                                    {this.state.todosGrupo.map((g: any, i: any) => (
                                        <FilterTodos
                                            context={this.props.webPartContext}
                                            items={g.items}
                                            name={g.name}
                                            search={this.state.search}                                            
                                            setFilter={(group: any, label: any, checked: any) => this.setFilterCheck(group, label, checked)}
                                            toggleExpanded={this.toggleExpanded}
                                            expanded={this.state.expanded}
                                        />
                                    ))}
                            </>
                            :
                            <>
                                    <Item>
                                        <FormLabel sx={{ fontWeight: 'bold' }} component="legend">Paises</FormLabel>
                                        <FormGroup>
                                            {this.props.paises.map((item:any) => (                                            
                                                <FormControlLabel value={item.Sigla} sx={{ justifyContent: 'start' }} control={<Checkbox checked={this.state.checkPaises[item.Sigla]} onChange={() => this.handleCheckboxChange(item.Sigla)} />} label={item.Nombre_x0020_Pais} />                                             
                                            ))}
                                        </FormGroup>
                                    </Item>

                                    {this.state.procesosGrupo.map((g: any, i: any) => (
                                        <FilterProcesos
                                            context={this.props.webPartContext}
                                            items={g.items}
                                            name={g.name}
                                            search={this.state.search}
                                            setFilter={(group: any, label: any, checked: any) => this.setFilterCheck(group, label, checked)}
                                            toggleExpanded={this.toggleExpanded}
                                            expanded={this.state.expanded}
                                        />
                                    ))}
                            </>
                        }                    
                                        
                </Grid>
                <Grid xs={8}>
                        <div className="card-body">                            
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className="position-relative w-md-550px me-md-2">
                                
                                    {/* ================>  Suggestion panel   <================ */}
                                    {this.state.clean && this.state.partialSearchingResults && this.state.partialSearchingResults.length > 1 ?
                                        <div className="SearchPanel ">
                                            <ul>
                                                {this.state.partialSearchingResults.map((res: any, idx: any) => (
                                                    <li key={idx} style={{ height: "20px", marginTop: "8px" }}
                                                        onClick={() => this.onCleanPanel()}>
                                                        <img alt="No cargo" style={{ height: "16px", marginRight: "8px", marginBottom: "4px" }}
                                                            src={this.pnp.getImageFile(res.FileName)} />
                                                        <a href={res.LinkingUrl != null ? res.LinkingUrl : res.ServerRedirectedEmbedURL}
                                                            style={{ height: "16px" }}
                                                            target="_blank"
                                                            className="text-hover-primary text-gray-600"
                                                            data-interception="off"
                                                            rel="noopener noreferrer">
                                                            {res.FileName.split(".")[0]}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div
                                                className="text-hover-primary text-gray-700"
                                                style={{ textAlign: "center", cursor: "pointer", marginBottom: "10px" }}
                                                onClick={(e) => this.onSubmitSearch(e)}>Ver más resultados
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                    {/* ======================================================= */}


                                </div>
                                {!this.state.showTab ?
                                    <button type="button"  className="d-flex"
                                        style={{ background: "none", border: "0", color: "inherit" }}>
                                        <a                                            
                                            href={(this.props.parametros.filter((elemento: any) => elemento.Llave === "LinkMapaMecanismosPOM" + this.props.Sigla)[0] ?? {}).Valor} 
                                            className="btn btn-outline btn-outline-primary btn-active-primary"
                                            target="_blank"
                                            data-interception="off"
                                            rel="noopener noreferrer"
                                        >
                                                     
                                            <strong>{(this.props.parametros.filter((elemento: any) => elemento.Llave === "BotonMapaMecanismosPOM")[0] ?? {}).Valor}</strong>
                                        </a>
                                    </button>
                                    : null}
                            </div>
                        </div>

                        <div className="card-body" style={{ marginTop: "-15px" }}>

                        <TextField 
                            className='SearchTextField'                       
                            label="Ingresa tu texto"
                            variant="outlined"
                            value={this.state.search}
                            onChange={this.onInputChange}
                            onKeyPress={this.onInputPress}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={this.getDataFiltered}>
                                        <SearchIcon />
                                    </Button>
                                </InputAdornment>
                                ),
                            }}
                            />
                            <br />


                            <ul className="nav nav-pills nav-tabs mb-8 fs-6">
                                {this.state.showTab == true ?
                                    <>
                                        <li className="nav-item active">
                                            <button
                                                className="nav-link active"
                                                style={{ height: '35px', borderRadius: '5px 5px 0 0' }}>Todos
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                onClick={() => this.onTabChange('procesos')}
                                                className="nav-link text-hover-primary text-gray-700"                                                
                                                type="button">{(this.props.parametros.filter((elemento: any) => elemento.Llave === "LabelProcesosdeManufactura")[0] ?? {}).Valor}
                                            </button>
                                        </li>
                                    </>
                                    :
                                    <>
                                        <li className="nav-item">
                                            <button
                                                onClick={() => this.onTabChange('todos')}                                                                                                      
                                                className="nav-link text-hover-primary text-gray-700">{(this.props.parametros.filter((elemento: any) => elemento.Llave === "LabelTodos")[0] ?? {}).Valor}
                                            </button>
                                        </li>
                                        <li className="nav-item active">
                                            <button
                                                className="nav-link active"
                                                style={{ height: '35px', borderRadius: '5px 5px 0 0' }}                                                
                                                type="button">{(this.props.parametros.filter((elemento: any) => elemento.Llave === "LabelProcesosdeManufactura")[0] ?? {}).Valor}
                                            </button>
                                        </li>
                                    </>
                                }
                            </ul>
                            <div className="tab-content" id="myTabContent" style={{ marginTop: "-5px", fontSize: "12px" }}>
                                <div className="tab-pane fade show active animate__animated animate__fadeIn">
                                    <>
                                        {this.state.searchData != null && this.state.searchData.length > 0 ?
                                            <>
                                                {this.state.count && this.state.search && this.state.search.length > 1 ?
                                                    <div className="fs-6 mt-2" style={{ marginBottom: "-10px" }}>
                                                        <span style={{ fontSize: "14px", fontWeight: 600 }}>{this.state.searchData.length} resultados para: "{this.state.search}"</span>
                                                    </div>
                                                    : null}
                                                {this.state.pagedItems.map((d: any, i: any) =>                                                
                                                (<div className="animate__animated animate__fadeInUp animate__faster" style={{ marginBottom: "-4px" }}>
                                                    <div className="d-flex align-items-center mt-5" style={{ marginBottom: "-10px" }}>
                                                        <div style={{ marginRight: "10px" }}>
                                                            <img alt="No cargo" style={{ height: "18px", width: "18px", marginBottom: "4px" }}
                                                                src={this.pnp.getImageFile(d.FileName)} />
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            <a href={d.LinkingUrl != null ? d.LinkingUrl : d.ServerRedirectedEmbedURL}
                                                                target="_blank"
                                                                data-interception="off"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-900 text-hover-primary fs-6 fw-bolder text-uppercase">
                                                                {d.FileName.split(".")[0]}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{ marginLeft: "17px" }}>
                                                        <div className="col-lg-8 col-md-8 col-xl-8 col-xxl-8">
                                                            <div className="text-gray-600 py-5" style={{ marginBottom: "-6px" }}>
                                                                {d.Preview}
                                                            </div>
                                                            <div className="d-flex align-items-center mb-1">                                                                                                                                                                                   
                                                                <div onClick={(e) => this.getMecanismo(d.Direccion, d.Area, d.Seguridad, d.IDMecanismoLocal, d.Pais)}
                                                                className="text-primary text-hover-primary" style={{ cursor: "pointer" }}>
                                                                    <span className="svg-icon svg-icon-3 text-primary pe-1 verficha">
                                                                        <strong>Ver Ficha</strong>
                                                                    </span>
                                                                </div>                                                         
                                                            </div>
                                                            {d.IDMecanismoLocal != null ?
                                                                <div className="text-muted fw-bold fs-8 mt-4">
                                                                    <a className="text-gray-600 text-hover-primary">{d.Pais}</a>
                                                                    <span className="h-20px border-gray-400 border-start mx-3"></span>
                                                                    <a className="text-gray-600 text-hover-primary">{d.Direccion}</a>
                                                                    <span className="h-20px border-gray-400 border-start mx-3"></span>
                                                                    <a className="text-gray-600 text-hover-primary">{d.Area}</a>
                                                                    {d.Subarea != null ?
                                                                        <>
                                                                            <span className="h-20px border-gray-400 border-start mx-3"></span>
                                                                            <a className="text-gray-600 text-hover-primary">{d.Subarea}</a>
                                                                        </>
                                                                        : null}
                                                                </div>
                                                                : null
                                                            }
                                                        </div>
                                                        <div className="col-lg-2 col-md-2 col-xl-2 col-xxl-2 mt-1 thumbnailContainer">
                                                            <div className="thumbnail__image">
                                                                <a href={d.LinkingUrl != null ? d.LinkingUrl : d.ServerRedirectedEmbedURL}
                                                                    target="_blank"
                                                                    data-interception="off"
                                                                    rel="noopener noreferrer">
                                                                    <img alt="No cargo" src={d.PictureThumbnailURL} width="95rem" height="95rem"  onError={(e:any) => { e.target.onerror = null; e.target.src = "https://res-1.cdn.office.net/files/fabric-cdn-prod_20220628.003/assets/item-types/20/genericfile.svg"; }}/>                                                                        
                                                                </a>
                                                                <div className="thumbnail__hover">
                                                                    <img alt="No cargo" style={{ height: "26px", width: "26px", marginBottom: "4px" }}
                                                                        src={this.pnp.getImageFile(d.FileName)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-2 col-xl-2 col-xxl-2" style={{ marginTop: "-25px" }}>
                                                            <div className="show-modal">
                                                                <button title="s" type="button" className="cursor btn btn-sm btn-icon">
                                                                    <span id="trespuntos" className="svg-icon svg-icon-2 svg-icon-primary">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24"
                                                                            width="20px" fill="#000000">
                                                                            <path d="M0 0h24v24H0V0z" fill="none"></path>
                                                                            <path
                                                                                d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z">
                                                                            </path>
                                                                        </svg>
                                                                    </span>
                                                                </button>
                                                                {d.IDMecanismoLocal != null ?
                                                                    <>
                                                                        {this.props.Gestor ?
                                                                            <div className="menu-modal">
                                                                                <>
                                                                                    <div className="">
                                                                                        <a onClick={(e) => {
                                                                                                e.preventDefault(); 
                                                                                                this.openModalCrear(1,3,d.Tipomecanismo);
                                                                                            }}
                                                                                            target="_blank"
                                                                                            className="menu-links px-2 text-gray-900 text-hover-primary"
                                                                                            data-interception="off"
                                                                                            rel="noopener noreferrer">
                                                                                            ACTUALIZAR
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <a onClick={(e) => {
                                                                                                e.preventDefault(); 
                                                                                                this.openModalCrear(1,2,d.Tipomecanismo);
                                                                                            }}
                                                                                            target="_blank"
                                                                                            className="menu-links px-2 text-gray-900 text-hover-primary"
                                                                                            data-interception="off"
                                                                                            rel="noopener noreferrer">
                                                                                            ELIMINAR
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <a  onClick={(e) => {
                                                                                                e.preventDefault(); 
                                                                                                this.openModalExtender(d.Tipomecanismo);
                                                                                            }}
                                                                                            target="_blank"
                                                                                            className="menu-links px-2 text-gray-900 text-hover-primary"
                                                                                            data-interception="off"
                                                                                            rel="noopener noreferrer">
                                                                                            EXTENDER VIGENCIA
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <a  onClick={(e) => {
                                                                                                e.preventDefault(); 
                                                                                                this.openModalComment(d.Tipomecanismo,"",d.Direccion,d.Area,d.Subarea,d.ListItemID,d.FileName);
                                                                                            }}
                                                                                            className="menu-links px-2 text-gray-900 text-hover-primary"
                                                                                            target="_blank"
                                                                                            data-interception="off"
                                                                                            rel="noopener noreferrer">
                                                                                            COMENTAR
                                                                                        </a>
                                                                                    </div>
                                                                                </>
                                                                            </div>
                                                                            :
                                                                            <div className="menu-modall">
                                                                                <div className="">
                                                                                    <a  onClick={(e) => {
                                                                                                e.preventDefault(); 
                                                                                                this.openModalComment(d.Tipomecanismo,"",d.Direccion,d.Area,d.Subarea,d.ListItemID,d.FileName);
                                                                                            }}
                                                                                        style={{ textAlign: "center" }}
                                                                                        className="menu-links px-2 text-gray-900 text-hover-primary"
                                                                                        target="_blank"
                                                                                        data-interception="off"
                                                                                        rel="noopener noreferrer">
                                                                                        COMENTAR
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        }

                                                                    </>
                                                                    :
                                                                    null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="separator pt-5" style={{ marginBottom: "-4px" }}></div>
                                                </div>))}
                                            </>
                                            :
                                            <>
                                                {this.state.count && this.state.search != '' && this.state.search != null ?
                                                    <div className="fs-6 mt-2 mb-3"><span style={{ fontSize: "14px", fontWeight: 600 }}>No hay resultados para: "{this.state.search}"</span></div>
                                                    :
                                                    null}
                                            </>
                                        }
                                    </>
                                </div>
                                {this.state.pagedItems.length > 0 ?
                                    <div style={{ width: '100%', display: 'inline-block', marginTop: '30px' }}>
                                        <Pagination
                                            currentPage={this.state.currentPage}
                                            totalPages={Math.ceil(this.state.totalRow / this.state.pageSize)}
                                            onChange={(page) => this._onPageUpdate(page)}
                                            limiter={3}

                                        />
                                    </div>
                                    : null}
                            </div>
                        </div>
                </Grid>
            </Grid>
            </Box>            
        </>
        );
    }

    // Función para realizar la paginación
    private _onPageUpdate = async (page?: number) => {       
        const currentPge = (page) ? page : this.state.currentPage;
        let startItem = ((currentPge - 1) * this.state.pageSize);
        let endItem = currentPge * this.state.pageSize;
        
        let filItems = slice(this.state.searchData, startItem, endItem);
                
        this.setState({
            currentPage: currentPge,
            pagedItems: filItems
        });
    }    
}

    const mapStateToProps = (state:any) => {
        return {
        parametros: state.parametros.parametros,
        paises: state.paises.paises,
        terms: state.terms.terms,
        };
    };

export default connect(mapStateToProps)(withRouter(ResultadosBuscador));