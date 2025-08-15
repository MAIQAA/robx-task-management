"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import TaskForm from "@/Components/Modals/TaskForm";
import TaskCard from "@/Components/Task/TaskCard";
import Modal from "@/Components/Modals/Modal";
import AddMemberModal from "@/Components/Modals/AddmemberModal";
import { Task } from "@/types/task";
import { COLORS } from "@/constants/Data";
import { FaPlus } from "react-icons/fa";

interface User {
  id: number;
  name: string;
}

type BackendStatus = "to-do" | "in-progress" | "need-review" | "done";

const statusLabels: Record<BackendStatus, string> = {
  "to-do": "To Do",
  "in-progress": "In Progress",
  "need-review": "Need Review",
  done: "Done",
};

export default function TasksPage({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newStatus = result.destination.droppableId as Task["status"];
    const taskId = Number(result.draggableId);

    setTasks((prev) =>
      prev.map((task) =>
        Number(task.id) === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/update/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      fetchTasks();
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/getAll`);
      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data: Task[] = await res.json();

      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const columns = [
    { id: "to-do", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "need-review", title: "Need Review" },
    { id: "done", title: "Done" },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/getAll`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = currentDate
    .toLocaleDateString("en-US", options)
    .replace(/(\d+)(st|nd|rd|th)/, "$1$2");

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;

  return (
    <div className="space-y-10 p-6">
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
        {/* Date */}
        <div className="flex flex-col">
          <span className="text-xl font-bold">
            {currentDate.toLocaleString("en-US", { month: "long" })}
          </span>
          <span className="font-medium text-[var(--dark)]">
            Today is {formattedDate}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Users */}
          <div className="flex items-center">
            {loading ? (
              <div className="h-6 w-6 animate-spin border-4 border-solid border-current border-r-transparent"></div>
            ) : (
              users.map((user, index) => (
                <div key={user.id} className="group relative">
                  <div
                    className="w-8 h-8 border rounded-full flex items-center justify-center -ml-2"
                    style={{
                      backgroundColor: COLORS[index] || getRandomColor(),
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute hidden group-hover:block bg-[var(--background)] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                    {user.name}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center px-4 py-2 border rounded-lg"
            >
              <FaPlus className="mr-2" /> Invite Member
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center px-4 py-2 border bg-[var(--button)] rounded-lg"
            >
              <FaPlus className="mr-2" /> Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <TaskForm
          onCancel={() => setIsFormOpen(false)}
          onSubmit={(updatedTask) => {}}
        />
      </Modal>

      <Modal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)}>
        <AddMemberModal
          isOpen={isAddMemberOpen}
          onClose={() => setIsAddMemberOpen(false)}
          onUserAdded={fetchUsers}
        />
      </Modal>

      {/* Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const columnTasks = tasks.filter((task) => task.status === col.id);

            return (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    className={`kanban-column min-h-[200px] p-4 rounded-lg ${
                      snapshot.isDraggingOver ? "bg-gray-100" : "bg-gray-50"
                    }`}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
                      {col.title} ({columnTasks.length})
                    </h2>

                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id.toString()}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-4 ${
                              snapshot.isDragging ? "opacity-75" : ""
                            }`}
                          >
                            <TaskCard
                              task={task}
                              onUpdate={updateTask}
                              onDelete={deleteTask}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
