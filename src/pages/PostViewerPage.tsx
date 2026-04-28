import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import WebBuyModal from "../components/WebBuyModal";

interface PostData {
  id: string | number;
  title: string;
  description: string | null;
  date: string | null;
  time: string | null;
  end_date: string | null;
  end_time: string | null;
  all_day: boolean;
  location: string | null;
  type: string | null;
  postmediauri: string[] | null;
  allow_guests: boolean;
  product_types: string[] | null;
  product_prices: number[] | null;
  is_ticket_number_fixed: boolean;
  ticket_number: number | null;
}

interface EventData {
  id: string;
  post_id: string | number;
  ticket_holders: string[] | null;
}

const IOS_URL = "https://apps.apple.com/it/app/alba/id6759857131";
const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.alba.app";

function getStoreUrl(): string {
  if (/android/i.test(navigator.userAgent)) return ANDROID_URL;
  return IOS_URL;
}

function formatDate(dateStr: string | null, allDay: boolean): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

function formatTime(timeStr: string | null): string | null {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export default function PostViewerPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buyModalVisible, setBuyModalVisible] = useState(false);

  useEffect(() => {
    if (!postId) { setNotFound(true); setLoading(false); return; }
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, description, date, time, end_date, end_time, all_day, location, type, postmediauri, allow_guests, product_types, product_prices, is_ticket_number_fixed, ticket_number")
          .eq("id", postId)
          .maybeSingle();

        if (cancelled) return;
        if (error || !data) { setNotFound(true); return; }
        setPost(data as PostData);

        // Fetch related event for ticket purchase
        if (data.type === "Event" || data.type === "event") {
          const { data: ev } = await supabase
            .from("events")
            .select("id, post_id, ticket_holders")
            .eq("post_id", postId)
            .maybeSingle();
          if (!cancelled && ev) setEvent(ev as EventData);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [postId]);

  const isEvent = post?.type?.toLowerCase() === "event";
  const ticketTypes = (() => {
    const types = post?.product_types ?? [];
    const prices = post?.product_prices ?? [];
    return types.map((name, i) => ({ name, price: Number(prices[i] ?? 0) }));
  })();
  const isPaid = ticketTypes.some((tt) => tt.price > 0);
  const isSoldOut = (() => {
    if (!post?.is_ticket_number_fixed || !post?.ticket_number) return false;
    const holders = event?.ticket_holders?.length ?? 0;
    return holders >= post.ticket_number;
  })();

  const coverImage = Array.isArray(post?.postmediauri) ? post.postmediauri[0] : null;
  const deepLink = `alba://post/${postId}`;

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f9ff",
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Minimal header */}
      <header style={{
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e2e8f0", padding: "14px 20px",
        display: "flex", alignItems: "center", gap: "10px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icon.png" alt="" style={{ width: "28px", height: "28px" }} />
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0ea5e9" }}>alba</span>
        </a>
      </header>

      <main style={{ maxWidth: "520px", margin: "0 auto", padding: "0 0 60px 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: "80px", color: "#94a3b8" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            <p>Loading…</p>
          </div>
        ) : notFound || !post ? (
          <NotFoundView />
        ) : (
          <>
            {/* Cover image */}
            {coverImage && (
              <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#e2e8f0" }}>
                <img
                  src={coverImage}
                  alt={post.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ padding: "24px 20px" }}>
              {/* Type badge */}
              {isEvent && (
                <span style={{
                  display: "inline-block", background: "#e0f2fe", color: "#0284c7",
                  fontSize: "11px", fontWeight: 600, padding: "3px 10px",
                  borderRadius: "20px", marginBottom: "10px", textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  event
                </span>
              )}

              {/* Title */}
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", marginBottom: "14px", lineHeight: "1.3" }}>
                {post.title}
              </h1>

              {/* Date / time / location */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" }}>
                {(post.date || post.all_day) && (
                  <InfoRow icon="📅" text={
                    post.all_day
                      ? `${formatDate(post.date, true)} · All day`
                      : [formatDate(post.date, false), formatTime(post.time)].filter(Boolean).join(" · ")
                  } />
                )}
                {post.location && <InfoRow icon="📍" text={post.location} />}
              </div>

              {/* Description */}
              {post.description && (
                <p style={{
                  fontSize: "14px", color: "#475569", lineHeight: "1.65",
                  marginBottom: "24px", whiteSpace: "pre-wrap",
                }}>
                  {post.description}
                </p>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {isEvent && event && post.allow_guests && (
                  isSoldOut ? (
                    <div style={{
                      textAlign: "center", padding: "14px",
                      background: "#FEE2E2", borderRadius: "14px",
                      color: "#B91C1C", fontWeight: 600, fontSize: "14px",
                    }}>
                      Sold out
                    </div>
                  ) : (
                    <button
                      onClick={() => setBuyModalVisible(true)}
                      style={{
                        padding: "15px", borderRadius: "14px",
                        background: "#0ea5e9", color: "#fff",
                        fontWeight: 700, fontSize: "16px",
                        border: "none", cursor: "pointer",
                        fontFamily: "inherit", width: "100%",
                      }}
                    >
                      Get tickets
                    </button>
                  )
                )}

                {/* Open in app */}
                <a
                  href={deepLink}
                  style={{
                    display: "block", padding: "13px", borderRadius: "14px",
                    background: "#f1f5f9", color: "#475569",
                    fontWeight: 600, fontSize: "14px",
                    textDecoration: "none", textAlign: "center",
                    border: "1.5px solid #e2e8f0",
                  }}
                >
                  Open in Alba app
                </a>

                <div style={{
                  display: "flex", flexDirection: "column", gap: "8px",
                  alignItems: "center", marginTop: "6px",
                }}>
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>Don't have Alba?</p>
                  <a
                    href={getStoreUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "10px 24px", borderRadius: "20px",
                      background: "#0f172a", color: "#fff",
                      fontWeight: 600, fontSize: "13px",
                      textDecoration: "none",
                    }}
                  >
                    {/android/i.test(navigator.userAgent) ? "Get it on Google Play" : "Download on the App Store"}
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Buy modal */}
      {isEvent && event && post && (
        <WebBuyModal
          visible={buyModalVisible}
          onClose={() => setBuyModalVisible(false)}
          postId={String(post.id)}
          eventId={event.id}
          ticketTypes={ticketTypes.length > 0 ? ticketTypes : [{ name: "General", price: 0 }]}
          allowGuests={post.allow_guests}
          isPaid={isPaid}
        />
      )}
    </div>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string | null }) {
  if (!text) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
      <span style={{ fontSize: "15px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <span style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>{text}</span>
    </div>
  );
}

function NotFoundView() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
        Post not found
      </h2>
      <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
        This post may have been removed or the link may be incorrect.
      </p>
      <a
        href="/"
        style={{
          display: "inline-block", padding: "10px 28px",
          background: "#0ea5e9", color: "#fff",
          borderRadius: "20px", fontWeight: 600,
          fontSize: "14px", textDecoration: "none",
        }}
      >
        Go to alba
      </a>
    </div>
  );
}
