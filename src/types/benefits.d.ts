export type BenefitSearchResult = {
  userId: number;
  year: string;
  month: string;
  week: 2 | 4;
  cost: number;
};

export type Dependent = {
  firstName: string;
  lastName: string;
  /// type (child/spouse)
};

export type BenefitsSettings = {
  userId: number;
  firstName: string;
  lastName: string;
  dependents: Dependent[];
};
