import * as uuid from "uuid";
import { Entry } from "../types/message";

export const decodeMessage = (message: Entry): any => {
  try {
    const chunkSize = 5000; // Adjust the chunk size as needed
    const dataArray = new Uint8Array(message.data.data.data);
    const chunks = [];
    
    for (let i = 0; i < dataArray.length; i += chunkSize) {
        const chunk = dataArray.subarray(i, i + chunkSize);
        // Convert chunk to string and add to chunks array
        chunks.push(String.fromCharCode.apply(null, chunk));
    }
    
    const decodedString = chunks.join('');
    const trimmedString = trimString(decodedString); // Assuming trimString is a function you have
    
    try {
      return JSON.parse(trimmedString);
    } catch (error) {
      console.log(
        "Error trying to parse message data to JSON of size . Returning raw value"
      );
      return trimmedString;
    }
  } catch (error) {
    throw new Error(`On decoding message: ${error.message}`);
  }
};

export const trimString = (message: string): string => {
  let str = message;

  while (
    !(str[0] === "{" && str[str.length - 1] === "}")
    ) {
    if (str[0] !== "{") str = str.substring(1);
    if (str[str.length - 1] !== "}") str = str.substring(0, str.length - 1);
  }

  return str;
};

export const parseDateToUnixTimestamp = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

export const createUUID = (): string => uuid.v4();

export const match = (object1: any, object2: any): boolean =>
  Object.keys(object1).every((key1) => object1[key1] === object2[key1]);
