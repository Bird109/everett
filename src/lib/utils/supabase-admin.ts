import { createClient } from '@supabase/supabase-js';

const url = 'https://scbduockldhfkdbpauhr.supabase.co';
const secret =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYmR1b2NrbGRoZmtkYnBhdWhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0OTUwNzQ5MCwiZXhwIjoxOTY1MDgzNDkwfQ.uo0XuFNg3v-3mliBCvo8eHSdWHN-IYPlLJWaW1J0lm4';

export const admin = createClient(url, secret);
