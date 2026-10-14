import { RouterProvider } from "react-router";
import { PreferencesProvider } from "./PreferencesProvider";
import { EvidenceProvider } from "../components/FactSourcePanel";
import { router } from "./router";
export default function App() {
  return (
    <PreferencesProvider>
      <EvidenceProvider>
        <RouterProvider router={router} />
      </EvidenceProvider>
    </PreferencesProvider>
  );
}
