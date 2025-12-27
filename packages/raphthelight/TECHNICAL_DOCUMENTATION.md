# Lagom Swedish Learning App - Technical Documentation

## Overview
A comprehensive Swedish language learning application built with Next.js 15, implementing the "Lagom Method" - balancing formal grammar with street Swedish (Gatusvenska). The app focuses on SFI (Swedish for Immigrants) standards and includes AI-driven roleplay, spaced repetition flashcards, and pronunciation training.

---

## 1. User Journey Map (Onboarding to B1 Level)

### Phase 1: Onboarding (5 minutes)
```
Landing Page → Name Input → Level Assessment → Goal Selection → Daily Commitment → Dashboard
```

**Steps:**
1. **Landing Page**: User sees value proposition and key features
2. **Name Input**: Personalization begins
3. **Level Assessment**: 
   - Absolute Beginner (no knowledge)
   - A1 (basic phrases)
   - A2 (simple conversations)
   - B1 (handle most situations)
4. **Goal Selection**:
   - Moving to Sweden
   - Work/Study
   - Family/Partner
   - Personal Interest
5. **Daily Commitment**: Slider from 10-60 minutes (default: 15)
6. **Dashboard**: Personalized learning hub

### Phase 2: Learning Path (A1 → B1)

**A1 Level (Beginner) - Weeks 1-8**
- Lesson 1: Hej! (Greetings & Introductions)
- Lesson 2: Fika Culture (Ordering at café)
- Lesson 3: En vs Ett Mastery (Noun genders)
- Lesson 4: V2 Word Order (Sentence structure)
- Lesson 5: Å, Ä, Ö Challenge (Vowel pronunciation)
- Lessons 6-15: Daily routines, numbers, time, family, shopping

**A2 Level (Elementary) - Weeks 9-20**
- Past tense verbs
- Future tense
- Complex sentences
- Workplace vocabulary
- Housing and living
- Healthcare basics

**B1 Level (Intermediate) - Weeks 21-40**
- Subjunctive mood
- Advanced V2 patterns
- Idiomatic expressions
- Gatusvenska (street Swedish)
- Cultural deep dives
- Professional communication

### Phase 3: Daily Practice Loop
```
Dashboard → Choose Activity → Complete → Earn XP → Update Streak → Dashboard
```

**Activity Options:**
- SFI Lesson (structured curriculum)
- AI Roleplay (contextual practice)
- Flashcards (SRS vocabulary)
- Pronunciation (phonetic training)

---

## 2. Module Breakdown - First 5 Essential Lessons

### Lesson 1: Hej! (Hello!)
**Duration:** 15 minutes  
**Learning Objectives:**
- Master basic greetings (Hej, God morgon, Tack)
- Introduce yourself (Jag heter...)
- Understand Jantelagen (cultural modesty)
- Introduction to En vs Ett

**Content Sections:**
1. **Intro**: Welcome and context
2. **Vocabulary**: 5 essential greetings with pronunciation
3. **Culture**: Jantelagen explanation
4. **Grammar**: En vs Ett basics (4 examples)
5. **Dialogue**: Meeting someone for first time
6. **Quiz**: 3 questions to reinforce learning

**Key Vocabulary:**
- Hej (hey) - Hello/Hi
- Hej hej (hey hey) - Bye
- God morgon (goo MOR-on) - Good morning
- Tack (tack) - Thanks
- Tack så mycket (tack so MYK-et) - Thanks so much

---

### Lesson 2: Fika Culture
**Duration:** 20 minutes  
**Learning Objectives:**
- Order coffee and pastries
- Understand fika as social institution
- Learn food vocabulary
- Practice En vs Ett with food words

**Content Sections:**
1. **Intro**: What is fika?
2. **Vocabulary**: Café vocabulary (kaffe, kanelbulle, smörgås)
3. **Dialogue**: Full ordering conversation at konditori
4. **Culture**: Fika at work (scheduled breaks)
5. **Grammar**: En vs Ett patterns in food words

