-- CreateTable
CREATE TABLE "currencies" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "usdPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);
