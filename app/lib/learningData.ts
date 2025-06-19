import { Phase, Task } from './types'

export const learningPhases: Phase[] = [
  {
    id: 'phase1',
    name: '環境構築・基本動作',
    description: 'ラズパイ4のセットアップとPython環境の準備',
    days: 'Day 1-2',
    tasks: [
      {
        id: 'env-1',
        title: 'システム更新とPython環境整備',
        description: 'apt update/upgrade実行、Python3とpipインストール',
        category: 'setup',
        day: 'Day 1',
        completed: false,
        codeSnippet: `sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv git cmake build-essential
sudo apt install -y libopencv-dev python3-opencv`
      },
      {
        id: 'env-2',
        title: '仮想環境作成と必要パッケージインストール',
        description: 'YOLO用の仮想環境セットアップ',
        category: 'setup',
        day: 'Day 1',
        completed: false,
        codeSnippet: `python3 -m venv ~/yolo_env
source ~/yolo_env/bin/activate
pip install ultralytics opencv-python pillow matplotlib pandas numpy
pip install deap tqdm psutil`
      },
      {
        id: 'env-3',
        title: 'システム性能確認スクリプト実行',
        description: 'system_info.pyでラズパイ4の性能を確認',
        category: 'setup',
        day: 'Day 2',
        completed: false,
        codeSnippet: `python system_info.py`
      }
    ],
    milestones: [
      'ラズパイ4基本セットアップ完了',
      'Python環境・必要ライブラリインストール',
      'システム性能監視・温度測定確認',
      '基本的な動作確認完了'
    ]
  },
  {
    id: 'phase2',
    name: 'YOLO基本動作確認',
    description: 'YOLOモデルのダウンロードとベンチマーク実行',
    days: 'Day 3-5',
    tasks: [
      {
        id: 'yolo-1',
        title: 'テストデータセット準備',
        description: '実画像のダウンロードと合成画像の生成',
        category: 'yolo',
        day: 'Day 3',
        completed: false,
        codeSnippet: `python dataset_preparation.py`
      },
      {
        id: 'yolo-2',
        title: 'YOLOモデルダウンロード',
        description: 'YOLOv8n/s、YOLOv5n/sモデルの取得',
        category: 'yolo',
        day: 'Day 3',
        completed: false
      },
      {
        id: 'yolo-3',
        title: 'ベンチマーク実行',
        description: '各モデルでの推論速度・精度測定',
        category: 'yolo',
        day: 'Day 4-5',
        completed: false,
        codeSnippet: `python yolo_basic_test.py`
      }
    ],
    milestones: [
      'テストデータセット準備完了',
      'YOLOモデルダウンロード・動作確認',
      '複数モデルでのベンチマーク実行',
      'ラズパイでの性能特性把握'
    ]
  },
  {
    id: 'phase3',
    name: '遺伝的アルゴリズム実装',
    description: '静止画像での最適化システム構築',
    days: 'Day 6-10',
    tasks: [
      {
        id: 'ga-1',
        title: 'GA基本実装',
        description: '個体生成・突然変異・選択の実装',
        category: 'ga',
        day: 'Day 6-7',
        completed: false
      },
      {
        id: 'ga-2',
        title: '評価器実装',
        description: '静止画像での性能評価システム',
        category: 'ga',
        day: 'Day 8',
        completed: false
      },
      {
        id: 'ga-3',
        title: '最適化実行',
        description: '遺伝的アルゴリズムによる最適化',
        category: 'ga',
        day: 'Day 9-10',
        completed: false,
        codeSnippet: `python simple_ga_optimizer.py`
      }
    ],
    milestones: [
      '遺伝的アルゴリズム基本実装完了',
      '静止画像での最適化実行成功',
      '適応度関数の調整・改良',
      '最適化結果の妥当性確認'
    ]
  },
  {
    id: 'phase4',
    name: 'システム統合・分析',
    description: '結果分析と可視化システムの構築',
    days: 'Day 11-14',
    tasks: [
      {
        id: 'analysis-1',
        title: '結果分析システム実装',
        description: '進化ログとベンチマーク結果の分析',
        category: 'analysis',
        day: 'Day 11-12',
        completed: false,
        codeSnippet: `python result_analyzer.py`
      },
      {
        id: 'analysis-2',
        title: 'パラメータ影響度分析',
        description: '相関分析と最適パラメータの特定',
        category: 'analysis',
        day: 'Day 13',
        completed: false
      },
      {
        id: 'analysis-3',
        title: '要約レポート生成',
        description: '学習成果のまとめと次段階への準備',
        category: 'analysis',
        day: 'Day 14',
        completed: false
      }
    ],
    milestones: [
      '結果分析・可視化システム実装',
      'パラメータ影響度分析実行',
      'ベースラインとの比較評価',
      '要約レポート生成完了'
    ]
  }
]

export function getTotalTasks(): number {
  return learningPhases.reduce((total, phase) => total + phase.tasks.length, 0)
}

export function getCompletedTasks(phases: Phase[]): number {
  return phases.reduce((total, phase) => 
    total + phase.tasks.filter(task => task.completed).length, 0
  )
}

export function getCurrentPhase(phases: Phase[]): string {
  for (const phase of phases) {
    const incompleteTasks = phase.tasks.filter(task => !task.completed)
    if (incompleteTasks.length > 0) {
      return phase.name
    }
  }
  return phases[phases.length - 1].name
}