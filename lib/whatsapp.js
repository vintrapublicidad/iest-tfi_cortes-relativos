// lib/whatsapp.js


/**
 * Sends a WhatsApp message to the given number.
 * If WHATSAPP_API_URL / WHATSAPP_API_TOKEN are defined, it will POST to that API.
 * Otherwise it falls back to generating a wa.me URL (for dev / logging).
 *
 * @param {string} number   Phone number in international format (e.g. +5493837421111)
 * @param {string} message  Text to send (already URL‑encoded)
 * @returns {Promise<string>} The URL that was used (for logging / debugging)
 */
export async function sendWhatsAppMessage(number, message) {
    const cleanNumber = number.replace(/\D/g, '');

    // If an external API is configured, use it
    if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN) {
        const res = await fetch(process.env.WHATSAPP_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: cleanNumber,
                type: 'text',
                text: { body: decodeURIComponent(message) },
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('WhatsApp API error:', err);
            throw new Error('Failed to send WhatsApp notification');
        }
        return `${process.env.WHATSAPP_API_URL} (sent)`;
    }

    // Fallback: generate wa.me link (useful for dev / console logging)
    const link = `https://wa.me/${cleanNumber}?text=${message}`;
    console.log('WhatsApp notification link:', link);
    return link;
}
