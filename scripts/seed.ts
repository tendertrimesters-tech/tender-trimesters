// Tender Trimesters — 40-week pregnancy content seed
// Run: bun run scripts/seed.ts

import { db } from "../src/lib/db";

type Week = {
  week: number;
  trimester: 1 | 2 | 3;
  babySize: string;
  babySizeDesc: string;
  babyLengthCm: number;
  babyWeightG: number;
  bodyChanges: string;
  emotionalChanges: string;
  bestFriendTip: string;
  selfCare: string;
  affirmation: string;
  milestone?: string;
};

const weeks: Week[] = [
  {
    week: 1, trimester: 1, babySize: "Poppy Seed", babySizeDesc: "Technically not pregnant yet — your body is prepping for ovulation. The clock starts here.", babyLengthCm: 0.1, babyWeightG: 0.2,
    bodyChanges: "You won't feel different yet. Your body is gearing up to release an egg. Start taking a prenatal vitamin with folic acid if you haven't already.",
    emotionalChanges: "Hopeful, anxious, or just waiting. Whatever you're feeling is valid — this part is a quiet kind of waiting game.",
    bestFriendTip: "Start a daily habit of drinking one full glass of water first thing in the morning. Future you will thank present you.",
    selfCare: "Take a prenatal vitamin with 400mcg folic acid\nDrink 8 glasses of water\nGet 7-9 hours of sleep",
    affirmation: "My body knows exactly what to do.",
  },
  {
    week: 2, trimester: 1, babySize: "Poppy Seed", babySizeDesc: "Ovulation happens this week. The egg is traveling, hoping to meet its match.", babyLengthCm: 0.1, babyWeightG: 0.2,
    bodyChanges: "Cervical mucus changes (clear and stretchy = fertile window). Your body is releasing one lucky egg.",
    emotionalChanges: "If you're trying, this is the week to lean in. If not yet — same. Patience is the lesson of week 2.",
    bestFriendTip: "If you're trying to conceive, this is your window. If not — protection is your friend.",
    selfCare: "Track your cycle in the app\nContinue prenatal vitamins\nLimit caffeine to under 200mg",
    affirmation: "I trust the timing of my life.",
  },
  {
    week: 3, trimester: 1, babySize: "Pinhead", babySizeDesc: "Conception has likely happened. The fertilized egg is making its way down the fallopian tube to your uterus.", babyLengthCm: 0.15, babyWeightG: 0.5,
    bodyChanges: "Cell division is happening fast. You won't feel it, but a tiny cluster of cells is implanting in your uterine lining.",
    emotionalChanges: "Most women don't know they're pregnant yet. The two-week wait is its own kind of emotional marathon.",
    bestFriendTip: "Pretend you might be pregnant — avoid alcohol, raw fish, and high-mercury fish just in case.",
    selfCare: "Avoid alcohol and smoking\nSkip raw sushi and deli meats\nContinue prenatal vitamins",
    affirmation: "Something miraculous is unfolding inside me.",
  },
  {
    week: 4, trimester: 1, babySize: "Sesame Seed", babySizeDesc: "Your baby is now an embryo, about the size of a poppy seed. The placenta is starting to form.", babyLengthCm: 0.2, babyWeightG: 0.5,
    bodyChanges: "Missed period is the first big sign. Some women feel mild cramping (implantation) or notice light spotting.",
    emotionalChanges: "That moment you see the positive test — joy, fear, disbelief, all at once. Take a deep breath, mama.",
    bestFriendTip: "Take a pregnancy test first thing in the morning for the most accurate result. Call your OB to schedule your first appointment.",
    selfCare: "Call your OB to book your first prenatal visit\nStart a pregnancy journal\nTake prenatal vitamins daily",
    affirmation: "I am ready for this journey.",
  },
  {
    week: 5, trimester: 1, babySize: "Apple Seed", babySizeDesc: "Your baby's heart is starting to form and may even start beating this week. Tiny arm and leg buds appear.", babyLengthCm: 0.25, babyWeightG: 1,
    bodyChanges: "Fatigue hits hard — your body is making a human AND a placenta. Breasts may feel tender. The nausea might begin.",
    emotionalChanges: "Excitement mixes with exhaustion. It's okay if you don't feel 'glowing' yet — first trimester is survival mode.",
    bestFriendTip: "Keep saltine crackers on your nightstand. Eat a few before you even sit up in bed — it tames morning nausea.",
    selfCare: "Eat small frequent meals\nNap when your body asks\nGinger tea for nausea",
    affirmation: "Rest is productive. My body is doing important work.",
  },
  {
    week: 6, trimester: 1, babySize: "Lentil", babySizeDesc: "Baby's face is taking shape — tiny dots where eyes will be, a little mouth, even the beginnings of ears.", babyLengthCm: 0.5, babyWeightG: 1.5,
    bodyChanges: "Hormones are surging. Nausea, bloating, frequent peeing, and food aversions are all normal right now.",
    emotionalChanges: "Mood swings are real. You might cry at a commercial. That's your hormones — not you being 'too much.'",
    bestFriendTip: "Don't suffer in silence with nausea. Talk to your OB about B6 or prescription options if you can't keep food down.",
    selfCare: "Hydrate with electrolytes if vomiting\nEat whatever sounds good — calories matter more than nutrition right now\nTell your closest people",
    affirmation: "Every wave of nausea is a sign my baby is growing.",
  },
  {
    week: 7, trimester: 1, babySize: "Blueberry", babySizeDesc: "Arms and legs are lengthening. Tiny hands and feet are forming. Brain is developing rapidly.", babyLengthCm: 1, babyWeightG: 2,
    bodyChanges: "Uterus has doubled in size. Your clothes might feel tight. Acne, bloating, and constipation are common.",
    emotionalChanges: "First-trimester anxiety is real. It's normal to worry about miscarriage. Take it one day at a time.",
    bestFriendTip: "Buy a pregnancy pillow now — even if you don't think you need one yet. Future you will weep with gratitude.",
    selfCare: "Add fiber-rich foods to ease constipation\nGentle walks (10-15 min)\nStretch before bed",
    affirmation: "I am exactly the mother my baby needs.",
  },
  {
    week: 8, trimester: 1, babySize: "Raspberry", babySizeDesc: "Baby's fingers and toes are starting to form. Tiny webbed. The heart is beating about 150 times per minute.", babyLengthCm: 1.5, babyWeightG: 3,
    bodyChanges: "You may have your first ultrasound this week — hearing that heartbeat for the first time is unforgettable.",
    emotionalChanges: "Seeing the heartbeat changes everything. The abstract becomes real. Let yourself feel it.",
    bestFriendTip: "Take your partner to the first ultrasound. That shared moment will become a core memory for both of you.",
    selfCare: "Schedule first ultrasound if not done\nStart a 'pregnancy memory' photo folder\nMoisturize your belly (skin stretching begins)",
    affirmation: "I am growing a life. That is enough.",
  },
  {
    week: 9, trimester: 1, babySize: "Grape", babySizeDesc: "Baby is starting to look like a baby — less tadpole, more human. Tail is gone. Muscles are forming.", babyLengthCm: 2.3, babyWeightG: 4,
    bodyChanges: "Your waistline may be thickening. Breasts are noticeably bigger. Areolas may darken.",
    emotionalChanges: "You might still feel like you're faking it — symptoms come and go. That's normal. Worry is the price of love.",
    bestFriendTip: "If your symptoms suddenly disappear, don't panic — but do call your OB. Peace of mind is worth the call.",
    selfCare: "Buy your first maternity bra (size up)\nSwitch to gentler skincare (avoid retinols)\nContinue light movement",
    affirmation: "I release the need to control what I cannot.",
  },
  {
    week: 10, trimester: 1, babySize: "Kumquat", babySizeDesc: "Baby's vital organs are formed and starting to function. Nails are beginning to grow. Bones are hardening.", babyLengthCm: 3, babyWeightG: 5,
    bodyChanges: "You may hear the heartbeat with a Doppler at your OB visit. The 'bean' is now officially a fetus.",
    emotionalChanges: "Crossing the 10-week mark feels like a milestone. Some of the early worry starts to ease.",
    bestFriendTip: "Start thinking about how and when to announce. There's no 'right' time — do what feels true to you.",
    selfCare: "Plan your announcement (or don't — your call)\nBook NIPT (genetic screening) if desired\nContinue prenatal yoga",
    affirmation: "I trust my body to carry this pregnancy.",
  },
  {
    week: 11, trimester: 1, babySize: "Lime", babySizeDesc: "Baby is moving — kicking, stretching, even hiccuping — though you can't feel it yet.", babyLengthCm: 4, babyWeightG: 7,
    bodyChanges: "First trimester symptoms may start easing. Energy might return. You're almost at the second trimester!",
    emotionalChanges: "Relief is on the horizon. Hang in there — the glow-up is coming.",
    bestFriendTip: "Use this energy window to prep: clean the house, freeze meals, research childcare. Future tired you will be grateful.",
    selfCare: "Meal prep and freeze portions\nResearch childbirth classes\nContinue gentle exercise",
    affirmation: "The hardest part is almost over. I am strong.",
  },
  {
    week: 12, trimester: 1, babySize: "Plum", babySizeDesc: "Baby has reflexes now. If you poke your belly, baby might respond by squirming. All systems are forming.", babyLengthCm: 5.4, babyWeightG: 14,
    bodyChanges: "NT scan (nuchal translucency) ultrasound this week — checks for chromosomal conditions and confirms due date.",
    emotionalChanges: "End of the first trimester. Many women feel safe enough to announce. Whatever you choose is right.",
    bestFriendTip: "Get a 12-week belly photo — even if you don't 'look pregnant' yet. The before-and-after will blow your mind later.",
    selfCare: "Schedule NT scan\nTake a 12-week photo\nPlan your announcement if you're sharing",
    affirmation: "I have made it through the first trimester.",
    milestone: "End of First Trimester approaching",
  },
  {
    week: 13, trimester: 1, babySize: "Lemon", babySizeDesc: "Baby has fingerprints now. Unique to them, forever. Vocal cords are forming.", babyLengthCm: 7.4, babyWeightG: 23,
    bodyChanges: "Energy is returning. Risk of miscarriage drops significantly. Your bump may make a tiny debut.",
    emotionalChanges: "Relief. Joy. Maybe a tiny bit of sadness that the secret-keeping chapter is ending.",
    bestFriendTip: "If you haven't told work yet, this is a good time. You'll need accommodations and time off for appointments.",
    selfCare: "Tell your employer (if you haven't)\nStart a baby name list\nBook a second-trimester anatomy scan (around week 20)",
    affirmation: "Welcome to the second trimester. I am ready.",
    milestone: "Second Trimester Begins",
  },
  {
    week: 14, trimester: 2, babySize: "Peach", babySizeDesc: "Baby can make facial expressions now — squinting, frowning, even sucking a thumb.", babyLengthCm: 8.7, babyWeightG: 43,
    bodyChanges: "Appetite is back. The 'glow' might appear. Some women feel baby flutters (called quickening) for the first time.",
    emotionalChanges: "This is the sweet spot — energy returning, belly not too big yet, mood more stable.",
    bestFriendTip: "Use this window to travel, date your partner, see friends. Third trimester you'll be tired again.",
    selfCare: "Plan a babymoon\nEat iron-rich foods (baby's blood volume is increasing)\nMoisturize belly daily",
    affirmation: "I am blooming into motherhood.",
  },
  {
    week: 15, trimester: 2, babySize: "Apple", babySizeDesc: "Baby can hear muffled sounds from outside the womb — your heartbeat, voice, even music.", babyLengthCm: 10.1, babyWeightG: 70,
    bodyChanges: "You might feel baby move for the first time — like little butterflies or gas bubbles. Heartburn may begin.",
    emotionalChanges: "Feeling those first kicks is electric. Suddenly it's real in a new way.",
    bestFriendTip: "Start talking to your baby. Read a book, sing a song. They're listening.",
    selfCare: "Play music or read aloud to baby\nTums for heartburn (OB-approved)\nSleep on your left side",
    affirmation: "My voice is the first sound my baby will know.",
  },
  {
    week: 16, trimester: 2, babySize: "Avocado", babySizeDesc: "Baby's eyes can make small movements, though they're still closed. Hair is starting to grow.", babyLengthCm: 11.6, babyWeightG: 100,
    bodyChanges: "Belly is officially showing. You might need maternity clothes. Round ligament pain (sharp groin pulls) can start.",
    emotionalChanges: "You look pregnant now. Strangers might start asking. The attention can be sweet or overwhelming — both are okay.",
    bestFriendTip: "Invest in 2-3 quality maternity basics (jeans, leggings, a dress). You'll live in them for months.",
    selfCare: "Buy maternity clothes\nUse a pregnancy pillow\nStretch daily to ease ligament pain",
    affirmation: "My changing body is beautiful.",
  },
  {
    week: 17, trimester: 2, babySize: "Pear", babySizeDesc: "Baby's skeleton is hardening from cartilage to bone. Sweat glands are forming.", babyLengthCm: 13, babyWeightG: 140,
    bodyChanges: "Weight gain picks up. You might feel off-balance as your center of gravity shifts.",
    emotionalChanges: "Bonding deepens. You might find yourself rubbing your belly, daydreaming about who they'll be.",
    bestFriendTip: "Switch to flat, supportive shoes. Heels will betray you now.",
    selfCare: "Wear supportive shoes\nPractice good posture\nAdd a daily 20-min walk",
    affirmation: "I am connected to my baby in ways I cannot see.",
  },
  {
    week: 18, trimester: 2, babySize: "Bell Pepper", babySizeDesc: "Baby is yawning, hiccuping, and stretching. If you're carrying a girl, her uterus is forming now.", babyLengthCm: 14.2, babyWeightG: 190,
    bodyChanges: "Belly is popping. You may feel baby move more clearly — distinct kicks now, not just flutters.",
    emotionalChanges: "Some days you feel like Superwoman, others like you're running on fumes. Both are normal second-trimester experiences.",
    bestFriendTip: "Start a 'letters to baby' journal. Even short notes — 'Today you kicked during my meeting' — will be precious later.",
    selfCare: "Write a letter to baby\nSchedule anatomy scan (week 20)\nEat omega-3s for baby's brain",
    affirmation: "I am documenting this season with love.",
  },
  {
    week: 19, trimester: 2, babySize: "Mango", babySizeDesc: "Baby is covered in vernix — a creamy protective coating. Skin is developing, no longer translucent.", babyLengthCm: 15.3, babyWeightG: 240,
    bodyChanges: "Skin changes: linea nigra (dark line down belly), pregnancy mask (dark patches on face). All temporary.",
    emotionalChanges: "Body image can wobble. Be gentle with yourself — your body is doing extraordinary work.",
    bestFriendTip: "Take a weekly bump photo in the same spot, same lighting. Watch your baby grow.",
    selfCare: "Weekly bump photo\nSunscreen to prevent pregnancy mask\nGentle skin routine",
    affirmation: "Every mark on my body is a love letter to my baby.",
  },
  {
    week: 20, trimester: 2, babySize: "Banana", babySizeDesc: "Halfway there! Baby can hear clearly now. The anatomy scan reveals all organs, and often, the sex.", babyLengthCm: 16.4, babyWeightG: 300,
    bodyChanges: "Anatomy scan this week — the big detailed ultrasound. Bump is undeniable. Belly button may pop out.",
    emotionalChanges: "HALFWAY. A real milestone. Seeing baby on screen, finding out the sex (if you want to) — this is a peak week.",
    bestFriendTip: "Bring your partner and ask for printed ultrasound photos. Frame one — it's a forever keepsake.",
    selfCare: "Attend anatomy scan\nStart registry research\nCelebrate halfway point with a date night",
    affirmation: "I am halfway to holding my baby.",
    milestone: "Halfway Point",
  },
  {
    week: 21, trimester: 2, babySize: "Carrot", babySizeDesc: "Baby's taste buds are developing. The flavors of what you eat come through in amniotic fluid.", babyLengthCm: 26.7, babyWeightG: 360,
    bodyChanges: "Stretch marks may appear. Feet might grow (yes, really). Swelling in ankles by end of day.",
    emotionalChanges: "You're nesting. Maybe not literally yet, but mentally — researching, planning, dreaming.",
    bestFriendTip: "Eat diverse flavors now — research shows babies prefer foods they 'tasted' in utero. Spices, veggies, all of it.",
    selfCare: "Eat a rainbow of foods\nElevate feet at end of day\nStart childbirth class research",
    affirmation: "I am nourishing my baby, body and soul.",
  },
  {
    week: 22, trimester: 2, babySize: "Spaghetti Squash", babySizeDesc: "Baby has a sense of touch now. They can feel when you rub your belly.", babyLengthCm: 27.8, babyWeightG: 430,
    bodyChanges: "Braxton Hicks (practice contractions) might begin — painless tightening of your belly.",
    emotionalChanges: "Bonding deepens through touch. You and baby are in conversation now.",
    bestFriendTip: "When baby kicks, press gently back. You're having your first 'conversations.'",
    selfCare: "Daily belly rubs\nHydrate to ease Braxton Hicks\nTrack kick patterns",
    affirmation: "My touch is my baby's first language of love.",
  },
  {
    week: 23, trimester: 2, babySize: "Grapefruit", babySizeDesc: "Baby's lungs are developing. They can hear your voice clearly and may startle at loud sounds.", babyLengthCm: 28.9, babyWeightG: 501,
    bodyChanges: "You're gaining about a pound a week now. Sleep may get uncomfortable. Strange dreams are common.",
    emotionalChanges: "The reality of impending motherhood hits. It's normal to feel both excited and terrified.",
    bestFriendTip: "If anxious thoughts spiral at 3am, write them down. Getting them out of your head and onto paper helps.",
    selfCare: "Journal before bed\nRead to baby\nPractice breathing exercises",
    affirmation: "My worries are valid, and they are not in charge.",
  },
  {
    week: 24, trimester: 2, babySize: "Corn Cob", babySizeDesc: "Baby is viable — with intensive medical care, could survive if born now. A huge medical milestone.", babyLengthCm: 30, babyWeightG: 600,
    bodyChanges: "Glucose screening is coming up soon. Your OB may have you track kick counts.",
    emotionalChanges: "Viability is a powerful threshold. Many mamas breathe a little easier this week.",
    bestFriendTip: "Start counting kicks daily — same time each day, ideally after a meal when baby is active.",
    selfCare: "Daily kick counts\nSchedule glucose test (24-28 weeks)\nTour your birthing facility",
    affirmation: "My baby is getting stronger every day.",
    milestone: "Viability",
  },
  {
    week: 25, trimester: 2, babySize: "Cauliflower", babySizeDesc: "Baby's nose and nostrils are working. They can practice breathing motions.", babyLengthCm: 34.6, babyWeightG: 660,
    bodyChanges: "Heartburn, constipation, and hemorrhoids — the glamorous side of pregnancy. Hair may be thicker and shinier.",
    emotionalChanges: "Third trimester looms. You might feel a sudden urge to get everything 'done' — nesting instinct kicking in.",
    bestFriendTip: "Start packing a 'just in case' hospital bag. You won't regret having it ready early.",
    selfCare: "Pack hospital bag (just in case)\nFiber for constipation\nSleep with pregnancy pillow",
    affirmation: "I am preparing with intention.",
  },
  {
    week: 26, trimester: 2, babySize: "Lettuce Head", babySizeDesc: "Baby's eyes are opening for the first time. They can blink. Brain activity is surging.", babyLengthCm: 35.6, babyWeightG: 760,
    bodyChanges: "Blood pressure may rise — your OB is watching for preeclampsia. Swelling increases.",
    emotionalChanges: "Anticipation builds. You can see the finish line of pregnancy, even if delivery still feels abstract.",
    bestFriendTip: "Use a body pillow between your knees — it's a game-changer for hip pain.",
    selfCare: "Track blood pressure\nSleep on left side\nReduce sodium if swelling",
    affirmation: "I am tuned in to my body's signals.",
  },
  {
    week: 27, trimester: 2, babySize: "Cabbage", babySizeDesc: "Baby recognizes your voice and your partner's voice. They may respond to familiar songs.", babyLengthCm: 36.6, babyWeightG: 875,
    bodyChanges: "End of second trimester. Your bump is solid. Movement is constant and sometimes uncomfortable.",
    emotionalChanges: "Mixed feelings — excitement to meet baby, sadness about the end of pregnancy. Both are real.",
    bestFriendTip: "Take a 'before baby' photo with your partner. This chapter is closing; honor it.",
    selfCare: "Pre-register at hospital\nFinalize childbirth class\nTake partner photos",
    affirmation: "Welcome to the third trimester. The final stretch.",
    milestone: "Third Trimester Begins",
  },
  {
    week: 28, trimester: 3, babySize: "Eggplant", babySizeDesc: "Baby can dream now — REM sleep has begun. Brain is forming billions of neurons.", babyLengthCm: 37.6, babyWeightG: 1005,
    bodyChanges: "Glucose test this week if not done. Rhogam shot if you're Rh-negative. Baby moves a lot.",
    emotionalChanges: "The countdown feels real. You might start visualizing the birth — your hopes, your fears.",
    bestFriendTip: "Write your birth preferences (not a strict 'plan' — babies don't read those). Share with your OB and partner.",
    selfCare: "Glucose screening (if not done)\nWrite birth preferences\nStart perineal massage (OB-approved)",
    affirmation: "I trust my body to birth my baby.",
  },
  {
    week: 29, trimester: 3, babySize: "Butternut Squash", babySizeDesc: "Baby's muscles and lungs are maturing. Head is growing bigger to make room for the brain.", babyLengthCm: 38.6, babyWeightG: 1150,
    bodyChanges: "Heartburn and shortness of breath as baby pushes up against your diaphragm. Frequent urination returns.",
    emotionalChanges: "You're tired in a new way — heavy, slow, ready. Impatience can creep in.",
    bestFriendTip: "Eat 5-6 small meals instead of 3 big ones. Eases heartburn and keeps energy steady.",
    selfCare: "Small frequent meals\nSleep elevated\nGentle prenatal yoga",
    affirmation: "I am strong enough for this final stretch.",
  },
  {
    week: 30, trimester: 3, babySize: "Cucumber", babySizeDesc: "Baby's eyes can open and close. They can distinguish light and dark.", babyLengthCm: 39.9, babyWeightG: 1320,
    bodyChanges: "Braxton Hicks more frequent. Breasts may leak colostrum (early milk).",
    emotionalChanges: "Nesting is in full swing. You might rearrange the nursery at 2am. Lean in — it's primal.",
    bestFriendTip: "Set up the crib/bassinet NOW. Don't wait until 38 weeks. The 'last-minute' scramble is brutal.",
    selfCare: "Assemble nursery furniture\nWash baby clothes\nBuy nursing bras",
    affirmation: "I am creating a sanctuary for my baby.",
  },
  {
    week: 31, trimester: 3, babySize: "Coconut", babySizeDesc: "Baby's brain is growing fast. They can process information and remember sounds after birth.", babyLengthCm: 41.1, babyWeightG: 1500,
    bodyChanges: "Back pain intensifies. Sleep is increasingly difficult. Varicose veins may appear.",
    emotionalChanges: "You might feel huge and over it. That's normal. You're almost there.",
    bestFriendTip: "Book a prenatal massage. Your back will thank you. Many insurance plans cover it.",
    selfCare: "Prenatal massage\nUse a maternity support belt\nWarm baths for back pain",
    affirmation: "My discomfort is temporary. My love is forever.",
  },
  {
    week: 32, trimester: 3, babySize: "Jicama", babySizeDesc: "Baby is practicing breathing, sucking, and swallowing. Digestive system is ready for the outside world.", babyLengthCm: 42.4, babyWeightG: 1700,
    bodyChanges: "Shortness of breath as baby takes up more space. Heartburn peaks. You might waddle now.",
    emotionalChanges: "Time feels both fast and slow. Each week is a countdown. Hold steady, mama.",
    bestFriendTip: "Take a hospital tour if you haven't. Knowing where to go lowers labor-day anxiety.",
    selfCare: "Hospital tour\nPractice labor breathing\nInstall car seat (get it checked!)",
    affirmation: "I am prepared for what's ahead.",
  },
  {
    week: 33, trimester: 3, babySize: "Pineapple", babySizeDesc: "Baby's immune system is developing. Skull bones are still soft (they'll overlap during birth).", babyLengthCm: 43.7, babyWeightG: 1920,
    bodyChanges: "Pelvic pressure increases as baby drops. You might leak a little urine when laughing or sneezing.",
    emotionalChanges: "Imagining the moment of meeting baby. Wondering who they'll look like. A magical kind of anticipation.",
    bestFriendTip: "Do kegel exercises daily — they help with that little leak and speed postpartum recovery.",
    selfCare: "Daily kegels\nPack hospital bag (for real this time)\nMeal prep and freeze",
    affirmation: "I am almost ready to meet my baby.",
  },
  {
    week: 34, trimester: 3, babySize: "Cantaloupe", babySizeDesc: "Baby's lungs are nearly mature. Central nervous system is finishing up. You're in the home stretch.", babyLengthCm: 45, babyWeightG: 2150,
    bodyChanges: "OB visits switch to every 2 weeks. Group B Strep test coming soon.",
    emotionalChanges: "Final preparations feel urgent. You might suddenly need everything 'done.'",
    bestFriendTip: "Pre-register at the hospital and put your OB's after-hours number in your phone.",
    selfCare: "Pre-register at hospital\nSave OB after-hours number\nWash and fold baby clothes",
    affirmation: "Everything is falling into place.",
  },
  {
    week: 35, trimester: 3, babySize: "Honeydew Melon", babySizeDesc: "Baby's kidneys are fully developed. Liver is processing some waste. Almost ready!", babyLengthCm: 46.2, babyWeightG: 2380,
    bodyChanges: "Group B Strep test this week. Baby is dropping lower — easier breathing, harder walking.",
    emotionalChanges: "Last full month of pregnancy. Surrender to the slowness.",
    bestFriendTip: "Treat yourself — haircut, pedicure, facial. Self-care before baby takes center stage.",
    selfCare: "Group B Strep test\nSelf-care day\nFinalize nursery",
    affirmation: "I am savoring these final days of carrying my baby.",
  },
  {
    week: 36, trimester: 3, babySize: "Papaya", babySizeDesc: "Baby is considered 'early term' next week. Most organs are ready for the outside world.", babyLengthCm: 47.4, babyWeightG: 2620,
    bodyChanges: "OB visits weekly now. Baby may engage in pelvis. You're exhausted and excited.",
    emotionalChanges: "You might cry easily. Anticipation is at its peak. This is your body's rehearsal week.",
    bestFriendTip: "Sleep whenever you can. Seriously. Don't be a hero.",
    selfCare: "Weekly OB visits\nSleep as much as possible\nReview birth preferences with partner",
    affirmation: "I am ready when my baby is ready.",
    milestone: "Early Term Approaching",
  },
  {
    week: 37, trimester: 3, babySize: "Swiss Chard", babySizeDesc: "Baby is 'early term' now. Lungs are mature. They're practicing breathing for the outside world.", babyLengthCm: 48.6, babyWeightG: 2860,
    bodyChanges: "Watch for signs of labor: regular contractions, water breaking, bloody show. Pack the car seat.",
    emotionalChanges: "The wait is excruciating. Every twinge feels like 'is this it?' Try to stay present.",
    bestFriendTip: "Set up a group text or use an app to notify family when labor starts — saves your partner from 50 texts.",
    selfCare: "Install car seat in car\nReview labor signs\nTime contractions if they start",
    affirmation: "My baby will come when they are ready.",
  },
  {
    week: 38, trimester: 3, babySize: "Leek", babySizeDesc: "Baby has firm grasps and toenails. Brain is still developing fast — it will for years.", babyLengthCm: 49.8, babyWeightG: 3083,
    bodyChanges: "Pelvic discomfort is intense. You might lose your mucus plug. Braxton Hicks more frequent.",
    emotionalChanges: "So close. The longest short wait of your life.",
    bestFriendTip: "Do something distracting — movie marathon, puzzle, last date night. Time moves slower when you stare at it.",
    selfCare: "Last date night\nRest\nStay hydrated",
    affirmation: "I surrender to my baby's timing.",
  },
  {
    week: 39, trimester: 3, babySize: "Mini Watermelon", babySizeDesc: "Baby is full term. Lungs are mature, immune system ready. They're just growing now.", babyLengthCm: 50.7, babyWeightG: 3288,
    bodyChanges: "Baby drops lower into pelvis. You're uncomfortable but so ready. Any day now.",
    emotionalChanges: "Anticipation is at its peak. Trust your body. Trust your baby.",
    bestFriendTip: "If contractions start, time them. Call your OB when they're 5 min apart, lasting 1 min, for 1 hour (5-1-1 rule).",
    selfCare: "5-1-1 rule for contractions\nStay nourished and rested\nTrust your instincts",
    affirmation: "I trust my body completely.",
  },
  {
    week: 40, trimester: 3, babySize: "Pumpkin", babySizeDesc: "Your due date! Baby is fully developed and ready to meet you. Average baby is 7.5 lbs and 20 inches.", babyLengthCm: 51.2, babyWeightG: 3462,
    bodyChanges: "You made it to your due date! Only 5% of babies arrive on this exact day. Labor could start any moment.",
    emotionalChanges: "A mix of impatience, excitement, and fear. You're about to meet the love of your life.",
    bestFriendTip: "If you go overdue, your OB will discuss induction options at 41 weeks. Try not to stress — baby knows.",
    selfCare: "Stay calm\nWalk, bounce on a birth ball\nTrust the process",
    affirmation: "Today could be the day. I am ready.",
    milestone: "Due Date!",
  },
];

async function seed() {
  console.log("Seeding weekly content...");
  for (const w of weeks) {
    await db.weeklyContent.upsert({
      where: { week: w.week },
      create: w,
      update: w,
    });
    process.stdout.write(`.`);
  }
  console.log(`\nSeeded ${weeks.length} weeks of pregnancy content.`);
  await db.$disconnect();
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
