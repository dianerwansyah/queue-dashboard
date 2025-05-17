"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ViewQueueForm from "./ViewQueueForm";
import ClaimQueueForm from "./ClaimQueueForm";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Loader2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  MoreVertical,
  RotateCcw,
} from "lucide-react";

interface Queue {
  id: string;
  queue_id: string;
  task_name: string;
  details: string;
  notes: string;
  status: "pending" | "in_process" | "completed" | "failed";
  assigned_to: string;
  assigned_at: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  form: string;
  assigned_to_name: string;
}

export default function QueuesPage() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [statusFilter, setStatusFilter] = useState<Queue["status"] | "all">(
    "all"
  );

  const [showViewForm, setShowViewForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);

  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setDropdownOpenId((prev) => (prev === id ? null : id));
  };

  // Columns for rendering
  const columns = [
    { key: "queue_id", label: "Queue ID" },
    { key: "task_name", label: "Task Name" },
    { key: "status", label: "Status", isStatus: true },
    { key: "details", label: "Details", truncate: true },
    { key: "created_at", label: "Created Date", isDate: true },
    { key: "start_date", label: "Start Date", isDate: true },
    { key: "end_date", label: "End Date", isDate: true },
    { key: "assigned_to_name", label: "Assigned To" },
    { key: "assigned_at", label: "Assigned Date", isDate: true },
    { key: "actions", label: "Actions", isAction: true },
  ];

  const dropdownItems = [
    {
      label: "View",
      icon: Eye,
      color: "text-blue-600",
      onClick: (queue: Queue) => handleViewClick(queue),
      condition: () => true,
    },
    {
      label: "Edit",
      icon: Pencil,
      color: "text-green-600",
      onClick: (queue: Queue) => handleEditClick(queue),
      condition: (queue: Queue) =>
        !["pending", "failed", "completed"].includes(queue.status),
    },
    {
      label: "Claim",
      icon: CheckCircle2,
      color: "text-amber-600",
      onClick: (queue: Queue) => handleClaimClick(queue),
      condition: (queue: Queue) => queue.status === "pending",
    },
    {
      label: "Retry",
      icon: RotateCcw,
      color: "text-yellow-600",
      onClick: (queue: Queue) => handleRetryClick(queue),
      condition: (queue: Queue) => queue.status === "failed",
    },
  ];

  useEffect(() => {
    fetchQueues();
  }, [searchValue, statusFilter]);

  async function fetchQueues() {
    setLoading(true);
    try {
      const response = await api.post("/api/getqueuesworker", {
        task_name: searchValue,
        status: statusFilter === "all" ? null : statusFilter,
      });
      setQueues(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch queues:", error);
      setError("Failed to load queues. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Helper for status badge colors
  const getStatusBadgeColor = (status: Queue["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_process":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format dates safely
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  // Event handlers
  const handleViewClick = (queue: Queue) => {
    queue.form = "View";
    setSelectedQueue(queue);
    setShowViewForm(true);
  };

  const handleFormViewClose = () => {
    setShowViewForm(false);
  };

  const handleEditClick = (queue: Queue) => {
    queue.form = "Edit";
    setSelectedQueue(queue);
    setShowClaimForm(true);
  };

  const handleFormEditClose = () => {
    setShowClaimForm(false);
  };

  const handleClaimClick = (queue: Queue) => {
    queue.form = "Claim";
    setSelectedQueue(queue);
    setShowClaimForm(true);
  };

  const handleFormClaimClose = () => {
    setShowClaimForm(false);
  };

  const handleRetryClick = (queue: Queue) => {
    queue.form = "Retry";
    setSelectedQueue(queue);
    setShowClaimForm(true);
  };

  const handleFormRetryClose = () => {
    setShowClaimForm(false);
  };

  // Save claim form changes
  const handleFormClaimSave = async (formData: any) => {
    try {
      const payload = {
        id: formData.id,
        estimated_start: formData.start_date,
        estimated_end: formData.end_date,
      };

      await api.post(`/api/queues/claim`, payload);

      toast.success("Data updated successfully!");
      setShowClaimForm(false);
      fetchQueues();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error.message ||
        "Unknown error";

      toast.error(`Update failed! ${errorMessage}`);
    }
  };

  // Save claim form changes
  const handleFormRetrySave = async (formData: any) => {
    try {
      const payload = {
        Notes: formData.notes,
      };

      await api.put("/api/queues/requeue/" + formData.id, payload);

      toast.success("Data updated successfully!");
      setShowClaimForm(false);
      fetchQueues();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error.message ||
        "Unknown error";

      toast.error(`Update failed! ${errorMessage}`);
    }
  };

  // Save edit form changes (implement sesuai backend)
  const handleFormEditSave = async (formData: any) => {
    try {
      const payload = {
        Status: formData.status,
        Notes: formData.notes,
      };

      await api.put("/api/queues/claimupdate/" + formData.id, payload);

      toast.success("Data updated successfully!");
      setShowClaimForm(false);
      fetchQueues();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error.message ||
        "Unknown error";

      toast.error(`Update failed! ${errorMessage}`);
    }
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setSearchValue(searchTerm);
    }
  }

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in_process", label: "In Process" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchQueues}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
 
}
