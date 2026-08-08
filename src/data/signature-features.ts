/**
 * Signature Features — Static Data
 * --------------------------------
 * Belly Bonding Rituals, My Mother's Mother prompts,
 * Fear to Flame, Dream symbols, Hormone Horoscope, Name Garden starter names,
 * Birth Playlist song suggestions, Memory Capsule types
 */

// ─── Belly Bonding Rituals ───────────────────────────────────────
// 40 daily micro-rituals (one per week), each with phrase + gesture + breath

export interface BellyRitual {
  week: number;
  phrase: string;   // what to say to your bump
  gesture: string;  // where to place your hands
  breath: string;   // breath cue
}

export const BELLY_RITUALS: BellyRitual[] = [
  { week: 1, phrase: "Hey, little one. I'm here. I'm already so glad you chose me.", gesture: "Both hands flat on your lower belly, fingers spread wide like you're holding something precious", breath: "Breathe in slow through your nose for 4 counts, let it out through parted lips for 6" },
  { week: 2, phrase: "You're so small right now, but I already feel full because of you.", gesture: "Right hand on your belly, left hand over your heart", breath: "In for 4, hold softly for 2, out for 6" },
  { week: 3, phrase: "I'm going to love you so fiercely. You have no idea what's coming.", gesture: "Cup your belly with both hands like you're cradling warm water", breath: "In through the nose, out like you're blowing on a dandelion" },
  { week: 4, phrase: "Whatever happens, whatever I'm feeling — you are the yes in all of it.", gesture: "Palms pressing gently into your lower belly, feeling for warmth", breath: "Deep belly breath — let your belly rise into your hands" },
  { week: 5, phrase: "Your mama is tired today. But she's also the strongest she's ever been.", gesture: "One hand on belly, trace slow circles with your fingertips", breath: "In for 3, out for 5, soft and easy" },
  { week: 6, phrase: "I wonder what your laugh sounds like. I think about it all the time.", gesture: "Both hands on belly, rock gently side to side", breath: "Breathe like you're humming — feel the vibration in your chest" },
  { week: 7, phrase: "You're making a whole new heart in there. That's the most incredible thing anyone's ever done.", gesture: "Left hand on your heart, right hand low on your belly — connect them", breath: "Breathe in love, breathe out worry" },
  { week: 8, phrase: "I'm learning patience because of you. Every day, a little more.", gesture: "Hands clasped over your belly, resting like a bridge", breath: "In for 4, hold for 4, out for 6 — let it be slow" },
  { week: 9, phrase: "Some days are hard, baby. But you make every single one worth it.", gesture: "Wrap both arms around your midsection like you're hugging yourself and baby together", breath: "Breathe in comfort, breathe out tension" },
  { week: 10, phrase: "I'm already your safe place. I promise to keep being that.", gesture: "Both palms flat, pressing gently, holding space", breath: "Long slow breath in, longer slow breath out" },
  { week: 11, phrase: "You're growing in the dark, and I'm growing right alongside you.", gesture: "One hand tracing the curve of your belly, the other resting on your thigh", breath: "Breathe like the tide — slow in, slow out" },
  { week: 12, phrase: "Almost to the second trimester, love. We made it through the quiet part.", gesture: "Hands cupped under your belly, lifting gently like an offering", breath: "In for 4, out for 8 — the longest exhale you've taken today" },
  { week: 13, phrase: "I felt a flutter — or maybe I imagined it. Either way, my heart knew.", gesture: "Fingertips spread wide across your belly, waiting, listening", breath: "Still breath — barely there, just a whisper of air" },
  { week: 14, phrase: "You're the size of a lemon now. All tart and bright and perfect.", gesture: "Trace the outline of your belly with both hands, getting to know its shape", breath: "In for 4, out for 6, feel your body expanding to make room" },
  { week: 15, phrase: "Today I choose to trust my body. It knows exactly what it's doing.", gesture: "Hands on your hips, thumbs resting on your lower belly", breath: "Deep breath into your pelvis — let it pool at the base of you" },
  { week: 16, phrase: "I can feel you moving now. Little seismic waves of love.", gesture: "Palms flat where you last felt movement, waiting", breath: "Breathe and smile — let your body know it's safe" },
  { week: 17, phrase: "You're hearing my voice now, muffled and warm. This is the soundtrack of your first world.", gesture: "Lean forward slightly, hands on belly, chin tilted down — bring yourself closer", breath: "Hum on the exhale — let baby feel the vibration" },
  { week: 18, phrase: "My body is not breaking. It is becoming. There is a difference, and it is holy.", gesture: "Both hands on your belly, pressing in gently, then releasing — a rhythm", breath: "Breathe in strength, breathe out fear" },
  { week: 19, phrase: "You're halfway home, baby. The best is still ahead of us.", gesture: "One hand on your belly button, the other reaching back to touch your spine", breath: "In for 4, hold for 4, out for 8" },
  { week: 20, phrase: "I felt you kick today and I laughed out loud like a fool in the grocery store.", gesture: "Wherever you felt the kick, press back gently — a conversation in touch", breath: "Short little breaths of joy, then one long slow one" },
  { week: 21, phrase: "You're getting so big I can see you move now. Little ripples under my skin.", gesture: "Watch your belly, hands resting nearby, just observing", breath: "Breathe normally — just watch the miracle" },
  { week: 22, phrase: "I'm nesting already. Your room is going to be so beautiful, little one.", gesture: "Hands on your belly, then spreading your arms wide — making space", breath: "In for 4, out for 6, with open arms on the exhale" },
  { week: 23, phrase: "You're listening to my heart right now. That's the first song you'll ever know.", gesture: "Right hand on your chest where your heartbeat is strongest", breath: "Breathe normally and feel your pulse — baby feels it too" },
  { week: 24, phrase: "Viability week. If you came now, you could survive. But I need you to stay. Stay.", gesture: "Both arms wrapped tight around your belly, holding on", breath: "Shallow protective breaths, then one deep release" },
  { week: 25, phrase: "Your daddy is going to be so wrapped around your finger. You won't even have to try.", gesture: "One hand on belly, the other reaching out — a bridge between you and partner", breath: "Breathe in gratitude, breathe out love" },
  { week: 26, phrase: "My body is doing something ancient and sacred. Women have done this for a hundred thousand years.", gesture: "Both hands on belly, eyes closed, feeling the lineage", breath: "Slow ancestral breath — in through the nose, out through the mouth, deep" },
  { week: 27, phrase: "Third trimester. Home stretch. You and me, baby — we've got this.", gesture: "Both hands spread wide across your belly — claim it, own it", breath: "Strong breath in, powerful breath out" },
  { week: 28, phrase: "I'm tired, I'm big, I'm beautiful, and I'm almost there.", gesture: "Hands on your lower back and belly at the same time — hold yourself together", breath: "In for 4, out for 8 — make the exhale twice as long" },
  { week: 29, phrase: "I talk to you more than I talk to most people. You're my favorite conversation.", gesture: "Lean close to your belly, chin almost touching it", breath: "Whisper-breath — so soft you can barely hear yourself" },
  { week: 30, phrase: "Every kick reminds me: you're real. You're coming. This is actually happening.", gesture: "Both hands pressed flat wherever baby is most active", breath: "Breathe in surprise, breathe out wonder" },
  { week: 31, phrase: "I'm scared of the birth, but I'm more excited to meet you. That ratio feels right.", gesture: "One hand on heart, one on belly — let courage flow between them", breath: "Brave breath — in for 4, hold for 2, out for 6" },
  { week: 32, phrase: "You're settling into position. Getting ready. We both are.", gesture: "Hands cradling the underside of your belly, supporting its weight", breath: "Heavy grounding breath — feel your feet on the floor" },
  { week: 33, phrase: "I've been carrying you for over seven months. My arms are going to be so strong.", gesture: "Flex your arms, then rest them gently back on your belly", breath: "In for 4, out for 6 — feel your strength" },
  { week: 34, phrase: "Your lungs are almost ready. Practice breathing, little one. I'll teach you the rest.", gesture: "Hands on your own ribs, feeling your own breath", breath: "Deep rib-breath — expand sideways, not just forward" },
  { week: 35, phrase: "You're running out of room in there. I know the feeling, baby.", gesture: "Gentle pats on your belly — a tactile lullaby", breath: "Light quick breaths, then a long slow release" },
  { week: 36, phrase: "Any day now. Or in four weeks. Either way, I'm ready.", gesture: "Hands flat, pressing gently — counting your baby's movements", breath: "Calm steady breath — you are ready" },
  { week: 37, phrase: "You're early or you're on time — either way, you're right on schedule for being mine.", gesture: "Both hands tracing slow figure-eights on your belly", breath: "Flowing breath — no pauses, just a river of air" },
  { week: 38, phrase: "My body knows what to do. I just have to let it.", gesture: "Hands on your belly, then letting them fall open to your sides — surrender", breath: "Release breath — let it all go on the exhale" },
  { week: 39, phrase: "I can't wait to see your face. I've been imagining it for nine months.", gesture: "Cup your face with one hand, your belly with the other", breath: "Anticipation breath — quick in, slow out" },
  { week: 40, phrase: "We're here, baby. Right at the door. I'll go first, and I'll hold it open for you.", gesture: "Both hands open, palms up on your belly — an invitation", breath: "The longest, slowest, most intentional breath you've ever taken" },
];

