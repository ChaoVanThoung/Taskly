
"use client"
import { FaTrash, FaSpinner } from "react-icons/fa"

const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => !isLoading && onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <FaTrash className="w-6 h-6 text-red-600" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationDialog
