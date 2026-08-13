const { Document, Packer, Paragraph, TextRun, Header, Footer,
        AlignmentType, HeadingLevel, PageNumber, PageBreak, Table, TableRow, TableCell,
        WidthType, BorderStyle, ShadingType, TableLayoutType, SectionType } = require("docx");
const fs = require("fs");

// ---- Palette: GO-1 (Graphite Orange) for plans ----
const P = {
  bg: "1A2330", primary: "D4875A", body: "2C3E50", secondary: "607080",
  accent: "D4875A", surface: "F8F0EB",
  titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078",
  tableHeaderBg: "D4875A", tableHeaderText: "FFFFFF", tableAccentLine: "D4875A",
  tableInnerLine: "DDD0C8", tableSurface: "F8F0EB",
};
const c = (hex) => hex.replace("#", "");

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ---- Cover R4 ----
function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  const charWidth = (pt) => pt * 20;
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = title.length <= cpl ? [title] : [title];
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    lines = [title]; titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function emptyPara() { return new Paragraph({ children: [] }); }

function buildCoverR4(config) {
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 26);
  const titleSize = titlePt * 2;

  const titleBlockHeight = titleLines.length * (titlePt * 23 + 200);
  const englishLabelH = config.englishLabel ? (9 * 23 + 500) : 0;
  const subtitleH = config.subtitle ? (12 * 23 + 200) : 0;
  const upperContentH = englishLabelH + titleBlockHeight + subtitleH;
  const UPPER_MIN = 7500;
  const UPPER_H = Math.max(UPPER_MIN, upperContentH + 1500 + 800);
  const DIVIDER_H = 60;

  const contentEstimate = (config.englishLabel ? (9 * 23 + 500) : 0) + titleLines.length * (titlePt * 23 + 200) + (config.subtitle ? (12 * 23 + 200) : 0);
  const spacerIntrinsic = 280;
  const topSpacing = Math.max(UPPER_H - contentEstimate - spacerIntrinsic - 800, 400);

  const upperBlock = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE }, layout: TableLayoutType.FIXED, borders: allNoBorders,
    rows: [new TableRow({
      height: { value: UPPER_H, rule: "exact" },
      children: [new TableCell({
        shading: { fill: P.bg }, borders: noBorders, verticalAlign: "top",
        margins: { left: padL, right: padR },
        children: [
          new Paragraph({ spacing: { before: topSpacing } }),
          config.englishLabel ? new Paragraph({
            spacing: { after: 500 },
            children: [new TextRun({ text: config.englishLabel.split("").join("  "),
              size: 18, color: P.accent, font: { ascii: "Calibri" }, characterSpacing: 60 })],
          }) : null,
          ...titleLines.map((line, i) => new Paragraph({
            spacing: { after: i < titleLines.length - 1 ? 100 : 200 },
            children: [new TextRun({ text: line, size: titleSize, bold: true,
              color: P.titleColor, font: { ascii: "Arial" } })],
          })),
          config.subtitle ? new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: config.subtitle, size: 24, color: P.subtitleColor,
              font: { ascii: "Calibri" } })],
          }) : null,
        ].filter(Boolean),
      })],
    })],
  });

  const divider = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE }, borders: allNoBorders,
    rows: [new TableRow({
      height: { value: DIVIDER_H, rule: "exact" },
      children: [new TableCell({ borders: noBorders, shading: { fill: P.accent }, children: [emptyPara()] })],
    })],
  });

  const lowerContent = [
    new Paragraph({ spacing: { before: 800 } }),
    ...(config.metaLines || []).map(line => new Paragraph({
      indent: { left: padL }, spacing: { after: 100 },
      children: [new TextRun({ text: line, size: 28, color: P.metaColor, font: { ascii: "Calibri" } })],
    })),
    new Paragraph({ spacing: { before: 2000 } }),
    new Paragraph({
      indent: { left: padL },
      children: [
        new TextRun({ text: config.footerLeft || "", size: 22, color: "909090" }),
        new TextRun({ text: "          " }),
        new TextRun({ text: config.footerRight || "", size: 22, color: "909090" }),
      ],
    }),
  ];

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE }, layout: TableLayoutType.FIXED, borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { fill: "FFFFFF" }, borders: noBorders, verticalAlign: "top",
        children: [upperBlock, divider, ...lowerContent],
      })],
    })],
  })];
}

// ---- Body helpers ----
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 480, after: 240 },
    children: [new TextRun({ text, bold: true, size: 32, color: c(P.body), font: { ascii: "Arial" } })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, bold: true, size: 28, color: c(P.accent), font: { ascii: "Arial" } })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, color: c(P.body), font: { ascii: "Arial" } })],
  });
}

function body(text) {
  return new Paragraph({
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri" } })],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { line: 312, after: 60 }, indent: { left: 400, hanging: 240 },
    children: [
      new TextRun({ text: "\u2022  ", size: 24, color: c(P.accent) }),
      new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri" } }),
    ],
  });
}

function dayHeader(day, title) {
  return new Paragraph({
    spacing: { before: 300, after: 100, line: 312 },
    children: [
      new TextRun({ text: `Day ${day}: `, bold: true, size: 24, color: c(P.accent), font: { ascii: "Arial" } }),
      new TextRun({ text: title, bold: true, size: 24, color: c(P.body), font: { ascii: "Arial" } }),
    ],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { line: 312, after: 80 }, indent: { left: 400 },
    children: [new TextRun({ text, size: 22, italics: true, color: c(P.secondary), font: { ascii: "Calibri" } })],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: c(P.tableInnerLine), space: 4 } },
    children: [],
  });
}

