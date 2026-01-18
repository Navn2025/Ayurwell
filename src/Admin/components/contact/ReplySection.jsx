import React, {useState, useEffect, useRef, memo} from 'react'
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import {sendReplyToContact, fetchContactReplies} from '../../../store/slices/contact.slice'

const ReplySection=({contactId, customerEmail, customerName}) =>
{
    const dispatch=useDispatch()

    // FIX: Use shallowEqual to prevent unnecessary re-renders when selecting multiple values
    const {replies, repliesLoading, error}=useSelector(
        state => ({
            replies: state.contact.replies,
            repliesLoading: state.contact.repliesLoading,
            error: state.contact.error
        }),
        shallowEqual
    )

    const [replyText, setReplyText]=useState('')
    const [isSending, setIsSending]=useState(false)
    const [showReplyForm, setShowReplyForm]=useState(false)
    const [toast, setToast]=useState(null)

    // Use ref to track if we've already fetched replies for this contact
    const fetchedContactId=useRef(null)

    console.log('🏗️ ReplySection render - showReplyForm:', showReplyForm, 'contactId:', contactId)

    // Fetch replies when component mounts or contactId changes
    useEffect(() =>
    {
        if (contactId&&fetchedContactId.current!==contactId)
        {
            console.log('📋 Fetching replies for new contactId:', contactId)
            dispatch(fetchContactReplies(contactId))
            fetchedContactId.current=contactId
        }
    }, [contactId]) // Remove dispatch from dependencies to prevent re-renders



    const showToast=(message, type='info') =>
    {
        setToast({message, type})
        setTimeout(() => setToast(null), 5000)
    }

    const handleSubmitReply=async () =>
    {
        console.log('🔍 Reply submission attempt:', {
            contactId,
            customerEmail,
            customerName,
            replyText: replyText.trim()
        })

        const trimmedReply=replyText.trim()
        if (!trimmedReply||trimmedReply.length<5)
        {
            showToast('Reply message must be at least 5 characters', 'error')
            return
        }

        setIsSending(true)
        console.log('📤 Sending reply to API...')

        try
        {
            const result=await dispatch(sendReplyToContact({
                contactId,
                reply: trimmedReply,
                customerEmail,
                customerName,
                sendEmail: true
            })).unwrap()
            console.log('✅ Reply sent successfully:', result)
            setReplyText('')

            // Show success toast
            showToast('Reply sent successfully!', 'success')

            // Refresh replies
            await dispatch(fetchContactReplies(contactId))

            // Note: NOT hiding the form anymore so user can send another reply if needed
            // If you want to hide it, uncomment the line below:
            // setShowReplyForm(false)

        } catch (error)
        {
            console.error('❌ Failed to send reply:', {
                error: error.message,
                response: error.response,
                status: error.response?.status
            })

            const errorMessage=error?.message||'Failed to send reply. Please try again.'
            showToast(errorMessage, 'error')
        } finally
        {
            setIsSending(false)
        }
    }

    const formatDate=(dateString) =>
    {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <>
            {/* Toast Notification */}
            {toast&&(
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${toast.type==='success'? 'bg-green-500':
                    toast.type==='error'? 'bg-red-500':
                        'bg-blue-500'
                    } text-white`}>
                    <div className="flex items-center gap-2">
                        <span>{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-2 text-white hover:text-gray-200 font-bold text-lg"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
                {/* Reply Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-[#1a472a]">Customer Communication</h3>
                    <button
                        type="button"
                        onClick={() =>
                        {
                            console.log('🔘 Toggle clicked - current showReplyForm:', showReplyForm)
                            const newState=!showReplyForm
                            console.log('🔘 Setting showReplyForm to:', newState)
                            setShowReplyForm(newState)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l18 18M21 10H11a8 8 0 00-8 8v2" />
                        </svg>
                        {showReplyForm? 'Hide':'Send'} Reply
                    </button>
                </div>

                {/* Reply Form */}
                {showReplyForm&&(
                    <div className="mb-6 p-4 border-2 border-[#e5e7eb] rounded-lg bg-[#f9fafb]">
                        <h4 className="text-lg font-medium text-[#1a472a] mb-4">Send Reply to Customer</h4>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Reply
                                </label>
                                <textarea
                                    id="reply"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) =>
                                    {
                                        if (e.key==='Enter'&&e.ctrlKey&&!isSending&&replyText.trim())
                                        {
                                            handleSubmitReply()
                                        }
                                    }}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a] resize-none"
                                    placeholder="Type your reply to the customer..."
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Reply will be sent to: <span className="font-medium text-[#1a472a]">{customerEmail}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSubmitReply}
                                    disabled={isSending||!replyText.trim()}
                                    className="flex items-center gap-2 px-6 py-2 bg-[#1a472a] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#14532d] transition-colors"
                                >
                                    {isSending? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                                                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                                            </svg>
                                            Sending...
                                        </>
                                    ):(
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Send Reply
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error&&(
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Failed to send reply</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Replies History */}
                <div className="mt-6">
                    <h4 className="text-lg font-medium text-[#1a472a] mb-4">Reply History</h4>

                    {repliesLoading&&(
                        <div className="flex items-center justify-center py-8">
                            <svg className="animate-spin h-6 w-6 text-[#1a472a]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                            </svg>
                            <span className="ml-2 text-[#4a7c59]">Loading replies...</span>
                        </div>
                    )}

                    {!repliesLoading&&(!replies||replies.length===0)&&(
                        <div className="text-center py-8 text-gray-500">
                            <svg
                                className="w-12 h-12 mx-auto text-gray-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <p>No replies sent yet</p>
                            <p className="text-sm mt-2">Click "Send Reply" to start the conversation.</p>
                        </div>
                    )}

                    {!repliesLoading&&replies&&replies.length>0&&(
                        <div className="space-y-4">
                            {replies.map((reply, index) => (
                                <div
                                    key={reply.id}
                                    className={`p-4 rounded-lg border ${index===0? 'bg-[#f0f9ff] border-[#bfdbfe]':'bg-white border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-[#1a472a] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                {reply.user?.firstName?.charAt(0)||'A'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-[#1a472a]">
                                                    {reply.user?.firstName} {reply.user?.lastName}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {formatDate(reply.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${index===0
                                            ? 'bg-blue-100 text-blue-800'
                                            :'bg-gray-100 text-gray-800'
                                            }`}>
                                            {index===0? 'Latest Reply':`Reply #${replies.length-index}`}
                                        </span>
                                    </div>

                                    <div className="mt-3 text-gray-700 whitespace-pre-wrap">
                                        {reply.message}
                                    </div>

                                    {reply.emailSentAt&&(
                                        <div className="mt-2 pt-3 border-t border-gray-200">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Email sent to customer on {formatDate(reply.emailSentAt)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default memo(ReplySection)