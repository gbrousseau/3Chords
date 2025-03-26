export type UserProfile = {
  id: string;
  email: string;
  introduction: string;
  description: string;
  selectedServices: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type AssessmentData = {
  introduction: string;
  description: string;
  selectedServices: string[];
}; 