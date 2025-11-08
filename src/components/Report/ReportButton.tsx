import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Flag, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";

interface ReportItemProps {
  itemId: string;
  onReport?: (
    itemId: string,
    reason: string,
    description: string
  ) => Promise<void>;
}

export const ReportButton: React.FC<ReportItemProps> = ({
  itemId,
  onReport,
}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    { value: "duplicate", label: "Duplicate Listing" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "spam", label: "Spam" },
    { value: "false", label: "False Information" },
    { value: "offensive", label: "Offensive/Abusive" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setLoading(true);
    try {
      if (onReport) {
        await onReport(itemId, reason, description);
      }
      setSubmitted(true);
      toast.success("Report submitted successfully");

      setTimeout(() => {
        setOpen(false);
        setReason("");
        setDescription("");
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Flag className="w-4 h-4 mr-2" />
        Report
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Report This Item
            </DialogTitle>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <Check className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="font-semibold text-gray-900">Report Submitted</p>
                <p className="text-sm text-gray-600 mt-1">
                  Thank you for helping us keep ReUniteMe safe. Our moderation
                  team will review this report shortly.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Report
                </label>
                <div className="space-y-2">
                  {reasons.map((r) => (
                    <label
                      key={r.value}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (Optional)
                </label>
                <Textarea
                  placeholder="Provide any additional information that might help our review..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-24 resize-none"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/500
                </p>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  <strong>Privacy:</strong> Your report is confidential and will
                  only be reviewed by our moderation team.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleSubmit}
                  disabled={!reason || loading}
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportButton;
