// Wachtwoordbeleid: lengte telt, geen verplichte tekensoorten (werkt goed met wachtwoordmanagers).
// 72 is de grens van bcrypt, waarmee Supabase wachtwoorden opslaat.
// Zet in Supabase (Authentication → Policies) dezelfde minimumlengte, zodat de API het ook afdwingt.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
