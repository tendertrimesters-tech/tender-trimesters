# Tender Trimesters — Your Next Steps Playbook

Everything you asked about, in one place. Stripe setup, deployment, social strategy, the new features you said yes to, and more ideas.

---

## PART 1 — Wiring Up Stripe (Code Is Done. Now You Configure.)

The code is already written and dormant. When you fill in 5 environment variables, the app automatically switches from "demo mode" to live Stripe Checkout. Here's how to get those values.

### Step 1: Create your Stripe account

1. Go to **https://stripe.com** → Sign up
2. Verify your email + business details (Stripe will ask for your name, address, bank account for payouts)
3. Make sure you're in **Test Mode** (top right toggle) while you're building — Test Mode uses fake cards so you can practice without risking real charges

### Step 2: Create two products

In the Stripe Dashboard → **Products** → **Add product**

**Product 1 — One-time premium**
- Name: `Tender Trimesters Premium (One-time)`
- Description: `Lifetime access to all Tender Trimesters premium features, including the Mommies Matter ebook, affirmation deck, partner letters templates, and future premium releases.`
- Pricing: **One-time** → $9.99 USD
- Click **Save product**
- On the product page, scroll down to **Pricing** → copy the `price_...` ID (starts with `price_`)

**Product 2 — Monthly subscription**
- Name: `Tender Trimesters Premium (Monthly)`
- Description: `Monthly access to all Tender Trimesters premium features. Cancel anytime.`
- Pricing: **Recurring** → $4.99 USD → billing period: monthly
- Click **Save product**
- Copy the `price_...` ID

### Step 3: Get your API keys

Stripe Dashboard → **Developers** → **API keys**

