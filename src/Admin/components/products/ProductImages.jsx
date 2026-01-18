import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Link} from 'react-router-dom';
import
{
    fetchProductById,
    fetchProductImages,
    uploadImages,
    removeImage,
    removeAllImages,
    setPrimaryImage,
    clearError as clearProductError
} from '../../../store/slices/product.slice';

const ProductImages=() =>
{
    const dispatch=useDispatch();
    const {productId}=useParams();
    const {currentProduct, images, loading, error}=useSelector(state => state.product);

    const [selectedFiles, setSelectedFiles]=useState([]);
    const [previews, setPreviews]=useState([]);
    const [uploadSuccess, setUploadSuccess]=useState(false);
    const [dragActive, setDragActive]=useState(false);
    const [uploading, setUploading]=useState(false);
    const fileInputRef=useRef(null);

    useEffect(() =>
    {
        if (productId)
        {
            dispatch(fetchProductById(productId));
            dispatch(fetchProductImages(productId));
        }
    }, [dispatch, productId]);

    // Generate previews for selected files
    useEffect(() =>
    {
        if (selectedFiles.length===0)
        {
            setPreviews([]);
            return;
        }

        const newPreviews=[];
        selectedFiles.forEach(file =>
        {
            const reader=new FileReader();
            reader.onloadend=() =>
            {
                newPreviews.push({name: file.name, url: reader.result});
                if (newPreviews.length===selectedFiles.length)
                {
                    setPreviews([...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [selectedFiles]);

    const handleFileSelect=(e) =>
    {
        const files=Array.from(e.target.files);
        if (files.length>0)
        {
            setSelectedFiles(prev => [...prev, ...files]);
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

        const files=Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );
        if (files.length>0)
        {
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removePreview=(index) =>
    {
        setSelectedFiles(prev => prev.filter((_, i) => i!==index));
    };

    const handleUpload=async () =>
    {
        if (selectedFiles.length===0) return;

        setUploading(true);
        const formData=new FormData();
        selectedFiles.forEach(file =>
        {
            formData.append('images', file);
        });

        const result=await dispatch(uploadImages({productId, formData}));

        if (!result.error)
        {
            setSelectedFiles([]);
            setPreviews([]);
            setUploadSuccess(true);
            dispatch(fetchProductImages(productId));
            setTimeout(() => setUploadSuccess(false), 3000);
        }
        setUploading(false);
    };

    const handleDeleteImage=async (imageId) =>
    {
        if (window.confirm('Are you sure you want to delete this image?'))
        {
            await dispatch(removeImage(imageId));
            dispatch(fetchProductImages(productId));
        }
    };

    const handleDeleteAllImages=async () =>
    {
        if (window.confirm('Are you sure you want to delete ALL images? This cannot be undone.'))
        {
            await dispatch(removeAllImages(productId));
            dispatch(fetchProductImages(productId));
        }
    };

    const handleSetPrimary=async (imageId) =>
    {
        await dispatch(setPrimaryImage({productId, imageId}));
    };

    if (loading&&!currentProduct)
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
                    to="/admin/products"
                    className="p-2 hover:bg-[#e6f4ea] rounded-lg transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-[#1a472a]">
                        Product Images: {currentProduct?.name||'Product'}
                    </h2>
                    <p className="text-[#1a472a] text-sm">Upload and manage images for this product</p>
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-700">{error}</span>
                    <button
                        onClick={() => dispatch(clearProductError())}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {uploadSuccess&&(
                <div className="bg-[#e6f4ea] border border-[#4a6b3b] rounded-lg p-4 mb-6 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4a6b3b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#4a6b3b]">Images uploaded successfully!</span>
                </div>
            )}

            {/* Upload Section */}
            <div className="bg-white  shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Upload New Images</h3>

                {/* Drop Zone */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed  p-8 text-center cursor-pointer transition ${dragActive
                        ? 'border-[#4a6b3b] bg-[#e6f4ea] hover:bg-[#1a472a]/10'
                        :'border-[#1a472a] hover:border-[#4a6b3b] hover:bg-[#1a472a]/20'
                        }`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#1a472a] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[#1a472a] mb-1">
                        <span className="text-[#1a472a] font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[#1a472a] text-sm">PNG, JPG, WEBP up to 5MB each</p>
                </div>

                {/* Preview Selected Files */}
                {previews.length>0&&(
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-[#1a472a] mb-2">Selected Files ({previews.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="w-full h-24 object-cover "
                                    />
                                    <button
                                        onClick={(e) =>
                                        {
                                            e.stopPropagation();
                                            removePreview(index);
                                        }}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-[#fffcef] rounded-full p-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                    <p className="text-xs text-[#1a472a] truncate mt-1">{preview.name}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="mt-4 px-6 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#4a6b3b] disabled:bg-[#4a6b3b] transition flex items-center gap-2"
                        >
                            {uploading? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Uploading...
                                </>
                            ):(
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Upload {previews.length} Image{previews.length>1? 's':''}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Current Images */}
            <div className="bg-white shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#1a472a]">
                        Current Images ({images?.length||0})
                    </h3>
                    {images&&images.length>0&&(
                        <button
                            onClick={handleDeleteAllImages}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500 text-[#fffcef] text-sm rounded-lg hover:bg-red-600 disabled:bg-red-300 transition flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete All
                        </button>
                    )}
                </div>

                {images&&images.length>0? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {images.map(image => (
                            <div
                                key={image.id}
                                className={`relative group  overflow-hidden border-2 ${image.isPrimary? 'border-[#1a472a]':'border-transparent'
                                    }`}
                            >
                                <img
                                    src={image.imageUrl}
                                    alt={image.altText||'Product image'}
                                    className="w-full h-32 object-cover"
                                />

                                {/* Primary Badge */}
                                {image.isPrimary&&(
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-[#1a472a] text-[#fffcef] text-xs rounded-full">
                                        Primary
                                    </span>
                                )}

                                {/* Position Badge */}
                                <span className="absolute top-2 right-2 px-2 py-1 bg-[#1a472a] text-[#fffcef] text-xs rounded-full">
                                    #{image.position+1}
                                </span>

                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                    {!image.isPrimary&&(
                                        <button
                                            onClick={() => handleSetPrimary(image.id)}
                                            disabled={loading}
                                            className="p-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#15381f] transition"
                                            title="Set as Primary"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteImage(image.id)}
                                        disabled={loading}
                                        className="p-2 bg-red-500 text-[#fffcef] rounded-lg hover:bg-red-600 transition"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ):(
                    <div className="text-center py-12 text-[#1a472a]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg font-medium mb-1">No images yet</p>
                        <p className="text-sm">Upload images using the form above</p>
                    </div>
                )}
            </div>

            {/* Quick Navigation */}
            <div className="mt-6 flex gap-3">
                <Link
                    to={`/admin/products/edit/${productId}`}
                    className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#15381f] transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Product Details
                </Link>
                <Link
                    to="/admin/products"
                    className="px-4 py-2 bg-[#fffcef] border border-[#1a472a] text-[#1a472a] rounded-lg hover:bg-[#f0f0d8] transition"
                >
                    Back to Products
                </Link>
            </div>
        </div>
    );
};

export default ProductImages;
