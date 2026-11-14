// Learn: the tricks used in fake messages (short lessons), then a 5-question quiz.
// The lessons and questions come from our server; with no internet, the same lessons bundled in the
// app (src/constants/learn-content.json, exported from server/verifye_server/content.py) are shown.

import { useEffect, useState } from 'react';

import { Button, Card, Label, Screen, Section, Status } from '@/components/ui';
import { t } from '@/constants/strings';
import { getOnline, type Lesson, type QuizQuestion } from '@/lib/online';
import { useStore } from '@/lib/store';

type LearnContent = { lessons: Lesson[]; quiz: QuizQuestion[] };
const bundled: Record<string, LearnContent> = require('@/constants/learn-content.json');

export default function LearnScreen() {
  const { serverUrl, language } = useStore();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  // Quiz progress: which question, the option picked for it (null = not answered yet), and the score.
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getOnline<Lesson[]>(serverUrl, `/learn/tactics?lang=${language}`), getOnline<QuizQuestion[]>(serverUrl, `/learn/quiz?lang=${language}`)]).then(
      ([newLessons, newQuiz]) => {
        if (cancelled) return;
        // Offline (or server down): use the lessons bundled in the app, so this tab always works.
        const offline = newLessons === null || newQuiz === null;
        const local = bundled[language] ?? bundled.en;
        setLessons(offline ? local.lessons : newLessons);
        setQuiz(offline ? local.quiz : newQuiz);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [serverUrl, language]);

  if (lessons === null || quiz === null) {
    return (
      <Screen>
        <Label>{t('onlineLoading')}</Label>
      </Screen>
    );
  }

  const question = quiz[index];
  const finished = index >= quiz.length;

  function pick(option: number) {
    if (picked !== null) return; // one answer per question
    setPicked(option);
    if (option === question.answer) setScore(score + 1);
  }

  function next() {
    setPicked(null);
    setIndex(index + 1);
  }

  function restart() {
    setPicked(null);
    setScore(0);
    setIndex(0);
  }

  return (
    <Screen>
      <Section title={t('quizTitle')}>
        {finished ? (
          <Card>
            <Status>
              {t('quizScore')}: {score}/{quiz.length}
            </Status>
            <Button kind="secondary" title={t('quizAgain')} onPress={restart} />
          </Card>
        ) : (
          <Card>
            <Label variant="small">
              {index + 1}/{quiz.length}
            </Label>
            <Label>{question.message}</Label>
            <Label variant="label">{question.question}</Label>
            {question.options.map((option, i) => (
              <Button
                key={option}
                kind={picked !== null && i === question.answer ? 'primary' : 'secondary'}
                title={option}
                onPress={() => pick(i)}
              />
            ))}
            {picked !== null && (
              <>
                <Status>{picked === question.answer ? t('quizRight') : t('quizWrong')}</Status>
                <Label>{question.explanation}</Label>
                <Button title={t('quizNext')} onPress={next} />
              </>
            )}
          </Card>
        )}
      </Section>

      <Section title={t('learnTricksTitle')}>
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <Label variant="label">{lesson.label}</Label>
            <Label>{lesson.lesson}</Label>
            <Label variant="small">{lesson.safe_action}</Label>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
