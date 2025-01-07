import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/authOptions"; // Import from the correct path

const handler = NextAuth(authOptions); // Use the imported authOptions


export { handler as GET, handler as POST }; // Export for both GET and POST
