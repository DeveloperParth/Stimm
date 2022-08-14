import { Route, Routes } from 'react-router-dom'
import AuthRoute from './Components/AuthRoute';
import HomePage from './Pages/HomePage';
import LoginPage from "./Pages/LoginPage";
import PostPage from './Pages/PostPage';
import ProtectedRoute from './Components/ProtectedRoute';
import UserPage from './Pages/UserPage';
import SignupPage from './Pages/SignupPage';
import { MantineProvider } from '@mantine/core';
import ForgotPage from './Pages/ForgotPage';
import CreatePost from './Components/CreatePost';
function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'dark',
      }}>
      <Routes>
        <Route path="/login" element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <SignupPage />
          </AuthRoute>
        } />
        <Route path="/forgot" element={
          <AuthRoute>
            <ForgotPage />
          </AuthRoute>
        } />
        <Route path="/p/:id" element={<PostPage />} />
        <Route path="/u/:username" element={<UserPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } exact />
        <Route path="/post" element={
          <CreatePost />
        } exact />
      </Routes>
    </MantineProvider>
  );
}

export default App;
