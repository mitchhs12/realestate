import { SocialIcon } from "react-social-icons";
import { Button } from "@/components/ui/button";

export default function Icons() {
  return (
    <div className="grid grid-cols-3 gap-5 justify-center">
      <Button variant="secondary" size={"lgSqIcon"} className="rounded-xl">
        <SocialIcon
          url="https://x.com/viva_ideal"
          className="bg-[#000000] rounded-lg"
          style={{ height: 40, width: 40 }}
        />
      </Button>
      <Button variant="secondary" size={"lgSqIcon"} className="rounded-xl">
        <SocialIcon
          url="https://www.facebook.com/profile.php?id=61564984446949"
          className="bg-[#3B5998] rounded-lg"
          style={{ height: 40, width: 40 }}
        />
      </Button>
      <Button variant="secondary" size={"lgSqIcon"} className="rounded-xl">
        <SocialIcon
          url="https://www.instagram.com/viva.ideal"
          className="bg-[#E94475] rounded-lg"
          style={{ height: 40, width: 40 }}
        />
      </Button>
      <Button variant="secondary" size={"lgSqIcon"} className="rounded-xl">
        <SocialIcon
          url="https://www.linkedin.com/company/viva-ideal/"
          className="bg-[#007FB1] rounded-lg"
          style={{ height: 40, width: 40 }}
        />
      </Button>
      <Button variant="secondary" size={"lgSqIcon"} className="rounded-xl">
        <SocialIcon
          url="https://www.tiktok.com/@vivaideal"
          className="bg-[#000000] rounded-lg"
          style={{ height: 40, width: 40 }}
        />
      </Button>
      <Button variant="secondary" size={"lgSqIcon"} className="rounded-xl">
        <SocialIcon
          network={"whatsapp"}
          className="bg-[#25D366] rounded-lg"
          url="https://wa.me/message/PAJDSQEFHAE3F1"
          style={{ height: 40, width: 40 }}
        />
      </Button>
    </div>
  );
}
