
-- Enable Row Level Security for all tables
ALTER TABLE IF EXISTS "public"."activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."activity_evaluations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."student_registrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."profiles" ENABLE ROW LEVEL SECURITY;

-- Policies for activities table
CREATE POLICY "Activities are viewable by everyone" 
ON "public"."activities" FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Teachers can insert activities" 
ON "public"."activities" FOR INSERT 
TO authenticated 
WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher');

CREATE POLICY "Teachers can update their own activities" 
ON "public"."activities" FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher')
WITH CHECK (user_id = auth.uid() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher');

CREATE POLICY "Teachers can delete their own activities" 
ON "public"."activities" FOR DELETE 
TO authenticated 
USING (user_id = auth.uid() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher');

-- Policies for activity_evaluations table
CREATE POLICY "Students can view evaluations" 
ON "public"."activity_evaluations" FOR SELECT 
TO authenticated 
USING (student_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher');

CREATE POLICY "Students can insert evaluations" 
ON "public"."activity_evaluations" FOR INSERT 
TO authenticated 
WITH CHECK (student_id = auth.uid() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'student');

-- Policies for student_registrations table
CREATE POLICY "Students can view their own registrations" 
ON "public"."student_registrations" FOR SELECT 
TO authenticated 
USING (student_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher');

CREATE POLICY "Students can register for activities" 
ON "public"."student_registrations" FOR INSERT 
TO authenticated 
WITH CHECK (student_id = auth.uid() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'student');

CREATE POLICY "Students can delete their own registrations" 
ON "public"."student_registrations" FOR DELETE 
TO authenticated 
USING (student_id = auth.uid() AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'student');

-- Policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON "public"."profiles" FOR SELECT 
TO authenticated 
USING (id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher');

CREATE POLICY "Users can update their own profile" 
ON "public"."profiles" FOR UPDATE 
TO authenticated 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());
