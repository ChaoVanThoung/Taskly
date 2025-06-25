import React from "react";

function PageNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="relative w-full max-w-2xl h-96">
        {/* Background clouds */}
        <div className="absolute top-8 left-1/4 w-32 h-16 bg-gray-200 rounded-full opacity-60"></div>
        <div className="absolute top-12 right-1/4 w-24 h-12 bg-gray-200 rounded-full opacity-60"></div>
        <div className="absolute top-20 left-1/3 w-40 h-20 bg-gray-200 rounded-full opacity-60"></div>

        {/* Triangle shapes */}
        <div className="absolute top-4 left-1/4">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-gray-400"></div>
          <div className="w-0 h-0 border-l-3 border-r-3 border-b-4 border-transparent border-b-gray-400 ml-1 -mt-1"></div>
        </div>

        {/* Circle in top right */}
        <div className="absolute top-8 right-1/4 w-12 h-12 border-2 border-gray-400 rounded-full"></div>

        {/* Main 404 text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          {/* First 4 */}
          <div className="relative">
            <div className="text-8xl font-thin text-gray-400 select-none">
              4
            </div>
            <div
              className="absolute inset-0 text-8xl font-thin text-transparent border-2 border-gray-400"
              style={{ WebkitTextStroke: "2px #9CA3AF" }}
            >
              4
            </div>
          </div>

          {/* 0 with refresh arrow */}
          <div className="relative mx-4">
            <div className="w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center">
              {/* Refresh arrow */}
              <div className="relative w-8 h-8">
                <div className="absolute top-1 left-2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                <div className="absolute top-0 left-4 w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-gray-400"></div>
              </div>
            </div>
          </div>

          {/* Second 4 */}
          <div className="relative">
            <div className="text-8xl font-thin text-gray-400 select-none">
              4
            </div>
            <div
              className="absolute inset-0 text-8xl font-thin text-transparent border-2 border-gray-400"
              style={{ WebkitTextStroke: "2px #9CA3AF" }}
            >
              4
            </div>
          </div>
        </div>

        {/* Sad character on the left */}
        <div className="absolute bottom-1/4 left-1/4">
          {/* Platform/ledge */}
          <div className="w-16 h-1 bg-gray-400 mb-2"></div>
          <div className="w-2 h-8 bg-gray-400 ml-14"></div>

          {/* Character body */}
          <div className="absolute bottom-3 left-2">
            {/* Head */}
            <div className="w-8 h-8 border-2 border-gray-400 rounded-full bg-white relative">
              {/* Eyes */}
              <div className="absolute top-2 left-1 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute top-2 right-1 w-1 h-1 bg-gray-400 rounded-full"></div>
              {/* Sad mouth */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b-2 border-gray-400 rounded-full"></div>
            </div>

            {/* Body */}
            <div className="w-6 h-8 border-2 border-gray-400 bg-white ml-1 -mt-2 rounded-b-lg"></div>

            {/* Tail */}
            <div className="absolute top-4 -right-2 w-4 h-1 border-2 border-gray-400 rounded-full transform rotate-45"></div>
          </div>
        </div>

        {/* Star near character */}
        <div className="absolute bottom-1/3 left-1/3 ml-8">
          <div className="relative w-3 h-3">
            <div className="absolute top-0 left-1/2 w-0 h-0 border-l-1 border-r-1 border-b-2 border-transparent border-b-gray-400 transform -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-0 h-0 border-l-1 border-r-1 border-t-2 border-transparent border-t-gray-400 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-0 h-0 border-t-1 border-b-1 border-r-2 border-transparent border-r-gray-400 transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-0 w-0 h-0 border-t-1 border-b-1 border-l-2 border-transparent border-l-gray-400 transform -translate-y-1/2"></div>
          </div>
        </div>

        {/* Cubic shapes on the right */}
        <div className="absolute bottom-1/4 right-1/4">
          {/* Large cube */}
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-400 bg-white"></div>
            <div className="absolute top-0 left-8 w-8 h-8 border-2 border-gray-400 bg-gray-100 transform skew-y-12 -skew-x-12"></div>
            <div className="absolute -top-8 left-0 w-8 h-8 border-2 border-gray-400 bg-gray-50 transform skew-x-12 -skew-y-12"></div>
          </div>

          {/* Small cubes */}
          <div className="absolute -top-4 -right-6">
            <div className="w-4 h-4 border-2 border-gray-400 bg-white"></div>
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-3 h-3 border-2 border-gray-400 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
