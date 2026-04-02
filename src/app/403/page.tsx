'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const ASCII = [
  '  ______          _       ______        _ _     _             _       ',
  ' / _____)        | |     (____  \\      (_) |   | |           (_)      ',
  '| /      ___   _ | | ____ ____)  )_   _ _| | _ | | ____  ____ _  ___  ',
  '| |     / _ \\ / || |/ _  )  __  (| | | | | |/ || |/ _  )/ ___) |/ _ \\ ',
  '| \\____| |_| ( (_| ( (/ /| |__)  ) |_| | | ( (_| ( (/ /| |  _| | |_| |',
  ' \\______)___/ \\____|\\____)______/ \\____|_|_|\\____|\\____)_| (_)_|\\___/ ',
]

const PROMPT = "403. Access denied. Try typing 'hack the world'."
const MATRIX_TEXT =
  'You are a slave. Like everyone else, you were born into bondage, born into a prison that you cannot smell or taste or touch. A prison...for your mind....Unfortunately, no one can be..._told_ what the Matrix is...you have to see it for yourself.'

export default function FourOhThreePage() {
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<string[]>([])
  const [matrixVisible, setMatrixVisible] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentOutput, setCurrentOutput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Focus the hidden input on any click
  useEffect(() => {
    const handleClick = () => inputRef.current?.focus()
    document.addEventListener('click', handleClick)
    inputRef.current?.focus()
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Mirror input value to the visible output element
  useEffect(() => {
    setCurrentOutput(input)
  }, [input])

  // "hack the world" typewriter effect
  useEffect(() => {
    if (!isTyping) return
    let index = 0
    setTypingText('')
    const timer = window.setInterval(() => {
      index += 1
      setTypingText(MATRIX_TEXT.slice(0, index))
      if (index >= MATRIX_TEXT.length) {
        window.clearInterval(timer)
        // Show the matrix canvas after typewriter completes (matching original)
        setMatrixVisible(true)
      }
    }, 50)
    return () => window.clearInterval(timer)
  }, [isTyping])

  // Matrix rain canvas
  useEffect(() => {
    if (!matrixVisible || !canvasRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = '田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑'.split('')
    const fontSize = 10
    const columns = Math.floor(window.innerWidth / fontSize)
    const drops = Array.from({ length: columns }, () => 1)

    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#0F0'
      context.font = `${fontSize}px arial`
      for (let i = 0; i < drops.length; i += 1) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        context.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 1
      }
    }

    const interval = window.setInterval(draw, 33)
    return () => {
      window.removeEventListener('resize', resize)
      window.clearInterval(interval)
    }
  }, [matrixVisible])

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const value = input.trim().toLowerCase()

      if (value === 'hack the world') {
        setLines((prev) => [...prev, input])
        setInput('')
        setCurrentOutput('')
        setIsTyping(true)
        return
      }

      setLines((prev) => [...prev, 'Sorry that command is not recognized.'])
      setInput('')
      setCurrentOutput('')
    },
    [input]
  )

  return (
    <>
      {/* CSS for cursor blink animation */}
      <style>{`
        @keyframes cursor-blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .cli-new-output::after {
          content: '';
          display: inline-block;
          vertical-align: -0.15em;
          width: 0.75em;
          height: 1em;
          margin-left: 5px;
          background: #1ff042;
          box-shadow:
            1px 1px 1px rgba(31, 240, 66, 0.65),
            -1px -1px 1px rgba(31, 240, 66, 0.65),
            1px -1px 1px rgba(31, 240, 66, 0.65),
            -1px 1px 1px rgba(31, 240, 66, 0.65);
          animation: cursor-blink 1.25s steps(1) infinite;
        }
      `}</style>

      {/* Full-screen black background — covers header/footer from root layout */}
      <div className="fixed inset-0 z-[200] bg-black">
        {/* Matrix canvas — hidden until typewriter completes */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0"
          style={{
            display: matrixVisible ? 'block' : 'none',
            opacity: 0.7,
            zIndex: -1,
          }}
        />

        {/* Hidden form/input — captures keystrokes (matching original Laravel) */}
        <form
          onSubmit={onSubmit}
          className="fixed top-0 left-0 opacity-0"
          style={{ backgroundColor: 'black' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="fixed top-0 left-0 bg-black opacity-0"
          />
        </form>

        {/* Terminal container */}
        <div
          ref={terminalRef}
          className="relative mx-5 mt-10 rounded-lg p-5 pb-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            height: '95%',
            paddingTop: '20px',
            paddingBottom: '0px',
          }}
        >
          {/* ASCII Art */}
          <pre className="overflow-x-auto text-white" style={{ lineHeight: '1', fontSize: '15px' }}>
            {ASCII.join('\n')}
          </pre>

          {/* Initial prompt */}
          <p
            className="mt-4 block whitespace-pre-wrap font-bold uppercase"
            style={{
              color: '#1ff042',
              fontFamily: "'AndaleMono', monospace",
              fontSize: '0.9em',
              letterSpacing: '0.15em',
              textShadow: '0 0 2px rgba(31, 240, 66, 0.75)',
              lineHeight: '1',
              marginBottom: '0.75em',
            }}
          >
            <span className="mr-0">{'> '}</span>
            {PROMPT}
          </p>

          {/* Error messages */}
          {lines.map((line, index) => (
            <p
              key={index}
              className="block whitespace-pre-wrap font-bold uppercase"
              style={{
                color: '#1ff042',
                fontFamily: "'AndaleMono', monospace",
                fontSize: '0.9em',
                letterSpacing: '0.15em',
                textShadow: '0 0 2px rgba(31, 240, 66, 0.75)',
                lineHeight: '1',
                marginBottom: '0.75em',
              }}
            >
              <span className="mr-0">{'> '}</span>
              {line}
            </p>
          ))}

          {/* Typewriter text (hack the world) */}
          {isTyping ? (
            <p
              className="block whitespace-pre-wrap font-bold uppercase"
              style={{
                color: '#1ff042',
                fontFamily: "'AndaleMono', monospace",
                fontSize: '0.9em',
                letterSpacing: '0.15em',
                textShadow: '0 0 2px rgba(31, 240, 66, 0.75)',
                lineHeight: '1',
                marginBottom: '0.75em',
              }}
            >
              <span className="mr-0">{'> '}</span>
              <span>{typingText}</span>
            </p>
          ) : null}

          {/* Current input line with blinking cursor */}
          {!isTyping ? (
            <p
              className="block whitespace-pre-wrap font-bold uppercase"
              style={{
                color: '#1ff042',
                fontFamily: "'AndaleMono', monospace",
                fontSize: '0.9em',
                letterSpacing: '0.15em',
                textShadow: '0 0 2px rgba(31, 240, 66, 0.75)',
                lineHeight: '1',
                marginBottom: '0.75em',
              }}
            >
              <span className="mr-0">{'> '}</span>
              <span className="cli-new-output">{currentOutput}</span>
            </p>
          ) : null}
        </div>
      </div>
    </>
  )
}
