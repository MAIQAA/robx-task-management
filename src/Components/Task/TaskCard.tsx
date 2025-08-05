"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { FaEdit, FaTrash } from "react-icons/fa";
import TaskForm from "../Modals/TaskForm";
import Modal from "../Modals/Modal";
import { ACCOUNTS, COLORS } from "@/constants/Data";

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const priorityColors = {
    low: "bg-green-500",
    normal: "bg-blue-500",
    high: "bg-orange-400",
    urgent: "bg-red-500",
  };

  const statusColors = {
    "To Do": "bg-pink-400",
    "In Progress": "bg-purple-400",
    "Need Review": "bg-orange-400",
    Done: "bg-green-400",
  };

  const handleUpdate = (updatedTask: Task | Omit<Task, "id">) => {
    onUpdate({ ...updatedTask, id: task.id } as Task);
    setIsEditing(false);
  };

  const assignedIndex = ACCOUNTS.indexOf(task.assignedTo);
  const assignedColor = COLORS[assignedIndex % COLORS.length] || COLORS[0];

  return (
    <>
      <div
        className={`p-4 rounded-xl shadow-md bg-[var(--secondary)] flex flex-col gap-3 border border-[var(--border)]`}
      >
        <div className="w-full flex items-center justify-between">
          <span
            className={`w-fit capitalize text-sm text-[var(--text)] font-medium px-4 py-1 rounded-full ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-[var(--text)]"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-[var(--text)]"
            >
              <FaTrash />
            </button>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-[var(--text)] capitalize">
          {task.title}
        </h3>
        <p className="text-sm xl:text-base font-medium text-[var(--text)]/70">
          {task.description}
        </p>
        <hr className="bg-opacity-50 my-3" />

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <div className="group w-fit relative">
              <div
                style={{
                  backgroundColor: assignedColor,
                }}
                className={`w-8 h-8 border rounded-full text-[var(--text)] flex items-center justify-center text-sm font-medium bg-opacity-50 -ml-2`}
              >
                {task.assignedTo.charAt(0).toUpperCase()}
              </div>
              <div className="absolute hidden group-hover:block bg-[var(--primary)] text-[var(--text)] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                {task.assignedTo}
              </div>
            </div>
            <p className="text-xs font-medium text-[var(--text)]">
              {task.status}
            </p>
          </div>

          <div className="flex items-center justify-start gap-2">
            <p className="text-xs font-medium text-[var(--text)]">
              {task.dueDate}
            </p>
          </div>
        </div>
      </div>
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <TaskForm
          task={task}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </>
  );
}
