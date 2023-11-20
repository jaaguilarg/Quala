import * as React from 'react';

export interface IFilterProps {

    context: any;
    group: string;
    index: string;
    label: string;
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

    public componentDidMount(): void {        
    }

    public componentWillUnmount(): void { }

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
            <div className="form-check form-check-custom mb-5"
                onClick={this.toggleCheck}>
                {this.state.checked ?
                    <>
                        <label
                            className="form-check-label flex-grow-1 fw-bold fs-6"
                            style={{ color: "#0275d8" }}>
                            {this.props.label}
                        </label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16" style={{ color: "#0275d8" }}>
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                        </svg>
                    </>
                    :
                    <>
                        <label
                            className="form-check-label flex-grow-1 fw-bold text-gray-700 fs-6 text-hover-primary"
                            htmlFor="kt_search_category_1">
                            {this.props.label}
                        </label>
                    </>

                }
            </div>
        )
    }

    public toggleCheck = (e:any) => {
     
        
        if(this.props.check == this.state.checked)
        {
            this.setState({ checked: !this.state.checked });
        }


       // console.log("carga 5" + "-" +this.props.label + "-" +this.state.checked + "-" + this.props.check);
        

        this.props.setFilter(
            this.props.group,
            this.props.label,
            this.state.checked,
        );
    }
}