import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AddDataPage from './pages/AddDataPage';
import ViewDataPage from './pages/ViewDataPage';
import { colors } from './theme';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: colors.bgSecondary,
            color: colors.textPrimary,
            border: `1px solid ${colors.border}`,
          },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddDataPage />} />
          <Route path="/view" element={<ViewDataPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
