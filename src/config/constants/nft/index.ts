import { NFTGrade, NFTGradeConfig } from "./types";

export const nftGrades: NFTGradeConfig[] = [
    {
        grade: NFTGrade.CLEANER,
        level: 1,
        image: 'cleaner.png',
        qualityMin: 0,
        qualityMax: 5000
    },
    {
        grade: NFTGrade.CASHIER,
        level: 2,
        image: 'cashier.png',
        qualityMin: 5000,
        qualityMax: 8000
    },
    {
        grade: NFTGrade.CUSTOMER_SERVICE,
        level: 3,
        image: 'customer_service.png',
        qualityMin: 8000,
        qualityMax: 9000
    },
    {
        grade: NFTGrade.ACCOUNTING,
        level: 4,
        image: 'accounting.png',
        qualityMin: 9000,
        qualityMax: 9800
    },
    {
        grade: NFTGrade.MANAGER,
        level: 5,
        image: 'manager.png',
        qualityMin: 9800,
        qualityMax: 9980
    },
    {
        grade: NFTGrade.CEO,
        level: 6,
        image: 'ceo.png',
        qualityMin: 9980,
        qualityMax: 10000
    }
]