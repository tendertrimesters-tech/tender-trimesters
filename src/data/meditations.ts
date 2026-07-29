/**
 * Audio Meditations — Guided Script Library (v2)
 * -----------------------------------------
 * 8 guided meditations rewritten in a warm, sensual, deeply human voice.
 * Long flowing passages. Breath woven into narrative. No choppiness.
 *
 * Voice direction: imagine a woman lying beside you in the dark, her voice
 * low and close, unhurried, almost a murmur. She is not instructing you.
 * She is inviting you. Every sentence flows into the next like warm water.
 */

export type MeditationCategory =
  | "first-trimester"
  | "second-trimester"
  | "third-trimester"
  | "birth-prep"
  | "postpartum";

export type BeatType =
  | "speak"    // spoken passage (long, flowing)
  | "pause"    // silent beat
  | "breath"   // breath cue woven in
  | "affirmation" // intimate repeat-after-me
  | "journal"; // post-meditation prompt

export interface MeditationBeat {
  type: BeatType;
  text?: string;
  pauseSeconds?: number;
  breath?: "in" | "out" | "hold";
}

export interface Meditation {
  id: string;
  title: string;
  subtitle: string;
  category: MeditationCategory;
  durationMinutes: number;
  intention: string;
  beats: MeditationBeat[];
  journalPrompt: string;
}

