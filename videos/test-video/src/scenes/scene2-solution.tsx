import {makeScene2D, Txt, Rect} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const hotTier = createRef<Rect>();
  const warmTier = createRef<Rect>();
  const coldTier = createRef<Rect>();
  const hotLabel = createRef<Txt>();
  const warmLabel = createRef<Txt>();
  const coldLabel = createRef<Txt>();
  const hotDesc = createRef<Txt>();
  const warmDesc = createRef<Txt>();
  const coldDesc = createRef<Txt>();

  view.fill('#0a0a0a');

  const tierWidth = 500;

  view.add(
    <>
      {/* Title */}
      <Txt
        ref={title}
        fontSize={70}
        fill={'#ffffff'}
        fontWeight={700}
        y={-400}
        opacity={0}
      >
        Cortex TMS
      </Txt>

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        fontSize={50}
        fill={'#f97316'}
        y={-320}
        opacity={0}
      >
        Tiered Memory System
      </Txt>

      {/* COLD tier (bottom) - Teal */}
      <Rect
        ref={coldTier}
        width={tierWidth + 250}
        height={130}
        fill={'#0ea5a4'}
        radius={12}
        y={180}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.4)'}
        shadowBlur={20}
      >
        <Txt
          ref={coldLabel}
          fontSize={56}
          fill={'#ffffff'}
          fontWeight={700}
          y={-10}
        >
          COLD
        </Txt>
        <Txt
          ref={coldDesc}
          fontSize={28}
          fill={'rgba(255, 255, 255, 0.9)'}
          y={30}
        >
          Archives, history
        </Txt>
      </Rect>

      {/* WARM tier (middle) - Yellow */}
      <Rect
        ref={warmTier}
        width={tierWidth + 100}
        height={130}
        fill={'#facc15'}
        radius={12}
        y={20}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.4)'}
        shadowBlur={20}
      >
        <Txt
          ref={warmLabel}
          fontSize={56}
          fill={'#111111'}
          fontWeight={700}
          y={-10}
        >
          WARM
        </Txt>
        <Txt
          ref={warmDesc}
          fontSize={28}
          fill={'rgba(0, 0, 0, 0.8)'}
          y={30}
        >
          Recent decisions
        </Txt>
      </Rect>

      {/* HOT tier (top) - Orange */}
      <Rect
        ref={hotTier}
        width={tierWidth}
        height={130}
        fill={'#f97316'}
        radius={12}
        y={-140}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.4)'}
        shadowBlur={20}
      >
        <Txt
          ref={hotLabel}
          fontSize={56}
          fill={'#ffffff'}
          fontWeight={700}
          y={-10}
        >
          HOT
        </Txt>
        <Txt
          ref={hotDesc}
          fontSize={28}
          fill={'rgba(255, 255, 255, 0.9)'}
          y={30}
        >
          Active sprint, patterns
        </Txt>
      </Rect>
    </>
  );

  // Fade in title
  yield* title().opacity(1, 0.5);
  yield* waitFor(0.2);
  yield* subtitle().opacity(1, 0.5);
  yield* waitFor(0.5);

  // Build pyramid bottom to top
  yield* coldTier().opacity(1, 0.5);
  yield* waitFor(0.4);
  yield* warmTier().opacity(1, 0.5);
  yield* waitFor(0.4);
  yield* hotTier().opacity(1, 0.5);

  yield* waitFor(1);

  // Emphasize HOT tier with glow
  yield* all(
    hotTier().scale(1.08, 0.3),
    hotTier().shadowBlur(40, 0.3),
  );
  yield* all(
    hotTier().scale(1.0, 0.3),
    hotTier().shadowBlur(20, 0.3),
  );

  yield* waitFor(2);

  // Fade out
  yield* all(
    title().opacity(0, 0.5),
    subtitle().opacity(0, 0.5),
    hotTier().opacity(0, 0.5),
    warmTier().opacity(0, 0.5),
    coldTier().opacity(0, 0.5),
  );
});
