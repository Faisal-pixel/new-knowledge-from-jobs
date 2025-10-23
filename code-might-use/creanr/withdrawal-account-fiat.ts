// Create a new record in the withdrawal_accounts_fiat table
// Receives {currency_code: "USD", bank_name: "Bank of America", bank_account_number: "123456789", bank_account_name: "John Doe", is_default: true};

import { ensureTokenIsValid } from "@/helpers/flutterwave-authenticate.helpers";
import generateAsciiString from "@/helpers/generate-ascii-characters.helpers";
import { getBankTypesByCountry } from "@/helpers/get-bank-types-by-country.helpers";
import { getFlutterwaveBaseUrl } from "@/helpers/get-flutterwave-base-url.helpers";
import normalizeForDb from "@/helpers/normalize-bank-schema-for-db";
import normalizeForTransferRecipients from "@/helpers/normalize-bank-schema-for-transfer-recipients";
import { createClient } from "@/lib/supabase/supabase";
import {
  AnyWithdrawalSchema,
  AnyWithdrawalType,
} from "@/types/zod/bank-types-schemas/discriminated-union-bank-schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";


// const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL!;
// const PAYSTACK_KEY = process.env.PAYSTACK_SECRET_KEY!;

// const BodySchema = z.object({
//   country_code: z.string().length(2).default("NG"),
//   currency_code: z.string().length(3), // e.g. 'NGN'
//   bank_code: z.string().min(1), // from GET /banks
//   bank_account_number: z.string().min(6).max(20), // basic check
//   bank_name: z.string().min(1).max(100), // optional: you can derive real name from your /banks route
//   bank_account_name: z.string().min(3).max(100), // we expect the client to send the account name they expect, we already resolved with flutterwave resolve endpoint
//   is_default: z.boolean().optional().default(false),
//   is_mobile_money: z.boolean().optional().default(false), // future use: so if the type of transfer or withdrawal method is mobile money, i will need this to create a transfer reciepient
// });

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => {});
  console.log("Received body data", data);

  if (!data) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const country = String(data.country_code || "").toUpperCase();

  const bankTypes = getBankTypesByCountry(country);

  if (bankTypes.length === 0) {
    return NextResponse.json(
      {
        error: "No bank types found",
        message: "No bank types found for the specified country code.",
      },
      { status: 400 }
    );
  }

  // Now we need to know which of the bank types they are using, for countries with 2 types (e.g. NGN has BANK_NGN and MOBILE_MONEY_NGN)
  const inferredType =
    bankTypes.length === 2
      ? data.is_mobile_money
        ? bankTypes[1]
        : bankTypes[0]
      : bankTypes[0];

  console.log("Inferred bank type:", inferredType);

  // Now let us construct the object we will pass into zod for validation  , we had to to do the above first because zod needs to know the bank_type to validate the rest of the body
  const dataToValidate = { ...data, bank_type: inferredType };

  console.log("Data to validate:", dataToValidate);

  const { error: bodySchemaParsedErr, data: bodyData } =
    AnyWithdrawalSchema.safeParse(dataToValidate); // returns {success: true, data: T } or {success: false, error: ZodError}

  if (bodySchemaParsedErr) {
    console.log("Error parsing the body", bodySchemaParsedErr);
    const parsedErrorMessage = JSON.parse(bodySchemaParsedErr.message)[0];
    return NextResponse.json(
      {
        error: `Error parsing the body (${parsedErrorMessage.path})`,
        message: parsedErrorMessage.message || bodySchemaParsedErr.message,
      },
      { status: 400 }
    );
  }

  // First we need to authenticate the user.

  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json(
      { error: "Not authenticated", message: userErr?.message },
      { status: 401 }
    );
  }

  const sandBoxBaseUrl = await getFlutterwaveBaseUrl("sandbox");

  const accessToken = await ensureTokenIsValid();
  console.log("Access token:", accessToken);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Failed to get access token for Flutterwave." },
      { status: 500 }
    );
  }

  //  Now let us resolve the account name using flutterwave

  // 1. We pass in the body data into our normalizeForDb function to get the normalized data

  // const { bank_account_name, bank_account_number, bank_code } = normalizeForDb(bodyData);
  const { country_code, currency_code, bank_name, is_default } = bodyData;
  const { type: bank_type, data: normalizedTransferRecipientData } =
    normalizeForTransferRecipients(bodyData);

  // 2. Remember the data is already resolved by the client since they reach out to our /resolve endpoint available for only
  // NGN (done this), GBP and USD. So now we can create a transfer recipient on flutterwave
  const bodyDataObject = {
      ...normalizedTransferRecipientData,
      type: bank_type
    }

    console.log("Creating transfer recipient with data:", JSON.stringify(bodyDataObject));
    console.log("Idempotency Key:", generateAsciiString(20));
    console.log("Trace Id:", generateAsciiString(20));
  const res = await fetch(`${sandBoxBaseUrl}/transfers/recipients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      'X-Trace-Id': generateAsciiString(20),
      'X-Idempotency-Key': generateAsciiString(20),
    },
    body: JSON.stringify(bodyDataObject),
  });

  const resTransferRecipientData = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.log("Error creating transfer recipient", resTransferRecipientData);
    return NextResponse.json(
      {
        error: "Failed to create transfer recipient",
        message: resTransferRecipientData.error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }

  /**Here is the response data structure:
   * {
   *  "status": "success",
   * "message": "Recipient created successfully" or could be whatever,
   *  "data": {
   *     "id": 123456, // id of the transfer recipient record on flutterwave
   *    "type" "bank" // it defaults to bank,
   *    "name": {
   *      "first": "John",
   *     "middle": "M",
   *    "last": "Doe"
   *     },
   *   "currency": "NGN" // its a string enum of supported currencies,
   *   "national_identification": {
   *     "type": an enum of [PASSPORT, DRIVERS_LICENSE, NATIONAL_ID],
   *     "identifier": a string length between 4 and 40,
   *     "expiration_date":  "YYYY-MM-DD",
   *   },
   *   "phone": {
   *       "country_code": "234", // string ISO 3166 alpha-3 country code.
   *       "number": "8001234567" // Unformatted 7-10-digit phone number without the country code.
   *   },
   *   "date_of_birth": "YYYY-MM-DD", // The customer's birthdate in ISO 8601 (YYYY-MM-DD) format.
   *   "email": "adamsfaisal001@gmail.com" // The customer's email address,
   *   "address": {
   *    "city": "Lagos",
   *   "country": "NG", // string ISO2 country code
   *   "line1": "123 Street Name", // The first line of the customer's address
   *   "line2": "Apt 4B" // The second line of the customer's address (optional)
   *   "postal_code": "100001", // The customer's postal code,
   *   "state": "Lagos" // The customer's state of origin,
   *   },
   *  "bank": {
   *    "account_number": "1234567890",
   *     "account_type": "checking", // could be checking, savings, individual or corporate, if the bank supports it,
   *     "code": "044", // bank code,
   *    "branch": "Lagos", // The Recipient's bank branch,
   *   "name": "Access Bank" // The name of the Recipient's bank,
   *   "routing_number": "123456789", // The Recipient's bank routing number (if applicable),
   *  "swift_code": "ABCD123" // The Recipient's bank SWIFT code (if applicable),
   *   "sort_code": "123456" // The Recipient's bank sort code (if applicable)
   * }
   *
   * THE ABOVE IS THE RETURN TYPE IF WE ARE DEALING WITH BANKS
   *
   */

  console.log("Transfer recipient created:", resTransferRecipientData);

  return NextResponse.json(
    { message: "Transfer recipient created Testing", data: resTransferRecipientData },
    { status: 201 }
  );

  // 2. If the bankTypes array has 2 members, check if is_mobile_money is true, then use the 2nd member, else use the 1st member

  // const bankType =
  //   bankTypes.length === 2
  //     ? bodyData.is_mobile_money
  //       ? bankTypes[1]
  //       : bankTypes[0]
  //     : bankTypes[0];

  //3. Now that we have our bank_type, we can now get the payload

  if (is_default) {
    await supabase
      .from("withdrawal_accounts_fiat")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);
  }

  const {
    error: insertedWithdrawalAccountFiatErr,
    data: insertedWithdrawalAccountFiatData,
  } = await supabase
    .from("withdrawal_accounts_fiat")
    .insert({
      user_id: user.id,
      country_code: country_code.toUpperCase(),
      currency_code: currency_code.toUpperCase(),
      bank_name: bank_name, // optional: you can derive real name from your /banks route
      bank_code,
      bank_account_number,
      bank_account_name,
      provider: "paystack",
      provider_recipient_id,
      verification_status: "verified",
      last_verified_at: new Date().toISOString(),
      is_default: !!is_default,
    })
    .select()
    .single();

  if (insertedWithdrawalAccountFiatErr) {
    return NextResponse.json(
      {
        error: "Failed to save account",
        message: insertedWithdrawalAccountFiatErr.message,
      },
      { status: 409 }
    );
  }

  // 7) return a safe object (mask acct number)
  const masked = bank_account_number.replace(/.(?=.{4})/g, "•");
  return NextResponse.json(
    {
      id: insertedWithdrawalAccountFiatData.id,
      currency_code: insertedWithdrawalAccountFiatData.currency_code,
      country_code: insertedWithdrawalAccountFiatData.country_code,
      bank_name: insertedWithdrawalAccountFiatData.bank_name,
      bank_code: insertedWithdrawalAccountFiatData.bank_code,
      bank_account_number_masked: masked,
      bank_account_name: insertedWithdrawalAccountFiatData.bank_account_name,
      is_default: insertedWithdrawalAccountFiatData.is_default,
      provider: insertedWithdrawalAccountFiatData.provider,
      verification_status:
        insertedWithdrawalAccountFiatData.verification_status,
    },
    { status: 201 }
  );
}

// catch (err) {
//   console.log("Error resolving bank account name", err);
//   return NextResponse.json(
//     {
//       error: "Error resolving bank account name",
//       message: (err as Error).message,
//     },
//     { status: 500 }
//   );
// }
