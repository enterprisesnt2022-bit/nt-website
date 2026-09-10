create extension if not exists vector;

create table if not exists products (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, category text, short_description text, description text, applications text, industries text, specifications jsonb default '{}'::jsonb, keywords text[], created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists faqs (id uuid primary key default gen_random_uuid(), question text not null, answer text not null, category text, keywords text[], created_at timestamptz default now());
create table if not exists documents (id uuid primary key default gen_random_uuid(), title text not null, description text, file_url text, category text, content text, created_at timestamptz default now());
create table if not exists knowledge_chunks (id uuid primary key default gen_random_uuid(), source_type text not null, source_id uuid, content text not null, embedding vector(768), metadata jsonb default '{}'::jsonb, created_at timestamptz default now());
create index if not exists knowledge_chunks_embedding_idx on knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create table if not exists enquiries (id uuid primary key default gen_random_uuid(), reference text unique not null, name text not null, company text, email text not null, phone text not null, product text not null, quantity text, application text not null, requirement text, ai_summary text, status text not null default 'New', created_at timestamptz default now());

create or replace function match_knowledge_chunks(query_embedding vector(768), match_threshold float, match_count int)
returns table(content text, metadata jsonb, similarity float) language sql stable as $$
  select content, metadata, 1 - (embedding <=> query_embedding) as similarity from knowledge_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding limit match_count;
$$;

alter table products enable row level security; alter table faqs enable row level security; alter table documents enable row level security; alter table knowledge_chunks enable row level security; alter table enquiries enable row level security;
