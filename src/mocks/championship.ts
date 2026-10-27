import type { Achievement, LeaderboardEntry, LeaderboardScope, LocalizedText, Tournament } from '@/types'

function t(ru: string, kk: string): LocalizedText {
  return { ru, kk }
}

const avatarPalette = ['#45DDB5', '#49354E', '#214B60', '#303D6B', '#294D49', '#E0A458']

function entries(names: { name: string; score: number; institution?: string; team?: string }[]): LeaderboardEntry[] {
  return names.map((entry, index) => ({
    id: `entry-${entry.name}-${index}`,
    rank: index + 1,
    name: entry.name,
    avatarColor: avatarPalette[index % avatarPalette.length],
    score: entry.score,
    institution: entry.institution,
    team: entry.team,
  }))
}

const weekEntries = entries([
  { name: 'Айгерим С.', score: 980 },
  { name: 'Нурлан Т.', score: 940 },
  { name: 'Данияр К.', score: 905 },
  { name: 'Мадина Ж.', score: 870 },
  { name: 'Серик А.', score: 845 },
  { name: 'Алия Б.', score: 810 },
  { name: 'Ернар М.', score: 780 },
  { name: 'Гульнара О.', score: 755 },
])

const monthEntries = entries([
  { name: 'Данияр К.', score: 4200 },
  { name: 'Айгерим С.', score: 3980 },
  { name: 'Жанна Р.', score: 3750 },
  { name: 'Нурлан Т.', score: 3600 },
  { name: 'Арман Е.', score: 3420 },
  { name: 'Мадина Ж.', score: 3300 },
])

const seasonEntries = entries([
  { name: 'Жанна Р.', score: 18400 },
  { name: 'Данияр К.', score: 17650 },
  { name: 'Арман Е.', score: 16900 },
  { name: 'Айгерим С.', score: 16200 },
  { name: 'Нурлан Т.', score: 15800 },
])

const teamEntries = entries([
  { name: 'Команда «Qorgau»', score: 24500, team: 'Qorgau' },
  { name: 'Команда «SafeNet»', score: 22100, team: 'SafeNet' },
  { name: 'Команда «Finwatch»', score: 19800, team: 'Finwatch' },
  { name: 'Команда «Barlau»', score: 17300, team: 'Barlau' },
])

const institutionEntries = entries([
  { name: 'НИШ ФМН Алматы', score: 31200, institution: 'НИШ ФМН Алматы' },
  { name: 'КазНУ им. аль-Фараби', score: 28900, institution: 'КазНУ им. аль-Фараби' },
  { name: 'Школа-лицей №165', score: 24100, institution: 'Школа-лицей №165' },
  { name: 'Satbayev University', score: 22700, institution: 'Satbayev University' },
])

export const leaderboards: Record<LeaderboardScope, LeaderboardEntry[]> = {
  week: weekEntries,
  month: monthEntries,
  season: seasonEntries,
  teams: teamEntries,
  institutions: institutionEntries,
}

export const tournaments: Tournament[] = [
  {
    id: 'tournament-autumn-2026',
    title: t('Осенний кубок финансовой безопасности', 'Қаржылық қауіпсіздіктің күзгі кубогы'),
    description: t(
      'Общенациональный зачёт по результатам игр и тестов Академии.',
      'Академия ойындары мен тесттерінің нәтижесі бойынша жалпыұлттық есеп.',
    ),
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    status: 'active',
  },
  {
    id: 'tournament-schools-cup',
    title: t('Кубок школ Казахстана', 'Қазақстан мектептерінің кубогы'),
    description: t(
      'Соревнование между школами за звание самой финансово грамотной.',
      'Мектептер арасында ең қаржылық сауатты атағы үшін жарыс.',
    ),
    startDate: '2026-11-20',
    endDate: '2026-12-20',
    status: 'upcoming',
  },
  {
    id: 'tournament-summer-2026',
    title: t('Летний чемпионат «Scam or Not»', 'Жазғы «Scam or Not» чемпионаты'),
    description: t(
      'Прошедший сезон соревнований по играм на распознавание мошенничества.',
      'Алаяқтықты тану ойындары бойынша өткен жарыс маусымы.',
    ),
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    status: 'finished',
  },
]

export const achievements: Achievement[] = [
  {
    id: 'ach-first-game',
    title: t('Первая игра', 'Алғашқы ойын'),
    description: t('Завершите любую игру в первый раз.', 'Кез келген ойынды бірінші рет аяқтаңыз.'),
    icon: 'Flame',
  },
  {
    id: 'ach-perfect-score',
    title: t('Безошибочно', 'Қатесіз'),
    description: t('Наберите максимальный балл в игре.', 'Ойында ең жоғары балл жинаңыз.'),
    icon: 'Target',
  },
  {
    id: 'ach-first-course',
    title: t('Первый курс', 'Алғашқы курс'),
    description: t('Завершите первый курс Академии.', 'Академияның алғашқы курсын аяқтаңыз.'),
    icon: 'GraduationCap',
  },
  {
    id: 'ach-all-games',
    title: t('Исследователь схем', 'Схема зерттеушісі'),
    description: t('Сыграйте во все доступные игры.', 'Барлық қолжетімді ойындарды ойнаңыз.'),
    icon: 'Compass',
  },
  {
    id: 'ach-streak',
    title: t('Постоянство', 'Тұрақтылық'),
    description: t('Проходите игры или уроки несколько дней подряд.', 'Бірнеше күн қатарынан ойын немесе сабақ өтіңіз.'),
    icon: 'CalendarCheck',
  },
  {
    id: 'ach-certificate',
    title: t('Сертификат получен', 'Сертификат алынды'),
    description: t('Наберите 80% или больше в итоговом тесте курса.', 'Курстың қорытынды тестінде 80% немесе одан көп балл жинаңыз.'),
    icon: 'Award',
  },
]
