import { z } from "zod";
import { calculateNights, calculateTotal } from "@/lib/hotel";

const positiveNumber = (label: string, integer = false) => z.string().refine((value) => {
  const number = Number(value);
  return value.trim() !== "" && Number.isFinite(number) && number >= 1 && (!integer || Number.isInteger(number));
}, `Enter a valid ${label}${integer ? " (whole number)" : ""}`);

export const bookingSchema = z.object({
  guest: z.string().trim().min(2, "Please enter the guest name").max(100),
  company: z.string().trim().max(100),
  arrival: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) && Number.isFinite(new Date(value).getTime()), "Select a valid arrival date and time"),
  departure: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) && Number.isFinite(new Date(value).getTime()), "Select a valid departure date and time"),
  guests: positiveNumber("number of guests", true),
  room: z.enum(["Queen", "Twin", "Deluxe", "Suite"]),
  nights: positiveNumber("number of nights", true),
  rate: positiveNumber("nightly rate"),
  billing: z.string().trim().min(1, "Enter a billing instruction").max(200),
}).superRefine((data, context) => {
  if (calculateNights(data.arrival, data.departure) === 0) context.addIssue({ code: z.ZodIssueCode.custom, path: ["departure"], message: "Departure must be after arrival" });
});

export type Booking = z.infer<typeof bookingSchema>;
export function bookingMessage(data: Booking) {
  const total = calculateTotal(Number(data.rate), Number(data.nights));
  return `Booking request - Al Hayat Hotel\nGuest Name: ${data.guest}\nCompany: ${data.company || "-"}\nArrival: ${data.arrival.replace("T", " at ")}\nDeparture: ${data.departure.replace("T", " at ")}\nGuests: ${data.guests}\nRoom Type: ${data.room}\nNights: ${data.nights}\nRate per Night: AED ${data.rate}\nBilling Instruction: ${data.billing}\nEstimated Total: AED ${total.toFixed(2)} (incl. 5% tax)`;
}