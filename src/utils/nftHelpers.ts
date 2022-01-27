import BigNumber from "bignumber.js";

export const getFixRate = (grade: number, quality: number) => {

    if( grade === 1 ){
        return new BigNumber(quality).multipliedBy(10000).dividedBy(5000).plus(110000);
    }
    
    if( grade === 2){
        return new BigNumber(quality).minus(5000).multipliedBy(10000).dividedBy(3000).plus(120000);
    }
    
    if( grade === 3){
        return new BigNumber(quality).minus(8000).multipliedBy(10000).dividedBy(1000).plus(130000);
    }
    
    if( grade === 4){
        return new BigNumber(quality).minus(9000).multipliedBy(20000).dividedBy(800).plus(140000);
    }
    
    if( grade === 5){
        return new BigNumber(quality).minus(9800).multipliedBy(20000).dividedBy(180).plus(160000);
    }
    return new BigNumber(quality).minus(9980).multipliedBy(20000).dividedBy(20).plus(180000);
}
