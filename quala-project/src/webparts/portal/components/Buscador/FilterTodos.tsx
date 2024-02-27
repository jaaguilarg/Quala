import * as React from 'react';
import { PNP } from '../Util/util';
import Filter from './Filter';
import { Button } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export interface IFilterTodosProps {
    context: any;
    items: any;
    name: string;
    search: any;
    setFilter: any;
    toggleExpanded: any
    expanded: any
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#EEF2F3' : '#EEF2F3',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '5px'
}));

export default class FilterTodos extends React.Component<IFilterTodosProps, any> {

    public pnp: PNP;

    constructor(props:any) {

        super(props);
        this.pnp = new PNP(this.props.context);

        this.state = {
            flag: false,
            expanded: this.props.expanded,
            showDiv: false,

        };
    }
    
    
    public render(): React.ReactElement<IFilterTodosProps> {
              

        const toggleDiv = () => {
            this.setState({showDiv: !this.state.showDiv});
        };
    

        return (
                <Item>
                    <FormLabel sx={{ fontWeight: 'bold' }} component="legend">{this.props.name}</FormLabel>                                               
                    
                    <FormGroup>
                
                        {this.props.items.slice(0,3).map((d:any, i:any) => (                       
                            <Filter
                                context={this.props.context}
                                group={this.props.name}
                                index={i}
                                label={d.Title}
                                check={d.Check}
                                count={d.Count}
                                search={this.props.search}
                                setFilter={this.props.setFilter}
                            />
                        ))}
                        
                        {this.props.items.length > 3 ? (<> 
                        
                            {this.state.showDiv? (<>{this.props.items.slice(4,this.props.items.length).map((d:any, i:any) => (                       
                                    <Filter
                                        context={this.props.context}
                                        group={this.props.name}
                                        index={i}
                                        label={d.Title}
                                        check={d.Check}
                                        count={d.Count}
                                        search={this.props.search}
                                        setFilter={this.props.setFilter}
                                    />
                                ))}</>) : null}
                            
                            <Button onClick={toggleDiv}>
                                {this.state.showDiv ? "Ver Menos" : "Ver ms"}
                            </Button>

                        </>) : null}

                    </FormGroup>
                </Item>
        )
    }
}