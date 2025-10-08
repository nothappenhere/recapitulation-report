import type { Agent } from "./Agent.js";
import type { VisitingHour } from "./VisitingHour.js";

export type CustomReservationFullTypes = {
  _id: string;
  agent: Agent;
  reservationNumber: string;

  visitingDate: string;
  visitingHour: VisitingHour;
  reservationMechanism: string;
  description: string;

  ordererName: string;
  phoneNumber: string;
  groupName: string;

  publicMemberTotal: number;
  customMemberTotal: number;
  visitorMemberTotal: number;

  publicTotalAmount: number;
  customTotalAmount: number;
  totalPaymentAmount: number;

  actualMemberTotal: number;
  reservationStatus: string;

  address: string;
  province: string;
  regencyOrCity: string;
  district: string;
  village: string;
  country: string;

  paymentMethod: string;
  downPayment: number;
  changeAmount: number;
  statusPayment: string;

  createdAt: string;
  updatedAt: string;
};
