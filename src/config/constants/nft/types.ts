export enum NFTGrade {
    CLEANER = 'Cleaner',
    CASHIER = 'Cashier',
    CUSTOMER_SERVICE = 'Customer Service',
    ACCOUNTING = 'Accounting',
    MANAGER = 'Manager',
    CEO = "CEO"
}

export interface NFTGradeConfig {
    grade: NFTGrade
    level: number
    image: string
    qualityMin: number
    qualityMax: number
}