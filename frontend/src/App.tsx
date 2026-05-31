import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes/routes';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
