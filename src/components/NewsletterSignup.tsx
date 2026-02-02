import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { FaPaperPlane, FaCheck } from "react-icons/fa";

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "footer";
  source?: string;
}

export default function NewsletterSignup({ variant = "card", source = "website" }: NewsletterSignupProps) {
  const subscribe = useMutation(api.email.subscribe);
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      const result = await subscribe({
        email: email.trim(),
        name: name.trim() || undefined,
        source,
      });
      
      if (result.success) {
        toast.success(result.message);
        setIsSuccess(true);
        setEmail("");
        setName("");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center gap-3 text-green-600">
        <FaCheck />
        <span>Inscription réussie ! Merci de votre intérêt.</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent flex-1"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? "..." : <FaPaperPlane />}
        </button>
      </form>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            className="px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent flex-1"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {isSubmitting ? "..." : "OK"}
          </button>
        </div>
      </form>
    );
  }

  // Default: card variant
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Newsletter</h3>
      <p className="text-sm text-gray-600 mb-4">
        Inscrivez-vous pour recevoir nos actualités et événements.
      </p>
      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom (optionnel)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email *"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "Inscription..."
          ) : (
            <>
              <FaPaperPlane /> S'inscrire
            </>
          )}
        </button>
      </form>
    </div>
  );
}
