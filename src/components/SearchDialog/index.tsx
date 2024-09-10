import { useState, useContext } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Dialog } from "../ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import FilterContent from "@/components/FiltersDialog/Content";
import { QueryContext } from "@/context/QueryContext";

interface Props {
  isSmallMap: boolean;
  placeholder: string;
  placeholderShort: string;
  text: string;
}

export default function SearchDialog({ isSmallMap, placeholder, placeholderShort, text }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { headerValues, isFiltering } = useContext(QueryContext);

  const { searchText } = headerValues;

  return (
    <>
      <Button
        className="rounded-full h-12 gap-3"
        size={"default"}
        variant={"default"}
        disabled={isFiltering}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        {isFiltering ? <ReloadIcon className="animate-spin w-5 h-5" /> : <Search size={20} />}
        {searchText}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <FilterContent
          isSmallMap={isSmallMap}
          placeholder={placeholder}
          placeholderShort={placeholderShort}
          text={text}
        />
      </Dialog>
    </>
  );
}
