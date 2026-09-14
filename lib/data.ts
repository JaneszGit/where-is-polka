import { supabase } from "./supabase";
import { Override, Owner, ScheduleSettings } from "./schedule";

// Amíg a Supabase settings tábla üres, ez a fallback biztosítja, hogy az
// app működjön. Az igazi értékeket a settings táblában érdemes tartani,
// hogy kód-módosítás nélkül lehessen módosítani.
const FALLBACK_SETTINGS: ScheduleSettings = {
  referenceSunday: "2026-01-04", // állítsd át egy tényleges váltás-vasárnapra
  ownerAtReference: "me",
  ownerNames: { me: "Nálam", rita: "Ritánál" },
};

export async function fetchSettings(): Promise<ScheduleSettings> {
  const { data, error } = await supabase
    .from("settings")
    .select("reference_sunday, owner_at_reference, owner_me_name, owner_rita_name")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_SETTINGS;
  }

  return {
    referenceSunday: data.reference_sunday,
    ownerAtReference: data.owner_at_reference as Owner,
    ownerNames: {
      me: data.owner_me_name ?? "Nálam",
      rita: data.owner_rita_name ?? "Ritánál",
    },
  };
}

export async function fetchOverrides(): Promise<Override[]> {
  const { data, error } = await supabase
    .from("overrides")
    .select("date, owner, note");

  if (error || !data) {
    return [];
  }

  return data as Override[];
}
