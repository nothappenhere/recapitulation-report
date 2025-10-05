import type { Agent } from "./Agent.js";

type VisitingHour = {
  _id: string;
  timeRange: string;
};

export type CustomReservationFullTypes = {
  _id: string;
  agent: Agent;
  customReservationNumber: string;

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

  actualMemberTotal: number;
  reservationStatus: string;

  address: string;
  province: string;
  regencyOrCity: string;
  district: string;
  village: string;
  country: string;

  publicTotalAmount: number;
  customTotalAmount: number;
  totalPaymentAmount: number;

  paymentMethod: string;
  downPayment: number;
  changeAmount: number;
  statusPayment: string;

  createdAt: string;
  updatedAt: string;
};
