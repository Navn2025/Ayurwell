import React, {Suspense, lazy} from 'react'
import {Route, Routes} from 'react-router-dom'

const Login=lazy(() => import('../pages/Auth/Login'));
const Register=lazy(() => import('../pages/Auth/Register'));
const CompleteProfile=lazy(() => import('../pages/Auth/CompleteProfile'));
const ForgotPassword=lazy(() => import('../pages/Auth/ForgotPassword'));
const ResetPassword=lazy(() => import('../pages/Auth/ResetPassword'));
const Address=lazy(() => import('../pages/addresses/Addresses'));
const Home=lazy(() => import('../pages/Home/Home'));
const ConcernProducts=lazy(() => import('../pages/Products/ConcernProducts'));
const CategoryProducts=lazy(() => import('../pages/Products/CategoryProducts'));
const ProductDetail=lazy(() => import('../pages/Products/ProductDetail'));
const Products=lazy(() => import('../pages/Products/Products'));
const SearchResults=lazy(() => import('../pages/Search/SearchResults'));
const Cart=lazy(() => import('../pages/Cart/Cart'));
const Checkout=lazy(() => import('../pages/Checkout/Checkout'));
const OrderSuccess=lazy(() => import('../pages/Order/OrderSuccess'));
const Orders=lazy(() => import('../pages/Order/Orders'));
const OrderDetail=lazy(() => import('../pages/Order/OrderDetail'));
const TrackOrder=lazy(() => import('../pages/Order/TrackOrder'));
const Concerns=lazy(() => import('../pages/Concerns'));
const ReturnRequest=lazy(() => import('../pages/Returns/ReturnRequest'));
const ReturnTracking=lazy(() => import('../pages/Returns/ReturnTracking'));


const AdminRoutes=lazy(() => import('../Admin/AdminRoutes'))


const Contact=lazy(() => import('../pages/contact/Contact'));
const Profile=lazy(() => import('../pages/profile/Profile'));
const PrivacyPolicy=lazy(() => import('../pages/Legal/PrivacyPolicy'));
const TermsConditions=lazy(() => import('../pages/Legal/TermsConditions'));
const RefundPolicy=lazy(() => import('../pages/RefundPolicy'));
const ShippingPolicy=lazy(() => import('../pages/ShippingPolicy'));
const FAQ=lazy(() => import('../pages/FAQ'));
const AboutUs=lazy(() => import('../pages/AboutUs'));

const MainRoutes=() =>
{
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-[#fffcef]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1a472a]"></div>
        </div>}>
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/complete-profile' element={<CompleteProfile />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/addresses' element={<Address />} />
                <Route path='/products' element={<Products />} />
                <Route path='/concern/:slug' element={<ConcernProducts />} />
                <Route path='/category/:slug' element={<CategoryProducts />} />
                <Route path='/product/:slug' element={<ProductDetail />} />
                <Route path='/search' element={<SearchResults />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/order/:orderId' element={<OrderDetail />} />
                <Route path='/track/:orderId' element={<TrackOrder />} />
                <Route path='/order-success/:orderId' element={<OrderSuccess />} />
                <Route path='/concerns' element={<Concerns />} />
                <Route path='/return/request/:orderId' element={<ReturnRequest />} />
                <Route path='/return/track/:returnId' element={<ReturnTracking />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/privacy' element={<PrivacyPolicy />} />
                <Route path='/terms' element={<TermsConditions />} />
                <Route path='/refund' element={<RefundPolicy />} />
                <Route path='/shipping' element={<ShippingPolicy />} />
                <Route path='/faqs' element={<FAQ />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/' element={<Home />} />
            </Routes>
        </Suspense>
    );
}

export default MainRoutes