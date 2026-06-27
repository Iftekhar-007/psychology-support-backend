export type Availability = {
  day: string;
  startTime: string;
  endTime: string;
};

export type CreatePsychologistProfile = {
  userId: string;
  name: string;
  email: string;
  profilePhoto?: string;
  address?: string;
  contactNumber?: string;
  sector?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availability?: Record<string, any>; // or define a proper type
  appointmentFee?: number;
  qualification: string;
  licenseId: string;
  experience: number;
};

/*
model Psychologist {
    id                   String                 @id @default(uuid())
    userId               String                 @unique
    user                 User                   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
    name                 String
    email                String                 @unique
    profilePhoto         String?
    address              String?
    contactNumber        String?                @unique
    verified             Boolean                @default(false)
    sector               String?
    availability         Json?
    appointmentFee       Float                  @default(0)
    qualification        String
    licenseId            String                 @unique
    experience           Int
    role                 UserRoles              @default(PSYCHOLOGIST)
    status               PsychologistStatus     @default(REGULAR)
    createdAt            DateTime               @default(now())
    updatedAt            DateTime               @updatedAt
    deleted              Boolean                @default(false)
    deletedAt            DateTime?
    patientprescriptions patientPrescriptions[]
    prescriptions        Prescription[]
    appointments         Appointment[]

    @@index([email, contactNumber, licenseId])
    @@map("psychologists")
}

*/
