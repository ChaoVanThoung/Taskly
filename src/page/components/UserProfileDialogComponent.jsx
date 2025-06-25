"use client"

import { useEffect, useState, useRef } from "react"
import {
  useGetVerifiedMutation,
  useUpdateUserMutation,
  useUploadProfileImageMutation,
} from "../../redux/service/authSlice"
import { FaTimes, FaEdit, FaSave, FaSpinner, FaCamera, FaTrash } from "react-icons/fa"

const UserProfileDialogComponent = ({ open, onOpenChange, user, accessToken }) => {
  const [getVerified, { data: verifiedUser, isLoading: isLoadingVerified, error: verifiedError }] =
    useGetVerifiedMutation()
  const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation()
  const [uploadProfileImage, { isLoading: isUploadingImage, error: uploadError }] = useUploadProfileImageMutation()

  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
  })
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    username: "",
  })
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [imageWasUpdated, setImageWasUpdated] = useState(false) // Track if image was updated
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (open && accessToken) {
      // Fetch fresh user data when dialog opens
      getVerified(accessToken)
      setIsEditMode(false)
      setUpdateSuccess(false)
      setSelectedImage(null)
      setImagePreview(null)
      setCurrentImageUrl(null)
      setImageWasUpdated(false) // Reset image update flag
    }
  }, [open, accessToken, getVerified])

  // Use verifiedUser if available, otherwise fall back to the passed user prop
  const displayUser = verifiedUser || user

  useEffect(() => {
    if (displayUser) {
      const userData = {
        firstName: displayUser.firstName || "",
        lastName: displayUser.lastName || "",
        username: displayUser.username || "",
      }
      setFormData(userData)
      setOriginalData(userData)
      
      // Set the current image URL
      setCurrentImageUrl(displayUser.imageProfileUrl)
    }
  }, [displayUser])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }

      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Helper function to construct image URL
  const getImageUrl = (imageProfileUrl) => {
    if (!imageProfileUrl) return null
    
    // If it's already a full URL, return as-is
    if (imageProfileUrl.startsWith('http')) {
      return imageProfileUrl
    }
    
    // If it's just a filename, construct the full URL
    return `http://localhost:8080/file/${imageProfileUrl}`
  }

  // Function to get only changed fields
  const getChangedFields = () => {
    const changedFields = {}

    // Only include fields that have actually changed
    if (formData.firstName !== originalData.firstName) {
      changedFields.firstName = formData.firstName
    }
    if (formData.lastName !== originalData.lastName) {
      changedFields.lastName = formData.lastName
    }
    if (formData.username !== originalData.username) {
      changedFields.username = formData.username
    }

    return changedFields
  }

  // Check if any fields have changed or image is selected
  const hasChanges = () => {
    return Object.keys(getChangedFields()).length > 0 || selectedImage !== null
  }

  const handleSave = async () => {
    if (!displayUser?.uuid) return

    try {
      let uploadedImageUrl = null
      let imageUpdated = false

      // First upload image if selected
      if (selectedImage) {
        console.log("Uploading image...")
        console.log("Selected image:", selectedImage)
        imageUpdated = true
        
        const uploadResult = await uploadProfileImage({
          file: selectedImage,
          accessToken,
        }).unwrap()

        console.log("Full upload result:", JSON.stringify(uploadResult, null, 2))

        // Your API returns the URL in the 'uri' field - use this directly
        uploadedImageUrl = uploadResult.uri || 
                          uploadResult.url || 
                          uploadResult.path || 
                          uploadResult.fileName || 
                          uploadResult.name || // This gets just the filename as fallback
                          uploadResult.data?.url ||
                          uploadResult.data?.path ||
                          uploadResult.data?.fileName ||
                          uploadResult.file?.url ||
                          uploadResult.file?.path ||
                          uploadResult.fileUrl ||
                          uploadResult.filepath

        // If still no URL found, check if the response itself is a URL string
        if (!uploadedImageUrl && typeof uploadResult === 'string') {
          uploadedImageUrl = uploadResult
        }

        if (!uploadedImageUrl) {
          console.error("No image URL returned from upload:", uploadResult)
          throw new Error("Image upload failed - no URL returned. Check the upload response structure.")
        }
        
        // Validate that it's actually a URL and not a MIME type
        if (uploadedImageUrl.startsWith('image/') || uploadedImageUrl.startsWith('data:')) {
          console.error("Invalid URL detected (appears to be MIME type or data URL):", uploadedImageUrl)
          throw new Error("Upload returned invalid URL format")
        }
        
        console.log("Image uploaded successfully:", uploadedImageUrl)
      }

      // Get changed fields
      const changedFields = getChangedFields()

      // Add image URL to changed fields if uploaded
      if (uploadedImageUrl) {
        // Determine what to store based on your backend expectation
        // Option 1: Store full URL
        changedFields.imageProfileUrl = uploadedImageUrl
        
        // Option 2: Store just filename (uncomment if your backend expects filename)
        // changedFields.imageProfileUrl = uploadResult.name
      }

      // If no changes and no image, just close edit mode
      if (Object.keys(changedFields).length === 0) {
        setIsEditMode(false)
        return
      }

      console.log("Updating fields:", changedFields)

      // Update user profile
      const result = await updateUser({
        uuid: displayUser.uuid,
        userData: changedFields,
        accessToken,
      }).unwrap()

      console.log("Update result:", result)

      // Update local state immediately instead of relying on API refresh
      if (uploadedImageUrl) {
        setCurrentImageUrl(uploadedImageUrl)
      }

      setUpdateSuccess(true)
      setIsEditMode(false)
      setImageWasUpdated(imageUpdated) // Track if image was updated

      // Update original data to reflect the changes
      setOriginalData({ ...originalData, ...changedFields })

      // Clear image selection state since it's now saved
      setSelectedImage(null)
      setImagePreview(null)

      // Show success message briefly, then refresh page if image was updated
      setTimeout(() => {
        if (imageUpdated) {
          // Refresh the entire page when image was updated
          console.log("Image was updated, refreshing page...")
          window.location.reload()
        } else {
          // Only refresh user data for other updates
          getVerified(accessToken)
            .then(() => {
              setUpdateSuccess(false)
            })
            .catch((error) => {
              console.error("Failed to refresh user data:", error)
              alert("Profile updated but failed to refresh. Please close and reopen the dialog.")
              setUpdateSuccess(false)
            })
        }
      }, 1500)
    } catch (error) {
      console.error("Failed to update user:", error)
      if (error.data) {
        console.error("Error data:", error.data)
      }
      
      // Show more specific error message
      const errorMessage = error.data?.message || error.message || "Unknown error occurred"
      alert(`Update failed: ${errorMessage}`)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({ ...originalData })
    setIsEditMode(false)
    handleRemoveImage()
  }

  if (!open) return null

  // Use imagePreview first, then currentImageUrl, then displayUser imageProfileUrl
  const currentImage = imagePreview || getImageUrl(currentImageUrl) || getImageUrl(displayUser?.imageProfileUrl)

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 w-full max-w-md animate-slideUp max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{isEditMode ? "Edit Profile" : "User Profile"}</h2>
          <div className="flex items-center gap-2">
            {!isEditMode && !isLoadingVerified && (
              <button
                onClick={() => setIsEditMode(true)}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="Edit Profile"
              >
                <FaEdit className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-gray-700 p-1">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        {updateSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Profile updated successfully!
            {imageWasUpdated && (
              <div className="text-sm mt-1">
                Page will refresh in a moment to show your new profile image...
              </div>
            )}
          </div>
        )}

        {(updateError || verifiedError || uploadError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <div className="font-medium">
              {updateError && "Failed to update profile"}
              {verifiedError && "Error loading user profile"}
              {uploadError && "Failed to upload image"}
            </div>
            {(updateError?.data?.message || uploadError?.data?.message) && (
              <div className="text-sm mt-1">{updateError?.data?.message || uploadError?.data?.message}</div>
            )}
          </div>
        )}

        {isLoadingVerified ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden flex items-center justify-center group">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={displayUser?.username || "User"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", currentImage)
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-600 bg-blue-100">
                    {(formData.firstName || displayUser?.firstName)?.[0] || ""}
                    {(formData.lastName || displayUser?.lastName)?.[0] || ""}
                  </div>
                )}

                {isEditMode && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white text-lg mr-2"
                      title="Change Profile Picture"
                    >
                      <FaCamera />
                    </button>
                    {(selectedImage || currentImage) && (
                      <button onClick={handleRemoveImage} className="text-white text-lg" title="Remove Picture">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />

              {selectedImage && isEditMode && (
                <div className="mb-2 text-sm text-gray-600 text-center">
                  <span className="text-orange-500">New image selected:</span> {selectedImage.name}
                  <div className="text-xs text-blue-600 mt-1">
                    Page will refresh after saving to display the new image
                  </div>
                </div>
              )}

              {!isEditMode ? (
                <>
                  <h3 className="text-lg font-medium">
                    {displayUser?.firstName || ""} {displayUser?.lastName || ""}
                  </h3>
                  <p className="text-gray-600">{displayUser?.email || ""}</p>
                </>
              ) : (
                <p className="text-gray-600">{displayUser?.email || ""}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  First Name
                  {isEditMode && formData.firstName !== originalData.firstName && (
                    <span className="text-orange-500 text-xs ml-1">(modified)</span>
                  )}
                </h4>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formData.firstName !== originalData.firstName
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="text-gray-900">{displayUser?.firstName || "Not set"}</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Last Name
                  {isEditMode && formData.lastName !== originalData.lastName && (
                    <span className="text-orange-500 text-xs ml-1">(modified)</span>
                  )}
                </h4>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formData.lastName !== originalData.lastName ? "border-orange-300 bg-orange-50" : "border-gray-300"
                    }`}
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="text-gray-900">{displayUser?.lastName || "Not set"}</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Username
                  {isEditMode && formData.username !== originalData.username && (
                    <span className="text-orange-500 text-xs ml-1">(modified)</span>
                  )}
                </h4>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formData.username !== originalData.username ? "border-orange-300 bg-orange-50" : "border-gray-300"
                    }`}
                    placeholder="Enter username"
                  />
                ) : (
                  <p className="text-gray-900">{displayUser?.username || "Not set"}</p>
                )}
              </div>

              {!isEditMode && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Member Since</h4>
                    <p className="text-gray-900">
                      {displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                    <p className="text-gray-900">{displayUser?.isVerified ? "Verified" : "Not Verified"}</p>
                  </div>
                </>
              )}
            </div>

            {/* Show what will be updated */}
            {isEditMode && hasChanges() && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <h5 className="text-sm font-medium text-blue-800 mb-2">Changes to be saved:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {selectedImage && (
                    <li>
                      <span className="font-medium">Profile Image:</span> {selectedImage.name}
                      <span className="text-xs text-orange-600 ml-2">(will refresh page)</span>
                    </li>
                  )}
                  {Object.entries(getChangedFields()).map(([field, value]) => (
                    <li key={field}>
                      <span className="font-medium capitalize">{field}:</span> {value || "(empty)"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isUpdating || isUploadingImage}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating || isUploadingImage || !hasChanges()}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${
                  hasChanges()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {isUpdating || isUploadingImage ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4" />
                    {isUploadingImage ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <FaSave className="h-4 w-4" />
                    {hasChanges() ? "Save Changes" : "No Changes"}
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              onClick={() => onOpenChange(false)}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfileDialogComponent