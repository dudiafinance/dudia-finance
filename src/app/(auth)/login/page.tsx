"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Intercepta console.log
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      setLogs((prev) => [...prev, `[LOG] ${new Date().toISOString()} - ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs((prev) => [...prev, `[ERROR] ${new Date().toISOString()} - ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`]);
      originalError(...args);
    };

    console.warn = (...args) => {
      setLogs((prev) => [...prev, `[WARN] ${new Date().toISOString()} - ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`]);
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[ACTION] ${timestamp} - ${message}`;
    setLogs((prev) => [...prev, logMessage]);
    console.log(logMessage);
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    addLog(`Iniciando login com credenciais: ${email}`);
    
    try {
      addLog("Chamando signIn com redirect: false...");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      addLog(`Resultado signIn: ${JSON.stringify(result)}`);
      
      if (result?.error) {
        setError(`Erro: ${result.error}`);
        addLog(`ERRO: ${result.error}`);
      } else if (result?.ok) {
        addLog("Login OK! Verificando sessão...");
        
        // Verificar sessão
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        addLog(`Session data: ${JSON.stringify(sessionData)}`);
        
        if (sessionData?.user) {
          addLog("Usuário autenticado! Redirecionando...");
          window.location.href = "/";
        } else {
          addLog("ERRO: Sessão não criada após login OK");
          setError("Erro ao criar sessão");
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      addLog(`EXCEPTION: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    setError("");
    addLog(`Iniciando login com ${provider}...`);
    
    try {
      addLog(`Chamando signIn(${provider}) com redirect: false...`);
      const result = await signIn(provider, {
        redirect: false,
      });
      
      addLog(`Resultado OAuth ${provider}: ${JSON.stringify(result)}`);
      
      if (result?.error) {
        setError(`Erro: ${result.error}`);
        addLog(`ERRO OAuth: ${result.error}`);
      } else if (result?.ok) {
        addLog(`${provider} OK! Redirecionando...`);
        window.location.href = "/";
      } else {
        addLog(`Resultado inesperado: ${JSON.stringify(result)}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      addLog(`EXCEPTION OAuth: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyLogs = () => {
    const logText = logs.join("\n");
    navigator.clipboard.writeText(logText);
    addLog("Logs copiados para clipboard");
    alert("Logs copiados! Cole aqui: https://pastebin.com ou me envie diretamente");
  };

  const downloadLogs = () => {
    const logText = logs.join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dudia-finance-logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addLog("Logs baixados como arquivo");
  };

  const saveLogsToServer = async () => {
    addLog("Enviando logs para o servidor...");
    try {
      const response = await fetch("/api/debug/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logs,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
      const data = await response.json();
      if (data.success) {
        addLog(`Logs salvos no servidor: ${data.filename}`);
        alert(`Logs salvos! Arquivo: ${data.filename}`);
      } else {
        addLog(`ERRO ao salvar: ${data.error}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      addLog(`EXCEPTION ao salvar: ${errorMessage}`);
    }
  };

  const testAPI = async () => {
    addLog("Testando API de registro...");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Teste API",
          email: "api-test@test.com",
          password: "123456"
        }),
      });
      const data = await response.json();
      addLog(`API Response: ${JSON.stringify(data)}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      addLog(`API ERROR: ${errorMessage}`);
    }
  };

  const testSession = async () => {
    addLog("Verificando sessão...");
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      addLog(`Session: ${JSON.stringify(data)}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      addLog(`Session ERROR: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Debug - DUD.IA Finance</h1>
          <p className="text-muted-foreground mt-2">Página de diagnóstico de login</p>
        </div>

        {/* Login Form */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Login por Email/Senha</h2>
          
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar com Email"}
            </Button>
          </form>
        </div>

        {/* OAuth Buttons */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Login por OAuth</h2>
          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
            >
              Entrar com Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("github")}
              disabled={isLoading}
            >
              Entrar com GitHub
            </Button>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Testes de API</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={testAPI}>
              Testar API de Registro
            </Button>
            <Button variant="outline" onClick={testSession}>
              Verificar Sessão
            </Button>
          </div>
        </div>

        {/* Logs */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Logs Capturados ({logs.length})</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowLogs(!showLogs)}>
                {showLogs ? "Ocultar" : "Mostrar"} Logs
              </Button>
              <Button variant="outline" size="sm" onClick={copyLogs}>
                Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={downloadLogs}>
                Baixar
              </Button>
              <Button variant="default" size="sm" onClick={saveLogsToServer}>
                Salvar no Servidor
              </Button>
            </div>
          </div>

          {showLogs && (
            <div className="bg-muted rounded-md p-4 max-h-96 overflow-auto">
              <pre className="text-xs whitespace-pre-wrap break-all">
                {logs.length === 0 ? "Nenhum log ainda..." : logs.join("\n")}
              </pre>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-950 p-6">
          <h2 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Instruções</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
            <li>Tente fazer login com email/senha ou OAuth</li>
            <li>Os logs vão aparecer automaticamente na seção "Logs Capturados"</li>
            <li>Clique em "Mostrar Logs" para ver o que aconteceu</li>
            <li>Clique em "Baixar" para salvar os logs em arquivo</li>
            <li>Envie o arquivo ou copie os logs para que eu possa analisar</li>
          </ol>
        </div>
      </div>
    </div>
  );
}