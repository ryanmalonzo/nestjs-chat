"use client";

import ky from "ky";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const api = ky.create({
  headers: {
    "Content-Type": "application/json",
  },
  prefixUrl: API_URL,
  throwHttpErrors: false,
});
