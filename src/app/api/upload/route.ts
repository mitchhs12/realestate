// import { sql } from "@vercel/postgres";
// import { getSession } from "next-auth/client";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const session = await getSession({ req: request });

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const {
//       title,
//       description,
//       address,
//       city,
//       state,
//       district,
//       municipality,
//       country,
//       latitude,
//       longitude,
//       types,
//       features,
//       bedrooms,
//       bathrooms,
//       capacity,
//       photos,
//       price,
//       area_sqm,
//     } = await request.json();

//     const result = await sql`
//       INSERT INTO Homes (
//         title, description, address, city, state, district, municipality, country, latitude, longitude, types, features, bedrooms, bathrooms, capacity, photos, price, area_sqm, owner_id
//       ) VALUES (
//         ${title}, ${description}, ${address}, ${city}, ${state}, ${district}, ${municipality}, ${country}, ${latitude}, ${longitude}, ${types}, ${features}, ${bedrooms}, ${bathrooms}, ${capacity}, ${photos}, ${price}, ${area_sqm}, ${session.user.id}
//       )
//       RETURNING *;
//     `;

//     return NextResponse.json({ result }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
