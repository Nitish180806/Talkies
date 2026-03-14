import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

const SenderMessage = ({ image, message, audio, time, isRead }) => {
  const scroll = useRef();
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image, audio]);

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex justify-end m-1 px-1 sm:px-2" ref={scroll}>
        <div className="flex items-end max-w-[75%] sm:max-w-[70%] md:max-w-[60%]">
          <div className="bg-[#189AA7] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg rounded-tr-none flex flex-col gap-1 overflow-hidden">
            {image && (
              <img
                onLoad={handleImageScroll}
                onClick={() => setPreviewImage(image)}
                src={image}
                alt="sent"
                className="rounded-lg max-w-[150px] sm:max-w-[200px] md:max-w-[250px] object-cover cursor-zoom-in hover:opacity-90 transition"
              />
            )}
            {audio && (
              <audio
                controls
                src={audio}
                className="w-full max-w-[200px] sm:max-w-[250px] rounded-lg mt-1"
              />
            )}
            {message && (
              <span className="leading-snug break-words text-sm sm:text-base">
                {message}
              </span>
            )}
            <div className="flex items-center justify-end gap-1">
              {time && (
                <span className="text-[9px] sm:text-[10px] text-gray-200">
                  {time}
                </span>
              )}
              <div className="flex items-center ml-1">
                {isRead ? (
                  <svg
                    className="w-3 h-3 text-white transition-all hover:scale-110"
                    title="Seen"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3 text-white transition-all hover:scale-110"
                    title="Delivered"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative">
            <img
              src={previewImage}
              alt="Full Preview"
              className="max-h-[85vh] max-w-[95vw] sm:max-h-[90vh] sm:max-w-[90vw] rounded-lg shadow-lg"
            />
            <IoMdClose
              size={24}
              className="absolute top-2 right-2 sm:w-7 sm:h-7 text-red-500 cursor-pointer hover:text-red-400 transition"
              onClick={() => setPreviewImage(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SenderMessage;
