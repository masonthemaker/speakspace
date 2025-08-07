import Particles from "@/components/Particles";
import Galaxy from "@/components/background";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Galaxy background fixed behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Galaxy />
      </div>

      {/* Foreground particles (unchanged) */}
      <Particles />
    </main>
  );
}
