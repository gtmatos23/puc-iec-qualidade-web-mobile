import { Component, type ReactNode } from 'react';
import { testIDs } from '@/utils/testIDs';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary" data-testid={testIDs.shell.errorBoundary}>
          <h2>Algo quebrou por aqui 🎬💥</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.assign('/')}>Voltar pro início</button>
        </div>
      );
    }
    return this.props.children;
  }
}
