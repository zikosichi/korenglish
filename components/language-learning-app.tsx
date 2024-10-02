'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button, buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayIcon, PauseIcon, CheckIcon, VolumeIcon, Link } from 'lucide-react'
import { words } from './wordData'
import NextLink from 'next/link'

type Word = {
  id: number;
  english: string;
  russian: string;
}

export function LanguageLearningAppComponent() {
  const [wordsToLearn, setWordsToLearn] = useState<Word[]>([])
  const [learnedWords, setLearnedWords] = useState<Word[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const stopPlayingRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const currentAppVersion = '1.1.0'; // Your new app version
    const storedVersion = localStorage.getItem('appVersion');

    if (storedVersion !== currentAppVersion) {
      // If versions are different, clear the local storage
      localStorage.clear();
      // Update the stored version to the current one
      localStorage.setItem('appVersion', currentAppVersion);
      
      // Set initial state to default values
      setWordsToLearn(words)
      setLearnedWords([])
    } else {
      // Load data from local storage as before
      const savedWordsToLearn = localStorage.getItem('wordsToLearn')
      const savedLearnedWords = localStorage.getItem('learnedWords')
      
      setWordsToLearn(savedWordsToLearn && JSON.parse(savedWordsToLearn).length > 0 
        ? JSON.parse(savedWordsToLearn) 
        : words)
      setLearnedWords(savedLearnedWords ? JSON.parse(savedLearnedWords) : [])
    }

    audioRef.current = new Audio()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (wordsToLearn.length > 0 || learnedWords.length > 0) {
      localStorage.setItem('wordsToLearn', JSON.stringify(wordsToLearn))
      localStorage.setItem('learnedWords', JSON.stringify(learnedWords))
    }
  }, [wordsToLearn, learnedWords])

  // Add this new effect
  useEffect(() => {
    if (!isPlaying) {
      setCurrentWordIndex(-1);
    }
  }, [isPlaying]);

  const playAudio = (text: string, language: string) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'ru-RU';
      
      const voicesLoaded = () => {
        const voices = window.speechSynthesis.getVoices();
        if (language === 'en') {
          const femaleEnglishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Female')
          );
          if (femaleEnglishVoice) {
            utterance.voice = femaleEnglishVoice; 
          }
        }
        utterance.onend = resolve;
        speechSynthesis.speak(utterance);
      };

      if (speechSynthesis.getVoices().length > 0) {
        voicesLoaded();
      } else {
        speechSynthesis.onvoiceschanged = voicesLoaded;
      }
    });
  };

  const playWords = async () => {
    setIsPlaying(true)
    stopPlayingRef.current = false

    // Ensure voices are loaded before starting
    await new Promise<void>((resolve) => {
      if (speechSynthesis.getVoices().length > 0) {
        resolve();
      } else {
        speechSynthesis.onvoiceschanged = () => resolve();
      }
    });

    for (let wordIndex = 0; wordIndex < wordsToLearn.length; wordIndex++) {
      if (stopPlayingRef.current) break;
      setCurrentWordIndex(wordIndex);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (stopPlayingRef.current) break;
      await playAudio(wordsToLearn[wordIndex].english, 'en');
      if (stopPlayingRef.current) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopPlayingRef.current) break;
      await playAudio(wordsToLearn[wordIndex].russian, 'ru');
      if (stopPlayingRef.current) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsPlaying(false)
  }

  const stopPlaying = () => {
    stopPlayingRef.current = true
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsPlaying(false)
    // The currentWordIndex will be reset by the new effect
  }

  const markAsLearned = (id: number) => {
    const learnedWord = wordsToLearn.find(word => word.id === id)
    if (learnedWord) {
      setLearnedWords(prev => [...prev, learnedWord])
      setWordsToLearn(prev => prev.filter(word => word.id !== id))
    }
  }

  const playIndividualWord = (id: number, language: string) => {
    const word = [...wordsToLearn, ...learnedWords].find(w => w.id === id);
    if (!word) return;

    const text = language === 'en' ? word.english : word.russian;
    playAudio(text, language);
  }

  const playWordOnce = async (word: Word) => {
    if (isPlaying) return; // Don't interrupt if already playing
    setIsPlaying(true);
    setCurrentWordIndex(wordsToLearn.findIndex(w => w.id === word.id));
    
    await playAudio(word.english, 'en');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await playAudio(word.russian, 'ru');
    
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 left-0 right-0 bg-background z-10 p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">KorEnglish</h1>
            
            <div className="flex space-x-2">
              <NextLink href="/add-word" className={buttonVariants({ variant: "outline" })}>
                <Link className="w-4 h-4 mr-2" />
                Add Word
              </NextLink>
              <Button onClick={isPlaying ? stopPlaying : playWords}>
                {isPlaying ? (
                  <>
                    <PauseIcon className="w-4 h-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Play Top 10 Words
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-auto mt-24 container mx-auto p-4">
        <Tabs defaultValue="to-learn" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="to-learn">Words to Learn ({wordsToLearn.length})</TabsTrigger>
            <TabsTrigger value="learned">Learned Words ({learnedWords.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="to-learn">
            <ul className="space-y-2">
              {wordsToLearn.map((word, index) => (
                <li 
                  key={word.id} 
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${index === currentWordIndex ? 'bg-indigo-500/20 border-indigo-500 border-2' : 'hover:bg-indigo-500/10 border-2 border-transparent'}`}
                  onClick={() => playWordOnce(word)}
                >
                  {word.english} - {word.russian}
                  <div className="flex items-center space-x-2 ml-auto">
                    <Button variant="outline" onClick={(e) => { e.stopPropagation(); markAsLearned(word.id); }}>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      I learned it
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="learned">
            <ul className="space-y-2">
              {learnedWords.map((word) => (
                <li key={word.id} className="flex justify-between items-center p-2">
                  <span>{word.english} - {word.russian}</span>
                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => playIndividualWord(word.id, 'en')}>
                      <VolumeIcon className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => playIndividualWord(word.id, 'ka')}>
                      <VolumeIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}