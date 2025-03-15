
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface EvaluationRequestBody {
  activity_id: string;
  student_id: string;
  rating: number;
  comment: string;
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { activity_id, student_id, rating, comment } = await req.json() as EvaluationRequestBody;

    // Check if the student has already evaluated this activity
    const { data: existingEvaluation, error: checkError } = await supabaseClient
      .from('activity_evaluations')
      .select('id')
      .eq('activity_id', activity_id)
      .eq('student_id', student_id)
      .maybeSingle();

    if (checkError) throw checkError;
    
    if (existingEvaluation) {
      return new Response(
        JSON.stringify({ error: 'You have already evaluated this activity' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert new evaluation
    const { error: insertError } = await supabaseClient
      .from('activity_evaluations')
      .insert({
        activity_id,
        student_id,
        rating,
        comment
      });

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})
