import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Inbox from './pages/Inbox';
import Reports from './pages/Reports';
import Portfolio from './pages/Portfolio';
import Goals from './pages/Goals';
import ProjectLayout from './components/ProjectLayout';
import ProjectOverview from './components/ProjectOverview';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import GanttChart from './components/GanttChart';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import ProjectBoard from './components/ProjectBoard'; // Import ProjectBoard

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/goals" element={<Goals />} />

        {/* 프로젝트 라우트 */}
        <Route path="/project/:projectId" element={<ProjectLayout />}>
          <Route index element={<ProjectOverview />} />
          <Route path="overview" element={<ProjectOverview />} />
          <Route path="board" element={<KanbanBoard />} />
          <Route path="list" element={<TaskList />} />
          <Route path="timeline" element={<GanttChart />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="bulletin" element={<ProjectBoard />} />{' '}
          {/* Added route for ProjectBoard */}
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
