
import React from 'react'

const TodoItemCartComponent = ({ todoItem, listName, onToggleComplete }) => {

    const getTagColor = (color) => {
    const colors = {
      RED: "bg-red-100 text-red-800",
      BLUE: "bg-blue-100 text-blue-800",
      GREEN: "bg-green-100 text-green-800",
      GRAY: "bg-gray-100 text-gray-800",
    };
    return colors[color] || colors.GRAY;
  };

  return (
     <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <button
            onClick={() => onToggleComplete(todoItem.id)}
            className={`h-5 w-5 rounded-full border flex items-center justify-center ${
              todoItem.completed ? "bg-blue-500 border-blue-500" : "border-gray-300"
            }`}
          >
            {todoItem.completed && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.33334 2.5L3.75001 7.08333L1.66667 5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${todoItem.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
              {todoItem.title}
            </h3>
            {listName && <span className="text-xs text-gray-500">{listName}</span>}
          </div>

          <p className={`text-sm mt-1 ${todoItem.completed ? "text-gray-400" : "text-gray-600"}`}>
            {todoItem.description}
          </p>

          {todoItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {todoItem.tags.map((tag) => (
                <span key={tag.id} className={`px-2 py-0.5 rounded-full text-xs ${getTagColor(tag.color)}`}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoItemCartComponent