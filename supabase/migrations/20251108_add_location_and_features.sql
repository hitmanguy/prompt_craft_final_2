-- Create items table with location support
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  item_type text not null check (item_type in ('lost', 'found')),
  category text not null default 'other',
  status text not null default 'active' check (status in ('active', 'resolved', 'archived')),
  latitude numeric not null,
  longitude numeric not null,
  address text not null,
  city text,
  state text,
  country text,
  zip_code text,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_phone text not null,
  user_email text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  resolved_at timestamp with time zone,
  archived_at timestamp with time zone,
  report_count integer default 0,
  view_count integer default 0
);

create index if not exists idx_items_user_id on items(user_id);
create index if not exists idx_items_status on items(status);
create index if not exists idx_items_category on items(category);
create index if not exists idx_items_type on items(item_type);
create index if not exists idx_items_created_at on items(created_at);
create index if not exists idx_items_location on items using gist(ll_to_earth(latitude, longitude));

-- Create item_photos table
create table if not exists item_photos (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  url text not null,
  compressed_url text,
  size integer,
  uploaded_at timestamp with time zone default now(),
  display_order integer default 0
);

create index if not exists idx_item_photos_item_id on item_photos(item_id);

-- Create item_tags table
create table if not exists item_tags (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  tag_name text not null,
  confidence numeric,
  is_ai_generated boolean default false,
  created_at timestamp with time zone default now()
);

create index if not exists idx_item_tags_item_id on item_tags(item_id);
create index if not exists idx_item_tags_name on item_tags(tag_name);

-- Create matches table
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  lost_item_id uuid not null references items(id) on delete cascade,
  found_item_id uuid not null references items(id) on delete cascade,
  similarity numeric check (similarity >= 0 and similarity <= 1),
  match_reason text,
  created_at timestamp with time zone default now(),
  matched_at timestamp with time zone default now(),
  unique(lost_item_id, found_item_id)
);

create index if not exists idx_matches_lost_item on matches(lost_item_id);
create index if not exists idx_matches_found_item on matches(found_item_id);
create index if not exists idx_matches_similarity on matches(similarity);

-- Create conversations table
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  item1_id uuid not null references items(id) on delete cascade,
  item2_id uuid not null references items(id) on delete cascade,
  participant1_id uuid not null references auth.users(id) on delete cascade,
  participant2_id uuid not null references auth.users(id) on delete cascade,
  last_message text,
  last_message_time timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_conversations_participant1 on conversations(participant1_id);
create index if not exists idx_conversations_participant2 on conversations(participant2_id);
create index if not exists idx_conversations_items on conversations(item1_id, item2_id);

-- Create messages table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now(),
  read_at timestamp with time zone
);

create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_messages_sender on messages(sender_id);
create index if not exists idx_messages_receiver on messages(receiver_id);
create index if not exists idx_messages_created_at on messages(created_at);

-- Create notifications table
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('match', 'message', 'status_update', 'digest')),
  title text not null,
  message text not null,
  related_item_id uuid references items(id) on delete cascade,
  related_conversation_id uuid references conversations(id) on delete cascade,
  is_read boolean default false,
  created_at timestamp with time zone default now(),
  read_at timestamp with time zone
);

create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_notifications_is_read on notifications(is_read);
create index if not exists idx_notifications_created_at on notifications(created_at);

-- Create saved_filters table
create table if not exists saved_filters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  item_type text check (item_type in ('lost', 'found')),
  latitude numeric,
  longitude numeric,
  radius_km numeric,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_saved_filters_user on saved_filters(user_id);

-- Create reports table
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items(id) on delete cascade,
  reported_by uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_reports_item on reports(item_id);
create index if not exists idx_reports_status on reports(status);
create index if not exists idx_reports_created_at on reports(created_at);

-- Create updated_at triggers
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger items_updated_at before update on items
for each row execute function set_updated_at();

create trigger conversations_updated_at before update on conversations
for each row execute function set_updated_at();

create trigger saved_filters_updated_at before update on saved_filters
for each row execute function set_updated_at();
