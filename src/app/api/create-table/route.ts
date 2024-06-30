import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await sql`
      CREATE TABLE Homes (
        id SERIAL PRIMARY KEY,
        owner_id INT NOT NULL REFERENCES Users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        address VARCHAR(255),
        district VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        country VARCHAR(255) NOT NULL,
        latitude NUMERIC(9, 6),
        longitude NUMERIC(9, 6),
        type TEXT[] NOT NULL,
        features TEXT[] NOT NULL,
        bedrooms INT NOT NULL,
        bathrooms INT NOT NULL,
        capacity INT NOT NULL,
        photos TEXT[],
        price NUMERIC(10, 2) NOT NULL,
        area_sqm NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
