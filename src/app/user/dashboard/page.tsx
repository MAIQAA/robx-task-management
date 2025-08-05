"use client";

import { useState } from "react";
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
import { ACCOUNTS, COLORS } from "@/constants/Data";
import { FaPlus } from "react-icons/fa";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const addTask = (task: Omit<Task, "id">) => {
    setTasks([...tasks, { ...task, id: crypto.randomUUID() }]);
    setIsFormOpen(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newStatus = result.destination.droppableId as Task["status"];
    const taskId = result.draggableId;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const columns: Task["status"][] = [
    "To Do",
    "In Progress",
    "Need Review",
    "Done",
  ];

 

  // Format the current date
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

  return (
    <div className="space-y-10 p-6">
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
        {/* Current Date */}
        <div className="flex flex-col items-start justify-start">
          <span className="text-xl font-bold text-[var(--dark)]">
            {currentDate.toLocaleString("en-US", { month: "long" })}
          </span>
          <span className="font-medium text-[var(--dark)]">
            Today is {formattedDate}
          </span>
        </div>

        <div className="w-full lg:w-fit flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Users */}
          <div className="flex items-center">
            {ACCOUNTS.map((user, index) => (
              <div key={user} className="group relative">
                <div
                  className="w-8 h-8 border border-[var(--border)] rounded-full text-[var(--text)] flex items-center justify-center text-sm font-medium -ml-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                >
                  {user.charAt(0).toUpperCase()}
                </div>
                <div className="absolute hidden group-hover:block bg-[var(--background)] text-[var(--text)] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                  {user}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Invite Member Button */}
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center px-4 py-2 border border-[var(--button)] text-sm lg:text-base text-[var(--button)] rounded-lg hover:bg-[var(--button)] hover:text-[var(--text)] transition"
            >
              <FaPlus className="mr-2" /> Invite Member
            </button>

            {/* Create Task Button */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center px-4 py-2 border bg-[var(--button)] text-sm lg:text-base text-[var(--text)] rounded-lg border-[var(--button)] hover:bg-transparent hover:text-[var(--button)] transition"
            >
              <FaPlus className="mr-2" /> Create Task
            </button>
          </div>
        </div>
      </div>
      {/* Modals */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        {/* Task Creation */}
        <TaskForm onSubmit={addTask} onCancel={() => setIsFormOpen(false)} />
      </Modal>
      <Modal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)}>
        {/* Add New member */}
        <AddMemberModal
          isOpen={isAddMemberOpen}
          onClose={() => setIsAddMemberOpen(false)}
        />
      </Modal>
      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  className="kanban-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
                    {status}
                  </h2>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4"
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
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
