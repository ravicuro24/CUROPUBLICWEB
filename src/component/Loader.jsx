// src/component/Loader.jsx
import React from 'react';

function Loader() {
    return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="flex flex-col items-center gap-4">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-gray-600 text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}

export default Loader;