// ─── My Mother's Mother ──────────────────────────────────────────
// 12 guided interview prompts about maternal lineage

export interface MaternalPrompt {
  index: number;
  title: string;
  prompt: string;
  followUp?: string;
}

export const MATERNAL_PROMPTS: MaternalPrompt[] = [
  { index: 0, title: "Her Beginning", prompt: "What was your mother's name, and what do you know about the day she was born? Was it at home, in a hospital? Who was there?", followUp: "How does knowing (or not knowing) this make you feel about your own birth story?" },
  { index: 1, title: "Young Mother", prompt: "How old was your mother when she had her first child? What was her life like at that age — what did she care about, what did she fear?", followUp: "Do you see any of yourself in the woman she was then?" },
  { index: 2, title: "Pregnancy Truths", prompt: "Did your mother ever tell you what pregnancy was like for her? The nausea, the cravings, the fear, the joy — what did she share?", followUp: "What do you wish she had told you that she didn't?" },
  { index: 3, title: "Her Birth Story", prompt: "What do you know about the day your mother gave birth to you? How long was her labor? Was it what she expected?", followUp: "If you could ask her one question about that day, what would it be?" },
  { index: 4, title: "Her Mother", prompt: "What was your grandmother like? What stories did your mother tell you about her own childhood and her mother?", followUp: "What traits or traditions do you think you inherited from her?" },
  { index: 5, title: "Lessons in Love", prompt: "What did your mother teach you — not through words, but through how she loved you? Think about the small things.", followUp: "Which of those quiet lessons do you want to pass on to your baby?" },
  { index: 6, title: "What She Carried", prompt: "What hardships or sorrows do you think your mother carried that she never spoke about? How did they shape her?", followUp: "Are there things you're carrying now that you hope your child will never have to know?" },
  { index: 7, title: "Her Strengths", prompt: "What was your mother genuinely great at? Not the big things — the small, specific things only someone close would notice.", followUp: "Do you have any of those strengths? Or did you develop different ones?" },
  { index: 8, title: "Traditions and Rituals", prompt: "Were there any pregnancy or birth traditions in your family? Things your mother did, or her mother did, to welcome a baby?", followUp: "Would you like to carry any of those forward, or create your own?" },
  { index: 9, title: "What She'd Say", prompt: "If your mother could sit beside you right now, with her hand on your belly, what do you think she'd say to you?", followUp: "What would you say back to her?" },
  { index: 10, title: "The Name", prompt: "Does your name have a story? Why did your mother choose it? Does it connect to anyone in your family's history?", followUp: "How are you thinking about names for your baby? Is family history part of that?" },
  { index: 11, title: "Your Letter", prompt: "Write a letter directly to your baby about the women they come from. Not a list of facts — a feeling. What is the emotional inheritance?", followUp: "This is your final prompt. When you're ready, this letter becomes part of your family's story." },
];

