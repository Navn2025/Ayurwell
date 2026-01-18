import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import
{
    submitContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    addContactReply,
    addContactReplyEnhanced, // ADDED THIS
    deleteContact
} from '../../api/contact.api';

// Async thunks
export const submitContactForm=createAsyncThunk(
    'contact/submitContactForm',
    async ({firstName, lastName, email, phone, subject, message}, {rejectWithValue}) =>
    {
        try
        {
            const response=await submitContact(firstName, lastName, email, phone, subject, message);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchAllContacts=createAsyncThunk(
    'contact/fetchAllContacts',
    async ({status, search, page=1, limit=10}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllContacts(status, search, page, limit);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchContactById=createAsyncThunk(
    'contact/fetchContactById',
    async (contactId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getContactById(contactId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const updateContact=createAsyncThunk(
    'contact/updateContact',
    async ({contactId, status}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateContactStatus(contactId, status);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const addReply=createAsyncThunk(
    'contact/addReply',
    async ({contactId, message}, {rejectWithValue}) =>
    {
        try
        {
            const response=await addContactReply(contactId, message);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchContactReplies=createAsyncThunk(
    'contact/fetchContactReplies',
    async (contactId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getContactById(contactId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// FIXED: Now uses the enhanced API endpoint
export const sendReplyToContact=createAsyncThunk(
    'contact/sendReplyToContact',
    async ({contactId, reply, customerEmail, customerName, sendEmail=true}, {rejectWithValue}) =>
    {
        try
        {
            const response=await addContactReplyEnhanced(
                contactId,
                reply,
                customerEmail,
                customerName,
                sendEmail
            );
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeContact=createAsyncThunk(
    'contact/removeContact',
    async (contactId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteContact(contactId);
            return {contactId, ...response};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Initial state
const initialState={
    contacts: [],
    currentContact: null,
    replies: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    },
    loading: false,
    repliesLoading: false,
    error: null,
    submitSuccess: false
};

// Slice
const contactSlice=createSlice({
    name: 'contact',
    initialState,
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearSuccess: (state) =>
        {
            state.submitSuccess=false;
        },
        clearCurrentContact: (state) =>
        {
            state.currentContact=null;
        }
    },
    extraReducers: (builder) =>
    {
        // Submit contact form
        builder
            .addCase(submitContactForm.pending, (state) =>
            {
                state.loading=true;
                state.submitSuccess=false;
            })
            .addCase(submitContactForm.fulfilled, (state) =>
            {
                state.loading=false;
                state.submitSuccess=true;
                state.error=null;
            })
            .addCase(submitContactForm.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||'Failed to submit contact form';
            });

        // Fetch all contacts
        builder
            .addCase(fetchAllContacts.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(fetchAllContacts.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.contacts=action.payload.contacts||[];
                state.pagination=action.payload.pagination;
                state.error=null;
            })
            .addCase(fetchAllContacts.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||'Failed to fetch contacts';
            });

        // Fetch single contact
        builder
            .addCase(fetchContactById.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(fetchContactById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentContact=action.payload.contact;
                state.error=null;
            })
            .addCase(fetchContactById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||'Failed to fetch contact';
            });

        // Update contact status
        builder
            .addCase(updateContact.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(updateContact.fulfilled, (state, action) =>
            {
                state.loading=false;
                if (state.currentContact&&state.currentContact.id===action.payload.contact.id)
                {
                    state.currentContact.status=action.payload.contact.status;
                }
                const index=state.contacts.findIndex(c => c.id===action.payload.contact.id);
                if (index!==-1)
                {
                    state.contacts[index].status=action.payload.contact.status;
                }
                state.error=null;
            })
            .addCase(updateContact.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||'Failed to update contact';
            });

// Fetch contact replies
        builder
            .addCase(fetchContactReplies.pending, (state) =>
            {
                state.repliesLoading=true;
                state.error=null;
            })
            .addCase(fetchContactReplies.fulfilled, (state, action) =>
            {
                state.repliesLoading=false;
                const fetchedReplies=action.payload.contact?.replies||[];
                state.replies=fetchedReplies;

                // Don't update currentContact to prevent infinite loop
                // Only update the replies state for the ReplySection component

                state.error=null;
            })
            .addCase(fetchContactReplies.rejected, (state, action) =>
            {
                state.repliesLoading=false;
                state.error=action.payload?.message||'Failed to fetch replies';
            });

        // Send reply to contact (ENHANCED)
        builder
            .addCase(sendReplyToContact.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(sendReplyToContact.fulfilled, (state, action) =>
            {
                state.loading=false;

                // The enhanced endpoint returns data.reply instead of just reply
                const newReply=action.payload.data?.reply||action.payload.reply;

                if (newReply)
                {
                    // Update current contact replies
                    if (state.currentContact&&state.currentContact.id===newReply.contactId)
                    {
                        state.currentContact.replies=state.currentContact.replies||[];
                        state.currentContact.replies.unshift(newReply);

                        // Update contact status if first reply
                        if (state.currentContact.replies.length===1)
                        {
                            state.currentContact.status="REPLIED";
                        }
                    }

                    // Update global replies state
                    state.replies.unshift(newReply);
                }

                state.error=null;
            })
            .addCase(sendReplyToContact.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||'Failed to send reply';
            });

        // Add reply (legacy)
        builder
            .addCase(addReply.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(addReply.fulfilled, (state, action) =>
            {
                state.loading=false;
                if (state.currentContact)
                {
                    state.currentContact.replies=state.currentContact.replies||[];
                    state.currentContact.replies.push(action.payload.reply);
                }
                state.error=null;
            })
            .addCase(addReply.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||'Failed to add reply';
            });

        // Delete contact
        builder
            .addCase(removeContact.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(removeContact.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.contacts=state.contacts.filter(c => c.id!==action.payload.contactId);
                if (state.currentContact?.id===action.payload.contactId)
                {
                    state.currentContact=null;
                }
                state.error=null;
            })
            .addCase(removeContact.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||'Failed to delete contact';
            });
    }
});

export const {clearError, clearSuccess, clearCurrentContact}=contactSlice.actions;
export default contactSlice.reducer;