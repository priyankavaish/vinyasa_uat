DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'bookings' AND column_name = 'amount' AND data_type <> 'numeric') THEN
    ALTER TABLE bookings ALTER COLUMN amount TYPE numeric(12,2) USING amount::numeric(12,2);
  END IF;
END $$;
