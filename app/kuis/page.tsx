"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Brain, Trophy, CheckCircle, XCircle, Clock, AlertCircle, Gamepad2, RefreshCw } from "lucide-react"
import { useState, useEffect, useRef } from "react"

// Supabase Configuration - CORRECTED
const SUPABASE_URL = 'https://cpdauuxizabrvngkrdud.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZGF1dXhpemFicnZuZ2tyZHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NTkwMjUsImV4cCI6MjA4MjMzNTAyNX0.9qU-oPst7QdZNWdT8hQke5pVGc2XvMWImI_tpeClX5A'

// Custom Hook for Scroll Animation
function useScrollAnimation() {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [])

  return { elementRef, isVisible }
}

// Animated Section Component
function AnimatedSection({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { elementRef, isVisible } = useScrollAnimation()

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

// Chess Game Component
function ChessGame({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<string[][]>([])
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [validMoves, setValidMoves] = useState<[number, number][]>([])
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white')
  const [gameStatus, setGameStatus] = useState<'playing' | 'checkmate' | 'stalemate'>('playing')
  const [winner, setWinner] = useState<'white' | 'black' | null>(null)
  const [difficulty, setDifficulty] = useState<number>(3)
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [isInCheck, setIsInCheck] = useState(false)

  useEffect(() => {
    initializeBoard()
  }, [])

  const initializeBoard = () => {
    const newBoard = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ]
    setBoard(newBoard)
    setCurrentPlayer('white')
    setGameStatus('playing')
    setWinner(null)
    setSelectedSquare(null)
    setValidMoves([])
    setMoveHistory([])
    setIsInCheck(false)
  }

  const isValidMove = (board: string[][], from: [number, number], to: [number, number], piece: string): boolean => {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false
    
    const targetPiece = board[toRow][toCol]
    if (targetPiece && isWhitePiece(piece) === isWhitePiece(targetPiece)) return false

    const rowDiff = toRow - fromRow
    const colDiff = toCol - fromCol

    const pieceLower = piece.toLowerCase()

    if (pieceLower === 'p') {
      const direction = isWhitePiece(piece) ? -1 : 1
      const startRow = isWhitePiece(piece) ? 6 : 1
      
      if (colDiff === 0 && !targetPiece) {
        if (rowDiff === direction) return true
        if (fromRow === startRow && rowDiff === 2 * direction && !board[fromRow + direction][fromCol]) return true
      }
      
      if (Math.abs(colDiff) === 1 && rowDiff === direction && targetPiece) return true
      
      return false
    }

    if (pieceLower === 'r') {
      if (rowDiff !== 0 && colDiff !== 0) return false
      return isPathClear(board, from, to)
    }

    if (pieceLower === 'n') {
      return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || 
             (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
    }

    if (pieceLower === 'b') {
      if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false
      return isPathClear(board, from, to)
    }

    if (pieceLower === 'q') {
      if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) return false
      return isPathClear(board, from, to)
    }

    if (pieceLower === 'k') {
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1
    }

    return false
  }

  const isPathClear = (board: string[][], from: [number, number], to: [number, number]): boolean => {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to
    
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0
    
    let currentRow = fromRow + rowStep
    let currentCol = fromCol + colStep
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol]) return false
      currentRow += rowStep
      currentCol += colStep
    }
    
    return true
  }

  const isWhitePiece = (piece: string): boolean => {
    return piece === piece.toUpperCase()
  }

  const isKingInCheck = (board: string[][], player: 'white' | 'black'): boolean => {
    let kingPos: [number, number] | null = null
    const kingPiece = player === 'white' ? 'K' : 'k'
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === kingPiece) {
          kingPos = [row, col]
          break
        }
      }
      if (kingPos) break
    }
    
    if (!kingPos) return false
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (!piece) continue
        
        const isPieceWhite = isWhitePiece(piece)
        const isPlayerWhite = player === 'white'
        
        if (isPieceWhite !== isPlayerWhite) {
          if (isValidMove(board, [row, col], kingPos, piece)) {
            return true
          }
        }
      }
    }
    
    return false
  }

  const wouldBeInCheck = (board: string[][], from: [number, number], to: [number, number], player: 'white' | 'black'): boolean => {
    const testBoard = board.map(row => [...row])
    const piece = testBoard[from[0]][from[1]]
    testBoard[to[0]][to[1]] = piece
    testBoard[from[0]][from[1]] = ''
    
    return isKingInCheck(testBoard, player)
  }

  const hasValidMoves = (board: string[][], player: 'white' | 'black'): boolean => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (!piece) continue
        
        const isPieceWhite = isWhitePiece(piece)
        const isPlayerWhite = player === 'white'
        
        if (isPieceWhite === isPlayerWhite) {
          const moves = getValidMovesWithCheckValidation(row, col, board, player)
          if (moves.length > 0) return true
        }
      }
    }
    return false
  }

  const getValidMovesWithCheckValidation = (row: number, col: number, boardState: string[][], player: 'white' | 'black'): [number, number][] => {
    const piece = boardState[row][col]
    if (!piece) return []
    
    const moves: [number, number][] = []
    
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(boardState, [row, col], [r, c], piece)) {
          if (!wouldBeInCheck(boardState, [row, col], [r, c], player)) {
            moves.push([r, c])
          }
        }
      }
    }
    
    return moves
  }

  const getValidMoves = (row: number, col: number, boardState?: string[][]): [number, number][] => {
    const currentBoard = boardState || board
    return getValidMovesWithCheckValidation(row, col, currentBoard, currentPlayer)
  }

  const isCheckmate = (board: string[][], player: 'white' | 'black'): boolean => {
    return isKingInCheck(board, player) && !hasValidMoves(board, player)
  }

  const isStalemate = (board: string[][], player: 'white' | 'black'): boolean => {
    return !isKingInCheck(board, player) && !hasValidMoves(board, player)
  }

  const handleSquareClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || currentPlayer === 'black') return

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare
      const isValid = validMoves.some(([r, c]) => r === row && c === col)
      
      if (isValid) {
        makeMove(selectedRow, selectedCol, row, col, false)
      } else {
        const piece = board[row][col]
        if (piece && isWhitePiece(piece) && currentPlayer === 'white') {
          setSelectedSquare([row, col])
          setValidMoves(getValidMoves(row, col))
        } else {
          setSelectedSquare(null)
          setValidMoves([])
        }
      }
    } else {
      const piece = board[row][col]
      if (piece && isWhitePiece(piece) && currentPlayer === 'white') {
        setSelectedSquare([row, col])
        setValidMoves(getValidMoves(row, col))
      }
    }
  }

  const makeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, isAIMove: boolean = false) => {
    const newBoard = board.map(row => [...row])
    const piece = newBoard[fromRow][fromCol]
    
    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = ''
    
    const pieceName = getPieceName(piece)
    const move = `${pieceName} ${String.fromCharCode(65 + fromCol)}${8 - fromRow} → ${String.fromCharCode(65 + toCol)}${8 - toRow}`
    setMoveHistory(prev => [...prev, move])
    
    setSelectedSquare(null)
    setValidMoves([])
    
    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white'
    
    const inCheck = isKingInCheck(newBoard, nextPlayer)
    setIsInCheck(inCheck)
    
    if (isCheckmate(newBoard, nextPlayer)) {
      setBoard(newBoard)
      setCurrentPlayer(nextPlayer)
      setGameStatus('checkmate')
      setWinner(currentPlayer)
      return
    } else if (isStalemate(newBoard, nextPlayer)) {
      setBoard(newBoard)
      setCurrentPlayer(nextPlayer)
      setGameStatus('stalemate')
      return
    }
    
    setBoard(newBoard)
    setCurrentPlayer(nextPlayer)
    
    if (nextPlayer === 'black' && !isAIMove && gameStatus === 'playing') {
      setTimeout(() => makeAIMove(newBoard), 500)
    }
  }

  const makeAIMove = (currentBoard: string[][]) => {
    const bestMove = findBestMove(currentBoard, difficulty)
    if (bestMove) {
      const { from, to } = bestMove
      const aiBoard = currentBoard.map(row => [...row])
      const piece = aiBoard[from[0]][from[1]]
      
      aiBoard[to[0]][to[1]] = piece
      aiBoard[from[0]][from[1]] = ''
      
      const pieceName = getPieceName(piece)
      const move = `${pieceName} ${String.fromCharCode(65 + from[1])}${8 - from[0]} → ${String.fromCharCode(65 + to[1])}${8 - to[0]}`
      
      setMoveHistory(prev => [...prev, move])
      
      const inCheck = isKingInCheck(aiBoard, 'white')
      setIsInCheck(inCheck)
      
      setBoard(aiBoard)
      setCurrentPlayer('white')
      
      if (isCheckmate(aiBoard, 'white')) {
        setGameStatus('checkmate')
        setWinner('black')
      } else if (isStalemate(aiBoard, 'white')) {
        setGameStatus('stalemate')
      }
    }
  }

  const findBestMove = (boardState: string[][], depth: number) => {
    let bestScore = -Infinity
    let bestMove = null

    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = boardState[fromRow][fromCol]
        if (!piece || isWhitePiece(piece)) continue

        const moves = getValidMovesWithCheckValidation(fromRow, fromCol, boardState, 'black')
        for (const [toRow, toCol] of moves) {
          const newBoard = boardState.map(row => [...row])
          newBoard[toRow][toCol] = piece
          newBoard[fromRow][fromCol] = ''

          const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false)
          
          if (score > bestScore) {
            bestScore = score
            bestMove = { from: [fromRow, fromCol], to: [toRow, toCol] }
          }
        }
      }
    }

    return bestMove
  }

  const minimax = (boardState: string[][], depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
    if (depth === 0) {
      return evaluateBoard(boardState)
    }

    if (isMaximizing) {
      let maxScore = -Infinity
      
      for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
          const piece = boardState[fromRow][fromCol]
          if (!piece || isWhitePiece(piece)) continue

          const moves = getValidMovesWithCheckValidation(fromRow, fromCol, boardState, 'black')
          for (const [toRow, toCol] of moves) {
            const newBoard = boardState.map(row => [...row])
            newBoard[toRow][toCol] = piece
            newBoard[fromRow][fromCol] = ''

            const score = minimax(newBoard, depth - 1, alpha, beta, false)
            maxScore = Math.max(maxScore, score)
            alpha = Math.max(alpha, score)
            if (beta <= alpha) break
          }
        }
      }
      return maxScore
    } else {
      let minScore = Infinity
      
      for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
          const piece = boardState[fromRow][fromCol]
          if (!piece || !isWhitePiece(piece)) continue

          const moves = getValidMovesWithCheckValidation(fromRow, fromCol, boardState, 'white')
          for (const [toRow, toCol] of moves) {
            const newBoard = boardState.map(row => [...row])
            newBoard[toRow][toCol] = piece
            newBoard[fromRow][fromCol] = ''

            const score = minimax(newBoard, depth - 1, alpha, beta, true)
            minScore = Math.min(minScore, score)
            beta = Math.min(beta, score)
            if (beta <= alpha) break
          }
        }
      }
      return minScore
    }
  }

  const evaluateBoard = (board: string[][]): number => {
    const pieceValues: { [key: string]: number } = {
      'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900,
      'P': -10, 'N': -30, 'B': -30, 'R': -50, 'Q': -90, 'K': -900
    }

    let score = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece) {
          score += pieceValues[piece] || 0
        }
      }
    }
    return score
  }

  const getPieceName = (piece: string): string => {
    const names: { [key: string]: string } = {
      'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
      'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
    }
    return names[piece] || piece
  }

  const getPieceSymbol = (piece: string): string => {
    return getPieceName(piece)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Gamepad2 className="h-6 w-6" />
                Catur Melawan AI
              </CardTitle>
              <CardDescription>Asah strategi dan logikamu!</CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Tutup Game
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="inline-block border-4 border-primary rounded-lg overflow-hidden shadow-xl">
                {board.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((piece, colIndex) => {
                      const isLight = (rowIndex + colIndex) % 2 === 0
                      const isSelected = selectedSquare?.[0] === rowIndex && selectedSquare?.[1] === colIndex
                      const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex)
                      
                      return (
                        <div
                          key={colIndex}
                          onClick={() => handleSquareClick(rowIndex, colIndex)}
                          className={`
                            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                            flex items-center justify-center 
                            text-2xl sm:text-3xl md:text-3xl lg:text-4xl 
                            cursor-pointer transition-all
                            ${isLight ? 'bg-amber-200' : 'bg-amber-700'}
                            ${isSelected ? 'ring-2 sm:ring-4 ring-blue-500' : ''}
                            ${isValidMove ? 'ring-2 sm:ring-4 ring-green-400' : ''}
                            hover:brightness-110
                          `}
                        >
                          {piece && getPieceSymbol(piece)}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Game</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Giliran</p>
                    <Badge variant={currentPlayer === 'white' ? 'default' : 'secondary'} className="text-base">
                      {currentPlayer === 'white' ? '♔ Putih (Kamu)' : '♚ Hitam (AI)'}
                    </Badge>
                  </div>

                  {isInCheck && gameStatus === 'playing' && (
                    <div className="p-4 rounded-lg bg-red-50 border-2 border-red-500 animate-pulse">
                      <p className="font-bold text-red-700 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        SKAK! Raja Terancam!
                      </p>
                    </div>
                  )}

                  {gameStatus !== 'playing' && (
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent">
                      <p className="font-semibold text-accent">
                        {gameStatus === 'checkmate' 
                          ? `SKAKMAT! ${winner === 'white' ? 'Kamu Menang!' : 'AI Menang!'} 🎉`
                          : 'STALEMATE! Seri!'}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Tingkat Kesulitan AI
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(Number(e.target.value))}
                      className="w-full p-2 rounded-md border bg-background"
                      disabled={gameStatus !== 'playing'}
                    >
                      <option value={1}>Mudah</option>
                      <option value={2}>Normal</option>
                      <option value={3}>Sulit</option>
                      <option value={4}>Expert</option>
                    </select>
                  </div>

                  <Button onClick={initializeBoard} variant="outline" className="w-full">
                    Mulai Ulang
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Riwayat Gerakan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-48 overflow-y-auto space-y-1 text-sm">
                    {moveHistory.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Belum ada gerakan
                      </p>
                    ) : (
                      moveHistory.map((move, idx) => (
                        <div key={idx} className="p-2 rounded bg-muted/50">
                          {idx + 1}. {move}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Quiz Component
export default function KuisPage() {
  const [showChess, setShowChess] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Array<{ questionId: string; isCorrect: boolean; selectedAnswer: string }>
  >([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(750)
  const [timerActive, setTimerActive] = useState(false)

  // Fetch questions from Supabase
  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching questions from Supabase...')
      console.log('URL:', SUPABASE_URL)
      
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/quiz_questions?select=*`,
        {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        }
      )

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Data received:', data.length, 'questions')
      
      if (!Array.isArray(data)) {
        throw new Error('Data format tidak valid')
      }

      if (data.length === 0) {
        setError('Belum ada pertanyaan di database')
        setQuestions([])
      } else {
        setQuestions(data)
        console.log(`✅ Loaded ${data.length} questions successfully!`)
      }
      
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError(err.message || 'Gagal mengambil data dari database')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()

    // Auto-refresh setiap 30 detik untuk mendapatkan pertanyaan terbaru
    const interval = setInterval(() => {
      if (!quizStarted) {
        fetchQuestions()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [quizStarted])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeRemaining])

  const handleTimeUp = () => {
    setShowResult(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeRemaining > 300) return "text-primary"
    if (timeRemaining > 120) return "text-yellow-600"
    return "text-destructive"
  }

  const getProgressColor = () => {
    const percentage = (timeRemaining / 750) * 100
    if (percentage > 40) return ""
    if (percentage > 16) return "bg-yellow-500"
    return "bg-destructive"
  }

  const startQuiz = () => {
    if (questions.length === 0) {
      setError('Tidak ada pertanyaan yang tersedia')
      return
    }

    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    setScore(0)
    setAnsweredQuestions([])
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeRemaining(750)
    setTimerActive(true)
    setShowChess(false)
  }

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNext = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct_answer

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionId: currentQuestion.id,
        isCorrect,
        selectedAnswer,
      },
    ])

    if (isCorrect) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
      setTimerActive(false)
    }
  }

  if (showChess) {
    return <ChessGame onClose={() => setShowChess(false)} />
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-lg text-muted-foreground">Sedang memuat pertanyaan...</p>
                  <p className="text-sm text-muted-foreground">Mohon tunggu sebentar...</p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  // Error state
  if (error && questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Terjadi Kesalahan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm font-mono text-destructive">{error}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Kemungkinan penyebab:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Koneksi internet bermasalah</li>
                    <li>RLS (Row Level Security) aktif tanpa policy</li>
                    <li>Belum ada data di tabel quiz_questions</li>
                  </ul>
                </div>
                <Button 
                  onClick={fetchQuestions} 
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <AnimatedSection className="text-center mb-12 space-y-4">
          <Badge className="bg-accent text-accent-foreground mb-4">Kuis Interaktif • Realtime Database</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Kuis Pengetahuan UGM</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Uji pemahamanmu tentang Universitas Gadjah Mada! Jawab pertanyaan seputar sejarah, fakultas, wawasan, dan kehidupan kampus di UGM.
          </p>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-6 mb-12">
          <AnimatedSection delay={100}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{questions.length}</p>
                    <p className="text-sm text-muted-foreground">Pertanyaan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">12:30</p>
                    <p className="text-sm text-muted-foreground">Menit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">Multiple</p>
                    <p className="text-sm text-muted-foreground">Kategori</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">Sertifikat</p>
                    <p className="text-sm text-muted-foreground">Nilai Tertinggi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-6">
          <AnimatedSection delay={500}>
            <Card>
              <CardHeader>
                <CardTitle>Siap Memulai Kuis?</CardTitle>
                <CardDescription>
                  Kuis ini terdiri dari {questions.length} pertanyaan seputar UGM dan wawasan lain dengan waktu 12 menit 30 detik.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-left">
                      <p className="font-semibold text-green-800 mb-1">Connected! ✅</p>
                      <p className="text-green-700">{questions.length} pertanyaan berhasil dimuat, please prepare your self, semangat !!!</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-left">
                      <p className="font-semibold text-orange-800 mb-1">Perhatian:</p>
                      <ul className="space-y-1 text-orange-700">
                        <li>• Timer akan dimulai saat kamu klik tombol di bawah</li>
                        <li>• Kuis akan otomatis selesai jika waktu habis</li>
                        <li>• Pastikan koneksi internet stabil</li>
                        <li>• Pertanyaan diambil langsung dari database realtime</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  onClick={startQuiz} 
                  className="w-full"
                  disabled={questions.length === 0}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Mulai Kuis Sekarang
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={600}>
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center">
                  <Gamepad2 className="h-6 w-6" />
                  Butuh Istirahat?
                </CardTitle>
                <CardDescription>
                  Main catur melawan AI untuk refresh otak sebelum maupun sesudah kuis!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setShowChess(true)} 
                  className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                >
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Main Catur vs AI
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  if (showResult) {
    const percentage = (score / questions.length) * 100
    let resultMessage = ""
    let resultColor = ""

    if (percentage === 100) {
      resultMessage = "Sempurna! Kamu Master tentang UGM! Siap Jadi Mahasiswa UGM 2026"
      resultColor = "text-accent"
    } else if (percentage >= 80) {
      resultMessage = "Luar Biasa! Kamu sangat paham tentang UGM!"
      resultColor = "text-primary"
    } else if (percentage >= 60) {
      resultMessage = "Bagus! Kamu cukup tahu tentang UGM!"
      resultColor = "text-primary"
    } else {
      resultMessage = "Tetap semangat! Pelajari lebih banyak tentang UGM!"
      resultColor = "text-muted-foreground"
    }

    const timeTaken = 750 - timeRemaining
    const timeTakenMinutes = Math.floor(timeTaken / 60)
    const timeTakenSeconds = timeTaken % 60

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <AnimatedSection>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                  <Trophy className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-3xl">Kuis Selesai!</CardTitle>
                <CardDescription className={`text-xl font-semibold ${resultColor}`}>{resultMessage}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary mb-2">
                    {score}/{questions.length}
                  </p>
                  <p className="text-muted-foreground">Jawaban Benar</p>
                  <p className="text-2xl font-semibold text-accent mt-4">{percentage.toFixed(0)}%</p>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Waktu yang digunakan: {timeTakenMinutes}m {timeTakenSeconds}s</span>
                  </div>
                </div>

                {percentage === 100 && (
                  <AnimatedSection delay={200}>
                    <div className="border-2 border-accent rounded-lg p-6 bg-accent/5">
                      <div className="text-center space-y-4">
                        <Award className="h-16 w-16 text-accent mx-auto" />
                        <h3 className="text-2xl font-bold text-accent">🎉 Selamat! 🎉</h3>
                        <p className="text-lg font-semibold">Kamu Mendapatkan Sertifikat!</p>
                        <p className="text-sm text-muted-foreground">
                          Nilai sempurna menunjukkan kamu sangat paham tentang UGM dan siap jadi mahasiswa UGM tahun ini !
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {percentage === 100 && (
                  <AnimatedSection delay={300}>
                    <div className="space-y-6">
                      <div 
                        id="certificate" 
                        className="border-8 border-amber-600 rounded-lg p-12 bg-gradient-to-br from-amber-50 to-yellow-50 relative overflow-hidden"
                        style={{ minHeight: '500px' }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full opacity-5">
                          <div className="absolute top-4 left-4 text-8xl">🏆</div>
                          <div className="absolute top-4 right-4 text-8xl">🎓</div>
                          <div className="absolute bottom-4 left-4 text-8xl">⭐</div>
                          <div className="absolute bottom-4 right-4 text-8xl">📚</div>
                        </div>
                        
                        <div className="relative z-10 text-center space-y-6">
                          <div className="space-y-2">
                            <Trophy className="h-20 w-20 text-amber-600 mx-auto mb-4" />
                            <h2 className="text-5xl font-bold text-amber-800" style={{ fontFamily: 'serif' }}>
                              SERTIFIKAT
                            </h2>
                            <p className="text-xl text-amber-700">Penghargaan Kuis</p>
                          </div>

                          <div className="h-1 w-48 bg-amber-600 mx-auto"></div>

                          <div className="space-y-4 py-6">
                            <p className="text-lg text-gray-700">Diberikan kepada:</p>
                            <p className="text-4xl font-bold text-amber-900" style={{ fontFamily: 'serif' }}>
                              {'Calon Gamada 2026!'}
                            </p>
                          </div>

                          <div className="space-y-3 bg-white/50 rounded-lg p-6 mx-auto max-w-md">
                            <p className="text-gray-700 text-sm">
                              Telah berhasil menyelesaikan
                            </p>
                            <p className="text-2xl font-bold text-primary">
                              Kuis Pengetahuan UGM
                            </p>
                            <p className="text-gray-700 text-sm">
                              dengan nilai sempurna
                            </p>
                            <div className="flex items-center justify-center gap-3 pt-2">
                              <div className="text-center">
                                <p className="text-5xl font-bold text-accent">100</p>
                                <p className="text-sm text-gray-600">Poin</p>
                              </div>
                              <div className="text-4xl text-amber-500">★</div>
                              <div className="text-center">
                                <p className="text-3xl font-bold text-primary">{score}/{questions.length}</p>
                                <p className="text-sm text-gray-600">Benar</p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-6">
                            <p className="text-sm text-gray-600">
                              Diterbitkan pada {new Date().toLocaleDateString('id-ID', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>

                          <div className="flex justify-center items-center gap-12 pt-6">
                            <div className="text-center">
                              <div className="h-20 flex items-end justify-center mb-2">
                                <div className="h-0.5 w-32 bg-gray-400"></div>
                              </div>
                              <p className="text-sm font-semibold text-gray-700">Gamagma</p>
                              <p className="text-xs text-gray-500">Kuis UGM</p>
                            </div>
                          </div>

                          <div className="pt-4">
                            <div className="inline-block px-6 py-2 border-2 border-amber-600 rounded-full">
                              <p className="text-sm font-bold text-amber-800">
                                🏆 PERFECT SCORE ACHIEVEMENT 🏆
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-center">
                        <Button 
                          onClick={() => {
                            const cert = document.getElementById('certificate')
                            if (cert) {
                              const printWindow = window.open('', '', 'width=800,height=600')
                              if (printWindow) {
                                printWindow.document.write(`
                                  <!DOCTYPE html>
                                  <html>
                                  <head>
                                    <title>Sertifikat Kuis UGM</title>
                                    <style>
                                      @page { 
                                        size: 8.5in 13in;
                                        margin: 20mm;
                                      }
                                      body {
                                        margin: 0;
                                        padding: 20px;
                                        font-family: system-ui, -apple-system, sans-serif;
                                      }
                                      #certificate {
                                        border: 16px solid #d97706;
                                        border-radius: 12px;
                                        padding: 60px;
                                        background: linear-gradient(to bottom right, #fffbeb, #fef3c7);
                                        min-height: 500px;
                                        position: relative;
                                        overflow: hidden;
                                      }
                                      .opacity-5 { opacity: 0.05; }
                                      .absolute { position: absolute; }
                                      .relative { position: relative; }
                                      .top-0 { top: 0; }
                                      .left-0 { left: 0; }
                                      .right-4 { right: 1rem; }
                                      .top-4 { top: 1rem; }
                                      .bottom-4 { bottom: 1rem; }
                                      .left-4 { left: 1rem; }
                                      .text-8xl { font-size: 6rem; }
                                      .w-full { width: 100%; }
                                      .h-full { height: 100%; }
                                      .z-10 { z-index: 10; }
                                      .text-center { text-align: center; }
                                      .space-y-6 > * + * { margin-top: 1.5rem; }
                                      .space-y-2 > * + * { margin-top: 0.5rem; }
                                      .space-y-4 > * + * { margin-top: 1rem; }
                                      .space-y-3 > * + * { margin-top: 0.75rem; }
                                      .h-20 { height: 5rem; }
                                      .w-20 { width: 5rem; }
                                      .text-amber-600 { color: #d97706; }
                                      .mx-auto { margin-left: auto; margin-right: auto; }
                                      .mb-4 { margin-bottom: 1rem; }
                                      .text-5xl { font-size: 3rem; }
                                      .font-bold { font-weight: 700; }
                                      .text-amber-800 { color: #92400e; }
                                      .text-xl { font-size: 1.25rem; }
                                      .text-amber-700 { color: #b45309; }
                                      .h-1 { height: 0.25rem; }
                                      .w-48 { width: 12rem; }
                                      .bg-amber-600 { background-color: #d97706; }
                                      .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
                                      .text-lg { font-size: 1.125rem; }
                                      .text-gray-700 { color: #374151; }
                                      .text-4xl { font-size: 2.25rem; }
                                      .text-amber-900 { color: #78350f; }
                                      .bg-white\\/50 { background-color: rgba(255, 255, 255, 0.5); }
                                      .rounded-lg { border-radius: 0.5rem; }
                                      .p-6 { padding: 1.5rem; }
                                      .max-w-md { max-width: 28rem; }
                                      .text-sm { font-size: 0.875rem; }
                                      .text-2xl { font-size: 1.5rem; }
                                      .text-primary { color: #3b82f6; }
                                      .flex { display: flex; }
                                      .items-center { align-items: center; }
                                      .justify-center { justify-content: center; }
                                      .gap-3 { gap: 0.75rem; }
                                      .pt-2 { padding-top: 0.5rem; }
                                      .text-accent { color: #10b981; }
                                      .text-gray-600 { color: #4b5563; }
                                      .text-3xl { font-size: 1.875rem; }
                                      .text-amber-500 { color: #f59e0b; }
                                      .pt-6 { padding-top: 1.5rem; }
                                      .gap-12 { gap: 3rem; }
                                      .items-end { align-items: flex-end; }
                                      .mb-2 { margin-bottom: 0.5rem; }
                                      .h-0\\.5 { height: 0.125rem; }
                                      .w-32 { width: 8rem; }
                                      .bg-gray-400 { background-color: #9ca3af; }
                                      .font-semibold { font-weight: 600; }
                                      .text-xs { font-size: 0.75rem; }
                                      .text-gray-500 { color: #6b7280; }
                                      .pt-4 { padding-top: 1rem; }
                                      .inline-block { display: inline-block; }
                                      .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                                      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                                      .border-2 { border-width: 2px; }
                                      .border-amber-600 { border-color: #d97706; }
                                      .rounded-full { border-radius: 9999px; }
                                      svg { display: inline-block; vertical-align: middle; }
                                    </style>
                                  </head>
                                  <body>
                                    ${cert.outerHTML}
                                    <script>
                                      window.onload = function() {
                                        window.print();
                                        setTimeout(function() { window.close(); }, 100);
                                      }
                                    </script>
                                  </body>
                                  </html>
                                `)
                                printWindow.document.close()
                              }
                            }
                          }}
                          size="lg"
                          className="max-w-xs"
                        >
                          <Award className="h-5 w-5 mr-2" />
                          Print Sertifikat
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            const cert = document.getElementById('certificate')
                            if (cert) {
                              const canvas = document.createElement('canvas')
                              const ctx = canvas.getContext('2d')
                              
                              if (ctx) {
                                canvas.width = cert.offsetWidth * 2
                                canvas.height = cert.offsetHeight * 2
                                
                                ctx.fillStyle = '#fffbeb'
                                ctx.fillRect(0, 0, canvas.width, canvas.height)
                                
                                ctx.strokeStyle = '#d97706'
                                ctx.lineWidth = 16
                                ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16)
                                
                                ctx.fillStyle = '#78350f'
                                ctx.font = 'bold 96px serif'
                                ctx.textAlign = 'center'
                                ctx.fillText('SERTIFIKAT', canvas.width / 2, 180)
                                
                                ctx.font = '32px sans-serif'
                                ctx.fillText('Penghargaan kuis', canvas.width / 2, 240)
                                
                                ctx.font = '28px sans-serif'
                                ctx.fillStyle = '#374151'
                                ctx.fillText('Diberikan kepada:', canvas.width / 2, 340)
                                
                                ctx.font = 'bold 72px serif'
                                ctx.fillStyle = '#78350f'
                                ctx.fillText('Calon Gamada 2026', canvas.width / 2, 430)
                                
                                ctx.font = '24px sans-serif'
                                ctx.fillStyle = '#374151'
                                ctx.fillText('Telah berhasil menyelesaikan', canvas.width / 2, 520)
                                
                                ctx.font = 'bold 48px sans-serif'
                                ctx.fillStyle = '#78350f'
                                ctx.fillText('Kuis Pengetahuan UGM', canvas.width / 2, 590)
                                
                                ctx.font = '24px sans-serif'
                                ctx.fillStyle = '#78350f'
                                ctx.fillText('dengan nilai sempurna', canvas.width / 2, 640)
                                
                                ctx.font = 'bold 96px sans-serif'
                                ctx.fillStyle = '#78350f'
                                ctx.fillText('100', canvas.width / 2, 760)
                                
                                ctx.font = '28px sans-serif'
                                ctx.fillStyle = '#78350f'
                                ctx.fillText(`${score}/${questions.length} Benar`, canvas.width / 2, 810)
                                
                                ctx.font = '20px sans-serif'
                                ctx.fillStyle = '#6b7280'
                                const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                ctx.fillText(`Diterbitkan pada ${date}`, canvas.width / 2, 920)
                                
                                ctx.font = 'bold 24px sans-serif'
                                ctx.fillStyle = '#d97706'
                                ctx.fillText('🏆 PERFECT SCORE ACHIEVEMENT 🏆', canvas.width / 2, 1000)
                                
                                const link = document.createElement('a')
                                link.download = 'Sertifikat-Kuis-UGM.png'
                                link.href = canvas.toDataURL('image/png')
                                link.click()
                              }
                            }
                          }}
                          size="lg"
                          variant="outline"
                          className="max-w-xs"
                        >
                          <Award className="h-5 w-5 mr-2" />
                          Download PNG
                        </Button>
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                <AnimatedSection delay={400}>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Ringkasan Jawaban:</h3>
                    {questions.map((question, idx) => {
                      const answer = answeredQuestions[idx]
                      return (
                        <div
                          key={question.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm text-pretty"
                        >
                          {answer?.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                          )}
                          <span className="flex-1">{question.question}</span>
                        </div>
                      )
                    })}
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={500}>
                  <div className="flex gap-3">
                    <Button onClick={startQuiz} className="flex-1">
                      Coba Lagi
                    </Button>
                    <Button variant="outline" onClick={() => setShowChess(true)} className="flex-1 bg-transparent">
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Main Catur
                    </Button>
                  </div>
                </AnimatedSection>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <Card className={`mb-6 ${timeRemaining < 120 ? 'border-destructive border-2 animate-pulse' : ''}`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className={`h-6 w-6 ${getTimerColor()}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Waktu Tersisa</p>
                    <p className={`text-3xl font-bold ${getTimerColor()}`}>
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold text-primary">
                    {currentQuestionIndex + 1}/{questions.length}
                  </p>
                </div>
              </div>
              <Progress 
                value={(timeRemaining / 750) * 100} 
                className={`h-2 mt-4 ${getProgressColor()}`}
              />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
              </span>
              <span className="text-sm font-medium text-primary">
                Skor: {score}/{currentQuestionIndex}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">{currentQuestion.category}</Badge>
                <Badge
                  variant={
                    currentQuestion.difficulty === "easy"
                      ? "default"
                      : currentQuestion.difficulty === "medium"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {currentQuestion.difficulty === "easy"
                    ? "Mudah"
                    : currentQuestion.difficulty === "medium"
                      ? "Sedang"
                      : "Sulit"}
                </Badge>
              </div>
              <CardTitle className="text-2xl text-balance leading-tight">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option: any, index: number) => (
                <AnimatedSection key={option.value} delay={300 + (index * 50)}>
                  <Button
                    variant={selectedAnswer === option.value ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-4 px-6 bg-transparent hover:bg-primary/10"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <span className="font-semibold mr-3">{option.value}.</span>
                    <span className="flex-1 text-pretty">{option.text}</span>
                  </Button>
                </AnimatedSection>
              ))}

              <AnimatedSection delay={600}>
                <div className="pt-6">
                  <Button onClick={handleNext} disabled={!selectedAnswer} className="w-full" size="lg">
                    {currentQuestionIndex < questions.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil"}
                  </Button>
                </div>
              </AnimatedSection>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}
