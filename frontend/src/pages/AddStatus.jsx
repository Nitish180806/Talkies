// pages/AddStatus.jsx
import React, { useState, useRef } from "react";
import { IoIosArrowRoundBack, IoMdClose } from "react-icons/io";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../main";
import { addStatus } from "../redux/StatusSlice";

const AddStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.user);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image && !caption.trim()) {
      alert("Please add an image or caption");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (caption) formData.append("caption", caption);
      if (image) formData.append("image", image);
      const res = await axios.post(`${ServerUrl}/api/status/create`, formData, {
        withCredentials: true,
      });
      dispatch(addStatus(res.data));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8fdff] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-3 sm:px-4 py-3 sm:py-4 bg-[#21C4D3] text-white shadow-md flex-shrink-0">
        <IoIosArrowRoundBack
          size={26}
          className="cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        />
        <h2 className="flex-1 text-center text-lg sm:text-xl font-semibold pr-6 sm:pr-8">
          Add Status
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-5 sm:py-6 gap-4 sm:gap-6">
        {/* Image picker / preview */}
        {preview ? (
          <div className="relative w-full max-w-sm sm:max-w-md">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-xl shadow-lg"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview("");
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <IoMdClose size={22} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current.click()}
            className="w-full max-w-sm sm:max-w-md h-56 sm:h-72 md:h-80 border-2 border-dashed border-[#21C4D3] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/60 transition-colors"
          >
            <FiImage
              size={40}
              className="text-[#21C4D3] mb-2 sm:mb-3 sm:w-12 sm:h-12"
            />
            <p className="text-gray-500 text-sm sm:text-base">
              Click to add image
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleImageSelect}
        />

        {/* Caption */}
        <div className="w-full max-w-sm sm:max-w-md">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption (optional)"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-300 focus:border-[#21C4D3] focus:ring-1 focus:ring-[#21C4D3]/30 focus:outline-none resize-none text-sm sm:text-base"
            rows={3}
          />
        </div>

        {/* Post button */}
        <button
          onClick={handleSubmit}
          disabled={loading || (!image && !caption.trim())}
          className="w-full max-w-sm sm:max-w-md py-2.5 sm:py-3 bg-[#21C4D3] text-white font-semibold rounded-full hover:bg-[#189AA7] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          {loading ? "Posting..." : "Post Status"}
        </button>
      </div>
    </div>
  );
};

export default AddStatus;
