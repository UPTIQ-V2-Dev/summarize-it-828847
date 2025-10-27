import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SummaryPage } from '@/pages/SummaryPage';
import { LoginPage } from '@/pages/LoginPage';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000 // 5 minutes
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route
                        path='/login'
                        element={<LoginPage />}
                    />
                    <Route
                        path='/'
                        element={<SummaryPage />}
                    />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
};
