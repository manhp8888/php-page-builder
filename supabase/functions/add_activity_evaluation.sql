
-- Create a stored procedure to add activity evaluations
CREATE OR REPLACE FUNCTION public.add_activity_evaluation(
  p_activity_id UUID,
  p_student_id UUID,
  p_rating INTEGER,
  p_comment TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Insert the evaluation
  INSERT INTO public.activity_evaluations (
    activity_id,
    student_id,
    rating,
    comment
  ) VALUES (
    p_activity_id,
    p_student_id,
    p_rating,
    p_comment
  )
  RETURNING to_jsonb(activity_evaluations.*) INTO v_result;
  
  RETURN v_result;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle unique constraint violation (student has already evaluated this activity)
    RAISE EXCEPTION 'You have already evaluated this activity';
  WHEN OTHERS THEN
    -- Handle other exceptions
    RAISE EXCEPTION 'An error occurred: %', SQLERRM;
END;
$$;