// ---- Content ----
const coverChildren = buildCoverR4({
  title: "Marketing Launch Plan",
  subtitle: "Tender Trimesters by Mommies Matter",
  englishLabel: "M O M M I E S   M A T T E R",
  metaLines: [
    "30-Day Launch Marketing Schedule",
    "Pre-Launch \u2022 Launch Week \u2022 Post-Launch Growth",
    "Prepared: August 2026",
  ],
  footerLeft: "Confidential",
  footerRight: "Helena-Ann Baker, Founder",
  palette: P,
});

const bodyContent = [
  // ------ EXECUTIVE SUMMARY ------
  h1("Executive Summary"),
  body("This document outlines the complete 30-day marketing plan for Tender Trimesters, a pregnancy companion app built under the Mommies Matter brand. The plan is organized into three strategic phases: Pre-Launch Foundation (Days 1-14), Launch Week (Days 15-21), and Post-Launch Growth (Days 22-30). Each day includes specific tactical actions across social media, content creation, community building, partnerships, and paid acquisition channels. The target audience is expectant mothers in their first trimester, aged 22-38, who are seeking emotional support, practical guidance, and a beautiful digital companion for their pregnancy journey."),
  body("The app's unique value proposition centers on nine signature features including AI-powered Letters from Baby, Fear to Flame emotional reframing, Belly Bonding rituals, DreamKeeper journaling, Name Garden, Time Capsule, Birth Playlist builder, Hormone Horoscope, and My Mother's Mother generational storytelling. Combined with weekly content, appointment tracking, bump photo galleries, and an AI companion named Tempie, Tender Trimesters offers the most emotionally intelligent pregnancy experience available."),

  divider(),

  // ------ PHASE 1: PRE-LAUNCH ------
  h1("PHASE 1: Pre-Launch Foundation (Days 1-14)"),
  body("The two weeks before launch are dedicated to building infrastructure, creating content assets, establishing social media presence, and generating early buzz. Every piece of content created during this phase should be queued and ready to deploy during launch week for maximum impact."),

  h2("Days 1-3: Brand Foundation & Asset Creation"),

  dayHeader(1, "Brand Audit & Finalize Visual Identity"),
  body("Review all brand assets including logos, color palette (moss greens, blush pinks, rose gold, cream, sage, terracotta, lavender, butter), typography (Cormorant Garamond, Montserrat, Dancing Script), and messaging guidelines. Ensure consistency across all platforms. Take screenshots of the app's key screens (Home, Calendar, Journal, Tempie chat) for marketing use. Record a 60-second screen capture video showing the app experience from onboarding through the weekly calendar view. These assets become the foundation for all subsequent content creation throughout the campaign."),
  bullet("Audit: app screenshots (Home, Calendar, Journal, Tempie, More, Profile) in both light and dark modes"),
  bullet("Create: brand style guide PDF with fonts, colors, logo usage, and tone of voice"),
  bullet("Record: 30-second promo video showing the app experience end-to-end"),
  bullet("Set up: Canva brand kit with all visual assets for quick content creation"),

  dayHeader(2, "Social Media Account Setup & Optimization"),
  body("Claim and optimize all social media handles for Mommies Matter and Tender Trimesters across Instagram, TikTok, Facebook, Pinterest, and YouTube. Write compelling bios that communicate the app's value in one sentence. Create profile banners using the brand palette. On Instagram, set up a business account with contact buttons and link in bio. On TikTok, optimize for the algorithm by selecting the most relevant content categories. On Pinterest, create boards for pregnancy tips, nursery inspiration, baby names, and self-care during pregnancy. On YouTube, set up the channel with a branded banner and trailer video."),
  bullet("Instagram: @mommiesmatter and @tendertrimesters with unified bio messaging"),
  bullet("TikTok: Set up with pregnancy wellness content category selection"),
  bullet("Pinterest: Create 10 boards covering key pregnancy interest areas"),
  bullet("Facebook: Create Mommies Matter page with CTA button to waitlist"),
  bullet("YouTube: Set up channel, upload trailer video as featured content"),

  dayHeader(3, "Landing Page & Email Waitlist"),
  body("Build a simple, beautiful landing page using the app's brand palette. The page should communicate the app's core value proposition in under 10 seconds, feature 3-4 hero screenshots, display social proof (if available), and include a prominent email waitlist sign-up form. Use Mailchimp or ConvertKit for email collection. Add a referral mechanism: early signups who share the waitlist with friends get priority access. The landing page should be mobile-first since 85%+ of expectant mothers will discover the app on their phones. Include an FAQ section addressing common questions about the app's features, pricing, and launch timeline."),
  bullet("Deploy landing page at tendertrimesters.com with waitlist form"),
  bullet("Set up email welcome sequence (3 emails: welcome, feature preview, launch countdown)"),
  bullet("Add referral mechanism: share for priority access"),
  bullet("Create Google Analytics and Meta Pixel tracking for retargeting"),

  h2("Days 4-7: Content Creation & Community Seeding"),

  dayHeader(4, "Create First 5 Instagram Posts"),
  body("Design and schedule the first batch of Instagram content using Canva. Focus on educational and emotional value, not hard selling. Each post should stand on its own merit as useful pregnancy content while subtly showcasing the app. Use carousel format for educational posts (e.g., '5 things nobody tells you about your first trimester') and single image for emotional/aesthetic content. Write captions that encourage saves and shares. Include 20-25 relevant hashtags per post mixing broad pregnancy tags with niche long-tail tags. Schedule posts using Later, Buffer, or Meta Business Suite for the next 7 days."),
  bullet("Post 1 (Carousel): 'What your baby is doing right now' - weekly development facts"),
  bullet("Post 2 (Reel): Screen recording of Tempie AI companion demo (15 sec)"),
  bullet("Post 3 (Single): 'Every fear you name is a fear you can face' - emotional quote card"),
  bullet("Post 4 (Carousel): 'Your pregnancy rights at work - what to know' - practical guide"),
  bullet("Post 5 (Reel): Belly Bonding ritual preview with calm music overlay (20 sec)"),

  dayHeader(5, "Launch TikTok Content Strategy"),
  body("TikTok requires a fundamentally different approach than Instagram. The algorithm favors authentic, raw, and relatable content over polished production. Create 3-5 short-form videos that feel native to the platform. The best-performing pregnancy content on TikTok includes week-by-week updates, reaction videos, 'things I wish I knew' lists, and day-in-the-life content. Film content using a phone camera for authenticity. Add text overlays using trending TikTok fonts. Research trending sounds and incorporate them naturally. Post 1-2 times per day during this phase to train the algorithm on your content niche."),
  bullet("Video 1: 'Week 8 update - the things nobody warned me about' (talking head, authentic)"),
  bullet("Video 2: 'POV: You just found out you're pregnant and downloaded this app' (trend format)"),
  bullet("Video 3: '3 pregnancy apps I tried so you don't have to' (comparison/review format)"),
  bullet("Video 4: Screen recording of Letters from Baby feature with emotional reaction"),

  dayHeader(6, "Pinterest Strategy & SEO Foundation"),
  body("Pinterest is a search engine, not just social media. Every pin should be optimized for discovery through keyword-rich descriptions, relevant board organization, and consistent pinning. Create 15-20 pins linking to the landing page. Mix formats: tall infographic pins (2:3 ratio) for educational content, lifestyle pins featuring pregnancy aesthetics, and video pins repurposing TikTok content. Research high-volume pregnancy search terms using Pinterest's search suggestions and Google Keyword Planner. Focus on terms like 'pregnancy timeline,' 'first trimester tips,' 'what to expect week by week,' 'pregnancy journal ideas,' and 'baby name inspiration.'"),
  bullet("Create 15 SEO-optimized pins with keyword-rich descriptions"),
  bullet("Organize into boards: Pregnancy Timeline, Self-Care, Nursery Ideas, Baby Names, Journaling"),
  bullet("Pin consistently: 5-8 pins per day using a scheduling tool like Tailwind"),
  bullet("Research and document top 50 pregnancy-related search terms for ongoing SEO"),

  dayHeader(7, "Join Pregnancy Facebook Groups & Reddit Communities"),
  body("Organic community engagement is the most authentic and cost-effective marketing channel for an app like Tender Trimesters. Join 10-15 active pregnancy Facebook groups and subreddits (r/BabyBumps, r/pregnant, r/FirstTrimester, r/Mommit). The goal is NOT to promote the app directly (most groups ban self-promotion), but to establish the Mommies Matter brand as a genuinely helpful, knowledgeable, and empathetic voice in the pregnancy space. Answer questions thoughtfully. Share relevant content. Be a real person, not a marketer. Over time, community members will naturally discover and share the app organically when they recognize the brand from helpful interactions."),
  bullet("Join: 5-7 Facebook pregnancy groups (January 2026 due date groups ideal)"),
  bullet("Join: r/BabyBumps, r/pregnant, r/FirstTrimester, r/NewParents, r/Mommit"),
  bullet("Daily action: Respond to 5-10 posts per platform with genuinely helpful advice"),
  bullet("Content rule: 80% helpful advice, 15% personal pregnancy stories, 5% soft app mentions"),

  h2("Days 8-11: Influencer Outreach & Partnership Development"),

  dayHeader(8, "Build Micro-Influencer Outreach List"),
  body("Identify 30-50 micro-influencers (1K-50K followers) in the pregnancy and motherhood space. Micro-influencers have higher engagement rates and more authentic connections with their audiences than large accounts. Look for accounts that share values aligned with Tender Trimesters: emphasis on emotional wellness, natural/organic living, mindfulness during pregnancy, and mental health awareness. Use tools like Modash, HypeAuditor, or manual Instagram research to build the list. Track each influencer in a spreadsheet with their handle, follower count, engagement rate, content style, contact email, and partnership status."),
  bullet("Target profile: Pregnancy/motherhood creators, 1K-50K followers, 3%+ engagement rate"),
  bullet("Prioritize: Creators who focus on emotional wellness, not just product reviews"),
  bullet("Track in spreadsheet: handle, followers, engagement, content style, email, status"),
  bullet("Research: Look for creators who have expressed pregnancy anxiety or journaling interests"),

  dayHeader(9, "Draft Partnership Proposals"),
  body("Create personalized outreach templates for three tiers of partnership: (1) Free premium access in exchange for honest review, (2) Paid sponsored content for creators with 10K+ followers, and (3) Affiliate/revenue-share partnerships for creators who want ongoing income. Each proposal should feel personal, not templated. Reference specific content the creator has made and explain why Tender Trimesters aligns with their audience. Keep initial DMs or emails short and genuine. The goal of the first message is simply to start a conversation, not to close a deal."),
  bullet("Tier 1 (1-10K): Free lifetime premium + feature request input"),
  bullet("Tier 2 (10-50K): $100-300 sponsored post + free premium"),
  bullet("Tier 3 (50K+): Custom package with revenue share on referrals"),
  bullet("Draft 3 DM templates and 2 email templates, each personalized"),

  dayHeader(10, "Send First Wave of Outreach (15 creators)"),
  body("Send personalized DMs or emails to the first 15 micro-influencers on the outreach list. DMs are preferred for Instagram and TikTok creators. Emails work better for bloggers and YouTube creators. Time outreach for 10-11 AM in the creator's time zone (highest email/DM open rates). Include a brief personal compliment about their content, a one-sentence description of the app, and a clear but low-pressure call to action (e.g., 'Would you be open to trying the app for free? No strings attached.'). Track all outreach in the spreadsheet."),
  bullet("Send 10 DMs via Instagram/TikTok with personalized compliments"),
  bullet("Send 5 emails to bloggers/YouTubers with partnership proposal"),
  bullet("Track: response rate, positive responses, negative responses, pending"),
  bullet("Follow up: If no response in 48 hours, send a casual second message"),

  dayHeader(11, "Create Press Kit & Media Assets"),
  body("Assemble a professional press kit that any influencer, journalist, or partner can download. This should include: brand story and mission statement, founder bio and headshot, high-resolution app screenshots, feature descriptions, pricing information, brand guidelines (colors, fonts, tone), social media statistics (if any), and contact information. Format as a single-page PDF that's easy to share. Also create a media folder with individual high-res screenshots, the promo video, and the logo in multiple formats (PNG with transparency, SVG, white version, dark version). Host everything on a dedicated press page at tendertrimesters.com/press."),
  bullet("Press kit PDF: 1-page brand overview with founder story, mission, and key stats"),
  bullet("Media folder: Screenshots (PNG), logo (PNG/SVG), promo video (MP4), brand colors (ASE/CLR)"),
  bullet("Host at tendertrimesters.com/press with one-click download"),
  bullet("Prepare 3 different feature spotlight one-pagers for different audiences"),

  h2("Days 12-14: Final Pre-Launch Preparation"),

  dayHeader(12, "Content Calendar Lock & Queue Launch Week Posts"),
  body("Finalize the complete content calendar for launch week (Days 15-21) and the following week (Days 22-28). Use a scheduling tool to queue all posts in advance. Launch week content should be the highest quality and most engaging content you have created. Every post should serve a dual purpose: provide genuine value AND create awareness/desire for the app. Plan for 2-3 posts per day on Instagram (mix of carousels, reels, and stories), 1-2 TikTok posts per day, and daily Pinterest pins. Prepare all captions, hashtags, and graphics in advance so launch week can focus entirely on engagement and community management."),
  bullet("Queue: 14 Instagram posts (mix of carousels, reels, stories) for Days 15-21"),
  bullet("Queue: 7 TikTok videos for launch week"),
  bullet("Queue: 35-50 Pinterest pins for launch week"),
  bullet("Prepare: Launch day announcement copy for all platforms"),

  dayHeader(13, "App Store Optimization (ASO) & Final QA"),
  body("Optimize the app's store listing for discoverability. This includes the app title (include keywords like 'pregnancy tracker,' 'baby countdown,' 'pregnancy journal,' 'due date calculator'), subtitle, keyword field (use all 100 characters), description (first 3 lines are most important for conversion), and screenshots (first 3 screenshots must communicate the app's core value instantly). Run the app through final QA testing on both iOS and Android. Test every major feature, every screen transition, and every API endpoint. Fix any remaining bugs. Ensure the onboarding flow is smooth and delightful for first-time users. Set up app store analytics to track downloads, conversion rates, and user retention."),
  bullet("ASO: Research top 20 pregnancy app keywords, integrate into title and description"),
  bullet("Screenshots: Design first 5 with value-prop headlines, not feature descriptions"),
  bullet("QA: Test complete user flow from sign-up through first 7 days of app usage"),
  bullet("Analytics: Set up App Store Connect and Google Play Console analytics"),

  //   dayHeader(14, "Launch Day Rehearsal (Dry Run)),
  body("Conduct a complete dry run of launch day. Post a 'coming soon' teaser on all platforms. Send the first email to the waitlist announcing that the app goes live tomorrow. Test all links (landing page, app store, social profiles) to ensure they work correctly. Confirm that all scheduled content is properly queued. Prepare launch day social media response templates for common questions ('How much does it cost?', 'Is there an Android version?', 'What makes this different from other pregnancy apps?'). Set up a Slack/Discord channel or shared doc for real-time launch day coordination if working with a team. Get a full night's sleep. Launch day is a marathon, not a sprint."),
  bullet("Post: 'Coming tomorrow' teaser across all social platforms"),
  bullet("Email: Send launch eve countdown to waitlist with exclusive first-look screenshots"),
  bullet("Test: Click every link, verify every redirect, confirm every scheduled post"),
  bullet("Prepare: FAQ response templates for anticipated questions"),

  divider(),

  // ------ PHASE 2: LAUNCH WEEK ------
  h1("PHASE 2: Launch Week (Days 15-21)"),
  body("Launch week is about energy, urgency, and social proof. The goal is to generate as much initial momentum as possible through coordinated content blasts, influencer posts, email campaigns, and community engagement. Every day has a specific theme and set of tactical actions. Monitor analytics in real-time and be ready to double down on what's working and pivot away from what isn't."),

  h2("Days 15-17: Launch Blast"),

  dayHeader(15, "LAUNCH DAY - Official Launch"),
  body("This is it. The app goes live on the App Store (and Google Play if available). Post the official launch announcement across all platforms simultaneously. Send the launch email to the full waitlist. Share in all pregnancy Facebook groups and Reddit communities where you have been an active, helpful member. Contact any influencers who have agreed to post today. The launch day post should be your best piece of content: a heartfelt video telling the story of why you built this app, what it means to you, and how you hope it helps other mamas. Authenticity wins on launch day more than production value. Monitor all channels continuously and respond to every comment, DM, and email within 1 hour."),
  bullet("6:00 AM: Publish launch day post on Instagram (video + carousel)"),
  bullet("7:00 AM: Send launch email to full waitlist"),
  bullet("8:00 AM: Post in Facebook pregnancy groups (organic, not promotional)"),
  bullet("9:00 AM: Launch TikTok campaign with 2-3 posts"),
  bullet("10:00 AM: Share on Reddit (authentic personal story, not ad)"),
  bullet("All day: Respond to every comment, DM, and email within 1 hour"),
  bullet("Evening: Post Instagram Story Q&A about the app"),

  dayHeader(16, "Launch Day +1 - Social Proof Collection"),
  body("The day after launch is about collecting and amplifying social proof. Share screenshots of any positive App Store reviews. Repost any user-generated content (with permission). Share download milestones (e.g., '100 mamas joined us in the first 24 hours'). If any influencers posted on launch day, share and amplify their content to your audience. Continue engaging in pregnancy communities. Post an Instagram Story poll asking followers what feature they want to explore next. The goal is to create a feeling of momentum and community that makes new visitors want to join. Monitor App Store reviews and respond to every single one, especially the positive ones (thanking users builds loyalty)."),
  bullet("Share: Screenshot of first 5-star App Store review"),
  bullet("Content: '100 mamas in 24 hours' milestone post"),
  bullet("Amplify: Repost influencer content (with credit)"),
  bullet("Engage: Instagram Story poll - 'Which feature should I demo next?'"),
  bullet("Email: Send Day 2 email with 'What you missed' feature spotlight"),

  dayHeader(17, "Feature Deep-Dive: Letters from Baby"),
  body("Dedicate today's content to the app's most emotional and shareable feature: Letters from Baby. This feature generates a weekly letter 'from the baby' to the mother using AI, creating a deeply personal keepsake. Create a video showing a real reaction to reading a generated letter for the first time. This is the kind of content that gets shared because it makes people feel something. Write an Instagram carousel explaining how the feature works and why it matters. Share on TikTok with an emotional sound. The Letters from Baby feature has the highest viral potential because it creates an emotional moment that viewers want to share with other expectant mothers."),
  bullet("Instagram (Carousel): 'The feature that made me cry - Letters from Baby'"),
  bullet("TikTok (Video): Record real reaction to reading the week's letter"),
  bullet("Pinterest: Create 5 pins about 'letters to my baby' and 'pregnancy keepsakes'"),
  bullet("Email: Feature spotlight on Letters from Baby with example letter"),
  bullet("Community: Ask followers to share what they would write to their baby"),

  h2("Days 18-21: Sustained Momentum"),

  dayHeader(18, "Feature Deep-Dive: Fear to Flame"),
  body("Showcase the Fear to Flame feature, which helps mothers identify, reframe, and transform pregnancy fears into courage. This feature addresses a real and often unspoken pain point: pregnancy anxiety. Create content around the topic of 'things you're afraid to admit you're scared about during pregnancy.' This type of vulnerable, relatable content performs extremely well on social media because it creates a safe space for honest conversation. Share an example of how the app transforms a fear ('I'm scared of childbirth') into a reframed, empowering perspective. The vulnerability of this content will drive engagement and establish the brand as emotionally intelligent."),
  bullet("Instagram (Reel): 'I named my biggest pregnancy fear... and the app transformed it'"),
  bullet("TikTok: 'POV: The app just understood my anxiety better than my therapist'"),
  bullet("Blog/Long-form: Write a detailed post about pregnancy anxiety and how Fear to Flame helps"),
  bullet("Pinterest: Create pins about 'pregnancy anxiety tips' and 'overcoming birth fears'"),

  dayHeader(19, "User-Generated Content Campaign"),
  body("Launch a UGC campaign encouraging early users to share their experience with the app. Create a branded hashtag (#TenderTrimesters or #MommiesMatter) and a simple CTA: 'Share your favorite feature and tag us.' Offer incentives: the most creative share each week gets a free month of premium. Feature the best UGC on your own channels (with permission). UGC is the most powerful form of social proof because it's authentic, unpaid, and comes from real users. It also provides a steady stream of content that you don't have to create yourself. DM 10-20 early users personally asking them to share their experience and offering the incentive."),
  bullet("Announce: UGC campaign with branded hashtag and weekly premium giveaway"),
  bullet("DM: 20 early users asking them to share with the incentive"),
  bullet("Repost: 3-5 pieces of UGC throughout the day"),
  bullet("Email: Share a user story/testimonial from an early adopter"),

  dayHeader(20, "Feature Deep-Dive: Tempie AI Companion"),
  body("Introduce Tempie, the AI-powered pregnancy companion. Position Tempie as 'the 3 AM friend every pregnant woman deserves.' Create content showing real conversations with Tempie (blur or redact any personal information). The AI companion feature differentiates Tender Trimesters from every other pregnancy app and drives premium subscriptions. Show how Tempie can help with anxiety, sleep troubles, relationship concerns, and the thousand small questions that come up during pregnancy. The key message is that Tempie is always available, never judgmental, and specifically trained to understand the pregnancy experience."),
  bullet("Instagram (Carousel): 'Meet Tempie - your 3 AM pregnancy companion'"),
  bullet("TikTok (Video): Screen recording of a real Tempie conversation about sleep anxiety"),
  bullet("Email: 'Tempie saved my 3 AM panic attack' - feature spotlight with example conversation"),
  bullet("Content: '5 things to ask Tempie when you can't sleep' - value-first content"),

  dayHeader(21, "Week 1 Retrospective " Analytics Review\u201D"),
  body("Review the first week's performance metrics comprehensively. Track: total downloads, daily active users, waitlist conversion rate, email open/click rates, social media engagement (likes, comments, shares, saves), influencer post performance, App Store rating and reviews, and revenue (if any). Compare against pre-launch goals. Identify the top 3 performing content pieces and analyze why they worked. Identify the bottom 3 and understand why they underperformed. Adjust the content calendar for Week 2 based on data, not assumptions. Share a transparent 'Week 1 results' post with your community - transparency builds trust."),
  bullet("Analytics: Download reports from App Store, Google Analytics, email platform, social tools"),
  bullet("Content: Identify top 3 and bottom 3 performing posts, analyze patterns"),
  bullet("Adjust: Revise Days 22-30 content calendar based on data"),
  bullet("Share: Post a 'Week 1 recap' with honest metrics and learnings"),

  divider(),

  // ------ PHASE 3: POST-LAUNCH GROWTH ------
  h1("PHASE 3: Post-Launch Growth (Days 22-30)"),
  body("With the launch energy established, Phase 3 shifts focus to sustainable growth strategies: deepening engagement, optimizing conversion, building partnerships, and establishing content systems that will continue driving growth beyond the 30-day plan. The goal is to build a flywheel where content drives downloads, downloads drive reviews and UGC, reviews and UGC drive more content visibility, and the cycle repeats."),

  h2("Days 22-25: Growth Optimization"),

  dayHeader(22, "SEO Content Sprint"),
  body("Create 5-10 SEO-optimized blog posts or long-form content pieces targeting high-volume pregnancy search terms. Each piece should be 1,500-2,500 words and provide genuine value while naturally incorporating references to the app. Target keywords like 'pregnancy week by week guide,' 'pregnancy journal template,' 'baby name ideas by origin,' 'hospital bag checklist third trimester,' and 'pregnancy meditation techniques.' Publish on the app's blog (if available) or on Medium. Optimize for featured snippets by including clear, direct answers to common questions in the first paragraph. Internal linking between posts helps build topical authority."),
  bullet("Write: 5 SEO blog posts (1,500-2,500 words each) targeting high-volume keywords"),
  bullet("Optimize: Each post includes app mention with contextual value proposition"),
  bullet("Distribute: Share on Pinterest, Facebook, and in relevant community threads"),
  bullet("Track: Monitor search rankings for target keywords using Google Search Console"),

  dayHeader(23, "Email Drip Campaign Activation"),
  body("Activate an automated email drip campaign for new users. The sequence should be: Day 0 (welcome + getting started guide), Day 2 (feature spotlight: Calendar + weekly content), Day 4 (feature spotlight: Journal), Day 7 (feature spotlight: Letters from Baby + premium upsell), Day 14 (re-engagement for inactive users), and Day 30 (premium conversion for free users approaching their limit). Each email should provide value first (tips, insights, or content) before making any ask. The premium upsell email should highlight specific features the user hasn't tried yet, not just a generic 'upgrade now' message. Personalize subject lines with the user's name and pregnancy week for higher open rates."),
  bullet("Set up: 6-email automated sequence in email platform"),
  bullet("Day 0: Welcome + getting started checklist"),
  bullet("Day 2: 'Your week {X} update is ready' - drive app open"),
  bullet("Day 7: Feature spotlight + soft premium upsell"),
  bullet("Day 14: Re-engagement for users who haven't opened the app"),

  dayHeader(24, "Partnership Activation - Part 1"),
  body("Activate the influencer partnerships secured during Days 8-11. Coordinate posting schedules so that influencer content goes live on different days to maintain a steady stream of social proof throughout the month. Provide each influencer with a unique tracking link so you can measure their direct impact on downloads. Consider creating a custom landing page for each influencer's audience with a personalized welcome message. Send each influencer a thank-you package (digital or physical) regardless of results. Relationships with influencers are long-term investments, not one-time transactions."),
  bullet("Coordinate: 5-8 influencer posts staggered across Days 24-30"),
  bullet("Track: Monitor each influencer's unique referral link clicks and conversions"),
  bullet("Thank you: Send personalized thank-you to every influencer who posted"),
  bullet("Retain: Offer top performers ongoing partnership with increased perks"),

  dayHeader(25, "Paid Advertising Test"),
  body("If budget allows, begin testing paid advertising on Meta (Instagram/Facebook) and TikTok. Start with very small budgets ($5-10/day per platform) to test different creatives, audiences, and messaging before scaling. For Meta, test three audience types: lookalike audiences based on existing users, interest-based targeting (pregnancy apps, parenting content, baby products), and retargeting website visitors. For TikTok, test Spark Ads with your best-performing organic content. The key principle is: test small, measure carefully, scale only what works. Never spend more than you can afford to lose during the testing phase. Document every ad variation, its performance metrics, and your learnings."),
  bullet("Meta Ads: Test 3 audiences (lookalike, interest, retargeting) at $5/day each"),
  bullet("TikTok Ads: Boost top 2 organic posts as Spark Ads at $5/day each"),
  bullet("Creative test: Image vs. video, emotional vs. practical, feature-focused vs. brand-focused"),
  bullet("Document: Track every variation's CPM, CTR, CPC, and conversion rate"),

  h2("Days 26-28: Community "Content System"),

  dayHeader(26, "Establish Weekly Content Themes"),
  body("Create a recurring weekly content calendar that your audience can rely on and look forward to. Consistency builds habit and loyalty. Suggested weekly themes: Motivation Monday (pregnancy affirmation), Tip Tuesday (practical pregnancy tip), Feature Wednesday (app feature spotlight), Throwback Thursday (pregnancy memory sharing), Fear-to-Flame Friday (emotional wellness content), and Self-Care Sunday (wellness and relaxation tips). Announce the weekly theme schedule to your audience so they know what to expect. This predictability increases engagement because followers learn when to check in for their favorite type of content. Each weekly theme also maps to a specific app feature, creating a natural content-to-conversion funnel."),
  bullet("Monday: Motivation - affirmations, emotional quotes, weekly intentions"),
  bullet("Tuesday: Tips - practical pregnancy advice (nutrition, exercise, sleep)"),
  bullet("Wednesday: Feature spotlight - deep dive into one app feature"),
  bullet("Thursday: Community - UGC repost, Q&A, discussion prompts"),
  bullet("Friday: Fear to Flame - emotional wellness, anxiety management"),
  bullet("Sunday: Self-care - meditation, journaling prompts, relaxation"),

  dayHeader(27, "Build User Feedback Loop"),
  body("Proactively solicit feedback from early users through in-app prompts, email surveys, and social media polls. Ask specific questions: 'What feature do you use most?', 'What feature do you wish existed?', 'What would make you recommend this app to a friend?' Use the feedback to prioritize the product roadmap and to create content that addresses real user needs. Share how you're responding to feedback publicly - users who see their suggestions implemented become the most loyal advocates. Create a simple feedback form using Typeform or Google Forms and share it via email and in the app. Offer a small incentive (extended premium trial) for completing the survey."),
  bullet("Survey: Send feedback form to all registered users via email"),
  bullet("In-app: Add a gentle feedback prompt after 7 days of usage"),
  bullet("Social: Post Instagram Story poll asking for feature requests"),
  bullet("Act: Commit to publicly addressing the top 3 feedback items within 2 weeks"),

  dayHeader(28, "Create Viral-Ready Content Batch"),
  body("Produce a batch of 10-15 pieces of content specifically designed for high shareability. Viral pregnancy content tends to fall into these categories: (1) relatable humor ('things nobody tells you about pregnancy'), (2) emotional storytelling ('the moment I heard the heartbeat'), (3) educational value ('what your body is doing right now at week X'), and (4) contrarian takes ('why I stopped reading pregnancy forums'). Create content in each category and A/B test different formats (carousel vs. reel, long caption vs. short caption, question hook vs. statement hook). The goal is to identify 2-3 content formats and topics that consistently achieve above-average engagement and double down on them in the coming weeks."),
  bullet("Create: 3 relatable humor posts (carousels with engaging captions)"),
  bullet("Create: 3 emotional storytelling pieces (video or carousel)"),
  bullet("Create: 4 educational value posts (SEO-optimized for search discovery)"),
  bullet("Create: 2-3 contrarian/opinion pieces to drive discussion and shares"),

  h2("Days 29-30: Review " Plan Ahead"),

  dayHeader(29, "30-Day Performance Review"),
  body("Conduct a comprehensive review of all 30 days. Compile metrics across all channels: total downloads, DAU/MAU ratio, conversion rate (waitlist to download, download to premium), email list growth and engagement, social media growth and engagement, influencer ROI, paid advertising performance, App Store rating and review count, and revenue. Compare every metric against the goals set before the campaign. Identify the top 5 most successful tactics and the top 5 biggest lessons learned. Calculate the customer acquisition cost (CAC) across channels. Project month-2 and month-3 growth based on month-1 data. This review becomes the foundation for the ongoing marketing strategy beyond the 30-day launch plan."),
  bullet("Compile: All-channel metrics dashboard for Days 1-30"),
  bullet("Analyze: Top 5 tactics by ROI, bottom 5 by performance"),
  bullet("Calculate: CAC by channel, LTV estimates, conversion funnel analysis"),
  bullet("Project: Month 2-3 growth targets based on Month 1 actuals"),

  dayHeader(30, "Month 2 Marketing Plan Draft"),
  body("Using the insights from the 30-day review, draft a preliminary Month 2 marketing plan. This should include: continuation of the weekly content themes with refinements based on performance data, scaling paid advertising on the best-performing channels and creatives, expanding the influencer program (target 15-20 active partnerships), launching an email newsletter for non-users (pregnancy tips content that includes soft app promotion), exploring partnerships with pregnancy-related brands and organizations (OB/GYN practices, doulas, midwives, prenatal yoga studios), and beginning to plan for seasonal content (holiday gift guides, New Year pregnancy resolution content). The Month 2 plan should be more data-driven and less assumption-driven than the Month 1 plan. Set clear, measurable goals for each metric."),
  bullet("Content: Refine weekly themes based on Day 29 performance data"),
  bullet("Paid: Scale winning ad creatives to $20-30/day budget"),
  bullet("Influencer: Expand to 15-20 active partnerships"),
  bullet("Partnerships: Reach out to 10 local pregnancy service providers for cross-promotion"),
  bullet("Newsletter: Launch pregnancy tips email newsletter for non-app users"),
  bullet("Goals: Set specific, measurable targets for downloads, revenue, and engagement"),

  divider(),

  // ------ APPENDIX: KPI TARGETS ------
  h1("Appendix: KPI Targets " Measurement Framework"),
  body("The following table outlines the key performance indicators and their target ranges for the 30-day launch period. These targets are based on industry benchmarks for mobile app launches in the health and wellness category. Actual results should be tracked daily and compared against these ranges to identify what's working and what needs adjustment. Note that these are ambitious but achievable targets for a well-executed launch. The most important leading indicator is Day 7 retention rate, which predicts long-term success more accurately than any other metric."),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: c(P.tableAccentLine) },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: c(P.tableAccentLine) },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: c(P.tableInnerLine) },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ["Metric", "Pre-Launch (Day 14)", "Launch Week (Day 21)", "Month End (Day 30)"].map(h =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: c(P.tableHeaderBg) },
            children: [new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [new TextRun({ text: h, bold: true, size: 22, color: c(P.tableHeaderText), font: { ascii: "Calibri" } })],
            })],
          })
        ),
      }),
      ...[
        ["App Downloads", "0", "500-1,000", "2,000-5,000"],
        ["Email Waitlist", "500-1,000", "800-1,500", "1,000-2,000"],
        ["Instagram Followers", "200-500", "800-2,000", "2,000-5,000"],
        ["TikTok Followers", "100-300", "500-1,500", "1,500-4,000"],
        ["Pinterest Monthly Views", "0", "5,000-15,000", "20,000-50,000"],
        ["App Store Rating", "N/A", "4.5+ stars", "4.7+ stars"],
        ["Day 7 Retention", "N/A", "30-40%", "35-45%"],
        ["Free to Premium Rate", "N/A", "3-5%", "5-8%"],
        ["Influencer Posts", "0", "5-8", "15-20"],
        ["UGC Pieces", "0", "10-20", "40-60"],
      ].map(([metric, d14, d21, d30]) =>
        new TableRow({
          children: [metric, d14, d21, d30].map((text, i) =>
            new TableCell({
              shading: i === 0 ? { type: ShadingType.CLEAR, fill: c(P.tableSurface) } : undefined,
              children: [new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri" },
                  bold: i === 0 })],
              })],
            })
          ),
        })
      ),
    ],
  }),

  body("These targets represent healthy growth for a bootstrapped app launch. The most critical metrics to watch are Day 7 retention (below 25% indicates an onboarding or value problem), App Store rating (below 4.0 significantly impacts organic discovery), and the free-to-premium conversion rate (below 2% may indicate pricing or positioning issues). Adjust tactics immediately if any of these three metrics fall below their minimum threshold."),
  body("Remember: consistency beats intensity. Posting 2 quality pieces per day for 30 days will outperform 10 pieces on day 1 followed by silence. The pregnancy content space rewards brands that show up consistently with genuine value and authentic empathy. Mommies Matter has a unique advantage: the app was built by a mother who understands the emotional landscape of pregnancy firsthand. That authenticity is the most powerful marketing tool you have. Use it."),
];

// ---- Document Assembly ----
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri" }, size: 24, color: c(P.body) },
        paragraph: { spacing: { line: 312 } },
      },
    },
  },
  sections: [
    // Cover
    {
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: coverChildren,
    },
    // Body
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
        },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Tender Trimesters · Mommies Matter · Marketing Launch Plan", size: 18, color: "909090", font: { ascii: "Calibri" } }),
              new TextRun({ text: "     Page ", size: 18, color: "909090" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "909090" }),
            ],
          })],
        }),
      },
      children: bodyContent,
    },
  ],
});

const OUTPUT = "/home/z/my-project/download/Tender_Trimesters_Marketing_Launch_Plan.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUTPUT, buf);
  console.log("Generated:", OUTPUT);
});
