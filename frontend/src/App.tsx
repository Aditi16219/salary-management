import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { InsightsPage } from '@/pages/InsightsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EmployeesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
