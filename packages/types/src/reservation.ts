import type { Agent } from "./Agent.js";

export type VisitingHour = {
  _id: string;
  timeRange: string;
};

export type Reservation = {
  _id: string;
  reservationAgent: Agent;
  visitingDate: string;
  visitingHour: VisitingHour;
  reservationMechanism: string;
  description: string;
  ordererNameOrTravelName: string;
  phoneNumber: string;
  groupName: string;
  studentMemberTotal: number;
  publicMemberTotal: number;
  foreignMemberTotal: number;
  customMemberTotal: number;
  groupMemberTotal: number;
  actualMemberTotal: number;
  reservationStatus: string;
  address: string;
  province: string;
  regencyOrCity: string;
  district: string;
  village: string;
  country: string;
  paymentAmount: number;
  paymentMethod: string;
  downPayment: number;
  changeAmount: number;
  statusPayment: string;
  createdAt: string;
  updatedAt: string;
  bookingNumber: string;
};
