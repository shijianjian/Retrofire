export function validatePoint(arr: number[]): boolean {
    if (arr.length < 3) { // contains x, y, z at least
        return false;
    }
    arr.forEach((v) => {
        if(isNaN(v)){
            return false;
        }
    })
    return true;
}