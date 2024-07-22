/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { randomBytes, randomInt } from "crypto";
import { type Dayjs } from "dayjs";

export const convertToBase64 = async (data: any): Promise<string> => {
    const fileBase64: string = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(data)
    })
    return fileBase64
}

export const randomCode = (length: number, prefix: string) => {
    let generatedString: string = prefix
    for (let i = 0; i < length; i++)
        generatedString = generatedString + String(randomInt(9))
    return generatedString
}


export const redeemCode = (length: number) => {

    let generatedString = '';
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randombytes = randomBytes(length)

    for (const byte of randombytes) {
        const randomIndex = byte % charset.length;
        generatedString += charset[randomIndex];
    }
    return generatedString.slice(0, length)
}


export const getAuthAssertionValue = (clientId: string, sellerPayerId: string) => {
    const header = {
        "alg": "none"
    };
    const encodedHeader = base64url(header);
    const payload = {
        "iss": clientId,
        "payer_id": sellerPayerId
    };
    const encodedPayload = base64url(payload);
    return `${encodedHeader}.${encodedPayload}.`;
}

const base64url = (json: object) => {
    return btoa(JSON.stringify(json))
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}


export const getAllDatesBetween = (startDate: Dayjs, endDate: Dayjs): string[] => {
    let start = startDate
    const end = endDate
    const dates: string[] = []
    while (start.isBefore(end) || start.isSame(end)) {
        dates.push(start.format("YYYY-MM-DD"))
        start = start.add(1, 'day')
    }
    return dates
}

export const extractPricesForDates = (allDates: string[], prices: { date: string; price: number; Inc: number; }[] | undefined, totalPeople: number) => {
    let totalPrice = 0

    if (prices) {
        allDates.forEach(date => {
            const priceObj = prices.find(p => p.date === date)
            if (priceObj) {
                totalPrice += totalPeople > 3 ? priceObj.price + (priceObj.price * (priceObj.Inc/100)) :priceObj.price  
            }
        })
    }

    return totalPrice * totalPeople
}