import type { Agent } from "./Agent.js";

export type DailyRecapFullTypes = {
  _id: string;
  agent: Agent;
  recapNumber: string;

  recapDate: string;
  description: string;

  studentMemberTotal: number;
  publicMemberTotal: number;
  foreignMemberTotal: number;
  visitorMemberTotal: number;

  studentTotalAmount: number;
  publicTotalAmount: number;
  foreignTotalAmount: number;
  totalPaymentAmount: number;

  initialStudentSerialNumber: number;
  finalStudentSerialNumber: number;
  initialPublicSerialNumber: number;
  finalPublicSerialNumber: number;
  initialForeignSerialNumber: number;
  finalForeignSerialNumber: number;

  createdAt: string;
  updatedAt: string;
};
