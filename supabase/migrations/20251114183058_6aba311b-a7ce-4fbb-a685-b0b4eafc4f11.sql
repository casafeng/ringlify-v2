-- Add unique constraint for phone number upsert in onboarding
ALTER TABLE phone_numbers 
ADD CONSTRAINT phone_numbers_customer_phone_unique 
UNIQUE (customer_id, phone_number);