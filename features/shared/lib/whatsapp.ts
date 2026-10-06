/** The business WhatsApp line (Nepal, +977). Every WhatsApp button on the site opens a chat here. */
export const WHATSAPP_NUMBER = "9779705223335";

/**
 * wa.me link with a prefilled message. `to` defaults to the business line; pass a visitor's number
 * (e.g. from a booking) to message them instead. Local 10-digit Nepali numbers get the 977 prefix.
 */
export function whatsappUrl(message: string, to: string = WHATSAPP_NUMBER) {
  let digits = to.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("9")) digits = `977${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function serviceMessage(serviceTitle: string, pageUrl: string) {
  return `Hi HEX Healing Hub! I'm interested in ${serviceTitle} and would like to know more.\n\n${pageUrl}`;
}

export function blogMessage(title: string, pageUrl: string) {
  return `Hi HEX Healing Hub! I was reading "${title}" and would like to know more.\n\n${pageUrl}`;
}

export function generalMessage(pageUrl?: string) {
  const hello = "Hi HEX Healing Hub! I'd like to know more about your sessions.";
  return pageUrl ? `${hello}\n\n${pageUrl}` : hello;
}

/** Booking with a healer over WhatsApp: names the healer and whatever the visitor has chosen so far. */
export function healerBookingMessage(healerName: string, choice: { service?: string; place?: string; day?: string; time?: string }, pageUrl: string) {
  const details = [
    choice.service && `Service: ${choice.service}`,
    choice.place && `Where: ${choice.place}`,
    choice.day && `Day: ${choice.day}`,
    choice.time && `Time: ${choice.time} (Nepal time)`,
  ].filter(Boolean);
  return [`Hi HEX Healing Hub! I'd like to book a session with ${healerName}.`, ...(details.length ? ["", ...details] : []), "", pageUrl].join("\n");
}
