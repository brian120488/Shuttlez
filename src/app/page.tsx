import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <Link href='/login'> 
        <button>Login</button>
      </Link>
    </div>
  );
}
