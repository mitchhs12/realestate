import { useState, useContext } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";
import FilterContent from "@/components/FiltersDialog/Content";
import SearchBox from "@/components/SearchBox";
import FiltersDialog from "../FiltersDialog";
import { QueryContext } from "@/context/QueryContext";

interface Props {
  isSmallMap: boolean;
  placeholder: string;
  text: string;
}

export default function SearchDialog({ isSmallMap, placeholder, text }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { headerValues } = useContext(QueryContext);

  const { searchText } = headerValues;

  return (
    <>
      <Button
        className="rounded-full h-12 gap-3"
        size={"default"}
        variant={"default"}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <Search size={20} />
        {searchText}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <FilterContent isSmallMap={isSmallMap} placeholder={placeholder} text={text} />
      </Dialog>
    </>
  );
}
