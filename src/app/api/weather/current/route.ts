import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentWeather } from '@/lib/weatherService';

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city');

  if (!city) {
    return NextResponse.json(
      { error: 'Missing city or country' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchCurrentWeather(city);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Fallback for unknown errors
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
