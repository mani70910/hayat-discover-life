import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, Lock, MessageCircle, Minus, Plus } from "lucide-react";
import { PageHero, SectionTitle } from "@/components/site";
import { CONTACT, ROOM_RATES, addDays, formatAED, formatDate, meta, nightsBetween, photos, roomTypes, toISODate, type RoomType } from "@/lib/hotel";

const BILLING = "Direct Payment";
const TAX_RATE = 0.05;

type Booking = {
  guest: string;
  company: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  room: RoomType;
};

const today = toISODate(new Date());
const initial: Booking = { guest: "", company: "", checkIn: today, checkOut: addDays(today, 1), guests: 1, room: "Queen" };

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    ...(roomTypes.includes(search["room"] as RoomType) ? { room: search["room"] as RoomType } : {}),
  }),
  head: () => ({ meta: meta("Book Your Stay | Al Hayat Hotel Sharjah", "Book a Queen, Twin, Deluxe or Suite room at Al Hayat Hotel Sharjah.", photos.room) }),
  component: Book,
});

function Book() {
  const { room } = Route.useSearch();
  const [data, setData] = useState<Booking>(() => (room ? { ...initial, room } : initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = <K extends keyof Booking>(key: K, value: Booking[K]) => {
    setSent(false);
    setData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "checkIn" && typeof value === "string" && value) {
        // Check-out must always be at least 1 day after check-in
        if (!next.checkOut || nightsBetween(value, next.checkOut) < 1) next.checkOut = addDays(value, 1);
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  // Nights and rate are always recomputed from dates and room type — never from editable state.
  const nights = nightsBetween(data.checkIn, data.checkOut);
  const rate = ROOM_RATES[data.room];
  const subtotal = rate * nights;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (data.guest.trim().length < 2) next["guest"] = "Please enter the guest name";
    if (!data.checkIn) next["checkIn"] = "Select a check-in date";
    else if (data.checkIn < today) next["checkIn"] = "Check-in cannot be in the past";
    if (!data.checkOut) next["checkOut"] = "Select a check-out date";
    else if (nights < 1) next["checkOut"] = "Check-out must be at least 1 night after check-in";
    if (data.guests < 1 || data.guests > 4) next["guests"] = "Guests must be between 1 and 4";
    return next;
  };

  const valid = useMemo(() => Object.keys(validate()).length === 0, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const msg = `Hello Al Hayat Hotel, I would like to make a reservation:\nGuest Name: ${data.guest.trim()}\nCompany: ${data.company.trim() || "-"}\nCheck-in: ${formatDate(data.checkIn)} (from 2:00 PM)\nCheck-out: ${formatDate(data.checkOut)} (until 12:00 PM)\nNo. of Guests: ${data.guests}\nRoom Type: ${data.room} Room\nNo. of Nights: ${nights}\nRate per Night: AED ${formatAED(rate)}\nEstimated Total (incl. 5% tax): AED ${formatAED(total)}\nBilling Instruction: ${BILLING}`;
    window.open(`${CONTACT.whatsappUrl}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return <main>
    <PageHero title="Book Your Stay" eyebrow="Reservations" image={photos.room} />
    <section className="section"><div className="section-inner">
      <SectionTitle eyebrow="Al Hayat Hotel Sharjah">Reservation Details</SectionTitle>
      {sent && <p className="success-message" role="status"><CheckCircle2 /> Your reservation request has been prepared. Please send it on WhatsApp to confirm.</p>}
      <form className="booking-form" onSubmit={submit} noValidate>
        <div className="form-grid">
          <Field label="Guest Name" error={errors["guest"]}><input value={data.guest} maxLength={100} autoComplete="name" onChange={(e) => set("guest", e.target.value)} /></Field>
          <Field label="Company (optional)" error={errors["company"]}><input value={data.company} maxLength={100} autoComplete="organization" onChange={(e) => set("company", e.target.value)} /></Field>
          <Field label="Check-in Date" error={errors["checkIn"]}><input type="date" min={today} value={data.checkIn} onChange={(e) => set("checkIn", e.target.value)} /></Field>
          <Field label="Check-out Date" error={errors["checkOut"]}><input type="date" min={data.checkIn ? addDays(data.checkIn, 1) : addDays(today, 1)} value={data.checkOut} onChange={(e) => set("checkOut", e.target.value)} /></Field>
          <p className="date-note field-full"><Clock3 /> Standard check-in time: 2:00 PM &nbsp;|&nbsp; Check-out time: 12:00 PM (noon)</p>
          <Field label="No. of Guests" error={errors["guests"]}>
            <div className="stepper">
              <button type="button" aria-label="Fewer guests" disabled={data.guests <= 1} onClick={() => set("guests", Math.max(1, data.guests - 1))}><Minus /></button>
              <span aria-live="polite">{data.guests}</span>
              <button type="button" aria-label="More guests" disabled={data.guests >= 4} onClick={() => set("guests", Math.min(4, data.guests + 1))}><Plus /></button>
            </div>
          </Field>
          <Field label="Room Type" error={errors["room"]}>
            <select value={data.room} onChange={(e) => set("room", e.target.value as RoomType)}>{roomTypes.map((t) => <option key={t} value={t}>{t} Room</option>)}</select>
          </Field>
          <Field label="No. of Nights" locked>
            <div className="field-locked" aria-live="polite"><Lock /><span>{nights} night{nights === 1 ? "" : "s"}</span></div>
          </Field>
          <Field label="Rate per Night (AED)" locked>
            <div className="field-locked" aria-live="polite"><Lock /><span>AED {formatAED(rate)}</span></div>
          </Field>
          <Field label="Billing Instruction" locked full>
            <div className="field-locked"><Lock /><span>{BILLING}</span></div>
          </Field>
        </div>
        <div className="booking-summary" aria-live="polite">
          <div className="summary-lines">
            <p><span>Room rate</span><span>AED {formatAED(rate)} × {nights} night{nights === 1 ? "" : "s"} = AED {formatAED(subtotal)}</span></p>
            <p><span>Tax (5%)</span><span>AED {formatAED(tax)}</span></p>
            <p className="summary-total"><span>Estimated Total</span><strong>AED {formatAED(total)}</strong></p>
          </div>
          <button className="button button-gold" type="submit" disabled={!valid}><MessageCircle />Confirm via WhatsApp</button>
        </div>
        <p className="note">All rates are subject to tax. Final confirmation is by the hotel reception.</p>
      </form>
    </div></section>
  </main>;
}

function Field({ label, error, locked = false, full = false, children }: { label: string; error?: string | undefined; locked?: boolean; full?: boolean; children: React.ReactNode }) {
  return <label className={`field ${full ? "field-full" : ""} ${locked ? "field-readonly" : ""}`}><span>{label}</span>{children}{error && <span className="field-error">{error}</span>}</label>;
}
