export interface Project {
    projectId: string;
    projectName: string;
    startDate: Date | null;
    endDate: Date | null;
    projectDescription: string;
    isActive: boolean;
    signedOff: boolean;
    signedOffDate: Date;
    signature: string;
    responsibleClientRep: string;
    clientId: string;
    teamId: string;
    phaseId: number;
    phaseName: string;
  }