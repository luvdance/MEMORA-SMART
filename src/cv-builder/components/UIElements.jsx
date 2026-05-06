export function Label({ children }) {
  return <label className="cv-label">{children}</label>;
}

export function Input({ className, ...props }) {
  return (
    <input
      type="text"
      {...props}
      className={`cv-input ${className || ""}`}
    />
  );
}

export function Textarea({ className, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`cv-textarea ${className || ""}`}
    />
  );
}

export function AiBtn({ onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} className="cv-ai-btn">
      {loading ? (
        <><i className="fas fa-spinner fa-spin"></i> Thinking...</>
      ) : (
        <><i className="fas fa-magic"></i> AI Suggest</>
      )}
    </button>
  );
}