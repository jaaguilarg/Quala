import * as React from 'react';

export interface ISelectDocument {
    check: boolean;
    doc: any;
    setCheck: any;
}

export default class SelectDocument extends React.Component<ISelectDocument, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            checked: this.props.check,
        };
    }

    public render(): React.ReactElement<ISelectDocument> {

        const onClick = (e: any) => {
            this.setState({ checked: !this.state.checked });
            this.props.setCheck(this.state.checked, this.props.doc);
        }

        return (
            <input
                className="form-check-input"
                id="seleccionExtension"
                type="checkbox"
                placeholder='.'
                onClick={e => onClick(e.target)}
                checked={this.state.checked}
            />
        )
    }
}
