import { Component } from "react";
import * as React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    // Actualiza el estado para que el siguiente render muestre la UI alternativa.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error("Capturado un error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI alternativa
      return <h1>Algo salió mal.</h1>;
    }

    return this.props.children;
  }
}