export const MEDITATIONS: Meditation[] = [

  // ─── 1. FIRST TRIMESTER — Soft Landing ────────────────────────────
  {
    id: "soft-landing",
    title: "Soft Landing",
    subtitle: "For mornings when the world feels too much",
    category: "first-trimester",
    durationMinutes: 7,
    intention:
      "A gentle, slow awakening for the mornings when nausea or anxiety make it hard to face the day. This is not a meditation that asks you to be strong — it asks you to be soft.",
    beats: [
      {
        type: "speak",
        text: "Before you move, before you even open your eyes, just let yourself be exactly where you are. Right here in the warm dark of your bed, your body heavy with sleep and something else — something new growing so quietly inside you that sometimes you almost forget it is there, until the nausea reminds you, or the exhaustion, or that little flutter of fear that lives just behind your ribs.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "speak",
        text: "I want you to let your hand drift down to your belly, so slowly, like you are reaching for something precious and half-asleep, and just let it rest there, your palm flat against your own skin, feeling the warmth of yourself through the fabric of whatever you are wearing. Do not press. Just let your hand be there, the way you might rest your hand on someone's back while they breathe.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "breath",
        breath: "in",
        text: "Now breathe in — just a slow, easy breath through your nose, like you are drawing in the smell of warm sheets and morning air and your own skin, and let that breath go all the way down, past your chest, past your stomach, into that deep, quiet place where your baby is curled up right now, barely the size of a plum, already forming a heart that beats.",
      },
      { type: "pause", pauseSeconds: 6 },
      {
        type: "breath",
        breath: "out",
        text: "And breathe out through your mouth — not pushing, not forcing, just letting the air fall out of you the way a sigh falls out of you when you finally sit down after a long day, that little sound your body makes when it remembers it can let go.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "If your stomach is turning this morning, if your mouth tastes like metal and the light coming through the curtains is too bright and you are already thinking about everything you have to do today, all the things that are waiting for you the moment you stand up — I want you to put all of that down for a minute. Not forever. Just for right now. You can pick it all back up later, every last bit of it, but right now you are just a body lying in a warm bed in the early morning, and nothing is asking anything of you except this breath, and this one, and this one.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Your body is doing something miraculous right now, and I do not use that word lightly — it is building a whole new person out of blood and bone and quiet darkness, and it is doing it while you sleep, while you eat breakfast, while you argue with your partner about what to watch tonight. You do not have to think about it. You do not have to help. Your body has been doing this for two hundred thousand years and it knows, in some deep, ancient, cellular way that your conscious mind will never fully understand, exactly what it is doing.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "So for today, for this morning, you do not have to be strong, and you do not have to be productive, and you do not even have to be okay. You just have to be here, breathing, your hand on your belly, your body doing its quiet, extraordinary work while the morning light creeps across the floor.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "affirmation",
        text: "I am allowed to be slow. I am allowed to be soft. I am carrying life, and that is enough for today.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Take one more breath with me, long and slow, filling your belly under your hand, and let it out with a little sound if one comes — a sigh, a hum, whatever your body wants to give. And whenever you are ready, not a moment before, open your eyes. The day will be there. It can wait.",
      },
      { type: "pause", pauseSeconds: 8 },
    ],
    journalPrompt:
      "Before you get up today, write down one thing your body did for you while you slept that you never had to think about. Your heart beat. Your lungs filled. A tiny heart began to form. Let that be enough.",
  },

  // ─── 2. FIRST TRIMESTER — In the Quiet ──────────────────────────
  {
    id: "in-the-quiet",
    title: "In the Quiet",
    subtitle: "For the fear you carry in the early weeks",
    category: "first-trimester",
    durationMinutes: 8,
    intention:
      "A meditation for the spiraling worry that visits in the early weeks — the fear that something might be wrong, that your body might not hold. This is not about banishing fear. It is about holding it differently.",
    beats: [
      {
        type: "speak",
        text: "Find somewhere you can close a door — the bathroom, the car in the driveway, the walk-in closet with the light off, wherever it is that you go when you need to be alone with the part of yourself that you do not show anyone else. Sit down, or lie down, or lean against the wall and let your whole weight rest against it, and just breathe. One slow breath, all the way in, and let it go like you are putting down something heavy.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "If you came here carrying fear — that sharp, electric kind that lives in your chest and wakes you up at three in the morning and sends you to the bathroom to check for blood again and again, even when there is nothing there — I want you to know that you are not the only one. Almost every woman who has ever been where you are right now has sat in a room like this one, in the dark, afraid of exactly the same things, loving a baby she has not yet met with a ferocity that scares her.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "That fear is not a sign that something is wrong. It is a sign that you are already a mother. It is proof — the only proof you need right now — that something in you has already begun to love so fiercely that the thought of losing it feels like it might split you open. And that is the most human thing in the world.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "breath",
        breath: "in",
        text: "So breathe in now — slow, deep, filling the very bottom of your lungs — and imagine that breath flowing all the way down to the small, warm, dark place where your baby is, and wrapping around them like a whispered promise.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "breath",
        breath: "out",
        text: "And breathe out — long and slow, through barely parted lips — and imagine letting go of the need to know what happens next. You do not know. And that is not a failure. That is the deepest, most honest kind of trust there is — the kind that does not know and loves anyway.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Picture your fear as something small — not a monster, not a storm, just something small and trembling that has come to you in the night looking for a place to rest. You do not need to fight it or fix it or talk it out of feeling what it feels. You just need to let it sit beside you for a moment, close enough that you can feel its warmth, and say — silently, or out loud, whichever your body needs — I see you. I am here. We will walk through this together, whatever comes.",
      },
      { type: "pause", pauseSeconds: 15 },
      {
        type: "speak",
        text: "Now place both hands on your belly and feel the warmth of your own palms against your own skin. Close your eyes and let your whole body soften — your jaw, the space between your eyebrows, the muscles in your shoulders that have been carrying more than you realized. Soften them the way candlelight softens a room.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "affirmation",
        text: "I will love this baby for as long as they are mine to love — and that is enough. That is everything.",
      },
      { type: "pause", pauseSeconds: 15 },
      {
        type: "speak",
        text: "Whatever happens from here — in this pregnancy, in this life — you are already a mother. The love you are feeling right now is real. It is not wasted, not ever. And when you stand up and leave this room, you will carry it with you like a small, steady flame that nothing can blow out.",
      },
      { type: "pause", pauseSeconds: 10 },
    ],
    journalPrompt:
      "Write a letter to the fear. Not a letter trying to make it go away — a letter that says: I see you, and I understand why you are here. Then write one line back to yourself from someone who loves you. Let that be the last thing you read today.",
  },

  // ─── 3. SECOND TRIMESTER — Hello, Little One ────────────────────
  {
    id: "hello-little-one",
    title: "Hello, Little One",
    subtitle: "A conversation with the life inside you",
    category: "second-trimester",
    durationMinutes: 9,
    intention:
      "A deep, intimate practice of bonding with your baby through your voice and your breath. Especially powerful once movement begins in the second trimester, but beautiful any time you want to feel closer.",
    beats: [
      {
        type: "speak",
        text: "This is the meditation where you talk to your baby. Not in the performative, cute way that people expect — not the high voice and the gentle cooing for an audience — but the real way. The way you talk to someone you love when no one else is listening, when it is just the two of you and the dark and the warmth between your hands.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "speak",
        text: "So get comfortable — wherever your body wants to be. Lying on your side with a pillow between your knees, or half-reclined against the headboard with the blankets pulled up, or sitting in the warm patch of light by the window. Wherever you are, let your body settle there like it belongs, because it does, right here, right now, in this moment that is only yours.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "breath",
        breath: "in",
        text: "Breathe in slowly through your nose, and feel your belly rise — that beautiful, round, life-filled belly that is the only home your baby has ever known — and imagine the breath flowing past your skin, past the muscle, past the warm amniotic dark, and reaching them like a touch.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "breath",
        breath: "out",
        text: "Breathe out through your mouth, slow and warm, and feel your belly fall gently, and imagine your baby feeling the rhythm of you — your chest rising and falling, your heartbeat steady beneath them like a lullaby they have been listening to since before their ears even opened.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "They know your voice, you know. They have known it for weeks. Every word you have spoken, every laugh that has surprised you, every quiet murmur you have made in the shower or the car or the dark — it has all traveled through your bones and the water around them and landed somewhere inside their growing, sleeping, half-formed consciousness. They do not understand the words yet. But they understand the warmth. The vibration. The fact that you are there, that you are the world, that your body is the sky and the ground and everything they have ever known.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "So now I want you to speak to them. Not a performance — just your voice, low and close, the way you would talk to someone lying beside you in the dark. You can say their name if you have one. You can say hello. You can say anything at all — the first thing that comes, the truest thing. Take your time. There is no rush. They have all the time in the world, and so do you, right here.",
      },
      { type: "pause", pauseSeconds: 20 },
      {
        type: "speak",
        text: "That was beautiful. They heard you. They always hear you.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "speak",
        text: "Now, in your own time, I want you to tell them three things. Just three, and you can take as long as you need between each one. First — something you cannot wait to show them. A place. A face. A window in your house where the light comes through in the late afternoon and turns everything gold. A song you want them to hear. Anything real, anything specific, anything that makes your heart ache a little when you picture sharing it with them.",
      },
      { type: "pause", pauseSeconds: 20 },
      {
        type: "speak",
        text: "Second — tell them about someone who is already loving them from the outside. Their father. Your mother. The dog who sleeps at the foot of your bed and does not know yet that everything is about to change. Tell your baby that they are already surrounded, already held, already part of a web of love that reaches beyond the walls of your body.",
      },
      { type: "pause", pauseSeconds: 20 },
      {
        type: "speak",
        text: "And third — make them a promise. Not a promise to be perfect. A promise to be real. To keep showing up on the hard days. To keep breathing even when everything in you wants to hold your breath. To tell them the truth about the world, even when the truth is hard. Whatever promise rises up in you, that is the right one. Say it out loud.",
      },
      { type: "pause", pauseSeconds: 20 },
      {
        type: "affirmation",
        text: "You are not a stranger to me. You have been here from the very beginning, and I will know you by the sound of my own heartbeat.",
      },
      { type: "pause", pauseSeconds: 15 },
      {
        type: "speak",
        text: "Keep your hands on your belly for one more breath — in, slow, feeling them rise with you — and out, even slower, the two of you breathing together, in the same body, in the same warm dark, in the same extraordinary ordinary moment. And whenever you are ready, open your eyes. They are still right there, inside you, listening.",
      },
      { type: "pause", pauseSeconds: 10 },
    ],
    journalPrompt:
      "Write down the three things you told your baby today — the place, the person, the promise. Date it. Keep it somewhere safe. Someday you will want to read it back to them, and they will want to hear it.",
  },

  // ─── 4. SECOND TRIMESTER — Replenish ────────────────────────────
  {
    id: "replenish",
    title: "Replenish",
    subtitle: "A midday reset for when the tank is empty",
    category: "second-trimester",
    durationMinutes: 6,
    intention:
      "A short, restorative practice for the midday crash — when the energy drops and the to-do list is half-finished. Can be done anywhere: desk chair, couch, parked car, even standing in the kitchen.",
    beats: [
      {
        type: "speak",
        text: "You do not need to lie down for this one. You just need to stop — just for a few minutes — the constant doing and going and checking and replying that has been eating away at you all morning. Wherever you are right now, just let your body settle. Let your spine grow tall without being stiff, let your shoulders drop away from your ears like they have been waiting all day to do this, let your jaw unclench just enough that you feel the space open up between your teeth.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "breath",
        breath: "in",
        text: "Now take a breath in — slow, through your nose — and imagine it drawing up from the earth beneath you, through the floor, through the soles of your feet if they are on the ground, rising through you like cool water filling a glass, all the way up into your chest.",
      },
      { type: "pause", pauseSeconds: 6 },
      {
        type: "breath",
        breath: "out",
        text: "And breathe out through your mouth — with a little sigh, the kind you make when you take off shoes that were too tight — and feel your whole body soften just a little more, like warm butter spreading on bread.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "There is a place inside you, right in the center of your chest, that never runs empty. It is not your energy, not exactly — it is something older than energy, something that was there before you were tired, before you were pregnant, before you were even born. It is the same steady flame that carried your grandmother through her hardest days and her grandmother before her, and it is burning quietly inside you right now, even when you cannot feel it, even when everything in you feels like it has been used up.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "You are not running on empty. You are running on something that does not get used up — something that fills back up the moment you stop long enough to let it. And right now, in this breath, in this pause, it is filling you back up. Not all the way — you do not have to be all the way full to keep going. Just enough. Just enough for the next hour, the next conversation, the next thing that asks you to stand up and show up and be the mother, the partner, the woman that you are.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "affirmation",
        text: "I have what I need for the next hour. Rest is not laziness. Rest is part of the work, and I am allowed to take it.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "breath",
        breath: "in",
        text: "One more breath — in, gathering, filling.",
      },
      { type: "pause", pauseSeconds: 5 },
      {
        type: "breath",
        breath: "out",
        text: "Out, releasing, letting the last bit of tension drain out of you like water through your fingertips.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "speak",
        text: "When you open your eyes and go back to your day, let it be a little softer than it was before. One thing at a time. You do not have to do it all. You just have to do the next thing.",
      },
      { type: "pause", pauseSeconds: 8 },
    ],
    journalPrompt:
      "Write down one thing on your to-do list that can wait until tomorrow. Not the least important thing — the thing that would feel the most delicious to put down. Cross it off. Feel the relief. Carry that.",
  },

  // ─── 5. THIRD TRIMESTER — Let the Night Hold You ────────────────
  {
    id: "let-the-night-hold-you",
    title: "Let the Night Hold You",
    subtitle: "A slow descent into sleep",
    category: "third-trimester",
    durationMinutes: 11,
    intention:
      "A long, slow, descending practice for the nights when sleep feels impossible — the belly heavy, the hips aching, the mind racing, the clock ticking. Designed to be listened to in bed, eyes closed, in the dark. The goal is for you to drift off before it ends.",
    beats: [
      {
        type: "speak",
        text: "You are already in bed, which is exactly where you need to be, and the only thing I am going to ask you to do for the next ten minutes is stay exactly like that. However you are lying — on your left side with the pregnancy pillow wedged between your knees and another one behind your back, or propped up on six pillows because that is the only position where you can breathe, or on your back with your knees apart because gravity is not your friend anymore — whatever position you found, let it be the right one. You do not have to move. You do not have to find a better one.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "The thing about sleep — the thing nobody tells you when you are lying here at midnight for the third time this week — is that you do not have to chase it. You do not have to be good at it. You do not have to do anything except lie here, breathing, in the dark, letting your body do what bodies do when they are finally still: soften, settle, slowly let go of the holding that has been running through you all day like a current.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "breath",
        breath: "in",
        text: "So breathe in through your nose, so slowly that the air almost does not feel like it is moving, just a cool whisper along the back of your throat, down into the deepest part of your lungs where the air has not been for hours.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "breath",
        breath: "out",
        text: "And breathe out through your mouth — longer than the in-breath, always longer, the way the tide goes out further than it comes in — with a soft, barely-there sound, like a long slow sigh into the pillow. That long out-breath is the sound your nervous system has been waiting for all day. It is the signal that says: you can rest now. I am safe. The watch is over.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Now I am going to walk through your body, slowly, from the top of your head all the way down to the tips of your toes, and I am not going to ask you to do anything with any of it. I just want you to bring your attention to each place and let it soften, the way fruit softens when you leave it in the sun — not collapsing, just yielding, becoming more itself.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "Start at the very top of your head. Feel the weight of your hair against the pillow, the coolness of the air on your scalp. Let the muscles across your forehead smooth out, like someone is pressing a warm cloth against them, slowly ironing out the creases that have been there all day. Let the space between your eyebrows open up. Let your eyelids grow heavy — not the forced heaviness of trying to sleep, but the natural heaviness of something that has been awake long enough and is ready, finally, to close.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "Let your jaw go slack. Let your tongue fall away from the roof of your mouth. Let your lips part. There is nothing to say, nothing to chew, nothing to hold in. Just an open, soft mouth, breathing the dark air of your room.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "Soften your throat. That place where you swallow your words, where the lump forms when you are trying not to cry in front of someone, where you hold back the things you are afraid to say — let that place open like a door left ajar in summer, letting the warm air flow through.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Let your shoulders sink into the mattress like stones sinking into deep water — slowly, steadily, until they find the bottom and rest there. They have been carrying so much weight today, your shoulders. The preparation. The worry. The long lists. The names you are still choosing. Set it all down now. Let the bed hold it. The bed is strong. The bed was made for this.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "Let your arms go heavy beside you, your hands opening slightly, your fingers curling the way sleeping children's fingers curl — not gripping anything, just resting, like flowers that have closed for the night.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "Feel your chest rising and falling. Your heart beating underneath, steady and faithful, not asking anything of you, just beating. Your lungs filling and emptying, filling and emptying, like they have done every moment of your life without you ever having to think about it. And now, in the third trimester of pregnancy, they are doing it for two. Thank them silently, the way you would thank someone who has been working all day without complaint.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "And your belly — that great, round, tight, miraculous belly, stretched to its fullest, the skin so thin sometimes you can see it moving when the baby shifts. Do not hold it in. Do not try to make it smaller or tighter or more controlled. Let it be round. Let it be full. Let it be soft. Your baby is in there, sleeping or awake, and they are safe — held by your body, which is held by the bed, which is held by the floor, which is held by the earth, which is held by the quiet dark of night.",
      },
      { type: "pause", pauseSeconds: 16 },
      {
        type: "speak",
        text: "Let your lower back release into the mattress. Let your hips widen a little more — they have been opening, slowly and quietly, for weeks now, preparing for something your body has known how to do for longer than you have been alive. Let your thighs grow heavy, let your calves relax, let your feet turn slightly outward the way feet do in deep sleep. There is nowhere to go. Nothing to stand up for. Nothing to walk toward tonight. Just this bed, this body, this dark.",
      },
      { type: "pause", pauseSeconds: 16 },
      {
        type: "breath",
        breath: "in",
        text: "In — slow, so slow, barely moving.",
      },
      { type: "pause", pauseSeconds: 6 },
      {
        type: "breath",
        breath: "out",
        text: "Out — longer, softer, letting everything go.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "If thoughts come — and they will, drifting in like moths around a lamp — do not fight them and do not follow them. Just let them pass across the dark sky of your mind, the way clouds pass in front of the moon, and know that the sky is still there behind them, vast and still and untroubled. You are the sky. The thoughts are just weather.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "affirmation",
        text: "I release this day. I release this body into the night. The night is long and the night is kind, and I am held.",
      },
      { type: "pause", pauseSeconds: 18 },
      {
        type: "speak",
        text: "If the baby moves, do not be annoyed — be grateful. It is a small hello in the dark. A reminder that you are not alone in this body tonight. Two of you are breathing. Two of you are resting. Two of you are being held by the same warm dark. Let their movement feel like a whisper, not a kick. A little voice saying: I am still here. I am still growing. I am still yours.",
      },
      { type: "pause", pauseSeconds: 16 },
      {
        type: "speak",
        text: "And now — softly, softly — just breathe. In and out, in and out, no more words from me, no more instructions, just the sound of your own breath and the feel of your own body sinking deeper into the bed with every exhale, and the night all around you like warm water, holding you, holding you both.",
      },
      { type: "pause", pauseSeconds: 30 },
      { type: "pause", pauseSeconds: 30 },
      { type: "pause", pauseSeconds: 20 },
    ],
    journalPrompt:
      "If you wake in the night and cannot get back to sleep, do not reach for your phone. Reach for a pen instead. Write down one thought — just one — that is keeping you awake. Get it out of your head and onto paper. Then return to your breath, in and out, and let the night hold you again.",
  },

  // ─── 6. THIRD TRIMESTER — The Sacred Weight ─────────────────────
  {
    id: "the-sacred-weight",
    title: "The Sacred Weight",
    subtitle: "When your body feels impossibly heavy",
    category: "third-trimester",
    durationMinutes: 8,
    intention:
      "For the days when your body aches with the weight of late pregnancy — not a practice to fix the discomfort, but to honor it. To be with it, instead of against it.",
    beats: [
      {
        type: "speak",
        text: "Before we start, I want you to make whatever sound your body wants to make. A sigh. A groan. A long exhale through your mouth. Whatever has been sitting in your chest all day, trapped behind politeness and patience and the endless cheerfulness that people expect from pregnant women — let it out now. No one is listening. Just you, and your body, and whatever it needs to say.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Today we are not going to try to make the discomfort go away. We are going to do something braver and more honest than that. We are going to be with it. Because the aching in your back, the swelling in your feet, the sharp pain in your hips when you stand up after sitting too long, the heaviness that makes you feel like your body belongs to someone else — none of this is your body failing. This is your body serving you at great cost to itself, and it deserves to be acknowledged, not fixed.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "breath",
        breath: "in",
        text: "So breathe in — slow and deep — and bring your attention to the place that hurts the most right now. Really feel it. Do not look away.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "breath",
        breath: "out",
        text: "And breathe out, and instead of trying to relax that place, just say to it — silently, in your own mind — I feel you. Thank you. I know you are doing your best.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Move your attention now to your hips, those widening, loosening joints that have been quietly rearranging themselves for months. If they ache, let them ache. Send your breath there — imagine the inhale flowing like warm honey into the joint, and the exhale carrying away some of the tension, not all of it, just enough to remind your body that someone is paying attention.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Your thighs, heavy and sometimes tingling, have been carrying you through this entire pregnancy — up stairs, through grocery stores, into the bathroom for what feels like the hundredth time tonight. Your feet, swollen and aching, are the roots of the tree that your body has become. And your belly — that tight, stretched, beautiful belly — is the only home your baby has ever known, and it is doing something so extraordinary that we do not even have a word for it in any language.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "Place both hands on your belly now. Feel its fullness, its warmth, the tight skin over all that life. This belly is not a burden. It is a temple. And the ache you feel is not a punishment — it is the price of something holy, and it is a price your body is willing to pay even when you are not.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "affirmation",
        text: "My body is not betraying me. My body is serving me, and I will not be at war with it today. I will hold it the way it holds my baby — gently, patiently, with everything I have.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "Take a few more breaths now, on your own, just resting in that gratitude — not the fake kind that comes from thinking positive thoughts, but the real kind that comes from actually feeling how much your body has done and is still doing. Let the gratitude fill the spaces where the ache has been, the way warm water fills a bath. Not replacing the ache — holding it. The way a warm hand holds a cold one.",
      },
      { type: "pause", pauseSeconds: 15 },
      {
        type: "speak",
        text: "When you are ready, slowly come back to the room. Feel the surface beneath you. Wiggle your fingers and toes. Roll your wrists. And know that your body heard you today, and it will remember.",
      },
      { type: "pause", pauseSeconds: 10 },
    ],
    journalPrompt:
      "Write down one part of your body you have been frustrated with this week. Then, underneath it, write what that part of your body has done for you or your baby. Let the gratitude and the frustration sit side by side. They are both true, and they are both allowed.",
  },

  // ─── 7. BIRTH PREP — The Waves Will Carry You ───────────────────
  {
    id: "the-waves-will-carry-you",
    title: "The Waves Will Carry You",
    subtitle: "Breath, trust, and surrender for labor",
    category: "birth-prep",
    durationMinutes: 10,
    intention:
      "The core practice for late pregnancy and labor itself. Rewrites contractions as waves — building, peaking, and receding — and teaches the long, slow out-breath that opens the body and softens the mind.",
    beats: [
      {
        type: "speak",
        text: "This is the practice you will come back to again and again — in the final weeks of pregnancy when the fear creeps in at night, in early labor when the first waves begin to roll through you, in active labor when the waves are close together and the only thing keeping you anchored is your own breath. So learn it now, while you have the quiet to really feel it. Let your body memorize it the way it memorizes a song — not the words, but the rhythm.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Find a position that feels stable and strong. Standing with your feet wide, your hips swaying in slow circles. Sitting on a birth ball, your pelvis open and free. On your hands and knees, your back broad and your weight grounded. Leaning against the wall, or into your partner's chest, or over the back of a chair. Wherever your body wants to be, let it go there. Your body knows things that your mind does not. Trust that.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "breath",
        breath: "in",
        text: "Breathe in through your nose — slow, low, drawing the air all the way down into the base of your belly, into your pelvis, into the place where your baby is waiting.",
      },
      { type: "pause", pauseSeconds: 6 },
      {
        type: "breath",
        breath: "out",
        text: "And breathe out through your mouth — long, slow, with a sound, any sound. An ahhh, an ohhhh, a low hum, a moan, whatever rises up from your body without thinking. The sound is medicine. The sound opens your throat, and an open throat opens your pelvis, and an open pelvis lets your baby through. So do not be quiet. Do not be polite. Let the sound come.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Now I want to give you something to hold onto — not in your hand, but in your mind, the way you hold a picture behind your eyes. A contraction is not an attack. It is not your body turning against you. It is a wave — a warm, powerful, building wave, the kind you have felt your whole life in your own cycles, in your own rhythms. And like every wave, it has a shape: it gathers, it builds, it peaks, and then — always, always — it breaks, and it falls, and it is gone, and there is a calm space after it where you can rest and breathe and gather yourself before the next one comes.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "Let us practice. Close your eyes and imagine a wave coming toward you — far out at first, just a swelling on the horizon, then growing, rising, the water dark and smooth and alive with power. Feel the tightening begin in your belly — do not fight it, do not tense against it. Just notice: the wave is rising.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "breath",
        breath: "in",
        text: "In — slow, through the nose, breathing into the wave, not against it.",
      },
      { type: "pause", pauseSeconds: 6 },
      {
        type: "breath",
        breath: "out",
        text: "Out — long, through the mouth, with sound — ahhhh — softening, opening, letting your jaw drop and your shoulders go and your pelvis open like a flower.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "speak",
        text: "The wave is building. It is stronger now. This is the peak — the top of the curve, the most intense moment, and it means the wave is about to break. You do not have to do anything except breathe through this one single moment. You do not have to face all the waves at once. You never do. You only ever face this one, right here, right now.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "affirmation",
        text: "I can do anything for one minute. I can do anything for one minute. I can do anything for one minute.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "speak",
        text: "And now the wave is breaking. It is falling. The peak has passed. Breathe out — long, slow, with a sigh of relief — and feel the tightness releasing, feel your body softening, feel the calm rolling back in like the water returning to the shore after the wave has spent itself.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "breath",
        breath: "out",
        text: "Out — all the way. Letting go. Resting.",
      },
      { type: "pause", pauseSeconds: 10 },
      {
        type: "speak",
        text: "That was one wave. In labor, every contraction will be exactly like this — gather, build, peak, break, rest. Gather, build, peak, break, rest. You never have to face more than one at a time. And each one is opening you a little further. Each one is bringing your baby closer to your arms. The waves are not in your way. The waves are the way.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "Your body knows how to do this. Your body has been practicing for this since before you were born, carrying in its cells the memory of every birth that has ever happened in your bloodline, all the way back to the first mother who ever knelt in the dust and breathed her baby into the world. That strength is in your bones. That knowing is in your muscles. You do not have to figure it out. You just have to get out of your own way and let your body do what it already knows.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "affirmation",
        text: "Each wave brings me closer to my baby. My body knows how to do this. I am not alone — every mother who came before me is walking with me through this.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "Say it one more time, with everything you have: Each wave brings me closer to my baby.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "breath",
        breath: "in",
        text: "One more breath. In — gathering your strength.",
      },
      { type: "pause", pauseSeconds: 5 },
      {
        type: "breath",
        breath: "out",
        text: "Out — releasing it all. Aaaaaah. You are ready. You have always been ready.",
      },
      { type: "pause", pauseSeconds: 10 },
    ],
    journalPrompt:
      "Write down one fear you carry about birth, and then write beneath it: Each wave brings me closer to my baby. Read both aloud. Let the fear be heard. Then let the truth be louder.",
  },

  // ─── 8. POSTPARTUM — The Tender Return ───────────────────────────
  {
    id: "the-tender-return",
    title: "The Tender Return",
    subtitle: "For the raw, holy days after birth",
    category: "postpartum",
    durationMinutes: 7,
    intention:
      "For the early postpartum days — when the body is healing, the hormones are wild, the identity is shifting, and the love is so enormous it sometimes feels like grief. A practice of radical self-compassion.",
    beats: [
      {
        type: "speak",
        text: "Wherever you are right now — in bed with a sleeping baby on your chest, in a chair with a bottle warming, on the couch with your shirt pulled up and your eyes burning because you have been awake for what feels like days — just let yourself be there. Do not get up. Do not check your phone. Do not think about what you should be doing instead of this. This is what you should be doing. Being here. Breathing. Existing. Recovering from the most extraordinary thing your body has ever done.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "You just brought a life into the world. Whether the birth was everything you imagined or nothing like what you planned, whether it lasted three hours or three days, whether you pushed or you were cut open or both — you did it. And now you are here, in the strange, overwhelming, terrifying, beautiful aftermath, and everything is different and nothing makes sense and the love you feel for this small creature is so big and so raw that sometimes it lives right next door to grief and you cannot always tell which one you are feeling.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "breath",
        breath: "in",
        text: "So breathe in — just a slow, easy breath, in through your nose, wherever you are — and feel your body, this body that has been through so much in the last few days, this body that is swollen and bleeding and stitched and sore and utterly, completely magnificent.",
      },
      { type: "pause", pauseSeconds: 8 },
      {
        type: "breath",
        breath: "out",
        text: "And breathe out — with a sigh, the real kind, the kind you have been holding back — and let your shoulders drop and your jaw go soft and your eyes close, just for a moment.",
      },
      { type: "pause", pauseSeconds: 12 },
      {
        type: "speak",
        text: "If your body hurts — your stitches, your cramps, your nipples, your back, your head, the places that were stretched and torn and pushed beyond anything you thought they could bear — I want you to send those places a breath. Not to fix them. Just to acknowledge them. To say, silently, in your own body's language: I feel you. I am sorry this is hard. Thank you for what you did.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "And if your heart is heavy — if you are crying and you do not know why, if the sadness feels bottomless and sudden and completely disproportionate to anything that has actually happened, if you are scared of your own mind right now — please hear me, because this is important: what you are feeling is real, and it is not weakness, and it is not postpartum depression unless someone who knows you says it is. What it is, most likely, is the wildest hormonal weather of your life combined with the deepest identity shift a human being can go through, combined with sleep deprivation that would break anyone, combined with the grief of the woman you were before, the one who could go anywhere and do anything and was only responsible for herself.",
      },
      { type: "pause", pauseSeconds: 16 },
      {
        type: "speak",
        text: "You are allowed to miss her, that woman. You are allowed to grieve her. And at the exact same time, you are allowed to love the mother you are becoming — even if she is not the mother you thought you would be, even if she is messier and tireder and more afraid than the one in your imagination. The real one is better. The real one is the one your baby needs.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "affirmation",
        text: "I am allowed to grieve who I was, and love who I am becoming. Both are true. Both are allowed. I am enough — not perfect, but enough.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "If you are struggling to breastfeed, or you have decided to stop, or you never started — you are still a good mother. Your worth is not in your milk. It is in the way your baby looks at you when they are falling asleep on your chest, the way your hand fits perfectly around their entire back, the way your voice is the only voice in the world that makes them feel safe. That is not nothing. That is everything.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "If you have eaten today, or if you have not. If you have showered, or if you have not. If the visitors have been too many, or not enough. If the texts are piling up unanswered and the laundry is multiplying and the thank-you notes have not been written and the birth announcements have not been sent — none of these things determine your worth. You are a mother now, and a mother is not a woman who does everything right. A mother is a woman who keeps showing up. Imperfect. Tired. Sometimes crying. Always loving. That is you. That is enough. That is more than enough.",
      },
      { type: "pause", pauseSeconds: 16 },
      {
        type: "speak",
        text: "If the baby is on your chest right now, feel their weight. Feel their tiny breath against your skin, their small sounds, the warmth of them. They chose you — in whatever way souls choose — to be their mother. And you said yes. You said yes with your whole body, for nine months, and then you said it again when you brought them into the world. And you will keep saying yes, every day, even on the hard ones. Especially on the hard ones.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "affirmation",
        text: "I am doing it. One breath at a time, one hour at a time, one day at a time. I am doing it, and my baby is safe in my arms, and that is everything.",
      },
      { type: "pause", pauseSeconds: 14 },
      {
        type: "speak",
        text: "Take one more breath — the deepest one you have taken all day — in through your nose and out through your mouth with whatever sound needs to come. And when you are ready, softly, gently, open your eyes and return to the room, to the baby, to this beautiful, brutal, sacred new life that you are living.",
      },
      { type: "pause", pauseSeconds: 10 },
    ],
    journalPrompt:
      "Write down one thing you did today as a mother — just one. Fed the baby. Held them while they cried. Looked at them and felt your heart crack open. It does not matter how small. Write it down. Then read it back and say: I did that. I am a mother. And that is everything.",
  },
];

export const MEDITATION_CATEGORIES: Record<
  MeditationCategory,
  { label: string; description: string; accent: string }
> = {
  "first-trimester": {
    label: "First Trimester",
    description: "Gentle support for the tender early weeks.",
    accent: "#C9A0A6",
  },
  "second-trimester": {
    label: "Second Trimester",
    description: "Deepening the bond as your body blooms.",
    accent: "#7A9B7E",
  },
  "third-trimester": {
    label: "Third Trimester",
    description: "Slow, grounding practices for the final stretch.",
    accent: "#B89C7A",
  },
  "birth-prep": {
    label: "Birth Preparation",
    description: "Breath, courage, and surrender for labor.",
    accent: "#8A6B8A",
  },
  postpartum: {
    label: "Postpartum",
    description: "Tender returns — healing, identity, and new love.",
    accent: "#A0A6C9",
  },
};

export const getMeditationById = (id: string): Meditation | undefined =>
  MEDITATIONS.find((m) => m.id === id);

export const getMeditationsByCategory = (
  category: MeditationCategory
): Meditation[] => MEDITATIONS.filter((m) => m.category === category);

export const getFeaturedMeditations = (limit = 3): Meditation[] =>
  MEDITATIONS.slice(0, limit);