- **Publishable key** — starts with `pk_test_` (you don't actually need this for our flow because we use hosted Checkout, but you may want it later)
- **Secret key** — starts with `sk_test_` — click **Reveal test key** and copy it

### Step 4: Set up the webhook (this is what makes premium "magically" unlock after payment)

A webhook is a URL that Stripe pings whenever something happens (like a successful payment). Ours lives at `/api/stripe/webhook`.

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: depends on where your app is running
   - Local testing: `https://<your-ngrok-or-cloudflare-tunnel-url>/api/stripe/webhook` (Stripe can't reach `localhost` directly — see "Testing webhooks locally" below)
   - Production: `https://yourdomain.com/api/stripe/webhook`
3. **Events to send**: select these two
   - `checkout.session.completed`
   - `customer.subscription.deleted`
4. Click **Add endpoint**
5. On the endpoint detail page, find **Signing secret** → click **Reveal** → copy the `whsec_...` value

### Step 5: Fill in your environment variables

#### For local development (`/home/z/my-project/.env`):

```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxx
STRIPE_ONE_TIME_PRICE_ID=price_xxxxxxxxxxxxxxxxxx
STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_CONFIGURED=1
```

After saving, restart your dev server. The UpgradeDialog will now route through Stripe Checkout.

#### For production (Vercel):

Dashboard → your project → **Settings** → **Environment Variables** → add the same 5 vars. Mark the first 4 as "Production and Preview" only (NOT Development — your dev stays in demo mode). Set `NEXT_PUBLIC_STRIPE_CONFIGURED=1` for Production only.

### Step 6: Test the full flow

**Test cards** (Stripe provides these for Test Mode):
- Successful payment: `4242 4242 4242 4242`
- Declined payment: `4000 0000 0000 0002`
- Use any future expiry date and any CVC

1. Sign in to your app locally
2. Profile → Upgrade → choose One-time or Monthly → Continue
3. You'll be redirected to Stripe Checkout
4. Use `4242 4242 4242 4242` + any future date + any CVC
5. Click Pay
6. You should land back at `/?premium=success` and see "Welcome to Premium 💛"
7. Check Stripe Dashboard → **Payments** — you'll see the test payment
8. Check your database — the user's `isPremium` is now `true`

### Testing webhooks locally

Stripe can't reach `localhost`. Two options:

**Option A — Stripe CLI (recommended)**

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

It prints a `whsec_...` value — use THAT as your `STRIPE_WEBHOOK_SECRET` for local testing. (It's different from your dashboard webhook secret.)

**Option B — cloudflared / ngrok tunnel**

```bash
# Install cloudflared
cloudflared tunnel --url http://localhost:3000
# Copy the https://xxx.trycloudflare.com URL
# Use that as your webhook endpoint in Stripe Dashboard
```

### Going live

When you're ready to accept real money:

1. Stripe Dashboard → flip **Test Mode** toggle to **Live**
2. Repeat Step 3 to get your live `sk_live_...` key
3. Create the same two products in Live mode (price IDs are different in test vs live!)
4. Repeat Step 4 to create a live webhook endpoint
5. Update your Vercel env vars with the live values
6. Redeploy

That's it. The code doesn't change between test and live — only the keys do.

---

## PART 2 — Going Live (Deployment + Domain)

You said you have your domain. Here's how to actually launch.

### Recommended host: Vercel

Vercel is the company behind Next.js. It's by far the easiest place to host a Next.js app — push to GitHub, Vercel auto-deploys. Free tier covers your early traffic.

### Step-by-step

1. **Push your code to GitHub**
   - Create a new repo at github.com (call it `tender-trimesters` or `mommies-matter-app`)
   - From your project root:
     ```bash
     git init
     git add .
     git commit -m "Initial commit — Tender Trimesters"
     git branch -M main
     git remote add origin git@github.com:YOUR_USERNAME/tender-trimesters.git
     git push -u origin main
     ```
   - **CRITICAL**: Make sure `.env` is in `.gitignore` (it is by default — verify with `cat .gitignore | grep env`). You do NOT want your Stripe keys on GitHub.

2. **Connect Vercel**
   - Go to **https://vercel.com** → Sign up with your GitHub account
   - Click **Add New** → **Project** → import your `tender-trimesters` repo
   - Vercel auto-detects Next.js — leave all defaults
   - Click **Deploy**
   - First deploy takes ~2 minutes. You'll get a `https://tender-trimesters-xxx.vercel.app` URL

3. **Add your environment variables in Vercel**
   - Project → **Settings** → **Environment Variables**
   - Add all the vars from your `.env` file (NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL, plus all 5 Stripe vars)
   - For `NEXTAUTH_URL`, use your Vercel URL (e.g. `https://tender-trimesters-xxx.vercel.app`) — or your custom domain once connected
   - **Important**: keep `NEXT_PUBLIC_STRIPE_CONFIGURED` empty for Preview env (so you can still test in demo mode on preview URLs) and set to `1` only for Production
   - Redeploy after adding vars (Project → Deployments → click ⋮ on latest → Redeploy)

4. **Connect your database**
   - Your current `DATABASE_URL` points to a local SQLite file. That works for dev but won't work on Vercel — Vercel's filesystem is read-only after deploy.
   - **Easiest free option**: Vercel Postgres — Dashboard → Storage → Create → Postgres → connect to project. Vercel gives you a `DATABASE_URL` you can paste into env vars.
   - **Better long-term**: Neon (https://neon.tech) — free tier, serverless Postgres, branches for testing
   - Once you have your prod database URL, update the Prisma datasource URL in Vercel env vars, then run `prisma db push` against it (or use Vercel's build hook to do it automatically)
   - **Don't forget**: also seed the 40-week content into your prod database. From your local machine, set `DATABASE_URL` to your prod database URL temporarily and run your seed script.

5. **Connect your custom domain**
   - Vercel Project → **Settings** → **Domains** → enter `tendertrimesters.com` (or whatever yours is)
   - Vercel shows you DNS records to add at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)
   - Add an **A record** pointing to Vercel's IP, and a **CNAME** for `www`
   - DNS propagation takes 5 min to 24 hours
   - Vercel automatically provisions HTTPS (Let's Encrypt) — no extra steps
   - Update `NEXTAUTH_URL` env var to your custom domain
   - Update your Stripe webhook endpoint URL to `https://yourdomain.com/api/stripe/webhook`

6. **Final pre-launch checklist**
   - [ ] Sign up flow works on prod URL
   - [ ] Stripe checkout completes with a real card (use $0.50 test amount or your real $9.99)
   - [ ] Webhook fires — check Vercel logs (Project → Deployments → Logs) and Stripe Dashboard → Webhooks → your endpoint → should show 200 responses
   - [ ] Partner link opens from a fresh browser
   - [ ] All 5 pages work (Home, Calendar, Journal, Tempie, Profile)
   - [ ] Mobile responsive — open on your phone
   - [ ] Privacy Policy page is live (you'll need this for app stores and Stripe)
   - [ ] Terms of Service page is live

### Privacy Policy & Terms

You mentioned needing these — they're required by Stripe, app stores, and most ad platforms. Use a generator like Termly or iubenda to draft them, then we can drop them into your app as simple `/privacy` and `/terms` routes. Let me know when you're ready for that and I'll add the pages.

---

## PART 3 — Social Media Strategy: Add People or Just Post?

**Short answer: both, but in a specific ratio that changes as you grow.**

The "post and they will come" approach works eventually, but it's painfully slow at first. The "add everyone" approach gets you followers fast but they're often the wrong audience (your high school classmates aren't necessarily pregnant). Here's the smarter play.

### Phase 1 (Weeks 1–4): Foundation — 70% posting, 30% engaging

Your goal is to give people a reason to follow you BEFORE you start asking them to. If your profile has 2 posts and you start adding people, they'll land on your page and bounce.

**Posting** (5x/week):
- 1 Affirmation post (use your affirmation card PDFs as graphics)
- 1 Educational post (a tip, a stat, a "did you know")
- 1 Personal/Helena-Ann story post (your why, your pregnancy journey)
- 1 Engagement post (poll, question, "drop your due date below")
- 1 Behind-the-scenes or product post (app preview, ebook page, etc.)
- Use the **social-content-kit.docx** and **content-calendar.xlsx** I generated for you — they have 30 captions and 90 days of daily posts ready to copy-paste

**Engaging** (15 min/day):
- Search hashtags: `#pregnant`, `#firsttrimester`, `#pregnancyjourney`, `#momtobe`, `#expectingmom`, `#pregnancytips`, `#doulalife`, `#birthingcommunity`
- Find 10 pregnant accounts per day. Like 3 of their posts. Leave a genuine comment on 1.
- Find 5 doulas/midwives/OB-GYNs per week. Comment on their content. Don't pitch yet — just be present.
- Reply to every comment on your own posts within 24 hours (algorithm rewards this)

### Phase 2 (Weeks 5–12): Growth — 50% posting, 50% engaging + outreach

Now your profile looks legit. Time to actively bring people in.

**Keep posting** the same 5x/week cadence.

**Active outreach**:
- DM 5 pregnancy accounts per week with a personal note (NOT a pitch). Example: "Your bump photos are gorgeous — how far along are you?"
- DM 2 doulas/midwives per week using the templates in **influencer-outreach.docx**
- Comment on 3 posts in relevant Facebook groups per week (don't link drop — just be helpful, your profile will lead them to you)
- Start a Pinterest account — pin every affirmation card and blog post (Pinterest is HUGE for pregnancy content, drives passive traffic for years)

### Phase 3 (Month 4+): Authority — 80% posting, 20% engaging

By now you have a small but engaged audience. The strategy shifts:

**Posting cadence increases** to 6-7x/week, with more long-form content:
- Add Reels/short-form video 3x/week (capcut + your affirmation cards + trending audio)
- Start a weekly "Tempie Tuesday" Q&A in Stories (use the Tempie AI persona)
- Post one carousel per week (10 slides, educational deep-dive)

**Engaging** becomes mostly reactive — you reply to comments and DMs, you don't proactively seek out new accounts as much. Your community starts doing the outreach for you (shares, tags, word of mouth).

### The "Should I follow people first?" question

Yes — strategic following is fine early on. Rules of thumb:

- Follow **pregnancy-related accounts only** (don't follow randoms — it dilutes your algorithm)
- Follow **max 30/day** on Instagram (more than that triggers spam filters)
- Don't unfollow later — it looks petty and Instagram can shadowban you for follow/unfollow patterns
- After you hit ~500 followers, stop the proactive following entirely and switch to pure content + engagement

### Where to be

For your audience (English-speaking, US-centric, pregnant women 25-40):

| Platform | Priority | Why |
|----------|----------|-----|
| **Instagram** | 1 | Where pregnant women hang out. Reels are your biggest growth lever. |
| **Pinterest** | 2 | Long-tail traffic. Every pin lives for years. Affirmation cards = perfect Pinterest content. |
| **TikTok** | 3 | Best for raw reach if you're comfortable on camera. Lower-quality audience but huge volume. |
| **Facebook Group** | 4 | Start your own private "Mommies Matter Community" group once you have 200+ followers. |
| **YouTube** | 5 | Long-form later. Not now — too much production overhead. |
| **X/Twitter** | 6 | Skip for now. Wrong audience. |

### What NOT to do

- Don't buy followers. Ever. Kills your engagement rate, brands will see through it.
- Don't post 5 things in one day then disappear for a week. Consistency > volume.
- Don't link to your app in every post. 1 in 5 posts can have a soft CTA. The other 4 should just be valuable.
- Don't get discouraged before 90 days. Social growth is a flat line that suddenly spikes. You will feel invisible for the first 60 days. That's normal.

---

## PART 4 — The New Features You Said Yes To

You said you're down with **Community Feed**, **Audio Meditations**, and **Kick Counter**. Here's how I'd sequence them and what each one unlocks.

### Recommended build order

1. **Kick Counter** (smallest scope, fastest win — 1–2 days of work)
2. **Audio Meditations** (medium scope, high perceived value — 3–5 days)
3. **Community Feed** (largest scope, biggest engagement lift — 5–7 days)

### Feature 1: Kick Counter (Premium)

**What it is**: A simple tool to track fetal movements during the third trimester. Standard medical advice is to count 10 kicks in 2 hours, usually starting around week 28.

**Why it matters**: It's the kind of utility mamas search for. "Kick counter app" gets ~5K searches/month. It's a top-of-funnel acquisition tool that brings people into your ecosystem.

**Scope**:
- New screen accessible from Home dashboard (premium-gated)
- "Start session" button → starts a 2-hour timer
- Big "I felt a kick!" button — each tap increments counter
- Shows count + time remaining + average interval
- When 10 kicks reached: "You've reached 10 kicks. if this took less than 2 hours, that's a great sign."
- When 2 hours pass without 10 kicks: gentle prompt to call provider (NOT medical advice — clear disclaimer)
- Saves each session to DB so mama can see history
- Optional: share summary to partner via the partner link

**Data model**:
```prisma
model KickSession {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(...)
  startedAt DateTime
  endedAt   DateTime?
  kickCount Int      @default(0)
  week      Int?
  notes     String?
}
```

### Feature 2: Audio Meditations (Premium)

**What it is**: Short guided audio tracks (3-10 min) for different pregnancy moments — first-trimester nausea, third-trimester sleep anxiety, birth prep, postpartum prep, etc.

**Why it matters**: This is your highest-value premium feature. Meditation apps charge $10-20/month. Including 8-12 tracks in your $9.99 lifetime bundle makes the upgrade a no-brainer.

**Scope**:
- New "Meditations" tab in the bottom nav (replaces or augments an existing one)
- Library screen with categories: First Trimester, Second, Third, Birth Prep, Postpartum, Sleep, Anxiety
- Audio player with play/pause/seek, beautiful background image, optional background music
- "Mark as favorite" → quick access later
- "Continue listening" resume point
- Weekly featured meditation on Home dashboard
- Companion journal prompt after each meditation ("How do you feel right now?" with mood selector)

**Where to get the audio**:
- **Option A — Record your own** (most authentic, on-brand): write 12 scripts (I can help), record on your phone with a $40 lavalier mic, edit in GarageBand or Audacity (free). Total time: ~6-8 hours.
- **Option B — License from a creator**: pay a meditation teacher on Fiverr to record your scripts. ~$200-400 for 12 tracks. Faster, less authentic.
- **Option C — AI-generated voice** (use the TTS skill): I can generate natural-sounding audio for you using the z-ai-web-dev-sdk. Free, fast, decent quality. Slightly less emotional than your real voice.

**Hosting the audio files**:
- Don't host on Vercel — audio files are large and would blow your bandwidth quota
- Use Cloudflare R2 (10GB free, no egress fees) or AWS S3 + CloudFront
- Or simpler: upload to a service like Buzzsprout or Transistor ($12-19/month) and embed their player
- Or simplest: Vimeo (yes, Vimeo — they support audio-only files and you get unlimited hosting for $7/month)

**Data model**:
```prisma
model Meditation {
  id          String  @id @default(cuid())
  title       String
  category    String  // "first_trimester" | "second_trimester" | etc.
  durationSec Int
  audioUrl    String  // external URL
  coverUrl    String?
  description String
  sortOrder   Int     @default(0)
  isPremium   Boolean @default(true)
  // Tracking
  favorites   MeditationFavorite[]
  progress    MeditationProgress[]
}

model MeditationFavorite {
  id           String @id @default(cuid())
  userId       String
  meditationId String
  createdAt    DateTime @default(now())
}

model MeditationProgress {
  id           String @id @default(cuid())
  userId       String
  meditationId String
  positionSec  Int    @default(0)
  completedAt  DateTime?
  updatedAt    DateTime @updatedAt
}
```

### Feature 3: Community Feed (Premium)

**What it is**: A private, mama-only feed where premium members can post updates, ask questions, and support each other. Think of it as a kinder, smaller Reddit for pregnancy.

**Why it matters**: This is your retention engine. People come for the tools, they stay for the community. Also: it's the single biggest differentiator from generic pregnancy apps.

**Scope**:
- Community tab in the bottom nav (premium-gated)
- Feed of posts (text + optional photo), sorted by recency with a "popular this week" toggle
- Filter by trimester (so mamas in the same stage find each other)
- Filter by topic tag: "first pregnancy", "high risk", "after loss", "multiples", "rainbow baby", "single mom", "over 35"
- Reply/comment threads
- "Hug" reaction (instead of like — softer)
- Save/bookmark posts
- Report button (mamas can flag for review)
- Daily prompt from Tempie ("Today's community question: What surprised you most about your first trimester?")
- Mandatory community guidelines onboarding (1-time) before first post

**Moderation**:
- You'll need to check the feed daily for the first 100 users (then it self-regulates with reporting)
- Auto-filter profanity + banned words (simple word list)
- Make the community guidelines clear: no medical advice, no fear-mongering, kindness required
- Consider a "silent mode" — Tempie auto-responds to posts that go 24h without a reply, so no one feels ignored

**Data model** (already partly in your schema as `CommunityPost` and `CommunityComment`):
- Add `Mention`, `Hug`, `SavedPost`, `ReportFlag` models
- Add `topicTags` field to CommunityPost (string array or relation)

---

## PART 5 — More Suggestions (Beyond What You Asked For)

Here are 8 more feature ideas, ranked by impact-to-effort ratio. Take what resonates, leave what doesn't.

### 1. Contraction Timer (Premium) — HIGH IMPACT, LOW EFFORT
- Same UI pattern as the kick counter. Big "Start contraction" button, logs duration + interval.
- At active labor pattern (4-1-1 rule), prompts "Time to call your provider?"
- Saves the timeline so mama can show the triage nurse
- **Why**: Essential third-trimester utility. Often searched for. Quick to build since you'll already have the kick-counter pattern.

### 2. Birth Plan Builder (Premium) — HIGH IMPACT, MEDIUM EFFORT
- Step-by-step wizard: pain management, delivery positions, who's in the room, interventions you want/don't want, newborn care preferences
- Outputs a beautiful 1-page PDF mama can print and bring to her provider
- **Why**: Massive perceived value. People will upgrade just for this. Easy to write the content (I can do it).

### 3. Hospital Bag Checklist (Free, top-of-funnel) — MEDIUM IMPACT, LOW EFFORT
- Interactive checklist organized by: For Mama, For Partner, For Baby, For Postpartum, Optional Comfort Items
- Save progress, share with partner
- **Why**: Bring people into the app for free, then they see premium upsells. Highly shareable.

### 4. Weekly Email Digest (Free, low effort) — HIGH IMPACT
- Every Sunday, auto-send an email with: this week's content, mood summary, journal prompt, affirmation, partner tip
- Use Resend ($0 for first 100 emails/month, super easy API)
- Drives app re-engagement
- **Why**: Email is the #1 retention channel for content apps. You already have the content, just need to template + send.

### 5. Partner Reminders (Premium) — MEDIUM IMPACT, MEDIUM EFFORT
- Partner gets push notifications: "It's Week 24 — mama's baby is the size of a cantaloupe. Send her a kind text today."
- Or weekly SMS: "Mama has an appointment Wednesday. Offer to drive her."
- **Why**: Massive perceived value for partners who want to help but don't know how. Differentiates from competitor apps.

### 6. Bump Photo Timeline with Comparison (Premium) — MEDIUM IMPACT, LOW EFFORT
- You already have bump photos in the schema. Extend it: side-by-side week-by-week grid, optional comparison to "average" bump size
- Generate a beautiful "my pregnancy journey" video at the end (use ffmpeg to stitch photos)
- **Why**: Highly shareable at the end of pregnancy = free marketing. Already 60% built (BumpPhoto model exists).

### 7. Postpartum Mode (Premium) — HIGH IMPACT, HIGH EFFORT
- After due date, app transitions to postpartum mode
- Track feeding (breast/bottle), sleep, diapers, mood (PHQ-2 screener)
- 6-week postpartum check-in content
- "How are you really doing?" check-in with resources if signs of PPD
- **Why**: Most apps end at birth. Continuing through postpartum = retention + meaningful differentiator. This is a v2 feature — build it after the 3 you confirmed.

### 8. "Letters to Baby" Templates (Premium) — LOW EFFORT, HIGH EMOTIONAL IMPACT
- Pre-written letter templates for milestones: "Letter to my baby at 12 weeks", "Letter before the anatomy scan", "Letter on your due date"
- Beautifully designed, fill-in-the-blank, exports to PDF
- Mama can collect them in a "keepsake book" she can print at the end
- **Why**: This is the kind of feature that makes people cry (you mentioned tears — this is tears). Easy to build since you already have PDF generation working.

---

## PART 6 — Recommended 30-Day Roadmap

If you want a concrete plan, here's what I'd do next:

**Week 1 (right now):**
- Set up Stripe (Parts 1-2 of this doc)
- Deploy to Vercel + connect your domain
- Write Privacy Policy + Terms (I can do this for you when ready)
- Soft-launch to 5-10 friends/family for feedback

**Week 2:**
- Start social media (Phase 1 above)
- Set up your email list (ConvertKit free tier — 1K subscribers free)
- Send the 5-email nurture sequence from **launch-announcement.docx** to your waitlist
- Build **Kick Counter** feature (smallest scope, quick win)

**Week 3:**
- Build **Audio Meditations** (write 8 scripts, record with TTS or your own voice, host on Cloudflare R2)
- Continue social posting 5x/week
- Reach out to 5 doulas using **influencer-outreach.docx**

**Week 4:**
- Build **Community Feed**
- Official public launch (post on all your channels, email your list, ask friends to share)
- Begin Phase 2 social strategy

**Month 2+:**
- Build Birth Plan Builder (high-impact premium feature)
- Set up weekly email digest
- Start Pinterest account + pin affirmation cards
- Recruit 3-5 ambassador moms (free premium for being active in the community + posting about the app)

---

## What I Can Help With Next

Pick any of these and I'll start:

1. **Build Kick Counter now** — I can start coding it immediately
2. **Write the 8 meditation scripts** for you to record
3. **Generate the meditation audio** using TTS (free, instant)
4. **Write Privacy Policy + Terms** pages and add them to your app
5. **Build Birth Plan Builder** as your next premium feature
6. **Set up the weekly email digest** (Resend integration)
7. **Build the Community Feed** next (instead of kick counter first)
8. **Optimize your landing page for SEO** (so people searching "pregnancy journal app" find you)

Just say the word and I'll start. You've built something real and beautiful — now let's get it into mamas' hands.
