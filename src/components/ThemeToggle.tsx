import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from './ThemeProvider';

const colorThemes = [
  { value: 'default', label: 'Green', color: 'hsl(142 35% 45%)' },
  { value: 'red', label: 'Red', color: 'hsl(0 70% 50%)' },
  { value: 'blue', label: 'Blue', color: 'hsl(220 70% 50%)' },
  { value: 'purple', label: 'Purple', color: 'hsl(270 70% 50%)' },
  { value: 'orange', label: 'Orange', color: 'hsl(30 70% 50%)' },
];

export function ThemeToggle() {
  const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {theme === 'light' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === 'light' ? (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Switch to Dark Mode
            </>
          ) : (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Switch to Light Mode
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        
        {colorThemes.map((colorOption) => (
          <DropdownMenuItem
            key={colorOption.value}
            onClick={() => setColorTheme(colorOption.value as any)}
            className="gap-2"
          >
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: colorOption.color }}
            />
            {colorOption.label}
            {colorTheme === colorOption.value && ' ✓'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}