-- Create ENUM type for user roles if it doesn't exist 
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'admin', 'courier');
    END IF;
END$$;

-- Create sequence for User table ID if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'User_id_seq') THEN
        CREATE SEQUENCE "User_id_seq";
    END IF;
END$$;

-- Create sequence for Order table ID if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'Order_order_id_seq') THEN
        CREATE SEQUENCE "Order_order_id_seq";
    END IF;
END$$;

-- Table: public.User
CREATE TABLE IF NOT EXISTS public."User"
(
    id integer NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
    name character varying(100) NOT NULL,
    email character varying(100),
    phone character varying(100),
    password character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role user_role NOT NULL DEFAULT 'customer',
    CONSTRAINT "User_pkey" PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email)
);

-- Table: public.Order
CREATE TABLE IF NOT EXISTS public."Order"
(
    pickup character varying(2000) NOT NULL,
    dropoff character varying(2000) NOT NULL,
    details character varying(150) NOT NULL,
    delivery_date date,
    order_id integer NOT NULL DEFAULT nextval('"Order_order_id_seq"'::regclass),
    user_id integer,
    status character varying(50) DEFAULT 'Placed',
    courier_id integer,
    CONSTRAINT "Order_pkey" PRIMARY KEY (order_id),
    CONSTRAINT fk_courier FOREIGN KEY (courier_id)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

-- Change ownership to `postgres`
ALTER TABLE IF EXISTS public."User"
    OWNER TO postgres;

ALTER TABLE IF EXISTS public."Order"
    OWNER TO postgres;

