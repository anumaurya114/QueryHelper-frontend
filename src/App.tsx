import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { RunQueryProvider } from './context/RunQueryContext';
import { LogsAndHistoryProvider } from './context/LogsAndHistoryContext';
import { SetupProvider } from './context/SetupContext';
import { AccountProvider } from './context/AccountCreationContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RunQueryPage from './pages/RunQueryPage';
import SetupPage from './pages/SetupPage';
import LogsAndHistoryPage from './pages/LogsAndHistory';
import Header from './components/Header';

import PrivateRoute from './utils/PrivateRoute';
import AccountCreationPage from './pages/AccountCreationPage';


function App() {
  return (
    <div className="App">
        <Router>
            <ChatProvider>
            <AuthProvider>
            <RunQueryProvider>
            <LogsAndHistoryProvider>
            <SetupProvider>
            <AccountProvider>
                <Header/>
                <Routes>
                    <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/run-query" element={<PrivateRoute><RunQueryPage/></PrivateRoute>}/>
                    <Route path="/setup" element={<PrivateRoute><SetupPage/></PrivateRoute>} />
                    <Route path="/logs" element={<PrivateRoute><LogsAndHistoryPage/></PrivateRoute>}/>
                    <Route path="/account-creation" element={<PrivateRoute><AccountCreationPage/></PrivateRoute>}/>
                </Routes>
            </AccountProvider>
            </SetupProvider>
            </LogsAndHistoryProvider>
            </RunQueryProvider>
            </AuthProvider>
            </ChatProvider>
        </Router>
    </div>
  );
}

export default App;