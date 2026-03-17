"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  List,
  Users,
  Settings,
  Plus,
  LogOut,
  DatabaseZap,
  Clock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Circle,
  Trash2,
  StickyNote,
  Menu,
  X,
  CheckSquare,
  Square,
} from "lucide-react";

import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge }    from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Item {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  done?: boolean;
}

const NAV_ITEMS = [
  { label: "Today",    icon: LayoutDashboard, active: true  },
  { label: "All",      icon: List                           },
  { label: "Account",  icon: Users                          },
  { label: "Settings", icon: Settings                       },
];

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return `${Math.floor(diff)}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ── Sidebar (desktop) ──────────────────────────────────────────────────────
function Sidebar({
  itemCount,
  doneCount,
  onLogout,
  open,
  onClose,
}: {
  itemCount: number;
  doneCount: number;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}) {
  const pct = itemCount > 0 ? Math.round((doneCount / itemCount) * 100) : 0;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[280px] flex flex-col
          bg-[#FDFAF6] border-r border-[#EDE8DF]
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-[260px] lg:shrink-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="px-6 h-16 flex items-center justify-between border-b border-[#EDE8DF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2D2A26] flex items-center justify-center">
              <StickyNote className="w-4 h-4 text-[#F5C97A]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#2D2A26] leading-none" style={{ fontFamily: "var(--font-display)" }}>
                My Tasks
              </p>
              <p className="text-[10px] text-[#A89F94] font-mono mt-0.5">personal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#EDE8DF] transition-colors text-[#A89F94]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress ring */}
        <div className="mx-4 mt-5 mb-1 p-4 rounded-2xl bg-white border border-[#EDE8DF]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-[#2D2A26]">Today's progress</p>
            <span className="text-[12px] font-bold text-[#2D2A26] font-mono">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#EDE8DF] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2D2A26] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-[#A89F94] mt-2">
            {doneCount} of {itemCount} tasks complete
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                active
                  ? "bg-[#2D2A26] text-white"
                  : "text-[#7A7066] hover:bg-[#EDE8DF] hover:text-[#2D2A26]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? "opacity-100" : "opacity-60 group-hover:opacity-80"}`} />
              <span className="flex-1 text-left">{label}</span>
              {label === "All" && itemCount > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg ${active ? "bg-white/20 text-white/80" : "bg-[#EDE8DF] text-[#7A7066]"}`}>
                  {itemCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Stats strip */}
        <div className="mx-4 mb-4 p-3 rounded-2xl bg-white border border-[#EDE8DF] space-y-2.5">
          <StatPill icon={DatabaseZap} label="Atlas" value="Connected" color="emerald" />
          <StatPill icon={ShieldCheck} label="Auth"   value="JWT active" color="blue"    />
        </div>

        {/* User */}
        <div className="px-3 pb-4 pt-3 border-t border-[#EDE8DF] space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#2D2A26] flex items-center justify-center text-[11px] font-bold text-[#F5C97A] shrink-0 font-mono">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#2D2A26] truncate">student@example.com</p>
              <p className="text-[10px] text-[#A89F94] font-mono">demo-001</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="w-full h-9 text-[12px] text-[#7A7066] hover:text-[#2D2A26] hover:bg-[#EDE8DF] gap-2 rounded-xl"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}

function StatPill({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: "emerald" | "blue" }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue:    "bg-blue-50 text-blue-700",
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-[#A89F94]" />
        <span className="text-[11px] text-[#7A7066]">{label}</span>
      </div>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>
        {value}
      </span>
    </div>
  );
}

// ── Todo item ──────────────────────────────────────────────────────────────
function TodoItem({
  item,
  index,
  onToggle,
  onDelete,
}: {
  item: Item;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="group flex items-start gap-3.5 px-4 py-4 hover:bg-[#FDFAF6] transition-colors rounded-xl mx-1"
      style={{ animation: `item-in 0.18s ease-out ${index * 40}ms both` }}
    >
      <button
        onClick={() => onToggle(item._id)}
        className="mt-0.5 shrink-0 transition-transform active:scale-90"
      >
        {item.done ? (
          <CheckSquare className="w-5 h-5 text-[#2D2A26]" />
        ) : (
          <Square className="w-5 h-5 text-[#C8C0B6] group-hover:text-[#2D2A26] transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-medium leading-snug transition-all ${item.done ? "line-through text-[#C8C0B6]" : "text-[#2D2A26]"}`}>
          {item.title}
        </p>
        {item.description && (
          <p className={`text-[12px] mt-0.5 leading-snug ${item.done ? "text-[#D4CEC8]" : "text-[#A89F94]"}`}>
            {item.description}
          </p>
        )}
        <p className="text-[10px] text-[#C8C0B6] font-mono mt-1.5">
          {relativeTime(item.createdAt)}
        </p>
      </div>

      <button
        onClick={() => onDelete(item._id)}
        className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-400 text-[#C8C0B6] transition-all mt-0.5"
        aria-label="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Mobile bottom nav ──────────────────────────────────────────────────────
function BottomNav({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white/90 backdrop-blur-md border-t border-[#EDE8DF] flex items-center px-2 pb-safe">
      {[
        { label: "Today",  icon: LayoutDashboard, active: true  },
        { label: "All",    icon: List                           },
        { label: "More",   icon: Menu, action: onMenuOpen       },
      ].map(({ label, icon: Icon, active, action }) => (
        <button
          key={label}
          onClick={action}
          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-colors ${
            active ? "text-[#2D2A26]" : "text-[#A89F94]"
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [items,      setItems]      = useState<Item[]>([]);
  const [title,      setTitle]      = useState("");
  const [desc,       setDesc]       = useState("");
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [errorMsg,   setErrorMsg]   = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter,     setFilter]     = useState<"all" | "active" | "done">("all");

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/items", { cache: "no-store" });
      const contentType = res.headers.get("content-type") || "";

      if (res.redirected || contentType.includes("text/html")) {
        router.push("/login");
        return;
      }

      const raw = await res.text();
      const parsed = raw ? JSON.parse(raw) : null;

      if (!res.ok) {
        const message =
          parsed && typeof parsed === "object" && "error" in parsed
            ? String((parsed as { error?: string }).error || "Failed to load items")
            : `Failed to load items (${res.status})`;
        setErrorMsg(message);
        setItems([]);
        return;
      }

      const data = Array.isArray(parsed) ? (parsed as Item[]) : [];

      // Restore local done state from sessionStorage
      const doneIds: string[] = JSON.parse(sessionStorage.getItem("done_ids") || "[]");
      setItems(data.map((item: Item) => ({ ...item, done: doneIds.includes(item._id) })));
    } catch {
      setErrorMsg("Unable to load tasks right now.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleDone(id: string) {
    setItems(prev => {
      const next = prev.map(i => i._id === id ? { ...i, done: !i.done } : i);
      const doneIds = next.filter(i => i.done).map(i => i._id);
      sessionStorage.setItem("done_ids", JSON.stringify(doneIds));
      return next;
    });
  }

  function deleteLocal(id: string) {
    setItems(prev => prev.filter(i => i._id !== id));
  }

  async function createItem() {
    if (!title.trim()) return;
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc }),
      });
      const raw = await res.text();
      const parsed = raw ? JSON.parse(raw) : null;

      if (!res.ok || !parsed || Array.isArray(parsed)) {
        setErrorMsg(`Failed to create task (${res.status})`);
        return;
      }

      const newItem = parsed as Item;
      setItems(prev => [{ ...newItem, done: false }, ...prev]);
      setTitle("");
      setDesc("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      setErrorMsg("Unable to create task right now.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const doneCount   = items.filter(i => i.done).length;
  const filtered    = filter === "all"    ? items
                    : filter === "active" ? items.filter(i => !i.done)
                    :                       items.filter(i =>  i.done);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=DM+Mono:wght@400;500&display=swap');
        :root { --font-display: 'Lato', sans-serif; --font-mono: 'DM Mono', monospace; }
        .todo-shell, .todo-shell * { font-family: var(--font-display); }
        .todo-shell .mono { font-family: var(--font-mono) !important; }

        .todo-shell input, .todo-shell textarea {
          font-size: 14px !important;
          font-family: var(--font-display) !important;
        }
        .todo-shell input:focus, .todo-shell textarea:focus {
          border-color: #2D2A26 !important;
          box-shadow: 0 0 0 3px rgba(45,42,38,0.08) !important;
          outline: none !important;
        }

        @keyframes item-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Safe area for mobile bottom nav */
        .pb-safe { padding-bottom: max(12px, env(safe-area-inset-bottom)); }

        /* Filter tab active underline */
        .filter-tab { position: relative; }
        .filter-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: #2D2A26;
          border-radius: 2px;
        }
      `}</style>

      <TooltipProvider>
        <div className="todo-shell flex h-screen overflow-hidden bg-[#F7F3EE]">

          <Sidebar
            itemCount={items.length}
            doneCount={doneCount}
            onLogout={handleLogout}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">

            {/* Topbar */}
            <header className="h-16 px-4 sm:px-6 flex items-center justify-between bg-[#FDFAF6] border-b border-[#EDE8DF] shrink-0">
              <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-[#EDE8DF] transition-colors text-[#7A7066]"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-[18px] font-black text-[#2D2A26] leading-tight">
                    {greeting()} 👋
                  </h1>
                  <p className="text-[11px] text-[#A89F94] hidden sm:block">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 mono hidden sm:inline">connected</span>
                </div>
              </div>
            </header>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
              <div className="max-w-[780px] mx-auto px-4 sm:px-6 py-6 space-y-5">

                {/* Add task card */}
                <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-[#EDE8DF] flex items-center justify-between">
                    <p className="text-[14px] font-bold text-[#2D2A26]">New task</p>
                    <Badge
                      variant="outline"
                      className="mono text-[10px] font-medium text-amber-600 bg-amber-50 border-amber-200 px-2 py-0.5 rounded-lg"
                    >
                      POST /api/items
                    </Badge>
                  </div>

                  <div className="px-5 py-4 space-y-3">
                    <Input
                      placeholder="What do you need to do?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && createItem()}
                      className="h-11 border-[#EDE8DF] bg-[#FDFAF6] text-[#2D2A26] placeholder:text-[#C8C0B6] rounded-xl text-[14px]"
                    />
                    <Textarea
                      placeholder="Add a note… (optional)"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="resize-none h-[72px] border-[#EDE8DF] bg-[#FDFAF6] text-[#2D2A26] placeholder:text-[#C8C0B6] rounded-xl text-[13px]"
                    />
                    <button
                      onClick={createItem}
                      disabled={saving || !title.trim()}
                      className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all duration-150 disabled:opacity-40 active:scale-[0.98] ${
                        saved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : saving
                          ? "bg-[#EDE8DF] text-[#A89F94]"
                          : "bg-[#2D2A26] text-white hover:bg-[#1a1916]"
                      }`}
                    >
                      {saving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</>
                      ) : saved ? (
                        <><CheckCircle2 className="w-4 h-4" /> Task added!</>
                      ) : (
                        <><Plus className="w-4 h-4" /> Add task</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tasks list card */}
                <div className="bg-white rounded-2xl border border-[#EDE8DF] overflow-hidden shadow-sm">
                  {errorMsg && (
                    <div className="mx-4 mt-4 mb-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
                      {errorMsg}
                    </div>
                  )}

                  {/* Filter tabs */}
                  <div className="px-4 border-b border-[#EDE8DF] flex items-center gap-1">
                    {(["all", "active", "done"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`filter-tab ${filter === f ? "active" : ""} px-3 py-3.5 text-[12px] font-semibold capitalize transition-colors ${
                          filter === f ? "text-[#2D2A26]" : "text-[#A89F94] hover:text-[#7A7066]"
                        }`}
                      >
                        {f}
                        {f === "active" && items.filter(i => !i.done).length > 0 && (
                          <span className="ml-1.5 text-[10px] mono bg-[#F7F3EE] text-[#7A7066] px-1.5 py-0.5 rounded-md">
                            {items.filter(i => !i.done).length}
                          </span>
                        )}
                        {f === "done" && doneCount > 0 && (
                          <span className="ml-1.5 text-[10px] mono bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md">
                            {doneCount}
                          </span>
                        )}
                      </button>
                    ))}
                    <div className="ml-auto">
                      <Badge
                        variant="outline"
                        className="mono text-[10px] font-medium text-[#A89F94] bg-[#FDFAF6] border-[#EDE8DF] px-2 py-0.5 rounded-lg"
                      >
                        GET /api/items
                      </Badge>
                    </div>
                  </div>

                  {/* List */}
                  <div className="py-1">
                    {loading ? (
                      <div className="space-y-1 p-2">
                        {[1,2,3].map((i) => (
                          <div key={i} className="flex items-center gap-3.5 px-4 py-4 animate-pulse">
                            <div className="w-5 h-5 rounded bg-[#EDE8DF] shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-3/5 rounded-full bg-[#EDE8DF]" />
                              <div className="h-2.5 w-2/5 rounded-full bg-[#F7F3EE]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="py-16 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#F7F3EE] border border-[#EDE8DF] flex items-center justify-center">
                          {filter === "done"
                            ? <CheckCircle2 className="w-6 h-6 text-[#C8C0B6]" />
                            : <Circle className="w-6 h-6 text-[#C8C0B6]" />
                          }
                        </div>
                        <div className="text-center">
                          <p className="text-[14px] font-bold text-[#A89F94]">
                            {filter === "done" ? "Nothing completed yet" : "You're all caught up!"}
                          </p>
                          <p className="text-[12px] text-[#C8C0B6] mt-1">
                            {filter === "active" ? "Add a new task above" : filter === "done" ? "Complete a task to see it here" : "Add your first task above ↑"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F7F3EE]">
                        {filtered.map((item, i) => (
                          <TodoItem
                            key={item._id}
                            item={item}
                            index={i}
                            onToggle={toggleDone}
                            onDelete={deleteLocal}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer summary */}
                  {!loading && items.length > 0 && (
                    <div className="px-5 py-3 bg-[#FDFAF6] border-t border-[#EDE8DF] flex items-center justify-between">
                      <p className="text-[11px] text-[#A89F94] mono">
                        {items.filter(i => !i.done).length} remaining
                      </p>
                      {doneCount > 0 && (
                        <button
                          onClick={() => setItems(prev => prev.filter(i => !i.done))}
                          className="text-[11px] text-[#A89F94] hover:text-red-400 transition-colors font-semibold"
                        >
                          Clear done
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          <BottomNav onMenuOpen={() => setSidebarOpen(true)} />
        </div>
      </TooltipProvider>
    </>
  );
}