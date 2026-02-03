import {makeScene2D, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const text = createRef<Txt>();
  const warningIcon = createRef<Txt>();
  const tagline = createRef<Txt>();

  view.fill('#0a0a0a');

  view.add(
    <>
      {/* Warning icon */}
      <Txt
        ref={warningIcon}
        fontSize={120}
        fill={'#f44336'}
        y={-150}
        opacity={0}
      >
        ⚠️
      </Txt>

      {/* Main problem statement */}
      <Txt
        ref={text}
        fontSize={68}
        fill={'#ffffff'}
        fontWeight={700}
        textAlign={'center'}
        maxWidth={1600}
        lineHeight={90}
        opacity={0}
        y={50}
      />

      {/* Tagline */}
      <Txt
        ref={tagline}
        fontSize={42}
        fill={'#aaaaaa'}
        y={200}
        opacity={0}
      >
        There's a better way.
      </Txt>
    </>
  );

  // Warning icon appears with pulse
  yield* all(
    warningIcon().opacity(1, 0.3),
    warningIcon().scale(1.2, 0.3),
  );
  yield* warningIcon().scale(1, 0.3);
  yield* waitFor(0.3);

  // Text types in
  yield* all(
    text().opacity(1, 0.5),
    text().text('Tired of AI agents hallucinating\nproject conventions?', 1),
  );

  yield* waitFor(1);

  // Tagline appears
  yield* tagline().opacity(1, 0.5);

  yield* waitFor(1.5);

  // Fade out everything
  yield* all(
    text().opacity(0, 0.5),
    warningIcon().opacity(0, 0.5),
    tagline().opacity(0, 0.5),
  );
});
