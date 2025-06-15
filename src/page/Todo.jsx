import React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

import CreateTodoIteamDailog from "./components/CreateTodoIteamDailog";
import CreateTodoListDialog from "./components/CreateTodoListDialog";
import TodoListCartComponent from "./components/TodoListCartComponent";
import TodoItemCartComponent from "./components/TodoItemCartComponent";
import UserProfileDialogComponent from "./components/UserProfileDialogComponent";

const mockTodoLists = [
  {
    id: 1,
    name: "Work Projects",
    description: "Tasks related to work and professional development",
    createdAt: "2024-01-01T00:00:00",
    todoItems: [
      {
        id: 1,
        title: "Complete project proposal",
        description: "Finish the Q1 project proposal for the new client",
        completed: false,
        createdAt: "2024-01-01T00:00:00",
        completedAt: null,
        tags: [
          { id: 1, name: "urgent", color: "RED" },
          { id: 2, name: "work", color: "BLUE" },
        ],
      },
      {
        id: 2,
        title: "Review team performance",
        description: "Conduct quarterly performance reviews",
        completed: true,
        createdAt: "2024-01-01T00:00:00",
        completedAt: "2024-01-02T00:00:00",
        tags: [{ id: 3, name: "management", color: "GREEN" }],
      },
    ],
  },
  {
    id: 2,
    name: "Personal Goals",
    description: "Personal development and life goals",
    createdAt: "2024-01-01T00:00:00",
    todoItems: [
      {
        id: 3,
        title: "Learn React Advanced Patterns",
        description: "Study advanced React patterns and best practices",
        completed: false,
        createdAt: "2024-01-01T00:00:00",
        completedAt: null,
        tags: [
          { id: 4, name: "learning", color: "BLUE" },
          { id: 5, name: "tech", color: "GRAY" },
        ],
      },
    ],
  },
];


const todo = ({ user, onLogout }) => {
  const [todoLists, setTodoLists] = useState(mockTodoLists);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [showCreateList, setShowCreateList] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredLists = todoLists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allTodoItems = todoLists.flatMap((list) =>
    list.todoItems.map((item) => ({ ...item, listName: list.name }))
  );

  const filteredItems = allTodoItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const completedCount = allTodoItems.filter((item) => item.completed).length;
  const totalCount = allTodoItems.length;

  const handleToggleComplete = (id) => {
    setTodoLists((prev) =>
      prev.map((list) => ({
        ...list,
        todoItems: list.todoItems.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                completed: !todo.completed,
                completedAt: !todo.completed ? new Date().toISOString() : null,
              }
            : todo
        ),
      }))
    );
  };

  const handleCreateList = (list) => {
    setTodoLists((prev) => [
      ...prev,
      { ...list, id: Date.now(), todoItems: [] },
    ]);
  };

  const handleCreateItem = (item) => {
    setTodoLists((prev) =>
      prev.map((list) =>
        list.id === item.todoListId
          ? {
              ...list,
              todoItems: [
                ...list.todoItems,
                { ...item, id: Date.now(), tags: [] },
              ],
            }
          : list
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Taskly
            </Link>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>
                {completedCount} of {totalCount} completed
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                placeholder="Search todos, lists, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 h-10 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}

            <div className="relative">
              <button
                className="relative h-8 w-8 rounded-full"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.imageProfileUrl ? (
                    <img
                      src={user.imageProfileUrl || "/placeholder.svg"}
                      alt={user?.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-medium">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  )}
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <button
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                      onClick={() => {
                        setShowProfile(true);
                        setShowDropdown(false);
                      }}
                    >
                      <FaUser className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </button>

                    <div className="border-t my-1"></div>

                    <button
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                      onClick={() => {
                        onLogout();
                        setShowDropdown(false);
                      }}
                    >
                      <FaSignOutAlt className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Todo Lists
              </h2>
              <button
                onClick={() => setShowCreateList(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-8 px-3"
              >
                <FaPlus className="h-3 w-3 mr-2" />
                New List
              </button>
            </div>

            <div className="space-y-3">
              {filteredLists.map((list) => (
                <TodoListCartComponent
                  key={list.id}
                  todoList={list}
                  isSelected={selectedList === list.id}
                  onClick={() =>
                    setSelectedList(selectedList === list.id ? null : list.id)
                  }
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedList
                  ? todoLists.find((l) => l.id === selectedList)?.name
                  : searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "All Todo Items"}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedList
                  ? todoLists.find((l) => l.id === selectedList)?.description
                  : `${filteredItems.length} items`}
              </p>
            </div>

            <button
              onClick={() => setShowCreateItem(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4"
            >
              <FaPlus className="h-3 w-3 mr-2" />
              New Todo
            </button>
          </div>

          <div className="grid gap-4">
            {(selectedList
              ? todoLists.find((l) => l.id === selectedList)?.todoItems || []
              : filteredItems
            ).map((item) => (
              <TodoItemCartComponent
                key={item.id}
                todoItem={item}
                listName={selectedList ? undefined : item.listName}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>

          {(selectedList
            ? todoLists.find((l) => l.id === selectedList)?.todoItems.length ===
              0
            : filteredItems.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaPlus className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No todos yet
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first todo item.
              </p>
              <button
                onClick={() => setShowCreateItem(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4"
              >
                <FaPlus className="h-3 w-3 mr-2" />
                Create Todo
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <CreateTodoListDialog
        open={showCreateList}
        onOpenChange={setShowCreateList}
        onCreateList={handleCreateList}
      />

      <CreateTodoIteamDailog
        open={showCreateItem}
        onOpenChange={setShowCreateItem}
        todoLists={todoLists}
        onCreateItem={handleCreateItem}
      />

      <UserProfileDialogComponent
        open={showProfile}
        onOpenChange={setShowProfile}
        user={user}
      />
    </div>
  );
};

export default todo;