// ─── Fear to Flame ───────────────────────────────────────────────
// AI reframes fears — stages: ember → spark → flame

export const FEAR_CATEGORIES = [
  "Birth & Labor",
  "Health & Complications",
  "Motherhood & Identity",
  "Relationship Changes",
  "Financial Worries",
  "Body & Appearance",
  "Baby's Health",
  "Loss & Grief",
] as const;

export const FEAR_STAGE_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  ember:  { label: "Ember",  emoji: "🔥", color: "text-orange-500" },
  spark:  { label: "Spark",  emoji: "✨", color: "text-yellow-500" },
  flame:  { label: "Flame",  emoji: "🔥", color: "text-rose-gold" },
};

// ─── DreamKeeper ──────────────────────────────────────────────────

export const DREAM_MOODS = ["vivid", "strange", "beautiful", "scary", "funny", "recurring", "emotional", "fleeting"] as const;

export const COMMON_PREGNANCY_SYMBOLS = [
  "Water / Ocean / Swimming",
  "Flying or Falling",
  "Animals (especially babies)",
  "Being Lost or Trapped",
  "Birth or Babies",
  "Houses or Rooms",
  "Teeth or Hair",
  "Running Late",
  "Naked in Public",
  "Food or Eating",
  "Death or Transformation",
  "Doors or Pathways",
  "Gardens or Flowers",
  "Storms or Weather",
  "Family Members",
  "School or Exams",
] as const;

// ─── Hormone Horoscope ────────────────────────────────────────────
// Weekly hormone insights, science-backed but written poetically

export interface HormoneInsight {
  weekRange: [number, number];
  title: string;
  dominantHormones: string[];
  body: string;
  heart: string;
  tip: string;
}

