import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Link} from 'react-router-dom';
import
{
    fetchCategoryById,
    uploadImage,
    removeImage,
    clearError,
    clearCurrentCategory
} from '../../../store/slices/category.slice';

const CategoryImage=() =>
{
    const dispatch=useDispatch();
    const {id}=useParams();
    const {currentCategory, loading, imageLoading, error}=useSelector(state => state.category);

    const [selectedFile, setSelectedFile]=useState(null);
    const [preview, setPreview]=useState(null);
    const [uploadSuccess, setUploadSuccess]=useState(false);
    const [dragActive, setDragActive]=useState(false);
    const fileInputRef=useRef(null);

    useEffect(() =>
    {
        dispatch(fetchCategoryById(id));

        return () =>
        {
            dispatch(clearCurrentCategory());
        };
    }, [dispatch, id]);

    // Generate preview for selected file
    useEffect(() =>
    {
        if (!selectedFile)
        {
            setPreview(null);
            return;
        }

        const reader=new FileReader();
        reader.onloadend=() =>
        {
            setPreview({name: selectedFile.name, url: reader.result});
        };
        reader.readAsDataURL(selectedFile);
    }, [selectedFile]);

    const handleFileSelect=(e) =>
    {
        const file=e.target.files?.[0];
        if (file)
        {
            setSelectedFile(file);
        }
    };

    const handleDrag=(e) =>
    {
        e.preventDefault();
        e.stopPropagation();
        if (e.type==='dragenter'||e.type==='dragover')
        {
            setDragActive(true);
        }
        else if (e.type==='dragleave')
        {
            setDragActive(false);
        }
    };

    const handleDrop=(e) =>
    {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file=e.dataTransfer.files?.[0];
        if (file&&file.type.startsWith('image/'))
        {
            setSelectedFile(file);
        }
    };

    const clearPreview=() =>
    {
        setSelectedFile(null);
        setPreview(null);
    };

    const handleUpload=async () =>
    {
        if (!selectedFile) return;

        const formData=new FormData();
        formData.append('image', selectedFile);

        const result=await dispatch(uploadImage({categoryId: id, formData}));

        if (!result.error)
        {
            setSelectedFile(null);
            setPreview(null);
            setUploadSuccess(true);
            dispatch(fetchCategoryById(id));
            setTimeout(() => setUploadSuccess(false), 3000);
        }
    };

    const handleDeleteImage=async () =>
    {
        if (window.confirm('Are you sure you want to delete this image?'))
        {
            await dispatch(removeImage(id));
            dispatch(fetchCategoryById(id));
        }
    };

    if (loading&&!currentCategory)
    {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#1a472a] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[#1a472a]">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    to="/admin/categories"
                    className="p-2 hover:bg-[#e6f4ea] rounded-lg transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-[#1a472a]">
                        Manage Image: {currentCategory?.name||'Category'}
                    </h2>
                    <p className="text-[#1a472a] text-sm">Upload a single image for this category</p>
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-700">{error}</span>
                    <button
                        onClick={() => dispatch(clearError())}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {uploadSuccess&&(
                <div className="bg-[#d4edda] border border-[#c3e6cb]  p-4 mb-6 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#1a472a]">Image uploaded successfully!</span>
                </div>
            )}

            {/* Current Image */}
            <div className="bg-white  shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Current Image</h3>

                {currentCategory?.imageUrl? (
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <img
                                src={currentCategory.imageUrl}
                                alt={currentCategory.name}
                                className="w-48 h-48 object-cover rounded-full border-4 border-[#1a472a]"
                            />
                            <button
                                onClick={handleDeleteImage}
                                disabled={imageLoading}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-[#fffcef] rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                title="Delete Image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-[#1a472a] mt-3">Click the delete icon to remove and upload a new image</p>
                    </div>
                ):(
                    <div className="text-center py-8 text-[#1a472a]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg font-medium mb-1">No image uploaded</p>
                        <p className="text-sm">Upload an image using the form below</p>
                    </div>
                )}
            </div>

            {/* Upload Section */}
            <div className="bg-white shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#1a472a] mb-4">
                    {currentCategory?.imageUrl? 'Replace Image':'Upload Image'}
                </h3>

                {/* Drop Zone */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed  p-8 text-center cursor-pointer transition ${dragActive
                        ? 'border-[#1a472a] bg-[#d4edda]'
                        :'border-[#1a472a]/80 hover:border-[#1a472a] hover:bg-[#1a472a20]'
                        }`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#1a472a] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[#1a472a] mb-1">
                        <span className="text-[#1a472a] font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[#1a472a] text-sm">PNG, JPG, WEBP up to 5MB</p>
                </div>

                {/* Preview Selected File */}
                {preview&&(
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-[#1a472a] mb-2">Selected File</h4>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="w-32 h-32 object-cover rounded-full border-2 border-[#1a472a]"
                                />
                                <button
                                    onClick={(e) =>
                                    {
                                        e.stopPropagation();
                                        clearPreview();
                                    }}
                                    className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-[#fffcef] rounded-full flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                            <div>
                                <p className="text-sm text-[#1a472a]">{preview.name}</p>
                                <button
                                    onClick={handleUpload}
                                    disabled={imageLoading}
                                    className="mt-2 px-6 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#153214] disabled:bg-[#1a472a80] transition flex items-center gap-2"
                                >
                                    {imageLoading? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Uploading...
                                        </>
                                    ):(
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            Upload Image
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Navigation */}
            <div className="mt-6 flex gap-3">
                <Link
                    to={`/admin/categories/edit/${id}`}
                    className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#153214] transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Category Details
                </Link>
                <Link
                    to="/admin/categories"
                    className="px-4 py-2 bg-[#fffcef] border-2 border-[#1a472a] text-[#1a472a] rounded-lg hover:bg-[#f0f0d8] transition"
                >
                    Back to Categories
                </Link>
            </div>
        </div>
    );
};

export default CategoryImage;
