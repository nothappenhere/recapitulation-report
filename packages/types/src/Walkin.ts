import type { Agent } from "./Agent.js";

export type WalkInFullTypes = {
  _id: string;
  agent: Agent;
  walkinNumber: string;

  visitingDate: string;
  ordererName: string;
  phoneNumber: string;

  studentMemberTotal: number;
  publicMemberTotal: number;
  foreignMemberTotal: number;
  visitorMemberTotal: number;

  address: string;
  province: string;
  regencyOrCity: string;
  district: string;
  village: string;
  country: string;

  studentTotalAmount: number;
  publicTotalAmount: number;
  foreignTotalAmount: number;
  totalPaymentAmount: number;

  paymentMethod: string;
  downPayment: number;
  changeAmount: number;
  statusPayment: string;

  createdAt: string;
  updatedAt: string;
};
