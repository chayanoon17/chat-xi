// global.d.ts
declare global {
    // eslint-disable-next-line no-var
    let prisma: PrismaClient | undefined; // ประกาศ PrismaClient ให้เป็น global variable
  }
  
  export {};
  
  declare module "tailwindcss/lib/util/flattenColorPalette" {
    const flattenColorPalette: (colors: unknown) => Record<string, string>;
    export default flattenColorPalette;
  }
  
  
  