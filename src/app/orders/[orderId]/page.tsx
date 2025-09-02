import { mongo } from "@/lib/mongo";
import { ObjectId } from 'mongodb';

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  
  const db = mongo.db('shuttlez');
  const orders = db.collection('orders');

  // Find the order by _id (must be ObjectId type)
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