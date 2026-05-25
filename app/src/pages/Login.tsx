import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3A5F] flex items-center justify-center mx-auto mb-4">
            <Map size={32} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Cartographie Interactive</h1>
          <p className="text-sm text-gray-500 mt-1">Consultation et Appel d&apos;Offres</p>
        </div>
        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-base">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 text-center mb-4">
              Connectez-vous pour acceder a vos projets et collaborer avec votre equipe.
            </p>
            <Button
              className="w-full bg-[#1E3A5F] hover:bg-[#152D4A]"
              size="lg"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              Se connecter avec Kimi
            </Button>
          </CardContent>
        </Card>
        <p className="text-xs text-gray-400 text-center mt-4">
          Systeme de gestion collaborative des offres commerciales
        </p>
      </div>
    </div>
  );
}
