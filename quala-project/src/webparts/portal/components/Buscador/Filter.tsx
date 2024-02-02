import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export interface IFilterProps {

    context: any;
    group: string;
    index: string;
    label: string;
    count: any;
    search: any;
    setFilter: any;
    check: boolean;
}

export default class Filter extends React.Component<IFilterProps, any> {

    constructor(props:any) {

        super(props);       

        this.state = {
            opened: false,
            checked: this.props.check,
        };              
    }

    
    public componentDidUpdate(prevProps: Readonly<IFilterProps>, prevState: Readonly<any>, snapshot?: any): void {
                
        if (prevProps.search !== this.props.search) {
            if (this.props.search == null || this.props.search == '' || this.props.search.length == 0) {
                this.setState({ checked: this.props.check });
            }        
        }

        if(this.state.checked != this.props.check)
       {
            this.setState({ checked: this.props.check });
        }

    }

    public render(): React.ReactElement<IFilterProps> {

        return (            
                <FormControlLabel sx={{ justifyContent: 'start' }} control={<Checkbox onChange={this.toggleCheck} />} label={this.props.label + "(" + this.props.count + ")"} />                                            
        )
    }

    public toggleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {        
        const isChecked = e.target.checked;
                
        this.setState({ checked: isChecked });
            
        this.props.setFilter(this.props.group, this.props.label, isChecked);
    }

}