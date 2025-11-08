-- Add latitude and longitude columns to items table
ALTER TABLE public.items 
ADD COLUMN latitude DECIMAL(10,8),
ADD COLUMN longitude DECIMAL(11,8);

-- Add index for location queries
CREATE INDEX items_location_idx ON public.items (latitude, longitude);

-- Update status check to include all statuses
ALTER TABLE public.items 
DROP CONSTRAINT IF EXISTS items_status_check,
ADD CONSTRAINT items_status_check CHECK (status IN ('active', 'resolved', 'archived', 'reunited'));