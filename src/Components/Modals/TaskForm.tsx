"use client";

import { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { assignTask } from "@/utils/assignTask";
import { Task } from "@/types/task";

interface User {
  id: string | number;
  name: string;
}

interface TaskFormProps {
  taskId?: string;
  onSubmit: (updatedTask: Partial<Task>) => void;
  onCancel: () => void;
  refreshTasks?: () => void;
}

export default function TaskForm({
  taskId,
  onSubmit,
  onCancel,
  refreshTasks,
}: TaskFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    assignedTo: "",
    dueDate: "",
    priority: "normal",
    status: "to-do",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/getAll`
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        console.log("user",data)
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/task/get/${taskId}`
        );
        if (!res.ok) throw new Error("Failed to fetch task");

        const data: Task = await res.json();

        setFormData({
          title: data.title || "",
          description: data.description || "",
          assignee: data.assignedUser?.name || "",
          assignedTo: data.assignedUser?.id?.toString() || "",
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
          priority: data.priority || "normal",
          status: data.status || "to-do",
        });
        setSelectedDate(data.dueDate ? new Date(data.dueDate) : null);
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };

    fetchTask();
  }, [taskId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      userId: formData.assignedTo, 
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
    };

    let updatedTask: Task;
    if (taskId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/task/update/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      updatedTask = await res.json();
    } else {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/task/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      updatedTask = await res.json();
    }

    onSubmit(updatedTask);
    refreshTasks?.();
    onCancel();
  } catch (err) {
    console.error(err);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl p-4 bg-[var(--secondary)] rounded-lg shadow-md border border-[var(--border)] mx-auto space-y-6
             max-h-screen overflow-y-auto"
    >
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Title */}
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

        {/* Assignee */}
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
            {loadingUsers ? (
              <option disabled>Loading...</option>
            ) : (
              users.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Assigned To */}
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
            {loadingUsers ? (
              <option disabled>Loading...</option>
            ) : (
              users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Due Date */}
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

        {/* Priority */}
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

        {/* Status */}
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
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="need-review">Need Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Description — Full Width */}
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

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-[var(--accent)] text-[var(--text)] border border-[var(--accent)] rounded-md hover:brightness-125"
        >
          {submitting ? (
            "Assigning..."
          ) : (
            <>
              <FaSave className="mr-2" /> Assign Task
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-transparent hover:bg-[var(--accent)] text-[var(--text)] border border-[var(--text)] hover:border-[var(--accent)] rounded-md"
        >
          <FaTimes className="mr-2" /> Cancel
        </button>
      </div>
    </form>
  );
}
