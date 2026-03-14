import React, { useRef, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const ReceiverMessage = ({ image, message, audio, time }) => {
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
      <div className="flex justify-start m-1 px-1 sm:px-2" ref={scroll}>
        <div className="w-fit flex items-end max-w-[75%] sm:max-w-[70%] md:max-w-[60%]">
          <div className="bg-[#21C4D3] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg rounded-tl-none break-words flex flex-col gap-1 overflow-hidden">
            {image && (
              <img
                onLoad={handleImageScroll}
                onClick={() => setPreviewImage(image)}
                src={image}
                className="rounded-lg max-w-[150px] sm:max-w-[200px] md:max-w-[250px] object-cover cursor-zoom-in hover:opacity-90 transition"
                alt="received"
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
            {time && (
              <span className="text-[9px] sm:text-[10px] text-gray-200 self-end">
                {time}
              </span>
            )}
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

export default ReceiverMessage;
