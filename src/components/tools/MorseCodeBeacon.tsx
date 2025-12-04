import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Radio, Square } from 'lucide-react';

const MORSE_CODE: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

export const MorseCodeBeacon = () => {
  const [text, setText] = useState('SOS');
  const [isActive, setIsActive] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const dotDuration = 200;
    const dashDuration = 600;
    const gapDuration = 200;
    const letterGap = 600;
    const wordGap = 1400;

    const morse = text.toUpperCase().split('').map(char => MORSE_CODE[char] || '').join(' ');
    const pattern: number[] = [];

    morse.split('').forEach((char, index) => {
      if (char === '.') {
        pattern.push(dotDuration, gapDuration);
      } else if (char === '-') {
        pattern.push(dashDuration, gapDuration);
      } else if (char === ' ') {
        pattern.push(letterGap);
      } else if (char === '/') {
        pattern.push(wordGap);
      }
    });

    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let audioContext: AudioContext | null = null;

    const playBeep = (duration: number) => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    };

    const flash = () => {
      if (currentIndex >= pattern.length) {
        currentIndex = 0;
      }

      const duration = pattern[currentIndex];
      const isOn = currentIndex % 2 === 0 && morse[Math.floor(currentIndex / 2)] !== ' ' && morse[Math.floor(currentIndex / 2)] !== '/';
      
      setIsFlashing(isOn);
      
      if (isOn) {
        playBeep(duration);
      }
      
      timeoutId = setTimeout(() => {
        currentIndex++;
        flash();
      }, duration);
    };

    flash();

    return () => {
      clearTimeout(timeoutId);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isActive, text]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Radio className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Morse Code Beacon</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Convert text to morse code light and sound signals
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="morse-text">Message</Label>
          <Input
            id="morse-text"
            placeholder="Enter text (e.g., SOS, HELP)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isActive}
            maxLength={50}
          />
        </div>
      </div>

      <div 
        className={`w-full h-48 rounded-lg mb-6 transition-colors duration-100 flex items-center justify-center ${
          isFlashing ? 'bg-white' : 'bg-muted'
        }`}
      >
        {isFlashing && <Square className="h-16 w-16 text-black" />}
      </div>

      <Button
        onClick={() => setIsActive(!isActive)}
        variant={isActive ? 'destructive' : 'default'}
        className="w-full"
        size="lg"
        disabled={!text.trim()}
      >
        {isActive ? (
          <>
            <Square className="h-5 w-5 mr-2" />
            Stop Beacon
          </>
        ) : (
          <>
            <Radio className="h-5 w-5 mr-2" />
            Start Morse Code
          </>
        )}
      </Button>

      {!isActive && text && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Morse Code:</div>
          <div className="font-mono text-sm">
            {text.toUpperCase().split('').map(char => MORSE_CODE[char] || '?').join(' ')}
          </div>
        </div>
      )}
    </Card>
  );
};
