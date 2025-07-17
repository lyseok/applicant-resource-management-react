import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MyTasks from './pages/MyTasks';
import Inbox from './pages/Inbox';
import Reports from './pages/Reports';
import Portfolio from './pages/Portfolio';
import Goals from './pages/Goals';
import MyWorkspace from './pages/MyWorkspace';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<MyTasks />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/my-workspace" element={<MyWorkspace />} />
      </Routes>
    </Layout>
  );
}

export default App;
