import type { BenefitSearchResult, BenefitsSettings } from "@/types/benefits";

export const mockBenefitsList = () => {
  const existing = localStorage.getItem("mockBenefitsList");
  if (!existing) {
    const data = generateBenefitsList();
    localStorage.setItem("mockBenefitsList", JSON.stringify(data));
  }
};

export const mockBenefitSettings = () => {
  const existing = localStorage.getItem("mockBenefitsSettings");

  if (!existing) {
    const data: BenefitsSettings[] = [
      {
        userId: 0,
        firstName: "John",
        lastName: "Doe1",
        dependents: [
          {
            firstName: "Jane",
            lastName: "Doe1",
          },
        ],
      },
      {
        userId: 1,
        firstName: "John",
        lastName: "Doe2",
        dependents: [
          {
            firstName: "Jane",
            lastName: "Doe2",
          },
          {
            firstName: "Timmy",
            lastName: "Doe2",
          },
        ],
      },
    ];
    localStorage.setItem("mockBenefitsSettings", JSON.stringify(data));
  }
};

// So this generates 3 paychecks for some months since there are 2 extra paychecks included in the assignment but not addressing it since it's mock data
// Assumption is that these would be "bonus" paychecks so maybe different rules would apply, which would be handled by the backend
const generateBenefitsList = (): BenefitSearchResult[] => {
  const users = [
    { userId: 0, dependents: 1 },
    { userId: 1, dependents: 2 },
  ];

  const totalPaychecks = 26;
  const years = ["2022", "2023", "2024", "2025"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const results: BenefitSearchResult[] = [];

  for (const year of years) {
    for (const { userId, dependents } of users) {
      const base = 1000 / totalPaychecks;
      const depCost = (500 * dependents) / totalPaychecks;
      const costPerPaycheck = parseFloat((base + depCost).toFixed(2));

      for (let i = 0; i < totalPaychecks; i++) {
        const monthIndex = Math.floor((i / totalPaychecks) * 12); // spread across months
        const month = months[monthIndex];
        const week = i % 2 === 0 ? 2 : 4;

        results.push({
          userId,
          year,
          month,
          week,
          cost: costPerPaycheck,
        });
      }
    }
  }

  return results;
};
