import { useRef, useState } from "react";

/** A clearly local handoff until an owner and delivery channel are agreed. */
export function PresentationFeedback({ uk }: { uk: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [downloaded, setDownloaded] = useState(false);
  return (
    <>
      <button
        className="briefing-slide-action"
        onClick={() => {
          setDownloaded(false);
          dialog.current?.showModal();
        }}
      >
        {uk ? "Підготувати відгук" : "Prepare feedback"}
      </button>
      <dialog className="presentation-feedback" ref={dialog} aria-labelledby="feedback-title">
        <button
          className="feedback-close"
          aria-label={uk ? "Закрити" : "Close"}
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
        <h2 id="feedback-title">
          {uk ? "Що було б корисним для вашої роботи?" : "What would be useful in your work?"}
        </h2>
        <p>
          {uk
            ? "Це локальна чернетка. Форма не надсилає даних. Завантажте відгук і передайте його своєму контакту в команді проєкту."
            : "This is a local draft. The form sends no data. Download your feedback and share it with your contact in the project team."}
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const body = [
              "Insight Hub — feedback",
              "",
              (uk ? "Робочий запит: " : "Work enquiry: ") + String(data.get("need") ?? ""),
              "",
              (uk ? "Корисне / зміни: " : "Useful aspects / changes: ") +
                String(data.get("changes") ?? ""),
            ].join("\n");
            const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = "Insight-Hub-feedback.txt";
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            setDownloaded(true);
          }}
        >
          <label>
            {uk ? "Яку задачу ви хотіли б виконати?" : "What task would you want to complete?"}
            <textarea name="need" rows={3} required />
          </label>
          <label>
            {uk ? "Що корисне і що варто змінити?" : "What is useful and what would you change?"}
            <textarea name="changes" rows={3} />
          </label>
          <button type="submit">
            {uk ? "Завантажити чернетку відгуку" : "Download feedback draft"}
          </button>
        </form>
        {downloaded && (
          <p role="status">
            {uk
              ? "Файл підготовлено до завантаження. Відгук не надіслано команді."
              : "The file is ready to download. Feedback has not been sent to the team."}
          </p>
        )}
      </dialog>
    </>
  );
}
