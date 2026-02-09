
-- ============================================
-- 1. ENUM TYPES
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'locador', 'locatario');
CREATE TYPE public.property_availability AS ENUM ('available', 'rented', 'maintenance');
CREATE TYPE public.contract_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE public.inspection_type AS ENUM ('entrada', 'saida');
CREATE TYPE public.inspection_status AS ENUM ('pending_tenant', 'pending_landlord', 'disputed', 'completed');
CREATE TYPE public.bank_account_type AS ENUM ('corrente', 'poupanca');
CREATE TYPE public.uploaded_by_type AS ENUM ('landlord', 'tenant');

-- ============================================
-- 2. PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  photo TEXT,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_access TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. USER ROLES TABLE
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 4. PROPERTIES TABLE
-- ============================================
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  area NUMERIC(10,2) NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  description TEXT,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  lat NUMERIC(10,6),
  lng NUMERIC(10,6),
  landlord_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  bank_account_id UUID,
  availability property_availability DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view properties"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Landlords can insert own properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = landlord_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Landlords can update own properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (auth.uid() = landlord_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Landlords can delete own properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (auth.uid() = landlord_id OR public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 5. BANNERS TABLE
-- ============================================
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON public.banners FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage banners"
  ON public.banners FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 6. LANDLORDS TABLE
-- ============================================
CREATE TABLE public.landlords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  social_contract_accepted BOOLEAN DEFAULT false,
  social_contract_accepted_at TIMESTAMPTZ,
  validated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.landlords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own landlord record"
  ON public.landlords FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own landlord record"
  ON public.landlords FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own landlord record"
  ON public.landlords FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 7. BANK ACCOUNTS TABLE
-- ============================================
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES public.landlords(id) ON DELETE CASCADE NOT NULL,
  bank TEXT NOT NULL,
  agency TEXT NOT NULL,
  account TEXT NOT NULL,
  account_type bank_account_type DEFAULT 'corrente',
  holder_name TEXT NOT NULL,
  holder_cpf TEXT NOT NULL,
  validated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landlords can view own bank accounts"
  ON public.bank_accounts FOR SELECT
  TO authenticated
  USING (
    landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords can insert own bank accounts"
  ON public.bank_accounts FOR INSERT
  TO authenticated
  WITH CHECK (
    landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid())
  );

CREATE POLICY "Landlords can update own bank accounts"
  ON public.bank_accounts FOR UPDATE
  TO authenticated
  USING (
    landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords can delete own bank accounts"
  ON public.bank_accounts FOR DELETE
  TO authenticated
  USING (
    landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid())
  );

-- ============================================
-- 8. RENTALS TABLE
-- ============================================
CREATE TABLE public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status contract_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relevant rentals"
  ON public.rentals FOR SELECT
  TO authenticated
  USING (
    auth.uid() = tenant_id
    OR auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords and admins can insert rentals"
  ON public.rentals FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords and admins can update rentals"
  ON public.rentals FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

-- ============================================
-- 9. RENTAL CONTRACTS TABLE
-- ============================================
CREATE TABLE public.rental_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID REFERENCES public.rentals(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT,
  tenant_cpf TEXT,
  tenant_phone TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 12,
  monthly_rent NUMERIC(10,2) NOT NULL,
  status contract_status DEFAULT 'active',
  contract_terms TEXT,
  landlord_signed_by UUID REFERENCES auth.users(id),
  landlord_signed_at TIMESTAMPTZ,
  landlord_signed_ip TEXT,
  tenant_signed_by UUID REFERENCES auth.users(id),
  tenant_signed_at TIMESTAMPTZ,
  tenant_signed_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.rental_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relevant contracts"
  ON public.rental_contracts FOR SELECT
  TO authenticated
  USING (
    auth.uid() = tenant_id
    OR auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords and admins can insert contracts"
  ON public.rental_contracts FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords and admins can update contracts"
  ON public.rental_contracts FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = tenant_id
    OR auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

-- ============================================
-- 10. INSPECTIONS TABLE
-- ============================================
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  type inspection_type NOT NULL,
  general_description TEXT,
  observations TEXT,
  status inspection_status DEFAULT 'pending_tenant',
  locked BOOLEAN DEFAULT false,
  landlord_signed_by UUID REFERENCES auth.users(id),
  landlord_signed_at TIMESTAMPTZ,
  landlord_signed_ip TEXT,
  tenant_signed_by UUID REFERENCES auth.users(id),
  tenant_signed_at TIMESTAMPTZ,
  tenant_signed_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relevant inspections"
  ON public.inspections FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR auth.uid() IN (SELECT tenant_id FROM public.rentals WHERE property_id = inspections.property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Landlords can insert inspections"
  ON public.inspections FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Relevant users can update inspections"
  ON public.inspections FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT landlord_id FROM public.properties WHERE id = property_id)
    OR auth.uid() IN (SELECT tenant_id FROM public.rentals WHERE property_id = inspections.property_id)
    OR public.has_role(auth.uid(), 'admin')
  );

-- ============================================
-- 11. INSPECTION PHOTOS TABLE
-- ============================================
CREATE TABLE public.inspection_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  room TEXT,
  uploaded_by uploaded_by_type DEFAULT 'landlord',
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inspection photos"
  ON public.inspection_photos FOR SELECT
  TO authenticated
  USING (
    inspection_id IN (
      SELECT i.id FROM public.inspections i
      JOIN public.properties p ON p.id = i.property_id
      WHERE p.landlord_id = auth.uid()
         OR EXISTS (SELECT 1 FROM public.rentals r WHERE r.property_id = p.id AND r.tenant_id = auth.uid())
         OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Relevant users can insert inspection photos"
  ON public.inspection_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    inspection_id IN (
      SELECT i.id FROM public.inspections i
      JOIN public.properties p ON p.id = i.property_id
      WHERE p.landlord_id = auth.uid()
         OR EXISTS (SELECT 1 FROM public.rentals r WHERE r.property_id = p.id AND r.tenant_id = auth.uid())
    )
  );

-- ============================================
-- 12. UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 13. PROFILE AUTO-CREATION TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
