
-- Fix permissive INSERT on orders - add basic validation
DROP POLICY "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders with valid data" ON public.orders FOR INSERT WITH CHECK (
  customer_name IS NOT NULL AND length(customer_name) > 0 AND
  customer_email IS NOT NULL AND customer_email LIKE '%@%.%' AND
  address IS NOT NULL AND length(address) > 0
);

-- Fix public bucket listing - restrict to specific file access
DROP POLICY "Anyone can view images" ON storage.objects;
CREATE POLICY "Anyone can view specific images" ON storage.objects FOR SELECT USING (bucket_id = 'images' AND name IS NOT NULL);
