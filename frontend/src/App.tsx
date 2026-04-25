import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { AddEmployeePage } from '@/pages/AddEmployeePage';
import { EditEmployeePage } from '@/pages/EditEmployeePage';
import { InsightsPage } from '@/pages/InsightsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EmployeesPage />} />
        <Route path="/employees/new" element={<AddEmployeePage />} />
        <Route path="/employees/:id/edit" element={<EditEmployeePage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