export const HORMONE_INSIGHTS: HormoneInsight[] = [
  { weekRange: [1, 4], title: "The Quiet Revolution", dominantHormones: ["hCG", "Progesterone"], body: "Human chorionic gonadotropin — hCG — is the tiny chemical messenger that told the world you were pregnant. It's rising exponentially right now, doubling every 48 hours, and it's the reason your body knows before your mind does. Progesterone is flooding in behind it, softening your muscles, loosening your joints, making your womb a welcoming place. You may feel nothing yet, or you may feel everything — nausea, exhaustion, a strange electric tingling in your chest. Both are normal. Both are your body working so hard on something so small.", heart: "Emotionally, this is the liminal space — the doorway between who you were and who you're becoming. You might feel irritable one moment and weepy the next, not because anything is wrong, but because your entire emotional landscape is being redrawn. Be impossibly gentle with yourself right now.", tip: "Eat small, frequent meals with protein and complex carbs. Keep saltine crackers by your bed. Let yourself nap without guilt — your body is building a human." },
  { weekRange: [5, 8], title: "The Rising Tide", dominantHormones: ["hCG", "Estrogen", "Progesterone"], body: "This is often the hardest stretch hormonally. hCG peaks around weeks 8-10, and with it, nausea can reach its zenith. Estrogen is climbing too — it's 1000 times higher than pre-pregnancy levels by now, and it affects everything from your skin to your sinuses to your sense of smell. Your blood volume is starting to increase (it'll be up 50% by week 32), and your heart is already working harder than it did a month ago. You're basically running a marathon while lying on the couch, and that's not an exaggeration.", heart: "The emotional weather is intense right now. Mood swings that feel like whiplash, anxiety that shows up uninvited, a strange mix of excitement and terror that sits in your chest. This is the estrogen-progesterone tango, and it is exhausting. But underneath it all, your brain is also producing more oxytocin — the love hormone — laying the neural groundwork for the bond you'll feel when you hold your baby.", tip: "Vitamin B6 can help with nausea. Ginger tea, acupressure wristbands, and cold foods (which have less aroma) are your friends. Cry if you need to — it literally processes hormones." },
  { weekRange: [9, 12], title: "The Turning Point", dominantHormones: ["hCG (peaking)", "Relaxin", "Estrogen"], body: "hCG is reaching its peak and will begin to plateau — for many mamas, this means the fog of first-trimester nausea starts to lift. Relaxin is loosening every joint and ligament in your body, preparing your pelvis for birth months from now. You might notice your hips aching, your feet spreading, a new looseness in your movements. Estrogen continues to rise, thickening your uterine lining, increasing blood flow to your baby, and giving you that famous pregnancy glow (or pregnancy acne — hormones don't discriminate).", heart: "As hCG levels off, the emotional storms may quiet slightly, replaced by a more settled anticipation. But relaxin doesn't just loosen your joints — some researchers believe it loosens emotional boundaries too, making you more empathetic, more open, more raw. You might find yourself deeply moved by things that never used to affect you. That's not weakness — that's your heart expanding.", tip: "This is a great time to start a gentle movement practice — prenatal yoga or swimming. Your joints need support, not strain. And start sharing your news if you're ready — the second trimester glow-up is coming." },
  { weekRange: [13, 16], title: "The Golden Window", dominantHormones: ["Estrogen", "Progesterone", "Relaxin"], body: "Welcome to the honeymoon phase of pregnancy. hCG has dropped to a manageable level, nausea fades for most, and energy returns. Estrogen is now at magnificent levels — your hair is thicker, your skin is luminous, your nails grow faster. Progesterone keeps your uterus calm and your baby protected. Blood volume is up 20-30%, giving you that extra blush in your cheeks. Your uterus has risen above your pelvic bone and your baby is growing rapidly — about three inches long now, the size of an avocado.", heart: "This is often the sweetest stretch emotionally. The fear of miscarriage drops significantly, the nausea lifts, and a warm, protective instinct kicks in. Oxytocin continues to build, and you may find yourself feeling more connected to your partner, more nurturing toward everyone around you, more in touch with a deep, ancient tenderness you didn't know you had.", tip: "Enjoy this energy — it's the best time for travel, nesting projects, and deep conversations with your partner. Start your baby registry. Take bump photos. This is the trimester everyone talks about." },
  { weekRange: [17, 20], title: "The Quickening", dominantHormones: ["Estrogen", "Progesterone", "hPL (beginning)"], body: "Human placental lactogen (hPL) starts making its presence known — this hormone is your baby's way of telling your body to redirect nutrients their way. You might feel hungrier than usual as your blood sugar dips more quickly. Estrogen and progesterone are in a beautiful equilibrium right now, supporting steady growth. Your uterus is at your belly button level, and you're probably showing. Your heart is pumping 30-50% more blood than before pregnancy.", heart: "Feeling your baby move for the first time — quickening — is one of the most profound emotional milestones of pregnancy. It shifts something abstract into something real. Many mamas describe a surge of fierce, protective love at this moment that catches them off guard. You might also feel more confident, more grounded, more sure of yourself as a mother than you did a month ago.", tip: "Eat protein with every meal to stabilize blood sugar. Stay hydrated — your blood volume needs it. If you haven't felt movement yet, don't panic — first-time mamas often feel it later (week 20-22)." },
  { weekRange: [21, 24], title: "The Heartbeat Era", dominantHormones: ["Estrogen (surging)", "Progesterone", "hPL"], body: "Estrogen is surging toward its pregnancy peak (it'll max out around week 24-28). This means maximum blood flow to your uterus, your baby, your skin, everything. You might notice more vaginal discharge, more vivid dreams, more congestion (pregnancy rhinitis is real). Your baby's heartbeat is strong enough to hear with a fetoscope, and their ears are developed enough to recognize your voice. hPL continues to raise your insulin resistance slightly — gestational diabetes screening happens around now.", heart: "Estrogen's peak brings heightened emotions but also heightened intuition. Many mamas report feeling almost psychic about their baby — knowing when they're awake, when they're sleeping, what they need. Trust this. Your body and your baby are in constant chemical conversation, and you're more tuned in than you realize. Vivid dreams are also common — your subconscious is processing the massive identity shift happening in your waking life.", tip: "Sleep on your left side to maximize blood flow to baby. Do your glucose test without fear — most results are normal. Stay cool — estrogen can cause hot flashes and make you feel flushed." },
  { weekRange: [25, 28], title: "The Great Expansion", dominantHormones: ["Estrogen (peak)", "Progesterone", "Relaxin", "hPL"], body: "Your blood volume has increased by up to 50% now. Your heart is working 40-50% harder than pre-pregnancy. Estrogen has peaked, and your body is a masterpiece of adaptation — every organ system has modified itself to support this pregnancy. Relaxin is making your pelvis more flexible, which can cause hip pain and that characteristic pregnancy waddle. hPL is in full swing, making your cells slightly insulin-resistant so more glucose stays available for your baby. Your baby can now open their eyes, breathe (amniotic fluid, not air), and cry silently.", heart: "The third trimester approaches, and with it, a complex emotional cocktail. Excitement, impatience, nesting instincts, and a new wave of anxiety about birth. Progesterone's steady presence can make you feel sluggish and emotionally blunted — like you're wrapped in warm cotton. Some mamas love this feeling; others find it frustrating. Both are valid. The emotional work of pregnancy is as real as the physical work.", tip: "Watch for swelling in your hands and face (different from normal foot/ankle swelling). Start doing perineal massage if you're planning a vaginal birth. Invest in a pregnancy pillow — sleep is about to get harder." },
  { weekRange: [29, 32], title: "The Deep Dive", dominantHormones: ["Progesterone (high)", "Relaxin", "hPL", "Oxytocin (rising)"], body: "Progesterone dominates the late third trimester, keeping your uterus quiet until it's time. But it also slows your digestion (hello, heartburn), softens your muscles (hello, clumsiness), and can make you feel heavy and slow. Relaxin is peaking — your pelvis is at its most flexible, which means hip pain, pubic symphysis discomfort, and a feeling that everything is loose. hPL is at its highest, maximizing nutrient transfer to your baby who's gaining about half a pound per week. And oxytocin — the hormone of love, bonding, and contractions — is slowly beginning to rise, preparing your body for birth.", heart: "The emotional deep dive begins. You might find yourself nesting intensely — cleaning, organizing, preparing with an urgency that surprises you. You might also find yourself withdrawing socially, turning inward, needing more quiet and solitude. This is your brain preparing for the intense focus that birth and early motherhood require. It's not antisocial — it's protective. Let yourself go quiet.", tip: "Elevate your feet. Eat small meals to manage heartburn. Practice your breathing techniques for labor. Start writing your birth plan if you haven't — clarity now reduces anxiety later." },
  { weekRange: [33, 36], title: "The Gathering", dominantHormones: ["Progesterone", "Relaxin", "Oxytocin (building)", "Prolactin (beginning)"], body: "Your baby is settling into position — head down for most. Your cervix is beginning to soften and thin (efface) under the influence of relaxin. Prolactin, the milk-making hormone, starts rising now, and you might notice colostrum leaking from your breasts. Oxytocin is building, creating Braxton Hicks contractions — your uterus practicing for the real thing. Your blood volume is at its absolute maximum, and your heart is working at peak capacity. Every system in your body is converged on one goal.", heart: "Emotionally, this is the 'gathering' phase — collecting courage, collecting supplies, collecting yourself. Many mamas feel a strange mix of impatience and terror. The reality of birth is close now, and the unknown is both thrilling and terrifying in equal measure. You might find yourself wanting to be near your mother, your partner, your closest people — an instinct to gather your village before the storm.", tip: "Pack your hospital bag. Pre-register at your birth facility. Do your kick counts daily — baby should move 10 times in 2 hours. Rest as much as you can — you're about to run an ultramarathon." },
  { weekRange: [37, 40], title: "The Threshold", dominantHormones: ["Oxytocin (surging)", "Progesterone (dropping)", "Relaxin (peak)", "Prolactin", "Cortisol (rising)", "Endorphins"], body: "This is it. The hormonal symphony that will orchestrate your birth is tuning up. Progesterone, which has kept your uterus calm for nine months, begins to drop. Oxytocin surges, triggering contractions. Relaxin peaks to open your cervix and loosen your pelvis. Cortisol — the stress hormone — rises in your baby too, helping their lungs mature and preparing them for the stress of birth. Prolactin is ready for breastfeeding. And your body will flood with endorphins — nature's pain relief — as labor intensifies. Every hormone has a role. Your body is not broken. It is brilliantly, perfectly designed for this.", heart: "The emotional weather at the threshold is unlike anything else in human experience. Excitement, fear, impatience, nostalgia for your pre-baby life, overwhelming love for a person you haven't met yet — sometimes all within the same five minutes. This is normal. This is your entire endocrine system preparing you for the most transformative moment of your life. Let yourself feel all of it. The tears, the laughter, the panic, the peace. Every emotion is a valid one right now.", tip: "Trust your body. Trust your team. Eat easily digestible foods. Move during early labor — walk, sway, rock. Save your energy for the hard work. And remember: this is the last time your baby will be inside you. Feel it all." },
];

