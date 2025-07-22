import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore.js";


const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });
    const { createProduct, loading } = useProductStore();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct(newProduct);
            setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                image: "",
            });

        } catch (error) {
            console.log("error creating product", error)
        }
    }
const handleImageChange = (e) => {
    const file = e.target?.files?.[0]; // ✅ Corrected from `file` to `files`
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setNewProduct({ ...newProduct, image: reader.result });
        };
        reader.readAsDataURL(file); // Convert to base64
    }
};

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-2xl font-samibold mb-6">Create New Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                        Product Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows='3'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
                        Price
                    </label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step='0.01'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
                        Category
                    </label>
                    <select
                        id='category'
                        name='category'
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    >
                        <option value=''>Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mt-1 flex items-center'>
                    <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
                </div>

                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Product
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    )
}

export default CreateProductForm



// import { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { PlusCircle, Upload, Loader, Check, X } from "lucide-react";

// const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

// const CreateProductForm = () => {
//     const [newProduct, setNewProduct] = useState({
//         name: "",
//         description: "",
//         price: "",
//         category: "",
//         image: null,
//     });
//     const [previewImage, setPreviewImage] = useState(null);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const fileInputRef = useRef(null);
//     const loading = false;

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setNewProduct({ ...newProduct, image: file });

//             const reader = new FileReader();
//             reader.onload = () => {
//                 setPreviewImage(reader.result);

//                 let progress = 0;
//                 const interval = setInterval(() => {
//                     progress += 10;
//                     setUploadProgress(progress);
//                     if (progress >= 100) {
//                         clearInterval(interval);
//                     }
//                 }, 100);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // submission logic here
//     };

//     const removeImage = () => {
//         setNewProduct({ ...newProduct, image: null });
//         setPreviewImage(null);
//         setUploadProgress(0);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         }
//     };

//     return (
//         <motion.div
//             className="bg-gray-800 shadow-2xl rounded-2xl p-8 mb-8 max-w-xl mx-auto border border-gray-700"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, ease: "easeOut" }}
//         >
//             <h2 className="text-3xl font-bold mb-6 text-white text-center">Create New Product</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Name */}
//                 <div className="space-y-2">
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//                         Product Name
//                     </label>
//                     <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         value={newProduct.name}
//                         onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                         className="block w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
//                         required
//                         placeholder="Enter product name"
//                     />
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-2">
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-300">
//                         Description
//                     </label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         value={newProduct.description}
//                         onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//                         rows="4"
//                         className="block w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
//                         required
//                         placeholder="Enter product description"
//                     />
//                 </div>

//                 {/* Price */}
//                 <div className="space-y-2">
//                     <label htmlFor="price" className="block text-sm font-medium text-gray-300">
//                         Price
//                     </label>
//                     <div className="relative">
//                         <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
//                         <input
//                             type="number"
//                             id="price"
//                             name="price"
//                             value={newProduct.price}
//                             onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//                             step="0.01"
//                             className="block w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pl-8 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
//                             required
//                             placeholder="0.00"
//                         />
//                     </div>
//                 </div>

//                 {/* Category */}
//                 <div className="space-y-2">
//                     <label htmlFor="category" className="block text-sm font-medium text-gray-300">
//                         Category
//                     </label>
//                     <select
//                         id="category"
//                         name="category"
//                         value={newProduct.category}
//                         onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//                         className="block w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
//                         required
//                     >
//                         <option value="">Select a category</option>
//                         {categories.map((category) => (
//                             <option key={category} value={category}>
//                                 {category.charAt(0).toUpperCase() + category.slice(1)}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Image Upload */}
//                 <div className="space-y-3">
//                     <label className="block text-sm font-medium text-gray-300">
//                         Product Image <span className="text-red-400">*</span>
//                     </label>

//                     <input
//                         type="file"
//                         id="image"
//                         ref={fileInputRef}
//                         className="sr-only"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         disabled={!!newProduct.image}
//                     />

//                     <motion.label
//                         htmlFor="image"
//                         whileHover={{ scale: 1.03 }}
//                         whileTap={{ scale: 0.97 }}
//                         className={`inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border-2 border-dashed
//                             ${newProduct.image ? "border-gray-500 text-gray-400 cursor-not-allowed" : "border-emerald-500 text-emerald-400 cursor-pointer"}
//                             bg-gray-800 rounded-lg text-sm font-semibold shadow-md transition-all duration-200
//                             hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
//                     >
//                         <Upload className="h-5 w-5 mr-2" />
//                         {newProduct.image ? "Image Selected" : "Upload Image"}
//                     </motion.label>

//                     <AnimatePresence>
//                         {uploadProgress > 0 && uploadProgress < 100 && (
//                             <motion.div
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: 1, height: "auto" }}
//                                 exit={{ opacity: 0, height: 0 }}
//                                 className="mt-2"
//                             >
//                                 <div className="w-full bg-gray-700 rounded-full h-2.5">
//                                     <motion.div
//                                         className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full"
//                                         initial={{ width: 0 }}
//                                         animate={{ width: `${uploadProgress}%` }}
//                                         transition={{ duration: 0.4 }}
//                                     />
//                                 </div>
//                                 <p className="text-xs text-gray-400 mt-1 text-center">Uploading: {uploadProgress}%</p>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {previewImage && (
//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="relative mt-4 rounded-lg overflow-hidden shadow-lg group border border-emerald-500"
//                         >
//                             <img
//                                 src={previewImage}
//                                 alt="Selected"
//                                 className="object-cover w-full h-52 sm:h-64 transition-transform duration-300 transform group-hover:scale-105"
//                             />
//                             <motion.button
//                                 type="button"
//                                 onClick={removeImage}
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 className="absolute top-2 right-2 bg-red-500 p-1 rounded-full shadow-lg z-10"
//                             >
//                                 <X className="h-4 w-4 text-white" />
//                             </motion.button>
//                             <div className="absolute bottom-0 w-full px-4 py-2 bg-gray-900 bg-opacity-70 text-emerald-300 text-sm flex items-center justify-center">
//                                 <Check className="h-4 w-4 mr-1" />
//                                 Image Ready
//                             </div>
//                         </motion.div>
//                     )}
//                 </div>

//                 {/* Submit Button */}
//                 <motion.button
//                     type="submit"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg
//                     shadow-sm text-md font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600
//                     hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
//                     focus:ring-emerald-500 disabled:opacity-50 transition duration-200"
//                     disabled={loading}
//                 >
//                     {loading ? (
//                         <>
//                             <Loader className="mr-2 h-5 w-5 animate-spin" />
//                             Creating...
//                         </>
//                     ) : (
//                         <>
//                             <PlusCircle className="mr-2 h-5 w-5" />
//                             Create Product
//                         </>
//                     )}
//                 </motion.button>
//             </form>
//         </motion.div>
//     );
// };

// export default CreateProductForm;


