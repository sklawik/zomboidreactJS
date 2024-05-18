export class Rectangle {
    static testPoint(x1: number, y1: number, x2: number, y2: number, px: number, py: number): boolean {
        return x1 <= px && px <= x2 && y1 <= py && py <= y2;
    }
}