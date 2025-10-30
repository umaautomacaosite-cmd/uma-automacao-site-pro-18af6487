import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Admin from "./Admin";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"login" | "verify">("login");
  const [requestingCode, setRequestingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminRole(session.user.id);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
      
      if (!data) {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão de administrador.",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestingCode(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user is admin
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role, last_verified_at")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!roleData) {
          await supabase.auth.signOut();
          toast({
            title: "Acesso Negado",
            description: "Você não tem permissão de administrador.",
            variant: "destructive",
          });
          return;
        }

        // Check if user verified in the last 7 days
        const lastVerified = roleData.last_verified_at ? new Date(roleData.last_verified_at) : null;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (lastVerified && lastVerified > sevenDaysAgo) {
          // User verified recently, grant access directly
          setIsAdmin(true);
          toast({
            title: "Acesso Autorizado",
            description: "Bem-vindo ao painel administrativo!",
          });
          return;
        }

        // Generate and save 2FA code
        const generatedCode = generateCode();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Code expires in 10 minutes

        const { error: codeError } = await supabase
          .from("access_codes")
          .insert({
            user_id: data.user.id,
            code: generatedCode,
            expires_at: expiresAt.toISOString(),
          });

        if (codeError) throw codeError;

        toast({
          title: "Código de Verificação Gerado",
          description: "Um código de verificação foi gerado e está disponível para consulta. O código é válido por 10 minutos.",
          duration: 10000,
        });

        setStep("verify");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRequestingCode(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingCode(true);

    try {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("access_codes")
        .select("*")
        .eq("user_id", user.id)
        .eq("code", code.toUpperCase())
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Código Inválido",
          description: "O código inserido está incorreto ou expirou.",
          variant: "destructive",
        });
        return;
      }

      // Mark code as used
      await supabase
        .from("access_codes")
        .update({ used: true })
        .eq("id", data.id);

      // Update last_verified_at to current timestamp
      await supabase
        .from("user_roles")
        .update({ last_verified_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("role", "admin");

      toast({
        title: "Acesso Autorizado",
        description: "Bem-vindo ao painel administrativo!",
      });

      setIsAdmin(true);
    } catch (error: any) {
      toast({
        title: "Erro ao verificar código",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user && isAdmin) {
    return (
      <div className="min-h-screen">
        <Admin />
        <div className="fixed bottom-4 right-4">
          <Button onClick={handleLogout} variant="destructive">
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-playfair text-2xl text-wine-900">
                Painel Administrativo
              </CardTitle>
              <CardDescription>
                {step === "login"
                  ? "Faça login para acessar o sistema de gestão de conteúdo"
                  : "Digite o código de verificação do banco de dados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="font-lato font-medium text-sm mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={requestingCode}
                    />
                  </div>
                  <div>
                    <label className="font-lato font-medium text-sm mb-2 block">Senha</label>
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={requestingCode}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-wine-900 hover:bg-wine-800 text-white w-full"
                    disabled={requestingCode}
                  >
                    {requestingCode ? "Gerando código..." : "Fazer Login"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-lato text-sm text-blue-800">
                      Para sua segurança, um código de verificação de 6 caracteres foi gerado. 
                      Consulte o administrador do sistema para obter o código. 
                      <strong> O código expira em 10 minutos.</strong>
                    </p>
                  </div>
                  <div>
                    <label className="font-lato font-medium text-sm mb-2 block">Código de Verificação</label>
                    <Input
                      type="text"
                      placeholder="Digite o código de 6 caracteres"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      required
                      disabled={verifyingCode}
                      className="text-center text-lg font-mono tracking-widest"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-wine-900 hover:bg-wine-800 text-white w-full"
                    disabled={verifyingCode}
                  >
                    {verifyingCode ? "Verificando..." : "Verificar Código"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setStep("login");
                      setCode("");
                      supabase.auth.signOut();
                    }}
                  >
                    Voltar
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
