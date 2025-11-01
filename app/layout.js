import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import "./globals.css";
import { AuthProvider } from "./Providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "ReDILINK",
  description: "Created by Arman Hossain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <div className="flex flex-row text-xl">
            <LeftBar />
            {children}
            <Analytics />
            <SpeedInsights/>
            <RightBar />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
