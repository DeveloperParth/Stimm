import { Route, Routes, } from 'react-router-dom'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider, showNotification } from '@mantine/notifications';


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
import ProfilePage from './Pages/ProfilePage';
import BookmarksPage from './Pages/BookmarksPage/BookmarksPage';
import MessagesPage from './Pages/MessagesPage';
import SettingsPage from './Pages/SettingsPage';
import VerifyEmailPage from './Components/VerifyEmailPage';

import io from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from './Redux/Features/messageSlice';

const socket = io('http://localhost:5000');

function App() {
  const { user } = useSelector(state => state.auth)
  const { messages } = useSelector(state => state.message)
  const dispatch = useDispatch()
  useEffect(() => {
    user?._id && socket.emit('add user', user._id)
    socket.on('notification', (data) => {
      showNotification({
        title: data
      })
    })
    socket.on('message', (message) => {
      dispatch(addMessage(message))
    })
    return () => {
      socket.off('notificaiton');
      socket.off('message');
    };
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    messages.length && messages[messages.length - 1]?.sender === user._id && socket.emit('message', messages[messages.length - 1])
    // eslint-disable-next-line
  }, [messages.length])

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
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
              <Route path='/me' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
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
                <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>} />
            </Route>
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </div>
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
