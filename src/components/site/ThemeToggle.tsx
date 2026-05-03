import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const isDark = ready && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghostGold"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="shrink-0 border border-gold/20 bg-background/80"
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
};
