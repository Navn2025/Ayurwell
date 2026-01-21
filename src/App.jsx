import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import {fetchCurrentUser} from './store/slices/auth.slice'
import {fetchCart} from './store/slices/cart.slice'
import MainRoutes from './routes/MainRoutes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


const App=() =>
{
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const location=useLocation()
  const {user, loading}=useSelector((state) => state.auth)

  useEffect(() =>
  {
    // Only fetch if user is not already loaded and not currently loading
    if (!user && !loading) {
      dispatch(fetchCurrentUser()).then((result) =>
      {
        if (result.payload?.user)
        {
          dispatch(fetchCart())
          // Check if profile is incomplete and user is not on complete-profile or logout routes
          if (!result.payload.user.isProfileComplete&&
            !location.pathname.includes('/complete-profile')&&
            !location.pathname.includes('/login')&&
            !location.pathname.includes('/register')&&
            location.pathname!=='/logout')
          {
            navigate('/complete-profile', {state: {from: location}})
          }
        }
      })
    }
  }, [dispatch, user, loading]) // Add user and loading to dependencies

  // Scroll to top on route change
  useEffect(() =>
  {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Routes that should show footer
  const footerRoutes = [
    '/',
    '/products',
    '/contact',
    '/faqs',
    '/about',
    '/privacy',
    '/terms',
    '/refund',
    '/shipping'
  ];

  // Check if current route should show footer
  const shouldShowFooter = footerRoutes.some(route => {
    if (route.includes(':')) {
      // Handle dynamic routes
      const routeParts = route.split('/');
      const pathParts = location.pathname.split('/');
      
      if (routeParts.length !== pathParts.length) return false;
      
      return routeParts.every((part, index) => {
        if (part.startsWith(':')) return true;
        return part === pathParts[index];
      });
    }
    return route === location.pathname;
  });

  return (
    <div className="app-root font-exo bg-[#fffcef] min-h-screen flex flex-col">
      {/* Hide navbar specifically for admin routes */}
      {location.pathname.startsWith('/admin') ? null : <Navbar />}
      <main className="flex-grow">
        <MainRoutes />
      </main>
      {/* Show footer only on specific routes */}
      {shouldShowFooter && !location.pathname.startsWith('/admin') ? <Footer /> : null}
    </div>
  )
}

export default App