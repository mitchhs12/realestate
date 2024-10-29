"use client";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { HomeType } from "@/lib/validations";

interface Props {
  homes: (HomeType | null)[];
  ITEMS_PER_PAGE: number;
  setVisibleHomes: any;
}

export default function PaginationComponent({ homes, ITEMS_PER_PAGE, setVisibleHomes }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [homes]);

  useEffect(() => {
    setVisibleHomes(homes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));
  }, [currentPage, homes]);

  const totalPages = Math.ceil(homes.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1}
            className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
            onClick={handlePreviousPage}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
            {1}
          </PaginationLink>
        </PaginationItem>
        {currentPage > 3 && <PaginationEllipsis />}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current Page */}
        {currentPage !== 1 && currentPage !== totalPages && (
          <PaginationItem>
            <PaginationLink className="cursor-pointer" isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage < totalPages - 2 && <PaginationEllipsis />}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext disabled={currentPage === totalPages} className="cursor-pointer" onClick={handleNextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
