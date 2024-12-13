"use client";

import { useScopedI18n } from "@/locales/client";
import { useEffect, useState, useContext, type JSX } from "react";
import { ExponentialSlider } from "@/components/ui/exponentialSlider"; // Import your new ExponentialSlider component
import { QueryContext } from "@/context/QueryContext";
import { BedDouble, CookingPot, Bath, Sofa } from "lucide-react";

interface RoomObject {
  id: string;
  image: JSX.Element;
  translation: string;
  range: number[];
}

interface RoomsObject {
  bedrooms: RoomObject;
  bathrooms: RoomObject;
  livingrooms: RoomObject;
  kitchens: RoomObject;
}

interface Props {
  selectedRooms: {
    bedrooms: number[];
    bathrooms: number[];
    livingrooms: number[];
    kitchens: number[];
    maxRooms: number;
  };
  setSelectedRooms: ({
    bedrooms,
    bathrooms,
    livingrooms,
    kitchens,
    maxRooms,
  }: {
    bedrooms: number[];
    bathrooms: number[];
    livingrooms: number[];
    kitchens: number[];
    maxRooms: number;
  }) => void;
}

export default function Rooms({ selectedRooms, setSelectedRooms }: Props) {
  const t = useScopedI18n("sell.rooms");

  const initialRoomsObj: RoomsObject = {
    bedrooms: {
      id: "bedrooms",
      image: <BedDouble size={20} strokeWidth={1.25} />,
      translation: t("bedrooms"),
      range: selectedRooms.bedrooms,
    },
    bathrooms: {
      id: "bathrooms",
      image: <Bath size={20} strokeWidth={1.25} />,
      translation: t("bathrooms"),
      range: selectedRooms.bathrooms,
    },
    livingrooms: {
      id: "livingrooms",
      image: <Sofa size={20} strokeWidth={1.25} />,
      translation: t("living-rooms"),
      range: selectedRooms.livingrooms,
    },
    kitchens: {
      id: "kitchens",
      image: <CookingPot size={20} strokeWidth={1.25} />,
      translation: t("kitchens"),
      range: selectedRooms.kitchens,
    },
  };

  const [roomsObject, setRoomsObject] = useState<RoomsObject>(initialRoomsObj);

  const handleRoomsChanged = (roomId: keyof RoomsObject, range: number[]) => {
    const updatedRoomsObj = { ...roomsObject, [roomId]: { ...roomsObject[roomId], range } };
    setRoomsObject(updatedRoomsObj);

    const updatedSelectedRooms = {
      bedrooms: updatedRoomsObj.bedrooms.range,
      bathrooms: updatedRoomsObj.bathrooms.range,
      livingrooms: updatedRoomsObj.livingrooms.range,
      kitchens: updatedRoomsObj.kitchens.range,
      maxRooms: selectedRooms.maxRooms,
    };

    setSelectedRooms(updatedSelectedRooms);
  };

  useEffect(() => {
    setRoomsObject(initialRoomsObj);
  }, [selectedRooms, t]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between gap-2 w-full rounded-sm p-2">
        <div className="flex flex-col items-start text-sm gap-3 h-full">
          <div className="flex gap-2 h-12 items-center">
            <div>{roomsObject.bedrooms.image}</div>
            <div className="flex text-nowrap">{roomsObject.bedrooms.translation}</div>
          </div>
          <div className="flex gap-2 h-12 items-center">
            <div>{roomsObject.bathrooms.image}</div>
            <div className="flex text-nowrap">{roomsObject.bathrooms.translation}</div>
          </div>
          <div className="flex gap-2 h-12 items-center">
            <div>{roomsObject.livingrooms.image}</div>
            <div className="flex text-nowrap">{roomsObject.livingrooms.translation}</div>
          </div>
          <div className="flex gap-2 h-12 items-center">
            <div>{roomsObject.kitchens.image}</div>
            <div className="flex text-nowrap">{roomsObject.kitchens.translation}</div>
          </div>
        </div>
        <div className="flex flex-col items-center text-sm gap-3 h-full w-full">
          <div className="flex h-full w-full">
            <ExponentialSlider
              minValue={0}
              maxValue={selectedRooms.maxRooms}
              exponent={1.5} // Set the exponent value, adjust as needed
              onValuesChange={(range: number[]) =>
                handleRoomsChanged(roomsObject.bedrooms.id as keyof RoomsObject, range)
              }
              value={roomsObject.bedrooms.range}
            />
          </div>
          <div className="flex h-full w-full">
            <ExponentialSlider
              minValue={0}
              maxValue={selectedRooms.maxRooms}
              exponent={1.5} // Set the exponent value, adjust as needed
              onValuesChange={(range: number[]) =>
                handleRoomsChanged(roomsObject.bathrooms.id as keyof RoomsObject, range)
              }
              value={roomsObject.bathrooms.range}
            />
          </div>
          <div className="flex h-full w-full">
            <ExponentialSlider
              minValue={0}
              maxValue={selectedRooms.maxRooms}
              exponent={1.5} // Set the exponent value, adjust as needed
              onValuesChange={(range: number[]) =>
                handleRoomsChanged(roomsObject.livingrooms.id as keyof RoomsObject, range)
              }
              value={roomsObject.livingrooms.range}
            />
          </div>
          <div className="flex h-full w-full">
            <ExponentialSlider
              minValue={0}
              maxValue={selectedRooms.maxRooms}
              exponent={1.5} // Set the exponent value, adjust as needed
              onValuesChange={(range: number[]) =>
                handleRoomsChanged(roomsObject.kitchens.id as keyof RoomsObject, range)
              }
              value={roomsObject.kitchens.range}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
