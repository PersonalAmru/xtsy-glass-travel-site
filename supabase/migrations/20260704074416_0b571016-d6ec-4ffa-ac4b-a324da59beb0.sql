CREATE TABLE public._grant_probe (id int primary key);
GRANT ALL ON public._grant_probe TO service_role;
GRANT SELECT, INSERT ON public._grant_probe TO authenticated;