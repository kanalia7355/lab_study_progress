-- Supabase Database Schema for RPI Progress Tracker
-- このファイルをSupabaseのSQL Editorで実行してください

-- ユーザーの学習進捗データテーブル
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    phases JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- ユーザーの実験結果データテーブル
CREATE TABLE IF NOT EXISTS user_experiments (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    model_type TEXT NOT NULL,
    avg_fps REAL NOT NULL,
    avg_inference_time REAL NOT NULL,
    avg_cpu_temp REAL NOT NULL,
    fitness REAL,
    parameters JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) の有効化
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_experiments ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can only access their own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own experiments" ON user_experiments
    FOR ALL USING (auth.uid() = user_id);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS user_experiments_user_id_idx ON user_experiments(user_id);
CREATE INDEX IF NOT EXISTS user_experiments_date_idx ON user_experiments(date DESC);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_experiments_updated_at BEFORE UPDATE ON user_experiments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();