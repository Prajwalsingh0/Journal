import { db } from '@/lib/db';

const SAMPLE_USERS = [
  { email: 'luna@example.com', password: 'demo', name: 'Luna', displayName: 'Luna 🌙', pronouns: 'she/her', bio: 'Just a girl finding her way through life, one journal entry at a time. Mental health advocate and coffee enthusiast.', interests: JSON.stringify(['Writing', 'Self-care', 'Art', 'Journaling', 'Yoga']), isUnder18: false },
  { email: 'maya@example.com', password: 'demo', name: 'Maya', displayName: 'Maya ✨', pronouns: 'she/her', bio: 'College freshman navigating the beautiful chaos of adulthood. Lover of sunsets and deep conversations.', interests: JSON.stringify(['Reading', 'Photography', 'Travel', 'Wellness']), isUnder18: false },
  { email: 'sky@example.com', password: 'demo', name: 'Sky', displayName: 'Sky 🦋', pronouns: 'they/them', bio: 'Art student. Creating is how I make sense of the world. Here to share my journey and connect with kind souls.', interests: JSON.stringify(['Art', 'Music', 'Creativity', 'Film', 'Crafts']), isUnder18: true },
  { email: 'rose@example.com', password: 'demo', name: 'Rose', displayName: 'Rose 🌹', pronouns: 'she/her', bio: 'High school junior with big dreams. Writing helps me process everything. Believer in the power of community.', interests: JSON.stringify(['Writing', 'Reading', 'Activism', 'Nature', 'Dance']), isUnder18: true },
  { email: 'jade@example.com', password: 'demo', name: 'Jade', displayName: 'Jade 💚', pronouns: 'she/her', bio: 'Healing is not linear and that\'s okay. Sharing my journey to remind you that you\'re not alone.', interests: JSON.stringify(['Meditation', 'Yoga', 'Self-care', 'Fitness', 'Journaling']), isUnder18: false },
];

