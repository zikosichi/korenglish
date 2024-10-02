'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type Word = {
  id: number;
  english: string;
  russian: string;
}

export function AddWordComponent() {
  const [english, setEnglish] = useState('')
  const [russian, setRussian] = useState('')
  const [words, setWords] = useState<Word[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const savedWords = localStorage.getItem('wordsToLearn')
    if (savedWords) {
      setWords(JSON.parse(savedWords))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (english.trim() && russian.trim()) {
      const newWord: Word = {
        id: words.length > 0 ? Math.max(...words.map(w => w.id)) + 1 : 1,
        english: english.trim(),
        russian: russian.trim()
      }
      const updatedWords = [newWord, ...words]
      setWords(updatedWords)
      localStorage.setItem('wordsToLearn', JSON.stringify(updatedWords))
      setEnglish('')
      setRussian('')
      setMessage(`"${english}" - "${russian}" has been added to your word list.`)
      setTimeout(() => setMessage(''), 3000) // Clear message after 3 seconds
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Add New Word</h1>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="english">English Word</Label>
          <Input
            id="english"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="Enter English word"
            required
          />
        </div>
        <div>
          <Label htmlFor="russian">Russian Translation</Label>
          <Input
            id="russian"
            value={russian}
            onChange={(e) => setRussian(e.target.value)}
            placeholder="Enter Russian translation"
            required
          />
        </div>
        <Button type="submit">Add Word</Button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recently Added Words</h2>
        <ul className="space-y-2">
          {words.slice(0, 5).map((word) => (
            <li key={word.id} className="flex justify-between items-center p-2 bg-secondary rounded">
              <span>{word.english} - {word.russian}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}