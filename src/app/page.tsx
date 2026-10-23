import { CeilingHero } from "@/components/sections/CeilingHero";
import { StatementStrip } from "@/components/sections/StatementStrip";
import { CeilingCollection } from "@/components/sections/CeilingCollection";
import { Process } from "@/components/sections/Process";
import { EpoxyFloors } from "@/components/sections/EpoxyFloors";
import { Services } from "@/components/sections/Services";
import { Audience } from "@/components/sections/Audience";
import { SelectedRooms } from "@/components/sections/SelectedRooms";
import { Proof } from "@/components/sections/Proof";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <CeilingHero />
        <StatementStrip />
        <CeilingCollection />
        <Process />
        <EpoxyFloors />
        <Services />
        <Audience />
        <SelectedRooms />
        <Proof />
        <ServiceArea />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
