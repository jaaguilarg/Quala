import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select'
import { withRouter } from 'react-router-dom';
import { PNP } from '../Util/util';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import FilterProcesos from './FilterProceso';
import FilterTodos from './FilterTodos';
import 'animate.css';
import LoaderComponent from '../Views/LoaderComponent';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import Pilares from '../Modelos/Pilares';
import ModelComentar from '../Views/ModelComentar';

const slice: any = require('lodash/slice');

export interface IResultadosBuscadorProps {
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
}

class ResultadosBuscador extends React.Component<IResultadosBuscadorProps, any> {

    public pnp: PNP;
    public urlSite: '';
    public iconPath: any;
    public paises: any[] = [];
    public todos: any[] = [];
    public procesos: any[] = [];
    public plantas: any[] = [];

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

    

    constructor(props: any) {
        super(props);
        this.pnp = new PNP(this.props.webPartContext);        

        this.state = {
            search: '',
            urlSite: '',
            urlSubSite: '',
            paisActual: '',
            showTab: true,
            count: false,
            clean: false,
            loading: false,
            IsApros: false,
            IsRolGestor: false,
            Plantas: [],
            Refiners: [],
            searchData: [],
            todosGrupo: [],
            grupoPaises: [],
            procesosGrupo: [],
            linkMapaMecanismo: '',
            partialSearchingResults: [],
            NombreMecanismo: '',
            pagedItems: [],
            pageSize: 10,
            currentPage: 1,
            selectPaises: [],
            isLoading: true,
            showModal: false,
            showModalDocument: false,
            idMecanismo: null,
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
              sitioLibrary: this.props.urlSite == this.props.urlPrimerSitio ? this.props.urlSite + "/" + this.props.Sigla + "/" : this.props.urlPrimerSitio + "/",
              sitioLocal: this.props.urlSite == this.props.urlPrimerSitio ? this.props.urlSite + "/" + this.props.Sigla : this.props.urlPrimerSitio 

        }
    }

    public componentDidMount(): void {
       
        
        this.setState({ paisActual: this.props.paisActual}, () => {            
            this.consultarModelo();
            this.getQueryUrl();

        });
        
        this.setState((state: any, props: any) => {
            state.showTab = props.show;           
        }, () => {
            this.getPaises();
        });
    }

    public componentDidUpdate(prevProps: Readonly<IResultadosBuscadorProps>, prevState: Readonly<any>, snapshot?: any): void {

        if (this.state.searchData != prevState.searchData) {
            this._onPageUpdate();            
            this.setState({ currentPage: 1 });
        }       
    }

    // Función que consulta el tipo de rol del usuario
    public getGroups(Id: any): void {

        this.pnp.getGroupsByUserId(Id)
            .then(resGroups => {
                
                let gestor = resGroups.filter((x: { LoginName: any }) => x.LoginName == 'Gestores_' + this.props.paisActual);

                let isGestor = gestor.length > 0 ? true : false;

                this.setState({
                    IsRolGestor: isGestor,
                });

            });
    }

    // Función que consulta el contexto del sitio y realiza la busqueda general
    public async loadContextSite() {     
        console.log(this.state.search);  
        await this.pnp.searchInLibrary(this.state.sitioLibrary,this.state.search,this.props.Sigla,"loadcontext")
            .then(res => {                                         
                this.setState({                   
                    Refiners: res.data,
                    searchData: res,
                    urlSite: this.props.urlSite,
                    urlSubSite: this.props.urlPrimerSitio
                }, () => {
                    this.onFilters(this.state.Refiners);
                    this.getGroups(this.props.userId);                    
                });
            });
        
               
    }

    // Función que consulta el modelo de la filial
    public consultarModelo(): void {

        this.pnp.getListItems(
            "Modelos Local",
            ["*"],
            "",
            ""           
        ).then(items => {
           
            let linkMapa = items.filter((x: { Title: any }) => x.Title == "POM")[0];
            
            if(linkMapa == null)
            {
                linkMapa = items[0];
            }            
            
            this.setState({ linkMapaMecanismo: linkMapa.Vinculo_x0020_Mapa_x0020_Mecanis})
        });
    }

