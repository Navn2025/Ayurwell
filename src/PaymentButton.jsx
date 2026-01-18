import React from "react";
import
{
    createOrder,
    initiatePayment,
    verifyPayment,
} from "./actions/payment.action";

const PaymentButton=({
    productId,
    quantity=1,
    paymentMethod,
    addressId,
}) =>
{
    const handlePayment=async () =>
    {
        try
        {
            // 1️⃣ Create Order in DB
            const orderRes=await createOrder(
                productId,
                quantity,
                paymentMethod,
                addressId
            );

            const order=orderRes.data.order;
            const orderId=order.id;

            // 🟡 COD FLOW (NO RAZORPAY)
            if (paymentMethod==="COD")
            {
                alert("Order placed successfully (Cash on Delivery)");
                return;
            }

            // 2️⃣ Initiate Razorpay Payment
            const initiateRes=await initiatePayment(orderId);
            const {razorpayOrder}=initiateRes.data;

            // 3️⃣ Razorpay Checkout Options
            const options={
                key: import.meta.env.VITE_RAZORPAY_KEY_ID||"rzp_test_RPQuhLeDmJw6UR", // ✅ env key
                amount: razorpayOrder.amount, // paise
                currency: razorpayOrder.currency,
                name: "Ayurwell",
                description: "Order Payment",
                order_id: razorpayOrder.id,

                handler: async (response) =>
                {
                    const {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                    }=response;

                    // 4️⃣ Verify Payment
                    await verifyPayment({
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                    });

                    alert("Payment Successful!");
                },

                prefill: {
                    name: "Ayurwell Customer",
                    email: "customer@example.com",
                    contact: "9999999999",
                },

                theme: {
                    color: "#3399cc",
                },
            };

            // 5️⃣ Open Razorpay Checkout
            const rzp=new window.Razorpay(options);
            rzp.open();
        } catch (error)
        {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <button
            onClick={handlePayment}
            style={{
                padding: "12px 20px",
                background: "#3399cc",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
            }}
        >
            Pay Now
        </button>
    );
};

export default PaymentButton;
