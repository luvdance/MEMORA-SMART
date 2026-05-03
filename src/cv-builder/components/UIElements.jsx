export function Label({ children }) {
  return <label className="cv-label">{children}</label>;
}

export function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="cv-input"
    />
  );
}

export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="cv-textarea"
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