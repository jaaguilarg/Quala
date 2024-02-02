import * as React from "react";
import { connect } from 'react-redux';
import { PNP } from "../Util/util";
import { Link,withRouter,RouteComponentProps } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
//import Button from '@mui/material/Button';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';

export interface IModeloArea extends RouteComponentProps {
    context: any;
    userId: any;
    urlSite: any;
    paisActual: any;
    Direcciones: any;
    Areas: any;
    SubAreas: any;
    parametros: {ID: any; Llave: string; Valor: string; Descripcion: string; } [];
  }
  

class ModelosArea extends React.Component<IModeloArea, any> {
    public pnp: PNP;

    constructor(props: any) {
        super(props);
        console.log(props)
        
        this.state = {
            anchorEl: null,
        };
        
        this.pnp = new PNP(props.context);
    }

    handleMenuItemClick = (url:any) => {     
        if (url.startsWith("http://") || url.startsWith("https://")) {       
          window.open(url, "_blank");
        } else {        
          this.props.history.push(url);
        }
  
        this.handleClose(); 
    };

    handleClick = (event:any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };


    public render(): React.ReactElement<IModeloArea> {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (<div>
                <div onMouseOver={this.handleClick}>
                     
                {(this.props.parametros.filter((elemento: any) => elemento.Llave === "TituloModelosdearea")[0] ?? {}).Valor}
                    <ArrowDropDown />             
                </div>

                <Menu
                    id="modelos-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={this.handleClose}
                    PaperProps={{
                        onMouseLeave: this.handleClose,
                        style: {
                            maxHeight: '77vh', // Ajusta según sea necesario
                            width: '68vw', // Ajusta según sea necesario
                        },
                    }}
                >
                    <Grid container spacing={2}>
                        {this.props.Direcciones.map((direccion:any, index:any) => (
                            <Grid item xs={12} sm={6} md={3} key={index} >
                                <div className="titulo-menu" style={{padding:'10px'}}>
                                    <Link to={"/Visor/" + direccion.ID} className="fw-bold d-block fs-6 text-gray-600 text-hover-primary mt-2">
                                        <div className="ulborder">
                                            <h6 id="mrgh6">
                                                {direccion.NombreDireccion}
                                            </h6>
                                        </div>
                                    </Link>
                                    {/* Áreas */}
                                    {this.props.Areas.filter((area:any) => area.Direccion === direccion.NombreDireccion).map((area:any, areaIndex:any) => (
                                         <div key={areaIndex}>
                                            <MenuItem key={areaIndex} onClick={() => this.handleMenuItemClick("/Visor/" + area.ID)}>
                                                {area.NombreArea}
                                            </MenuItem>
                                            {/* SubÁreas */}
                                            {this.props.SubAreas.filter((subArea:any) => subArea.Area === area.NombreArea).map((subArea:any, subAreaIndex:any) => (                                                
                                                <MenuItem sx={{ justifyContent: 'center'}} key={subAreaIndex} onClick={() => this.handleMenuItemClick("/Visor/" + subArea.ID)}>
                                                     {subArea.NombreSubArea}
                                                </MenuItem>                                                                                                
                                            ))}
                                        </div>
                                        
                                    ))}
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </Menu>
            </div>)
    }
}

const mapStateToProps = (state:any) => {
    return {
    parametros: state.parametros.parametros,
    };
};

export default  connect(mapStateToProps)(withRouter(ModelosArea));