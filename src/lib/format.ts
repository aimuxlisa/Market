/**
 * Format price in Uzbek Som (UZS)
 * e.g. 1250000 -> "1 250 000 сум"
 */
export function formatPrice(price: number): string {
  if (isNaN(price)) return "0 сум";
  return new Intl.NumberFormat("ru-RU").format(price) + " сум";
}

/**
 * Format date in Russian / Uzbek friendly locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export type BadgeVariant = "coral" | "cyan" | "purple" | "success" | "warning" | "danger";

/**
 * Order status human labels and styling classes
 */
export const ORDER_STATUS_LABELS: Record<string, { label: string; color: BadgeVariant }> = {
  pending: { label: "Ожидает обработки", color: "warning" },
  confirmed: { label: "Подтверждён", color: "cyan" },
  processing: { label: "Собирается", color: "cyan" },
  shipped: { label: "В пути", color: "purple" },
  delivered: { label: "Доставлен", color: "success" },
  cancelled: { label: "Отменён", color: "danger" },
};

/**
 * Payment status human labels
 */
export const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: BadgeVariant }> = {
  not_required: { label: "При получении", color: "purple" },
  pending: { label: "Ожидает оплаты", color: "warning" },
  paid: { label: "Оплачен", color: "success" },
  failed: { label: "Ошибка оплаты", color: "danger" },
  refunded: { label: "Возвращён", color: "coral" },
};
