"use client";

import React from "react";
import { X } from "lucide-react";

type Queue = {
  id: string;
  queue_id: string;
  task_name: string;
  details: string;
  status: "pending" | "in_process" | "completed" | "failed";
  assigned_to: string;
  assigned_to_name: string;
  assigned_at: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

interface ViewQueueFormProps {
  queue: Queue;
  onClose: () => void;
}

function formatDateTimeLocal(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_process", label: "In Process" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

export default function ViewQueueForm({ queue, onClose }: ViewQueueFormProps) {
  return (
    <div className="fixed inset-0 bg-gray-200/75 dark:bg-gray-800/75 flex items-center justify-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close form"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">View Queue</h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="queue_id"
              className="block text-sm font-medium text-gray-700"
            >
              Queue ID
            </label>
            <input
              type="text"
              id="queue_id"
              name="queue_id"
              value={queue.queue_id ?? ""}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              required
            />
          </div>
          <div>
            <label
              htmlFor="task_name"
              className="block text-sm font-medium text-gray-700"
            >
              Task Name
            </label>
            <input
              type="text"
              id="task_name"
              name="task_name"
              value={queue.task_name}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              required
            />
          </div>
          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700"
            >
              Details
            </label>
            <textarea
              id="details"
              name="details"
              value={queue.details}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              rows={3}
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={queue.status}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="assigned_to_name"
              className="block text-sm font-medium text-gray-700"
            >
              Assigned To
            </label>
            <input
              type="text"
              id="assigned_to_name"
              name="assigned_to_name"
              value={queue.assigned_to_name}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              value={formatDateTimeLocal(queue.start_date)}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={formatDateTimeLocal(queue.end_date)}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
