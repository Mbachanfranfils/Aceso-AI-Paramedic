export type ContactCategory = "Medical" | "Police" | "Fire" | "Other";
export type SectionIconKey = "hospital" | "shield-alert" | "flame" | "info";

export interface EmergencyContact {
  name: string;
  number: string;
  tel: string;
  category: ContactCategory;
}

export interface ContactSection {
  title: string;
  iconKey: SectionIconKey;
  category: ContactCategory;
  items: EmergencyContact[];
}

export const EMERGENCY_SECTIONS: ContactSection[] = [
  {
    title: "Medical Emergency",
    iconKey: "hospital",
    category: "Medical",
    items: [
      { name: "SAMU (Emergency Medical)", number: "15", tel: "15", category: "Medical" },
      { name: "Centre Hospitalier Yaoundé", number: "+237 222 23 40 40", tel: "+237222234040", category: "Medical" },
      { name: "CHU Douala", number: "+237 233 42 77 77", tel: "+237233427777", category: "Medical" },
      { name: "Hôpital Central Yaoundé", number: "+237 222 23 40 40", tel: "+237222234040", category: "Medical" },
      { name: "Hôpital Laquintinie Douala", number: "+237 233 42 66 66", tel: "+237233426666", category: "Medical" },
    ],
  },
  {
    title: "Police",
    iconKey: "shield-alert",
    category: "Police",
    items: [
      { name: "Police Nationale", number: "17", tel: "17", category: "Police" },
      { name: "Gendarmerie Nationale", number: "112 / +237 222 23 40 17", tel: "112", category: "Police" },
      { name: "Brigade de Yaoundé", number: "+237 222 22 13 44", tel: "+237222221344", category: "Police" },
    ],
  },
  {
    title: "Fire Service",
    iconKey: "flame",
    category: "Fire",
    items: [
      { name: "Sapeurs-Pompiers", number: "18", tel: "18", category: "Fire" },
      { name: "Douala Fire Station", number: "+237 233 42 50 50", tel: "+237233425050", category: "Fire" },
      { name: "Yaoundé Fire Station", number: "+237 222 22 25 25", tel: "+237222222525", category: "Fire" },
    ],
  },
  {
    title: "Other",
    iconKey: "info",
    category: "Other",
    items: [
      { name: "General Emergency", number: "112", tel: "112", category: "Other" },
      { name: "Red Cross Cameroon", number: "+237 222 22 11 77", tel: "+237222221177", category: "Other" },
      { name: "Anti-Poison Centre", number: "+237 222 23 60 60", tel: "+237222236060", category: "Other" },
    ],
  },
];