const SAMPLE_ENTRIES = [
  { title: 'Today I chose to be kind to myself', content: 'I woke up feeling anxious about everything I had to do today. The to-do list in my head was overwhelming, and my first instinct was to spiral into stress mode.\n\nBut then I remembered something my therapist told me: "What would you say to a friend in this situation?"\n\nSo I took a deep breath, made myself a cup of tea, and wrote down three things I was grateful for. It sounds so simple, but it genuinely shifted my mindset. I didn\'t finish everything on my list, and that\'s okay. I showed up, I tried my best, and that\'s enough.\n\nTo anyone reading this who\'s also feeling overwhelmed: you\'re doing better than you think. Take it one moment at a time.', mood: 'grateful', tags: JSON.stringify(['selfcare', 'mentalhealth', 'gratitude']), contentWarnings: '[]', fontStyle: 'handwriting', visibility: 'public' },
  { title: 'Letter to my 15-year-old self', content: 'Dear younger me,\n\nI know right now everything feels like the end of the world. That friendship that ended? It wasn\'t your fault. That test you failed? It doesn\'t define you. That person who made you feel small? Their words say more about them than you.\n\nI wish I could hug you and tell you that it gets better. Not perfect — but better. You learn to set boundaries. You find people who celebrate you, not tolerate you. You discover passions you didn\'t even know existed.\n\nYou\'re going to go through some really hard things, and you\'re going to come out stronger. Every tear, every sleepless night, every moment of doubt — it\'s all building the person you\'re becoming.\n\nAnd that person? She\'s kind, she\'s resilient, and she\'s learning to love herself. One day at a time.\n\nWith all the love in the world,\nYour future self', mood: 'nostalgic', tags: JSON.stringify(['reflection', 'selflove', 'growth', 'healing']), contentWarnings: '[]', fontStyle: 'serif', visibility: 'public' },
  { title: 'The art of saying no', content: 'I\'ve spent most of my life being a people-pleaser. Saying "yes" when I wanted to say "no." Agreeing to plans when I desperately needed rest. Putting everyone else\'s needs before my own.\n\nToday, for the first time in a long time, I said no. And the world didn\'t end.\n\nMy friend asked me to help with a project over the weekend, and I said, "I\'d love to, but I need this weekend to recharge. Can I help next week instead?"\n\nShe said, "Of course! Take care of yourself."\n\nThat\'s it. No anger, no disappointment, no abandoned friendship. Just understanding.\n\nI think the fear of saying no is often bigger than the actual consequence. We build up these scenarios in our heads where people will leave us, hate us, or think we\'re selfish. But the people who truly care about you? They want you to take care of yourself.\n\nBoundaries aren\'t walls. They\'re bridges to healthier relationships.', mood: 'proud', tags: JSON.stringify(['growth', 'selfcare', 'relationships', 'mentalhealth']), contentWarnings: '[]', fontStyle: 'sans-serif', visibility: 'public' },
  { title: 'Midnight thoughts: on being enough', content: 'It\'s 2am and I can\'t sleep because my brain decided now is the perfect time to have an existential crisis about whether I\'m "enough."\n\nEnough for my family. Enough for my friends. Enough for my future career. Enough for myself.\n\nIt\'s funny how the quiet of the night amplifies all our insecurities. In the daylight, I know I\'m doing okay. I\'m a good student, a loyal friend, and I\'m working on being kinder to myself. But at 2am, none of that seems to matter.\n\nI\'m writing this here because I know I\'m not the only one who has these thoughts. And I want you — yes, YOU, reading this at whatever hour — to know that you are enough. Right now. As you are. With all your imperfections and doubts and 2am existential crises.\n\nYou don\'t need to earn your worth. You were born worthy.\n\nOkay, putting my phone away now. Tomorrow is a new day.', mood: 'reflective', tags: JSON.stringify(['mentalhealth', 'selflove', 'reflection', 'journaling']), contentWarnings: '[]', fontStyle: 'handwriting', visibility: 'public', isAnonymous: true },
  { title: 'Things I wish someone told me about college', content: 'Three months into college and here\'s what I\'ve learned:\n\n1. Everyone is faking having it together. That girl who seems to have perfect friends, perfect grades, and a perfect Instagram? She cries in the bathroom too.\n\n2. It\'s okay to change your major. I\'ve changed mine twice and I\'m finally excited about my classes.\n\n3. Meal prep is a game changer. Trust me.\n\n4. The friends you make in the first week might not be your friends by month three, and that\'s normal.\n\n5. Call your parents. Even when you\'re busy. Even when you think you don\'t need to.\n\n6. Office hours are not scary. Professors genuinely want to help you.\n\n7. Sleep is not optional. I learned this the hard way during midterms.\n\n8. It\'s okay to miss home. It doesn\'t make you weak.\n\n9. Join at least one club that has nothing to do with your major.\n\n10. You will find your people. It just takes time.', mood: 'hopeful', tags: JSON.stringify(['schoollife', 'growth', 'reflection']), contentWarnings: '[]', fontStyle: 'sans-serif', visibility: 'public' },
  { title: 'My comfort movie saved me today', content: 'After a really tough week, I rewatched my favorite movie for the millionth time. There\'s something so healing about returning to a story that feels like a warm hug.\n\nI know it sounds silly, but sometimes fictional worlds are the safest places to process real emotions. I cried during the same scene I always cry at, and it felt cathartic. Like releasing something I\'d been holding onto all week.\n\nDoes anyone else have a comfort movie/show that they return to when things get hard? I\'d love to know what yours is. There\'s something beautiful about sharing the things that bring us comfort.\n\nRemember: taking care of yourself isn\'t always bubble baths and face masks. Sometimes it\'s crying at a movie and eating cereal for dinner. Both are valid.', mood: 'calm', tags: JSON.stringify(['selfcare', 'mentalhealth', 'creativity', 'relationships']), contentWarnings: '[]', fontStyle: 'sans-serif', visibility: 'public' },
  { title: 'I finally finished my painting', content: 'After weeks of working on it, my painting is finally done! It\'s a self-portrait, but not a realistic one — more like how I feel on the inside. Lots of colors blending together, some chaotic, some peaceful.\n\nArt has always been my way of processing emotions I can\'t put into words. When I\'m painting, I don\'t have to explain anything. The canvas just... understands.\n\nI\'m thinking about sharing it in my next entry. It feels vulnerable to show something so personal, but I think that\'s what this community is about — being real, being seen, being accepted.\n\nTo all the creative souls out there: keep creating. Even when it doesn\'t feel good enough. Especially when it doesn\'t feel good enough. Because art isn\'t about perfection. It\'s about expression.', mood: 'creative', tags: JSON.stringify(['creativity', 'art', 'selflove', 'growth']), contentWarnings: '[]', fontStyle: 'handwriting', visibility: 'public' },
  { title: 'On learning to love my body', content: 'For most of my teenage years, I hated my body. I compared myself to every edited photo, every "ideal" body type, every impossible standard that society pushed on me.\n\nBut recently, something shifted. I can\'t point to one specific moment — it was more like a slow, gradual realization that my body is not an ornament. It\'s an instrument. It carries me through life. It lets me dance in the rain, hug my friends, taste delicious food, and experience this beautiful world.\n\nI\'m not saying I love my body every day. Some days are still hard. But now, on the hard days, I try to speak to myself with compassion instead of criticism.\n\nIf you\'re struggling with body image, please know that your worth is not measured in numbers on a scale or the size of your clothes. You are so much more than your body. You are your kindness, your creativity, your laugh, your dreams, your strength.\n\nYou are enough. Exactly as you are.', mood: 'hopeful', tags: JSON.stringify(['selflove', 'mentalhealth', 'healing']), contentWarnings: JSON.stringify(['Body image']), fontStyle: 'serif', visibility: 'public' },
];

