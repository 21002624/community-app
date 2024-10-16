import { useState } from 'react'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LogInPage'
import { Routes , Route } from 'react-router-dom'
import Sidebar from './components/common/SideBar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage/>}/>
				<Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
			</Routes>
      <RightPanel />
		</div>
  )
}

export default App
