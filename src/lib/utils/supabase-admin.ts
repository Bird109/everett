import { createClient } from '@supabase/supabase-js';

const url = 'https://aelgrzrwfmtmzbspsosn.supabase.co';
const secret =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbGdyenJ3Zm10bXpic3Bzb3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MDI1MjM3OCwiZXhwIjoxOTk1ODI4Mzc4fQ.YD7jbVAqwcfCh4q1bv-H1_Wuk01x8rbcm71S-B54KfM';

export const admin = createClient(url, secret);
