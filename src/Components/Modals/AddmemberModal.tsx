/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
}: AddMemberModalProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Sending invitation to: ${email}`); // Placeholder for backend integration
    setEmail("");
    onClose();
  };

  return (
    <div className="w-[300px] md:w-[350px] lg:w-[400px] bg-[var(--secondary)] border border-[var(--border)] rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-[var(--text)] mb-6">
        Add Team Member
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-[var(--border)] rounded-md bg-[var(--primary)] text-[var(--text)]"
            placeholder="Enter email address"
            required
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
            onClick={onClose}
            className="flex items-center px-4 py-2 bg-transparent hover:bg-[var(--accent)] text-[var(--text)] hover:text-[var(--text)] border border-[var(--text)] hover:border-[var(--accent)] rounded-md"
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
