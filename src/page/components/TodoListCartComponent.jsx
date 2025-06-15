
import React from 'react'

const TodoListCartComponent = ({ todoList, isSelected, onClick }) => {
    const completedCount = todoList.todoItems.filter((item) => item.completed).length
  return (
     <div
      className={`p-4 rounded-lg cursor-pointer border ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">{todoList.name}</h3>
        <span className="text-xs text-gray-500">
          {completedCount}/{todoList.todoItems.length}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1 truncate">{todoList.description}</p>
    </div>
  )
}

export default TodoListCartComponent