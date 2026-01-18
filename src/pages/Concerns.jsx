
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllConcerns} from "../store/slices/concern.slice";
import ConcernCard from "../components/Home/ConcernCard";
import {useNavigate} from "react-router-dom";
import "./Concerns.css";


const Concerns=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {concerns, loading, error}=useSelector((state) => state.concern);

    useEffect(() =>
    {
        dispatch(fetchAllConcerns(false));
    }, [dispatch]);

    const handleConcernClick=(concern) =>
    {
        navigate(`/concern/${concern.slug||concern.id}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="concerns-page">
            <h2>All Concerns</h2>
            <div className="concerns-list">
                {concerns&&concerns.length>0? (
                    concerns.map((concern) => (
                        <ConcernCard
                            key={concern.id}
                            name={concern.name}
                            image={concern.imageUrl||"/placeholder.png"}
                            onClick={() => handleConcernClick(concern)}
                        />
                    ))
                ):(
                    <div>No concerns found.</div>
                )}
            </div>
        </div>
    );
};

export default Concerns;
