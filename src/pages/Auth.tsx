import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, ChefHat } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('אימייל או סיסמה שגויים');
          } else {
            toast.error('שגיאה בהתחברות: ' + error.message);
          }
        } else {
          toast.success('ברוכים הבאים! 🍞');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('משתמש עם אימייל זה כבר קיים');
          } else {
            toast.error('שגיאה בהרשמה: ' + error.message);
          }
        } else {
          toast.success('נרשמת בהצלחה! 🎉');
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo & Title */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-crust flex items-center justify-center shadow-elevated">
          <ChefHat className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold font-rubik text-foreground mb-2">
          מחמצת—סיידקיק
        </h1>
        <p className="text-muted-foreground">
          העוזר האישי שלך לאפיית לחם מחמצת
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-sm bread-card animate-slide-up">
        <div className="flex mb-6 bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? 'bg-card text-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            התחברות
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? 'bg-card text-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            הרשמה
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="input-label">
              אימייל
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pr-10 text-left"
                dir="ltr"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="input-label">
              סיסמה
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full gradient-crust text-primary-foreground hover:opacity-90"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isLogin ? (
              'התחבר'
            ) : (
              'הירשם'
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        {isLogin ? 'עדיין אין לך חשבון?' : 'כבר יש לך חשבון?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary font-medium hover:underline"
        >
          {isLogin ? 'הירשם עכשיו' : 'התחבר'}
        </button>
      </p>
    </div>
  );
}
