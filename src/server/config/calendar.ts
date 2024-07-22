import { google } from "googleapis";
import { authClient } from "./oauth";


export const calendar = google.calendar({
  version:'v3',
  auth:authClient
})