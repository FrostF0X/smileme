import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, copied: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  copyLog = () => {
    const { error, errorInfo } = this.state;
    const stackTrace = error && error.stack ? error.stack : 'Brak szczegółów stosu (Stack Trace).';
    const componentStack = errorInfo && errorInfo.componentStack ? errorInfo.componentStack : 'Brak szczegółów stosu komponentu.';
    const fullLog = `Message: ${error ? error.toString() : 'Unknown Error'}\nUserAgent: ${navigator.userAgent}\nTime: ${new Date().toISOString()}\n\nStack:\n${stackTrace}\n\nComponent Stack:\n${componentStack}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullLog).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      }).catch(err => alert("Nie udało się skopiować logu: " + err));
    } else {
      alert("Kopiowanie do schowka nie jest obsługiwane w tej przeglądarce.");
    }
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error ? this.state.error.toString() : 'Nieznany błąd';
      return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Wystąpił błąd aplikacji</h2>
            <p className="text-slate-600 mb-6 text-sm">Twój stan rysunku jest najprawdopodobniej bezpieczny.</p>
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-left mb-6 overflow-auto max-h-32 text-xs font-mono text-red-600">
              {errorMsg}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={this.copyLog} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm w-40">
                {this.state.copied ? 'Skopiowano!' : 'Skopiuj log'}
              </button>
              <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                Odśwież aplikację
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
