import { mongo } from "@/lib/mongo";
import { ObjectId } from 'mongodb';

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  
  const client = await mongo;
  const db = client.db('shuttlez');  
  const orders = db.collection('orders'); 

  const order = await orders.findOne({ _id: new ObjectId(orderId) });

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <pre>{JSON.stringify(order, null, 2)}</pre>
    </div>
  );
}