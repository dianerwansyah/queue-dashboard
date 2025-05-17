"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type Queue = {
  id: string;
  queue_id: string;
  task_name: string;
  details: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  notes: string;
  form: string | null;
};

interface ClaimQueueFormProps {
  queue: Queue;
  onClose: () => void;
  onSave: (data: Partial<Queue>) => void;
}

export default function ClaimQueueForm({
  queue,
  onClose,
  onSave,
}: ClaimQueueFormProps) {
  const [formData, setFormData] = useState<Queue>({
    id: "",
    queue_id: "",
    task_name: "",
    details: "",
    status: "pending",
    notes: "",
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    form: null,
  });

  useEffect(() => {
    if (queue) {
      setFormData(queue);
    }
  }, [queue]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      start_date: prev?.start_date ?? new Date().toISOString(),
      end_date:
        prev?.end_date ??
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }));
  }, []);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  const statusOptions = [
    { value: "in_process", label: "In Process" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  function formatDateTimeLocal(dateStr: string | null): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const d = dateStr ? new Date(dateStr) : new Date();
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const mm = pad(d.getMinutes());

    return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
  }

  function formatEndDateTimeLocal(dateStr: string | null): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    let d = dateStr ? new Date(dateStr) : new Date();
    if (!dateStr) {
      d.setDate(d.getDate() + 1);
    }
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
  }

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
        <h2 className="text-xl font-semibold mb-4">
          {queue.form} Queue {formData?.queue_id ?? ""}
        </h2>
        <form onSubmit={handleClaim} className="space-y-4">
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
              value={formData?.task_name ?? ""}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
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
          {queue.form === "Edit" && (
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
                value={formData?.status ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData!, status: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {formData?.form !== "Retry" && (
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
                value={formatDateTimeLocal(formData?.start_date ?? null)}
                onChange={(e) =>
                  setFormData({ ...formData!, start_date: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                readOnly={formData?.form === "Edit"}
              />
            </div>
          )}

          {formData?.form !== "Retry" && (
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
                value={formatEndDateTimeLocal(formData?.end_date ?? "")}
                onChange={(e) =>
                  setFormData({ ...formData!, end_date: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                readOnly={formData?.form === "Edit"}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData?.notes ?? ""}
              onChange={(e) =>
                setFormData({ ...formData!, notes: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
              required={queue.form === "Retry"}
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
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {queue.form === "Edit" ? "Submit" : queue.form}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
