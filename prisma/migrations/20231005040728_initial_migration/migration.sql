-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "salary" TEXT,
    "url" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);
