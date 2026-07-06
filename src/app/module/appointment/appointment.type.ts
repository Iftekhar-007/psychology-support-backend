import { AppointmentStatus } from "../../../generated/prisma/browser";

export type createAppointment = {
  date: Date;
  recordHistory: string;
  patientIssue: string;
  meetLink: string;
  psychologistid: string;
  duration: number;
  patientId: string;
  paymentStatus: string;
  appointmentStatus: string;
};

export type updateAppointmentStatus = {
  appointmentStatus: AppointmentStatus;
};

/*
model Appointment {
    id                String            @id @default(uuid())
    date              DateTime
    recordHistory     String?
    patientIssue      String?
    meetLink          String?
    psychologistid    String
    appointmentStatus AppointmentStatus @default(PENDING)
    psychologist      Psychologist      @relation(fields: [psychologistid], references: [id], onDelete: Cascade, onUpdate: Cascade)
    duration          Int
    patientId         String
    patient           Patient           @relation(fields: [patientId], references: [id], onDelete: Cascade, onUpdate: Cascade)
    prescriptions     Prescription?
    paymentStatus     PaymentStatus     @default(PENDING)
    payment           Payment?

    @@index([psychologistid, patientId, id])
    @@map("appointments")
}
*/
