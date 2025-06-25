"use client"
import { useState, useRef, useEffect } from "react"

export default function CreateTodoIteamDailog({
  open,
  onOpenChange,
  todoLists,
  onCreateItem,
  availableTags = [],
  onCreateTag,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    todoListId: todoLists.length > 0 ? todoLists[0].id : "",
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [newTagData, setNewTagData] = useState({ name: "", color: "GRAY" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dialogRef = useRef(null)
  const initialFocusRef = useRef(null)

  // Reset form when dialog opens and focus first input
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        todoListId: todoLists.length > 0 ? todoLists[0].id : "",
      })
      setSelectedTags([])
      setShowCreateTag(false)
      setNewTagData({ name: "", color: "GRAY" })

      // Focus the first input after a short delay to ensure the dialog is visible
      setTimeout(() => {
        initialFocusRef.current?.focus()
      }, 50)
    }
  }, [open, todoLists])

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open && !isSubmitting) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onOpenChange, isSubmitting])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getTagColor = (color) => {
    const colors = {
      RED: "bg-red-100 text-red-800 border-red-200",
      BLUE: "bg-blue-100 text-blue-800 border-blue-200",
      GREEN: "bg-green-100 text-green-800 border-green-200",
      GRAY: "bg-gray-100 text-gray-800 border-gray-200",
      YELLOW: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PURPLE: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[color] || colors.GRAY
  }

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) => {
      const isSelected = prev.some((t) => t.id === tag.id)
      if (isSelected) {
        return prev.filter((t) => t.id !== tag.id)
      } else {
        return [...prev, tag]
      }
    })
  }

  const handleCreateNewTag = async () => {
    if (newTagData.name.trim()) {
      try {
        await onCreateTag(newTagData)
        setNewTagData({ name: "", color: "GRAY" })
        setShowCreateTag(false)
      } catch (error) {
        console.error("Error creating tag:", error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      onCreateItem({
        ...formData,
        tags: selectedTags,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        todoListId: Number(formData.todoListId),
      })

      setIsSubmitting(false)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating todo:", error)
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      handleClose()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          ref={dialogRef}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Todo</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new task to your list</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="todoListId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select List
                </label>
                <select
                  id="todoListId"
                  name="todoListId"
                  value={formData.todoListId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  {todoLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  ref={initialFocusRef}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Add more details (optional)..."
                  rows={3}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <button
                    type="button"
                    onClick={() => setShowCreateTag(!showCreateTag)}
                    disabled={isSubmitting}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center disabled:opacity-50"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Tag
                  </button>
                </div>

                {/* Available Tags */}
                {availableTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        disabled={isSubmitting}
                        className={`px-2 py-1 rounded-full text-xs border transition-all disabled:opacity-50 ${
                          selectedTags.some((t) => t.id === tag.id)
                            ? getTagColor(tag.color) + " ring-2 ring-blue-300"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {tag.name}
                        {selectedTags.some((t) => t.id === tag.id) && (
                          <svg className="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Create New Tag Form */}
                {showCreateTag && (
                  <div className="border rounded-lg p-3 bg-gray-50 mb-3">
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newTagData.name}
                        onChange={(e) => setNewTagData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Tag name"
                        disabled={isSubmitting}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                      />

                      <div className="flex space-x-1">
                        {["RED", "BLUE", "GREEN", "GRAY", "YELLOW", "PURPLE"].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewTagData((prev) => ({ ...prev, color }))}
                            disabled={isSubmitting}
                            className={`w-6 h-6 rounded-full ${
                              color === "RED"
                                ? "bg-red-500"
                                : color === "BLUE"
                                  ? "bg-blue-500"
                                  : color === "GREEN"
                                    ? "bg-green-500"
                                    : color === "YELLOW"
                                      ? "bg-yellow-500"
                                      : color === "PURPLE"
                                        ? "bg-purple-500"
                                        : "bg-gray-500"
                            } ${
                              newTagData.color === color ? "ring-2 ring-offset-1 ring-gray-400" : ""
                            } disabled:opacity-50`}
                          />
                        ))}
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowCreateTag(false)}
                          disabled={isSubmitting}
                          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateNewTag}
                          disabled={isSubmitting || !newTagData.name.trim()}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Selected tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tag) => (
                        <span key={tag.id} className={`px-2 py-0.5 rounded-full text-xs ${getTagColor(tag.color)}`}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Todo"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