export function getHormoneInsight(week: number): HormoneInsight | undefined {
  return HORMONE_INSIGHTS.find(h => week >= h.weekRange[0] && week <= h.weekRange[1]);
}

// ─── Name Garden ──────────────────────────────────────────────────
// Starter name suggestions by theme

export interface NameSuggestion {
  name: string;
  origin?: string;
  meaning?: string;
  theme: string;
}

export const NAME_THEMES = ["Nature", "Vintage", "Modern", "Cultural", "Celestial", "Literary"] as const;
export type NameTheme = typeof NAME_THEMES[number];

export const NAME_SUGGESTIONS: NameSuggestion[] = [
  // Nature
  { name: "Willow", origin: "English", meaning: "Graceful and resilient tree", theme: "Nature" },
  { name: "Hazel", origin: "English", meaning: "The hazelnut tree; wisdom and protection", theme: "Nature" },
  { name: "Ivy", origin: "English", meaning: "Evergreen climbing plant; fidelity", theme: "Nature" },
  { name: "Juno", origin: "Latin", meaning: "Queen of the heavens", theme: "Nature" },
  { name: "Rowan", origin: "Gaelic", meaning: "Little red one; tree of protection", theme: "Nature" },
  { name: "Sage", origin: "Latin", meaning: "Wise and healing", theme: "Nature" },
  { name: "Flora", origin: "Latin", meaning: "Goddess of flowers", theme: "Nature" },
  { name: "Silas", origin: "Latin", meaning: "Of the forest", theme: "Nature" },
  { name: "Aspen", origin: "English", meaning: "Quaking tree; strength in community", theme: "Nature" },
  { name: "Cedar", origin: "Hebrew", meaning: "Strong, enduring tree", theme: "Nature" },
  // Vintage
  { name: "Eleanor", origin: "Greek", meaning: "Shining light", theme: "Vintage" },
  { name: "Theodore", origin: "Greek", meaning: "Gift of God", theme: "Vintage" },
  { name: "Clara", origin: "Latin", meaning: "Bright and clear", theme: "Vintage" },
  { name: "Arthur", origin: "Celtic", meaning: "Bear king; strong as a bear", theme: "Vintage" },
  { name: "Josephine", origin: "Hebrew", meaning: "Jehovah increases", theme: "Vintage" },
  { name: "Henry", origin: "Germanic", meaning: "Estate ruler; home leader", theme: "Vintage" },
  { name: "Mabel", origin: "Latin", meaning: "Lovable", theme: "Vintage" },
  { name: "Oscar", origin: "Irish", meaning: "Deer lover; gentle warrior", theme: "Vintage" },
  // Modern
  { name: "Mila", origin: "Slavic", meaning: "Gracious and dear", theme: "Modern" },
  { name: "Leo", origin: "Latin", meaning: "Lion; brave", theme: "Modern" },
  { name: "Nova", origin: "Latin", meaning: "New star; new beginning", theme: "Modern" },
  { name: "Finn", origin: "Irish", meaning: "Fair; white; clear", theme: "Modern" },
  { name: "Aria", origin: "Italian", meaning: "Melody; air; song", theme: "Modern" },
  { name: "Jude", origin: "Hebrew", meaning: "Praised", theme: "Modern" },
  { name: "Zara", origin: "Arabic", meaning: "Blooming flower; radiance", theme: "Modern" },
  { name: "Miles", origin: "Latin", meaning: "Soldier; merciful", theme: "Modern" },
  // Celestial
  { name: "Luna", origin: "Latin", meaning: "Moon", theme: "Celestial" },
  { name: "Orion", origin: "Greek", meaning: "Rising in the sky; hunter constellation", theme: "Celestial" },
  { name: "Aurora", origin: "Latin", meaning: "Dawn; goddess of the morning", theme: "Celestial" },
  { name: "Atlas", origin: "Greek", meaning: "To carry; the star-bearer", theme: "Celestial" },
  { name: "Stella", origin: "Latin", meaning: "Star", theme: "Celestial" },
  { name: "Cosmo", origin: "Greek", meaning: "Order; beauty; the universe", theme: "Celestial" },
  { name: "Lyra", origin: "Greek", meaning: "Lyre; constellation of the harp", theme: "Celestial" },
  { name: "Sol", origin: "Latin", meaning: "Sun", theme: "Celestial" },
  // Literary
  { name: "Juliet", origin: "Latin", meaning: "Youthful; lover of literature", theme: "Literary" },
  { name: "Oliver", origin: "French", meaning: "Olive tree; peace", theme: "Literary" },
  { name: "Poet", origin: "English", meaning: "One who creates with words", theme: "Literary" },
  { name: "Auden", origin: "Old English", meaning: "Old friend", theme: "Literary" },
  { name: "Sylvie", origin: "French", meaning: "Of the forest", theme: "Literary" },
  { name: "Felix", origin: "Latin", meaning: "Happy and fortunate", theme: "Literary" },
  { name: "Esme", origin: "French", meaning: "Esteemed; beloved", theme: "Literary" },
  { name: "Remy", origin: "French", meaning: "Oarsman; from Rheims", theme: "Literary" },
  // Cultural
  { name: "Amara", origin: "Igbo", meaning: "Grace; mercy", theme: "Cultural" },
  { name: "Kai", origin: "Hawaiian", meaning: "Sea; ocean", theme: "Cultural" },
  { name: "Zuri", origin: "Swahili", meaning: "Beautiful", theme: "Cultural" },
  { name: "Kenji", origin: "Japanese", meaning: "Strong and vigorous; second son", theme: "Cultural" },
  { name: "Priya", origin: "Sanskrit", meaning: "Beloved; dear one", theme: "Cultural" },
  { name: "Idris", origin: "Welsh/Arabic", meaning: "Studious lord; interpreter", theme: "Cultural" },
  { name: "Nia", origin: "Swahili", meaning: "Purpose; intention", theme: "Cultural" },
  { name: "Ravi", origin: "Sanskrit", meaning: "Sun", theme: "Cultural" },
];

