import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Link} from 'react-router-dom';
import {fetchContactById, clearCurrentContact} from '../../../store/slices/contact.slice';
import ReplySection from './ReplySection';

const ContactDetail=() =>
{
    const {contactId}=useParams();
    const dispatch=useDispatch();
    const {currentContact, loading, error}=useSelector(state => state.contact);

    useEffect(() =>
    {
        dispatch(fetchContactById(contactId));
        return () =>
        {
            dispatch(clearCurrentContact());
        };
    }, [dispatch, contactId]);

    if (loading)
    {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="relative w-12 h-12 mx-auto mb-4">
                        <svg className="w-full h-full animate-spin" viewBox="0 0 24 24" fill="none" stroke="#1a472a" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" opacity="0.2" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                    </div>
                    <p className="text-[#4a7c59]">Loading contact details...</p>
                </div>
            </div>
        );
    }

    if (error)
    {
        return (
            <div className="p-6 text-center text-red-600">{error}</div>
        );
    }

    if (!currentContact)
    {
        return (
            <div className="p-6 text-center text-[#4a7c59]">Contact not found.</div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Link to="/admin/contacts" className="text-[#1a472a] hover:text-[#14532d]">← Back to Contacts</Link>
            <h2 className="text-2xl font-bold text-[#1a472a] mt-4 mb-6">Contact Details</h2>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="mb-4">
                    <span className="font-semibold text-[#1a472a]">From:</span> {currentContact.firstName} {currentContact.lastName}
                </div>
                <div className="mb-2">
                    <span className="font-semibold text-[#1a472a]">Email:</span> {currentContact.email}
                </div>
                <div className="mb-2">
                    <span className="font-semibold text-[#1a472a]">Phone:</span> {currentContact.phone}
                </div>
                <div className="mb-2">
                    <span className="font-semibold text-[#1a472a]">Subject:</span> {currentContact.subject}
                </div>
                <div className="mb-2">
                    <span className="font-semibold text-[#1a472a]">Status:</span> <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{currentContact.status}</span>
                </div>
                <div className="mb-2">
                    <span className="font-semibold text-[#1a472a]">Date:</span> {new Date(currentContact.createdAt).toLocaleString('en-IN')}
                </div>
                <div className="mb-2">
                    <span className="font-semibold text-[#1a472a]">Message:</span>
                    <div className="bg-[#f6f8f6] rounded p-3 mt-1 text-[#1a472a] whitespace-pre-line">{currentContact.message}</div>
                </div>
</div>
            
            {/* Reply Section */}
            <ReplySection 
                contactId={contactId}
                customerEmail={currentContact.email}
                customerName={`${currentContact.firstName} ${currentContact.lastName}`}
            />
        </div>
    );
};

export default ContactDetail;
