import { SocialIcon } from "react-social-icons";
import { Button } from "@/components/ui/button";

export default function Icons() {
  return (
    <div className="flex gap-5 justify-center">
      <Button variant="ghost" size={"lgSqIcon"} className="rounded-full">
        <SocialIcon url="https://x.com/viva_ideal" style={{ height: 40, width: 40 }} />
      </Button>
      <Button variant="ghost" size={"lgSqIcon"} className="rounded-full">
        <SocialIcon url="https://www.facebook.com/profile.php?id=61564984446949" style={{ height: 40, width: 40 }} />
      </Button>
      <Button variant="ghost" size={"lgSqIcon"} className="rounded-full">
        <SocialIcon url="https://www.instagram.com/viva.ideal" style={{ height: 40, width: 40 }} />
      </Button>
      <Button variant="ghost" size={"lgSqIcon"} className="rounded-full">
        <SocialIcon url="https://www.tiktok.com/@vivaideal" style={{ height: 40, width: 40 }} />
      </Button>
      <Button variant="ghost" size={"lgSqIcon"} className="rounded-full">
        <SocialIcon network={"whatsapp"} url="https://wa.me/message/PAJDSQEFHAE3F1" style={{ height: 40, width: 40 }} />
      </Button>
    </div>
  );
}
