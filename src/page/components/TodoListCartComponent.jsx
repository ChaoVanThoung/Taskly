"use client"

import { useState } from "react"
import { FaTrash, FaEllipsisV } from "react-icons/fa"

const TodoListCartComponent = ({ todoList, isSelected, onClick, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleDeleteClick = (e) => {
    e.stopPropagation() // Prevent triggering the onClick for selection
    setShowMenu(false)
    onDelete(todoList)
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const completedCount = todoList.todoItems ? todoList.todoItems.filter((item) => item.completed).length : 0

  return (
    <div
      className={`relative p-4 rounded-lg cursor-pointer border ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 truncate">{todoList.name}</h3>
            <span className="text-xs text-gray-500 ml-2">
              {completedCount}/{todoList.todoItems.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 truncate">{todoList.description}</p>
        </div>

        <div className="relative ml-2">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" onClick={handleMenuClick}>
            <FaEllipsisV className="w-3 h-3" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              <button
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                onClick={handleDeleteClick}
              >
                <FaTrash className="w-3 h-3 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />}
    </div>
  )
}

export default TodoListCartComponent
