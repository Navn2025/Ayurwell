import React, {useEffect, useState} from "react"
import {deleteReview, getProductReviews} from "../../../api/review.api"
import {rejectReview} from "../../../api/review.api"
import {useParams} from "react-router-dom"

const AdminProductReviews=() =>
{
    const params=useParams()
    const productId=params.productId
    console.log(productId)
    const [reviews, setReviews]=useState([])
    const [loading, setLoading]=useState(true)
    const [error, setError]=useState(null)

    useEffect(() =>
    {
        if (productId)
        {
            console.log('Loading reviews for productId:', productId);
            loadReviews();
        }
    }, [productId]);

    const loadReviews=async () =>
    {
        try
        {
            setLoading(true);
            const res=await getProductReviews(productId);
            console.log(res.reviews)
            setReviews(res.reviews||[]);
        } catch (err)
        {
            setError("Failed to load reviews");
        } finally
        {
            setLoading(false);
        }
    };

    const handleReject=async (id) =>
    {
        try
        {
            await rejectReview(id)
            await deleteReview(id)
            loadReviews()
        } catch (err)
        {
            alert("Failed to reject review")
        }
    }

    if (loading) return <p className="text-[#1a472a]">Loading reviews...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-4 bg-white shadow p-6">
            <h2 className="text-xl font-bold text-[#1a472a]">Product Reviews</h2>

            {reviews.length===0&&(
                <p className="text-[#1a472a]">No reviews found.</p>
            )}

            {reviews.map((r) => (
                <div
                    key={r.id}
                    className="border-2 bg-[#fffcef] border-[#1a472a] p-4 flex justify-between items-start"
                >
                    <div>
                        <p className="font-semibold text-[#1a472a] flex items-center gap-2 ">
                            {r.user.firstName} {r.user.lastName} —
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 text-[#1a472a]"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg> {r.rating}
                        </p>
                        <p className="text-sm text-[#1a472a]">{r.user.email}</p>
                        <p className="mt-2 text-[#1a472a]">{r.comment}</p>
                        <p className="text-xs mt-1">
                            Status:{" "}
                            <span
                                className={r.isApproved? "text-[#4caf50]":"text-red-600"}
                            >
                                {r.isApproved? "Approved":"Rejected"}
                            </span>
                        </p>
                    </div>

                    {r.isApproved&&(
                        <button
                            onClick={() => handleReject(r.id)}
                            className="text-red-600 font-medium hover:underline"
                        >
                            Reject
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}

export default AdminProductReviews
