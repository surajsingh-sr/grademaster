import { useState, type FormEvent } from "react";
import { LogIn, Mail, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/Button";
import { FloatingInput, SelectField } from "@/components/FormFields";
import { useAuthStore } from "@/store/useStore";
import { useToast } from "@/components/Toast";
import type { EducationLevel } from "@/types";
import type { PageId } from "@/components/Navbar";

export function AuthPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const { showToast } = useToast();
  const { signIn, signUp, isLoading, error } = useAuthStore();

  // sign-in fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // sign-up fields
  const [name, setName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institutionType, setInstitutionType] = useState<EducationLevel>("college");
  const [institutionName, setInstitutionName] = useState("");
  const [courseOrClass, setCourseOrClass] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email is required";
    if (!password || password.length < 8) errors.password = "Password must be at least 8 characters";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await signIn({ email, password });
      showToast("Welcome back!", "success");
      onNavigate("dashboard");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Sign in failed.", "error");
    }
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Name must be at least 2 characters";
    if (!suEmail) errors.suEmail = "Email is required";
    if (!suPassword || suPassword.length < 8) errors.suPassword = "Password must be at least 8 characters";
    if (suPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (!institutionName) errors.institutionName = "Institution name is required";
    if (!courseOrClass) errors.courseOrClass = "Course / class is required";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await signUp({
        name,
        email: suEmail,
        password: suPassword,
        institutionType,
        institutionName,
        courseOrClass,
      });
      showToast("Account created — welcome to GradeMaster!", "success");
      onNavigate("dashboard");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Sign up failed.", "error");
    }
  }

  return (
    <div className="container section" style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="text-center mb-16">
          <h1>{mode === "sign-in" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-muted mt-8">
            {mode === "sign-in" ? "Sign in to access your student dashboard." : "Track your CGPA, SGPA, and progress over time."}
          </p>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          {mode === "sign-in" ? (
            <form onSubmit={handleSignIn} className="flex" style={{ flexDirection: "column", gap: 18 }}>
              <FloatingInput label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={formErrors.email} />
              <FloatingInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={formErrors.password} />
              {error && <p className="field-error">{error}</p>}
              <Button block type="submit" disabled={isLoading}>
                <LogIn size={16} /> {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <p className="text-center text-muted" style={{ fontSize: "0.85rem" }}>
                Don't have an account?{" "}
                <button type="button" onClick={() => setMode("sign-up")} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700 }}>
                  Sign up
                </button>
              </p>
              <div className="flex items-center justify-center gap-8 text-muted" style={{ fontSize: "0.72rem" }}>
                <Mail size={13} /> Secured by Appwrite Authentication <Lock size={13} />
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="flex" style={{ flexDirection: "column", gap: 18 }}>
              <FloatingInput label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={formErrors.name} />
              <FloatingInput label="Email or phone" type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} error={formErrors.suEmail} />
              <div className="dynamic-row-fields cols-2">
                <FloatingInput label="Password" type="password" value={suPassword} onChange={(e) => setSuPassword(e.target.value)} error={formErrors.suPassword} />
                <FloatingInput label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={formErrors.confirmPassword} />
              </div>
              <SelectField label="Institution type" value={institutionType} onChange={(e) => setInstitutionType(e.target.value as EducationLevel)}>
                <option value="college">College / University</option>
                <option value="school">School</option>
              </SelectField>
              <FloatingInput label="Institution name" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} error={formErrors.institutionName} />
              <FloatingInput label="Course / Class" value={courseOrClass} onChange={(e) => setCourseOrClass(e.target.value)} error={formErrors.courseOrClass} />
              {error && <p className="field-error">{error}</p>}
              <Button block type="submit" disabled={isLoading}>
                <UserPlus size={16} /> {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-center text-muted" style={{ fontSize: "0.85rem" }}>
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("sign-in")} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700 }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
