import { google } from "googleapis"
import { env } from "process"

export const authClient = new google.auth.OAuth2({
    clientId: env.GOOGLE_CLIENT,
    clientSecret: env.GOOGLE_SECERT,
    redirectUri: 'http://localhost:3000/dashboard/success/calendar'
})
