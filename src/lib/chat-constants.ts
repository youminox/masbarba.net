export const CHAT_ENDPOINT =
  "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/masbarba-chat";

export const OPEN_CHAT_EVENT = "mb-open-chat";

export function openChat(initialPrompt?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(OPEN_CHAT_EVENT, {
      detail: { prompt: initialPrompt || "" },
    })
  );
}
