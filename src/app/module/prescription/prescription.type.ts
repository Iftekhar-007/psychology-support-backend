export type createPrescription = {
  appointmentId: string;
  medication: string;
  exercise: string;
  duration: string;
  notes?: string;
};

export type updatePrescription = {
  medication?: string;
  exercise?: string;
  duration?: string;
  notes?: string;
};
