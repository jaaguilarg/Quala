import * as React from 'react';
import { PNP } from '../Util/util';
import Filter from './Filter';

export interface IFilterProcesosProps {
    context: any;
    items: any;
    name: string;
    search: any;
    setFilter: any;
}

export default class FilterProcesos extends React.Component<IFilterProcesosProps, any> {

    public pnp: PNP;

    constructor(props:any) {

        super(props);
        this.pnp = new PNP(this.props.context);

        this.state = {
            flag: false,
        };
    }

    public componentDidMount(): void { }

    public componentWillUnmount(): void { }

    public render(): React.ReactElement<IFilterProcesosProps> {

        return (
            <div className="animate__animated animate__fadeIn">
                <h3 className="text-gray-700 fs-20 mb-5 br-box">{this.props.name}</h3>
                <div className="mb-10 br-box">
                    {this.props.items.map((d:any, i:any) => (
                        <Filter
                            context={this.props.context}
                            group={this.props.name}
                            index={i}
                            label={d.Title}
                            check={d.Check}
                            search={this.props.search}
                            setFilter={this.props.setFilter}
                        />
                    ))}
                </div>
            </div>
        )
    }
}