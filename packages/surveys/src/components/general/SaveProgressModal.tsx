import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";

interface SaveProgressModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  surveyId: string;
  responseId?: string;
  saveProgressApiUrl?: string;
}

export const SaveProgressModal = ({
  open,
  setOpen,
  surveyId,
  responseId,
  saveProgressApiUrl = "/api/v1/client/save-progress",
}: SaveProgressModalProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!responseId) {
      setError(
        t("common.no_progress_to_save", "No progress to save yet. Please answer at least one question.")
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(saveProgressApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId, responseId, email }),
      });

      if (!res.ok) {
        throw new Error("Failed to save progress");
      }

      setSuccess(true);
    } catch (err) {
      setError(t("common.error_occurred", "An error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 p-4 transition-opacity"
      onClick={() => setOpen(false)}
      aria-modal="true"
      role="dialog">
      <div
        className="bg-survey-bg relative w-full max-w-md rounded-lg shadow-xl ring-1 ring-slate-900/5 transition-all"
        onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-heading text-xl font-bold">
              {t("common.save_and_continue_later", "Save & Continue Later")}
            </h2>
            <p className="text-subheading mt-2 text-sm">
              {t(
                "common.enter_email_to_resume",
                "Enter your email to receive a link to resume your form later."
              )}
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <svg
                  className="h-12 w-12 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-heading mb-6 font-medium">
                {t("common.link_sent", "Link sent! Check your inbox.")}
              </p>
              <button
                type="button"
                className="bg-brand text-on-brand focus:ring-focus focus:outline-hidden w-full rounded-md px-4 py-2 font-medium hover:opacity-90 focus:ring-2 focus:ring-offset-2"
                onClick={() => setOpen(false)}>
                {t("common.close", "Close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-heading block text-sm font-medium">
                    {t("common.email_address", "Email address")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    className="border-border bg-input-bg text-heading placeholder:text-placeholder focus:border-brand focus:ring-brand shadow-xs mt-1 block w-full rounded-md sm:text-sm"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="text-heading hover:bg-input-bg focus:ring-focus focus:outline-hidden rounded-md px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2"
                    onClick={() => setOpen(false)}>
                    {t("common.cancel", "Cancel")}
                  </button>
                  <button
                    type="submit"
                    className="bg-brand text-on-brand focus:ring-focus focus:outline-hidden rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                    disabled={loading}>
                    {loading ? t("common.sending", "Sending...") : t("common.send_link", "Send Link")}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
