-- Enable realtime for calls table
ALTER TABLE public.calls REPLICA IDENTITY FULL;

-- Add calls table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;