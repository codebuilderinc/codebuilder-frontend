'use client'

import { useEffect, useRef, useState } from 'react'

const ASCII_DATA = [
  { green: '   ______          __     ', white: ' ______        _ _     _             _      ' },
  { green: '  / _____)        | |    ', white: '(____  \\      (_) |   | |           (_)     ' },
  { green: ' | /      ___   _ | | ____ ', white: '____)  )_   _ _| | _ | | ____  ____ _  ___  ' },
  { green: ' | |     / _ \\ / || |/ _  )', white: '  __  (| | | | | |/ || |/ _  )/ ___) |/ _ \\ ' },
  { green: ' | \\____| |_| ( (_| ( (/ /', white: '| |__)  ) |_| | | ( (_| ( (/ /| |  _| | |_| |' },
  { green: '  \\______)___/ \\____|\\____)', white: '______/ \\____|_|_|\\____|\\____)_| (_)_|\\___/ ' },
]

const PROMPT = "404. The page you requested cannot be found right now. Try typing 'hack the world'."
const MATRIX_TEXT =
  'You are a slave. Like everyone else, you were born into bondage, born into a prison that you cannot smell or taste or touch. A prison...for your mind....Unfortunatly, no one can be..._told_ what the Matrix is...you have to see it for yourself.'

export function CliOverlay() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<string[]>([PROMPT])
  const [matrixEnabled, setMatrixEnabled] = useState(false)
  const [typingText, setTypingText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const openHandler = (event: Event) => {
      const custom = event as CustomEvent<{ open?: boolean }>
      setOpen(custom.detail?.open ?? true)
      setInput('')
      setLines([PROMPT])
      setTypingText('')
      setMatrixEnabled(false)
    }
    const closeHandler = () => setOpen(false)

    window.addEventListener('codebuilder:cli-overlay', openHandler as EventListener)
    window.addEventListener('codebuilder:cli-overlay-close', closeHandler)
    ;(window as Window & { CodeBuilderCliOverlay?: { open: () => void; close: () => void } }).CodeBuilderCliOverlay = {
      open: () => window.dispatchEvent(new CustomEvent('codebuilder:cli-overlay', { detail: { open: true } })),
      close: () => window.dispatchEvent(new Event('codebuilder:cli-overlay-close')),
    }

    return () => {
      window.removeEventListener('codebuilder:cli-overlay', openHandler as EventListener)
      window.removeEventListener('codebuilder:cli-overlay-close', closeHandler)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open || !matrixEnabled || !canvasRef.current) return
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
    const fontSize = 12
    const columns = Math.floor(window.innerWidth / fontSize)
    const drops = Array.from({ length: columns }, () => 1)

    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#0F0'
      context.font = `${fontSize}px monospace`
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
  }, [open, matrixEnabled])

  useEffect(() => {
    if (!matrixEnabled || !open) return
    let index = 0
    setTypingText('')
    const timer = window.setInterval(() => {
      index += 1
      setTypingText(MATRIX_TEXT.slice(0, index))
      if (index >= MATRIX_TEXT.length) {
        window.clearInterval(timer)
      }
    }, 28)
    return () => window.clearInterval(timer)
  }, [matrixEnabled, open])

  if (!open) return null

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = input.trim().toLowerCase()
    if (value === 'hack the world') {
      setLines((prev) => [...prev, input])
      setInput('')
      setMatrixEnabled(true)
      return
    }

    setLines((prev) => [...prev, input, 'Sorry that command is not recognized.'])
    setInput('')
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-[0.45]" />
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_3px)] opacity-[0.18]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">
        <div className="shadow-[0_0_0_1px_rgba(31,240,66,0.14),0_28px_80px_rgba(0,0,0,0.66)] relative w-full max-w-6xl rounded-[8px] border border-[rgba(31,240,66,0.18)] bg-[rgba(0,0,0,0.82)] px-5 py-6 text-[#1ff042] md:px-8 md:py-8">
          <div className="mb-4 flex items-center justify-between text-[12px] uppercase tracking-[0.18em] text-[#1ff042]/75">
            <span className="inline-flex items-center gap-3">
              <span className="inline-flex h-3 w-3 rounded-full bg-[#1ff042]" />
              <span>codebuilder terminal</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded border border-[#1ff042]/30 px-3 py-1 text-[#1ff042]/85 transition-colors hover:bg-[#1ff042]/10"
            >
              close
            </button>
          </div>

          <div className="overflow-x-auto font-mono text-[11px] leading-[1.1] md:text-[14px]">
            {ASCII_DATA.map((row, i) => (
              <div key={i} className="whitespace-pre">
                <span className="text-[#1ff042]">{row.green}</span>
                <span className="text-white">{row.white}</span>
              </div>
            ))}
            <div className="mt-2 text-center text-[10px] tracking-[0.8em] text-white/60">INCORPORATED</div>
          </div>

          <div className="mt-8 space-y-3 font-mono text-[14px] font-bold uppercase tracking-[0.14em] text-[#1ff042]">
            {lines.map((line, index) => (
              <p key={`${line}-${index}`} className="drop-shadow-[0_0_3px_rgba(31,240,66,0.7)]">
                &gt; {line}
              </p>
            ))}
            {matrixEnabled ? (
              <p className="drop-shadow-[0_0_3px_rgba(31,240,66,0.7)] text-white">
                {typingText}
                <span className="animate-pulse">_</span>
              </p>
            ) : null}
          </div>

          {!matrixEnabled && (
            <form onSubmit={onSubmit} className="mt-4">
              <label className="sr-only" htmlFor="cli-overlay-input">
                Terminal input
              </label>
              <div className="flex items-center gap-3 font-mono text-[14px] font-bold uppercase tracking-[0.14em] text-[#1ff042]">
                <span>&gt;</span>
                <input
                  id="cli-overlay-input"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[#1ff042] outline-none placeholder:text-[#1ff042]/40"
                  placeholder="type a command"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
