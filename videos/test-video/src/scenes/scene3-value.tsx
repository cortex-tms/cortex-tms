import {makeScene2D, Txt, Layout, Rect} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const benefit1Box = createRef<Rect>();
  const benefit2Box = createRef<Rect>();
  const benefit3Box = createRef<Rect>();

  view.fill('#0a0a0a');

  view.add(
    <>
      <Txt
        ref={title}
        fontSize={64}
        fill={'#ffffff'}
        fontWeight={700}
        textAlign={'center'}
        lineHeight={80}
        y={-300}
        opacity={0}
      >
        Your AI reads only what matters.
      </Txt>

      {/* Benefit 1: Faster */}
      <Rect
        ref={benefit1Box}
        width={1300}
        height={140}
        fill={'#1a1a1a'}
        radius={12}
        y={-80}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.3)'}
        shadowBlur={15}
      >
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#f97316'}>⚡</Txt>
          <Txt fontSize={72} fill={'#f97316'} fontWeight={700}>
            Faster
          </Txt>
          <Txt fontSize={70} fill={'#20b2aa'}>✓</Txt>
        </Layout>
      </Rect>

      {/* Benefit 2: Cheaper */}
      <Rect
        ref={benefit2Box}
        width={1300}
        height={140}
        fill={'#1a1a1a'}
        radius={12}
        y={100}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.3)'}
        shadowBlur={15}
      >
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#facc15'}>💰</Txt>
          <Txt fontSize={72} fill={'#facc15'} fontWeight={700}>
            Cheaper
          </Txt>
          <Txt fontSize={70} fill={'#20b2aa'}>✓</Txt>
        </Layout>
      </Rect>

      {/* Benefit 3: No drift */}
      <Rect
        ref={benefit3Box}
        width={1300}
        height={140}
        fill={'#1a1a1a'}
        radius={12}
        y={280}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.3)'}
        shadowBlur={15}
      >
        <Layout layout direction={'row'} gap={40} alignItems={'center'}>
          <Txt fontSize={90} fill={'#0ea5a4'}>🎯</Txt>
          <Txt fontSize={72} fill={'#0ea5a4'} fontWeight={700}>
            No drift
          </Txt>
          <Txt fontSize={70} fill={'#20b2aa'}>✓</Txt>
        </Layout>
      </Rect>
    </>
  );

  // Fade in title
  yield* title().opacity(1, 0.5);
  yield* waitFor(0.5);

  // Show benefits one by one with scale
  benefit1Box().scale(0.9);
  yield* all(
    benefit1Box().opacity(1, 0.3),
    benefit1Box().scale(1, 0.3),
  );
  yield* waitFor(1.2);

  benefit2Box().scale(0.9);
  yield* all(
    benefit2Box().opacity(1, 0.3),
    benefit2Box().scale(1, 0.3),
  );
  yield* waitFor(1.2);

  benefit3Box().scale(0.9);
  yield* all(
    benefit3Box().opacity(1, 0.3),
    benefit3Box().scale(1, 0.3),
  );
  yield* waitFor(2);

  // Fade out
  yield* all(
    title().opacity(0, 0.5),
    benefit1Box().opacity(0, 0.5),
    benefit2Box().opacity(0, 0.5),
    benefit3Box().opacity(0, 0.5),
  );
});
