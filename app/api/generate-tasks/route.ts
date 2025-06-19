import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { content, contentType } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
以下の${contentType}コンテンツを分析して、ラズパイ4 YOLO最適化研究に関連するタスクを抽出してください。
各タスクは以下のJSON形式で出力してください：

{
  "tasks": [
    {
      "title": "タスク名",
      "description": "詳細な説明",
      "category": "setup|yolo|ga|analysis",
      "day": "Day X",
      "estimatedHours": 数字,
      "priority": "high|medium|low",
      "codeSnippet": "関連するコマンドやコード（任意）",
      "notes": "追加のメモ（任意）"
    }
  ]
}

以下のガイドラインに従ってください：
1. 具体的で実行可能なタスクに分解する
2. ラズパイ4のハードウェア制約を考慮する
3. YOLO最適化と遺伝的アルゴリズムの観点から重要なタスクを優先する
4. 各タスクは1-8時間で完了できる規模にする
5. categoryは以下の基準で分類：
   - setup: 環境構築、システム設定
   - yolo: YOLO関連の実装・テスト
   - ga: 遺伝的アルゴリズム実装
   - analysis: 結果分析・可視化

コンテンツ:
${content}

JSON形式のみで回答してください。
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // JSONレスポンスをパース
      const cleanedText = text.replace(/```json|```/g, '').trim()
      const parsedResponse = JSON.parse(cleanedText)
      
      return NextResponse.json(parsedResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse AI response', rawResponse: text },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    )
  }
}