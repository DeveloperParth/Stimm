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
import SearchPage from './Pages/SearchPage';
import VerifyEmailPage from './Components/VerifyEmailPage';

import io from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminRoutes } from './Admin';
import MessagePage from './Pages/MessagePage';
import { useLocalStorage } from '@mantine/hooks';
import AboutPage from './Pages/Static/AboutPage';
import ContactPage from './Pages/Static/ContactPage';
import PrivacyPage from './Pages/Static/PrivacyPage';
import { addToNotification, setNotificationCount } from './Redux/Features/notificationSlice';
import { getNotificationsCount } from './Services/Services';
import TermsPage from './Pages/Static/TermsPage';

export const socket = io(process.env.REACT_APP_SOCKET_URL);

function App() {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const fetchCount = async () => {
    const { data } = await getNotificationsCount()
    dispatch(setNotificationCount(data.count))
  }
  useEffect(() => {
    user?._id && socket.emit('add user', user._id)
    user?._id && fetchCount()
    socket.on('notification', (data) => {
      dispatch(addToNotification())
      showNotification({
        title: data
      })
    })
    socket.on('message', (message) => {
      const id = window.location.pathname.split('messages/')[1]
      console.log(id);
      if (!id || id !== message.converstion) {
        console.log('if ran');
        showNotification({ title: `${message.sender.username} send a message`, message: message.message })
      }
    })
    return () => {
      socket.off('notificaiton');
      socket.off('message');
    };
    // eslint-disable-next-line
  }, [socket])

  return (
    <Provider>
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
            <Route path="/forgot/verify/:id/:token" element={
              <>
                <ResetPassword />
              </>} />
          </Route>
          <Route element={<WithNav />}>
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/p/:id" element={<PostPage />} />
            <Route path='/notifications' element={<ProtectedRoute><NotifcationPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/search" element={<SearchPage />} />
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
          <Route path='/about' element={<AboutPage />} />
          <Route path='/tos' element={<TermsPage />} />
          <Route path='/privacy' element={<PrivacyPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
    </Provider>
  );
}
function Provider({ children }) {
  const [theme] = useLocalStorage({
    key: 'theme',
    defaultValue: { colorScheme: 'dark', color: 'blue' }
  })
  return <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{
      colorScheme: theme.colorScheme,
      primaryColor: theme.color,
      components: {
        Container: {
          styles: (theme, params) => ({
            root: {
              width: '100%',
              margin: 0,
            },
          })
        }
      }
    }}>

    <NotificationsProvider>
      <ModalsProvider>
        {children}
      </ModalsProvider>
    </NotificationsProvider>
  </MantineProvider >
}
export default App;
