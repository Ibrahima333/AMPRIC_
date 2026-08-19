import { useEffect, useState } from "react";

export default function FlashBanner({ category, message, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return undefined;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (visible || !message) return undefined;
    const timer = setTimeout(() => onDone?.(), 200);
    return () => clearTimeout(timer);
  }, [visible, message, onDone]);

  if (!message) return null;

  return (
    <div className={category} style={{ opacity: visible ? 1 : 0 }}>
      <p>{message}</p>
    </div>
  );
}
