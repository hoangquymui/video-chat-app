import { AlertTriangle, HelpCircle, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type DialogOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
};

type DialogState = DialogOptions & {
  mode: "alert" | "confirm";
};

type AppDialogValue = {
  notify: (options: string | DialogOptions) => Promise<void>;
  confirmAction: (options: string | DialogOptions) => Promise<boolean>;
};

const AppDialogContext = createContext<AppDialogValue | null>(null);

export function AppDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const open = useCallback(
    (mode: DialogState["mode"], options: string | DialogOptions) =>
      new Promise<boolean>((resolve) => {
        resolverRef.current?.(false);
        resolverRef.current = resolve;
        setDialog({
          mode,
          ...(typeof options === "string" ? { message: options } : options),
        });
      }),
    [],
  );

  const close = useCallback((result: boolean) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setDialog(null);
  }, []);

  const notify = useCallback(
    async (options: string | DialogOptions) => {
      await open("alert", options);
    },
    [open],
  );

  const confirmAction = useCallback(
    (options: string | DialogOptions) => open("confirm", options),
    [open],
  );

  return (
    <AppDialogContext.Provider value={{ notify, confirmAction }}>
      {children}
      {dialog && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-dialog-title"
            className="w-full max-w-sm rounded-xl border border-white/8 bg-[#0d111b] p-5 text-white shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  dialog.tone === "danger"
                    ? "bg-red-500/12 text-red-300"
                    : "bg-indigo-500/12 text-indigo-300"
                }`}
              >
                {dialog.tone === "danger" ? (
                  <AlertTriangle size={18} />
                ) : (
                  <HelpCircle size={18} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="app-dialog-title" className="text-sm font-bold">
                  {dialog.title ??
                    (dialog.mode === "confirm" ? "Xác nhận thao tác" : "Thông báo")}
                </h2>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-400">
                  {dialog.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => close(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-white/7 hover:text-white"
                aria-label="Đóng"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              {dialog.mode === "confirm" && (
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="h-9 rounded-md bg-white/7 px-4 text-xs font-semibold text-slate-200 hover:bg-white/12"
                >
                  {dialog.cancelLabel ?? "Không"}
                </button>
              )}
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className={`h-9 rounded-md px-4 text-xs font-semibold text-white ${
                  dialog.tone === "danger"
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-indigo-500 hover:bg-indigo-400"
                }`}
              >
                {dialog.confirmLabel ??
                  (dialog.mode === "confirm" ? "Có, tiếp tục" : "Đóng")}
              </button>
            </div>
          </section>
        </div>
      )}
    </AppDialogContext.Provider>
  );
}

export function useAppDialog() {
  const context = useContext(AppDialogContext);
  if (!context) {
    throw new Error("useAppDialog must be used inside AppDialogProvider");
  }
  return context;
}