**Key Phrases:**
- Kan jag få... (Can I have...)
- Vad får det lov att vara? (What can I get you?)
- Det är bra (That's good)

---

### Lesson 3: En vs Ett Mastery
**Duration:** 25 minutes  
**Learning Objectives:**
- Understand Swedish noun gender system
- Learn patterns for predicting gender
- Practice with 50 common nouns
- Master definite forms (bilen, huset)

**Content Structure:**
1. **Theory**: Why Swedish has two genders
2. **Statistics**: 75% en-words, 25% ett-words
3. **Patterns**:
   - Living things → usually EN
   - Abstract concepts → usually EN
   - Diminutives (-a endings) → usually EN
   - Collective nouns → usually ETT
4. **Practice**: Categorization exercises
5. **Exceptions**: Common irregular words

**Memory Tricks:**
- Always learn nouns WITH article (en bil, not just bil)
- Color-code: EN = green, ETT = purple
- Flashcard deck specifically for gender practice

---

### Lesson 4: V2 Word Order
**Duration:** 20 minutes  
**Learning Objectives:**
- Understand V2 rule (verb always second position)
- Form questions correctly
- Use time expressions properly
- Avoid English word order mistakes

**Core Concept:**
In Swedish, the verb MUST be in the second position of the sentence.

**Examples:**
- Jag äter frukost. (I eat breakfast) - Subject-Verb
- Idag äter jag frukost. (Today eat I breakfast) - Time-Verb-Subject
- Frukost äter jag inte. (Breakfast eat I not) - Object-Verb-Subject

**Common Mistakes:**
- ❌ Jag idag äter frukost (English order)
- ✅ Idag äter jag frukost (V2 order)

**Practice Exercises:**
- Sentence reordering
- Translation with V2 focus
- Question formation

---

### Lesson 5: Å, Ä, Ö Challenge
**Duration:** 20 minutes  
**Learning Objectives:**
- Pronounce Å (like "oh" in boat)
- Pronounce Ä (like "e" in bed, but wider)
- Pronounce Ö (no English equivalent - "ee" with rounded lips)
- Distinguish minimal pairs (bor/bör, far/får)

**Pronunciation Guide:**

**Å [oː]:**
- Round lips like saying "oh"
- Examples: år (year), båt (boat), gå (go)

**Ä [ɛː]:**
- Open mouth wider than English "e"
- Examples: äta (eat), läsa (read), väder (weather)

**Ö [øː]:**
- Say "ee" but round your lips
- Examples: öl (beer), öra (ear), möta (meet)

**Practice Method:**
1. Listen to native audio
2. Repeat 5 times
3. Record yourself
4. Compare
5. Adjust and repeat

---

## 3. Data Schema Suggestions

### User Profile Schema
```typescript
interface UserProfile {
  id: string;
  name: string;
  email?: string;
  level: 'absolute-beginner' | 'a1' | 'a2' | 'b1';
  goal: 'moving' | 'work' | 'family' | 'interest';
  dailyMinutes: number; // 10-60
  streak: number; // consecutive days
  totalXP: number;
  createdAt: Date;
  lastActive: Date;
}
```

### Lesson Progress Schema
```typescript
interface LessonProgress {
  userId: string;
  lessonId: string;
  status: 'locked' | 'in-progress' | 'completed';
  completedAt?: Date;
  quizScore?: number; // 0-100
  timeSpent: number; // seconds
  attempts: number;
}
```

### Flashcard Progress Schema (SM-2 Algorithm)
```typescript
interface FlashcardProgress {
  userId: string;
  cardId: string; // e.g., "verb-vara"
  lastReviewed: Date;
  nextReview: Date;
  interval: number; // days until next review
  easeFactor: number; // 1.3 - 2.5+
  repetitions: number; // successful reviews in a row
  lapses: number; // times marked "again"
}
```

### Vocabulary Database Schema
```typescript
interface VocabularyItem {
  id: string;
  swedish: string;
  english: string;
  type: 'noun' | 'verb' | 'adjective' | 'phrase';
  gender?: 'en' | 'ett'; // for nouns
  pronunciation: string; // IPA or simplified
  example: string; // Swedish sentence
  exampleTranslation: string;
  difficulty: 'a1' | 'a2' | 'b1' | 'b2';
  frequency: number; // 1-1000 (most common)
  tags: string[]; // ['food', 'fika', 'essential']
}
```

### Roleplay Session Schema
```typescript
interface RoleplaySession {
  userId: string;
  scenarioId: string;
  startedAt: Date;
  completedAt?: Date;
  messages: Array<{
    role: 'user' | 'ai';
    text: string;
    translation?: string;
    timestamp: Date;
  }>;
  feedback?: {
    grammarErrors: number;
    vocabularyUsed: string[];
    suggestions: string[];
  };
}
```

### Cultural Insight Schema
```typescript
interface CulturalInsight {
  id: string;
  title: string; // e.g., "Jantelagen"
  category: 'social-norms' | 'traditions' | 'workplace' | 'daily-life';
  description: string;
  examples: string[];
  dosDonts: {
    dos: string[];
    donts: string[];
  };
  relatedLessons: string[]; // lesson IDs
}
```

---

## 4. Sample Dialogue Script (AI Tutor ↔ Student)

### Scenario: First Day at SFI Class

**Context:** Student is nervous about their first Swedish class. AI tutor provides encouragement and practical phrases.

---

**AI Tutor:**  
Hej! Välkommen till din första svenska lektion! 🇸🇪  
(Hi! Welcome to your first Swedish lesson!)

Jag heter Lagom-AI. Vad heter du?  
(My name is Lagom-AI. What's your name?)

---

**Student:**  
Jag heter Maria.  
(My name is Maria.)

---

**AI Tutor:**  
Perfekt, Maria! Bra jobbat! 👏  
(Perfect, Maria! Well done!)

You just used your first Swedish sentence! Notice the structure:  
**Jag heter** [name] = "I am called [name]"

This is more common than "Jag är Maria" (I am Maria) when introducing yourself.

Ska vi öva lite mer? (Should we practice a bit more?)

---

**Student:**  
Ja, tack!  
(Yes, thanks!)

---

**AI Tutor:**  
Utmärkt! (Excellent!)

Let's practice a common situation: meeting your SFI classmates.

**Scenario:** You walk into class and see another student.

Try saying: "Hej! Jag heter Maria. Vad heter du?"

---

**Student:**  
Hej! Jag heter Maria. Vad heter du?  
(Hi! My name is Maria. What's your name?)

---

**AI Tutor:**  
Fantastiskt! 🎉 (Fantastic!)

Now I'll respond as your classmate:

"Hej Maria! Jag heter Ahmed. Trevligt att träffas!"  
(Hi Maria! My name is Ahmed. Nice to meet you!)

**New phrase:** Trevligt att träffas = Nice to meet you  
(Literally: "Pleasant to meet")

How would you respond? Try saying it back!

---

**Student:**  
Trevligt att träffas!  
(Nice to meet you!)

---

**AI Tutor:**  
Perfekt! 👍

**Cultural Tip:** 🇸🇪  
In Sweden, people often shake hands when meeting for the first time, but it's becoming less common after COVID. A smile and "Hej!" is always safe!

Also, Swedes value **lagom** - not too formal, not too casual. "Hej" works in almost every situation!

Now, let's learn how to ask "Where are you from?"

**Var kommer du ifrån?** (Where do you come from?)

Try asking me!

---

**Student:**  
Var kommer du ifrån?  
(Where are you from?)

---

**AI Tutor:**  
Bra fråga! (Good question!)

Jag kommer från Sverige, förstås! 😄  
(I come from Sweden, of course!)

Now you try answering. The pattern is:  
**Jag kommer från** [country]

For example:
- Jag kommer från Spanien (Spain)
- Jag kommer från Syrien (Syria)
- Jag kommer från Polen (Poland)

Where are you from, Maria?

---

**Student:**  
Jag kommer från Spanien.  
(I come from Spain.)

---

**AI Tutor:**  
Underbart! (Wonderful!)

**Grammar Note:** 📝  
Notice we say "från Spanien" not "från *det* Spanien"  
Country names don't use articles in Swedish!

Let's practice one more essential phrase:  
**Jag förstår inte** = I don't understand

This is SUPER important! Swedes appreciate when you're honest about not understanding. They'll happily repeat or explain.

Try saying: "Ursäkta, jag förstår inte. Kan du upprepa?"  
(Excuse me, I don't understand. Can you repeat?)

---

**Student:**  
Ursäkta, jag förstår inte. Kan du upprepa?  
(Excuse me, I don't understand. Can you repeat?)

---

**AI Tutor:**  
Jättebra! (Very good!)

**Breakdown:**
- **Ursäkta** = Excuse me (polite attention-getter)
- **Jag förstår inte** = I don't understand
- **Kan du upprepa?** = Can you repeat?

**Pro Tip:** 💡  
You can also say "Kan du prata långsammare?" (Can you speak slower?)  
Swedes are very patient with learners!

---

**Summary of Today's Lesson:**

✅ Jag heter [name] - My name is...  
✅ Vad heter du? - What's your name?  
✅ Trevligt att träffas - Nice to meet you  
✅ Var kommer du ifrån? - Where are you from?  
✅ Jag kommer från [country] - I come from...  
✅ Jag förstår inte - I don't understand  

**Homework:** 📚  
Practice introducing yourself to 3 people this week using these phrases!

**Cultural Reminder:** 🇸🇪  
Remember Jantelagen - Swedes value modesty. Don't brag, but don't be too self-deprecating either. Just be... **lagom**! 😊

Hej då, Maria! (Goodbye, Maria!)  
Vi ses nästa gång! (See you next time!)

---

## 5. Technical Implementation Notes

### Frontend Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **State Management:** React useState/useEffect + localStorage
- **Deployment:** Cloudflare Pages (via OpenNext)

### Key Features Implementation

**1. Spaced Repetition System (SRS)**
- Algorithm: SM-2 (SuperMemo 2)
- Storage: localStorage (can migrate to database)
- Review intervals: 1, 6, 10+ days based on performance

**2. AI Roleplay (Future Enhancement)**
- Current: Simulated responses
- Future: OpenAI GPT-4 integration
- Features: Grammar correction, vocabulary suggestions, cultural tips

**3. Pronunciation Training**
- Current: Text-based with IPA notation
- Future: Web Speech API for recording
- Future: Audio files for native pronunciation

**4. Progress Tracking**
- Streak counter (consecutive days)
- XP system (gamification)
- Lesson completion percentage
- Vocabulary mastery levels

### Performance Optimizations
- Static generation for lesson content
- Client-side routing for instant navigation
- localStorage for offline capability
- Lazy loading for audio/video content

### Accessibility
- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast mode compatible

---

## 6. Future Enhancements

### Phase 2 Features
- [ ] User authentication (email/social login)
- [ ] Cloud sync for progress
- [ ] Native audio pronunciation
- [ ] Speech recognition for practice
- [ ] Community features (study groups)
- [ ] Leaderboards and achievements

### Phase 3 Features
- [ ] Live video tutoring
- [ ] Swedish TV/podcast integration
- [ ] Grammar checker API
- [ ] Mobile app (React Native)
- [ ] Offline mode with service workers

---

## 7. Content Roadmap

### Vocabulary Database
- 1,000 most common Swedish verbs (Priority 1)
- 2,000 most common nouns with gender (Priority 2)
- 500 essential phrases (Priority 3)
- Gatusvenska slang dictionary (Priority 4)

### Lesson Library
- 50 SFI-aligned lessons (A1-B1)
- 20 cultural deep-dives
- 30 roleplay scenarios
- 15 pronunciation modules

### Assessment System
- Placement test (determine starting level)
- End-of-module quizzes
- Mock SFI exam (B1 level)
- Speaking assessment (AI-powered)

---

## 8. Deployment & Maintenance

### Current Setup
- **Hosting:** Cloudflare Pages
- **Build:** OpenNext for Cloudflare compatibility
- **Domain:** TBD
- **Analytics:** TBD (recommend Plausible or Fathom)

### Monitoring
- Error tracking (Sentry recommended)
- Performance monitoring (Cloudflare Analytics)
- User feedback system (in-app surveys)

### Content Updates
- Weekly vocabulary additions
- Monthly new lessons
- Quarterly cultural content refresh
- Annual curriculum review

---

## Conclusion

This app implements a comprehensive Swedish learning system following the "Lagom Method" - balanced, practical, and culturally aware. The technical foundation supports scalability, and the content structure aligns with official SFI standards while incorporating modern language learning best practices (SRS, AI roleplay, pronunciation focus).

**Next Steps:**
1. User testing with real Swedish learners
2. Content expansion (more lessons and vocabulary)
3. AI integration for dynamic conversations
4. Audio recording for pronunciation
5. Community features for peer learning

**Lycka till!** (Good luck!) 🇸🇪

