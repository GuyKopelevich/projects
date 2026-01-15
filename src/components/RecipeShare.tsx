import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  name: string;
  flour_amount: number;
  hydration: number;
  salt_percent: number;
  starter_percent: number;
  flour_mix?: { flour_id: string; flour_name: string; percentage: number }[];
}

interface RecipeShareProps {
  recipe: Recipe;
}

export function RecipeShare({ recipe }: RecipeShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateShareText = () => {
    const waterAmount = Math.round(recipe.flour_amount * (recipe.hydration / 100));
    const saltAmount = Math.round(recipe.flour_amount * (recipe.salt_percent / 100));
    const starterAmount = Math.round(recipe.flour_amount * (recipe.starter_percent / 100));

    let text = `🍞 מתכון: ${recipe.name}\n\n`;
    text += `📊 מרכיבים:\n`;
    text += `• קמח: ${recipe.flour_amount} גרם\n`;
    text += `• מים: ${waterAmount} גרם (${recipe.hydration}%)\n`;
    text += `• מלח: ${saltAmount} גרם (${recipe.salt_percent}%)\n`;
    text += `• מחמצת: ${starterAmount} גרם (${recipe.starter_percent}%)\n`;
    
    if (recipe.flour_mix && recipe.flour_mix.length > 0) {
      text += `\n🌾 תערובת קמחים:\n`;
      recipe.flour_mix.forEach(flour => {
        const amount = Math.round(recipe.flour_amount * (flour.percentage / 100));
        text += `• ${flour.flour_name}: ${amount} גרם (${flour.percentage}%)\n`;
      });
    }
    
    text += `\n📱 נוצר באפליקציית מחמצת-סיידקיק`;
    
    return text;
  };

  const copyToClipboard = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "הועתק!",
        description: "המתכון הועתק ללוח",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "שגיאה",
        description: "לא הצלחנו להעתיק",
        variant: "destructive",
      });
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `מתכון: ${recipe.name}`,
          text: generateShareText(),
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="flex-1"
      >
        {copied ? <Check className="h-4 w-4 ml-1" /> : <Copy className="h-4 w-4 ml-1" />}
        העתק
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareViaWhatsApp}
        className="flex-1"
      >
        <MessageCircle className="h-4 w-4 ml-1" />
        WhatsApp
      </Button>
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={shareNative}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
