PGDMP                      }            formflow    17.2    17.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    29449    formflow    DATABASE     �   CREATE DATABASE formflow WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE formflow;
                     postgres    false            �            1259    29450    designation    TABLE     �   CREATE TABLE public.designation (
    level_id integer,
    name character varying NOT NULL,
    enable boolean DEFAULT true NOT NULL,
    des_id integer NOT NULL
);
    DROP TABLE public.designation;
       public         heap r       postgres    false            �            1259    29456    forms    TABLE     �  CREATE TABLE public.forms (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    questions jsonb,
    settings jsonb,
    created_by character varying(255) NOT NULL,
    is_published boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.forms;
       public         heap r       postgres    false            �            1259    29464    forms_id_seq    SEQUENCE     �   CREATE SEQUENCE public.forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.forms_id_seq;
       public               postgres    false    218                       0    0    forms_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.forms_id_seq OWNED BY public.forms.id;
          public               postgres    false    219            �            1259    29465    levels    TABLE     �   CREATE TABLE public.levels (
    level_id integer NOT NULL,
    name character varying NOT NULL,
    enable boolean DEFAULT true NOT NULL
);
    DROP TABLE public.levels;
       public         heap r       postgres    false            �            1259    29471 	   responses    TABLE     �  CREATE TABLE public.responses (
    id integer NOT NULL,
    form_id integer,
    answers jsonb,
    respondent_email character varying(255),
    ip_address character varying(50),
    user_agent text,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.responses;
       public         heap r       postgres    false            �            1259    29478    responses_id_seq    SEQUENCE     �   CREATE SEQUENCE public.responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.responses_id_seq;
       public               postgres    false    221                       0    0    responses_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.responses_id_seq OWNED BY public.responses.id;
          public               postgres    false    222            e           2604    29479    forms id    DEFAULT     d   ALTER TABLE ONLY public.forms ALTER COLUMN id SET DEFAULT nextval('public.forms_id_seq'::regclass);
 7   ALTER TABLE public.forms ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218            j           2604    29480    responses id    DEFAULT     l   ALTER TABLE ONLY public.responses ALTER COLUMN id SET DEFAULT nextval('public.responses_id_seq'::regclass);
 ;   ALTER TABLE public.responses ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221                      0    29450    designation 
   TABLE DATA           E   COPY public.designation (level_id, name, enable, des_id) FROM stdin;
    public               postgres    false    217   �       	          0    29456    forms 
   TABLE DATA           ~   COPY public.forms (id, title, description, questions, settings, created_by, is_published, created_at, updated_at) FROM stdin;
    public               postgres    false    218   d                 0    29465    levels 
   TABLE DATA           8   COPY public.levels (level_id, name, enable) FROM stdin;
    public               postgres    false    220   3!                 0    29471 	   responses 
   TABLE DATA           �   COPY public.responses (id, form_id, answers, respondent_email, ip_address, user_agent, start_time, end_time, created_at, updated_at) FROM stdin;
    public               postgres    false    221   �!                  0    0    forms_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.forms_id_seq', 32, true);
          public               postgres    false    219                       0    0    responses_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.responses_id_seq', 15, true);
          public               postgres    false    222            n           2606    29482    designation designation_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (des_id);
 F   ALTER TABLE ONLY public.designation DROP CONSTRAINT designation_pkey;
       public                 postgres    false    217            p           2606    29484    forms forms_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.forms DROP CONSTRAINT forms_pkey;
       public                 postgres    false    218            r           2606    29486    levels levels_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (level_id);
 <   ALTER TABLE ONLY public.levels DROP CONSTRAINT levels_pkey;
       public                 postgres    false    220            t           2606    29488    responses responses_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.responses DROP CONSTRAINT responses_pkey;
       public                 postgres    false    221            u           2606    29489 %   designation designation_level_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.designation
    ADD CONSTRAINT designation_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(level_id) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 O   ALTER TABLE ONLY public.designation DROP CONSTRAINT designation_level_id_fkey;
       public               postgres    false    220    217    4722            v           2606    29494     responses responses_form_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.responses DROP CONSTRAINT responses_form_id_fkey;
       public               postgres    false    4720    218    221               �   x�E�;�0D��S�'��2E�cJˬ-G��̆��qh�FOof$�σ�.ڠ���Ab*Z~�D����y�%S�ɰ��]�J�awݛ���IY\a[O�M���W���S������icb�:
�u�r	���3+^�� /x      	   �  x���Ao� ��Χ�,�*��@nY�I����v�r ƙ�Mվ��m:����Xz�g�ߏgJ��C�^	��<�Yo۱�ſ�V���ªb��W�����������5�P˼�O:�?���06�)ًV��;��!Fw�X���h{� F�A�Y�fC`m�T��Rb"X�D�J��L?�R�Ϡ[�wεڇ|��}����(��P�#�p n��	*���2�ܠ]�'��9l����z�-E����Va���@+
�� ^+
��kSAQM}w~�q�M��:=?ݬ'��f�\D�}>�LEӹ�}�������}�Y�I�ù�z��]J�yY#oQ���p ��!�)�TC8ߥ�/��{����[�Cv��t�����XNw�|�w�x��}�ǔ:�����/z8���iR6���;�,d�
@0�Q��hE�Gb�Jk��j�X��C�k         �   x����@��ݧ�	����@��p��@�&�������|3��3��r�A�jj��͟����=	v� �v�������8ɷY��u�'x�D(�`�JZ��4RP/�ѳ~�"��n^��'�#IV�)EY�|��=�ޔ��9���5J            x������ � �     