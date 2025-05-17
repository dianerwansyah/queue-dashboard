"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type Queue = {
  id: string;
  queue_id: string;
  task_name: string;
  details: string;
};

interface EditQueueFormProps {
  queue: Queue;
  onClose: () => void;
  onSave: (data: Partial<Queue>) => void;
}

export default function EditQueueForm({
  queue,
  onClose,
  onSave,
}: EditQueueFormProps) {
  const [formData, setFormData] = useState<Queue | null>(null);

  useEffect(() => {
    if (queue) {
      setFormData({ ...queue });
    }
  }, [queue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

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
          Edit Queue {formData?.queue_id ?? ""}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) =>
                setFormData({ ...formData!, task_name: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
              value={formData?.details ?? ""}
              onChange={(e) =>
                setFormData({ ...formData!, details: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}