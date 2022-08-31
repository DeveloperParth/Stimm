import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { MantineProvider } from '@mantine/core';
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
import PostModal from './Components/Post/PostModal';
import WithOutNav from './Components/Layout/WithOutNav'
import WithNav from './Components/Layout/WithNav'
import NotifcationPage from './Pages/NotifcationPage';
import ResetPassword from './Components/ResetPassword';
import NotFoundPage from './Pages/NotFoundPage';
import ProfilePage from './Pages/ProfilePage';
import BookmarksPage from './Pages/BookmarksPage/BookmarksPage';
import VerifyEmailPage from './Components/VerifyEmailPage';

function App() {
  let location = useLocation();
  let state = location.state
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={themeObject}>
      <div className='main-container'>

        <Routes location={state?.location || location}>
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
            {<Route path="/" element={<Outlet />}>
              <Route index element={
                <ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/p/:id" element={<PostPage />} />
            </Route>}
            <Route path='/me' element={<ProfilePage />} exact />
            <Route path='/notifications' element={<NotifcationPage />} exact />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/u/:username/:tabValue" element={<UserPage />} exact />
            <Route path="/post" element={<CreatePost />} exact />
            <Route path="/bookmarks" element={<BookmarksPage />} exact />
          </Route>
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        {state?.location && (
          <Routes>
            <Route path="/p/:id" element={<PostModal />} />
          </Routes>
        )}
      </div>
    </MantineProvider>
  );
}
const themeObject = {
  colorScheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  // components: {
  //   Button: {
  //     styles: (theme, params) => ({
  //       root: {
  //         height: 42,
  //         padding: '0 30px',
  //         backgroundColor:
  //           params.variant === 'white' && theme.colorScheme === 'dark' ? params.color : theme.colors.dark[9]

  //       },
  //     }),
  //   }
  // }
}
export default App;
