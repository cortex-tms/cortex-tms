import {makeScene2D, Txt, Rect} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const commandBox = createRef<Rect>();
  const command = createRef<Txt>();
  const website = createRef<Txt>();
  const tagline = createRef<Txt>();

  view.fill('#0a0a0a');

  view.add(
    <>
      {/* Title */}
      <Txt
        ref={title}
        fontSize={72}
        fill={'#ffffff'}
        fontWeight={700}
        y={-220}
        opacity={0}
      >
        Install now:
      </Txt>

      {/* Command box */}
      <Rect
        ref={commandBox}
        width={1300}
        height={160}
        fill={'#1a1a1a'}
        radius={12}
        y={0}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.5)'}
        shadowBlur={30}
        shadowOffsetY={10}
      >
        <Txt
          ref={command}
          fontSize={52}
          fill={'#0ea5a4'}
          fontFamily={'monospace'}
          fontWeight={700}
        >
          npm install -g cortex-tms
        </Txt>
      </Rect>

      {/* Website */}
      <Txt
        ref={website}
        fontSize={64}
        fill={'#f97316'}
        fontWeight={600}
        y={220}
        opacity={0}
      >
        cortex-tms.org
      </Txt>

      {/* Tagline */}
      <Txt
        ref={tagline}
        fontSize={38}
        fill={'#aaaaaa'}
        y={310}
        opacity={0}
      >
        Tiered Memory for AI Agents
      </Txt>
    </>
  );

  // Fade in title
  yield* title().opacity(1, 0.5);
  yield* waitFor(0.4);

  // Show command box
  commandBox().scale(0.95);
  yield* all(
    commandBox().opacity(1, 0.5),
    commandBox().scale(1, 0.5),
  );
  yield* waitFor(0.5);

  // Pulse command box
  yield* all(
    commandBox().scale(1.05, 0.3),
    commandBox().shadowBlur(40, 0.3),
  );
  yield* all(
    commandBox().scale(1.0, 0.3),
    commandBox().shadowBlur(30, 0.3),
  );

  yield* waitFor(0.5);

  // Show website
  yield* website().opacity(1, 0.5);
  yield* waitFor(0.3);

  // Show tagline
  yield* tagline().opacity(1, 0.5);

  yield* waitFor(2.5);

  // Fade out
  yield* all(
    title().opacity(0, 0.5),
    commandBox().opacity(0, 0.5),
    website().opacity(0, 0.5),
    tagline().opacity(0, 0.5),
  );
});
