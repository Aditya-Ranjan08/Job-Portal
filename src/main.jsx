// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import { ClerkProvider } from "@clerk/react";
// import { dark } from "@clerk/themes";

// // Import your publishable key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
// }

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ClerkProvider
//       appearance={{
//   theme: dark,
//   variables: {
//     colorPrimary: "#8b5cf6", 
//   },
// }}
//       publishableKey={PUBLISHABLE_KEY}
//       afterSignOutUrl="/"
//     >
//       <App />
//     </ClerkProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/react"; 
import { dark } from "@clerk/themes";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      // In dono lines ko add karo taaki login ke baad loop na bane
      signInFallbackRedirectUrl="/onboarding" 
      signUpFallbackRedirectUrl="/onboarding"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#8b5cf6",
          colorText: "white", // Visibility fix jo pehle discuss ki thi
        },
        elements: {
          // User Button Popover text visibility fix
          userPreviewMainIdentifier: "text-white font-bold",
          userPreviewSecondaryIdentifier: "text-slate-400",
          userButtonPopoverActionButtonText: "text-white",
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);