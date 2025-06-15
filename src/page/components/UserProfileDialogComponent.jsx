
import React from 'react'

const UserProfileDialogComponent = ({ open, onOpenChange, user }) => {
    if (!open) return null;
  return (
   <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-slideUp">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
            {user?.imageProfileUrl ? (
              <img
                src={user.imageProfileUrl || "/placeholder.svg"}
                alt={user?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
            )}
          </div>
          <h3 className="text-lg font-medium">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Username</h4>
            <p className="text-gray-900">{user?.username || "Not set"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Member Since
            </h4>
            <p className="text-gray-900">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfileDialogComponent