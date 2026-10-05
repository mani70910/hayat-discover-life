import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { PageHero, SectionTitle } from "@/components/site";
import { CONTACT, ROOM_RATES, calculateNights, calculateTotal, meta, photos, roomTypes, type RoomType } from "@/lib/hotel";

type Booking = {
  guest: string;
  company: string;
  arrival: string;
  departure: string;
  guests: string;
  room: RoomType;
  nights: string;
  rate: string;
  billing: string;
};

const initial: Booking = { guest: "", company: "", arrival: "", departure: "", guests: "1", room: "Queen", nights: "1", rate: String(ROOM_RATES.Queen), billing: "Direct Payment" };

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    ...(roomTypes.includes(search["room"] as RoomType) ? { room: search["room"] as RoomType } : {}),
  }),
  head: () => ({ meta: meta("Book Your Stay | Al Hayat Hotel Sharjah", "Book a Queen, Twin, Deluxe or Suite room at Al Hayat Hotel Sharjah.") }),
  component: Book,
});

function Book() {
  const { room } = Route.useSearch();
  const [data, setData] = useState<Booking>(() => (room ? { ...initial, room, rate: String(ROOM_RATES[room]) } : initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = <K extends keyof Booking>(key: K, value: Booking[K]) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "room") next.rate = String(ROOM_RATES[value as RoomType]);
      if (key === "arrival" || key === "departure") {
        const nights = calculateNights(next.arrival, next.departure);
        if (nights > 0) next.nights = String(nights);
      }
      return next;
    });
  };

  const nights = Number(data.nights) || 0;
  const rate = Number(data.rate) || 0;
  const total = useMemo(() => calculateTotal(rate, nights), [rate, nights]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (data.guest.trim().length < 2) next.guest = "Please enter the guest name";
    if (!data.arrival) next.arrival = "Select an arrival date and time";
    if (!data.departure) next.departure = "Select a departure date and time";
    if (data.arrival && data.departure && calculateNights(data.arrival, data.departure) === 0) next.departure = "Departure must be after arrival";
    if (!(Number(data.guests) >= 1)) next.guests = "Enter at least 1 guest";
    if (nights < 1) next.nights = "Enter at least 1 night";
    if (rate < 1) next.rate = "Enter a valid rate";
    if (!data.billing.trim()) next.billing = "Enter a billing instruction";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const msg = `Booking request - Al Hayat Hotel\nGuest Name: ${data.guest}\nCompany: ${data.company || "-"}\nArrival: ${data.arrival}\nDeparture: ${data.departure}\nGuests: ${data.guests}\nRoom Type: ${data.room}\nNights: ${data.nights}\nRate per Night: AED ${data.rate}\nBilling Instruction: ${data.billing}\nEstimated Total: AED ${total.toFixed(2)} (incl. 5% tax)`;
    window.open(`${CONTACT.whatsappUrl}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return <main>
    <PageHero title="Book Your Stay" eyebrow="Reservations" image={photos.room} />
    <section className="section"><div className="section-inner">
      <SectionTitle eyebrow="Al Hayat Hotel Sharjah">Reservation Details</SectionTitle>
      {sent && <p className="success-message" role="status"><CheckCircle2 /> Your booking request has been prepared in WhatsApp. If it did not open, please check your pop-up blocker or contact us directly.</p>}
      <form className="booking-form" onSubmit={submit} noValidate>
        <div className="form-grid">
          <Field label="Guest Name" error={errors["guest"]}><input value={data.guest} maxLength={100} onChange={(e) => set("guest", e.target.value)} /></Field>
          <Field label="Company" error={errors["company"]}><input value={data.company} maxLength={100} onChange={(e) => set("company", e.target.value)} /></Field>
          <Field label="Arrival Date & Time" error={errors["arrival"]}><input type="datetime-local" value={data.arrival} onChange={(e) => set("arrival", e.target.value)} /></Field>
          <Field label="Departure Date & Time" error={errors["departure"]}><input type="datetime-local" value={data.departure} onChange={(e) => set("departure", e.target.value)} /></Field>
          <Field label="No. of Guests" error={errors["guests"]}><input type="number" min={1} max={20} value={data.guests} onChange={(e) => set("guests", e.target.value)} /></Field>
          <Field label="Room Type" error={errors["room"]}>
            <select value={data.room} onChange={(e) => set("room", e.target.value as RoomType)}>{roomTypes.map((t) => <option key={t} value={t}>{t} Room</option>)}</select>
          </Field>
          <Field label="No. of Nights" error={errors["nights"]}><input type="number" min={1} max={365} value={data.nights} onChange={(e) => set("nights", e.target.value)} /></Field>
          <Field label="Rate per Night (AED)" error={errors["rate"]}><input type="number" min={1} value={data.rate} onChange={(e) => set("rate", e.target.value)} /></Field>
          <Field label="Billing Instruction" error={errors["billing"]} full><input value={data.billing} maxLength={200} onChange={(e) => set("billing", e.target.value)} /></Field>
        </div>
        <div className="booking-summary">
          <div><span>Estimated Total</span><strong>AED {total.toFixed(2)}</strong><small>{nights} night{nights === 1 ? "" : "s"} × AED {rate} + 5% tax</small></div>
          <button className="button button-gold" type="submit"><MessageCircle />Confirm via WhatsApp</button>
        </div>
      </form>
    </div></section>
  </main>;
}

function Field({ label, error, full = false, children }: { label: string; error?: string | undefined; full?: boolean; children: React.ReactNode }) {
  return <label className={`field ${full ? "field-full" : ""}`}><span>{label}</span>{children}{error && <span className="field-error">{error}</span>}</label>;
}
