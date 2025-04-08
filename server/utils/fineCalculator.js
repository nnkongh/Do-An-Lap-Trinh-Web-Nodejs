export const calculateFine =(dueDate)=>{
    const finePerHour= 0.1;
    const today = new Date();
    if(today > dueDate){
        const lateHours= Math.ceil((today - dueDate)/ (1000 * 60 * 60));
        const fine = lateHours * finePerHour;
        return parseFloat(fine.toFixed(2));
    }
    return 0;
}