// Reviews
import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

// Layout
import AdminLayout from './components/AdminLayout';

// Dashboard
import Dashboard from './Dashboard';

// Products
import ProductsList from './components/products/ProductsList';
import AddProduct from './components/products/AddProduct';
import EditProduct from './components/products/EditProduct';
import ProductImages from './components/products/ProductImages';
import ProductFAQs from './components/products/ProductFAQs';
import ProductDirections from './components/products/ProductDirections';

// Categories
import CategoriesList from './components/category/CategoriesList';
import AddCategory from './components/category/AddCategory';
import EditCategory from './components/category/EditCategory';
import CategoryImage from './components/category/CategoryImage';

// Concerns
import ConcernsList from './components/concern/ConcernsList';
import AddConcern from './components/concern/AddConcern';
import EditConcern from './components/concern/EditConcern';
import ConcernImages from './components/concern/ConcernImages';

// Orders
import OrdersList from './components/orders/OrdersList';
import OrderDetails from './components/orders/OrderDetails';

// Users
import UsersList from './components/users/UsersList';
import UserDetails from './components/users/UserDetails';

// Payments
import PaymentsList from './components/payments/PaymentsList';
import PaymentDetails from './components/payments/PaymentDetails';

// Refunds
import RefundsList from './components/refund/RefundsList';
import ProcessRefund from './components/refund/ProcessRefund';

// Returns
import ReturnsList from './components/returns/ReturnsList';
import ReturnDetails from './components/returns/ReturnDetails';

// Shipments
import ShipmentsList from './components/shipment/ShipmentsList';
import ShipmentDetails from './components/shipment/ShipmentDetails';

// COD
import CODSettlement from './components/cod/CODSettlement';
import AdminProductReviews from './components/products/ProductReviews';

// Contacts
import ContactsList from './components/contact/ContactsList';
// Placeholder for ContactDetail (to be created if not present)
import ContactDetail from './components/contact/ContactDetail';

// Protected Route Component
const ProtectedAdminRoute=({children}) =>
{
    const {user, isAuthenticated, loading}=useSelector(state => state.auth);

    // Wait for auth state to be determined
    if (loading)
    {
        return <div className="admin-loading">Loading...</div>;
    }

    if (!isAuthenticated)
    {
        return <Navigate to="/login" replace />;
    }

    if (user?.role!=='ADMIN'&&user?.role!=='SUPER_ADMIN')
    {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AdminRoutes=() =>
{
    return (
        <ProtectedAdminRoute>
            <Routes>
                <Route element={<AdminLayout />}>
                    {/* Default redirect to dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />

                    {/* Dashboard */}
                    <Route path='dashboard' element={<Dashboard />} />

                    {/* Products */}
                    <Route path="products" element={<ProductsList />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="products/edit/:productId" element={<EditProduct />} />
                    <Route path="products/:productId/images" element={<ProductImages />} />
                    <Route path="products/:productId/faqs" element={<ProductFAQs />} />
                    <Route path="products/:productId/directions" element={<ProductDirections />} />
                    <Route path="products/:productId/reviews" element={<AdminProductReviews />} />

                    {/* Categories */}
                    <Route path="categories" element={<CategoriesList />} />
                    <Route path="categories/add" element={<AddCategory />} />
                    <Route path="categories/edit/:categoryId" element={<EditCategory />} />
                    <Route path="categories/:id/image" element={<CategoryImage />} />

                    {/* Concerns */}
                    <Route path="concerns" element={<ConcernsList />} />
                    <Route path="concerns/add" element={<AddConcern />} />
                    <Route path="concerns/edit/:concernId" element={<EditConcern />} />
                    <Route path="concerns/:concernId/images" element={<ConcernImages />} />

                    {/* Orders */}
                    <Route path="orders" element={<OrdersList />} />
                    <Route path="orders/:orderId" element={<OrderDetails />} />

                    {/* Users */}
                    <Route path="users" element={<UsersList />} />
                    <Route path="users/:userId" element={<UserDetails />} />

                    {/* Payments */}
                    <Route path="payments" element={<PaymentsList />} />
                    <Route path="payments/:paymentId" element={<PaymentDetails />} />

                    {/* Refunds */}
                    <Route path="refunds" element={<RefundsList />} />
                    <Route path="refunds/:refundId" element={<ProcessRefund />} />
                    <Route path="refunds/:refundId/process" element={<ProcessRefund />} />

                    {/* Returns */}
                    <Route path="returns" element={<ReturnsList />} />
                    <Route path="returns/:returnId" element={<ReturnDetails />} />

                    {/* Shipments */}
                    <Route path="shipments" element={<ShipmentsList />} />
                    <Route path="shipments/:shipmentId" element={<ShipmentDetails />} />

                    {/* Contacts */}
                    <Route path="contacts" element={<ContactsList />} />
                    <Route path="contacts/:contactId" element={<ContactDetail />} />

                    {/* Reviews */}

                    {/* COD */}
                    <Route path="cod" element={<CODSettlement />} />

                    {/* Default - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Route>
            </Routes>
        </ProtectedAdminRoute>
    );
};

export default AdminRoutes;