    // Función que cunsulta los paises
    public getPaises(): void {
        try{
            let paises = this.props.paises.filter((x: { Title: any }) => x.Title != this.state.paisActual);

            paises.forEach((item: any, index: any) => {
                this.paises.push({ valor: item.Nombre_x0020_Pais, LinkSitio: item.Url_x0020_Sitio });
            });

            this.setState({
                grupoPaises: this.paises
            });       
        }
        catch
        {

        }
    }   

    openModalWithProps = (props:any) => {
        this.setState({
          showModal: true,
          pilaresProps: props
        });
    };

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

    closeModalComment = () => {
        this.setState({
            showModalDocument: false
        });
    };
  
    private async getMecanismo(direccion: string, area: string, seguridad: string, id: any) {
        try {                                               
            const res = await this.pnp.getListItems(
                "Mecanismos Local",
                ["Nombre_x0020_Mecanismo_x0020_Loc"],
                `ID eq '${id}'`,
                "","",0,this.props.Sigla
            );
    
            if (res && res.length > 0) {
                const { Nombre_x0020_Mecanismo_x0020_Loc } = res[0];
                const modelo = area.split(' ').join('_');
              
                const pilaresProps = {
                  Direccion: direccion,
                  IdVisor: modelo,
                  Modelo: `Modelo ${area}`,
                  NumeroPilar: "1",
                  NombreMecanismo: Nombre_x0020_Mecanismo_x0020_Loc,
                  Seguridad: seguridad,
                  Acceso: "1"                          
                };

                console.log(pilaresProps);
              
                this.openModalWithProps(pilaresProps);
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

        const {value} = e.target;
     

        this.setState({
           search: e.target.value,
        });

        if (value && value.length > 0) {
            this.setState({
                search: value,
                count: false,
                clean: true
            });
            setTimeout(() => {
                this.filterResultsOnChange();
            }, 500);
        } else {
            this.onClickTab();
            this.setState({                
                count: false,
                clean: false
            }, () => {
                this.loadContextSite();
            });
            this.onCleanPanel();
        }
    }

    public onInputPress(e: any): void {
        if (e.key === 'Enter') {
            this.getDataFiltered();
        }
                  
    }

    //Funcion para buscar coincidencias al ingresar texto en el buscador
    private async filterResultsOnChange(refi?: String) {
        
        await this.pnp.searchInLibrary(this.state.sitioLibrary, this.state.search,this.props.Sigla,"filterresult")
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
    }

    // Función que limpia el panel de previsualización de resultados
    public onCleanPanel() {
        this.setState({
            clean: false,
            partialSearchingResults: []
        });
    }

    // Función que establece los filtros resultados de la búsqueda
    public onFilters(items: any) {

        this.plantas = [];
        this.filterPlantas = [];
        
        let paises = [];
        
        paises.push(items.map((item: any) => item.Pais).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        }));
                
                     
        paises = paises.filter((a: any) => a !== undefined && a !== null);
                
        let direcciones = items.map((item: any) => item.Direccion).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        direcciones = direcciones.filter((a: any) => a !== undefined && a !== null);

        let areas = items.map((item: any) => item.Area).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        areas = areas.filter((a: any) => a !== undefined && a !== null);

        let subareas = items.map((item: any) => item.Subarea).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        subareas = subareas.filter((a: any) => a !== undefined && a !== null);

        let categorias = items.map((item: any) => item.Categoria).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        categorias = categorias.filter((a: any) => a !== undefined && a !== null);

        let tipoMecanismos = items.map((item: any) => item.Tipomecanismo).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });

        tipoMecanismos = tipoMecanismos.filter((a: any) => a !== undefined && a !== null);

        let plantas = items.map((item: any) => item.Planta).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        
        plantas = plantas.filter((a: any) => a !== undefined && a !== null);

        let procesos = items.map((item: any) => item.Proceso).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        procesos = procesos.filter((a: any) => a !== undefined && a !== null);

        
        this.todos[0] = { name: 'País', items: paises.map((i: any) => ({ Title: i, Check: this.state.paisActual == i? true: false })) };        
        this.todos[1] = { name: 'Dirección', items: direcciones.map((i: any) => ({ Title: i, Check: false })) };
        this.todos[2] = { name: 'Área', items: areas.map((i: any) => ({ Title: i, Check: false })) };
        this.todos[3] = { name: 'Subárea', items: subareas.map((i: any) => ({ Title: i, Check: false })) };
        
        const processedItems = tipoMecanismos.map((i: string) => {
            let segments = i.split(';');
            return segments[segments.length - 1];
        });

        const uniqueProcessedItems = processedItems.filter((value: any, index: number, self: any[]) => {
            return self.indexOf(value) === index;
        });

        this.todos[4] = {
            name: 'Tipo de mecanismo',
            items: uniqueProcessedItems.map((segment:any) => ({ Title: segment, Check: false }))
        };
        
        
        
        this.todos[5] = { name: 'Planta', items: plantas.map((i: string) => ({ Title: i.indexOf(";") > -1? i.substring(0,i.indexOf(";")) : i , Check: false })) };
        this.todos[6] = { name: 'Proceso', items: procesos.map((i: any) => ({ Title: i.indexOf(";") > -1? i.substring(0,i.indexOf(";")) : i, Check: false })) };
        this.todos[7] = { name: 'Categoría', items: categorias.map((i: any) => ({ Title: i, Check: false })) };

        this.procesos[0] = { name: 'Área', items: areas.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[1] = { name: 'Proceso', items: procesos.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[2] = { name: 'Planta', items: plantas.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[3] = { name: 'Tipo de mecanismo', items: tipoMecanismos.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[4] = { name: 'País', items: paises.map((i: any) => ({ Title: i, Check: i == this.state.paisActual ? true : false })) };
        this.procesos[5] = { name: 'Dirección', items: direcciones.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[6] = { name: 'Subárea', items: subareas.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[7] = { name: 'Categoría', items: categorias.map((i: any) => ({ Title: i, Check: false })) };

        plantas.forEach((item: any, idx: any) => {
            let pl = item.split(' ').join('+');
            this.plantas.push(`"${pl}"`);
        });

        if (this.plantas.length > 1) {
            this.filterPlantas.push(`(RefinableString06:or(${this.plantas}))`);
        } else {
            this.filterPlantas.push(`(RefinableString06:equals(${this.plantas}))`);
        }
        
        this.setState({
            todosGrupo: this.todos,
            procesosGrupo: this.procesos,
            Plantas: this.filterPlantas            
        }, () => {
            this.setFilter('País', this.state.paisActual, false, 0);
        });
    }

     // Función que establece los filtros resultados de la búsqueda
     public onFiltersUpdate(items: any) {

        this.plantas = [];
        this.filterPlantas = [];
        
        let paises = [];
        
        paises.push(items.map((item: any) => item.Pais).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        }));    
                     
        paises = paises.filter((a: any) => a !== undefined && a !== null);
                
        let direcciones = items.map((item: any) => item.Direccion).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        direcciones = direcciones.filter((a: any) => a !== undefined && a !== null);

        let areas = items.map((item: any) => item.Area).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        areas = areas.filter((a: any) => a !== undefined && a !== null);

        let subareas = items.map((item: any) => item.Subarea).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        subareas = subareas.filter((a: any) => a !== undefined && a !== null);

        let categorias = items.map((item: any) => item.Categoria).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        categorias = categorias.filter((a: any) => a !== undefined && a !== null);

        let tipoMecanismos = items.map((item: any) => item.Tipomecanismo).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
       
        tipoMecanismos = tipoMecanismos.filter((a: any) => a !== undefined && a !== null);

        let plantas = items.map((item: any) => item.Planta).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        plantas = plantas.filter((a: any) => a !== undefined && a !== null);

        let procesos = items.map((item: any) => item.Proceso).filter((x: any, y: any, z: any) => {
            return z.findIndex((v: any) => v === x) === y;
        });
        procesos = procesos.filter((a: any) => a !== undefined && a !== null);
       
        this.setState({
            selectPaises: paises.map((item, index) => {
            return {
                label: item.Nombre_x0020_Pais,
                value: item.Sigla,
                key: index
            }
    })});
        
       
        this.setState({
            selectPaises: paises
        })
     
        this.todos[0] = { name: 'País', items: paises.map((i: any) => ({ Title: i,  Check: this.filtroPais.indexOf(`"${i}"`) > -1? true : false })) };        
        this.todos[1] = { name: 'Dirección', items: direcciones.map((i: any) => ({ Title: i, Check: this.filtroDireccion.indexOf(`"${i}"`) > -1? true:  false })) };
        this.todos[2] = { name: 'Área', items: areas.map((i: any) => ({ Title: i, Check: this.filtroArea.indexOf(`"${i}"`) > -1? true: false })) };
        this.todos[3] = { name: 'Subárea', items: subareas.map((i: any) => ({ Title: i, Check: this.filtroSubArea.indexOf(`"${i}"`) > -1? true: false})) };
        
        const processedItems = tipoMecanismos.map((i: string) => {
            let segments = i.split(';');
            return segments[segments.length - 1];
        });

        const uniqueProcessedItems = processedItems.filter((value: any, index: number, self: any[]) => {
            return self.indexOf(value) === index;
        });

        this.todos[4] = {
            name: 'Tipo de mecanismo',
            items: uniqueProcessedItems.map((segment:any) => ({ Title: segment, Check: false }))
        };
        
        
        
        this.todos[5] = { name: 'Planta', items: plantas.map((i: string) => ({ Title: i.indexOf(";") > -1? i.substring(0,i.indexOf(";")) : i, Check: this.filtroPlanta.indexOf(`"${i.substring(0,i.indexOf(";"))}"`) > -1? true: false})) };
        this.todos[6] = { name: 'Proceso', items: procesos.map((i: string) => ({ Title: i.indexOf(";") > -1? i.substring(0,i.indexOf(";")) : i, Check: this.filtroProceso.indexOf(`"${i.substring(0,i.indexOf(";"))}"`) > -1? true: false})) };
        this.todos[7] = { name: 'Categoría', items: categorias.map((i: any) => ({ Title: i, Check: this.filtroCategoria.indexOf(`"${i}"`) > -1? true: false})) };       

        this.procesos[0] = { name: 'Área', items: areas.map((i: any) => ({ Title: i, Check: this.filtroArea.indexOf(`"${i}"`) > -1? true: false })) };
        this.procesos[1] = { name: 'Proceso', items: procesos.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[2] = { name: 'Planta', items: plantas.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[3] = { name: 'Tipo de mecanismo', items: tipoMecanismos.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[4] = { name: 'País', items: paises.map((i: any) => ({ Title: i, Check: this.filtroPais.indexOf(`"${i}"`) > -1? true : false })) };
        this.procesos[5] = { name: 'Dirección', items: direcciones.map((i: any) => ({ Title: i, Check: this.filtroDireccion.indexOf(`"${i}"`) > -1? true:  false })) };
        this.procesos[6] = { name: 'Subárea', items: subareas.map((i: any) => ({ Title: i, Check: false })) };
        this.procesos[7] = { name: 'Categoría', items: categorias.map((i: any) => ({ Title: i, Check: false })) };

        plantas.forEach((item: any, idx: any) => {
            let pl = item.split(' ').join('+');
            this.plantas.push(`"${pl}"`);
        });

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

    // Función que realiza la búsqueda con los filtros asignados, y retorna los resultados
    public getDataFiltered() {

        this.filtros = [];
        let refiners: any;

        if (this.queryPais != '') {
            this.filtros.push(this.queryPais);
        }
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
            
            this.pnp.searchInLibrary(this.state.sitioLibrary,this.state.search ,this.props.Sigla,"getdatafilter", refiners)
                .then(res => {                  
                    this.setState({
                        searchData: res,
                        count: true,
                        currentPage: 1,
                        isLoading: false
                    }, () => {
                        this._onPageUpdate();  
                        this.onFiltersUpdate(res.data);

                    });
                });
            
                
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
            <Modal
            isOpen={this.state.showModal}
            onDismiss={() => this.setState({showModal: false})}
            isBlocking={false}
            className='customModalContainer'>
             <div style={{textAlign: 'right'}}>
                <button onClick={() => this.setState({showModal: false})}>X</button>
            </div>
            <Pilares
                Titulo="Pilares"
                context={this.props.webPartContext}
                currentUser={this.state.currentUser}
                userID={this.state.UserId}
                urlSitioPrincipal={this.state.urlSite}
                Subsitio={this.state.estadoSitio}
                NombreSubsitio={this.state.sitio}
                SitioSigla={this.props.Sigla}
                {...this.state.pilaresProps}                        
            />
            </Modal>

            <Modal
                
                isOpen={this.state.showModalDocument}
                onDismiss={() => this.setState({showModalDocument: false})}
                isBlocking={false}
                className='customModalContainer'>
                
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
                     
            <div className="Fontpage" >                 
                <div className="row">
                    <div className="col-md-3 color-card animate__animated animate__fadeIn" style={{ width: "280px", minHeight: "71vh" }}>
                        <div className="card-body" style={{ paddingRight: "25px" }}>
                            <h4 className="text-gray-500 fs-21 mb-8">Filtrar por:</h4>

                            {this.state.showTab == true ?
                                <>
                                    {this.state.todosGrupo.map((g: any, i: any) => (
                                        <FilterTodos
                                            context={this.props.webPartContext}
                                            items={g.items}
                                            name={g.name}
                                            search={this.state.search}                                            
                                            setFilter={(group: any, label: any, checked: any, index: number) => this.setFilter(group, label, checked, index)}
                                        />
                                    ))}
                                </>
                                :
                                <>
                                    {this.state.procesosGrupo.map((g: any, i: any) => (
                                        <FilterProcesos
                                            context={this.props.webPartContext}
                                            items={g.items}
                                            name={g.name}
                                            search={this.state.search}
                                            setFilter={(group: any, label: any, checked: any, index: number) => this.setFilter(group, label, checked, index)}
                                        />
                                    ))}
                                </>
                            }

                        </div>
                    </div>
                    <div className="col animate__animated animate__fadeIn">
                        <div className="card-body">                            
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className="position-relative w-md-550px me-md-2">
                                    <form className="row g-3" onSubmit={(e) => this.onSubmitSearch(e)} autoComplete="on">                                                                               
                                        
                                        <div className="col-auto">
                                            <Select className="" name="selectP" options={this.state.selectPaises.map((t: any) =>({value: t,label: t})) } />                                           
                                        </div>
                                        
                                        <div className="col-auto">
                                            <span
                                                onClick={(e) => this.onSubmitSearch(e)}
                                                style={{ cursor: 'pointer' }}
                                                className="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ms-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <rect x="7.0365" y="19.1223" width="8.15546" height="2" rx="2" transform="rotate(125 7.0365 19.1223)" fill="currentColor"></rect>
                                                    <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor"></path>
                                                </svg>
                                            </span>
                                            <input
                                                type="search"
                                                className="form-control ps-10"
                                                style={{ height: "40px" }}
                                                name="search"
                                                value={this.state.search}
                                                onChange={(e) => this.onInputChange(e)}
                                                onKeyDown={(e) => this.onInputPress(e)}
                                                autoComplete="on"
                                                placeholder="Buscar" />
                                        </div>
                                    </form>


                                    {/* ================>  Suggestion panel   <================ */}
                                    {this.state.clean && this.state.partialSearchingResults && this.state.partialSearchingResults.length > 1 ?
                                        <div className="SearchPanel ">
                                            <ul>
                                                {this.state.partialSearchingResults.map((res: any, idx: any) => (
                                                    <li key={idx} style={{ height: "20px", marginTop: "8px" }}
                                                        onClick={() => this.onCleanPanel()}
                                                    >
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
                                            href={this.state.linkMapaMecanismo}
                                            className="btn btn-outline btn-outline-primary btn-active-primary"
                                            target="_blank"
                                            data-interception="off"
                                            rel="noopener noreferrer"
                                        >
                                            <strong>Mapa de Mecanismos POM</strong>
                                        </a>
                                    </button>
                                    : null}
                            </div>
                        </div>

                        <div className="card-body" style={{ marginTop: "-15px" }}>

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
                                                type="button">Procesos de manufactura
                                            </button>
                                        </li>
                                    </>
                                    :
                                    <>
                                        <li className="nav-item">
                                            <button
                                                onClick={() => this.onTabChange('todos')}
                                                className="nav-link text-hover-primary text-gray-700">Todos
                                            </button>
                                        </li>
                                        <li className="nav-item active">
                                            <button
                                                className="nav-link active"
                                                style={{ height: '35px', borderRadius: '5px 5px 0 0' }}
                                                type="button">Procesos de manufactura
                                            </button>
                                        </li>
                                    </>
                                }
                            </ul>
                            <div className="tab-content" id="myTabContent" style={{ marginTop: "-5px", fontSize: "12px" }}>
                                <div className="tab-pane fade show active animate__animated animate__fadeIn">
                                    <>
                                        {this.state.searchData.data != null && this.state.searchData.data.length > 0 ?
                                            <>
                                                {this.state.count && this.state.search && this.state.search.length > 1 ?
                                                    <div className="fs-6 mt-2" style={{ marginBottom: "-10px" }}>
                                                        <span style={{ fontSize: "14px", fontWeight: 600 }}>{this.state.searchData.count} resultados para: "{this.state.search}"</span>
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
                                                                <div onClick={(e) => this.getMecanismo(d.Direccion, d.Area, d.Seguridad, d.IDMecanismoLocal)}
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
                                                                    {this.pnp.validarURL(d.PictureThumbnailURL) ?
                                                                        <img alt="No cargo" src={d.PictureThumbnailURL} width="95rem" height="95rem" />
                                                                        :
                                                                        <img alt="No cargo" src={this.pnp.genericFile()} width="65rem" height="65rem" />
                                                                    }
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
                                                                                        <a href={`${this.state.urlSubSite}#/CrearContenido/1/3/${d.Tipomecanismo}`}
                                                                                            target="_blank"
                                                                                            className="menu-links px-2 text-gray-900 text-hover-primary"
                                                                                            data-interception="off"
                                                                                            rel="noopener noreferrer">
                                                                                            ACTUALIZAR
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <a href={`${this.state.urlSubSite}#/CrearContenido/1/2/${d.Tipomecanismo}`}
                                                                                            target="_blank"
                                                                                            className="menu-links px-2 text-gray-900 text-hover-primary"
                                                                                            data-interception="off"
                                                                                            rel="noopener noreferrer">
                                                                                            ELIMINAR
                                                                                        </a>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <a href={`${this.state.urlSubSite}#/ExtenderVigencia/${d.Tipomecanismo}`}
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
                                            totalPages={Math.ceil(this.state.searchData.count / this.state.pageSize)}
                                            onChange={(page) => this._onPageUpdate(page)}
                                            limiter={3}
                                        />
                                    </div>
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
    }

    // Función para realizar la paginación
    private _onPageUpdate = async (page?: number) => {
        const currentPge = (page) ? page : this.state.currentPage;
        let startItem = ((currentPge - 1) * this.state.pageSize);
        let endItem = currentPge * this.state.pageSize;
        
        let filItems = slice(this.state.searchData.data, startItem, endItem);
                
        this.setState({
            currentPage: currentPge,
            pagedItems: filItems
        });
    }    
}

const mapStateToProps = (state:any) => {
    return {
      paises: state.paises,
    };
  };

export default connect(mapStateToProps)(withRouter(ResultadosBuscador));