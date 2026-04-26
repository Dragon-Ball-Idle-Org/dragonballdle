-- Create the distribution table to store stats by date, mode and guess count
CREATE TABLE IF NOT EXISTS public.guess_distribution (
  game_date DATE NOT NULL,
  game_mode TEXT NOT NULL,
  guess_count INTEGER NOT NULL,
  count BIGINT DEFAULT 0,
  PRIMARY KEY (game_date, game_mode, guess_count)
);

-- Enable RLS
ALTER TABLE public.guess_distribution ENABLE ROW LEVEL SECURITY;

-- Allow public read access to the distribution
CREATE POLICY "Allow public read access to distribution"
  ON public.guess_distribution
  FOR SELECT
  TO anon
  USING (true);

-- Create RPC function to record a guess count
CREATE OR REPLACE FUNCTION public.record_guess(
  p_game_date DATE,
  p_game_mode TEXT,
  p_guess_count INTEGER
)
RETURNS BIGINT AS $$
DECLARE
  v_new_count BIGINT;
BEGIN
  INSERT INTO public.guess_distribution (game_date, game_mode, guess_count, count)
  VALUES (p_game_date, p_game_mode, p_guess_count, 1)
  ON CONFLICT (game_date, game_mode, guess_count)
  DO UPDATE SET count = guess_distribution.count + 1
  RETURNING count INTO v_new_count;

  RETURN v_new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
