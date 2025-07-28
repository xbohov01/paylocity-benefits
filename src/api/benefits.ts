import type { BenefitSearchResult, BenefitsSettings } from "@/types/benefits";

export const sendGetUserBenefits = async (
  userId: number,
  year: string
): Promise<BenefitSearchResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const raw = localStorage.getItem("mockBenefitsList");
      if (raw == null) resolve([]);
      const list: BenefitSearchResult[] = JSON.parse(raw!);
      resolve(list.filter((b) => b.userId == userId && b.year == year));
    }, 1000);
  });
};

export const sendGetUserSettings = async (
  userId: number
): Promise<BenefitsSettings | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const raw = localStorage.getItem("mockBenefitsSettings");
      if (raw == null) resolve(undefined);

      const settings: BenefitsSettings[] = JSON.parse(raw!);
      resolve(settings.find((s) => s.userId == userId));
    }, 1000);
  });
};

export const sendPostUserSettings = async (settings: BenefitsSettings) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get current data from localStorage
      const raw = localStorage.getItem("benefitsSettings");
      const currentSettings: BenefitsSettings[] = raw ? JSON.parse(raw) : [];

      // Replace the entry with the same userId or append if not found
      const updatedSettings = currentSettings.some(
        (s) => s.userId === settings.userId
      )
        ? currentSettings.map((s) =>
            s.userId === settings.userId ? settings : s
          )
        : [...currentSettings, settings];

      // Save back to localStorage
      localStorage.setItem("benefitsSettings", JSON.stringify(updatedSettings));

      resolve(true);
    }, 1000);
  });
};
