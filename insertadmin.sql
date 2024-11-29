-- Insert admin user if not already present
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public."User" WHERE email = 'Admin1@email.com') THEN
        INSERT INTO public."User" (name, email, phone, password, role)
        VALUES ('admin1', 'Admin1@email.com', '01230123123', 'admin123', 'admin');
    END IF;
END$$;

