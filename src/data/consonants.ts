export const consonantList = [ 
    "M", "P", "L", "S", "T", "D", "N", "F", "B", "C", "G", "R",
 ] as const;
export type Consonant = (typeof consonantList)[number];