import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/i18n';
import { installGlobalErrorReporting } from '@/services/error-reporter';

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
