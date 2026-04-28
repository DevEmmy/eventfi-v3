/**
 * Returns the display label for the cheapest ticket and the total ticket type count.
 * - 1 type  → plain price  ("Free" / "₦5,000")
 * - N types → "From" prefix ("Free" / "From ₦5,000")
 */
export function getTicketPriceInfo(tickets: any[]): { label: string; count: number } {
    if (!tickets || tickets.length === 0) return { label: 'Free', count: 0 };

    const sorted = [...tickets].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    const cheapest = sorted[0];
    const count = tickets.length;
    const isFree = cheapest.type === 'FREE' || (cheapest.price ?? 0) === 0;

    const label = isFree
        ? 'Free'
        : count > 1
        ? `From ₦${cheapest.price.toLocaleString()}`
        : `₦${cheapest.price.toLocaleString()}`;

    return { label, count };
}
