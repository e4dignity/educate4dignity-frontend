import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
};

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any): State { return { hasError: true, error }; }
  componentDidCatch(error: any, info: any) { console.error('ErrorBoundary caught:', error, info); }
  reset = () => { this.setState({ hasError: false, error: undefined }); this.props.onReset?.(); };
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 rounded-lg border bg-red-50 text-red-700 text-sm">
          <div className="font-semibold mb-1">Une erreur est survenue</div>
          <div className="text-[12px] mb-2">{String(this.state.error||'Inconnue')}</div>
          <button onClick={this.reset} className="px-3 py-1 rounded border bg-white text-red-700">Réessayer</button>
        </div>
      );
    }
    return this.props.children as any;
  }
}
