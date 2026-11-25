export const WHATSAPP_URL = `https://wa.me/919316153904?text=${encodeURIComponent(
  'Hello, I am using the SENSE Atlas. Please suggest a topic, correct an error or ask a question.',
)}`

/**
 * Suggestion bar: direct link to the creator’s WhatsApp.
 * Intentionally small and always at the same place on the landing page.
 */
export default function SuggestionBar({ full = true }: { full?: boolean }) {
  return (
    <a className={`suggestion-bar${full ? ' suggestion-bar-full' : ''}`} href={WHATSAPP_URL} target="_blank" rel="noreferrer">
      <span className="suggestion-badge">👋 Suggest a topic or report an error</span>
      <span className="suggestion-text">Message Kaushik on WhatsApp — 9316153904</span>
      <span className="suggestion-action">Open WhatsApp</span>
    </a>
  )
}
