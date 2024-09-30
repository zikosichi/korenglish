'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayIcon, PauseIcon, CheckIcon, VolumeIcon } from 'lucide-react'
import { words } from './wordData'

type Word = {
  id: number;
  english: string;
  georgian: string;
}

export function LanguageLearningAppComponent() {
  const [wordsToLearn, setWordsToLearn] = useState<Word[]>([])
  const [learnedWords, setLearnedWords] = useState<Word[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const stopPlayingRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const savedWordsToLearn = localStorage.getItem('wordsToLearn')
    const savedLearnedWords = localStorage.getItem('learnedWords')
    
    setWordsToLearn(savedWordsToLearn && JSON.parse(savedWordsToLearn).length > 0 
      ? JSON.parse(savedWordsToLearn) 
      : words)
    setLearnedWords(savedLearnedWords ? JSON.parse(savedLearnedWords) : [])
    
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

  const playAudio = (language: string, id: number, text: string) => {
    return new Promise<void>((resolve) => {
      if (language === 'en') {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.onend = () => resolve();
        window.speechSynthesis.speak(utterance);
      } else if (audioRef.current) {
        audioRef.current.src = `/audio/${language}/${id}.mp3`
        audioRef.current.onended = () => resolve()
        audioRef.current.play().catch(() => resolve())
      } else {
        resolve()
      }
    })
  }

  const playWords = async () => {
    setIsPlaying(true)
    stopPlayingRef.current = false
    while (!stopPlayingRef.current && wordsToLearn.length > 0) {
      for (let i = 0; i < Math.min(10, wordsToLearn.length); i++) {
        if (stopPlayingRef.current) break
        const wordIndex = (currentWordIndex + i) % wordsToLearn.length
        setCurrentWordIndex(wordIndex)
        await playAudio('en', wordsToLearn[wordIndex].id, wordsToLearn[wordIndex].english)
        if (stopPlayingRef.current) break
        await new Promise(resolve => setTimeout(resolve, 500))
        if (stopPlayingRef.current) break
        await playAudio('ka', wordsToLearn[wordIndex].id, wordsToLearn[wordIndex].georgian)
        if (stopPlayingRef.current) break
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      setCurrentWordIndex((prevIndex) => (prevIndex + 10) % wordsToLearn.length)
    }
    setIsPlaying(false)
  }

  const stopPlaying = () => {
    stopPlayingRef.current = true
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsPlaying(false)
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

    if (language === 'en') {
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else if (audioRef.current) {
      audioRef.current.src = `/audio/${language}/${id}.mp3`
      audioRef.current.play().catch(console.error)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 left-0 right-0 bg-background z-10 p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">KorEnglish</h1>
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
                  className={`flex items-center p-2 rounded-lg ${index === currentWordIndex ? 'bg-indigo-500/20 border-indigo-500 border-2' : ''}`}
                >
                  <Button className='p-2' variant="ghost" onClick={() => playIndividualWord(word.id, 'en')}>
                    {word.english}
                  </Button>
                  -
                  <Button className='p-2'variant="ghost" onClick={() => playIndividualWord(word.id, 'ka')}>
                    {word.georgian}
                  </Button>
                  <div className="flex items-center space-x-2 ml-auto">
                    <Button variant="outline" onClick={() => markAsLearned(word.id)}>
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
                  <span>{word.english} - {word.georgian}</span>
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