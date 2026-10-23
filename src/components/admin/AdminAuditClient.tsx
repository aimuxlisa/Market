"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatDate } from "@/lib/format";
import { Search } from "lucide-react";

interface AuditItem {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: string | null;
  timestamp: string;
}

export const AdminAuditClient: React.FC = () => {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState("");
  const [actorFilter, setActorFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/audit-logs?entity=${entityFilter}&actor=${encodeURIComponent(actorFilter)}&limit=100`);
      if (res.ok) {
        const d = await res.json();
        setLogs(d.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entityFilter, actorFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          background: "var(--bg-card)",
          padding: "1.25rem 1.5rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-card)",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", flex: 1 }}>
          <div style={{ position: "relative", minWidth: 240, flex: 1, maxWidth: 360 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="input"
              placeholder="Поиск по email администратора..."
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              style={{ paddingLeft: "2.2rem" }}
            />
          </div>

          <select
            className="select"
            style={{ width: "auto", minWidth: 200 }}
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option value="">Все объекты</option>
            <option value="Product">Товары (Product)</option>
            <option value="Category">Категории (Category)</option>
            <option value="Order">Заказы (Order)</option>
            <option value="Promotion">Баннеры (Promotion)</option>
            <option value="User">Пользователи (User)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-card)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.02)" }}>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Время</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Администратор</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Действие</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Сущность / ID</th>
                <th style={{ padding: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>Детали изменений</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Загрузка журнала аудита...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Записи в журнале не найдены
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} style={{ borderBottom: "1px solid var(--border-subtle)", verticalAlign: "top" }}>
                    <td style={{ padding: "1rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {formatDate(l.timestamp)}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "var(--accent-cyan)", whiteSpace: "nowrap" }}>
                      {l.actor}
                    </td>
                    <td style={{ padding: "1rem", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: l.action.startsWith("DELETE")
                            ? "rgba(239, 68, 68, 0.15)"
                            : l.action.startsWith("CREATE")
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(0, 229, 255, 0.12)",
                          color: l.action.startsWith("DELETE")
                            ? "var(--color-danger)"
                            : l.action.startsWith("CREATE")
                            ? "var(--color-success)"
                            : "var(--accent-cyan)",
                        }}
                      >
                        {l.action}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", color: "#FFF" }}>
                      <span style={{ fontWeight: 600 }}>{l.entity}</span>
                      {l.entityId && (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", fontFamily: "monospace" }}>
                          #{l.entityId}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)", maxWidth: "400px" }}>
                      {l.metadata ? (
                        <pre style={{ margin: 0, fontSize: "0.75rem", background: "var(--bg-surface)", padding: "0.5rem", borderRadius: "4px", overflowX: "auto" }}>
                          {JSON.stringify(JSON.parse(l.metadata), null, 2)}
                        </pre>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
