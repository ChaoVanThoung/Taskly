import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { FaPlus, FaSearch, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

import CreateTodoIteamDailog from "./components/CreateTodoIteamDailog";
import CreateTodoListDialog from "./components/CreateTodoListDialog";
import TodoListCartComponent from "./components/TodoListCartComponent";
import TodoItemCartComponent from "./components/TodoItemCartComponent";
import UserProfileDialogComponent from "./components/UserProfileDialogComponent";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import { useGetVerifiedMutation } from "../redux/service/authSlice";
import {
  useGetTodoListsQuery,
  useCreateTodoListMutation,
  useDeleteTodoListMutation,
} from "../redux/service/todoListSlice";
import {
  useCompleteTodoItemMutation,
  useCreateTodoItemMutation,
  useUncompleteTodoItemMutation,
} from "../redux/service/todoItemSlice";
import toast from "react-hot-toast";

const Todo = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [showCreateList, setShowCreateList] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [listToDelete, setListToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const navigate = useNavigate();
  const location = -useLocation();

  const [getVerified, { isLoading: myLoading, error: myError }] =
    useGetVerifiedMutation();

  const {
    data: todoListsData = [],
    isLoading: todoListsLoading,
    isError: todoListsError,
    refetch: refetchTodoLists,
  } = useGetTodoListsQuery(user?.uuid, {
    skip: !user?.uuid,
  });

  const [crateTodoList, { isLoading: isCreatingList, error: createList }] =
    useCreateTodoListMutation();

  const [createTodoItem, { isLoading: isCreatingItem }] =
    useCreateTodoItemMutation();

  const [completeTodoItem, { isLoading: isCompletingItem }] =
    useCompleteTodoItemMutation();
  const [uncompleteTodoItem, { isLoading: isUncompletingItem }] =
    useUncompleteTodoItemMutation();
  const [deleteTodoList, { isLoading: isDeletingList }] =
    useDeleteTodoListMutation();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const userData = await getVerified(accessToken).unwrap();
          setUser(userData);
        } catch (error) {
          console.error("Failed to verify user:", error);
          handleLogout();
        }
      }
    };
    fetchUserData();
  }, [getVerified]);

  useEffect(() => {
    if (user?.uuid) {
      refetchTodoLists().catch((err) =>
        console.error("Failed to refetch:", err)
      );
    }
  }, [user?.uuid, refetchTodoLists]);

  const filteredLists = todoListsData
    ? todoListsData.filter(
        (list) =>
          list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          list.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const allTodoItems = todoListsData
    ? todoListsData.flatMap((list) =>
        list.todoItems.map((item) => ({ ...item, listName: list.name }))
      )
    : [];

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

  const handleToggleComplete = async (id, isCompleted) => {
    try {
      if (isCompleted) {
        await uncompleteTodoItem(id).unwrap();
      } else {
        await completeTodoItem(id).unwrap();
      }
      refetchTodoLists();
    } catch (error) {
      console.error("Failed to update todo item:", error);
      alert("Failed to update todo item. Please try again.");
    }
  };

  const handleCreateList = async (listData) => {
    try {
      const todoListRequest = {
        name: listData.name,
        description: listData.description || "",
        userUUID: user.uuid,
      };
      await crateTodoList(todoListRequest).unwrap();
      setShowCreateList(false);
      await refetchTodoLists();
      <Alert severity="success">This is a success Alert.</Alert>;
      refetchTodoLists();
    } catch (error) {
      console.error("Failed to create todo list:", error);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      const todoItemRequest = {
        title: itemData.title,
        description: itemData.description || "",
        userUUID: user.uuid,
        todoListId: itemData.todoListId,
      };
      await createTodoItem(todoItemRequest).unwrap();
      setShowCreateItem(false);
      alert("Todo Item Create Successfully!");
      refetchTodoLists();
    } catch (error) {
      alert("Failed to create todo item. Please try again.");
    }
  };

  const handleDeleteList = (todoList) => {
    setListToDelete(todoList);
    setShowDeleteDialog(true);
  };

  const confirmDeleteList = async () => {
    if (!listToDelete) return;

    try {
      await deleteTodoList(listToDelete.id).unwrap();
      if (setListToDelete === listToDelete.id) {
        selectedList(null);
      }
      setShowDeleteDialog(false);
      setListToDelete(null);
      toast.success("Todo list deleted Successfully");
      refetchTodoLists();
    } catch (error) {
      console.error("Failed to delete todo list:", error);
      toast.error("Failed to delete todo list. Please try again.");
    }
  };

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return <Navigate to="/" />;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  // Show loading state
  if (todoListsLoading || myLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="#" className="text-2xl font-bold text-gray-900">
              Taskly
            </Link>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>
                {completedCount} of {totalCount} completed
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
                        handleLogout();
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
                  onDelete={handleDeleteList}
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
                  ? todoListsData.find((l) => l.id === selectedList)?.name
                  : searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "All Todo Items"}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedList
                  ? todoListsData.find((l) => l.id === selectedList)
                      ?.description
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
              ? todoListsData.find((l) => l.id === selectedList)?.todoItems ||
                []
              : filteredItems
            ).map((item) => (
              <TodoItemCartComponent
                key={item.id}
                todoItem={item}
                listName={selectedList ? undefined : item.listName}
                onToggleComplete={(id) =>
                  handleToggleComplete(id, item.completed)
                }
                isLoading={isCompletingItem || isUncompletingItem}
              />
            ))}
          </div>

          {(selectedList
            ? todoListsData.find((l) => l.id === selectedList)?.todoItems
                .length === 0
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
        isLoading={isCreatingList}
      />

      <CreateTodoIteamDailog
        open={showCreateItem}
        onOpenChange={setShowCreateItem}
        todoLists={todoListsData}
        onCreateItem={handleCreateItem}
      />

      <UserProfileDialogComponent
        open={showProfile}
        onOpenChange={setShowProfile}
        user={user}
        accessToken={accessToken}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDeleteList}
        isLoading={isDeletingList}
        title="Delete Todo List"
        message={`Are you sure you want to delete "${listToDelete?.name}"? This will also delete all todo items in this list. This action cannot be undone.`}
      />
    </div>
  );
};

export default Todo;
