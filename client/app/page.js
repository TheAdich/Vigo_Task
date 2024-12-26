import Image from "next/image";
import Register from "./components/authSetup/regsiter";
export default function Home() {
  return (
    <div className="h-screen w-full font-[family-name:var(--font-geist-sans)]">
      <Register/>
    </div>
  );
}
