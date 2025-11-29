import Image from "next/image";
import { QuizForm } from "@/app/ui/QuizForm";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <QuizForm />
    </div>
  );
}
