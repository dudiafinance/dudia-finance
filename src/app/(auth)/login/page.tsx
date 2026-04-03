"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setDebug("Iniciando login...");
    
    try {
      setDebug("Chamando signIn...");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      setDebug(`Resultado: ${JSON.stringify(result)}`);
      
      if (result?.error) {
        setError(`Erro: ${result.error}`);
        setDebug(`Erro: ${result.error}`);
      } else if (result?.ok) {
        setDebug("Login OK! Redirecionando...");
        window.location.href = "/";
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      setDebug(`Exception: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    setError("");
    setDebug(`Iniciando login com ${provider}...`);
    
    try {
      const result = await signIn(provider, {
        redirect: false,
      });
      
      setDebug(`Resultado OAuth: ${JSON.stringify(result)}`);
      
      if (result?.error) {
        setError(`Erro: ${result.error}`);
      } else if (result?.ok) {
        setDebug("OAuth OK! Redirecionando...");
        window.location.href = "/";
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">DUD.IA Finance</h1>
          <p className="mt-2 text-muted-foreground">
            Teste de Login
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <div className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            {debug && (
              <div className="rounded-md bg-muted p-3 text-sm">
                {debug}
              </div>
            )}

            <div className="grid gap-2">
              <Button
                variant="outline"
                onClick={() => handleOAuthLogin("google")}
                disabled={isLoading}
                className="w-full"
              >
                Entrar com Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com email
                </span>
              </div>
            </div>

            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <a href="/register" className="text-primary underline-offset-4 hover:underline">
              Criar conta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}