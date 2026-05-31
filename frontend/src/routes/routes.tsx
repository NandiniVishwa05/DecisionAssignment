import { Layout } from '../components/Layout/Layout';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { Category } from '../components/Category/Category';
import { Priority } from '../components/Priority/Priority';
import { Todo } from '../components/Todo/Todo';
import { Route, Routes } from 'react-router-dom';

export const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category" element={<Category />} />
        <Route path="/priority" element={<Priority />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Layout>
  );
};
