import { X, Trash2, Upload } from "lucide-react";

export default function SelectedGalleryModal({ selectedGallery, setSelectedGallery, setGalleries }) {

    const handleAddImages = async (e, galleryId) => {
        const files = e.target.files;
        if (!files.length) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]); // must match multer.array("files")
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://club-server-25gd.onrender.com/gallery/upload/${galleryId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }, // do NOT set Content-Type
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to upload images");
            const updatedGallery = await res.json();
            setGalleries(prev =>
                prev.map(g => (g._id === galleryId ? updatedGallery : g))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveImage = async (galleryId, filename) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `https://club-server-25gd.onrender.com/gallery/images/${galleryId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ filenames: [filename] })
                }
            );
            if (!res.ok) throw new Error("Failed to remove image");
            const updatedGallery = await res.json();
            setGalleries(prev =>
                prev.map(g => (g._id === galleryId ? updatedGallery : g))
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-auto p-4">
            <div className="bg-white text-black rounded-2xl p-8 w-full max-w-3xl relative">
                <button
                    onClick={() => setSelectedGallery(null)}
                    className="absolute top-3 right-3 text-gray-700 hover:text-black"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">{selectedGallery.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{selectedGallery.activity}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedGallery.images.map((img, i) => (
                        <div key={i} className="relative group">
                            <img
                                src={`https://club-server-25gd.onrender.com/uploads/${img}`}
                                alt={`img-${i}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                                onClick={() => handleRemoveImage(selectedGallery._id, img)}
                                className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <label className="flex items-center justify-center h-32 border border-dashed border-gray-400 rounded-lg cursor-pointer text-gray-500 hover:bg-gray-100 transition-all">
                        <Upload size={24} className="mr-2" /> Add Image
                        <input
                            type="file"
                            name="files"
                            multiple
                            onChange={(e) => handleAddImages(e, selectedGallery._id)}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}
