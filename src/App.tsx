import React, { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Label } from './components/ui/label'
import { Separator } from './components/ui/separator'
import { Badge } from './components/ui/badge'
import { Loader2, Download, Sparkles, Wand2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

function App() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [clothing, setClothing] = useState('white tank top and white miniskirt')
  const [pose, setPose] = useState('sitting on ground playing with toys')
  const [style, setStyle] = useState('photorealistic')
  const [expression, setExpression] = useState('calm and smiling')

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const generatePortrait = async () => {
    if (!user) return
    
    setGenerating(true)
    try {
      // Create detailed prompt
      const prompt = `A beautiful Japanese woman, 30 years old, ${expression}, ${pose}. She is wearing ${clothing} and white opaque pantyhose with flat mary jane shoes. ${style} portrait, peaceful and playful setting, soft lighting, high quality, detailed, professional photography`

      const { data } = await blink.ai.generateImage({
        prompt,
        size: '1024x1024',
        n: 1
      })

      if (data && data[0]?.url) {
        setGeneratedImage(data[0].url)
        toast.success('Portrait generated successfully!')
      }
    } catch (error) {
      console.error('Error generating portrait:', error)
      toast.error('Failed to generate portrait. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const downloadImage = async () => {
    if (!generatedImage) return
    
    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `japanese-woman-portrait-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Image downloaded!')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your portrait studio...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome to Portrait Studio</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Please sign in to start generating beautiful portraits</p>
            <Button onClick={() => blink.auth.login()}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Japanese Woman
              </span>
              <br />
              Portrait Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create stunning AI-generated portraits with customizable poses, clothing, and expressions
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  Customize Your Portrait
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="clothing">Clothing Style</Label>
                  <Select value={clothing} onValueChange={setClothing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clothing style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white tank top and white miniskirt">White Tank Top & Miniskirt</SelectItem>
                      <SelectItem value="casual summer dress">Casual Summer Dress</SelectItem>
                      <SelectItem value="elegant blouse and skirt">Elegant Blouse & Skirt</SelectItem>
                      <SelectItem value="cute sweater and pleated skirt">Cute Sweater & Pleated Skirt</SelectItem>
                      <SelectItem value="traditional kimono">Traditional Kimono</SelectItem>
                      <SelectItem value="modern school uniform">Modern School Uniform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pose">Pose & Setting</Label>
                  <Select value={pose} onValueChange={setPose}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sitting on ground playing with toys">Playing with Toys on Ground</SelectItem>
                      <SelectItem value="sitting in a peaceful garden">Sitting in Peaceful Garden</SelectItem>
                      <SelectItem value="reading a book under cherry blossoms">Reading Under Cherry Blossoms</SelectItem>
                      <SelectItem value="having a picnic in the park">Having a Picnic</SelectItem>
                      <SelectItem value="feeding birds by a pond">Feeding Birds by Pond</SelectItem>
                      <SelectItem value="meditating in a zen garden">Meditating in Zen Garden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expression">Expression</Label>
                  <Select value={expression} onValueChange={setExpression}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expression" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calm and smiling">Calm & Smiling</SelectItem>
                      <SelectItem value="peaceful and serene">Peaceful & Serene</SelectItem>
                      <SelectItem value="joyful and playful">Joyful & Playful</SelectItem>
                      <SelectItem value="gentle and thoughtful">Gentle & Thoughtful</SelectItem>
                      <SelectItem value="cheerful and bright">Cheerful & Bright</SelectItem>
                      <SelectItem value="content and relaxed">Content & Relaxed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Art Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select art style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photorealistic">Photorealistic</SelectItem>
                      <SelectItem value="anime-style">Anime Style</SelectItem>
                      <SelectItem value="soft portrait painting">Soft Portrait Painting</SelectItem>
                      <SelectItem value="cinematic photography">Cinematic Photography</SelectItem>
                      <SelectItem value="watercolor illustration">Watercolor Illustration</SelectItem>
                      <SelectItem value="studio portrait">Studio Portrait</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <Button 
                  onClick={generatePortrait}
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating Portrait...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Portrait
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Image Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Portrait</span>
                  {generatedImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadImage}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    {generating ? (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100"
                      >
                        <div className="text-center">
                          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                          <p className="text-purple-600 font-medium">Creating your portrait...</p>
                          <p className="text-sm text-gray-600 mt-2">This may take a moment</p>
                        </div>
                      </motion.div>
                    ) : generatedImage ? (
                      <motion.img
                        key="generated"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        src={generatedImage}
                        alt="Generated Japanese Woman Portrait"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
                      >
                        <div className="text-center">
                          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">Your portrait will appear here</p>
                          <p className="text-sm text-gray-500 mt-2">Customize the options and click generate</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="secondary">AI-Powered</Badge>
            <Badge variant="secondary">High Quality</Badge>
            <Badge variant="secondary">Customizable</Badge>
            <Badge variant="secondary">Instant Download</Badge>
          </div>
          <p className="text-sm text-gray-500">
            Welcome, {user.email} • Generate beautiful portraits with AI
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default App