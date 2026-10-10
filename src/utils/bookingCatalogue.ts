import { currentRoomRate, quoteStay } from '@/data/panoramaPricing';

export interface CatalogueRoom { id: string; name: string; base_price: number; is_active: boolean }
export interface RequestedRoom { name: string; quantity: number; kind: 'dorm' | 'private'; capacity: number }

/** Match equivalent catalogue labels without trusting client prices or accepting unrelated rooms. */
function roomKey(name: string) {
  return name.toLowerCase().replace(/^bed in\s+/, '').replace(/female-only/g, 'female')
    .replace(/dormitory/g, 'dorm').replace(/[^a-z0-9]/g, '');
}

export function resolveBookingQuote(catalogue: CatalogueRoom[], requested: RequestedRoom[], nights: number) {
  if (!Number.isInteger(nights) || nights < 1 || nights > 60 || !requested.length) throw new Error('Choose valid stay dates and rooms.');
  const rooms = requested.map(room => {
    const matches = catalogue.filter(entry => entry.is_active && roomKey(entry.name) === roomKey(room.name));
    const entry = matches.length === 1 ? matches[0] : undefined;
    if (!entry || /4\W*bed\W*mixed/i.test(entry.name)) throw new Error(`${room.name} is not currently available. Please choose another room.`);
    if (!Number.isInteger(room.quantity) || room.quantity < 1 || room.quantity > 10) throw new Error('Choose between 1 and 10 beds or rooms.');
    const nightlyRate = currentRoomRate(entry.id, Number(entry.base_price));
    if (!Number.isFinite(nightlyRate) || nightlyRate <= 0) throw new Error('The room rate is unavailable. Please contact the desk.');
    return { id: entry.id, name: entry.name, quantity: room.quantity, nightlyRate };
  });
  const guests = requested.reduce((sum, room) => sum + (room.kind === 'dorm' ? room.quantity : room.capacity * room.quantity), 0);
  return { rooms, guests, ...quoteStay(rooms, nights) };
}