// ─── Birth Playlist ───────────────────────────────────────────────

export interface PlaylistPhase {
  id: string;
  label: string;
  description: string;
  icon: string;
  accent: string;
}

export const PLAYLIST_PHASES: PlaylistPhase[] = [
  { id: "early", label: "Early Labor", description: "Long, slow contractions. You need calm, steady energy. Songs that feel like a warm hand on your back.", icon: "🌅", accent: "bg-sage/30" },
  { id: "active", label: "Active Labor", description: "Contractions intensify. You need rhythm, power, and something to move to. Songs with a pulse.", icon: "🔥", accent: "bg-terracotta/20" },
  { id: "pushing", label: "Pushing", description: "The final push. You need raw strength and determination. Songs that make you feel invincible.", icon: "💪", accent: "bg-blush/40" },
  { id: "first_cry", label: "First Cry", description: "The moment everything changes. The first sound your baby hears. Make it count.", icon: "👶", accent: "bg-rose-gold/20" },
  { id: "golden_hour", label: "Golden Hour", description: "Skin to skin. The first hour together. Songs that feel like being held by the person you love most.", icon: "✨", accent: "bg-butter" },
];

export const SONG_SUGGESTIONS: Record<string, { title: string; artist: string; reason: string }[]> = {
  early: [
    { title: "Holocene", artist: "Bon Iver", reason: "Expansive and meditative — like staring at the sky during a contraction" },
    { title: "Breathe Me", artist: "Sia", reason: "Gentle building intensity that matches early labor's rhythm" },
    { title: "Better Together", artist: "Jack Johnson", reason: "Warm, simple, reminds you why you're doing this" },
    { title: "The Night We Met", artist: "Lord Huron", reason: "Aching beauty — perfect for the quiet, nervous early hours" },
    { title: "Landslide", artist: "Fleetwood Mac", reason: "Stevie's voice is a lullaby for grown women facing big changes" },
    { title: "Come Away With Me", artist: "Norah Jones", reason: "Smooth, unhurried, like a warm bath for your nervous system" },
  ],
  active: [
    { title: "Run the World (Girls)", artist: "Beyonce", reason: "Pure power. You ARE running the world right now." },
    { title: "Redemption Song", artist: "Bob Marley", reason: "Steady, determined, about liberation — you're liberating your baby" },
    { title: "Dog Days Are Over", artist: "Florence + The Machine", reason: "Euphoric chaos that matches the intensity of active labor" },
    { title: "Wake Me Up", artist: "Avicii", reason: "High energy, soaring melody — keep moving, keep breathing" },
    { title: "Survivor", artist: "Destiny's Child", reason: "Because that's exactly what you are in this moment" },
    { title: "Africa", artist: "Toto", reason: "Anchoring, familiar, impossible not to move to" },
  ],
  pushing: [
    { title: "Roar", artist: "Katy Perry", reason: "Because you're about to roar your baby into the world" },
    { title: "Lose Yourself", artist: "Eminem", reason: "One moment, one opportunity. This is IT." },
    { title: "You Make My Dreams (Come True)", artist: "Daryl Hall & John Oates", reason: "Pure joy energy for the final push" },
    { title: "A Sky Full of Stars", artist: "Coldplay", reason: "Uplifting, soaring — perfect for the crescendo of birth" },
    { title: "Happy", artist: "Pharrell Williams", reason: "Because this moment, despite everything, is happy" },
  ],
  first_cry: [
    { title: "Isn't She Lovely", artist: "Stevie Wonder", reason: "The ultimate welcome song. Written for his own newborn daughter." },
    { title: "Here Comes the Sun", artist: "The Beatles", reason: "After the storm, the sun comes out. Always." },
    { title: "Beautiful Boy", artist: "John Lennon", reason: "Written for his son. Every word is a parent's prayer." },
    { title: "Sweetest Devotion", artist: "Adele", reason: "Adele wrote this about her son. The devotion is palpable." },
    { title: "A Thousand Years", artist: "Christina Perri", reason: "Because you've loved them for a thousand years already, and now they're here." },
  ],
  golden_hour: [
    { title: "Make You Feel My Love", artist: "Adele", reason: "Because you'd do anything for this tiny person on your chest" },
    { title: "What a Wonderful World", artist: "Louis Armstrong", reason: "For the first time, it truly is." },
    { title: "You've Got a Friend in Me", artist: "Randy Newman", reason: "You are their first friend. And they are yours." },
    { title: "Hallelujah", artist: "Jeff Buckley", reason: "Sacred, tender, overwhelming — like golden hour itself" },
    { title: "Blackbird", artist: "The Beatles", reason: "About a broken wing learning to fly. Your baby just took their first breath." },
  ],
};

// ─── Memory Capsule ───────────────────────────────────────────────

export const CAPSULE_TYPES = [
  { id: "letter", label: "Love Letter", emoji: "💌", description: "Write a letter to your future child", accent: "bg-blush/30" },
  { id: "wish", label: "Wish", emoji: "⭐", description: "A wish for their life", accent: "bg-butter" },
  { id: "promise", label: "Promise", emoji: "🤝", description: "A promise you'll keep", accent: "bg-sage/30" },
  { id: "photo_memory", label: "Photo Memory", emoji: "📸", description: "A photo with a story", accent: "bg-lavender/30" },
] as const;

export const CAPSULE_UNLOCK_OPTIONS = [
  { label: "On their 13th birthday", yearsFromNow: 13 },
  { label: "On their 18th birthday", yearsFromNow: 18 },
  { label: "On their 21st birthday", yearsFromNow: 21 },
  { label: "Their wedding day", yearsFromNow: 25 },
  { label: "When they have their first baby", yearsFromNow: 30 },
] as const;

// ─── Letters from Baby ─────────────────────────────────────────────
// The AI generates these dynamically using the weekly-content data.
// This export is a type + helper for the screen.

export interface BabyLetterData {
  week: number;
  letter: string;
  createdAt: string;
}
