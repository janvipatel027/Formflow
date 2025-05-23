PGDMP      #                }            formflow    17.2    17.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    29380    formflow    DATABASE     �   CREATE DATABASE formflow WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE formflow;
                     postgres    false            �            1259    29424    designation    TABLE     �   CREATE TABLE public.designation (
    level_id integer,
    name character varying NOT NULL,
    enable boolean DEFAULT true NOT NULL,
    des_id integer NOT NULL
);
    DROP TABLE public.designation;
       public         heap r       postgres    false            �            1259    29382    forms    TABLE     �  CREATE TABLE public.forms (
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
       public         heap r       postgres    false            �            1259    29381    forms_id_seq    SEQUENCE     �   CREATE SEQUENCE public.forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.forms_id_seq;
       public               postgres    false    218                       0    0    forms_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.forms_id_seq OWNED BY public.forms.id;
          public               postgres    false    217            �            1259    29416    levels    TABLE     �   CREATE TABLE public.levels (
    level_id integer NOT NULL,
    name character varying NOT NULL,
    enable boolean DEFAULT true NOT NULL
);
    DROP TABLE public.levels;
       public         heap r       postgres    false            �            1259    29394 	   responses    TABLE     �  CREATE TABLE public.responses (
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
       public         heap r       postgres    false            �            1259    29393    responses_id_seq    SEQUENCE     �   CREATE SEQUENCE public.responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.responses_id_seq;
       public               postgres    false    220                       0    0    responses_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.responses_id_seq OWNED BY public.responses.id;
          public               postgres    false    219            d           2604    29385    forms id    DEFAULT     d   ALTER TABLE ONLY public.forms ALTER COLUMN id SET DEFAULT nextval('public.forms_id_seq'::regclass);
 7   ALTER TABLE public.forms ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            h           2604    29397    responses id    DEFAULT     l   ALTER TABLE ONLY public.responses ALTER COLUMN id SET DEFAULT nextval('public.responses_id_seq'::regclass);
 ;   ALTER TABLE public.responses ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220                      0    29424    designation 
   TABLE DATA           E   COPY public.designation (level_id, name, enable, des_id) FROM stdin;
    public               postgres    false    222   �       	          0    29382    forms 
   TABLE DATA           ~   COPY public.forms (id, title, description, questions, settings, created_by, is_published, created_at, updated_at) FROM stdin;
    public               postgres    false    218   �                 0    29416    levels 
   TABLE DATA           8   COPY public.levels (level_id, name, enable) FROM stdin;
    public               postgres    false    221   �!                 0    29394 	   responses 
   TABLE DATA           �   COPY public.responses (id, form_id, answers, respondent_email, ip_address, user_agent, start_time, end_time, created_at, updated_at) FROM stdin;
    public               postgres    false    220   �!                  0    0    forms_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.forms_id_seq', 32, true);
          public               postgres    false    217                       0    0    responses_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.responses_id_seq', 15, true);
          public               postgres    false    219            t           2606    29431    designation designation_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.designation
    ADD CONSTRAINT designation_pkey PRIMARY KEY (des_id);
 F   ALTER TABLE ONLY public.designation DROP CONSTRAINT designation_pkey;
       public                 postgres    false    222            n           2606    29392    forms forms_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.forms DROP CONSTRAINT forms_pkey;
       public                 postgres    false    218            r           2606    29423    levels levels_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (level_id);
 <   ALTER TABLE ONLY public.levels DROP CONSTRAINT levels_pkey;
       public                 postgres    false    221            p           2606    29403    responses responses_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.responses DROP CONSTRAINT responses_pkey;
       public                 postgres    false    220            v           2606    29442 %   designation designation_level_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.designation
    ADD CONSTRAINT designation_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(level_id) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;
 O   ALTER TABLE ONLY public.designation DROP CONSTRAINT designation_level_id_fkey;
       public               postgres    false    221    4722    222            u           2606    29404     responses responses_form_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.responses
    ADD CONSTRAINT responses_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.responses DROP CONSTRAINT responses_form_id_fkey;
       public               postgres    false    220    218    4718                  x������ � �      	   �  x��T�n�0=�_!�-4���|)\�A$N��=�9pu�hq%n��K�Il����E�H�F���l�%����$�8Q�1��h�0�V 1@h�E�5��&q�,l�����s_�,��.R/|^Wm�]߄mc�-��v N��y�'�.
����y�϶��ꬩ�m��}��E^�����]����R���zUE>�� R�Q����fC��Ԁ�h콭���������e�M���69-N��p	��(A8p�b��m���4�7�^��A���)d�*�jP��S�(��$Pa��Y-Ke��i��K[�x��}ycg��@s�\��3���ql��rY�|�l:&����&G��.4��&��A�8C�a`��rAA�Je[�B��=4�j]��ɴۏ�����qtr��<6:oB��&�M��e���Y���Z��>��N��#l����R�,#�0EACI3�a �,�[���q���|h�52�hD�0Cb�'5 8����0�aݔ���O��E2D!$AV�:@�`E-*�Q�&vG��z���-�~]g�ӏ�z.�_��<��֚�H۷���R8�l�8D����.���a޴~C-J;�x86��8��� ���V@!!��Z��_�ZTI�"�)��'�Y��5C���q-}k������6.��{�:��������MeA"Fi�=�C̃f{R����`���%�            x������ � �         8  x�͓MO�@��ίX�kf��6'AAj�"�TծwW�p�h���]#�)
9�C+_�gf��ygy�!�|�v?�>-I�Ƨ;$�6���Fd�]��t��a=3M6w�O�ꩿ��tާ2`���' K&K�LH��O�\Ƽ���\�y	�ݗ��$)KL��Ϻì̮l��3��\��	A�`�D�����6ٟ���Q��J�3���ѻ��x�4��'o}u�n��E;�����G>�`�Ñ�w��L��U�P���_�Bh�!4@�p�}r�w�4:�l4N���3]�k��əT�VN*,˩͹���U9�M�vȊ�+�**�6�Q��	6�r����h8yM{�'\E+m�(
j�"Р�<�rA�)x�?94��7�w������9]�+?�z�f|���Oz������\�Y`�;T�\�B9M�-�A��ϋ�Z�P\!��'bDA�⊲��9h��E����Kx�e-�{�k�!4@�p���n�������r:��ѥ��6��M@�J�Y��y���A
��+O���ZY!
\��b2#��|��,��B��l0�E�Y     