import { useState, useMemo } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../lib/supabase";

interface TicketType {
  name: string;
  price: number;
}

interface WebBuyModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  eventId: string;
  ticketTypes: TicketType[];
  allowGuests: boolean;
  isPaid: boolean;
}

const IOS_URL = "https://apps.apple.com/it/app/alba/id6759857131";
const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.alba.app";

function getStoreUrl(): string {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return ANDROID_URL;
  return IOS_URL;
}

function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

export default function WebBuyModal({
  visible,
  onClose,
  postId,
  eventId,
  ticketTypes,
  allowGuests,
  isPaid,
}: WebBuyModalProps) {
  const [quantities, setQuantities] = useState<number[]>(() => ticketTypes.map(() => 1));
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalUnits = useMemo(() => quantities.reduce((s, q) => s + q, 0), [quantities]);

  const summaryLine = useMemo(() => {
    const parts: string[] = [];
    ticketTypes.forEach((tt, i) => {
      if (quantities[i] > 0) parts.push(`${quantities[i]}x ${tt.name}`);
    });
    return parts.join(", ");
  }, [ticketTypes, quantities]);

  const changeQty = (index: number, delta: number) => {
    setQuantities((prev) =>
      prev.map((q, i) => (i === index ? Math.max(0, q + delta) : q))
    );
  };

  const handleGetTicket = async () => {
    if (totalUnits === 0) { setError("Select at least one ticket."); return; }
    setLoading(true);
    setError(null);
    try {
      // Find the first selected ticket type
      const selectedIndex = quantities.findIndex((q) => q > 0);
      const product_type =
        selectedIndex >= 0 ? ticketTypes[selectedIndex].name : ticketTypes[0]?.name ?? null;

      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/issue-guest-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ post_id: postId, event_id: eventId, product_type }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json.code) {
        if (json.error === "paid_event") {
          setError("Paid events are available on the app only.");
          return;
        }
        throw new Error(json.error ?? "Unknown error");
      }
      setCode(json.code);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  const handleClose = () => {
    setCode(null);
    setError(null);
    setCopied(false);
    setQuantities(ticketTypes.map(() => 1));
    onClose();
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: "20px",
          width: "100%", maxWidth: "420px",
          padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Paid event blocker */}
        {isPaid ? (
          <PaidBlocker onClose={handleClose} />
        ) : code ? (
          /* Success screen */
          <SuccessScreen
            code={code}
            copied={copied}
            onCopy={handleCopy}
            onClose={handleClose}
          />
        ) : (
          /* Ticket selection */
          <>
            <h2 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "18px", color: "#111" }}>
              Get tickets
            </h2>

            {ticketTypes.map((tt, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "#111" }}>{tt.name}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {tt.price === 0 ? "Free" : `€${tt.price.toFixed(2)}`}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <StepperBtn
                    label="−"
                    onClick={() => changeQty(i, -1)}
                    disabled={quantities[i] <= 0}
                  />
                  <span style={{ minWidth: "20px", textAlign: "center", fontWeight: 700, fontSize: "15px" }}>
                    {quantities[i]}
                  </span>
                  <StepperBtn label="+" onClick={() => changeQty(i, 1)} />
                </div>
              </div>
            ))}

            {/* Divider + total */}
            <div style={{ height: 1, background: "#E5E7EB", margin: "14px 0" }} />
            <div style={{ textAlign: "right", marginBottom: "18px" }}>
              <div style={{ fontWeight: 700, fontSize: "16px", color: "#111" }}>
                {ticketTypes.every((tt) => tt.price === 0) ? "Free" : "Total"}
              </div>
              {summaryLine && (
                <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{summaryLine}</div>
              )}
            </div>

            {error && (
              <div style={{ color: "#E55353", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleGetTicket}
                disabled={loading || totalUnits === 0}
                style={{
                  flex: 1, padding: "12px", borderRadius: "12px",
                  background: loading || totalUnits === 0 ? "#93C5FD" : "#0ea5e9",
                  color: "#fff", fontWeight: 700, fontSize: "14px",
                  border: "none", cursor: loading || totalUnits === 0 ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "Processing…" : "Get ticket"}
              </button>
              <button
                onClick={handleClose}
                disabled={loading}
                style={{
                  flex: 1, padding: "12px", borderRadius: "12px",
                  background: "#F3F4F6", color: "#6B7280",
                  fontWeight: 700, fontSize: "14px",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StepperBtn({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "32px", height: "32px", borderRadius: "8px",
        border: "1.5px solid #E5E7EB",
        background: disabled ? "#F9FAFB" : "#fff",
        color: disabled ? "#D1D5DB" : "#0ea5e9",
        fontWeight: 700, fontSize: "18px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

function SuccessScreen({
  code,
  copied,
  onCopy,
  onClose,
}: {
  code: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", marginBottom: "10px" }}>
        Your ticket is available on Alba!
      </h2>
      <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px", lineHeight: "1.5" }}>
        Copy the code below and download the app to find it.
      </p>

      {/* Code display */}
      <div
        style={{
          background: "#F3F4F6", borderRadius: "12px",
          padding: "14px 18px", marginBottom: "12px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
        }}
      >
        <span style={{
          fontWeight: 700, fontSize: "20px", letterSpacing: "3px",
          color: "#111", flex: 1, textAlign: "center", userSelect: "all",
        }}>
          {code}
        </span>
        <button
          onClick={onCopy}
          style={{
            background: copied ? "#10B981" : "#0ea5e9",
            color: "#fff", border: "none",
            borderRadius: "8px", padding: "8px 14px",
            fontWeight: 700, fontSize: "13px",
            cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <a
        href={isAndroid() ? "https://play.google.com/store/apps/details?id=com.alba.app" : "https://apps.apple.com/it/app/alba/id6759857131"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", marginBottom: "12px",
          padding: "12px", borderRadius: "12px",
          background: "#0f172a", color: "#fff",
          fontWeight: 700, fontSize: "14px",
          textDecoration: "none", fontFamily: "inherit",
        }}
      >
        Download Alba
      </a>

      <button
        onClick={onClose}
        style={{
          width: "100%", padding: "10px",
          background: "none", border: "none",
          color: "#9CA3AF", fontSize: "13px",
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        Close
      </button>
    </div>
  );
}

function PaidBlocker({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎟️</div>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111", marginBottom: "10px" }}>
        Paid events are available on the app only
      </h2>
      <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px", lineHeight: "1.5" }}>
        Download Alba to buy tickets for this event.
      </p>
      <a
        href={isAndroid() ? "https://play.google.com/store/apps/details?id=com.alba.app" : "https://apps.apple.com/it/app/alba/id6759857131"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", marginBottom: "12px",
          padding: "12px", borderRadius: "12px",
          background: "#0ea5e9", color: "#fff",
          fontWeight: 700, fontSize: "14px",
          textDecoration: "none", fontFamily: "inherit",
        }}
      >
        Download Alba
      </a>
      <button
        onClick={onClose}
        style={{
          width: "100%", padding: "10px",
          background: "none", border: "none",
          color: "#9CA3AF", fontSize: "13px",
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        Close
      </button>
    </div>
  );
}