async function seed() {
  console.log('Seeding database...');
  const users: any[] = [];
  for (const u of SAMPLE_USERS) {
    const user = await db.user.create({ data: u });
    users.push(user);
    console.log(`Created user: ${user.displayName}`);
  }

  let dayOffset = 0;
  for (let i = 0; i < SAMPLE_ENTRIES.length; i++) {
    const entryData = SAMPLE_ENTRIES[i];
    const authorIdx = i % users.length;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - dayOffset);
    createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 12));

    const entry = await db.journalEntry.create({
      data: { ...entryData, authorId: users[authorIdx].id, createdAt },
    });

    for (const type of ['heart', 'hug', 'inspiring', 'relatable']) {
      const reactingUsers = users.filter((_, idx) => idx !== authorIdx).slice(0, Math.floor(Math.random() * 3) + 1);
      for (const ru of reactingUsers) {
        await db.reaction.create({ data: { type, authorId: ru.id, entryId: entry.id } });
      }
    }

    const commentAuthors = users.filter((_, idx) => idx !== authorIdx);
    const numComments = Math.floor(Math.random() * 3) + 1;
    const commentTexts = [
      'This resonated with me so much. Thank you for sharing your heart.',
      'You\'re so brave for writing this. Sending you so much love!',
      'I needed to hear this today. You\'re not alone in this.',
      'This is beautiful. Your words have such a healing quality to them.',
      'I\'m saving this to read again on hard days. Thank you for being so real.',
      'You expressed exactly what I\'ve been feeling but couldn\'t put into words.',
    ];
    for (let c = 0; c < numComments; c++) {
      const commentDate = new Date(createdAt);
      commentDate.setHours(commentDate.getHours() + c + 1);
      await db.comment.create({
        data: {
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
          authorId: commentAuthors[c % commentAuthors.length].id,
          entryId: entry.id,
          createdAt: commentDate,
        },
      });
    }
    dayOffset += Math.floor(Math.random() * 2) + 1;
    console.log(`Created entry: "${entry.title}"`);
  }

  await db.follow.createMany({ data: [
    { followerId: users[0].id, followingId: users[1].id },
    { followerId: users[1].id, followingId: users[0].id },
    { followerId: users[0].id, followingId: users[2].id },
    { followerId: users[2].id, followingId: users[0].id },
    { followerId: users[1].id, followingId: users[3].id },
    { followerId: users[3].id, followingId: users[4].id },
    { followerId: users[4].id, followingId: users[0].id },
    { followerId: users[2].id, followingId: users[4].id },
  ]});

  await db.collection.createMany({ data: [
    { name: 'Growth Journey', emoji: '🌱', userId: users[0].id },
    { name: 'Favorite Quotes', emoji: '💬', userId: users[1].id },
    { name: 'Art Diary', emoji: '🎨', userId: users[2].id },
  ]});

  console.log('Seeding complete!');
}

seed().catch(console.error);