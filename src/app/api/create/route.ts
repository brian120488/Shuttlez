import { NextRequest, NextResponse } from 'next/server';
import { mongo } from '@/lib/mongo';

export async function POST(req: NextRequest) {
  const client = await mongo;
  const db = client.db('shuttlez');  
  const orders = db.collection('orders');   

  try {
    const { title, shuttleType, goal } = await req.json();
    const result = await orders.insertOne({
      title,
      shuttleType,
      goal,
      createdAt: new Date(),
    });

    console.log('Inserted order with _id:', result.insertedId);

    return NextResponse.json({ ok: true, orderId: result.insertedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: 'Failed to create order' }, { status: 500 });
  } finally {
    await client.close();
  }
}
