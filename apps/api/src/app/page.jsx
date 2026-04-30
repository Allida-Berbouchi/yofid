"use client";

import { useEffect, useState } from "react";
import { fetchContentList } from "@/lib/api";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchContentList()
      .then((list) => {
        if (cancelled) return;
        setItems(list);
      })
      .catch((e) => {
        if (cancelled) return;
        setErr(e?.message || "Failed to load content");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Yovid</h1>
      <p>Simple feed: approved resources sorted by rankScore.</p>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {!err && items.length === 0 ? (
        <p>No content to display.</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {items.map((r) => (
            <li key={r._id}>
              <b>{r.title}</b> - {r.type} - <small>{r.status}</small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
