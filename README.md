# Where is Polka?

Kicsi app, ami megmondja, kinél van Polka egy adott napon, mutat egy éves
dashboardot a megosztott napokról, és tartalmaz egy mini platformer
játékot.

## Helyi futtatás

```bash
npm install
cp .env.local.example .env.local   # töltsd ki a Supabase adatokkal
npm run dev
```

## Supabase beállítás

1. Hozz létre egy új projektet a Supabase-en (free tier).
2. Az SQL Editor-ban futtasd le a `supabase/schema.sql` fájl tartalmát.
3. A `settings` táblában állítsd be a `reference_sunday` és
   `owner_at_reference` mezőket egy tényleges, ismert váltás-vasárnapra
   (pl. ha most nálad van, és a legutóbbi vasárnap este váltottatok,
   azt a dátumot írd be).
4. A Project Settings → API alatt található URL és anon key megy az
   `.env.local`-ba (és később a Vercel env változóiba).

## Deploy (GitHub + Vercel)

1. Hozz létre egy üres repót GitHub-on (pl. `where-is-polka`).
2. Ebben a mappában: `git init && git add . && git commit -m "init"`,
   majd kösd össze a GitHub repóval és push-old.
3. Menj a Vercelre → "Add New Project" → importáld a GitHub repót.
4. A Vercel-en add hozzá az env változókat (Environment Variables):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Deploy — a Vercel innentől minden push-nál automatikusan újra buildel.

## Mit érdemes még hozzáadni

- Polka valódi fotójából pixel art sprite a játékba (a canvas jelenleg
  csak egyszerű blokkokkal rajzol placeholder karaktert).
- Rendkívüli csere rögzítése az `overrides` táblába (UI-t még nem
  csináltam hozzá, most SQL-lel kell felvinni).
