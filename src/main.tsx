import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "@/components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./components/routing/Router";
import { AuthContextProvider } from "./components/context/auth/AuthContext";
import { mockBenefitSettings, mockBenefitsList } from "./mock/benefitsData";

//Mock data
mockBenefitsList();
mockBenefitSettings();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);

// You could retain the <App /> file and move the router init in there but this looks a bit cleaner
