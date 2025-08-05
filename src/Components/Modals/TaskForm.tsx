"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { FaSave, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ACCOUNTS } from "@/constants/Data";

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task | Omit<Task, "id">) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignee: task?.assignee || "",
    assignedTo: task?.assignedTo || "",
    dueDate: task?.dueDate || "",
    priority: task?.priority || "normal",
    status: task?.status || "To Do",
    comments: task?.comments || "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    task?.dueDate ? new Date(task.dueDate) : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task ? { ...formData, id: task.id } : formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      dueDate: date ? date.toISOString().split("T")[0] : "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[300px] md:w-[450px] lg:w-[500px] p-4 bg-[var(--secondary)] rounded-lg shadow-md space-y-6 border border-[var(--border)]"
    >
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1">
          Task Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1">
          Task Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1">
          Assignee
        </label>
        <select
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
          required
        >
          <option value="">Select Assignee</option>
          {ACCOUNTS.map((account) => (
            <option key={account} value={account}>
              {account}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1">
          Assigned To
        </label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
          required
        >
          <option value="">Select Assigned To</option>
          {ACCOUNTS.map((account) => (
            <option key={account} value={account}>
              {account}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1">
          Due Date
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
          placeholderText="Select due date"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Need Review">Need Review</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-1">
          Comments
        </label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-[var(--accent)] text-[var(--text)] border border-[var(--accent)] rounded-md hover:brightness-125"
        >
          <FaSave className="mr-2" /> Send
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-2 bg-transparent hover:bg-[var(--accent)] text-[var(--text)] hover:text-[var(--text)] border border-[var(--text)] hover:border-[var(--accent)] rounded-md"
        >
          <FaTimes className="mr-2" /> Cancel
        </button>
      </div>
    </form>
  );
}
