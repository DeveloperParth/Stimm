import { Route, Routes, } from 'react-router-dom'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider, showNotification } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals'


import AuthRoute from './Components/AuthRoute';
import ProtectedRoute from './Components/ProtectedRoute';
import HomePage from './Pages/HomePage';
import LoginPage from "./Pages/LoginPage";
import PostPage from './Pages/PostPage';
import UserPage from './Pages/UserPage';
import SignupPage from './Pages/SignupPage';
import ForgotPage from './Pages/ForgotPage';
import ExplorePage from './Pages/ExplorePage'

import CreatePost from './Components/Post/CreatePost';
import WithOutNav from './Components/Layout/WithOutNav'
import WithNav from './Components/Layout/WithNav'
import NotifcationPage from './Pages/NotifcationPage';
import ResetPassword from './Components/ResetPassword';
import NotFoundPage from './Pages/NotFoundPage';
import BookmarksPage from './Pages/BookmarksPage/BookmarksPage';
import MessagesPage from './Pages/MessagesPage';
import SettingsPage from './Pages/SettingsPage';
import VerifyEmailPage from './Components/VerifyEmailPage';

import io from 'socket.io-client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AdminRoutes } from './Admin';
import MessagePage from './Pages/MessagePage';

export const socket = io(process.env.REACT_APP_SOCKET_URL);

function App() {
  const { user } = useSelector(state => state.auth)
  useEffect(() => {
    user?._id && socket.emit('add user', user._id)
    socket.on('notification', (data) => {
      console.log(data);
      showNotification({
        title: data
      })
    })
    socket.on('message', (message) => {
    })
    return () => {
      socket.off('notificaiton');
      socket.off('message');
    };
    // eslint-disable-next-line
  }, [])

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        // primaryColor: "green",
        colorScheme: 'dark',
        components: {
          Container: {
            styles: (theme, params) => ({
              root: {
                width: '100%',
                margin: 0,
                // paddingLeft: theme.spacing.xs,
                // paddingRight: theme.spacing.xs


              },
            })
          }
        }
      }}>

      <NotificationsProvider>
        <ModalsProvider>
          <div className='main-container'>
            <Routes >
              <Route element={<WithOutNav />}>
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
                <Route path="/verify/:id/:token" element={<AuthRoute>
                  <VerifyEmailPage />
                </AuthRoute>} />
                <Route path="/forgot" element={
                  <AuthRoute>
                    <ForgotPage />
                  </AuthRoute>
                } />
                <Route path="/forgot/:id/:token" element={
                  <AuthRoute>
                    <ResetPassword />
                  </AuthRoute>} />
              </Route>
              <Route element={<WithNav />}>
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/p/:id" element={<PostPage />} />
                <Route path='/notifications' element={<ProtectedRoute><NotifcationPage /></ProtectedRoute>} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/u/:username/:tabValue" element={<UserPage />} />
                <Route path="/post" element={
                  <ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="/bookmarks" element={
                  <ProtectedRoute>
                    <BookmarksPage />
                  </ProtectedRoute>} />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>} />
                <Route path="/messages/:id" element={
                  <ProtectedRoute>
                    <MessagePage />
                  </ProtectedRoute>} />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>} />
              </Route>
              <Route path='/admin/*' element={<AdminRoutes />} />
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </div>
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider >
  );
}
// const themeObject = {
//   colorScheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
//   components: {
//     Container: {
//       styles: (theme, params) => ({
//         root: {
//           width: theme.breakPoints,
//           margin: 0
//         }
//       })
//     }
//   }
// }
export default App;
