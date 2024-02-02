import * as React from "react";

interface Props {
    sitioPrincpal: string;
}

const LoaderComponent: React.FC<Props> = ({sitioPrincpal}) => {
    return (
        <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <img src={sitioPrincpal + "/ActivosGC/Root/Quala_Logo_Home.png"} alt="Cargando..." />
        </div>
    );
}

export default LoaderComponent;
