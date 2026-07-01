import { AppStateProvider, useAppState } from './state/AppState';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { Concepts } from './screens/Concepts';
import { Workspace } from './screens/Workspace';
import { Tests } from './screens/Tests';
import { Progress } from './screens/Progress';
import { Systems } from './screens/Systems';

function Screens() {
  const { screen } = useAppState();
  return (
    <Layout>
      {screen === 'dashboard' && <Dashboard />}
      {screen === 'concepts' && <Concepts />}
      {screen === 'workspace' && <Workspace />}
      {screen === 'tests' && <Tests />}
      {screen === 'progress' && <Progress />}
      {screen === 'systems' && <Systems />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Screens />
    </AppStateProvider>
  );
}
