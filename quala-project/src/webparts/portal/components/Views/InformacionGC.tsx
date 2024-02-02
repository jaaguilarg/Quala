import * as React from "react";
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps  } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export interface IInformacionGC extends RouteComponentProps {
    context: any;
    userId: any;
    urlSite: any;
    Gestor: any;
    infoMenus: any;
    parametros: {ID: any; Llave: string; Valor: string; Descripcion: string; } [];
}


class InformacionGC extends React.Component<IInformacionGC, any> {
    menuRef:any;

    constructor(props: any) {
        super(props);
        
        this.state = {
          anchorEl: null,
        };    
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

                            
    public render(): React.ReactElement<IInformacionGC> {

      const { anchorEl } = this.state;
      const open = Boolean(anchorEl);
      
        return(<>                                
            <div onMouseLeave={this.handleClose}>
              <Button
                className="text-decoration1"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onMouseOver={this.handleClick}               
                endIcon={<ArrowDropDownIcon />}
              >
                {(this.props.parametros.filter((elemento: any) => elemento.Llave === "LabelInformacionGC")[0] ?? {}).Valor}                
              </Button>
              <Menu
                id="simple-menu"
                className="text-decoration1"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                PaperProps={
                  {
                    onMouseLeave: this.handleClose,
                  }
                }
                onClose={this.handleClose}
              >
                {this.props.infoMenus.map((d:any, index:any) => (
                  <MenuItem key={index} onClick={() => this.handleMenuItemClick(d.Enlace)}>
                    {d.Nombre_x0020_Menu}
                  </MenuItem>
                ))}
              </Menu>
            </div> </>)        
    }
}

const mapStateToProps = (state:any) => {
  return {
  parametros: state.parametros.parametros,
  };
};

export default connect(mapStateToProps)(withRouter(InformacionGC));