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
    console.log("homes changed!");
    setCurrentPage(1);
    setVisibleHomes(homes.slice(0, ITEMS_PER_PAGE));
  }, [homes]);

  useEffect(() => {
    setVisibleHomes(homes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));
  }, [currentPage]);

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
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1}
            className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
            onClick={handlePreviousPage}
          />
        </PaginationItem>

        {/* First Page */}
        <PaginationItem>
          <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>

        {/* Ellipsis or Second Page */}
        {currentPage > 3 && totalPages > 5 && <PaginationEllipsis />}
        {totalPages > 5 && currentPage > 2 && (
          <PaginationItem>
            <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current Page */}
        {currentPage > 1 && currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink className="cursor-pointer" isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next Page or Last Page */}
        {totalPages > 5 && currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {totalPages > 5 && currentPage < totalPages - 2 && <PaginationEllipsis />}

        {/* Last Page */}
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

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext disabled={currentPage === totalPages} className="cursor-pointer" onClick={handleNextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
