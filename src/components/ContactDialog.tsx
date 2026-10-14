import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: "en" | "uk";
  /** Optional pre-filled note about the budget choice, shown as a read-only hint in the message field */
  budgetNote?: string | undefined;
}

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  message: z.string().min(1, { message: "Message is required" }),
});

// ---------------------------------------------------------------------------
// localStorage key
// ---------------------------------------------------------------------------

const STORAGE_KEY = "isrm-contact-submissions";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContactDialog({ open, onOpenChange, locale, budgetNote }: ContactDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(budgetNote ?? "");
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const uk = locale === "uk";
  const t = (en: string, ua: string) => (uk ? ua : en);

  // Reset form state whenever the dialog opens/closes
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Let the close animation finish before resetting
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setErrors({});
        setSubmitted(false);
      }, 300);
    }
    onOpenChange(next);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = contactSchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (!result.success) {
      const fieldErrors: ContactFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormState;
        if (!fieldErrors[field]) {
          // Localise the most common messages
          let msg = issue.message;
          if (field === "name" && issue.code === "too_small")
            msg = t("Name is required", "Ім'я обов'язкове");
          if (field === "email" && issue.code === "too_small")
            msg = t("Email is required", "Email обов'язковий");
          if (field === "email" && issue.code === "invalid_string")
            msg = t("Invalid email format", "Невірний формат email");
          if (field === "message" && issue.code === "too_small")
            msg = t("Message is required", "Повідомлення обов'язкове");
          fieldErrors[field] = msg;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    // Persist to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      const updated = [
        ...existing,
        { name: name.trim(), email: email.trim(), message: message.trim(), timestamp: new Date().toISOString() },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage may be unavailable (private browsing, storage quota); proceed anyway
    }

    setErrors({});
    setSubmitted(true);
    setTimeout(() => onOpenChange(false), 1800);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("Request a budget discussion", "Запит на обговорення бюджету")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t(
              "Fill in your details and we will contact you to discuss the project scope and budget.",
              "Заповніть дані — ми зв'яжемось з вами для обговорення обсягу та бюджету."
            )}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <p
            role="status"
            aria-live="polite"
            className="py-6 text-center text-base font-medium text-success"
          >
            {t(
              "Thank you. We will be in touch shortly.",
              "Дякуємо. Ми зв'яжемося з вами найближчим часом."
            )}
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-2 flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-name" className="text-base">
                {t("Your name", "Ваше ім'я")}
              </Label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                className="rounded border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  role="alert"
                  aria-live="polite"
                  className="text-sm text-destructive"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-email" className="text-base">
                {t("Your email", "Ваш email")}
              </Label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                className="rounded border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  role="alert"
                  aria-live="polite"
                  className="text-sm text-destructive"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-message" className="text-base">
                {t("Your message", "Ваше повідомлення")}
              </Label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                className="rounded border border-input bg-background px-3 py-2.5 text-base outline-none focus:border-primary resize-y"
              />
              {errors.message && (
                <p
                  id="contact-message-error"
                  role="alert"
                  aria-live="polite"
                  className="text-sm text-destructive"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <Button type="submit" className="mt-1 self-end">
              {t("Send request", "Надіслати запит")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
