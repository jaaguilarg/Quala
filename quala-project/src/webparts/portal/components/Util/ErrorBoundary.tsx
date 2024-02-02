import { Component,ReactNode  } from "react";
import * as React from "react";

interface ErrorBoundaryProps {
  children: ReactNode;  
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: any;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null};
  }


  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    // Actualiza el estado para que el siguiente render muestre la UI alternativa.
    return { hasError: true, errorInfo: null};
  }

  componentDidCatch(error: any, errorInfo: any) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error("Capturado un error:", error, errorInfo);  
    this.setState({ errorInfo: errorInfo }); 
  }

  public triggerError = () => {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>Algo salió mal.</h1> 
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </>
      );
    }
    return this.props.children;
  }
}
