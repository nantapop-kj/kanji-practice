import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { ErrorBoundary } from '@/components';
import { AuthProvider, I18nProvider } from '@/contexts';
import { installGlobalErrorReporting } from '@/services';

installGlobalErrorReporting();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <I18nProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </AuthProvider>
            </I18nProvider>
        </ErrorBoundary>
    </StrictMode>,
);
